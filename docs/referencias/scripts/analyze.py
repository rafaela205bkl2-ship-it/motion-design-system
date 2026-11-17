import json
import re
import sys

import numpy as np

BASE = sys.argv[1]
FPS = 30.0
CFG = {
    "A": {"in": (205, 360), "cam1": (100, 720), "cam2": (250, 720)},
    "B": {"in": (400, 205), "cam1": (440, 120), "cam2": (150, 600)},
}


def read_meta(path, key):
    vals, cur = [], None
    for line in open(path):
        if line.startswith("frame:"):
            cur = {}
            vals.append(cur)
        m = re.match(r"lavfi\.([\w.]+)=(.*)", line.strip())
        if m and cur is not None:
            cur[m.group(1)] = float(m.group(2))
    return np.array([v.get(key, np.nan) for v in vals])


def frames(path, hw):
    h, w = hw
    a = np.fromfile(path, dtype=np.uint8)
    return a.reshape(-1, h, w).astype(np.float32)


def phase_corr(a, b):
    wa = np.hanning(a.shape[0])[:, None] * np.hanning(a.shape[1])[None, :]
    A = np.fft.fft2((a - a.mean()) * wa)
    B = np.fft.fft2((b - b.mean()) * wa)
    R = A * np.conj(B)
    R /= np.abs(R) + 1e-9
    r = np.fft.ifft2(R).real
    py, px = np.unravel_index(np.argmax(r), r.shape)
    h, w = r.shape

    def sub(c, n, arr_fn):
        l, m, rr = arr_fn(c - 1), arr_fn(c), arr_fn(c + 1)
        d = l - 2 * m + rr
        off = 0.5 * (l - rr) / d if d != 0 else 0
        v = c + off
        return v - n if v > n / 2 else v

    dy = sub(py, h, lambda y: r[y % h, px])
    dx = sub(px, w, lambda x: r[py, x % w])
    return dx, dy, r.max()


def peaks(x, thr, min_gap):
    idx = []
    for i in range(1, len(x) - 1):
        if x[i] >= thr and x[i] >= x[i - 1] and x[i] >= x[i + 1]:
            if idx and i - idx[-1] < min_gap:
                if x[i] > x[idx[-1]]:
                    idx[-1] = i
                continue
            idx.append(i)
    return idx


def audio_analysis(path, sr=22050):
    y = np.fromfile(path, dtype=np.float32)
    hop = int(sr / FPS)  # um valor por quadro de vídeo
    n = len(y) // hop
    rms = np.array([np.sqrt(np.mean(y[i * hop:(i + 1) * hop] ** 2)) for i in range(n)])
    # fluxo espectral (ataques)
    win = 1024
    hop2 = 256
    w = np.hanning(win)
    specs = []
    for i in range(0, len(y) - win, hop2):
        specs.append(np.abs(np.fft.rfft(y[i:i + win] * w)))
    S = np.log1p(np.array(specs))
    flux = np.maximum(0, np.diff(S, axis=0)).sum(axis=1)
    flux = np.concatenate([[0], flux])
    t_flux = np.arange(len(flux)) * hop2 / sr
    # bandas: graves (<150 Hz), médios, agudos (>4 kHz)
    freqs = np.fft.rfftfreq(win, 1 / sr)
    lin = np.array(specs)
    low = lin[:, freqs < 150].sum(1)
    mid = lin[:, (freqs >= 150) & (freqs < 4000)].sum(1)
    high = lin[:, freqs >= 4000].sum(1)
    # normaliza e detecta ataques
    fl = (flux - np.median(flux)) / (np.std(flux) + 1e-9)
    onset_idx = peaks(fl, 1.5, int(0.1 * sr / hop2))
    onsets = t_flux[onset_idx]
    # tempo por autocorrelação do fluxo
    env = flux - flux.mean()
    ac = np.correlate(env, env, mode="full")[len(env) - 1:]
    fps_env = sr / hop2
    lags = np.arange(len(ac)) / fps_env
    sel = (lags >= 60 / 200) & (lags <= 60 / 60)
    best_lag = lags[sel][np.argmax(ac[sel])]
    # força do pulso: pico de autocorrelação relativo ao lag zero
    pulse_strength = ac[sel].max() / ac[0]
    # tempo alternativo (2º melhor fora da vizinhança)
    return {
        "rms": rms,
        "onsets": onsets,
        "onset_strength": fl[onset_idx],
        "bpm": 60 / best_lag,
        "pulse_strength": float(pulse_strength),
        "band_share": {
            "graves<150Hz": float(low.sum() / (low.sum() + mid.sum() + high.sum())),
            "medios": float(mid.sum() / (low.sum() + mid.sum() + high.sum())),
            "agudos>4kHz": float(high.sum() / (low.sum() + mid.sum() + high.sum())),
        },
        "low_t": (t_flux, low / low.max()),
        "silence_ratio": float((rms < 0.01).mean()),
    }


def main(V):
    d = f"{BASE}/{V}"
    cfg = CFG[V]
    sc = read_meta(f"{d}/scene_in.txt", "scene_score")
    st = {k: read_meta(f"{d}/stats_in.txt", "signalstats." + k) for k in ["YAVG", "SATAVG", "HUEMED"]}
    inn = frames(f"{d}/in.raw", cfg["in"])
    diff = np.concatenate([[0], np.abs(np.diff(inn, axis=0)).mean(axis=(1, 2))])
    # câmera
    cam = {}
    for k in ["cam1", "cam2"]:
        f = frames(f"{d}/{k}.raw", cfg[k])
        mv = np.array([phase_corr(f[i - 1], f[i])[:2] for i in range(1, len(f))])
        cam[k] = np.vstack([[0, 0], mv])
    # cortes: picos de scene score
    cut_idx = peaks(sc, 0.30, 4)
    soft_idx = [i for i in peaks(sc, 0.12, 4) if i not in cut_idx]
    au = audio_analysis(f"{d}/audio.raw")
    out = {
        "frames": len(sc),
        "cuts": [{"t": round(i / FPS, 3), "score": round(float(sc[i]), 3)} for i in cut_idx],
        "soft": [{"t": round(i / FPS, 3), "score": round(float(sc[i]), 3)} for i in soft_idx],
        "bpm": round(au["bpm"], 1),
        "pulse_strength": round(au["pulse_strength"], 3),
        "band_share": au["band_share"],
        "silence_ratio": au["silence_ratio"],
        "n_onsets": len(au["onsets"]),
        "onsets": [round(float(t), 3) for t in au["onsets"]],
    }
    # sincronia: distância de cada corte ao ataque mais próximo
    on = au["onsets"]
    dists = []
    for c in out["cuts"]:
        if len(on):
            j = np.argmin(np.abs(on - c["t"]))
            dists.append(round(float(c["t"] - on[j]), 3))
    out["cut_to_onset"] = dists
    # baseline aleatória: distância média esperada para instantes aleatórios
    rng = np.random.default_rng(0)
    rnd = rng.uniform(0, len(sc) / FPS, 2000)
    out["random_mean_abs"] = round(float(np.mean([np.min(np.abs(on - t)) for t in rnd])), 3)
    out["cuts_mean_abs"] = round(float(np.mean(np.abs(dists))), 3) if dists else None
    # câmera: estatísticas (px no quadro 720x1280)
    for k, mv in cam.items():
        path = np.cumsum(mv, axis=0)
        out[f"{k}_speed_px_per_frame_median"] = round(float(np.median(np.hypot(mv[:, 0], mv[:, 1]))), 3)
        out[f"{k}_speed_p95"] = round(float(np.percentile(np.hypot(mv[:, 0], mv[:, 1]), 95)), 3)
        out[f"{k}_drift_range_x"] = round(float(np.ptp(path[:, 0])), 1)
        out[f"{k}_drift_range_y"] = round(float(np.ptp(path[:, 1])), 1)
    np.savez(f"{d}/series.npz", sc=sc, diff=diff, yavg=st["YAVG"], sat=st["SATAVG"],
             hue=st["HUEMED"], rms=au["rms"], cam1=cam["cam1"], cam2=cam["cam2"],
             onsets=au["onsets"], low_t=au["low_t"][0], low=au["low_t"][1])
    json.dump(out, open(f"{d}/summary.json", "w"), indent=1, ensure_ascii=False)
    print(V, json.dumps({k: v for k, v in out.items() if k not in ("onsets",)}, ensure_ascii=False))


for V in ["A", "B"]:
    main(V)
