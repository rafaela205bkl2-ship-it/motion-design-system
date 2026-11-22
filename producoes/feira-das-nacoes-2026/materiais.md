# Materiais — Feira das Nações 2026

O vídeo base (99 MB) não é versionado. Para reconstruir a pasta `public/producoes/feira-das-nacoes-2026/videos/`:

```bash
curl -L -o /tmp/oficial.mov "https://drive.usercontent.google.com/download?id=1WZzI4rNQUdR1zGQO0HdymIY7pUy7fC2t&export=download&confirm=t"
```

```bash
ffmpeg -i /tmp/oficial.mov -c copy -movflags +faststart public/producoes/feira-das-nacoes-2026/videos/oficial.mp4
```

(O remux `-c copy` não recodifica: H.264 + AAC idênticos ao original.)

Depois, gere a versão tratada que a produção usa (redução de ruído leve, nitidez e cor):

```bash
ffmpeg -i public/producoes/feira-das-nacoes-2026/videos/oficial.mp4 -vf "hqdn3d=1.2:1.0:4:4,unsharp=5:5:0.55:3:3:0.0,eq=contrast=1.04:saturation=1.1" -c:v libx264 -crf 10 -preset slow -pix_fmt yuv420p -c:a copy -movflags +faststart public/producoes/feira-das-nacoes-2026/videos/oficial-tratado.mp4
```

## Medições usadas (dados.ts)
- **Cortes** (`ffmpeg -vf "select='gt(scene,0.25)'"`): 3,23 · 6,77 · 10,17 · 28,27 · 32,00 · 36,30 · 40,77 · 50,27 · 52,70 · 56,30 · 61,33 s.
- **Falas:** Whisper large-v3 com tempo por palavra (pastor 10,8–28,1 s; missões 41,1–50,1 s), revisadas à mão.

## Render (master quase sem perda → entrega)
```bash
npx remotion render feira-das-nacoes-2026-16x9 out/master.mp4 --concurrency=4 --timeout=120000 --crf=8 --x264-preset=slow --audio-codec=pcm-16
```

```bash
ffmpeg -i out/master.mp4 -c:v libx264 -preset veryslow -tune film -crf 15 -maxrate 10M -bufsize 20M -profile:v high -pix_fmt yuv420p -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 256k -movflags +faststart out/feira-das-nacoes-2026-16x9-final.mp4
```
Em ambientes com proxy HTTPS que intercepta TLS (sessões na nuvem), o Chrome do Remotion precisa usar o proxy para baixar as fontes:
`--chromium-flags='{"no-proxy-server":false,"proxy-server":"http://127.0.0.1:<porta>","proxy-bypass-list":"<-loopback>;localhost;127.0.0.1"}'`.
