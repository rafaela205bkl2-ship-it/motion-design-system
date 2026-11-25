# Catálogo da reference-library

Índice de todas as referências. Adicione uma linha por referência nova (ver [README.md](README.md)).

| Id | Proporção | Duração | BPM | Estilo | Natureza | Traços principais | Ficha |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ref-001-app-financeiro-16x9 | 16:9 | 35,6 s | ~105 (baixa confiança) | calmo | gravação de tela | interface, monocromático, trocas com desfoque, contador, logotipo em traço | [ficha](ref-001-app-financeiro-16x9/ficha.md) |
| ref-002-produto-vibrante-9x16 | 9:16 | 26,5 s | ~131 | vibrante | gravação de tela | produto herói, ciclos de cor radiais, padrão tipográfico, texto atrás do objeto | [ficha](ref-002-produto-vibrante-9x16/ficha.md) |
| ref-003-manifesto-arquivo-16x9 | 16:9 | 83,1 s | ~148 (baixa confiança, com locução) | cinematográfico | gravação de tela | manifesto narrado, arquivo histórico com gradação monocromática, grão, montagem que acelera, tipografia gigante | [ficha](ref-003-manifesto-arquivo-16x9/ficha.md) |
| ref-004-pinturas-fragmentos-16x9 | 16:9 | 13,8 s | ~81 | editorial | gravação de tela | pinturas clássicas fragmentadas, serifa editorial, rótulos técnicos, montagem/dispersão | [ficha](ref-004-pinturas-fragmentos-16x9/ficha.md) |

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
| Encerramento: logotipo → assinatura parada (3–5 s) | 001, 002, 003 | token `outro`, MASTER_STYLE_GUIDE §8 |
| Manifesto: frases curtas que pontuam (não transcrevem) | 003, 004 | `TextReveal`, `TextStrike`; usado no filme UMADSAL 2027 |
| Imagem fixa (arquivo/pintura) sempre em movimento lento | 003, 004 | `CameraPlate` |
| Sem sincronia sistemática com a batida | 001, 002 | MASTER_STYLE_GUIDE §9 (acentos apenas) |

Quando uma referência nova repetir um traço que hoje é "particular", mova-o para esta tabela e avalie implementar.
