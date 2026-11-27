"""
Gera a trilha (música + efeitos) de uma PRODUÇÃO a partir de:
  - src/producoes/<slug>/timeline.json  → início de cada cena e transições (whoosh no meio de cada uma)
  - src/producoes/<slug>/sons.json      → música (bpm, âncora, seções, acordes) e efeitos com tempo absoluto

Tudo é sintetizado aqui (sem amostras de terceiros): bumbo, palmas, chimbal, baixo, acordes
em "pluck", arpejo, pad, e efeitos (whoosh, riser, impacto, clique, tique de digitação, pop, pouso,
risco, brilho). O ritmo segue as referências medidas (ver reference-library/ref-003..005: ~123 BPM,
bumbo em todos os tempos, efeitos nas transições).

Uso:
    python3 scripts/gerar-trilha-producao.py <slug> [--lufs -16]
Saída: public/producoes/<slug>/audio/trilha.mp3 (normalizada; padrão −16 LUFS para deixar espaço à locução).
"""
import argparse
import json
import os
import subprocess
import tempfile
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
# quadros (a 30 fps) de cada transição — mesmos tokens de src/motion/tokens.ts
FRAMES_TRANSICAO = {"radial-rapido": 5, "radial-suave": 7, "dissolve": 9, "fade-branco": 9, "faixa-diagonal": 12, "corte": 0}

ap = argparse.ArgumentParser()
ap.add_argument("slug")
ap.add_argument("--lufs", type=float, default=-16.0)
args = ap.parse_args()

tl = json.load(open(os.path.join(ROOT, "src/producoes", args.slug, "timeline.json")))
cfg = json.load(open(os.path.join(ROOT, "src/producoes", args.slug, "sons.json")))
FPS = tl["fps"]
rng = np.random.default_rng(11)

# ---------------------------------------------------------------- tempos absolutos das cenas
inicio, cursor = [], 0
for i, c in enumerate(tl["cenas"]):
    inicio.append(cursor / FPS)
    frames = round(c["duracao"] * FPS)
    ultima = i == len(tl["cenas"]) - 1
    tf = 0 if ultima else FRAMES_TRANSICAO.get(c.get("transicao") or "dissolve", 9)
    cursor += frames - tf
TOTAL = cursor / FPS
eventos = []
for i, c in enumerate(tl["cenas"][:-1]):
    t = c.get("transicao") or "dissolve"
    tf = FRAMES_TRANSICAO.get(t, 9)
    if tf:
        eventos.append((inicio[i + 1] + tf / FPS / 2, "whoosh", 1.0))
for e in cfg.get("efeitos", []):
    eventos.append((e["t"], e["sfx"], e.get("ganho", 1.0)))

mus = cfg["musica"]
BPM = mus["bpm"]
BEAT = 60.0 / BPM
ANCORA = mus["ancora"]  # tempo (s) de um tempo forte: a grade é alinhada a ele

N = int((TOTAL + 0.8) * SR)
L = np.zeros(N)
R = np.zeros(N)


def add(sig, at, gain=1.0, pan=0.0):
    i = int(round(at * SR))
    if i >= N or gain == 0:
        return
    if i < 0:
        sig = sig[-i:]
        i = 0
    sig = sig[: N - i]
    L[i : i + len(sig)] += sig * gain * np.sqrt(0.5 * (1 - pan))
    R[i : i + len(sig)] += sig * gain * np.sqrt(0.5 * (1 + pan))


def fft_filter(x, lo=None, hi=None):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    if lo:
        g *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi:
        g *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * g, len(x))


def sweep_noise(dur, f0, f1, width=0.4):
    """Ruído filtrado com centro que varre de f0 a f1 (whoosh/riser)."""
    n = int(dur * SR)
    out = np.zeros(n)
    noise = rng.standard_normal(n)
    blocks = 24
    for b in range(blocks):
        a, z = b * n // blocks, (b + 1) * n // blocks
        fc = f0 * (f1 / f0) ** (b / (blocks - 1))
        seg = fft_filter(noise[max(0, a - 512) : min(n, z + 512)], fc * (1 - width), fc * (1 + width))
        off = a - max(0, a - 512)
        out[a:z] = seg[off : off + (z - a)]
    return out


def note(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def tone(freq, dur, kind="saw", decay=6.0, attack=0.004):
    n = int(dur * SR)
    t = np.arange(n) / SR
    if kind == "saw":
        s = sum(np.sin(2 * np.pi * freq * k * t) / k for k in range(1, 9))
    elif kind == "bell":
        s = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2.01 * t) * np.exp(-t * 9)
    else:
        s = np.sin(2 * np.pi * freq * t)
    env = np.minimum(1, t / attack) * np.exp(-t * decay)
    return s * env


def reverb(x, seconds=1.6, mix=0.25):
    n = int(seconds * SR)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * (6.9 / seconds))
    ir = fft_filter(ir, 300, 7000)
    ir /= np.sqrt(np.sum(ir**2))
    m = len(x) + n
    size = 1 << (m - 1).bit_length()
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return x * (1 - mix) + wet * mix * 1.6


# ---------------------------------------------------------------- instrumentos
def kick():
    n = int(0.42 * SR)
    t = np.arange(n) / SR
    f = 48 + 120 * np.exp(-t * 32)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5)
    click = rng.standard_normal(n) * np.exp(-t * 400) * 0.25
    return np.tanh((s + click) * 1.8)


def clap():
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    env = sum(np.exp(-np.maximum(0, t - d) * 60) * (t >= d) for d in (0, 0.011, 0.022)) + 0.6 * np.exp(-t * 14)
    return fft_filter(rng.standard_normal(n), 900, 6000) * env * 0.55


def hat(open_=False):
    n = int((0.22 if open_ else 0.06) * SR)
    t = np.arange(n) / SR
    return fft_filter(rng.standard_normal(n), 7000, None) * np.exp(-t * (14 if open_ else 70)) * 0.28


def sfx(kind):
    if kind == "whoosh":
        s = sweep_noise(0.5, 400, 5000)
        env = np.sin(np.linspace(0, np.pi, len(s))) ** 2
        return s * env * 0.9, -0.25
    if kind == "riser":
        s = sweep_noise(2.0, 200, 8000)
        return s * np.linspace(0, 1, len(s)) ** 2 * 0.7, -2.0
    if kind == "reverso":
        s = fft_filter(rng.standard_normal(int(1.2 * SR)), 3000, None)
        return s * np.linspace(0, 1, len(s)) ** 3 * 0.6, -1.2
    if kind == "impacto":
        n = int(2.5 * SR)
        t = np.arange(n) / SR
        boom = np.sin(2 * np.pi * np.cumsum(38 + 70 * np.exp(-t * 9)) / SR) * np.exp(-t * 2.2)
        air = fft_filter(rng.standard_normal(n), 2000, None) * np.exp(-t * 5) * 0.3
        return reverb(np.tanh((boom + air) * 1.4), 2.4, 0.4), 0.0
    if kind == "clique":
        n = int(0.05 * SR)
        t = np.arange(n) / SR
        return (np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 160) + fft_filter(rng.standard_normal(n), 3000, None) * np.exp(-t * 300) * 0.4) * 0.5, 0.0
    if kind == "tique":
        n = int(0.03 * SR)
        t = np.arange(n) / SR
        return fft_filter(rng.standard_normal(n), 2500, 9000) * np.exp(-t * 260) * 0.35, 0.0
    if kind == "pop":
        n = int(0.16 * SR)
        t = np.arange(n) / SR
        f = 500 + 900 * np.exp(-t * 40)
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 26) * 0.5, 0.0
    if kind == "pouso":
        n = int(0.3 * SR)
        t = np.arange(n) / SR
        thud = np.sin(2 * np.pi * np.cumsum(70 + 90 * np.exp(-t * 30)) / SR) * np.exp(-t * 16)
        paper = fft_filter(rng.standard_normal(n), 1500, 7000) * np.exp(-t * 40) * 0.35
        return (thud + paper) * 0.7, 0.0
    if kind == "risco":
        s = sweep_noise(0.32, 2500, 900, 0.6)
        return s * np.sin(np.linspace(0, np.pi, len(s))) * 0.7, -0.05
    if kind == "brilho":
        out = np.zeros(int(1.2 * SR))
        for k, m in enumerate([81, 84, 88, 93]):
            s = tone(note(m), 1.0, "bell", 4.0)
            out[int(k * 0.06 * SR) : int(k * 0.06 * SR) + len(s)] += s * 0.25
        return reverb(out, 1.5, 0.35), 0.0
    if kind == "confirma":
        out = np.zeros(int(0.8 * SR))
        for k, m in enumerate([76, 83]):
            s = tone(note(m), 0.7, "bell", 6.0)
            out[int(k * 0.09 * SR) : int(k * 0.09 * SR) + len(s)] += s * 0.4
        return out, 0.0
    if kind == "relogio":
        n = int(0.04 * SR)
        t = np.arange(n) / SR
        return np.sin(2 * np.pi * 3200 * t) * np.exp(-t * 200) * 0.25, 0.0
    raise ValueError(kind)


# ---------------------------------------------------------------- música
secoes = mus["secoes"]  # [{de, ate, kick, clap, hats, baixo, pluck, arp, pad, filtro}]


def secao(t):
    for s in secoes:
        if s["de"] <= t < s["ate"]:
            return s
    return None


acordes = [[note(m) for m in a] for a in mus["acordes"]]  # um acorde por compasso
raizes = [note(m) for m in mus["raizes"]]
k_s, c_s, h_s, ho_s = kick(), clap(), hat(), hat(True)
pump = np.ones(N)  # ducking (sidechain) do bumbo
music_L = np.zeros(N)
music_R = np.zeros(N)


def madd(sig, at, gain=1.0, pan=0.0):
    i = int(round(at * SR))
    if i >= N or i < 0:
        return
    sig = sig[: N - i]
    music_L[i : i + len(sig)] += sig * gain * np.sqrt(0.5 * (1 - pan))
    music_R[i : i + len(sig)] += sig * gain * np.sqrt(0.5 * (1 + pan))


primeiro = ANCORA - BEAT * np.ceil(ANCORA / BEAT)
b = 0
while True:
    tb = primeiro + b * BEAT
    if tb > TOTAL:
        break
    b += 1
    if tb < 0:
        continue
    s = secao(tb + 1e-4)
    if not s:
        continue
    idx = int(round((tb - ANCORA) / BEAT))  # índice do tempo relativo à âncora
    pos = idx % 4  # posição no compasso
    comp = (idx // 4) % len(acordes)
    if s.get("kick"):
        madd(k_s, tb, 0.95)
        i0 = int(tb * SR)
        n = int(BEAT * SR)
        env = 1 - 0.55 * np.exp(-np.arange(n) / SR * 9)
        pump[i0 : i0 + n] = np.minimum(pump[i0 : i0 + n], env[: max(0, min(n, N - i0))])
    if s.get("clap") and pos in (1, 3):
        madd(c_s, tb, 0.8, 0.05)
    if s.get("hats"):
        madd(ho_s, tb + BEAT / 2, 0.75, 0.25)
        madd(h_s, tb + BEAT / 4, 0.4, -0.2)
        madd(h_s, tb + 3 * BEAT / 4, 0.4, -0.2)
    if s.get("baixo"):
        r = raizes[comp]
        for k, off in enumerate((0.5, 0.75)):  # baixo no contratempo, estilo house
            madd(tone(r, BEAT * 0.24, "sine", 9, 0.006) + 0.3 * tone(r * 2, BEAT * 0.24, "sine", 14, 0.006), tb + off * BEAT, 0.75)
    if s.get("pluck") and pos in (0, 2):
        for m, f in enumerate(acordes[comp]):
            madd(tone(f, 0.5, "saw", 9), tb + (0.75 * BEAT if pos == 2 else 0), 0.07, (m - 1) * 0.3)
    if s.get("arp"):
        notas = acordes[comp]
        for k in range(4):
            f = notas[(idx * 4 + k) % len(notas)] * 2
            madd(tone(f, 0.18, "bell", 14), tb + k * BEAT / 4, 0.09, 0.4 if k % 2 else -0.4)
    if s.get("pad") and pos == 0:
        dur = BEAT * 4
        for m, f in enumerate(acordes[comp]):
            n = int(dur * SR)
            t = np.arange(n) / SR
            sig = (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 1.004 * t)) * np.minimum(1, t / 0.4) * np.minimum(1, (dur - t) / 0.5)
            madd(sig, tb, 0.05, (m - 1) * 0.5)

# filtro passa-baixa nas seções marcadas (intro abafada / respiro)
for s in secoes:
    if s.get("filtro"):
        a, z = int(s["de"] * SR), min(N, int(s["ate"] * SR))
        music_L[a:z] = fft_filter(music_L[a:z], None, s["filtro"])
        music_R[a:z] = fft_filter(music_R[a:z], None, s["filtro"])

music_L = reverb(music_L, 1.2, 0.12) * pump
music_R = reverb(music_R, 1.2, 0.12) * pump
L += music_L
R += music_R

for t, kind, g in sorted(eventos):
    sig, lead = sfx(kind)
    add(sig, t + lead, g * mus.get("ganho_efeitos", 0.8), rng.uniform(-0.2, 0.2))

# fade final
fim = mus.get("fade_saida", 1.5)
nf = int(fim * SR)
end = int(TOTAL * SR)
ramp = np.linspace(1, 0, nf)
L[end - nf : end] *= ramp
R[end - nf : end] *= ramp
L[end:] = 0
R[end:] = 0

mix = np.stack([L, R], 1)[: int(TOTAL * SR)]
mix /= max(1e-9, np.max(np.abs(mix))) / 0.89
out = os.path.join(ROOT, "public/producoes", args.slug, "audio", "trilha.mp3")
os.makedirs(os.path.dirname(out), exist_ok=True)
with tempfile.TemporaryDirectory() as d:
    tmp = os.path.join(d, "mix.wav")
    with wave.open(tmp, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", f"loudnorm=I={args.lufs}:TP=-1.5:LRA=9", "-ar", "48000", "-c:a", "libmp3lame", "-b:a", "192k", out],
        check=True,
    )
print(f"trilha: {out} ({TOTAL:.2f} s, {BPM} BPM, {len(eventos)} efeitos, alvo {args.lufs} LUFS)")
