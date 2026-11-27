# ref-005-app-viagens-monitor-9x16

> Ficha de referência. Os campos marcados como **(auto)** foram preenchidos por `npm run analisar-referencia`.
> Todo o resto é observação humana — **só registre o que conseguiu ver nos quadros** (folha-contato.png e sequências).

## Identificação
| Campo | Valor |
| --- | --- |
| Arquivo original **(auto)** | ref3.mp4 |
| Duração **(auto)** | 29.96 s |
| Resolução / fps **(auto)** | 1284×2778 · 59.6294 fps |
| Recorte usado na análise **(auto)** | 1000:1700:150:350 |
| BPM estimado **(auto)** | 123.0 (ver confiança em analise/resumo.json) |
| Origem (de onde veio, quem fez) | pasta REFERENCIAS da cliente Aline Barbosa (post de terceiros); citada no código como `ref-aline-03` |
| Natureza do material | gravação de tela (post mostrando a peça num monitor) |
| Proporção da peça | 9:16 |
| Marca(s) presentes (NÃO reproduzir) | companhia aérea, logotipo, aeronave, legenda do curso |
| Direitos | uso apenas como referência interna |

## Resumo em uma frase
Peça de app de viagens muito rápida (~0,5 s por evento): celular 3D com câmera que mergulha na tela, cursor clicando e cartões que saem da tela.

## Observações (com tempo)
| Tempo | Categoria | Observação |
| --- | --- | --- |
| 0,0–1,5 s | elementos | cartão de check-in inclinado em 3D sobre cor sólida |
| 3,0–3,5 s | texto | frase digitada com cursor colorido à frente |
| 5,0–5,4 s | transições | faixa diagonal (~45°) cruza a tela e abre a próxima cena |
| 6,0–7,0 s | câmera | celular metálico gira mostrando a lateral; câmera mergulha na tela |
| 7,0–9,5 s | elementos | seta clica nos ícones de serviço, de perto; ícone ativo muda de cor; câmera desliza entre eles |
| 6,5–7,5 s | texto | rótulo em duas caixas ('Tudo num / lugar só.') sobre o celular |
| 10,0–12,0 s | elementos | cartão da interface se solta da tela do celular e vem para frente; número dispara |

## Padrões
- **Recorrentes com outras referências:** ritmo de 0,5–1,5 s por evento e bumbo em todos os tempos (003, 004, 005); celular/cartão 3D (003, 005); número disparando (003, 004, 005).
- **Particulares desta referência:** ver observações.

## Mapeamento para a biblioteca
| Padrão observado | Já existe? |
| --- | --- |
| frase digitada | sim — `TypeOn` |
| faixa diagonal | sim — `diagonalWipe` / `faixa-diagonal` |
| celular com espessura | sim — `Device3D` |
| câmera que mergulha/desliza | sim — `keyframes` |
| cursor clicando | sim — `TapCursor` |
| cartão sai da tela | padrão de cena (translateZ dentro de `Device3D`) |

## Limitações desta análise
- Gravação de tela: a peça está dentro de um monitor filmado; o recorte é aproximado e há reflexos.
- O áudio tem locução por cima da música; o BPM automático pode ser afetado.
