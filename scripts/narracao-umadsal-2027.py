"""
Monta a faixa de narração do filme UMADSAL 2027 a partir da gravação original da cliente.

    python3 scripts/narracao-umadsal-2027.py

Lê `narracao` em src/producoes/umadsal-2027-arrependei-vos/cues.json: cada frase tem `origem` [s, e]
(trecho da gravação) e `inicio` (instante do filme em que a fala deve COMEÇAR). O início real da fala é
detectado pela energia (a marcação da transcrição costuma vir adiantada), e a frase é encaixada para que
esse ataque caia exatamente em `inicio`.

Gera em public/producoes/umadsal-2027-arrependei-vos/audio/:
    narracao.wav   voz tratada (passa-altas 80 Hz, compressão leve, −16 LUFS), 48 kHz estéreo
    narracao.mp3   o mesmo, para conferência
    filme-final.mp3  MIXAGEM FINAL usada no render: voz na frente; música −10 dB e efeitos −9 dB sob a voz
                     (ducking por envelope da própria voz), −14 LUFS, pico ≤ −1 dBTP
                     (rode antes `scripts/trilha-umadsal-2027.py`, que gera os stems de música e efeitos)

Requer: Python 3, numpy, soundfile, ffmpeg.
"""
import json
import os
import subprocess

import numpy as np
import soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SLUG = "umadsal-2027-arrependei-vos"
C = json.load(open(os.path.join(ROOT, "src", "producoes", SLUG, "cues.json"), encoding="utf-8"))
AUD = os.path.join(ROOT, "public", "producoes", SLUG, "audio")
SR = 48000

src = os.path.join(ROOT, "public", "producoes", SLUG, C["narracaoArquivo"])
tmp = os.path.join(AUD, "_voz.wav")
# tratamento: passa-altas, de-ruído leve, compressão suave
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-ac", "1", "-ar", str(SR),
                "-af", "highpass=f=80,afftdn=nf=-30,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2",
                tmp], check=True)
v, _ = sf.read(tmp, dtype="float32")
os.remove(tmp)

w = int(0.01 * SR)
env = np.sqrt(np.convolve(v ** 2, np.ones(w) / w, "same"))
piso = np.percentile(env, 20)


def ataque(s, e):
    """Primeiro instante, perto de `s`, em que a voz passa claramente do ruído de fundo."""
    # a busca começa no próprio trecho (antes dele está o fim da frase anterior)
    i0, i1 = int((s + 0.02) * SR), int(min(e, s + 0.9) * SR)
    seg = env[i0:i1]
    lim = piso + 0.07 * (seg.max() - piso)
    k = int(np.argmax(seg > lim))
    return (i0 + k) / SR


N = int(C["duracao"] * SR) + SR
out = np.zeros(N, np.float32)
for n in C["narracao"]:
    s, e = n["origem"]
    a = ataque(s, e)
    i0 = int(max(a - 0.04, s + 0.0) * SR)
    i1 = int((e + 0.18) * SR)
    x = v[i0:i1].copy()
    f_in, f_out = int(0.03 * SR), int(0.08 * SR)
    x[:f_in] *= np.linspace(0, 1, f_in)
    x[-f_out:] *= np.linspace(1, 0, f_out)
    p = int((n["inicio"] - 0.05) * SR)
    out[p : p + len(x)] += x[: N - p]
    print(f"{n['id']:4s} gravação {a:6.2f}s → filme {n['inicio']:6.2f}s  ({len(x) / SR:4.2f}s)")
out = out[: int(C["duracao"] * SR)]
raw = os.path.join(AUD, "_narr.wav")
sf.write(raw, np.stack([out, out], 1), SR, subtype="FLOAT")
wav = os.path.join(AUD, "narracao.wav")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", "loudnorm=I=-16:TP=-1.5:LRA=7", "-ar", str(SR), "-c:a", "pcm_s24le", wav], check=True)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-b:a", "256k", os.path.join(AUD, "narracao.mp3")], check=True)
os.remove(raw)

# ------------------------------------------------------------------ mixagem final
voz, _ = sf.read(wav, dtype="float32")
mus, _ = sf.read(os.path.join(AUD, "trilha-musica.flac"), dtype="float32")
sfx, _ = sf.read(os.path.join(AUD, "trilha-sfx.flac"), dtype="float32")
n = min(len(voz), len(mus), len(sfx))
voz, mus, sfx = voz[:n], mus[:n], sfx[:n]
e = np.sqrt(np.convolve((voz ** 2).mean(1), np.ones(int(0.02 * SR)) / int(0.02 * SR), "same"))
ativo = (e > 10 ** (-45 / 20)).astype(np.float32)
# segura 250 ms depois da fala e antecipa 60 ms (ataque rápido, liberação suave)
seg = int(0.25 * SR)
ativo = np.maximum.accumulate(np.where(ativo > 0, np.arange(n), 0)) > (np.arange(n) - seg)
ativo = ativo.astype(np.float32)
ativo = np.concatenate([ativo[int(0.06 * SR):], np.zeros(int(0.06 * SR), np.float32)])
k = int(0.08 * SR)
ativo = np.convolve(ativo, np.ones(k) / k, "same")
g_mus = 10 ** (-10 * ativo / 20)
g_sfx = 10 ** (-9 * ativo / 20)
mix = mus * g_mus[:, None] + sfx * g_sfx[:, None] + voz * 1.4
pre = os.path.join(AUD, "_mix.wav")
sf.write(pre, mix, SR, subtype="FLOAT")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", pre, "-af",
                "loudnorm=I=-14:TP=-1.5:LRA=11,alimiter=limit=0.84:level=false", "-ar", str(SR),
                "-b:a", "320k", os.path.join(AUD, "filme-final.mp3")], check=True)
os.remove(pre)
print("ok")
