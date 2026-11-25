"""
Trilha original do filme UMADSAL 2027 | ARREPENDEI-VOS.

Composição em código + sampler próprio (numpy/scipy) tocando amostras orquestrais REAIS
da biblioteca Versilian Community Sample Library (VSCO-2-CE, licença CC0 / domínio público).

    git clone --depth 1 https://github.com/sgossner/VSCO-2-CE.git ~/vsco
    python3 scripts/trilha-umadsal-2027.py --amostras ~/vsco

Lê os tempos de src/producoes/umadsal-2027-arrependei-vos/cues.json (mesma fonte do vídeo) e gera,
em public/producoes/umadsal-2027-arrependei-vos/audio/:
    trilha-musica.flac   só a música (stem para ajustes posteriores)
    trilha-sfx.flac      só o desenho de som (impactos, risers, rachadura, whooshes)
    filme-mix.mp3        música + sfx (usado no render; a narração entra depois, por cima)
    filme-mix.wav        o mesmo, sem compressão (opcional, --wav)

Linguagem: Ré menor modal (eólio/dórico), harmonia de cordas em estilo coral renascentista,
tema "O Chamado" (lá-ré-mi-fá: subida de quarta, depois passos), harpa como alaúde,
ostinato de spiccato no ato 2, silêncios estratégicos antes dos impactos e terça de Picardia
(Ré MAIOR) no acorde final — a única resolução maior do filme: "voltar ao princípio".

Requer: Python 3, numpy, scipy, soundfile; ffmpeg para o mp3.
"""
import argparse
import glob
import json
import math
import os
import re
import subprocess

import numpy as np
import soundfile as sf
from scipy import signal

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SLUG = "umadsal-2027-arrependei-vos"
CUES = json.load(open(os.path.join(ROOT, "src", "producoes", SLUG, "cues.json"), encoding="utf-8"))
HIT = CUES["impactos"]
DUR = float(CUES["duracao"])

ap = argparse.ArgumentParser()
ap.add_argument("--amostras", required=True, help="pasta do VSCO-2-CE")
ap.add_argument("--saida", default=os.path.join(ROOT, "public", "producoes", SLUG, "audio"))
ap.add_argument("--wav", action="store_true")
a = ap.parse_args()
LIB = os.path.expanduser(a.amostras)
SR = 44100
N = int((DUR + 1) * SR)
rng = np.random.default_rng(2027)

# ------------------------------------------------------------------ amostras
NOTE = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}


def midi_of(name, offset):
    m = re.search(r"_([A-G]#?)(-?\d)(?=_|\.|$)", name)
    if not m:
        return None
    return 12 * (int(m.group(2)) + 1) + NOTE[m.group(1)] + offset


def load(path):
    x, sr = sf.read(path, dtype="float32", always_2d=True)
    if x.shape[1] == 1:
        x = np.repeat(x, 2, 1)
    if sr != SR:
        x = signal.resample_poly(x, SR, sr, axis=0).astype(np.float32)
    env = np.abs(x).max(1)
    on = int(np.argmax(env > 0.03 * env.max()))
    return x[max(0, on - int(0.004 * SR)):]


class Inst:
    """Instrumento amostrado: escolhe a amostra mais próxima e reafina por reamostragem."""

    def __init__(self, folder, offset, pattern="*.wav", layers=None):
        self.zones = {}
        files = sorted(glob.glob(os.path.join(LIB, folder, pattern)))
        for f in files:
            m = midi_of(os.path.basename(f), offset)
            if m is None:
                continue
            self.zones.setdefault(m, []).append(f)
        if not self.zones:
            raise SystemExit(f"sem amostras em {folder}")
        self.cache = {}
        self.rr = 0

    def sample(self, midi, vel):
        keys = np.array(sorted(self.zones))
        k = int(keys[np.argmin(np.abs(keys - midi))])
        files = self.zones[k]
        # camadas de dinâmica: arquivos ordenados por energia; vel escolhe a camada
        key = ("rank", k)
        if key not in self.cache:
            ranked = sorted(files, key=lambda f: float(np.sqrt(np.mean(load(f)[: SR] ** 2))))
            self.cache[key] = ranked
        ranked = self.cache[key]
        layer = min(len(ranked) - 1, int(vel * len(ranked) * 0.999))
        # round-robin entre arquivos da mesma camada aproximada
        self.rr += 1
        cand = [ranked[layer]] + ([ranked[layer - 1]] if layer > 0 and self.rr % 2 else [])
        f = cand[self.rr % len(cand)]
        if f not in self.cache:
            self.cache[f] = load(f)
        return self.cache[f], midi - k


def repitch(x, semis):
    if abs(semis) < 1e-3:
        return x
    r = 2 ** (semis / 12)
    n = int(len(x) / r)
    idx = np.arange(n) * r
    out = np.empty((n, 2), np.float32)
    for c in range(2):
        out[:, c] = np.interp(idx, np.arange(len(x)), x[:, c])
    return out


def sustain(x, need):
    """Estende uma nota longa com laço e crossfade de potência constante."""
    if len(x) >= need:
        return x[:need]
    a0, a1 = int(1.2 * SR), len(x) - int(0.8 * SR)
    if a1 - a0 < SR:
        return np.pad(x, ((0, need - len(x)), (0, 0)))
    xf = int(0.45 * SR)
    out = x[:a1].copy()
    loop = x[a0:a1]
    fade = np.sin(np.linspace(0, np.pi / 2, xf))[:, None].astype(np.float32)
    while len(out) < need:
        tail = out[-xf:] * fade[::-1]
        head = loop[:xf] * fade
        out = np.concatenate([out[:-xf], tail + head, loop[xf:]])
    return out[:need]


# ------------------------------------------------------------------ barramentos
BUS = {k: np.zeros((N, 2), np.float32) for k in ["cordas", "solo", "harpa", "perc", "sfx", "sub"]}


def add(bus, t, x, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or len(x) == 0:
        return
    x = x[: N - i]
    l = math.cos((pan + 1) * math.pi / 4) * math.sqrt(2)
    r = math.sin((pan + 1) * math.pi / 4) * math.sqrt(2)
    BUS[bus][i : i + len(x), 0] += x[:, 0] * gain * l
    BUS[bus][i : i + len(x), 1] += x[:, 1] * gain * r


def note(inst, t, dur, midi, vel=0.5, att=0.05, rel=0.6, cresc=None, bus="cordas", pan=0.0, gain=1.0):
    """Toca uma nota. cresc=(g0, g1[, curva]) aplica crescendo/diminuendo ao longo da nota."""
    x, semis = inst.sample(midi, vel)
    x = repitch(x, semis)
    tot = int((dur + rel) * SR)
    x = sustain(x, tot).copy()
    n_att = max(1, int(att * SR))
    env = np.ones(tot, np.float32)
    env[:n_att] = np.linspace(0, 1, n_att) ** 1.5
    n_dur = int(dur * SR)
    if rel > 0:
        r = tot - n_dur
        env[n_dur:] *= np.exp(-np.linspace(0, 6, r))
    if cresc:
        g0, g1 = cresc[0], cresc[1]
        k = cresc[2] if len(cresc) > 2 else 1.0
        c = np.linspace(0, 1, n_dur) ** k
        env[:n_dur] *= g0 + (g1 - g0) * c
        env[n_dur:] *= g1
    x *= env[:, None]
    add(bus, t, x, gain * (0.25 + 0.75 * vel), pan)


def hit(inst, t, midi, vel, gain=1.0, bus="perc", pan=0.0, length=6.0):
    x, semis = inst.sample(midi, vel)
    x = repitch(x, semis)[: int(length * SR)]
    add(bus, t, x, gain * (0.3 + 0.7 * vel), pan)


def one(path, t, gain=1.0, bus="perc", pan=0.0, semis=0.0, reverse=False, end_at=None, length=None):
    x = load(os.path.join(LIB, path))
    x = repitch(x, semis)
    if length:
        x = x[: int(length * SR)]
    if reverse:
        x = x[::-1].copy()
        if end_at is not None:
            t = end_at - len(x) / SR
    add(bus, max(0, t), x, gain, pan)


print("carregando amostras…")
VLN = Inst("Strings/Violin Section/susVib", 12)
VLN_TREM = Inst("Strings/Violin Section/Trem", 12)
VLN_SPIC = Inst("Strings/Violin Section/Spic", 12)
VLA = Inst("Strings/Viola Section/susvib", 12)
VLA_SPIC = Inst("Strings/Viola Section/spic", 12)
VLA_TREM = Inst("Strings/Viola Section/trem", 12)
VC = Inst("Strings/Cello Section/susvib", 12)
VC_TREM = Inst("Strings/Cello Section/trem", 12)
VC_SPIC = Inst("Strings/Cello Section/spic", 12)
CB = Inst("Strings/Solo Contrabass/SusVib", 12)
CB_SPIC = Inst("Strings/Solo Contrabass/Spic", 12)
SOLO = Inst("Strings/Solo Violin/Arco Vib", 0)
HARP = Inst("Strings/Harp", 0)

PERC = "VSCO 1 Percussion"
TIMP_D = ("Percussion/Timpani/Timpani1_Hit_v3_rr2_Sum.wav", -3.46)  # ~F2 → Ré2
TIMP_A = ("Percussion/Timpani/Timpani2_Hit_v4_rr1_Sum.wav", -1.78)  # ~Si2 → Lá2
TIMP_ROLL = ("Percussion/Timpani/Rolls/Timpani1_Roll_v5_rr1_Sum.wav", -4.41)
BD = {
    "fff": f"{PERC}/drums/bass/bdrum_fff_1.wav",
    "ff": f"{PERC}/drums/bass/bdrum_ff_1.wav",
    "f": f"{PERC}/drums/bass/bdrum_f_1.wav",
    "mp": f"{PERC}/drums/bass/bdrum_mp_1.wav",
    "p": f"{PERC}/drums/bass/bdrum_p_1.wav",
    "roll": f"{PERC}/drums/bass/bdrum_roll_long1.wav",
}
GONG = f"{PERC}/varMetal/Gong/gong_hit_fff.wav"
GONG_MF = f"{PERC}/varMetal/Gong/gong_hit_mf.wav"
CRASH = f"{PERC}/varMetal/Cymbals/clash/crash_hit_fff_loose.wav"
CRASH_MP = f"{PERC}/varMetal/Cymbals/clash/crash_hit_mp_loose.wav"


def timp(t, which="D", vel=1.0, gain=1.0):
    p, s = TIMP_D if which == "D" else TIMP_A
    one(p, t, gain * (0.25 + 0.75 * vel), semis=s, length=6)


def bd(t, dyn="f", gain=1.0):
    one(BD[dyn], t, gain, length=5)


# ------------------------------------------------------------------ harmonia
# vozes: cb (contrabaixo), vc (celli), vla (violas), vln (violinos)
CH = {
    "Dm": dict(cb=[38], vc=[50, 57], vla=[53, 57], vln=[65, 69, 74]),
    "Bb": dict(cb=[34], vc=[46, 53], vla=[58, 62], vln=[62, 65, 70]),
    "F": dict(cb=[41], vc=[53, 60], vla=[57, 60], vln=[65, 69, 72]),
    "C": dict(cb=[36], vc=[48, 55], vla=[55, 60], vln=[64, 67, 72]),
    "Gm": dict(cb=[43], vc=[43, 50], vla=[55, 58], vln=[67, 70, 74]),
    "A": dict(cb=[45], vc=[45, 52], vla=[57, 61], vln=[64, 69, 73]),
    "Asus": dict(cb=[45], vc=[45, 52], vla=[57, 62], vln=[64, 69, 74]),
    "D": dict(cb=[38], vc=[50, 57], vla=[62, 66], vln=[69, 74, 78]),
}
PAN = dict(cb=0.3, vc=0.35, vla=0.1, vln=-0.35)
INSTR = dict(cb=CB, vc=VC, vla=VLA, vln=VLN)


def pad(ch, t, dur, vel=0.35, att=1.2, rel=1.4, voices=("cb", "vc", "vla", "vln"), cresc=None, gain=1.0):
    for v in voices:
        for m in CH[ch][v]:
            note(INSTR[v], t, dur, m, vel, att, rel, cresc, pan=PAN[v], gain=gain * (0.8 if v == "vln" else 1.0))


def progression(seq, vel=0.35, att=1.0, voices=("cb", "vc", "vla", "vln"), cresc_last=None, gain=1.0):
    """seq = [(acorde, início, duração)] com pequena sobreposição para legato."""
    for i, (ch, t, d) in enumerate(seq):
        cr = cresc_last if (cresc_last and i == len(seq) - 1) else None
        pad(ch, t, d + 0.25, vel, att, 1.2, voices, cr, gain)


def melody(notes, inst=SOLO, vel=0.5, bus="solo", pan=-0.08, gain=1.0, att=0.12, double=None):
    """notes = [(início, duração, midi)]; double=(instrumento, deslocamento, vel) dobra a linha."""
    for t, d, m in notes:
        note(inst, t, d, m, vel, att, 0.9, bus=bus, pan=pan, gain=gain)
        if double:
            note(double[0], t, d, m + double[1], double[2], att + 0.08, 1.0, pan=-0.3, gain=gain)


ARP = {
    "Dm": [50, 57, 62, 65, 69, 65, 62, 57],
    "Bb": [46, 53, 58, 62, 65, 62, 58, 53],
    "F": [41, 48, 53, 57, 60, 57, 53, 48],
    "C": [48, 55, 60, 64, 67, 64, 60, 55],
    "Gm": [43, 50, 55, 58, 62, 58, 55, 50],
    "A": [45, 52, 57, 61, 64, 61, 57, 52],
    "Asus": [45, 52, 57, 62, 64, 62, 57, 52],
    "D": [50, 57, 62, 66, 69, 74, 69, 66],
}


def harp(ch, t, dur, step=0.5, vel=0.32, up=0):
    k = 0
    tt = t
    while tt < t + dur - 1e-6:
        m = ARP[ch][k % 8] + up
        note(HARP, tt + rng.normal(0, 0.006), 2.5, m, vel * (1.1 if k % 4 == 0 else 0.9), 0.003, 1.5, bus="harpa", pan=-0.45)
        tt += step
        k += 1


OST = {"Dm": (38, 45), "Bb": (34, 41), "F": (41, 48), "C": (36, 43), "Gm": (43, 50), "A": (45, 52)}


def ostinato(ch, t, dur, vel, inst=VC_SPIC, up=12, step=0.25, pan=0.3, gain=1.0):
    r, f = OST[ch]
    pat = [r, r, f, r, r + 12, r, f, r]
    acc = [1.0, 0.6, 0.75, 0.6, 0.95, 0.6, 0.8, 0.65]
    k = 0
    tt = t
    while tt < t + dur - 1e-6:
        note(inst, tt, 0.22, pat[k % 8] + up, vel * acc[k % 8], 0.004, 0.12, pan=pan, gain=gain)
        tt += step
        k += 1


# ------------------------------------------------------------------ desenho de som (sintetizado)
def sub_boom(t, f0=58, f1=27, length=2.2, gain=0.9):
    n = int(length * SR)
    tt = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-tt * 3.2)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.tanh(1.6 * np.sin(ph)) * np.exp(-tt * 1.7)
    x[: int(0.004 * SR)] *= np.linspace(0, 1, int(0.004 * SR))
    add("sub", t, np.repeat(x[:, None], 2, 1).astype(np.float32), gain)


def noise_riser(t0, t1, gain=0.35, f_lo=300, f_hi=9000):
    n = int((t1 - t0) * SR)
    x = rng.standard_normal((n, 2)).astype(np.float32)
    out = np.zeros_like(x)
    blocks = 64
    for b in range(blocks):
        s, e = b * n // blocks, (b + 1) * n // blocks
        p = (b + 0.5) / blocks
        fc = f_lo * (f_hi / f_lo) ** p
        sos = signal.butter(2, [fc * 0.5, min(fc * 1.6, SR / 2 - 100)], "bandpass", fs=SR, output="sos")
        out[s:e] = signal.sosfilt(sos, x[max(0, s - 2000) : e], axis=0)[-(e - s) :]
    env = np.linspace(0, 1, n) ** 2.6
    add("sfx", t0, out * env[:, None], gain)


def whoosh(t_center, length=1.6, gain=0.22):
    n = int(length * SR)
    x = rng.standard_normal((n, 2)).astype(np.float32)
    sos = signal.butter(2, [250, 2400], "bandpass", fs=SR, output="sos")
    x = signal.sosfilt(sos, x, axis=0)
    env = np.sin(np.linspace(0, np.pi, n)) ** 3
    add("sfx", t_center - length / 2, x * env[:, None], gain)


def crack(t, gain=0.6):
    """Rachadura no reboco: transiente seco + estalos + baque grave."""
    n = int(1.4 * SR)
    x = np.zeros((n, 2), np.float32)
    tr = rng.standard_normal((int(0.03 * SR), 2)) * np.exp(-np.linspace(0, 9, int(0.03 * SR)))[:, None]
    x[: len(tr)] += tr
    for _ in range(26):
        i = int(abs(rng.normal(0.0, 0.32)) * SR)
        if i < n - 400:
            c = rng.standard_normal((300, 2)) * np.exp(-np.linspace(0, 12, 300))[:, None] * rng.uniform(0.1, 0.6)
            x[i : i + 300] += c
    sos = signal.butter(2, 900, "highpass", fs=SR, output="sos")
    x = signal.sosfilt(sos, x, axis=0).astype(np.float32)
    add("sfx", t, x, gain)
    sub_boom(t, 70, 32, 1.4, 0.5)


def room_tone(t0, t1, gain=0.035):
    n = int((t1 - t0) * SR)
    x = rng.standard_normal((n, 2)).astype(np.float32)
    sos = signal.butter(2, [60, 500], "bandpass", fs=SR, output="sos")
    x = signal.sosfilt(sos, x, axis=0)
    lfo = 0.7 + 0.3 * np.sin(np.linspace(0, (t1 - t0) * 0.6, n))
    env = np.minimum(1, np.minimum(np.linspace(0, (t1 - t0) / 2.0, n), np.linspace((t1 - t0) / 2.0, 0, n)))
    add("sfx", t0, x * (lfo * env)[:, None], gain)


def drone(t0, t1, f=36.71, gain=0.12, att=4.0):
    n = int((t1 - t0) * SR)
    tt = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2 * tt)
    env = np.minimum(1, tt / att) * np.minimum(1, (t1 - t0 - tt) / 0.08)
    add("sub", t0, np.repeat((x * env)[:, None], 2, 1).astype(np.float32), gain)


CORTES = []  # (início do silêncio, retomada) — aplicados também DEPOIS da reverberação


def cut(t, resume=None, resume_musica=None):
    """Silêncio estratégico: zera todos os barramentos a partir de t (com 25 ms de rampa).
    Com `resume`, o silêncio também é imposto à mixagem final (corta a cauda da reverberação)."""
    if resume is not None:
        CORTES.append((t, resume, resume_musica or resume))
    i = int(t * SR)
    r = int(0.025 * SR)
    for b in BUS.values():
        b[i - r : i] *= np.linspace(1, 0, r)[:, None]
        b[i:] = 0


def impact(t, big=True, key="D"):
    one(GONG if big else GONG_MF, t, 0.8 if big else 0.45)
    one(CRASH if big else CRASH_MP, t, 0.35 if big else 0.2, pan=-0.2)
    timp(t, key, 1.0, 1.1)
    bd(t, "fff" if big else "ff", 1.0)
    sub_boom(t, gain=0.9 if big else 0.6)


# ================================================================== PARTITURA
print("compondo…")
H = HIT

# ---------------------------------------------------------- ATO 1 — O CHAMADO (0–19,8)
# A ordem importa: tudo o que soa ANTES de um silêncio estratégico é escrito antes do cut().
drone(0, H["corteSilencio"], gain=0.10, att=6)
room_tone(0, 11, 0.03)
note(CB, 0.0, H["corteSilencio"], 38, 0.35, att=5.5, rel=0.1)
note(VC, 1.0, H["corteSilencio"] - 1.0, 50, 0.3, att=5.0, rel=0.1, pan=0.3)
note(VLN, 3.0, H["corteSilencio"] - 3.0, 81, 0.15, att=3.5, rel=0.1, pan=-0.3, gain=0.5)
# "UMADSAL 2027": harpa grave + violino solo
for m, dt in [(38, 0.0), (45, 0.07), (50, 0.14)]:
    note(HARP, H["identificacao"] + dt, 3.0, m, 0.35, 0.003, 2.0, bus="harpa", pan=-0.3)
note(SOLO, H["identificacao"], 3.8, 74, 0.35, att=1.4, rel=1.2, bus="solo")
# crescendo para o corte
t0 = 8.4
for m in (74, 75, 81):
    note(VLN_TREM, t0, H["corteSilencio"] - t0, m, 0.6, 0.3, 0.05, (0.05, 1.0, 2.2), pan=-0.3)
note(VC_TREM, t0, H["corteSilencio"] - t0, 50, 0.6, 0.3, 0.05, (0.05, 1.0, 2.2), pan=0.3)
one(TIMP_ROLL[0], t0, 0.5, semis=TIMP_ROLL[1], length=H["corteSilencio"] - t0)
one(GONG, 0, 0.5, bus="sfx", reverse=True, end_at=H["corteSilencio"])
noise_riser(t0, H["corteSilencio"], 0.3)
cut(H["corteSilencio"], H["arrependei"] - 0.004)

# IMPACTO: ARREPENDEI-VOS
T = H["arrependei"]
impact(T, True, "D")
for m in (38, 50):
    note(CB_SPIC if m < 45 else VC_SPIC, T, 0.3, m, 1.0, 0.002, 0.3, pan=0.3)
note(CB, T, 7.5, 38, 0.8, 0.02, 2.0, (1.0, 0.25))
for m in (50, 57):
    note(VC, T, 7.5, m, 0.75, 0.03, 2.0, (1.0, 0.25), pan=0.35)
for m in (53, 57):
    note(VLA, T, 7.5, m, 0.6, 0.05, 2.0, (1.0, 0.25), pan=0.1)
for m in (81, 86):
    note(VLN_TREM, T, 7.0, m, 0.85, 0.02, 2.0, (1.0, 0.08), pan=-0.35)
whoosh(19.4, 1.8, 0.18)

# ---------------------------------------------------------- ATO 2 — A MENSAGEM
# Impérios / arte, ciência e história (20–36): coral de cordas + harpa-alaúde
progression([("Dm", 20, 4), ("Bb", 24, 4), ("Gm", 28, 4), ("Asus", 32, 2), ("A", 34, 2)], 0.28, 1.6,
            voices=("cb", "vc", "vla"))
progression([("Gm", 28, 4), ("Asus", 32, 2), ("A", 34, 2)], 0.2, 2.0, voices=("vln",))
for ch, t, d in [("Dm", 21, 3), ("Bb", 24, 4), ("Gm", 28, 4), ("Asus", 32, 2), ("A", 34, 2)]:
    harp(ch, t, d, 0.5, 0.26)
one(TIMP_ROLL[0], 34.0, 0.25, semis=TIMP_ROLL[1], length=2.0)

# Michelangelo (36–52,5): o tema "O Chamado"
progression([("Dm", 36, 4), ("Bb", 40, 4), ("F", 44, 4), ("Asus", 48, 2), ("A", 50, 2.5)], 0.3, 0.8)
for ch, t, d in [("Dm", 36, 4), ("Bb", 40, 4), ("F", 44, 4), ("Asus", 48, 2), ("A", 50, 2.5)]:
    harp(ch, t, d, 0.5, 0.22, 12)
THEME = [(0, 1, 69), (1, 2, 74), (3, 1, 76), (4, 3, 77), (7, 0.5, 76), (7.5, 0.5, 74),
         (8, 2, 72), (10, 1, 69), (11, 1, 72), (12, 2, 74), (14, 2.5, 73)]
melody([(36 + t, d, m) for t, d, m in THEME], SOLO, 0.5, double=(VLN, 0, 0.22))
melody([(44, 2, 57), (46, 1, 53), (47, 1, 52), (48, 2, 50), (50, 2.5, 52)], VC, 0.4, "cordas", 0.35)

# Interrompida (52,5–58): esvazia, violino sozinho, rachadura, silêncio
note(CB, 52.5, 4.0, 38, 0.35, 0.3, 0.3, (1.0, 0.2))
note(VC, 52.5, 4.0, 50, 0.3, 0.3, 0.3, (1.0, 0.2), pan=0.35)
note(SOLO, 52.6, 3.9, 86, 0.32, 0.6, 0.2, (1.0, 0.3), bus="solo")
cut(H["rachadura"] - 0.1, H["rachadura"] - 0.002, 58.0)
crack(H["rachadura"])
room_tone(57.0, 66.5, 0.03)

# Éden (58–66): trêmulo grave em segunda menor, pulsação de tímpano
note(CB, 58, 8.0, 38, 0.4, 1.5, 0.4, (0.6, 1.0))
note(VC_TREM, 58, 8.0, 38, 0.35, 1.0, 0.4, (0.5, 1.0), pan=0.35)
note(VC_TREM, 59, 7.0, 39, 0.3, 1.5, 0.4, (0.4, 0.9), pan=0.4)
for m in (57, 58):
    note(VLA_TREM, 60, 6.0, m, 0.25, 2.0, 0.4, (0.3, 0.8), pan=0.1)
for t in (58.0, 60.0, 62.0, 64.0):
    timp(t, "D", 0.45, 0.6)
    timp(t + 0.3, "D", 0.3, 0.4)
note(VLN, 63.5, 2.5, 69, 0.3, 2.0, 0.2, (0.2, 1.0, 1.6), pan=-0.3)

# Deus nunca deixou de chamar (66–72): luz — Si bemol e Fá maiores
T = H["luzVolta"]
progression([("Bb", T, 3), ("F", T + 3, 3)], 0.4, 0.6, cresc_last=(1.0, 0.85))
for i, m in enumerate([46, 53, 58, 62, 65, 70, 74, 77, 82, 86]):
    note(HARP, T + i * 0.07, 3.0, m, 0.35, 0.003, 2.0, bus="harpa", pan=-0.4)
melody([(66.5, 1, 69), (67.5, 1.5, 74), (69, 1, 76), (70, 1.2, 77), (71.2, 0.8, 76)], SOLO, 0.5, double=(VLN, 0, 0.2))
one(CRASH_MP, T, 0.12, bus="sfx", reverse=True, end_at=T)

# A geração (72–104): ostinato de spiccato que cresce
T = H["ostinato"]
SEQ = [("Dm", 72), ("Bb", 76), ("F", 80), ("C", 84), ("Dm", 88), ("Bb", 92), ("F", 96), ("Gm", 100), ("A", 102)]
for i, (ch, t) in enumerate(SEQ):
    d = 4 if ch != "Gm" and ch != "A" else 2
    if t == 100:
        d = 2
    v = 0.45 + 0.4 * (t - 72) / 30
    ostinato(ch, t, d if t < 102 else 1.0, v, VC_SPIC, 12, pan=0.3)
    if t >= 80:
        ostinato(ch, t, d if t < 102 else 1.0, v * 0.9, VLA_SPIC, 24, pan=0.05, gain=0.8)
    if t >= 88:
        ostinato(ch, t, d if t < 102 else 1.0, v * 0.8, VLN_SPIC, 36, pan=-0.3, gain=0.6)
    pad(ch, t, d + 0.2, 0.25 + 0.2 * (t - 72) / 30, 0.5, 1.0, ("cb", "vla") if t < 88 else ("cb", "vc", "vla", "vln"))
    if t >= 80:
        bd(t, "mp" if t < 88 else "f", 0.7)
    if t >= 88:
        for dt in (1.5, 2.0, 3.0, 3.5):
            if t + dt < 103:
                bd(t + dt, "p" if dt != 3.0 else "mp", 0.55)
        timp(t, "D" if ch in ("Dm", "Bb", "Gm") else "A", 0.8, 0.8)
one(CRASH_MP, 88, 0.25)
# tema no alto
melody([(88 + t, d, m) for t, d, m in THEME[:7]], SOLO, 0.62, double=(VLN, 0, 0.32))
melody([(96, 2, 84), (98, 1, 86), (99, 1, 81), (100, 2, 86), (102, 1.5, 85)], SOLO, 0.66, double=(VLN, -12, 0.35))
# acentos dos pares de palavras
for k in ("par1", "par2", "par3"):
    t = H[k]
    timp(t, "D", 0.95, 0.9)
    note(CB_SPIC, t, 0.3, 38, 1.0, 0.002, 0.3, pan=0.3)
    note(VC_SPIC, t, 0.3, 50, 1.0, 0.002, 0.3, pan=0.35)
    whoosh(t - 0.55, 0.9, 0.12)
note(VLN, 102.5, 4.0, 86, 0.3, 0.6, 1.5, (1.0, 0.4), pan=-0.3)
whoosh(103.4, 1.6, 0.12)

# ---------------------------------------------------------- ATO 3 — A IDENTIDADE
# O chamado ecoa / voltar (103,5–116): tema com eco, harpa
progression([("Dm", 104, 4), ("Bb", 108, 4), ("F", 112, 4)], 0.27, 1.5)
for ch, t, d in [("Bb", 108, 4), ("F", 112, 4)]:
    harp(ch, t, d, 0.5, 0.24, 12)
ECO = [(104.5, 1, 69), (105.5, 2, 74), (107.5, 1, 76), (108.5, 3, 77), (111.5, 0.5, 76), (112, 0.5, 74), (112.5, 2, 72), (114.5, 1, 69), (115.5, 1, 72)]
melody(ECO, SOLO, 0.48)
melody([(t + 0.75, d, m) for t, d, m in ECO], SOLO, 0.25, pan=0.35, gain=0.45)
melody([(t + 1.5, d, m) for t, d, m in ECO], SOLO, 0.18, pan=-0.4, gain=0.25)

# É tempo (116–128,5): três impactos e crescendo
progression([("Dm", 116, 1)], 0.3, 0.6)
for k, ch, m in (("tempo1", "Dm", 81), ("tempo2", "Bb", 84), ("tempo3", "Gm", 86)):
    t = H[k]
    timp(t, "D", 0.95, 1.0)
    bd(t, "ff", 0.85)
    sub_boom(t, gain=0.45)
    for mm in (38, 50):
        note(CB_SPIC if mm < 45 else VC_SPIC, t, 0.3, mm, 1.0, 0.002, 0.3, pan=0.3)
    pad(ch, t, 3.0, 0.45, 0.06, 0.6)
    note(SOLO, t, 3.0, m, 0.6, 0.1, 0.4, bus="solo")
t0 = 124.0
for m in (74, 76, 77, 81):
    note(VLN_TREM, t0, H["corteClimax"] - t0, m, 0.7, 0.2, 0.05, (0.15, 1.0, 2.0), pan=-0.3)
for m in (50, 57):
    note(VC_TREM, t0, H["corteClimax"] - t0, m, 0.7, 0.2, 0.05, (0.15, 1.0, 2.0), pan=0.3)
one(TIMP_ROLL[0], t0, 0.7, semis=TIMP_ROLL[1], length=H["corteClimax"] - t0)
one(BD["roll"], t0, 0.5, length=H["corteClimax"] - t0)
for t in (124, 125, 125.5, 126, 126.25, 126.5, 126.75, 127.0, 127.25):
    timp(t, "D", 0.6 + 0.4 * (t - 124) / 3.25, 0.7)
one(GONG, 0, 0.55, bus="sfx", reverse=True, end_at=H["corteClimax"])
noise_riser(t0, H["corteClimax"], 0.35)
cut(H["corteClimax"], H["climax"] - 0.004)

# ---------------------------------------------------------- ATO 4 — A REVELAÇÃO
T = H["climax"]
impact(T, True, "D")
CL = [("Dm", T, 4), ("Bb", T + 4, 4), ("F", T + 8, 4), ("C", T + 12, 4), ("Dm", T + 16, 4), ("Bb", T + 20, 4)]
# 128,5–136,5: tutti forte | 136,5–144,5: respiração (Atos 3:19) | 144,5–152,5: reconstrução
for i, (ch, t, d) in enumerate(CL):
    vel = [0.85, 0.8, 0.5, 0.5, 0.65, 0.8][i]
    pad(ch, t, d + 0.25, vel, 0.05 if i in (0, 4) else 0.4, 1.2)
    if i in (2, 3):
        harp(ch, t, d, 0.5, 0.3, 12)
for k, (ch, t, d) in enumerate(CL):
    if k in (0, 1):
        ostinato(ch, t, d, 0.75, VC_SPIC, 12, pan=0.3)
        ostinato(ch, t, d, 0.7, VLA_SPIC, 24, pan=0.05, gain=0.8)
        for dt in (0, 1.5, 2.0, 3.0, 3.5):
            bd(t + dt, "ff" if dt == 0 else "mp", 0.75)
        timp(t, "D", 1.0, 0.9)
    if k in (4, 5):
        v = 0.55 if k == 4 else 0.8
        ostinato(ch, t, d, v, VC_SPIC, 12, pan=0.3)
        ostinato(ch, t, d, v * 0.9, VLA_SPIC, 24, pan=0.05, gain=0.8)
        ostinato(ch, t, d, v * 0.8, VLN_SPIC, 36, pan=-0.3, gain=0.6)
        for dt in (0, 1.5, 2.0, 3.0, 3.5):
            bd(t + dt, "f" if dt == 0 else "p", 0.7)
        timp(t, "D" if ch != "Bb" else "A", 0.9, 0.85)
CLIMAX_THEME = [(0, 1, 81), (1, 2, 86), (3, 1, 88), (4, 3, 89), (7, 0.5, 88), (7.5, 0.5, 86),
                (8, 2, 84), (10, 1, 81), (11, 1, 84), (12, 2, 88), (14, 1, 86), (15, 1, 84),
                (16, 1, 81), (17, 2, 86), (19, 1, 88), (20, 2, 89), (22, 1, 91), (23, 1, 93)]
melody([(T + t, d, m) for t, d, m in CLIMAX_THEME], SOLO, 0.8, double=(VLN, 0, 0.6), gain=1.1)
melody([(T + t, d, m - 12) for t, d, m in CLIMAX_THEME], VLA, 0.55, "cordas", 0.1, 0.8)
melody([(T + 8, 2, 57), (T + 10, 1, 53), (T + 11, 1, 55), (T + 12, 2, 52), (T + 14, 2, 55)], VC, 0.5, "cordas", 0.35)
one(CRASH_MP, H["camisa"], 0.3)
one(TIMP_ROLL[0], H["logo"] - 1.6, 0.6, semis=TIMP_ROLL[1], length=1.6)
one(GONG, 0, 0.35, bus="sfx", reverse=True, end_at=H["logo"])

# LOGO (152,5): Si bemol maior largo
T = H["logo"]
impact(T, True, "A")
pad("Bb", T, 4.2, 0.85, 0.03, 1.5, cresc=(1.0, 0.45))
note(CB, T, 4.2, 34, 0.9, 0.02, 1.5, (1.0, 0.4))
note(SOLO, T, 4.0, 94, 0.75, 0.05, 1.0, (1.0, 0.5), bus="solo")
note(VLN, T, 4.0, 82, 0.6, 0.05, 1.0, (1.0, 0.5), pan=-0.3)
harp("Bb", T, 4.0, 0.25, 0.25, 12)
# assinatura: Lá sus4 → Lá → Ré MAIOR (terça de Picardia)
pad("Asus", T + 4, 2.1, 0.4, 0.6, 0.6)
pad("A", T + 6, 2.1, 0.42, 0.4, 0.6)
melody([(T + 4, 2, 86), (T + 6, 2, 85)], SOLO, 0.5)
T = H["acordeFinal"]
pad("D", T, 7.0, 0.5, 0.25, 2.5, cresc=(1.0, 0.35, 0.8))
note(CB, T, 7.0, 38, 0.5, 0.3, 2.5, (1.0, 0.35))
note(SOLO, T, 6.5, 90, 0.5, 0.4, 2.5, (1.0, 0.3), bus="solo")
for i, m in enumerate([50, 57, 62, 66, 69, 74, 78, 81, 86]):
    note(HARP, T + i * 0.09, 4.5, m, 0.38, 0.003, 3.0, bus="harpa", pan=-0.4)
timp(T, "D", 0.5, 0.6)
one(GONG_MF, T, 0.2)

# ------------------------------------------------------------------ mixagem
print("mixando…")


def reverb_ir(rt60=3.6, pre=0.025, seed=1):
    r = np.random.default_rng(seed)
    n = int((rt60 + 0.5) * SR)
    t = np.arange(n) / SR
    ir = np.zeros((n, 2), np.float32)
    for c in range(2):
        w = r.standard_normal(n)
        lo = signal.sosfilt(signal.butter(2, 500, "lowpass", fs=SR, output="sos"), w)
        mid = signal.sosfilt(signal.butter(2, [500, 4000], "bandpass", fs=SR, output="sos"), w)
        hi = signal.sosfilt(signal.butter(2, 4000, "highpass", fs=SR, output="sos"), w)
        ir[:, c] = (lo * np.exp(-6.9 * t / (rt60 * 1.15)) + mid * np.exp(-6.9 * t / rt60) * 0.9
                    + hi * np.exp(-6.9 * t / (rt60 * 0.45)) * 0.5)
    ir[: int(0.006 * SR)] *= np.linspace(0, 1, int(0.006 * SR))[:, None]
    ir = np.pad(ir, ((int(pre * SR), 0), (0, 0)))
    return ir / np.sqrt((ir ** 2).sum() / 2)


def conv(x, ir):
    return np.stack([signal.fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], 1).astype(np.float32)


IR_HALL = reverb_ir(3.8, 0.03, 1)
IR_ROOM = reverb_ir(1.6, 0.012, 2)
hp = signal.butter(2, 32, "highpass", fs=SR, output="sos")
sends = {"cordas": 0.32, "solo": 0.38, "harpa": 0.42, "perc": 0.22, "sfx": 0.15, "sub": 0.0}
gains = {"cordas": 1.0, "solo": 0.9, "harpa": 0.75, "perc": 0.9, "sfx": 0.9, "sub": 0.8}
wet = np.zeros((N, 2), np.float32)
musica = np.zeros((N, 2), np.float32)
sfx = np.zeros((N, 2), np.float32)
for k, b in BUS.items():
    dry = b * gains[k]
    w = conv(dry, IR_HALL) * sends[k] + (conv(dry, IR_ROOM) * 0.12 if k in ("perc", "sfx") else 0)
    tgt = sfx if k in ("sfx", "sub") else musica
    tgt += dry * (1 - sends[k] * 0.5) + w
# automação de volume da música (dB) — mais presença no ato 2, sem brigar com a narração
AUTO = [(0, 0), (19, 0), (21, 3), (52, 3), (58, 2), (66, 3), (72, 5), (88, 4), (103, 2), (116, 2), (127, 0), (170, 0)]
ta, ga = zip(*AUTO)
musica *= (10 ** (np.interp(np.arange(N) / SR, ta, ga) / 20))[:, None].astype(np.float32)
for c0, c1s, c1m in CORTES:
    for x, c1 in ((musica, c1m), (sfx, c1s)):
        i, j, r = int(c0 * SR), int(c1 * SR), int(0.02 * SR)
        x[i - r : i] *= np.linspace(1, 0, r)[:, None]
        x[i:j] = 0
musica = signal.sosfilt(hp, musica, axis=0).astype(np.float32)
sfx = signal.sosfilt(hp, sfx, axis=0).astype(np.float32)

# fim: fade de 2 s e corte em DUR
for x in (musica, sfx):
    e = int(DUR * SR)
    f = int(2.5 * SR)
    x[e - f : e] *= np.linspace(1, 0, f)[:, None] ** 1.5
    x[e:] = 0


def soft_limit(x, ceiling=0.89):
    """Limitador suave por blocos de 2,9 ms (ataque imediato, liberação de 250 ms), teto ≈ −1 dBFS."""
    B = 128
    nb = len(x) // B + 1
    pk = np.pad(np.abs(x).max(1), (0, nb * B - len(x))).reshape(nb, B).max(1)
    pk = np.maximum(pk, np.concatenate([pk[1:], [0]]))  # antecipa um bloco
    g = np.minimum(1.0, ceiling / np.maximum(pk, 1e-9))
    a_rel = math.exp(-B / (0.25 * SR))
    out = np.empty_like(g)
    cur = 1.0
    for i in range(nb):
        cur = g[i] if g[i] < cur else a_rel * cur + (1 - a_rel) * g[i]
        out[i] = cur
    gs = np.interp(np.arange(len(x)), np.arange(nb) * B + B / 2, out)
    return (x * gs[:, None]).astype(np.float32)


def to48(x):
    return signal.resample_poly(x, 160, 147, axis=0).astype(np.float32)


mix = musica + sfx
peak = float(np.abs(mix).max())
norm = 0.5 / peak  # pré-ganho; loudness final ajustado pelo ffmpeg (loudnorm) abaixo
os.makedirs(a.saida, exist_ok=True)
tmp = {}
for nome, x in (("trilha-musica", musica * norm), ("trilha-sfx", sfx * norm), ("filme-mix", mix * norm)):
    y = to48(x)[: int(DUR * 48000)]
    p = os.path.join(a.saida, f"_{nome}.wav")
    sf.write(p, y, 48000, subtype="FLOAT")
    tmp[nome] = p


def loudness(p):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", p, "-af", "ebur128=peak=true", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    i = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", r)[-1])
    tp = float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", r)[-1])
    return i, tp


# Alvo: mix em −16 LUFS (deixa espaço para a narração; o master final com voz vai a −14).
i_mix, _ = loudness(tmp["filme-mix"])
gain_db = -16.0 - i_mix
g = 10 ** (gain_db / 20)
for nome, p in tmp.items():
    y, _ = sf.read(p, dtype="float32")
    y = soft_limit(y * g, 0.74)
    if nome == "filme-mix":
        sf.write(os.path.join(a.saida, "filme-mix.wav") if a.wav else p, y, 48000, subtype="PCM_24")
        src = os.path.join(a.saida, "filme-mix.wav") if a.wav else p
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-b:a", "320k", os.path.join(a.saida, "filme-mix.mp3")], check=True)
    else:
        sf.write(os.path.join(a.saida, f"{nome}.flac"), y, 48000, subtype="PCM_24")
for p in tmp.values():
    if os.path.exists(p):
        os.remove(p)
for f in ["trilha-musica.flac", "trilha-sfx.flac", "filme-mix.mp3"]:
    p = os.path.join(a.saida, f)
    i, tp = loudness(p)
    print(f"{f}: {i:.1f} LUFS, pico {tp:.1f} dBFS")
print("ok")
