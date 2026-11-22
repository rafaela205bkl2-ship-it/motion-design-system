# Catálogo da reference-library

Índice de todas as referências. Adicione uma linha por referência nova (ver [README.md](README.md)).

| Id | Proporção | Duração | BPM | Estilo | Natureza | Traços principais | Ficha |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ref-001-app-financeiro-16x9 | 16:9 | 35,6 s | ~105 (baixa confiança) | calmo | gravação de tela | interface, monocromático, trocas com desfoque, contador, logotipo em traço | [ficha](ref-001-app-financeiro-16x9/ficha.md) |
| ref-002-produto-vibrante-9x16 | 9:16 | 26,5 s | ~131 | vibrante | gravação de tela | produto herói, ciclos de cor radiais, padrão tipográfico, texto atrás do objeto | [ficha](ref-002-produto-vibrante-9x16/ficha.md) |
| ref-003-abertura-faixas-16x9 | 16:9 | 44,7 s | — | vibrante | gravação de tela | faixas escalonadas sobre o corte, palavra única sobre o vídeo, fileiras de texto | [ficha](ref-003-abertura-faixas-16x9/ficha.md) |
| ref-004-anuncio-3d-roxo-9x16 | 16:9 em 9:16 | 35,6 s | ~105 | calmo/misto | filmado de monitor | objetos 3D em órbita, contador com barras, inundação de cor + cartão final | [ficha](ref-004-anuncio-3d-roxo-9x16/ficha.md) |

## Padrões recorrentes consolidados

Traços vistos em **2 ou mais** referências. São a base da identidade, implementada no tema `base`.

| Padrão | Referências | Implementado em |
| --- | --- | --- |
| Revelação esquerda→direita com opacidade + desfoque | 001, 002 | `TextReveal` |
| Troca de texto com dissolve + desfoque (~6 q) | 001, 002 | `TextSwap` |
| Saída com desfoque rápido (2–4 q) | 001, 002 | `TextReveal exitAt` |
| Transições curtas (5–7 q) | 001, 002 | tokens `fast`, `base` |
| Expansão radial a partir de um ponto | 001, 002 | `radialReveal` |
| Elemento vira transição | 001, 002 | `radialReveal origin` + zoom (parcial) |
| Entradas de ~0,5 s com sobra ≤ 7% | 001, 002 | `ObjectEnter`, token `enter` |
| Composição centralizada, poucos elementos | 001, 002 | MASTER_STYLE_GUIDE §5 |
| Encerramento: logotipo → assinatura parada (3–5 s) | 001, 002 | token `outro`, MASTER_STYLE_GUIDE §8 |
| Sem sincronia sistemática com a batida | 001, 002 | MASTER_STYLE_GUIDE §9 (acentos apenas) |

Quando uma referência nova repetir um traço que hoje é "particular", mova-o para esta tabela e avalie implementar.
