# ref-001-app-financeiro-16x9

> Referência "A" da análise original. Análise detalhada, com todos os tempos:
> [docs/referencias/analise-referencias.md](../../docs/referencias/analise-referencias.md).
> Métricas automáticas em `analise/` (geradas por `npm run analisar-referencia`).

## Identificação
| Campo | Valor |
| --- | --- |
| Arquivo original **(auto)** | 12cd7a78-snapinsta-1794884494080.mp4 (SHA-256 `9ebbe4b5…be3e4`) |
| Duração **(auto)** | 35,62 s |
| Resolução / fps **(auto)** | 720×1280 · 30 fps (da gravação) |
| Recorte usado na análise **(auto)** | 720:410:0:392 (área do monitor) |
| BPM estimado **(auto)** | ~105, confiança baixa |
| Origem | postagem de rede social, enviada pela usuária |
| Natureza do material | **gravação de tela** (celular filmando monitor) com texto sobreposto pelo autor ("Opus 5.5 🤯") |
| Proporção da peça | 16:9 (laterais levemente cortadas pela filmagem) |
| Marca presente (NÃO reproduzir) | logotipo "nu", identidade roxa de um banco digital |
| Direitos | uso apenas como referência interna |

## Resumo em uma frase
Linguagem de interface calma e monocromática: textos que se constroem palavra por palavra, trocas com desfoque e transições quase sempre contínuas.

## Observações principais (com tempo)
| Tempo | Categoria | Observação |
| --- | --- | --- |
| 0,53 s | transições | único corte seco do vídeo |
| 5,87–6,13 s | texto | "Agora" revelado letra a letra com desfoque, 8 q, ~easeOutQuad |
| 4,17–4,37 s | texto | troca "Bateu meta." → "Juntou cada real." por dissolve com desfoque (~6 q) |
| 10,0–10,5 s | texto | campo digitado com cursor |
| 12,1–12,3 s | câmera | zoom através da caixa 3D como transição |
| 23,0–25,3 s | elementos | contador estilo odômetro + barras em onda (0,53 s, sobra ~7%) |
| 30,4 s | transições | expansão radial roxa (7 q, easeInOutSine), a 8 ms de um ataque grave |
| 30,73–31,27 s | elementos | logotipo desenhado como traço |
| 32,1–35,5 s | ritmo | assinatura parada por 3,4 s |

## Padrões
- **Recorrentes com ref-002:** revelação esquerda→direita com desfoque; troca com desfoque; transições de 5–7 q; expansão radial; elemento como transição; objetos 3D com sombra suave; ~1 evento visual/s; encerramento logotipo → assinatura; sem sincronia sistemática com a batida.
- **Particulares:** monocromático; interface (celular, cards, interruptor, campo digitado, lista com item ativo); contador e barras; frase que continua entre cenas; logotipo em traço; profundidade de campo.

## Mapeamento para a biblioteca
| Padrão | Existe? | Ação |
| --- | --- | --- |
| revelação letra/palavra com desfoque | sim — `TextReveal` | — |
| troca de texto com desfoque | sim — `TextSwap` | — |
| expansão radial | sim — `radialReveal` (`radial-suave`) | — |
| dissolve / fade para branco | sim — `blurDissolve` (`dissolve`, `fade-branco`) | — |
| profundidade por desfoque | sim — `Layer` | — |
| ritmo calmo, monocromático | sim — tema `calmo` | — |
| contador odômetro | **não** | candidato: `RollingNumber` |
| campo digitado com cursor | **não** | candidato: `TypeField` |
| barras em onda | **não** | candidato: `BarChartGrow` |
| logotipo em traço | parcial (demo `OndulaMark`) | candidato: `StrokeDraw` genérico |
| lista com item ativo | **não** | candidato: `ActiveList` |

## Limitações desta análise
- Peça vista através de uma câmera: fontes e cores exatas não verificáveis; precisão de ±1 quadro.
- O áudio pode ter sido adicionado na postagem.
- "mudancas_bruscas" em `analise/resumo.json` conta 4, mas só 1 é corte seco: as outras são transições rápidas.
