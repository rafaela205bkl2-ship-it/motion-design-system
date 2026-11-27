# Catálogo da reference-library

Índice de todas as referências. Adicione uma linha por referência nova (ver [README.md](README.md)).

| Id | Proporção | Duração | BPM | Estilo | Natureza | Traços principais | Ficha |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ref-001-app-financeiro-16x9 | 16:9 | 35,6 s | ~105 (baixa confiança) | calmo | gravação de tela | interface, monocromático, trocas com desfoque, contador, logotipo em traço | [ficha](ref-001-app-financeiro-16x9/ficha.md) |
| ref-002-produto-vibrante-9x16 | 9:16 | 26,5 s | ~131 | vibrante | gravação de tela | produto herói, ciclos de cor radiais, padrão tipográfico, texto atrás do objeto | [ficha](ref-002-produto-vibrante-9x16/ficha.md) |
| ref-003-app-financeiro-azul-monitor-9x16 | 9:16 | 25,8 s | ~144 (baixa confiança) | vibrante | gravação de tela | celular 3D, número disparando, letras em órbita, final com clique | [ficha](ref-003-app-financeiro-azul-monitor-9x16/ficha.md) |
| ref-004-automotivo-monitor-9x16 | 9:16 | 29,3 s | ~115 (baixa confiança) | vibrante escuro | gravação de tela | rótulos em caixa sólida, valor subindo | [ficha](ref-004-automotivo-monitor-9x16/ficha.md) |
| ref-005-app-viagens-monitor-9x16 | 9:16 | 30,0 s | 123 | vibrante | gravação de tela | celular metálico 3D, câmera que mergulha na tela, cursor, faixa diagonal, texto digitado | [ficha](ref-005-app-viagens-monitor-9x16/ficha.md) |

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
| Celular/cartão em 3D que pousa ou sai da tela | 003, 005 | `Tilt3D`, `Device3D` |
| Número que dispara até o valor | 001, 003, 004, 005 | `CountUp` |

Quando uma referência nova repetir um traço que hoje é "particular", mova-o para esta tabela e avalie implementar.
