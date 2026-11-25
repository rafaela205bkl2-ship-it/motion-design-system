# ref-004-pinturas-fragmentos-16x9

> Ficha de referência. Os campos marcados como **(auto)** foram preenchidos por `npm run analisar-referencia`.
> Todo o resto é observação humana, feita na folha de contato a 2 fps.

## Identificação
| Campo | Valor |
| --- | --- |
| Arquivo original **(auto)** | ScreenRecording_11-25-2026 16-46-43_1.mp4 (Drive da produção UMADSAL 2027; não versionado, `--sem-copia`) |
| Duração **(auto)** | 13,75 s |
| Resolução / fps **(auto)** | 1640×2360 · ~60 fps (gravação de tela de iPad) |
| Recorte usado na análise **(auto)** | 1112:624:384:350 |
| BPM estimado **(auto)** | 80,7 (ver confiança em analise/resumo.json) |
| Origem (de onde veio, quem fez) | peça de apresentação de produto exibida numa galeria de referências de motion (gravação de tela) |
| Natureza do material | gravação de tela |
| Proporção da peça | 16:9 |
| Marca(s) presentes (NÃO reproduzir) | nome do produto/estúdio nos títulos |
| Direitos | uso apenas como referência interna |
| Etiquetas da galeria | Typography, Product UI, Mixed media, 2D animation · Editorial, Technical, Minimal · Manifesto · Kinetic type, Compositing, UI choreography · Moderate · Music-led |

## Resumo em uma frase
Manifesto curto que **fragmenta pinturas clássicas** (barroco/renascimento) em recortes com rótulos técnicos,
montando e dispersando composições ao lado de frases em **serifa editorial** sobre off-white.

## Observações (com tempo)
| Tempo | Categoria | Observação |
| --- | --- | --- |
| 0,0–2,0 s | texto · composição | frase em serifa distribuída em diagonal ("…/ in the eye / of the machine"), palavras em posições diferentes; pequenos recortes de pintura flutuam com micro-rótulos técnicos |
| 2,0–2,5 s | transições | dissolve com desfoque para uma composição em escala de cinza |
| 2,5–3,5 s | efeitos | recortes coloridos destacados com caixas azuis (detecção) sobre a base cinza |
| 3,5–4,0 s | transições | zoom com desfoque de movimento como transição |
| 4,0–5,0 s | composição | composição emoldurada com linhas ligando a fragmentos separados abaixo (diagrama "explodido"), com rótulos |
| 5,5–6,5 s | câmera | pintura em tela cheia, leve aproximação |
| 7,0–9,0 s | texto · elementos | nova frase em serifa; fragmentos se dispersam ao redor |
| 10–11 s | efeitos | imagem se desfaz em blocos de pixel |
| 11,5–13,7 s | texto | número grande em serifa formado por fragmentos de pintura, contando |

## Padrões
- **Recorrentes com outras referências** (citar ids): composição com muito espaço vazio (001, 004); frases curtas de manifesto (003, 004).
- **Particulares desta referência:** pinturas clássicas como matéria-prima gráfica; serifa editorial; rótulos técnicos pequenos; montagem/dispersão de fragmentos.

## Mapeamento para a biblioteca
| Padrão observado | Já existe? (componente/preset/token) | Ação |
| --- | --- | --- |
| aproximação em detalhe de pintura | não | **implementado:** `CameraPlate` |
| frase em serifa revelada com desfoque | sim — `TextReveal` (fonte do tema) | nenhuma |
| rótulos técnicos pequenos | sim — `TextReveal` com `textPresets.rotulo` | usado como "legenda de museu" no filme 2027 |
| dissolve com desfoque | sim — `blurDissolve` | nenhuma |
| fragmentos que se montam/dispersam | não | candidato a componente (não usado no filme 2027) |
| dissolução em blocos de pixel | não | candidato |

## Limitações desta análise
- Peça curta (13,75 s) e gravação de tela; resolução efetiva ~1112×624.
- Usada no filme UMADSAL 2027 como referência de tratamento de pinturas e da voz serifada; nada do produto, textos ou trilha foi reproduzido.
