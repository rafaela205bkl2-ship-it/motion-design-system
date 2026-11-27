# ref-004-automotivo-monitor-9x16

> Ficha de referência. Os campos marcados como **(auto)** foram preenchidos por `npm run analisar-referencia`.
> Todo o resto é observação humana — **só registre o que conseguiu ver nos quadros** (folha-contato.png e sequências).

## Identificação
| Campo | Valor |
| --- | --- |
| Arquivo original **(auto)** | ref2.mp4 |
| Duração **(auto)** | 29.30 s |
| Resolução / fps **(auto)** | 1284×2778 · 50.6168 fps |
| Recorte usado na análise **(auto)** | 1284:2000:0:300 |
| BPM estimado **(auto)** | 114.8 (ver confiança em analise/resumo.json) |
| Origem (de onde veio, quem fez) | pasta REFERENCIAS da cliente Aline Barbosa (post de terceiros); citada no código como `ref-aline-02` |
| Natureza do material | gravação de tela (post mostrando a peça num monitor) |
| Proporção da peça | 9:16 |
| Marca(s) presentes (NÃO reproduzir) | marca de software e de carro, preços |
| Direitos | uso apenas como referência interna |

## Resumo em uma frase
Peça promocional escura com rótulos em caixa sólida e valores subindo dentro da caixa.

## Observações (com tempo)
| Tempo | Categoria | Observação |
| --- | --- | --- |
| 0,5–1,5 s | texto | valor em caixa vermelha sobe (€487→€540) com números fantasmas desfocados ao fundo |
| 3,0–5,0 s | texto | palavras entram sobre a foto escura, uma de cada vez |
| 6,0–7,0 s | texto | palavra-chave em caixa sólida ('REPROVAR') |
| 12,5–14,0 s | texto | palavra grande muda de cor; segunda linha em peso e cor diferentes |

## Padrões
- **Recorrentes com outras referências:** ritmo de 0,5–1,5 s por evento e bumbo em todos os tempos (003, 004, 005); celular/cartão 3D (003, 005); número disparando (003, 004, 005).
- **Particulares desta referência:** ver observações.

## Mapeamento para a biblioteca
| Padrão observado | Já existe? |
| --- | --- |
| valor subindo | sim — `CountUp` |
| rótulo em caixa sólida | padrão de cena (caixa com scaleX + `TextReveal`) |

## Limitações desta análise
- Gravação de tela: a peça está dentro de um monitor filmado; o recorte é aproximado e há reflexos.
- O áudio tem locução por cima da música; o BPM automático pode ser afetado.
