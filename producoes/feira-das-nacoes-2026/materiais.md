# Materiais — Feira das Nações 2026

O vídeo base (99 MB) não é versionado. Para reconstruir a pasta `public/producoes/feira-das-nacoes-2026/videos/`:

```bash
curl -L -o /tmp/oficial.mov "https://drive.usercontent.google.com/download?id=1WZzI4rNQUdR1zGQO0HdymIY7pUy7fC2t&export=download&confirm=t"
```

```bash
ffmpeg -i /tmp/oficial.mov -c copy -movflags +faststart public/producoes/feira-das-nacoes-2026/videos/oficial.mp4
```

(O remux `-c copy` não recodifica: H.264 + AAC idênticos ao original.)

## Medições usadas (dados.ts)
- **Cortes** (`ffmpeg -vf "select='gt(scene,0.25)'"`): 3,23 · 6,77 · 10,17 · 28,27 · 32,00 · 36,30 · 40,77 · 50,27 · 52,70 · 56,30 · 61,33 s.
- **Falas:** Whisper large-v3 com tempo por palavra (pastor 10,8–28,1 s; missões 41,1–50,1 s), revisadas à mão.

## Render
```bash
npx remotion render feira-das-nacoes-2026-16x9 out/feira-das-nacoes-2026-16x9.mp4 --concurrency=4 --timeout=120000 --crf=18
```
Em ambientes com proxy HTTPS que intercepta TLS (sessões na nuvem), o Chrome do Remotion precisa usar o proxy para baixar as fontes:
`--chromium-flags='{"no-proxy-server":false,"proxy-server":"http://127.0.0.1:<porta>","proxy-bypass-list":"<-loopback>;localhost;127.0.0.1"}'`.
