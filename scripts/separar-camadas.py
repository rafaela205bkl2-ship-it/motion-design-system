"""
Separa uma arte estática (cartaz) em camadas para animar em profundidade.

Uso:
    python3 scripts/separar-camadas.py producoes/<slug>/arte/camadas.json

Por quê: um cartaz chega "achatado" (um JPG só). Para animá-lo como na ref-003
(título que entra em 3D, pessoas em planos, informações que nascem em sequência),
cada elemento precisa de uma camada própria. Sem modelos de recorte disponíveis,
os contornos das pessoas são traçados à mão no JSON e o resto é separado por cor.

Lê o JSON (coordenadas da arte original) e gera em `saida`:
    fundo.png             lona inteira (ex.: 1080×1920) sem pessoas, título e textos,
                          com a arte estendida por reflexo acima e abaixo
    pessoas-tras.png      grupo inteiro; a área da fileira da frente vira sombra escura
    pessoas-frente.png    só a fileira da frente
    titulo-<n>.png        cada letra do título (traços escuros extraídos por cor;
                          partes cobertas pelas cabeças são prolongadas)
    faixa-<nome>.png      cada faixa de texto claro sobre fundo escuro (alfa por luminância)
    camadas.json          posições na lona (px) para a produção ler

Requer: Python 3 com numpy e Pillow.
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cfg_path = os.path.abspath(sys.argv[1])
cfg = json.load(open(cfg_path))
art = np.array(Image.open(os.path.join(ROOT, cfg["arte"])).convert("RGB")).astype(np.float32)
H, W = art.shape[:2]
out = os.path.join(ROOT, cfg["saida"])
os.makedirs(out, exist_ok=True)
lona = cfg["lona"]
DY = lona["deslocamentoY"]


def box_blur(a, r):
    """Desfoque de caixa separável (soma acumulada), bordas por reflexo."""
    if r < 1:
        return a
    for axis in (0, 1):
        pad = [(0, 0)] * a.ndim
        pad[axis] = (r + 1, r)
        p = np.pad(a, pad, mode="reflect")
        c = np.cumsum(p, axis=axis)
        n = a.shape[axis]
        hi = np.take(c, np.arange(2 * r + 1, 2 * r + 1 + n), axis=axis)
        lo = np.take(c, np.arange(0, n), axis=axis)
        a = (hi - lo) / (2 * r + 1)
    return a


def gauss(a, r):
    """Aproximação de gaussiana: três desfoques de caixa."""
    for _ in range(3):
        a = box_blur(a, r)
    return a


def poly_mask(pts, feather=1.5, scale=4):
    """Máscara 0–1 de um polígono, com antisserrilhado e borda suave."""
    im = Image.new("L", (W * scale, H * scale), 0)
    ImageDraw.Draw(im).polygon([(x * scale, y * scale) for x, y in pts], fill=255)
    im = im.resize((W, H), Image.LANCZOS)
    if feather:
        im = im.filter(ImageFilter.GaussianBlur(feather))
    return np.array(im).astype(np.float32) / 255


def inpaint(img, hole, scales=(2, 4, 8, 16, 32, 64)):
    """Preenche `hole` (0–1) com médias normalizadas em escalas crescentes."""
    known = 1 - hole
    res = img * known[..., None]
    filled = known.copy()
    for r in scales:
        num = gauss(img * known[..., None], r)
        den = gauss(known, r)[..., None]
        est = num / np.maximum(den, 1e-4)
        take = (1 - filled)[..., None] * np.clip(den * 3, 0, 1)
        res = res + est * take
        filled = np.clip(filled + take[..., 0], 0, 1)
    return res


def save_rgba(name, rgb, a, crop=None):
    rgba = np.dstack([np.clip(rgb, 0, 255), np.clip(a * 255, 0, 255)]).astype(np.uint8)
    if crop:
        x0, y0, x1, y1 = crop
        rgba = rgba[y0:y1, x0:x1]
    Image.fromarray(rgba, "RGBA").save(os.path.join(out, name), optimize=True)


manifest = {"lona": {"largura": lona["largura"], "altura": lona["altura"]}, "deslocamentoY": DY}

# ------------------------------------------------------------------ pessoas
p = cfg["pessoas"]
grupo = poly_mask(p["grupo"])
frente = poly_mask(p["frente"])
ys = np.arange(H, dtype=np.float32)[:, None]
fade = np.clip((p["esmaecerAte"] - ys) / (p["esmaecerAte"] - p["esmaecerDe"]), 0, 1)
fade = fade * fade * (3 - 2 * fade)
grupo_a = grupo * fade
frente_a = np.minimum(frente, grupo) * fade

# Atrás: a fileira da frente vira uma sombra (aparece como profundidade quando a frente se desloca).
sombra = gauss(art, 6) * 0.42
tras_rgb = art * (1 - frente[..., None]) + sombra * frente[..., None]
bb = [0, max(0, int(min(y for _, y in p["grupo"])) - 4), W, int(p["esmaecerAte"]) + 2]
save_rgba("pessoas-tras.png", tras_rgb, grupo_a, bb)
bf = [0, max(0, int(min(y for _, y in p["frente"])) - 4), W, int(p["esmaecerAte"]) + 2]
save_rgba("pessoas-frente.png", art, frente_a, bf)
manifest["pessoas"] = {
    "tras": {"x": bb[0], "y": bb[1] + DY, "w": bb[2] - bb[0], "h": bb[3] - bb[1]},
    "frente": {"x": bf[0], "y": bf[1] + DY, "w": bf[2] - bf[0], "h": bf[3] - bf[1]},
}

# ------------------------------------------------------------------ título
t = cfg["titulo"]
x0, y0, x1, y1 = t["caixa"]
reg = art[y0:y1, x0:x1]
R, G, B = reg[..., 0], reg[..., 1], reg[..., 2]
# Traços: marrom escuro e saturado (≈ 117, 61, 31). Fundo: claro ou marrom médio.
a = np.clip((104 - G) / 30, 0, 1) * np.clip((R - G - 28) / 14, 0, 1)
ai = Image.fromarray((a * 255).astype(np.uint8))
ai = ai.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))  # tira pontos de retícula
a = np.array(ai).astype(np.float32) / 255
for ix0, iy0, ix1, iy1 in t.get("ignorar", []):  # manchas de retícula que passaram no filtro
    a[max(iy0 - y0, 0):iy1 - y0, max(ix0 - x0, 0):ix1 - x0] = 0
cover = np.array(Image.fromarray(((grupo[y0:y1, x0:x1] > 0.02) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))) > 0
# Prolonga para baixo as hastes cobertas pelas cabeças, até a base das letras.
base = t["baseLetras"] - y0
for cx in range(a.shape[1]):
    col = cover[:, cx]
    if not col[:base].any():
        a[base:, cx] = 0
        continue
    first = int(np.argmax(col))
    src = a[max(first - 9, 0):max(first - 2, 1), cx].max()
    a[first:base, cx] = 1.0 if src > 0.5 else 0.0
    a[base:, cx] = 0
cor = np.array([117, 61, 31], np.float32)
rgb = np.broadcast_to(cor, reg.shape).copy()
# Letras: colunas separadas por vãos sem tinta.
cols = a.max(axis=0) > 0.35
segs, s = [], None
for i, c in enumerate(list(cols) + [False]):
    if c and s is None:
        s = i
    if not c and s is not None:
        segs.append([s, i])
        s = None
merged = []
for sg in segs:  # junta vãos estreitos (traços duplos da mesma letra)
    if merged and sg[0] - merged[-1][1] <= 6:
        merged[-1][1] = sg[1]
    else:
        merged.append(sg)
merged = [m for m in merged if m[1] - m[0] >= 8]
letras = []
for i, (a0, a1) in enumerate(merged):
    sub = a[:, a0:a1]
    rows = np.where(sub.max(axis=1) > 0.05)[0]
    r0, r1 = int(rows[0]), int(rows[-1]) + 1
    save_rgba(f"titulo-{i + 1}.png", rgb[r0:r1, a0:a1], sub[r0:r1])
    letras.append({"arquivo": f"titulo-{i + 1}.png", "x": x0 + a0, "y": y0 + r0 + DY, "w": a1 - a0, "h": r1 - r0})
manifest["titulo"] = letras
title_mask = np.zeros((H, W), np.float32)
title_mask[y0:y1, x0:x1] = np.array(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(7))) / 255

# ------------------------------------------------------------------ faixas de texto
L = art @ np.array([0.299, 0.587, 0.114], np.float32)
text_mask = np.zeros((H, W), np.float32)
faixas = {}
for nome, (fx0, fy0, fx1, fy1) in cfg["faixas"].items():
    lum = L[fy0:fy1, fx0:fx1]
    fa = np.clip((lum - 62) / 110, 0, 1)
    save_rgba(f"faixa-{nome}.png", art[fy0:fy1, fx0:fx1] * 1.08, fa)
    faixas[nome] = {"arquivo": f"faixa-{nome}.png", "x": fx0, "y": fy0 + DY, "w": fx1 - fx0, "h": fy1 - fy0}
    text_mask[fy0 - 3:fy1 + 3, fx0 - 6:fx1 + 6] = 1
manifest["faixas"] = faixas

# ------------------------------------------------------------------ fundo
hole = np.maximum.reduce([np.clip(grupo * 1.3, 0, 1) * (ys < p["esmaecerAte"] + 6), title_mask, text_mask])
hole = np.clip(gauss(hole, 1) * 1.6, 0, 1)
bg = inpaint(art, hole)
# Devolve textura: ruído fino para a área preenchida não parecer lisa.
rng = np.random.default_rng(7)
bg = bg + (rng.normal(0, 5, (H, W, 1)) * hole[..., None])
cut = lona["cortarAbaixoDe"]
bg = bg[:cut]
CW, CH = lona["largura"], lona["altura"]
canvas = np.zeros((CH, CW, 3), np.float32)
canvas[DY:DY + cut] = bg[:, :CW]
top = bg[1:DY + 1][::-1]  # reflexo acima
canvas[:DY] = top[-DY:] if top.shape[0] >= DY else np.pad(top, ((DY - top.shape[0], 0), (0, 0), (0, 0)), mode="edge")
below = CH - (DY + cut)
# Abaixo: degradê da cor média da base da arte até um tom mais escuro (o reflexo repetiria manchas).
base_col = bg[-60:].reshape(-1, 3).mean(axis=0)
k = np.linspace(0, 1, below, dtype=np.float32)[:, None, None]
canvas[DY + cut:] = base_col * (1 - 0.45 * k)
# Áreas estendidas: o reflexo vai se desfocando com a distância da emenda (sem costura visível).
soft = gauss(canvas, 14)
yy = np.arange(CH, dtype=np.float32)[:, None, None]
w_top = np.clip((DY - yy) / 120, 0, 1)
w_bot = np.clip((yy - (DY + cut)) / 120, 0, 1)
w = np.maximum(w_top, w_bot)
canvas = canvas * (1 - w) + soft * w
canvas = canvas + rng.normal(0, 4, (CH, CW, 1)) * w
Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8)).save(os.path.join(out, "fundo.png"), optimize=True)
manifest["fundo"] = {"arquivo": "fundo.png"}

with open(os.path.join(out, "camadas.json"), "w") as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)
print(f"{len(letras)} letras, {len(faixas)} faixas → {os.path.relpath(out, ROOT)}")
