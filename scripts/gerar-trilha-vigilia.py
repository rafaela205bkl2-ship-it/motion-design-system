"""
Trilha original da produção "vigilia" (15 s, em loop), sintetizada a partir da linha do tempo.

Uso:
    python3 scripts/gerar-trilha-vigilia.py

Saída: public/producoes/vigilia/audio/trilha.wav (48 kHz, estéreo, ~−14 LUFS aproximado).

Camadas, todas geradas aqui (nada de trilhas de terceiros):
- pad quente em Ré menor (Dm – B♭ – F – C), que cresce depois da abertura;
- pulso grave a 70 BPM (metade dos ~140 BPM medidos na ref-003) a partir do pouso do título;
- impacto + estouro nos clarões (0,06 s e 15 s), no pouso do título (~1,1 s) e no acento de cor (12,6 s);
- whoosh em cada risco de luz (0,35 / 3,4 / 6,2 / 8,8 / 11,2 s) e brilho nas faixas de luz (4,4 / 10,1 s);
- subida de ruído e tom para o estouro final, que encontra o começo (loop).
Requer: Python 3 com numpy.
"""
import os
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public/producoes/vigilia/audio/trilha.wav")
SR = 48000
DUR = 15.0
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(3)


def fft_filter(x, lo=None, hi=None):
    """Passa-faixa simples no domínio da frequência (borda suave)."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    if lo:
        g *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi:
        g *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * g, len(x))


def env(start, attack, decay, curve=4.0):
    e = np.zeros(N)
    a0, a1 = int(start * SR), int((start + attack) * SR)
    a1 = max(a1, a0 + 1)
    idx = np.arange(a0, min(a1, N))
    e[idx] = ((idx - a0) / (a1 - a0)) ** 2
    d = np.arange(a1, N)
    e[d] = np.exp(-(d - a1) / SR * curve / decay)
    return e


def note(freq, start, length, amp=0.1, harm=6, detune=0.003):
    """Nota com harmônicos (dente-de-serra suave), três vozes desafinadas."""
    out = np.zeros(N)
    s, e_ = int(start * SR), min(int((start + length) * SR), N)
    tt = t[s:e_] - start
    for dv in (-detune, 0, detune):
        f = freq * (1 + dv)
        for h in range(1, harm + 1):
            out[s:e_] += np.sin(2 * np.pi * f * h * tt + h * 0.7) / h ** 1.4
    # envelope lento (pad)
    a = np.clip(tt / 1.2, 0, 1)
    r = np.clip((length - tt) / 1.0, 0, 1)
    out[s:e_] *= a * r * amp
    return out


L = np.zeros(N)
R = np.zeros(N)

# ------------------------------------------------------------ pad
mtof = lambda m: 440 * 2 ** ((m - 69) / 12)
chords = [[50, 57, 62, 65], [46, 53, 58, 62], [41, 53, 57, 60], [48, 55, 60, 64]]  # Dm, Bb, F, C
pad = np.zeros(N)
seg = 3.6
for i, ch in enumerate(chords * 2):
    st = 0.4 + i * seg
    if st >= DUR:
        break
    for k, m in enumerate(ch):
        pad += note(mtof(m), st, seg + 1.2, amp=0.05 if k else 0.07)
pad = fft_filter(pad, lo=60, hi=2400)
swell = np.clip((t - 0.3) / 2.5, 0, 1) * (0.75 + 0.25 * np.sin(t * 0.8))
pad *= swell
L += pad * 1.0
R += np.roll(pad, int(0.011 * SR)) * 1.0

# ------------------------------------------------------------ pulso grave (70 BPM) a partir de 1,1 s
beat = 60 / 70
kick = np.zeros(N)
bt = 1.1
while bt < 13.6:
    e = env(bt, 0.004, 0.28, 5)
    f = 52 + 70 * np.exp(-np.clip(t - bt, 0, None) * 30)
    ph = 2 * np.pi * np.cumsum(f) / SR
    kick += np.sin(ph) * e * 0.5
    bt += beat
L += kick
R += kick


# ------------------------------------------------------------ efeitos
def noise_burst(start, length, lo, hi, amp, rise=True):
    n = fft_filter(rng.normal(0, 1, N), lo=lo, hi=hi)
    n /= np.abs(n).max() + 1e-9
    s, e_ = int(start * SR), min(int((start + length) * SR), N)
    w = np.zeros(N)
    x = np.linspace(0, 1, max(e_ - s, 1))
    w[s:e_] = (np.sin(np.pi * x) ** 2) if rise else np.exp(-x * 5)
    return n * w * amp


def impact(at, amp=0.9):
    e = env(at, 0.002, 1.6, 4)
    f = 38 + 90 * np.exp(-np.clip(t - at, 0, None) * 18)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * e
    crack = noise_burst(at, 0.6, 1500, 9000, 0.35, rise=False)
    return boom * amp + crack


# estouros e impactos
fx = impact(0.06, 0.8) + impact(1.12, 0.75) + impact(12.58, 0.6)
# whoosh dos riscos de luz (estéreo: varrem de um lado ao outro)
for at, d in [(0.35, 0.8), (3.4, 0.75), (6.2, 0.6), (8.8, 0.85), (11.2, 0.7)]:
    w = noise_burst(at - 0.05, d + 0.3, 400, 5000, 0.28)
    pan = np.clip((t - at) / (d + 0.3), 0, 1)
    L += w * (1 - pan)
    R += w * pan
# brilho das faixas de luz
for at in (4.4, 10.1):
    sh = sum(note(mtof(m), at, 1.6, amp=0.025, harm=2, detune=0.006) for m in (86, 89, 93))
    L += sh
    R += np.roll(sh, int(0.02 * SR))
# subida final para o estouro (loop)
riser_e = np.clip((t - 13.4) / 1.6, 0, 1) ** 2
riser = fft_filter(rng.normal(0, 1, N), lo=800, hi=8000)
riser = riser / np.abs(riser).max() * riser_e * 0.35
tone_f = 220 + 660 * riser_e
riser += np.sin(2 * np.pi * np.cumsum(tone_f) / SR) * riser_e * 0.08
L += fx + riser
R += fx + np.roll(riser, int(0.007 * SR))

# ------------------------------------------------------------ fim/começo: corte suave nas bordas
fade = np.clip(t / 0.01, 0, 1) * np.clip((DUR - t) / 0.02, 0, 1)
L *= fade
R *= fade

# ------------------------------------------------------------ nível: RMS ~ −16 dBFS, pico ≤ −1 dBFS
mix = np.stack([L, R], axis=1)
rms = np.sqrt((mix ** 2).mean())
mix *= 10 ** (-16 / 20) / rms
mix = np.tanh(mix * 1.1) / np.tanh(1.1)  # saturação leve (limitador suave)
peak = np.abs(mix).max()
if peak > 10 ** (-1 / 20):
    mix *= 10 ** (-1 / 20) / peak
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with wave.open(OUT, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print(f"trilha: {os.path.relpath(OUT, ROOT)} · {DUR:.1f} s · pico {20 * np.log10(np.abs(mix).max()):.1f} dBFS")
