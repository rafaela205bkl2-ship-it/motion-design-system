# ref-003-app-financeiro-azul-monitor-9x16

> Ficha de referência. Os campos marcados como **(auto)** foram preenchidos por `npm run analisar-referencia`.
> Todo o resto é observação humana — **só registre o que conseguiu ver nos quadros** (folha-contato.png e sequências).

## Identificação
| Campo | Valor |
| --- | --- |
| Arquivo original **(auto)** | ref1.mp4 |
| Duração **(auto)** | 25.82 s |
| Resolução / fps **(auto)** | 720×1280 · 30 fps |
| Recorte usado na análise **(auto)** | 400:560:160:250 |
| BPM estimado **(auto)** | 143.6 (ver confiança em analise/resumo.json) |
| Origem (de onde veio, quem fez) | pasta REFERENCIAS da cliente Aline Barbosa (post de terceiros); citada no código como `ref-aline-01` |
| Natureza do material | gravação de tela (post mostrando a peça num monitor) |
| Proporção da peça | 9:16 |
| Marca(s) presentes (NÃO reproduzir) | banco/app fictício do autor, legenda do post |
| Direitos | uso apenas como referência interna |

## Resumo em uma frase
Peça de app financeiro em azul elétrico: celular e telas em 3D, números disparando e um final de chamada com clique.

## Observações (com tempo)
| Tempo | Categoria | Observação |
| --- | --- | --- |
| 0,0–1,5 s | câmera | celular entra inclinado em X/Y e endireita, com desfoque de movimento |
| 2,5–3,5 s | texto | saldo dispara até o valor em ~0,6 s, desacelerando forte no fim |
| 6,0–7,0 s | texto | palavra-chave enorme sobre tela branca, em duas linhas com pesos diferentes |
| 12,0–14,0 s | câmera | tela gira em Y com perspectiva forte, mostrando a espessura |
| 2º trecho 0,4–1,4 s | elementos | ícone do app gira em 3D com as letras do nome em órbita (frente/atrás) |
| 2º trecho 4,0 s | transições | anel claro fecha sobre a tela antes da troca |
| 2º trecho 5,0–10,0 s | elementos | final: botão clicado ✓, depois cartão 'seguir' entra embaixo |

## Padrões
- **Recorrentes com outras referências:** ritmo de 0,5–1,5 s por evento e bumbo em todos os tempos (003, 004, 005); celular/cartão 3D (003, 005); número disparando (003, 004, 005).
- **Particulares desta referência:** ver observações.

## Mapeamento para a biblioteca
| Padrão observado | Já existe? |
| --- | --- |
| celular/tela inclinada que pousa | sim — `Tilt3D`, `Device3D` |
| número disparando | sim — `CountUp` |
| letras em órbita | sim — `OrbitText` |
| clique em botão | sim — `TapCursor` |

## Limitações desta análise
- Gravação de tela: a peça está dentro de um monitor filmado; o recorte é aproximado e há reflexos.
- O áudio tem locução por cima da música; o BPM automático pode ser afetado.
