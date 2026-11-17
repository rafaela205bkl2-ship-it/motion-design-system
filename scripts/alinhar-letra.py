"""
Alinha a LETRA de uma música ao áudio real e devolve o tempo de cada palavra.

Usa o Vosk com uma gramática restrita às frases da letra: o reconhecedor só
procura palavras que sabemos que existem, o que funciona mesmo com voz cantada.
Só são registradas palavras efetivamente reconhecidas — trechos não detectados
ficam de fora (não invente tempos para eles).

Uso:
  npm run alinhar-letra -- <audio-ou-video> <letra.txt> --modelo <pasta-modelo> [--saida palavras.json]

  letra.txt: uma frase por linha, exatamente como cantada.
  O vídeo/áudio é convertido para WAV 16 kHz mono com ffmpeg.

Preparação (uma vez por ambiente):
  pip install vosk          # se falhar ao compilar a dependência "srt", use:
                            # pip install --no-deps vosk && pip install cffi tqdm requests websockets
                            # (este script cria um módulo "srt" vazio se ele faltar)
  curl -L -O https://alphacephei.com/vosk/models/vosk-model-small-pt-0.3.zip && unzip vosk-model-small-pt-0.3.zip
  (o host alphacephei.com precisa estar liberado na rede do ambiente)
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile
import types
import wave

try:
    import srt  # noqa: F401
except ImportError:  # o Vosk só usa "srt" para exportar legendas
    sys.modules["srt"] = types.ModuleType("srt")
from vosk import KaldiRecognizer, Model, SetLogLevel  # noqa: E402

ap = argparse.ArgumentParser()
ap.add_argument("midia")
ap.add_argument("letra")
ap.add_argument("--modelo", required=True)
ap.add_argument("--saida", default="palavras.json")
ap.add_argument("--pausa", type=float, default=0.9, help="silêncio (s) que separa frases no resumo")
a = ap.parse_args()

frases = [l.strip().lower() for l in open(a.letra, encoding="utf-8") if l.strip()]
SetLogLevel(-1)
with tempfile.TemporaryDirectory() as tmp:
    wav = os.path.join(tmp, "a.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.midia, "-vn", "-ac", "1", "-ar", "16000", wav], check=True)
    rec = KaldiRecognizer(Model(a.modelo), 16000, json.dumps(frases + ["[unk]"], ensure_ascii=False))
    rec.SetWords(True)
    wf = wave.open(wav, "rb")
    palavras = []
    while True:
        d = wf.readframes(4000)
        if not d:
            break
        if rec.AcceptWaveform(d):
            palavras += json.loads(rec.Result()).get("result", [])
    palavras += json.loads(rec.FinalResult()).get("result", [])

palavras = [w for w in palavras if w["word"] != "[unk]"]
json.dump(palavras, open(a.saida, "w"), ensure_ascii=False, indent=1)
print(f"{len(palavras)} palavras reconhecidas → {a.saida}  (? = confiança < 0,7)")
linha, ultimo = [], -9.0
for w in palavras + [None]:
    if w is None or (w["start"] - ultimo > a.pausa and linha):
        if linha:
            print(f"  {linha[0]['start']:7.2f}–{linha[-1]['end']:7.2f}  " + " ".join(x["word"] + ("" if x["conf"] >= 0.7 else "?") for x in linha))
        linha = []
    if w is not None:
        linha.append(w)
        ultimo = w["end"]
