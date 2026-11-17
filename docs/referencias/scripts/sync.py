import sys

import numpy as np

BASE = sys.argv[1]
FPS = 30.0


def peaks(x, thr, gap):
    idx = []
    for i in range(1, len(x) - 1):
        if x[i] >= thr and x[i] >= x[i - 1] and x[i] >= x[i + 1]:
            if idx and i - idx[-1] < gap:
                if x[i] > x[idx[-1]]:
                    idx[-1] = i
                continue
            idx.append(i)
    return np.array(idx)


for V in ["A", "B"]:
    s = np.load(f"{BASE}/{V}/series.npz")
    diff = s["diff"]
    dur = len(diff) / FPS
    # eventos visuais: início de cada surto de mudança (onde diff cruza 3x a mediana subindo)
    base = np.median(diff)
    ev_peaks = peaks(diff, max(8, 4 * base), 6) / FPS
    # batidas: picos da energia de graves
    lt, low = s["low_t"], s["low"]
    beat_idx = peaks(low, 0.18, int(0.25 * len(lt) / lt[-1]))
    beats = lt[beat_idx]
    ibi = np.diff(beats)
    med_ibi = np.median(ibi)
    print(f"\n=== {V}  duração {dur:.2f}s")
    print(f"batidas detectadas (graves): {len(beats)} | intervalo mediano {med_ibi:.3f}s -> {60/med_ibi:.1f} BPM")
    print(f"  intervalos p25/p75: {np.percentile(ibi,25):.3f}/{np.percentile(ibi,75):.3f}")
    print("  primeiras batidas:", np.round(beats[:12], 2).tolist())
    print(f"eventos visuais (picos de mudança na tela): {len(ev_peaks)}")
    print("  ", np.round(ev_peaks, 2).tolist())

    def nearest(ts, ref):
        return np.array([ts_i - ref[np.argmin(np.abs(ref - ts_i))] for ts_i in ts])

    d = nearest(ev_peaks, beats)
    rng = np.random.default_rng(1)
    rnd = np.abs(nearest(rng.uniform(beats[0], beats[-1], 5000), beats))
    print(f"  dist. evento->batida mais próxima: média |d| = {np.mean(np.abs(d)):.3f}s (aleatório: {rnd.mean():.3f}s)")
    within = np.mean(np.abs(d) <= 0.1)
    print(f"  eventos a <=100 ms de uma batida: {within*100:.0f}% (aleatório: {np.mean(rnd<=0.1)*100:.0f}%)")
    print("  desvios (s):", np.round(d, 3).tolist())
    # correlação energia visual x envelope de áudio
    rms = s["rms"][: len(diff)]
    n = min(len(rms), len(diff))
    for lag in [0, 3, 6]:
        c = np.corrcoef(diff[lag:n], rms[: n - lag])[0, 1]
        print(f"  corr(movimento visual, volume) lag {lag}q: {c:.3f}")
    # ritmo de cenas: intervalos entre eventos
    gaps = np.diff(ev_peaks)
    if len(gaps):
        print(f"  intervalo entre eventos: mediana {np.median(gaps):.2f}s, min {gaps.min():.2f}, max {gaps.max():.2f}")
        print(f"  em batidas: mediana {np.median(gaps)/med_ibi:.2f} batidas")
