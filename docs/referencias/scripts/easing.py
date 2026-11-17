"""Mede curvas de progresso de elementos e ajusta a curvas de easing conhecidas."""
import subprocess
import sys

import numpy as np

BASE = sys.argv[1]
FPS = 30


def grab(V, start, dur, crop, scale_w):
    w, h, x, y = crop
    sh = int(round(h * scale_w / w / 2) * 2)
    cmd = ["ffmpeg", "-v", "error", "-ss", str(start), "-t", str(dur), "-i", f"{BASE}/{V}/src.mp4",
           "-vf", f"fps={FPS},crop={w}:{h}:{x}:{y},scale={scale_w}:{sh}", "-pix_fmt", "rgb24", "-f", "rawvideo", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, sh, scale_w, 3).astype(np.float32)


def hsv_mask(f, fn):
    r, g, b = f[..., 0] / 255, f[..., 1] / 255, f[..., 2] / 255
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    s = np.where(mx > 0, (mx - mn) / (mx + 1e-9), 0)
    d = mx - mn + 1e-9
    hue = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    return fn(hue, s, mx)


purple = lambda h, s, v: (h > 240) & (h < 290) & (s > 0.45) & (v > 0.25)
red = lambda h, s, v: ((h < 15) | (h > 345)) & (s > 0.55) & (v > 0.35)
orange = lambda h, s, v: (h > 20) & (h < 45) & (s > 0.55) & (v > 0.45)
dark = lambda h, s, v: (v < 0.55) & (s < 0.6)

EASINGS = {
    "linear": lambda t: t,
    "easeInQuad": lambda t: t ** 2,
    "easeInCubic": lambda t: t ** 3,
    "easeOutQuad": lambda t: 1 - (1 - t) ** 2,
    "easeOutCubic": lambda t: 1 - (1 - t) ** 3,
    "easeOutQuint": lambda t: 1 - (1 - t) ** 5,
    "easeOutExpo": lambda t: np.where(t >= 1, 1, 1 - 2 ** (-10 * t)),
    "easeInOutCubic": lambda t: np.where(t < .5, 4 * t ** 3, 1 - (-2 * t + 2) ** 3 / 2),
    "easeInOutSine": lambda t: -(np.cos(np.pi * t) - 1) / 2,
}


def fit(p, label, note=""):
    p = np.asarray(p, float)
    lo, hi = p.min(), p.max()
    n = (p - lo) / (hi - lo + 1e-9)
    # recorta: do último quadro <3% ao primeiro >97%
    i0 = max(0, int(np.where(n < 0.03)[0].max()) if (n < 0.03).any() else 0)
    above = np.where(n > 0.97)[0]
    above = above[above > i0]
    i1 = int(above.min()) if len(above) else len(n) - 1
    seg = n[i0:i1 + 1]
    t = np.linspace(0, 1, len(seg))
    errs = {k: float(np.sqrt(np.mean((f(t) - seg) ** 2))) for k, f in EASINGS.items()}
    best = sorted(errs.items(), key=lambda kv: kv[1])[:3]
    overshoot = (p.max() - p[-3:].mean()) / (hi - lo + 1e-9)
    print(f"\n[{label}] {note}")
    print(f"  duração do movimento: {len(seg)} quadros = {len(seg)/FPS:.2f}s (q{i0}..q{i1})")
    print("  progresso:", " ".join(f"{v:.2f}" for v in seg))
    print("  melhor ajuste:", ", ".join(f"{k} (erro {v:.3f})" for k, v in best))
    print(f"  overshoot (pico acima do valor final): {overshoot*100:.0f}%")


# A — expansão radial roxa (30.35–30.85)
f = grab("A", 30.35, 0.5, (720, 410, 0, 392), 360)
fit([hsv_mask(x, purple).mean() for x in f], "A: transição radial roxa (área)", "área roxa / tela")
# A — caixa 3D surgindo (9.6–10.1): raiz da área = escala
f = grab("A", 9.6, 0.5, (300, 300, 330, 470), 150)
fit([np.sqrt(hsv_mask(x, purple).mean()) for x in f], "A: caixa 3D 'pop' (escala ~ raiz da área)")
# A — revelação 'Agora' (5.8–6.25): extensão horizontal da cor roxa
f = grab("A", 5.8, 0.45, (720, 150, 0, 392), 360)


def xext(m):
    cols = np.where(m.any(axis=0))[0]
    return cols.max() if len(cols) else 0


fit([xext(hsv_mask(x, purple)) for x in f], "A: revelação de 'Agora' (borda direita da área roxa)")
# A — barras crescendo (23.0–23.9)
f = grab("A", 23.0, 0.9, (720, 140, 0, 662), 360)
fit([hsv_mask(x, purple).mean() for x in f], "A: barras do gráfico (área roxa)")
# B — expansão radial vermelha final (21.6–21.85)
f = grab("B", 21.6, 0.3, (410, 800, 126, 164), 205)
fit([hsv_mask(x, red).mean() for x in f], "B: transição radial vermelha final (área)")
# B — logo revelado (17.9–18.4)
f = grab("B", 17.9, 0.5, (410, 200, 126, 450), 205)
fit([xext(hsv_mask(x, red)) for x in f], "B: revelação do logotipo (borda direita do vermelho)")
# B — produto caindo (0.05–0.55): centróide vertical do laranja
f = grab("B", 0.05, 0.55, (410, 800, 126, 164), 205)
ys = []
for x in f:
    m = hsv_mask(x, orange)
    rows = np.where(m.any(axis=1))[0]
    ys.append(np.average(np.arange(m.shape[0]), weights=m.sum(1)) if m.sum() > 30 else np.nan)
ys = np.array(ys)
ok = ~np.isnan(ys)
print("\n[B: queda do produto] centróide y por quadro:", np.round(ys, 1).tolist())
fit(ys[ok], "B: queda do produto (centróide y)")
# B — cores cíclicas 14.3–15.0: brilho médio da tela mostra os degraus
