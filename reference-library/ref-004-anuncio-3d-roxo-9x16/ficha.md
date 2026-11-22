# ref-004-anuncio-3d-roxo-9x16

> Ficha de referência. Os campos marcados como **(auto)** foram preenchidos por `npm run analisar-referencia`.
> Todo o resto é observação humana — **só registre o que conseguiu ver nos quadros** (folha-contato.png e sequências).

## Identificação
| Campo | Valor |
| --- | --- |
| Arquivo original **(auto)** | ref2.mp4 |
| Duração **(auto)** | 35.62 s |
| Resolução / fps **(auto)** | 720×1280 · 30 fps |
| Recorte usado na análise **(auto)** | — |
| BPM estimado **(auto)** | 105.5 (ver confiança em analise/resumo.json) |
| Origem (de onde veio, quem fez) | pasta de referências da produção Feira das Nações 2026 (Drive da dona do projeto) |
| Natureza do material | vídeo filmado de um monitor (há teclado e parede no quadro); a peça ocupa a faixa central |
| Proporção da peça | 16:9 (exibida num monitor, gravada em 9:16) |
| Marca(s) presentes (NÃO reproduzir) | marca de banco digital, logotipo e mascote roxo — NÃO reproduzir |
| Direitos | uso apenas como referência interna |

## Resumo em uma frase
O que esta referência ensina: objetos 3D e contadores sobre fundo claro, paleta monocromática roxa, encerramento chapado na cor da marca.

## Observações (com tempo)
| Tempo | Categoria | Observação |
| --- | --- | --- |
| 0,0–0,5 s | texto | palavra grande enche a tela sobre roxo chapado |
| 1,0–1,5 s | texto | frase revelada palavra a palavra; a segunda palavra na cor de destaque |
| 12,0 s | elementos | objeto 3D avança em direção à câmera e ocupa a tela (transição por objeto) |
| 16,0–17,0 s | elementos | ícones 3D em órbita ao redor de um texto central |
| 23,0–25,0 s | texto | valor numérico conta até o final enquanto barras sobem em escada |
| 30,5–31,5 s | transições | a cor da marca inunda a tela e o logotipo surge no centro |
| 32,0–35,6 s | ritmo | cartão final parado com assinatura (≈3,6 s) |

Categorias: texto · elementos · transições · câmera · efeitos · easing · ritmo · composição · áudio/sincronia.

## Padrões
- **Recorrentes com outras referências** (citar ids): destaque de uma palavra na cor de acento (ref-001); encerramento parado em cor sólida (ref-001, ref-002).
- **Particulares desta referência:** órbita de objetos 3D em torno do texto; contador com barras.

## Mapeamento para a biblioteca
| Padrão observado | Já existe? (componente/preset/token) | Ação |
| --- | --- | --- |
| destaque de palavra | sim — `TextReveal` com `*palavra*` | nenhuma |
| contador até o valor final (23–25 s) | não | **implementado** — `CountUp` |
| objetos em órbita / volume 3D (16–17 s) | não | **implementado** — `Globe3D` (globo em linhas girando) |
| inundação de cor + cartão final (30,5–35,6 s) | sim — `ColorBloom` + `TextReveal` | nenhuma |

## Limitações desta análise
- Gravação de um monitor: cor e contraste alterados pela câmera; só movimento e ritmo são confiáveis.

-
