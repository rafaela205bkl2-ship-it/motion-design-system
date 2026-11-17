"""
Analisa um vídeo de referência e cadastra na reference-library.

Uso:
    npm run analisar-referencia -- <video> --id ref-003-descricao-curta [--crop L:A:X:Y] [--sem-copia]

    --crop       recorta a área da peça (ex.: tela filmada) antes de medir: largura:altura:x:y
    --sem-copia  não copia o vídeo original para reference-library/<id>/original/

Gera em reference-library/<id>/:
    original/<arquivo>        cópia do vídeo (salvo --sem-copia)
    analise/tecnico.json      ffprobe: contêiner, codecs, resolução, fps, áudio
    analise/resumo.json       métricas: cortes, eventos visuais, ritmo, BPM, loudness, sincronia
    analise/folha-contato.png quadros a 2 fps com tempo
    analise/curvas.png        mudança visual, brilho/saturação, áudio e ataques (requer matplotlib)
    analise/espectrograma.png espectro do áudio
    ficha.md                  ficha a preencher (só é criada se não existir)

Requer: ffmpeg/ffprobe, Python 3 com numpy (matplotlib opcional).
As métricas são automáticas: confirme cada observação olhando os quadros antes de
transformá-la em padrão (ver reference-library/README.md).
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIB = os.path.join(ROOT, "reference-library")

ap = argparse.ArgumentParser()
ap.add_argument("video")
ap.add_argument("--id", required=True)
ap.add_argument("--crop")
ap.add_argument("--sem-copia", action="store_true")
a = ap.parse_args()

if not re.fullmatch(r"ref-\d{3}-[a-z0-9-]+", a.id):
    sys.exit("O id deve seguir o padrão ref-NNN-descricao (minúsculas, números e hífens), ex.: ref-003-tutorial-calmo-9x16")
src = os.path.abspath(a.video)
if not os.path.exists(src):
    sys.exit(f"Vídeo não encontrado: {src}")

out_dir = os.path.join(LIB, a.id)
an = os.path.join(out_dir, "analise")
os.makedirs(an, exist_ok=True)


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, capture_output=True, **kw)


# ------------------------------------------------------------ técnico
probe = json.loads(run(["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", src]).stdout)
v = next(s for s in probe["streams"] if s["codec_type"] == "video")
au = next((s for s in probe["streams"] if s["codec_type"] == "audio"), None)
num, den = map(int, v["avg_frame_rate"].split("/"))
fps = num / den if den else 30.0
dur = float(probe["format"]["duration"])
tecnico = {
    "arquivo": os.path.basename(src),
    "conteiner": probe["format"]["format_name"],
    "duracao_s": round(dur, 3),
    "tamanho_bytes": int(probe["format"]["size"]),
    "video": {"codec": v["codec_name"], "perfil": v.get("profile"), "largura": v["width"], "altura": v["height"],
              "fps": round(fps, 3), "pix_fmt": v.get("pix_fmt"), "bitrate": v.get("bit_rate")},
    "audio": None if not au else {"codec": au["codec_name"], "perfil": au.get("profile"),
                                  "taxa": au.get("sample_rate"), "canais": au.get("channels"), "bitrate": au.get("bit_rate")},
}
decode = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-f", "null", "-"], capture_output=True, text=True)
tecnico["decodificacao_ok"] = decode.returncode == 0 and not decode.stderr.strip()
json.dump(tecnico, open(os.path.join(an, "tecnico.json"), "w"), indent=2, ensure_ascii=False)

if not a.sem_copia:
    od = os.path.join(out_dir, "original")
    os.makedirs(od, exist_ok=True)
    dst = os.path.join(od, os.path.basename(src))
    if not os.path.exists(dst):
        shutil.copy2(src, dst)

crop = f"crop={a.crop}," if a.crop else ""
W, H = 180, int(round(180 * (int(a.crop.split(':')[1]) / int(a.crop.split(':')[0]) if a.crop else v["height"] / v["width"]) / 2) * 2)

# ------------------------------------------------------------ folha de contato
cols = 10
rows = max(1, int(np.ceil(dur * 2 / cols)))
run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vf",
     f"{crop}fps=2,scale={W}:-2,drawtext=text='%{{pts\\:hms}}':x=4:y=4:fontsize=13:fontcolor=yellow:box=1:boxcolor=black@0.6,tile={cols}x{rows}:padding=2",
     "-frames:v", "1", os.path.join(an, "folha-contato.png")])

# ------------------------------------------------------------ séries por quadro
tmp = tempfile.mkdtemp()
try:
    gw, gh = 144, int(round(144 * H / W / 2) * 2)
    run(["ffmpeg", "-v", "error", "-i", src, "-vf", f"{crop}scale={gw}:{gh},format=gray", "-f", "rawvideo", os.path.join(tmp, "g.raw")])
    g = np.fromfile(os.path.join(tmp, "g.raw"), np.uint8).reshape(-1, gh, gw).astype(np.float32)
    diff = np.concatenate([[0], np.abs(np.diff(g, axis=0)).mean(axis=(1, 2))])
    run(["ffmpeg", "-v", "error", "-i", src, "-vf", f"{crop}signalstats,metadata=print:file={os.path.join(tmp, 's.txt')}", "-an", "-f", "null", "-"])
    yavg, sat = [], []
    for line in open(os.path.join(tmp, "s.txt")):
        if "signalstats.YAVG=" in line:
            yavg.append(float(line.split("=")[1]))
        elif "signalstats.SATAVG=" in line:
            sat.append(float(line.split("=")[1]))
    has_audio = au is not None
    if has_audio:
        sr = 22050
        run(["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", str(sr), "-f", "f32le", os.path.join(tmp, "a.raw")])
        y = np.fromfile(os.path.join(tmp, "a.raw"), np.float32)
except subprocess.CalledProcessError as e:
    shutil.rmtree(tmp, ignore_errors=True)
    sys.exit(f"Falha no ffmpeg: {e.stderr.decode(errors='ignore')[-400:]}")


def peaks(x, thr, gap):
    idx = []
    for i in range(1, len(x) - 1):
        if x[i] >= thr and x[i] >= x[i - 1] and x[i] >= x[i + 1]:
            if idx and i - idx[-1] < gap:
                if x[i] > x[idx[-1]]:
                    idx[-1] = i
                continue
            idx.append(i)
    return np.array(idx, dtype=int)


base = float(np.median(diff))
eventos = peaks(diff, max(8, 4 * base), int(0.2 * fps)) / fps
cortes = peaks(diff, max(40, 10 * base), int(0.2 * fps)) / fps
resumo = {
    "aviso": "Métricas automáticas — confirme nos quadros antes de usar como padrão.",
    "duracao_s": round(dur, 2),
    "mudancas_bruscas_s": [round(float(t), 2) for t in cortes],
    "mudancas_bruscas_nota": "Inclui cortes secos E transições muito rápidas (≤ 5 quadros, ex.: radiais). Confirme nos quadros.",
    "eventos_visuais_s": [round(float(t), 2) for t in eventos],
    "intervalo_mediano_eventos_s": round(float(np.median(np.diff(eventos))), 2) if len(eventos) > 1 else None,
    "brilho_medio": round(float(np.mean(yavg)), 1) if yavg else None,
    "saturacao_media": round(float(np.mean(sat)), 1) if sat else None,
    "saturacao_desvio": round(float(np.std(sat)), 1) if sat else None,
}

if has_audio:
    hop, win = 256, 1024
    w = np.hanning(win)
    spec = np.array([np.abs(np.fft.rfft(y[i:i + win] * w)) for i in range(0, len(y) - win, hop)])
    S = np.log1p(spec)
    flux = np.concatenate([[0], np.maximum(0, np.diff(S, axis=0)).sum(1)])
    tf = np.arange(len(flux)) * hop / sr
    freqs = np.fft.rfftfreq(win, 1 / sr)
    low = spec[:, freqs < 150].sum(1)
    low /= low.max() + 1e-9
    bi = peaks(low, 0.18, int(0.25 * sr / hop))
    beats = tf[bi]
    ibi = np.diff(beats)
    if len(ibi) > 3:
        med = float(np.median(ibi))
        resumo["bpm_estimado"] = round(60 / med, 1)
        q1, q3 = np.percentile(ibi, [25, 75])
        resumo["bpm_confianca"] = "alta" if (q3 - q1) / med < 0.25 else "baixa"
        if len(eventos):
            d = np.array([np.min(np.abs(beats - t)) for t in eventos])
            rnd = np.random.default_rng(0).uniform(beats[0], beats[-1], 3000)
            dr = np.array([np.min(np.abs(beats - t)) for t in rnd])
            resumo["sincronia"] = {
                "eventos_a_100ms_da_batida_pct": round(float(np.mean(d <= 0.1) * 100)),
                "aleatorio_pct": round(float(np.mean(dr <= 0.1) * 100)),
                "leitura": "sincronizado" if np.mean(d <= 0.1) > np.mean(dr <= 0.1) + 0.2 else "sem sincronia sistemática",
            }
    loud = subprocess.run(["ffmpeg", "-nostats", "-i", src, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    mI = re.findall(r"I:\s+(-?[\d.]+) LUFS", loud)
    resumo["loudness_lufs"] = float(mI[-1]) if mI else None
    run(["ffmpeg", "-v", "error", "-y", "-i", src, "-lavfi", "showspectrumpic=s=1400x360:legend=1:scale=log", os.path.join(an, "espectrograma.png")])

json.dump(resumo, open(os.path.join(an, "resumo.json"), "w"), indent=2, ensure_ascii=False)

# ------------------------------------------------------------ curvas (opcional)
try:
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    t = np.arange(len(diff)) / fps
    n = 3 if has_audio else 2
    fig, ax = plt.subplots(n, 1, figsize=(16, 3 * n), sharex=True)
    ax[0].plot(t, diff, lw=0.8, color="#333")
    for c in cortes:
        ax[0].axvline(c, color="#d33", lw=0.8)
    ax[0].set_ylabel("mudança visual")
    ax[1].plot(t[: len(yavg)], yavg, lw=0.8, color="#222", label="brilho")
    ax2 = ax[1].twinx()
    ax2.plot(t[: len(sat)], sat, lw=0.8, color="#c33")
    ax[1].set_ylabel("brilho / saturação (vermelho)")
    if has_audio:
        rms = np.array([np.sqrt(np.mean(y[i:i + int(sr / fps)] ** 2)) for i in range(0, len(y), int(sr / fps))])
        ax[2].plot(np.arange(len(rms)) / fps, rms, lw=0.8, color="#06c")
        for b in beats:
            ax[2].axvline(b, color="#f80", lw=0.3, alpha=0.6)
        ax[2].set_ylabel("áudio RMS (laranja = graves)")
    ax[-1].set_xlabel("tempo (s)")
    for x in ax:
        x.grid(alpha=0.25)
    fig.tight_layout()
    fig.savefig(os.path.join(an, "curvas.png"), dpi=80)
except ImportError:
    print("matplotlib não instalado: curvas.png não gerado (pip install matplotlib)")

shutil.rmtree(tmp, ignore_errors=True)

# ------------------------------------------------------------ ficha
ficha = os.path.join(out_dir, "ficha.md")
if not os.path.exists(ficha):
    modelo = open(os.path.join(LIB, "_modelo", "ficha.md")).read()
    vt = tecnico["video"]
    modelo = (modelo.replace("{{id}}", a.id).replace("{{arquivo}}", tecnico["arquivo"])
              .replace("{{duracao}}", f'{dur:.2f}').replace("{{resolucao}}", f'{vt["largura"]}×{vt["altura"]}')
              .replace("{{fps}}", f'{fps:g}').replace("{{bpm}}", str(resumo.get("bpm_estimado", "—")))
              .replace("{{crop}}", a.crop or "—"))
    open(ficha, "w").write(modelo)

print(json.dumps({"id": a.id, **{k: resumo[k] for k in ("duracao_s", "intervalo_mediano_eventos_s")},
                  "mudancas_bruscas": len(resumo["mudancas_bruscas_s"]), "eventos": len(resumo["eventos_visuais_s"]),
                  "bpm": resumo.get("bpm_estimado"), "sincronia": resumo.get("sincronia", {}).get("leitura"),
                  "decodificacao_ok": tecnico["decodificacao_ok"]}, ensure_ascii=False))
print(f"Saída em reference-library/{a.id}/ — agora preencha ficha.md e registre em reference-library/CATALOGO.md")
