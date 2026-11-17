import sys

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

BASE = sys.argv[1]
FPS = 30.0

for V in ["A", "B"]:
    s = np.load(f"{BASE}/{V}/series.npz")
    t = np.arange(len(s["diff"])) / FPS
    fig, ax = plt.subplots(5, 1, figsize=(18, 13), sharex=True)
    ax[0].plot(t, s["diff"], lw=0.8, color="#333")
    ax[0].set_ylabel("dif. média\nentre quadros\n(tela)")
    ax[1].plot(t, s["yavg"], lw=0.9, label="brilho (Y)", color="#222")
    ax2 = ax[1].twinx()
    ax2.plot(t, s["sat"], lw=0.9, color="#c33", label="saturação")
    ax[1].set_ylabel("brilho Y")
    ax2.set_ylabel("saturação", color="#c33")
    tr = np.arange(len(s["rms"])) / FPS
    ax[2].plot(tr, s["rms"], lw=0.8, color="#06c")
    for o in s["onsets"]:
        ax[2].axvline(o, color="#f80", lw=0.4, alpha=0.6)
    ax[2].set_ylabel("áudio RMS\n(laranja = ataques)")
    ax[3].plot(s["low_t"], s["low"], lw=0.6, color="#609")
    ax[3].set_ylabel("energia\n< 150 Hz")
    c1 = np.cumsum(s["cam1"], axis=0)
    c2 = np.cumsum(s["cam2"], axis=0)
    ax[4].plot(t, c1[:, 0], lw=0.8, label="ref1 x")
    ax[4].plot(t, c1[:, 1], lw=0.8, label="ref1 y")
    ax[4].plot(t, c2[:, 0], lw=0.8, ls="--", label="ref2 x")
    ax[4].plot(t, c2[:, 1], lw=0.8, ls="--", label="ref2 y")
    ax[4].set_ylabel("câmera:\ndesloc. acumulado (px)")
    ax[4].legend(loc="upper left", ncol=4, fontsize=8)
    ax[4].set_xlabel("tempo (s)")
    for a in ax:
        a.grid(alpha=0.25)
        a.set_xticks(np.arange(0, t[-1] + 1, 1))
    fig.suptitle(f"Vídeo {V}", fontsize=14)
    fig.tight_layout()
    fig.savefig(f"{BASE}/{V}_curvas.png", dpi=80)
    print("ok", V)
