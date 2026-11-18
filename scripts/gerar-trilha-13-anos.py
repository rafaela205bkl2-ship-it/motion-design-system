"""
Trilha original da produção "13 Anos Depois", sintetizada aqui (sem amostras nem músicas de terceiros).

Lê src/producoes/13-anos-depois/timeline.json, calcula o início de cada cena (descontando as
transições) e posiciona a música e os efeitos nas marcações:

  Memória (cenas 1–8)    pad quente + piano esparso; TV ligando; cliques de odômetro; pops dos comentários
  Silêncio (cena 9)      corte total, só um grave e um pulso
  Travessia (10–16)      impacto no sol, batida a 100 BPM, baixo e arpejo; whooshes nas transições
  Silêncio final (17–21) volta do pad sem batida; sino grave no "13"; acorde final que termina depois do cartão

Saídas (public/producoes/13-anos-depois/audio/):
  trilha.wav    mix final, normalizado para -14 LUFS (pico -1.5 dBTP)
  musica.wav    só a música (stem)
  efeitos.wav   só os efeitos (stem)

Uso: python3 scripts/gerar-trilha-13-anos.py
"""
import json
import os
import subprocess
import tempfile
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SLUG = "13-anos-depois"
SR = 48000
TRANS = {"radial-rapido": 5, "radial-suave": 7, "dissolve": 9, "fade-branco": 9}
rng = np.random.default_rng(13)

tl = json.load(open(os.path.join(ROOT, f"src/producoes/{SLUG}/timeline.json")))
FPS = tl["fps"]

# início (s) de cada cena e instante central de cada transição
starts, trans_mid = {}, []
f = 0
for i, c in enumerate(tl["cenas"]):
    d = round(c["duracao"] * FPS)
    starts[c["id"]] = f / FPS
    t = c.get("transicao") or "dissolve"
    last = i == len(tl["cenas"]) - 1
    ov = 0 if last or t == "corte" else TRANS[t]
    if not last and t != "corte":
        trans_mid.append(((f + d - ov / 2) / FPS, t))
    f += d - ov
TOTAL = f / FPS
S = lambda n: starts[f"cena-{n}"]
N = int((TOTAL + 0.2) * SR)
music = np.zeros((N, 2))
sfx = np.zeros((N, 2))


def add(buf, sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    if sig.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * l, sig * r], axis=1) * np.sqrt(2)
    buf[i : i + len(sig)] += sig * gain


def tt(d):
    return np.arange(int(d * SR)) / SR


def env(d, a=0.01, r=0.3):
    t = tt(d)
    e = np.minimum(1, t / max(a, 1e-4))
    e *= np.clip((d - t) / max(r, 1e-4), 0, 1)
    return e


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y


def lp_fast(x, cutoff):
    # filtro de 1 polo vetorizado por blocos (aproximação suficiente para pads)
    k = int(SR / cutoff / 2) | 1
    ker = np.ones(k) / k
    return np.convolve(x, ker, mode="same")


def midi(n):
    return 440 * 2 ** ((n - 69) / 12)


def pad(notes, d, bright=1.0):
    t = tt(d)
    x = np.zeros_like(t)
    for n in notes:
        for det in (-0.12, 0.0, 0.12):
            fr = midi(n + det / 1)
            x += np.sin(2 * np.pi * fr * t) + 0.25 * np.sin(2 * np.pi * 2 * fr * t) * bright
    x = lp_fast(x, 1800 * bright)
    return x / (len(notes) * 3) * env(d, 1.2, 1.5)


def piano(n, d=2.5):
    t = tt(d)
    fr = midi(n)
    x = sum(np.sin(2 * np.pi * fr * k * t) * (0.6 / k) * np.exp(-t * (1.6 + k)) for k in range(1, 6))
    return x * env(d, 0.004, 0.4)


def bell(n, d=5):
    t = tt(d)
    fr = midi(n)
    ratios = [1, 2.0, 2.76, 5.4, 8.9]
    x = sum(np.sin(2 * np.pi * fr * r * t) * np.exp(-t * (0.5 + i * 0.6)) / (i + 1) for i, r in enumerate(ratios))
    return x * env(d, 0.003, 1.0) * 0.6


def kick():
    t = tt(0.45)
    fr = 50 + 110 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 7)


def clap():
    t = tt(0.25)
    return lp_fast(rng.standard_normal(len(t)), 5000) * np.exp(-t * 18) * 0.8


def hat():
    t = tt(0.06)
    x = rng.standard_normal(len(t))
    x = x - lp_fast(x, 6000)
    return x * np.exp(-t * 70) * 0.5


def whoosh(d=0.6, up=True):
    t = tt(d)
    x = rng.standard_normal(len(t))
    e = np.sin(np.pi * t / d) ** 2
    lo = lp_fast(x, 2500 if up else 1200)
    return (x - lo * 0.6) * e * 0.35


def impact():
    t = tt(3.0)
    boom = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t * 6)) / SR) * np.exp(-t * 1.6)
    noise = lp_fast(rng.standard_normal(len(t)), 900) * np.exp(-t * 5) * 0.6
    return boom + noise


def riser(d=1.8):
    t = tt(d)
    x = rng.standard_normal(len(t))
    x = lp_fast(x, 3000)
    return x * (t / d) ** 2.5 * 0.6


def tick():
    t = tt(0.04)
    return np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 160) * 0.5 + rng.standard_normal(len(t)) * np.exp(-t * 300) * 0.2


def pop():
    t = tt(0.12)
    return np.sin(2 * np.pi * np.cumsum(300 + 900 * np.exp(-t * 40)) / SR) * np.exp(-t * 30) * 0.5


def tv_on():
    t = tt(1.1)
    click = np.zeros_like(t)
    click[: int(0.006 * SR)] = 1.0
    hiss = rng.standard_normal(len(t)) * np.exp(-t * 3.5) * 0.35
    whine = np.sin(2 * np.pi * 7800 * t) * 0.03 * np.exp(-t * 2)
    hum = np.sin(2 * np.pi * 60 * t) * 0.15 * np.exp(-t * 1.5)
    return click + hiss + whine + hum


def reverb(x, secs=2.2, mix=0.25):
    ir_t = tt(secs)
    ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 3.2)
    ir /= np.sqrt(np.sum(ir**2))
    out = np.zeros_like(x)
    nfft = 1 << int(np.ceil(np.log2(len(x) + len(ir))))
    IR = np.fft.rfft(ir, nfft)
    for ch in range(2):
        y = np.fft.irfft(np.fft.rfft(x[:, ch], nfft) * IR, nfft)[: len(x)]
        out[:, ch] = x[:, ch] * (1 - mix) + y * mix
    return out


# ------------------------------------------------------------ Memória (cenas 1–8): F maior, quente
mem_end = S(9)
chords = [[53, 60, 64, 69], [57, 60, 64, 67], [50, 57, 60, 65], [46, 53, 57, 62]]  # Fmaj7 Am7 Dm9(ish) Bbmaj7
t0, k = S(2) - 0.5, 0
while t0 < mem_end:
    d = min(4.2, mem_end - t0 + 1.0)
    add(music, pad(chords[k % 4], d, bright=0.8), t0, 0.5, pan=0)
    t0 += 4.0
    k += 1
motif = [72, 69, 67, 65, 64, 65, 67, 60]
for i, n in enumerate(motif):
    add(music, piano(n), S(2) + 0.3 + i * 1.35, 0.32, pan=0.2 * ((i % 3) - 1))
for i, n in enumerate([69, 67, 64, 62, 60]):
    add(music, piano(n), S(5) + 0.4 + i * 1.6, 0.26, pan=-0.2)

add(sfx, tv_on(), S(1) + 0.5, 0.7)
for sc, at in ((5, 0.4), (6, 0.2), (8, 0.35)):
    for dgt in range(4):
        add(sfx, tick(), S(sc) + at + dgt * 0.07, 0.5, pan=0.3 - dgt * 0.2)
for i, d in enumerate([0.75, 0.35, 0.55, 0.45, 0.65, 0.85]):
    add(sfx, pop(), S(7) + d, 0.35, pan=(-0.5 if i % 2 else 0.5))
add(sfx, riser(1.4), S(8) + 1.6, 0.4)

# ------------------------------------------------------------ Silêncio (cena 9)
t9 = tt(S(10) - S(9) + 0.4)
add(music, np.sin(2 * np.pi * 41.2 * t9) * env(len(t9) / SR, 0.3, 0.5) * 0.35, S(9))
for b in range(2):
    add(sfx, kick() * 0.5, S(9) + 0.4 + b * 0.8, 0.35)

# ------------------------------------------------------------ Travessia (cenas 10–16): A menor, 100 BPM
add(sfx, riser(0.8), S(10) - 0.8, 0.5)
add(sfx, impact(), S(10) + 0.15, 0.9)
bpm = 100
beat = 60 / bpm
beat_start = S(10) + 2.0
beat_end = S(17) - 0.05
prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
bass = [45, 41, 36, 43]
t0, k = S(10) + 0.6, 0
while t0 < beat_end:
    d = min(beat * 4 + 0.6, beat_end - t0 + 0.6)
    add(music, pad([n + 12 for n in prog[k % 4]], d, bright=1.1), t0, 0.42)
    t0 += beat * 4
    k += 1
nb = int((beat_end - beat_start) / beat)
for b in range(nb):
    at = beat_start + b * beat
    bar = (b // 4) % 4
    add(music, kick(), at, 0.75)
    if b % 4 in (1, 3):
        add(music, clap(), at, 0.35)
    for h in (0, 0.5):
        add(music, hat(), at + h * beat, 0.22, pan=0.4)
    tb = tt(beat * 0.9)
    bs = np.sin(2 * np.pi * midi(bass[bar]) * tb) * env(beat * 0.9, 0.01, 0.2)
    add(music, np.tanh(bs * 2) * 0.5, at, 0.5)
    # arpejo
    for q in range(2):
        n = prog[bar][(b * 2 + q) % 3] + 24
        add(music, piano(n, 0.5) * 0.8, at + q * beat / 2, 0.18, pan=(0.35 if q else -0.35))
for at, kind in trans_mid:
    if S(10) - 0.5 < at < S(17) + 0.5:
        add(sfx, whoosh(0.5 if kind == "radial-rapido" else 0.7), at - 0.3, 0.6, pan=0)
add(sfx, whoosh(0.9), S(11) + 0.15, 0.5, pan=0.6)
add(sfx, whoosh(0.7), S(12) + 0.15, 0.35, pan=-0.5)
add(sfx, whoosh(0.7), S(12) + 0.45, 0.35, pan=0.5)
for i in range(5):
    add(sfx, whoosh(0.8), S(16) + 0.15 + i * 0.55 + 0.6, 0.3, pan=(-0.4 if i % 2 else 0.4))
add(sfx, riser(0.9), S(15) + 2.0, 0.45)

# ------------------------------------------------------------ Silêncio final (17–21)
t0, k = S(17), 0
fin_chords = [[45, 52, 57, 60], [41, 48, 53, 57], [48, 55, 60, 64], [43, 50, 55, 59]]
while t0 < S(21):
    d = min(4.6, S(21) - t0 + 1.0)
    add(music, pad(fin_chords[k % 4], d, bright=0.7), t0, 0.45)
    t0 += 4.0
    k += 1
for i, n in enumerate([64, 62, 60, 57]):
    add(music, piano(n, 3), S(17) + 0.5 + i * 1.8, 0.28)
add(sfx, bell(45, 6), S(19) + 0.1, 0.6)
add(music, piano(69, 3), S(20) + 0.6, 0.3)
end_d = TOTAL - S(21) + 0.2
add(music, pad([41, 48, 57, 60, 64], end_d, bright=0.9) * np.clip((end_d - tt(end_d)) / 1.5, 0, 1), S(21), 0.6)
add(sfx, impact() * 0.5, S(21) + 0.2, 0.5)
add(sfx, bell(57, 4), S(21) + 1.3, 0.35)

# ------------------------------------------------------------ mix e saída
music = reverb(music, 2.6, 0.3)
sfx = reverb(sfx, 1.4, 0.15)
out_dir = os.path.join(ROOT, f"public/producoes/{SLUG}/audio")
os.makedirs(out_dir, exist_ok=True)


def write(path, x):
    x = x / max(1e-9, np.max(np.abs(x))) * 0.9
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


write(os.path.join(out_dir, "musica.wav"), music)
write(os.path.join(out_dir, "efeitos.wav"), sfx)
with tempfile.TemporaryDirectory() as tmp:
    raw = os.path.join(tmp, "mix.wav")
    write(raw, music * 0.8 + sfx * 0.9)
    subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", str(SR), os.path.join(out_dir, "trilha.wav")],
        check=True,
    )
print(f"Trilha: {TOTAL:.2f} s → {out_dir}/trilha.wav (+ musica.wav, efeitos.wav)")
