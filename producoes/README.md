# Produções

Cada produção tem três lugares:

| Pasta | Conteúdo | Quem edita |
| --- | --- | --- |
| `producoes/<slug>/` | `roteiro.md`, `briefing.md`, `referencias.md` (entradas) | você |
| `public/producoes/<slug>/` | `imagens/`, `videos/`, `audio/` (materiais) | você |
| `src/producoes/<slug>/` | `timeline.json` (gerado do roteiro) + `Producao.tsx` (vídeo) | gerado; refinado no código |

`producoes/_modelo/` guarda os modelos copiados por `npm run nova-producao`.

O passo a passo completo está em [PRODUCTION_WORKFLOW.md](../PRODUCTION_WORKFLOW.md).
