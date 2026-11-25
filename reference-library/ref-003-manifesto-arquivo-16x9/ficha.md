# ref-003-manifesto-arquivo-16x9

> Ficha de referência. Os campos marcados como **(auto)** foram preenchidos por `npm run analisar-referencia`.
> Todo o resto é observação humana, feita nas folhas de contato a 2 fps (tempos com precisão de ~0,5 s).

## Identificação
| Campo | Valor |
| --- | --- |
| Arquivo original **(auto)** | ScreenRecording_11-25-2026 16-44-01_1.mp4 (Drive da produção UMADSAL 2027; não versionado, `--sem-copia`) |
| Duração **(auto)** | 83,13 s |
| Resolução / fps **(auto)** | 1640×2360 · ~50 fps (gravação de tela de iPad) |
| Recorte usado na análise **(auto)** | 1112:626:384:297 |
| BPM estimado **(auto)** | 147,7 (baixa confiança: há locução por cima) |
| Origem (de onde veio, quem fez) | filme de marca exibido numa galeria de referências de motion (gravação de tela) |
| Natureza do material | gravação de tela |
| Proporção da peça | 16:9 |
| Marca(s) presentes (NÃO reproduzir) | marca de mercado de previsões (logotipo, cartões de marca, slogans) e marcas/rostos de arquivo |
| Direitos | uso apenas como referência interna |
| Etiquetas da galeria | Mixed media, Typography, 3D, Live action · Cinematic, Bold, Editorial · Manifesto · Rapid cutting, Kinetic type, Compositing, Split screen · Escalating · Voiceover |

## Resumo em uma frase
Manifesto narrado que usa **material de arquivo histórico** unificado por gradação monocromática e grão, com
cortes que **aceleram** ao longo da peça, tipografia curta que pontua a locução e cartões tipográficos gigantes.

## Observações (com tempo)
| Tempo | Categoria | Observação |
| --- | --- | --- |
| 0,0–3,9 s | composição | abertura em cartão de marca sobre papel creme; grotesca condensada muito pesada |
| 3,9–9,9 s | ritmo · elementos | objetos em macro (conchas, sal, ouro, contas) entram pela direita sobre preto → azul-marinho; troca a cada ~0,3–0,5 s mantendo a mesma composição |
| 3,9–9,9 s | texto | rótulo curto em caixa alta, pequeno, no canto inferior esquerdo, fixo enquanto as imagens trocam |
| 9,9–13 s | efeitos | arquivo P&B tingido de azul-acinzentado, grão forte, vinheta |
| 13–17 s | ritmo | cédulas antigas em macro, coloridas, substituições a cada ~0,5 s |
| 17–20 s | texto | legenda construída palavra a palavra no canto inferior esquerdo ("WHAT ACTUALLY…"), acompanhando a locução |
| 20–40 s | câmera · efeitos | montagem de arquivo (céu, bolsa, rostos) sempre com movimento lento; mesma gradação azul unifica fontes diferentes |
| 40–55 s | ritmo · efeitos | escalada: cortes mais curtos, linhas de varredura, falhas (glitch), números de cotação |
| 57,5–60 s | composição | tela dividida em mosaico de arquivo + legenda |
| 59,5–61,5 s | texto | tipografia gigante preta sobre creme, cortada pelas bordas do quadro, entrando palavra a palavra |
| 61,5–70 s | efeitos | troca de gradação: duotone oliva/sépia |
| 69,5–72,5 s | texto | recortes de jornal em serifa com uma frase marcada em amarelo; foco seletivo |
| 72,5–76,5 s | câmera | push-in lento num entrevistado; respiro antes do final |
| 76,5–80 s | texto | cartões tipográficos gigantes sobre creme (frase final em duas linhas) |
| 80–83 s | composição | assinatura: logotipo sobre creme, parado |

## Padrões
- **Recorrentes com outras referências** (citar ids): encerramento logotipo → assinatura parada (001, 002, 003); poucos elementos por quadro (001, 002, 003).
- **Particulares desta referência:** arquivo histórico com gradação monocromática; grão/vinheta fortes; montagem que acelera; legenda curta que pontua a locução (não transcreve); tipografia gigante cortada; troca de gradação por ato.

## Mapeamento para a biblioteca
| Padrão observado | Já existe? (componente/preset/token) | Ação |
| --- | --- | --- |
| movimento lento e contínuo sobre imagem de arquivo | não | **implementado:** `CameraPlate` |
| grão, vinheta, tremor de projeção, tingimento, letterbox | parcial (`Backdrop` tem grão) | **implementado:** `FilmLook` |
| clarão nos cortes de impacto | não | **implementado:** `Flash` |
| substituição rápida mantendo a composição | — | padrão de montagem (sequência de `CameraPlate` com corte seco) |
| frase que corrige a anterior (tipografia editorial) | não | **implementado:** `TextStrike` |
| legenda palavra a palavra | sim — `TextReveal by="word"` | nenhuma |
| tipografia gigante cortada pelas bordas | não | candidato (não usado no filme 2027) |

## Limitações desta análise
- Gravação de tela: a peça ocupa só o recorte central; resolução efetiva ~1112×626.
- Tempos lidos a 2 fps (±0,25 s). O áudio mistura locução e música da peça, então o BPM automático não é confiável.
- Usada no filme UMADSAL 2027 apenas como linguagem (arquivo + gradação + escalada); nada da marca, textos ou trilha foi reproduzido.
