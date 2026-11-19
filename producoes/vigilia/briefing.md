# Briefing — Vigília

## Objetivo
- Transformar a arte estática do evento "Vigília" (12 de dezembro, 21h, AD. Paralela) num vídeo de divulgação.
- Ação esperada: comparecer ao evento (entrada = inscrição + 1 kg de alimento).

## Público e canal
- Público: jovens da Umadsal e da igreja.
- Publicação: Instagram Reels e Stories.
- Formato: 9:16, 1080 × 1920, MP4 H.264, 30 fps.

## Estilo
- Referência principal: ref-003 (cartaz animado em loop): estouro de luz, revelação por desfoque,
  título em 3D, riscos de luz desenhados, faíscas, grade sépia e quente.
- Ferramentas: biblioteca de motion (`src/motion`), sem GTA nem outras produções.
- Cores e tipografia: as da própria arte (sépia, marrom, laranja, creme). O título usa as letras da arte.

## Duração e ritmo
- 15 s, em loop (a ref-003 tem ciclos de ~14 s). O fim encontra o começo no estouro de luz.

## Áudio
- Trilha original sintetizada por `scripts/gerar-trilha-vigilia.py` (−14 LUFS), sincronizada aos eventos visuais.

## Materiais entregues
| Arquivo | Onde está | Uso |
| --- | --- | --- |
| vigilia-original.jpg (1080×1350) | producoes/vigilia/arte/ | fonte de todas as camadas |
| camadas.json | producoes/vigilia/arte/ | contornos traçados à mão e áreas de texto |
| camadas geradas | public/producoes/vigilia/imagens/ | `npm run camadas -- producoes/vigilia/arte/camadas.json` |

## Direitos
- Arte, fotos e marcas (Assembleia de Deus, Umadsal) fornecidas pela dona do projeto para esta divulgação.
