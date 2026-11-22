# ref-003-abertura-faixas-16x9

> Ficha de referência. Os campos marcados como **(auto)** foram preenchidos por `npm run analisar-referencia`.
> Todo o resto é observação humana — **só registre o que conseguiu ver nos quadros** (folha-contato.png e sequências).

## Identificação
| Campo | Valor |
| --- | --- |
| Arquivo original **(auto)** | ref1.mp4 |
| Duração **(auto)** | 44.74 s |
| Resolução / fps **(auto)** | 1640×2360 · 43.0807 fps |
| Recorte usado na análise **(auto)** | 2360:1260:0:150 |
| BPM estimado **(auto)** | — (ver confiança em analise/resumo.json) |
| Origem (de onde veio, quem fez) | pasta de referências da produção Feira das Nações 2026 (Drive da dona do projeto) |
| Natureza do material | gravação de tela (tablet) de um modelo de abertura; status bar e controles do player recortados |
| Proporção da peça | 16:9 |
| Marca(s) presentes (NÃO reproduzir) | texto genérico do modelo ("food blog" etc.) — não reproduzir |
| Direitos | uso apenas como referência interna |

## Resumo em uma frase
O que esta referência ensina: faixas e blocos de cor que varrem a tela entre recortes de vídeo, e palavra única sobre o vídeo.

## Observações (com tempo)
| Tempo | Categoria | Observação |
| --- | --- | --- |
| 2,0–2,5 s | composição | palavra repetida em fileiras preenchendo a cor de fundo, recorte de vídeo por cima |
| 4,5–5,0 s | transições | blocos retangulares deslocados entre si entram em sequência e cobrem o vídeo anterior (troca sem corte seco) |
| 13,5–14,5 s | texto | palavra única em caixa alta, espaçada, centralizada sobre recorte de vídeo |
| 16,5–17,0 s | texto | palavra espaçada ("F R E S H") entra sobre cor chapada com linhas desenhadas à mão |
| 18,5–19,0 s | composição | o mesmo vídeo repetido em três painéis lado a lado |
| 29,0–29,5 s | transições | faixas de cor escalonadas atravessam a tela sobre o vídeo e abrem o plano seguinte |

Categorias: texto · elementos · transições · câmera · efeitos · easing · ritmo · composição · áudio/sincronia.

## Padrões
- **Recorrentes com outras referências** (citar ids): palavra repetida em fileiras = `KineticType` (ref-002).
- **Particulares desta referência:** faixas/blocos escalonados como transição sobre o corte; ritmo muito rápido (intervalo mediano 0,28 s).

## Mapeamento para a biblioteca
| Padrão observado | Já existe? (componente/preset/token) | Ação |
| --- | --- | --- |
| fileiras de palavra repetida | sim — `KineticType` | nenhuma |
| faixas escalonadas cobrindo o corte (4,5 s; 29,0 s) | não | **implementado** — `StripeBand` (Feira das Nações 2026) |

## Limitações desta análise
- Gravação de tela a 43 fps variáveis: tempos com precisão de ~0,1 s.

-
