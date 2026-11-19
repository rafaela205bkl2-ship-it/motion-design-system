# ref-003-cartaz-animado-9x16

> Ficha de referência. Os campos marcados como **(auto)** foram preenchidos por `npm run analisar-referencia`.
> Todo o resto é observação humana — **só registre o que conseguiu ver nos quadros** (folha-contato.png e sequências).

## Identificação
| Campo | Valor |
| --- | --- |
| Arquivo original **(auto)** | d5c78d77-5hnzbg.mp4 |
| Duração **(auto)** | 42.40 s |
| Resolução / fps **(auto)** | 720×1280 · 30 fps |
| Recorte usado na análise **(auto)** | — |
| BPM estimado **(auto)** | 139.7 (ver confiança em analise/resumo.json) |
| Origem (de onde veio, quem fez) | enviado pela usuária em 19/11/2026 como referência para "13 Anos Depois" |
| Natureza do material | original (cartaz de evento animado) |
| Proporção da peça | 9:16 |
| Marca(s) presentes (NÃO reproduzir) | título, nome do evento, fotos de pessoas e logotipo da instituição |
| Direitos | uso apenas como referência interna |

## Resumo em uma frase
O que esta referência ensina: um cartaz estático vira peça em loop (~14 s) com estouro de luz, revelação por desfoque, riscos de luz desenhados que cruzam as figuras e acabamento de filme quente.

## Observações (com tempo)
| Tempo | Categoria | Observação |
| --- | --- | --- |
| 0,00–0,40 s | transições | vazamento de luz creme/amarelo cobre a tela inteira (estouro) |
| 0,40–2,30 s | transições | imagem sai do desfoque; figuras surgem em camadas de cima para baixo |
| 0,67–1,10 s | texto | título em letras 3D extrudadas entra em arco e assenta em ~1,1 s |
| 0,40–1,30 s | elementos | risco de luz laranja (traço desenhado, várias linhas paralelas) cruza a tela em zigue-zague |
| 4,5 / 9,0 / 11,5 / 13,5 / 19,0 / 31,0 s | elementos | novos riscos de luz, ~0,5–0,8 s cada, passando sobre e entre as figuras |
| 13,30–13,60 s | efeitos | troca brusca de cor para vermelho/laranja e mancha vermelha vazando pela borda inferior |
| 14,0 / 28,0 / 41,5 s | ritmo | estouro de luz repete: o ciclo da peça tem ~14 s |
| contínuo | efeitos | faíscas e poeira subindo, grão, arranhões, brilho de sol no topo |
| contínuo | composição | título no topo, figuras no centro, informações agrupadas no terço inferior com margens largas |

Categorias: texto · elementos · transições · câmera · efeitos · easing · ritmo · composição · áudio/sincronia.

## Padrões
- **Recorrentes com outras referências** (citar ids): texto atrás/na frente de figuras (ref-002); acento de cor em ciclo (ref-002).
- **Particulares desta referência:** estouro de luz como transição de ciclo; riscos de luz desenhados; grade sépia.

## Mapeamento para a biblioteca
| Padrão observado | Já existe? (componente/preset/token) | Ação |
| --- | --- | --- |
| estouro de luz | **implementado** — `LightLeak` | usado em vigilia |
| risco de luz desenhado | **implementado** — `LightStreak` | usado em vigilia |
| faíscas subindo em fluxo contínuo | **implementado** — `Embers` | usado em vigilia |
| revelação por desfoque | sim — `blurDissolve` | nenhuma |
| faíscas/poeira, grão | sim — `Particles`, `FilmLook` | nenhuma |
| grade quente | sim — `Grade` | nenhuma |

## Limitações desta análise
- Observado em folha de contato a 2 fps e sequências a 7,5–15 fps; easing não medido.
