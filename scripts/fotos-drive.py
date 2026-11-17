"""
Acesso eficiente a fotografias numa pasta do Google Drive (somente leitura).

Fluxo — nada é baixado inteiro até ser selecionado:

  1. inventario   lista a pasta (e subpastas) e lê só o CABEÇALHO de cada imagem
                  (requisição parcial de 64 KB) para obter formato, dimensões,
                  orientação EXIF, data de captura e tamanho total.
  2. miniaturas   baixa as prévias geradas pelo próprio Drive (~320 px).
  3. folhas       monta folhas de contato numeradas (F001, F002…) para revisão.
  4. baixar       baixa os ORIGINAIS apenas dos códigos listados em selecao.json,
                  byte a byte (sem recompressão), e confere tamanho + SHA-256.

Uso:
  npm run fotos -- inventario <id-da-pasta> --slug <produção>
  npm run fotos -- miniaturas --slug <produção>
  npm run fotos -- folhas --slug <produção> [--por-folha 30] [--colunas 6]
  npm run fotos -- storyboard --slug <produção>   (prévia da seleção por trecho)
  npm run fotos -- baixar --slug <produção>

Saídas:
  producoes/<slug>/fotos/inventario.json   versionado (metadados, sem imagens)
  producoes/<slug>/fotos/selecao.json      versionado (você/IA escreve: códigos escolhidos)
  .cache/fotos/<slug>/miniaturas/          NÃO versionado
  .cache/fotos/<slug>/folhas/              NÃO versionado (folhas de contato)
  public/producoes/<slug>/imagens/fotos/   NÃO versionado (originais selecionados)

Requisitos: curl, Python 3 + Pillow (para as folhas). A pasta precisa estar
compartilhada como "qualquer pessoa com o link" e o ambiente precisa alcançar
drive.google.com, drive.usercontent.google.com e lh3.googleusercontent.com.
Os arquivos do Drive nunca são alterados: só há requisições de leitura (GET).
"""
import argparse
import datetime as dt
import hashlib
import html
import json
import os
import re
import struct
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_EXT = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".tif", ".tiff", ".gif", ".bmp"}


def paths(slug):
    return {
        "dados": os.path.join(ROOT, "producoes", slug, "fotos"),
        "cache": os.path.join(ROOT, ".cache", "fotos", slug),
        "originais": os.path.join(ROOT, "public", "producoes", slug, "imagens", "fotos"),
    }


def curl(url, out=None, rng=None, timeout=60):
    """GET via curl (usa o proxy/CA do ambiente). Retorna (bytes|None, cabeçalhos)."""
    cmd = ["curl", "-sS", "-L", "--max-time", str(timeout), "-D", "-", "--retry", "3", "--retry-delay", "2"]
    if rng:
        cmd += ["-r", rng]
    cmd += ["-o", out if out else "-", url] if out else [url]
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.decode(errors="ignore").strip()[:200])
    raw = r.stdout
    if out:
        return None, raw.decode(errors="ignore")
    # separa cabeçalhos (último bloco antes do corpo) do corpo
    sep = raw.rfind(b"\r\n\r\nHTTP/")
    start = raw.find(b"\r\n\r\n", sep + 4 if sep >= 0 else 0)
    headers, body = raw[: start].decode(errors="ignore"), raw[start + 4:]
    return body, headers


# ------------------------------------------------------------------ listagem
def listar_pasta(folder_id, caminho=""):
    """Lista via embeddedfolderview (pasta pública). Recursivo em subpastas."""
    body, _ = curl(f"https://drive.google.com/embeddedfolderview?id={folder_id}")
    page = body.decode("utf-8", errors="ignore")
    itens = []
    for m in re.finditer(r'<div class="flip-entry" id="entry-([\w-]+)".*?<a href="([^"]+)".*?class="flip-entry-title">([^<]*)<', page, re.S):
        fid, href, nome = m.group(1), m.group(2), html.unescape(m.group(3)).strip()
        if "/folders/" in href:
            itens += listar_pasta(fid, f"{caminho}{nome}/")
        else:
            itens.append({"id": fid, "nome": nome, "pasta": caminho})
    return itens


# ------------------------------------------------------------------ cabeçalhos de imagem
def _exif(app1):
    """Extrai orientação e DateTimeOriginal de um bloco APP1/EXIF."""
    out = {}
    if not app1.startswith(b"Exif\x00\x00"):
        return out
    t = app1[6:]
    if len(t) < 8:
        return out
    le = t[:2] == b"II"
    u16 = lambda b, o: struct.unpack(("<" if le else ">") + "H", b[o:o + 2])[0]
    u32 = lambda b, o: struct.unpack(("<" if le else ">") + "I", b[o:o + 4])[0]

    def ifd(off):
        tags = {}
        try:
            n = u16(t, off)
            for i in range(n):
                e = off + 2 + i * 12
                tag, typ, cnt = u16(t, e), u16(t, e + 2), u32(t, e + 4)
                val = e + 8
                if typ == 3 and cnt == 1:
                    tags[tag] = u16(t, val)
                elif typ == 4 and cnt == 1:
                    tags[tag] = u32(t, val)
                elif typ == 2:
                    p = u32(t, val) if cnt > 4 else val
                    tags[tag] = t[p:p + cnt].rstrip(b"\x00").decode(errors="ignore")
        except (struct.error, IndexError):
            pass
        return tags

    i0 = ifd(u32(t, 4))
    if 0x0112 in i0:
        out["orientacao_exif"] = i0[0x0112]
    if 0x8769 in i0:
        sub = ifd(i0[0x8769])
        if 0x9003 in sub:
            out["capturada_em"] = sub[0x9003]
    if "capturada_em" not in out and 0x0132 in i0:
        out["capturada_em"] = i0[0x0132]
    return out


def ler_cabecalho(b):
    """Formato, largura e altura a partir dos primeiros bytes."""
    if b[:2] == b"\xff\xd8":
        info, i = {"formato": "jpeg"}, 2
        while i < len(b) - 9:
            if b[i] != 0xFF:
                i += 1
                continue
            marker = b[i + 1]
            if marker in (0xD8, 0x01) or 0xD0 <= marker <= 0xD7:
                i += 2
                continue
            seg = struct.unpack(">H", b[i + 2:i + 4])[0]
            if marker == 0xE1:
                info.update(_exif(b[i + 4:i + 2 + seg]))
            if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                h, w = struct.unpack(">HH", b[i + 5:i + 9])
                info.update(largura=w, altura=h)
                return info
            i += 2 + seg
        return info
    if b[:8] == b"\x89PNG\r\n\x1a\n":
        w, h = struct.unpack(">II", b[16:24])
        return {"formato": "png", "largura": w, "altura": h}
    if b[:4] == b"RIFF" and b[8:12] == b"WEBP":
        if b[12:16] == b"VP8X":
            w = int.from_bytes(b[24:27], "little") + 1
            h = int.from_bytes(b[27:30], "little") + 1
        elif b[12:16] == b"VP8 ":
            w, h = struct.unpack("<HH", b[26:30])
            w, h = w & 0x3FFF, h & 0x3FFF
        else:
            bits = int.from_bytes(b[21:25], "little")
            w, h = (bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1
        return {"formato": "webp", "largura": w, "altura": h}
    if b[4:12] in (b"ftypheic", b"ftypheix", b"ftypmif1", b"ftyphevc"):
        return {"formato": "heic"}
    return {"formato": "desconhecido"}


def inspecionar(item):
    url = f"https://drive.usercontent.google.com/download?id={item['id']}&export=download"
    r = dict(item)
    try:
        body, hdr = curl(url, rng="0-65535")
        m = re.findall(r"content-range:\s*bytes \d+-\d+/(\d+)", hdr, re.I)
        if m:
            r["bytes"] = int(m[-1])
        info = ler_cabecalho(body)
        if info.get("formato") == "jpeg" and "largura" not in info:  # EXIF grande: tenta 512 KB
            body, _ = curl(url, rng="0-524287")
            info = ler_cabecalho(body)
        r.update(info)
        if "largura" in r:
            w, h = r["largura"], r["altura"]
            if r.get("orientacao_exif") in (5, 6, 7, 8):  # rotacionada 90°: exibição troca os eixos
                w, h = h, w
            r["exibicao"] = {"largura": w, "altura": h}
            r["orientacao"] = "retrato" if h > w * 1.05 else "paisagem" if w > h * 1.05 else "quadrada"
            r["megapixels"] = round(w * h / 1e6, 1)
    except Exception as e:  # noqa: BLE001
        r["erro"] = str(e)[:160]
    return r


# ------------------------------------------------------------------ comandos
def cmd_inventario(a):
    p = paths(a.slug)
    os.makedirs(p["dados"], exist_ok=True)
    itens = listar_pasta(a.pasta)
    imagens = [i for i in itens if os.path.splitext(i["nome"])[1].lower() in IMG_EXT]
    outros = [i for i in itens if i not in imagens]
    with ThreadPoolExecutor(8) as ex:
        dados = list(ex.map(inspecionar, imagens))
    # ordena por data de captura (quando houver) e depois por nome; atribui códigos estáveis
    dados.sort(key=lambda d: (d.get("capturada_em") or "9999", d["pasta"], d["nome"]))
    for n, d in enumerate(dados, 1):
        d["codigo"] = f"F{n:03d}"
    inv = {
        "pasta_drive": a.pasta,
        "gerado_em": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "total_itens": len(itens),
        "imagens": dados,
        "outros_arquivos": outros,
    }
    json.dump(inv, open(os.path.join(p["dados"], "inventario.json"), "w"), indent=1, ensure_ascii=False)
    resumo(inv)


def resumo(inv):
    im = inv["imagens"]
    fmt, ori = {}, {}
    for d in im:
        fmt[d.get("formato", "?")] = fmt.get(d.get("formato", "?"), 0) + 1
        ori[d.get("orientacao", "?")] = ori.get(d.get("orientacao", "?"), 0) + 1
    mp = sorted(d["megapixels"] for d in im if "megapixels" in d)
    tot = sum(d.get("bytes", 0) for d in im)
    datas = sorted(d["capturada_em"] for d in im if d.get("capturada_em"))
    dims = {}
    for d in im:
        if "exibicao" in d:
            k = f'{d["exibicao"]["largura"]}x{d["exibicao"]["altura"]}'
            dims[k] = dims.get(k, 0) + 1
    print(f"Itens na pasta: {inv['total_itens']} · imagens: {len(im)} · outros: {len(inv['outros_arquivos'])}")
    print(f"Formatos: {fmt}")
    print(f"Orientação (como exibida): {ori}")
    if mp:
        print(f"Resolução: {mp[0]}–{mp[-1]} MP (mediana {mp[len(mp)//2]} MP)")
    print("Dimensões mais comuns: " + ", ".join(f"{k} ({v})" for k, v in sorted(dims.items(), key=lambda x: -x[1])[:6]))
    print(f"Tamanho total dos originais: {tot/1e6:.1f} MB (nada foi baixado inteiro)")
    print(f"Com data de captura (EXIF): {len(datas)}" + (f" · de {datas[0]} a {datas[-1]}" if datas else ""))
    erros = [d for d in im if "erro" in d or "largura" not in d]
    if erros:
        print(f"Sem dimensões lidas: {len(erros)} → " + ", ".join(d["codigo"] for d in erros[:20]))


def carregar(slug):
    f = os.path.join(paths(slug)["dados"], "inventario.json")
    if not os.path.exists(f):
        sys.exit(f"Rode primeiro: npm run fotos -- inventario <id-da-pasta> --slug {slug}")
    return json.load(open(f))


def cmd_miniaturas(a):
    p = paths(a.slug)
    d = os.path.join(p["cache"], "miniaturas")
    os.makedirs(d, exist_ok=True)
    inv = carregar(a.slug)

    def baixa(it):
        out = os.path.join(d, f"{it['codigo']}.jpg")
        if os.path.exists(out) and os.path.getsize(out) > 1000:
            return 0
        curl(f"https://drive.google.com/thumbnail?id={it['id']}&sz=w{a.tamanho}", out=out)
        return os.path.getsize(out)

    with ThreadPoolExecutor(8) as ex:
        tamanhos = list(ex.map(baixa, inv["imagens"]))
    print(f"Miniaturas em .cache/fotos/{a.slug}/miniaturas/ · {len(inv['imagens'])} arquivos · {sum(tamanhos)/1e6:.1f} MB baixados agora")


def cmd_folhas(a):
    from PIL import Image, ImageDraw, ImageFont, ImageOps

    p = paths(a.slug)
    mini = os.path.join(p["cache"], "miniaturas")
    out = os.path.join(p["cache"], "folhas")
    os.makedirs(out, exist_ok=True)
    inv = carregar(a.slug)
    im = inv["imagens"]
    cell, pad, lab = a.celula, 6, 22
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 15)
    except OSError:
        font = ImageFont.load_default()
    folhas = []
    for f0 in range(0, len(im), a.por_folha):
        grupo = im[f0:f0 + a.por_folha]
        rows = (len(grupo) + a.colunas - 1) // a.colunas
        sheet = Image.new("RGB", (a.colunas * (cell + pad) + pad, rows * (cell + lab + pad) + pad), (24, 24, 28))
        dr = ImageDraw.Draw(sheet)
        for k, it in enumerate(grupo):
            x = pad + (k % a.colunas) * (cell + pad)
            y = pad + (k // a.colunas) * (cell + lab + pad)
            src = os.path.join(mini, f"{it['codigo']}.jpg")
            if os.path.exists(src):
                t = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
                t.thumbnail((cell, cell))
                sheet.paste(t, (x + (cell - t.width) // 2, y + (cell - t.height) // 2))
            ori = {"retrato": "R", "paisagem": "P", "quadrada": "Q"}.get(it.get("orientacao"), "?")
            dr.text((x + 2, y + cell + 3), f"{it['codigo']} {ori} {it.get('megapixels', '?')}MP", fill=(255, 220, 90), font=font)
        nome = os.path.join(out, f"folha-{len(folhas)+1:02d}.jpg")
        sheet.save(nome, quality=82)
        folhas.append(nome)
    print(f"{len(folhas)} folhas de contato em .cache/fotos/{a.slug}/folhas/ ({a.por_folha} fotos por folha, R=retrato P=paisagem Q=quadrada)")
    for f in folhas:
        print("  " + os.path.relpath(f, ROOT))


def cmd_storyboard(a):
    """Prévia da seleção agrupada por trecho (usa só miniaturas)."""
    from PIL import Image, ImageDraw, ImageFont, ImageOps

    p = paths(a.slug)
    sel = json.load(open(os.path.join(p["dados"], "selecao.json")))
    mini = os.path.join(p["cache"], "miniaturas")
    try:
        fb = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
        fs = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13)
    except OSError:
        fb = fs = ImageFont.load_default()
    grupos = {}
    for f in sel["fotos"]:
        grupos.setdefault(f.get("trecho", "sem trecho"), []).append(f)
    cell, pad, head, cols = 150, 5, 30, 10
    linhas = sum((len(v) + cols - 1) // cols for v in grupos.values())
    W = cols * (cell + pad) + pad
    H = len(grupos) * head + linhas * (cell + 20 + pad) + pad
    sheet = Image.new("RGB", (W, H), (20, 20, 24))
    dr = ImageDraw.Draw(sheet)
    y = pad
    for trecho, fotos in grupos.items():
        dr.text((pad, y + 5), f"{trecho} ({len(fotos)})", fill=(255, 255, 255), font=fb)
        y += head
        for k, f in enumerate(fotos):
            x = pad + (k % cols) * (cell + pad)
            if k and k % cols == 0:
                y += cell + 20 + pad
            src = os.path.join(mini, f"{f['codigo']}.jpg")
            if os.path.exists(src):
                t = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
                t.thumbnail((cell, cell))
                sheet.paste(t, (x + (cell - t.width) // 2, y + (cell - t.height) // 2))
            cor = (255, 140, 90) if "pequena" in f.get("uso", "") else (255, 220, 90)
            dr.text((x + 2, y + cell + 3), f"{f['codigo']} {f.get('uso', '')[:14]}", fill=cor, font=fs)
        y += cell + 20 + pad
    out = os.path.join(p["cache"], "folhas", "storyboard-selecao.jpg")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    sheet.save(out, quality=85)
    print(f"Prévia da seleção: {os.path.relpath(out, ROOT)} · {len(sel['fotos'])} fotos em {len(grupos)} trechos")


def cmd_baixar(a):
    p = paths(a.slug)
    inv = carregar(a.slug)
    sel_f = os.path.join(p["dados"], "selecao.json")
    if not os.path.exists(sel_f):
        sys.exit(f"Crie {os.path.relpath(sel_f, ROOT)} com a lista de códigos escolhidos (ver PRODUCTION_WORKFLOW.md).")
    sel = json.load(open(sel_f))
    codigos = [s["codigo"] if isinstance(s, dict) else s for s in sel["fotos"]]
    if a.codigos:  # baixa só um subconjunto da seleção
        pedidos = [c.strip() for c in a.codigos.split(",") if c.strip()]
        fora = [c for c in pedidos if c not in codigos]
        if fora:
            sys.exit(f"Fora da seleção: {fora}. Adicione-os a selecao.json antes de baixar.")
        codigos = pedidos
    por_codigo = {d["codigo"]: d for d in inv["imagens"]}
    faltando = [c for c in codigos if c not in por_codigo]
    if faltando:
        sys.exit(f"Códigos inexistentes no inventário: {faltando}")
    os.makedirs(p["originais"], exist_ok=True)

    def baixa(c):
        it = por_codigo[c]
        ext = os.path.splitext(it["nome"])[1].lower() or ".jpg"
        out = os.path.join(p["originais"], f"{c}{ext}")
        if not (os.path.exists(out) and os.path.getsize(out) == it.get("bytes")):
            curl(f"https://drive.usercontent.google.com/download?id={it['id']}&export=download&confirm=t", out=out, timeout=300)
        tam = os.path.getsize(out)
        ok = tam == it.get("bytes")
        sha = hashlib.sha256(open(out, "rb").read()).hexdigest()
        return {"codigo": c, "arquivo": os.path.relpath(out, ROOT), "bytes": tam, "confere_tamanho": ok, "sha256": sha}

    with ThreadPoolExecutor(4) as ex:
        res = list(ex.map(baixa, codigos))
    reg = os.path.join(p["dados"], "originais-baixados.json")
    antigos = {r["codigo"]: r for r in json.load(open(reg))} if os.path.exists(reg) else {}
    antigos.update({r["codigo"]: r for r in res})
    json.dump(sorted(antigos.values(), key=lambda r: r["codigo"]), open(reg, "w"), indent=1)
    ruins = [r["codigo"] for r in res if not r["confere_tamanho"]]
    print(f"{len(res)} originais em {os.path.relpath(p['originais'], ROOT)}/ · {sum(r['bytes'] for r in res)/1e6:.1f} MB · "
          + ("todos conferem com o tamanho do Drive" if not ruins else f"ATENÇÃO, tamanho diferente: {ruins}"))


ap = argparse.ArgumentParser(description="Fotografias do Google Drive: inventário, prévias e download seletivo.")
sub = ap.add_subparsers(dest="cmd", required=True)
s = sub.add_parser("inventario")
s.add_argument("pasta")
s.add_argument("--slug", required=True)
s = sub.add_parser("miniaturas")
s.add_argument("--slug", required=True)
s.add_argument("--tamanho", type=int, default=320)
s = sub.add_parser("folhas")
s.add_argument("--slug", required=True)
s.add_argument("--por-folha", type=int, default=30)
s.add_argument("--colunas", type=int, default=6)
s.add_argument("--celula", type=int, default=210)
s = sub.add_parser("storyboard")
s.add_argument("--slug", required=True)
s = sub.add_parser("baixar")
s.add_argument("--slug", required=True)
s.add_argument("--codigos", help="subconjunto da seleção, ex.: F003,F031")
a = ap.parse_args()
{"inventario": cmd_inventario, "miniaturas": cmd_miniaturas, "folhas": cmd_folhas, "storyboard": cmd_storyboard, "baixar": cmd_baixar}[a.cmd](a)
