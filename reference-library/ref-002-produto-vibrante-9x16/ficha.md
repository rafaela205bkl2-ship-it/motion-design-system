# ref-002-produto-vibrante-9x16

> Referência "B" da análise original. Análise detalhada, com todos os tempos:
> [docs/referencias/analise-referencias.md](../../docs/referencias/analise-referencias.md).
> Métricas automáticas em `analise/` (geradas por `npm run analisar-referencia`).

## Identificação
| Campo | Valor |
| --- | --- |
| Arquivo original **(auto)** | 0cb9469f-snapinsta-1794885266728.mp4 (SHA-256 `f05ac68f…23210`) |
| Duração **(auto)** | 26,47 s |
| Resolução / fps **(auto)** | 720×1280 · 30 fps (da gravação) |
| Recorte usado na análise **(auto)** | 410:800:126:164 (player na tela do notebook) |
| BPM estimado **(auto)** | ~131, confiança alta |
| Origem | postagem de rede social, enviada pela usuária |
| Natureza do material | **gravação de tela** (celular filmando notebook) com textos sobrepostos ("100% COM IA", "COMENTA QUERO PARA APRENDER") |
| Proporção da peça | 9:16 |
| Marca presente (NÃO reproduzir) | logotipo "havaianas", produto chinelo |
| Direitos | uso apenas como referência interna |

## Resumo em uma frase
Produto herói com movimento de peso, cores saturadas que trocam a cada cena por expansões radiais e tipografia em padrão.

## Observações principais (com tempo)
| Tempo | Categoria | Observação |
| --- | --- | --- |
| 0,07–0,55 s | elementos | produto cai do topo: velocidade quase constante e desaceleração no fim (16 q) |
| 0,4–0,9 s | composição | texto "Sabe aquele chinelo" ATRÁS do produto |
| 1,0–1,5 s e 17,27–17,53 s | efeitos | anéis concêntricos coloridos a partir do contorno |
| 2,07–3,5 s | texto | padrão "LEVE LEVE…" em fileiras atrás do produto |
| 4,2–4,53 s | elementos | produto → linha → sublinhado do logotipo |
| 14,27–14,87 s | transições | ciclo de cor por radiais sucessivos (teal → rosa → amarelo) |
| 17,97–18,3 s | texto | logotipo revelado da esquerda para a direita, 12 q, ~linear |
| 21,7 s | transições | radial vermelho de 5 q, easeInQuad, a 59 ms de uma batida |
| 21,7–26,4 s | ritmo | créditos parados por 4,7 s; música some e há 1,46 s de silêncio |

## Padrões
- **Recorrentes com ref-001:** os mesmos 10 traços listados em ref-001.
- **Particulares:** multicolor saturado; produto herói com física; ciclos de cor; padrão tipográfico; texto atrás do objeto; anéis concêntricos; partículas; wipe em formato de pinceladas; CTA dentro da peça.

## Mapeamento para a biblioteca
| Padrão | Existe? | Ação |
| --- | --- | --- |
| queda com peso e pouso | sim — `ObjectEnter motion="fall"` (com achatamento) | — |
| pop com sobra ≤ 7% | sim — `ObjectEnter motion="pop"` | — |
| texto atrás do objeto | sim — ordem de `Layer` (ver demo `Energia`) | — |
| padrão tipográfico | sim — `KineticType` | — |
| ciclo de cor radial | sim — `ColorBloom` | — |
| radial rápido | sim — `radialReveal` (`radial-rapido`) | — |
| ritmo denso e saturado | sim — tema `vibrante` | — |
| anéis concêntricos do contorno | **não** | candidato: `OutlineRings` |
| partículas (bolhas, respingos) | **não** | candidato: `Particles` |
| wipe em pinceladas | **não** | candidato: transição `brushWipe` |
| objeto → linha → logotipo | **não** | candidato: transformação de formas (`@remotion/paths`) |

## Limitações desta análise
- Gravação com leve perspectiva: medidas aproximadas.
- O áudio pode ter sido adicionado na postagem.
- "mudancas_bruscas" em `analise/resumo.json` conta 7, mas só 1 é corte seco: as outras são transições radiais rápidas.
