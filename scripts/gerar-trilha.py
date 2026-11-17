"""
Gera a trilha da demonstração a partir de src/demo/timeline.json.

Tudo é sintetizado aqui (sem amostras de terceiros): pad harmônico, baixo,
bumbo, chimbal e efeitos (whoosh, pop, thud, bloom, shimmer, draw, impact).
Os efeitos caem exatamente nas marcações (`cues`) e transições da linha do tempo.

Uso:
    python3 scripts/gerar-trilha.py
Saída: public/audio/trilha-demo.mp3 (normalizada para -14 LUFS).
"""
import json
import os
import subprocess
import sys
import tempfile
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
DUR_TOKENS = {"micro": 3, "fast": 5, "swap": 6, "base": 7, "dissolve": 9, "reveal": 10, "enter": 16}
rng = np.random.default_rng(7)
# velocidade de cada tema (src/motion/themes.ts): a queda pousa em duration.enter / speed
THEME_SPEED = {"base": 1.0, "calmo": 0.82, "vibrante": 1.15}
ENTER = 16 / 30

tl = json.load(open(os.path.join(ROOT, "src/demo/timeline.json")))
FPS = tl["fps"]
BEAT = 60.0 / tl["bpm"]

# ---------------------------------------------------------------- tempos absolutos
starts, cursor = [], 0
for s in tl["scenes"]:
    starts.append(cursor)
    cursor += s["frames"] - (DUR_TOKENS[s["out"]["token"]] if "out" in s else 0)
TOTAL = cursor / FPS
scene_start = {s["id"]: st / FPS for s, st in zip(tl["scenes"], starts)}
events = []  # (tempo, tipo)
for s, st in zip(tl["scenes"], starts):
    for c in s["cues"]:
        if c.get("sfx"):
            # "thud" soa no POUSO, não no início da queda
            land = ENTER / THEME_SPEED[s["theme"]] if c["sfx"] == "thud" else 0.0
            events.append((st / FPS + c["t"] + land, c["sfx"]))
    if "out" in s and s["out"].get("sfx"):
        tf = DUR_TOKENS[s["out"]["token"]]
        nxt = st + s["frames"] - tf  # início da transição
        events.append(((nxt + tf / 2) / FPS, "whoosh"))

# Grade musical ancorada no acento principal (pouso da cápsula em "energia"):
# a bateria e a harmonia são deslocadas para que esse pouso caia exatamente numa batida.
_en = next(x for x in tl["scenes"] if x["id"] == "energia")
ANCHOR = scene_start["energia"] + next(c["t"] for c in _en["cues"] if c["name"] == "capsule") + ENTER / THEME_SPEED["vibrante"]
GRID = ANCHOR % BEAT

N = int((TOTAL + 0.6) * SR)
t_all = np.arange(N) / SR
L = np.zeros(N)
R = np.zeros(N)


def add(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    l = np.cos((pan + 1) * np.pi / 4)
    r = np.sin((pan + 1) * np.pi / 4)
    L[i : i + len(sig)] += sig * gain * l * 1.414
    R[i : i + len(sig)] += sig * gain * r * 1.414


def env_adsr(n, a, d, s, r_):
    a, d, r_ = int(a * SR), int(d * SR), int(r_ * SR)
    sus = max(0, n - a - d - r_)
    e = np.concatenate([np.linspace(0, 1, a, endpoint=False), np.linspace(1, s, d, endpoint=False),
                        np.full(sus, s), np.linspace(s, 0, r_)])
    return np.pad(e, (0, max(0, n - len(e))))[:n]


def fft_filter(x, lo=None, hi=None, soft=1.0):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    if lo:
        g *= 1 / (1 + (lo / np.maximum(f, 1)) ** (4 * soft))
    if hi:
        g *= 1 / (1 + (f / hi) ** (4 * soft))
    return np.fft.irfft(X * g, len(x))


def sweep_noise(dur, f0, f1, q=0.35):
    """Ruído com filtro passa-banda que varre de f0 a f1 (sobreposição de blocos)."""
    n = int(dur * SR)
    noise = rng.standard_normal(n + 2048)
    out = np.zeros(n + 2048)
    hop, win = 512, 2048
    w = np.hanning(win)
    for k, i in enumerate(range(0, n, hop)):
        frac = i / max(1, n)
        fc = f0 * (f1 / f0) ** frac
        seg = noise[i : i + win] * w
        X = np.fft.rfft(seg)
        f = np.fft.rfftfreq(win, 1 / SR)
        g = np.exp(-0.5 * ((np.log(np.maximum(f, 1)) - np.log(fc)) / q) ** 2)
        out[i : i + win] += np.fft.irfft(X * g, win) * w
    return out[:n] / (np.abs(out).max() + 1e-9)


def note(freq):
    return 440.0 * 2 ** ((freq - 69) / 12)


# ---------------------------------------------------------------- música
# progressão (MIDI): Fmaj9 → Am7 → Dm9 → Bbmaj9, 4 tempos cada
CHORDS = [[53, 57, 60, 64, 67], [57, 60, 64, 67, 71], [50, 57, 60, 64, 65], [46, 53, 57, 60, 62]]
ROOTS = [41, 45, 38, 46]
bar = 4 * BEAT

# energia por trecho: calmo no início, cheio no meio, aberto no fim
def section(t):
    if t < scene_start["energia"]:
        return "calmo"
    if t < scene_start["marca"]:
        return "cheio"
    return "final"


# pad
k = 0
tt = GRID
while tt < TOTAL + 0.5:
    ch = CHORDS[k % 4]
    n = int((bar + 0.8) * SR)
    tl_ = np.arange(n) / SR
    sig = np.zeros(n)
    for j, m in enumerate(ch):
        f = note(m + 12)
        for det in (-0.004, 0.004):
            ph = 2 * np.pi * f * (1 + det) * tl_
            sig += (np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)) / (1 + j * 0.15)
    sig *= env_adsr(n, 0.5, 0.6, 0.75, 0.9)
    sig = fft_filter(sig, hi=2600)
    add(sig / 12, tt, gain=0.55, pan=-0.25 if k % 2 else 0.25)
    # baixo
    fb = note(ROOTS[k % 4])
    nb = int(bar * SR)
    tb = np.arange(nb) / SR
    bass = (np.sin(2 * np.pi * fb * tb) + 0.3 * np.sin(4 * np.pi * fb * tb)) * env_adsr(nb, 0.03, 0.3, 0.7, 0.25)
    add(bass, tt, gain=0.22 if section(tt) == "calmo" else 0.34)
    tt += bar
    k += 1

# bateria
def kick():
    n = int(0.42 * SR)
    tk = np.arange(n) / SR
    f = 46 + 110 * np.exp(-tk * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-tk * 7.5) + 0.25 * rng.standard_normal(n) * np.exp(-tk * 90)


def hat(open_=False):
    n = int((0.16 if open_ else 0.05) * SR)
    x = fft_filter(rng.standard_normal(n), lo=7000)
    return x * np.exp(-np.arange(n) / SR * (18 if open_ else 70)) / (np.abs(x).max() + 1e-9)


def clap():
    n = int(0.2 * SR)
    x = fft_filter(rng.standard_normal(n), lo=900, hi=5000)
    e = np.exp(-np.arange(n) / SR * 22)
    for d in (0.0, 0.012, 0.024):
        e += np.roll(np.exp(-np.arange(n) / SR * 120), int(d * SR)) * 0.6
    return x * e / (np.abs(x * e).max() + 1e-9)


duck = np.ones(N)
b = 0
while GRID + b * BEAT < TOTAL - 0.3:
    tb = GRID + b * BEAT
    sec = section(tb)
    if sec == "cheio":
        add(kick(), tb, gain=0.95)
        i = int(tb * SR)
        dl = min(N - i, int(0.3 * SR))
        duck[i : i + dl] = np.minimum(duck[i : i + dl], 0.55 + 0.45 * np.linspace(0, 1, dl) ** 0.6)
        add(hat(), tb + BEAT / 2, gain=0.22, pan=0.35)
        add(hat(), tb + BEAT * 0.75, gain=0.1, pan=0.35)
        if b % 2 == 1:
            add(clap(), tb, gain=0.32, pan=-0.1)
    elif sec == "calmo":
        add(hat(), tb + BEAT / 2, gain=0.07, pan=0.4)
        if b % 4 == 0:
            add(kick(), tb, gain=0.35)
    else:  # final: meio-tempo e abertura
        if b % 2 == 0 and tb < TOTAL - 2.0:
            add(kick(), tb, gain=0.6)
        add(hat(True), tb + BEAT / 2, gain=0.06, pan=0.4)
    b += 1

L *= duck
R *= duck

# ---------------------------------------------------------------- efeitos
def sfx(kind):
    if kind == "whoosh":
        d = 0.55
        x = sweep_noise(d, 300, 5000, 0.5)
        n = len(x)
        e = np.sin(np.linspace(0, np.pi, n)) ** 2
        return x * e, -0.275  # pico no meio
    if kind == "swish":
        d = 0.3
        x = sweep_noise(d, 1500, 7000, 0.45)
        return x * np.sin(np.linspace(0, np.pi, len(x))) ** 1.5, -0.12
    if kind == "pop":
        n = int(0.14 * SR)
        tp = np.arange(n) / SR
        f = 260 + 520 * np.exp(-tp * 40)
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tp * 30)
        return x, 0.0
    if kind == "soft":
        n = int(0.5 * SR)
        tp = np.arange(n) / SR
        x = np.sin(2 * np.pi * 523.25 * tp) * np.exp(-tp * 6) + 0.5 * np.sin(2 * np.pi * 784 * tp) * np.exp(-tp * 8)
        return x * np.minimum(1, tp / 0.01) * 0.6, 0.0
    if kind == "thud":
        n = int(0.4 * SR)
        tp = np.arange(n) / SR
        f = 55 + 70 * np.exp(-tp * 20)
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tp * 9)
        x += fft_filter(rng.standard_normal(n), hi=1800) * np.exp(-tp * 35) * 0.35
        return x, 0.0
    if kind == "bloom":
        n = int(0.45 * SR)
        tp = np.arange(n) / SR
        f = 330 * (1 + 0.9 * (1 - np.exp(-tp * 9)))
        ph = 2 * np.pi * np.cumsum(f) / SR
        x = (np.sin(ph) + 0.35 * np.sin(2 * ph)) * env_adsr(n, 0.02, 0.12, 0.4, 0.3)
        x += sweep_noise(0.45, 2000, 6000, 0.6) * 0.18 * np.exp(-tp * 6)
        return x * 0.55, -0.02
    if kind == "shimmer":
        n = int(0.9 * SR)
        tp = np.arange(n) / SR
        x = np.zeros(n)
        for j, m in enumerate([84, 88, 91, 96]):
            x += np.sin(2 * np.pi * note(m) * tp) * np.exp(-tp * 4) * np.minimum(1, np.maximum(0, (tp - j * 0.045) / 0.01))
        return x * 0.2, 0.0
    if kind == "draw":
        n = int(0.8 * SR)
        tp = np.arange(n) / SR
        f = 400 * (4 ** (tp / 0.8))
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.12 * np.sin(np.pi * tp / 0.8)
        x += sweep_noise(0.8, 800, 6000, 0.4) * 0.25 * (tp / 0.8)
        return x, 0.0
    if kind == "impact":
        n = int(1.6 * SR)
        tp = np.arange(n) / SR
        f = 40 + 80 * np.exp(-tp * 14)
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tp * 3.2)
        x += fft_filter(rng.standard_normal(n), lo=3000) * np.exp(-tp * 5) * 0.25
        return x, 0.0
    raise ValueError(kind)


GAINS = {"whoosh": 0.5, "swish": 0.28, "pop": 0.42, "soft": 0.3, "thud": 0.75, "bloom": 0.38,
         "shimmer": 0.5, "draw": 0.55, "impact": 0.9}
for at, kind in sorted(events):
    x, off = sfx(kind)
    pan = 0.0 if kind in ("thud", "impact", "pop") else float(rng.uniform(-0.3, 0.3))
    add(x / (np.abs(x).max() + 1e-9), max(0, at + off), gain=GAINS[kind], pan=pan)

# ---------------------------------------------------------------- master
fade_out = np.clip((TOTAL + 0.3 - t_all) / 1.6, 0, 1) ** 1.5
fade_in = np.clip(t_all / 0.04, 0, 1)
L *= fade_out * fade_in
R *= fade_out * fade_in
mix = np.stack([L, R], axis=1)
mix = np.tanh(mix * 0.9) / np.tanh(0.9)  # saturação suave
mix /= np.abs(mix).max() + 1e-9
mix = mix[: int((TOTAL + 0.05) * SR)]

os.makedirs(os.path.join(ROOT, "public/audio"), exist_ok=True)
tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False).name
with wave.open(tmp, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 0.89 * 32767).astype(np.int16).tobytes())
out = os.path.join(ROOT, "public/audio/trilha-demo.mp3")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1.5:LRA=7",
                "-ar", str(SR), "-c:a", "libmp3lame", "-b:a", "192k", out], check=True)
os.unlink(tmp)
print(f"duração {TOTAL:.2f}s · {len(events)} efeitos · grade em {GRID:.3f}s + n·{BEAT}s · saída {os.path.relpath(out, ROOT)}")
for at, kind in sorted(events):
    off = ((at - GRID + BEAT / 2) % BEAT) - BEAT / 2
    print(f"  {at:6.2f}s  {kind:8s} distância da batida: {off*1000:+5.0f} ms")
sys.exit(0)
