# Análise técnica e audiovisual das referências

Análise de dois vídeos de referência feita com FFmpeg/ffprobe e scripts Python (NumPy) em `scripts/`.
Todas as observações têm o tempo de onde foram vistas. O que não pôde ser medido ou confirmado está marcado como **não verificável**.

| Rótulo | Arquivo | Duração |
| --- | --- | --- |
| **A** | `12cd7a78-snapinsta-1794884494080.mp4` | 35,62 s |
| **B** | `0cb9469f-snapinsta-1794885266728.mp4` | 26,47 s |

---

## 0. Natureza do material (afeta tudo o que vem depois)

Os dois arquivos **não são as peças originais**: são gravações, feitas com celular, de uma tela que exibe a peça.

| | A | B |
| --- | --- | --- |
| O que a câmera filma | Monitor horizontal numa mesa (teclado RGB, quadros na parede) | Tela de MacBook com a peça num player vertical; dock e janela de arquivos visíveis ao lado |
| Proporção da peça | **16:9** (laterais levemente cortadas pelo enquadramento) | **9:16** (com leve perspectiva) |
| Sobreposições do autor da postagem | "Opus 5.5 🤯" no topo, fixo | "100% COM IA" no topo e "COMENTA **QUERO** PARA APRENDER" na base, fixos |
| Marca na peça | Logotipo "nu", roxo | Logotipo "havaianas", vermelho |
| Assinatura no fim | "by @…" sobre roxo (texto pequeno, parcialmente legível) | "FEITO POR @leandrosilva.design" + "COMENTA QUERO para aprender a criar um motion assim" |

Consequências:

- **Qualidade:** 720×1280, H.264 com 596–761 kb/s, mais o desfoque e o brilho da tela filmada. Detalhes finos (fontes exatas, texturas, grão) **não são verificáveis**.
- **Medições de movimento:** são aproximações de ±1 quadro, já que os 30 fps da gravação podem não ser os da peça original.
- **Áudio:** é o áudio da postagem. **Não dá para saber** se é a trilha original das peças ou uma música adicionada na publicação.
- **Duas camadas:** a análise separa a **camada de captura** (câmera e sobreposições) da **camada da peça** (o motion em si). Só a segunda serve como referência de identidade.

## 1. Dados técnicos (ffprobe)

| | A | B |
| --- | --- | --- |
| Contêiner | MP4 (ISO 14496-12) | MP4 (ISO 14496-12) |
| Vídeo | H.264 High, 720×1280, yuv420p, BT.709, 30 fps constantes | igual |
| Quadros | 1.065 | 791 |
| Bitrate de vídeo | 596 kb/s | 761 kb/s |
| Áudio | AAC HE, 44,1 kHz, estéreo, 67 kb/s | AAC HE, 48 kHz, estéreo, 72 kb/s |
| Decodificação completa (`ffmpeg -f null`) | sem erros | sem erros |
| Loudness integrado | −14,1 LUFS (LRA 5,2 LU) | −14,1 LUFS (LRA 3,1 LU) |

Os dois têm exatamente −14,1 LUFS, o que é **provavelmente** efeito da normalização de volume da plataforma, não uma decisão de mixagem das peças.

## 2. Estrutura e ritmo de edição

### Mapa de cenas — A (peça 16:9, fundo predominantemente branco)

| Início (s) | Duração | Conteúdo | Entrada |
| --- | --- | --- | --- |
| 0,00 | 0,53 | "Você correu" branco sobre roxo | — |
| 0,53 | 1,17 | "mês inteiro" + mão segurando celular | **corte seco** (único do vídeo) |
| 1,70 | 4,0 | Celular com interface + cards de notificação; texto "Pagou conta." → "Bateu meta." → "Juntou cada real." | dissolve com desfoque |
| 5,73 | 2,2 | "Agora" + "é a vez do seu dinheiro correr!" + moeda 3D | fade para branco |
| ~8,0 | 4,25 | "Abre o nu", caixa 3D abrindo, campo "Minha caixinha", moeda entrando | saída com desfoque |
| 12,3 | 3,6 | Lista Pix / Cartão / Caixinhas / Investimentos + card | zoom através da caixa |
| 15,93 | 1,5 | "No automático" + interruptor + ícones flutuando | ícones "explodindo" para fora |
| 17,5 | 2,4 | Celular: "De dia." → "De noite." → "No fim de semana." | zoom-out a partir do branco |
| ~19,9 | 2,9 | Lista Investido / Rendendo / Guardando / Protegendo com ícones 3D | dissolve |
| 22,9 | 2,7 | Contador R$ 12.476,80 → 12.480,00 + barras | desfoque para branco |
| 25,7 | 2,5 | "Então, enquanto você cuida da sua vida," + chips flutuantes | desfoque para branco |
| 28,23 | 2,1 | "o roxinho [moeda girando] cuida do seu dinheiro." | saída com desfoque |
| 30,40 | 1,7 | Expansão radial roxa → logotipo "nu" desenhado | radial |
| 32,13 | 3,4 | Assinatura "by @…" | saída com desfoque |

### Mapa de cenas — B (peça 9:16, fundos coloridos alternados)

| Início (s) | Duração | Conteúdo | Entrada |
| --- | --- | --- | --- |
| 0,00 | 0,07 | Quadro diferente do restante (parece um quadro de capa) | — |
| 0,07 | ~0,95 | Chinelo cai; "Sabe aquele chinelo" atrás do produto | corte seco |
| 1,0 | 0,6 | Anéis concêntricos coloridos girando a partir do contorno do produto | efeito sobre o objeto |
| 1,6 | 1,9 | Fundo azul + padrão "LEVE LEVE…" + pena + "nem sente no pé" | saída do produto com desfoque |
| 3,5 | 0,77 | Fundo creme; produto gira, muda de laranja para vermelho e vira uma linha | dissolve |
| 4,27 | 0,6 | A linha vira o sublinhado do logotipo "havaianas" | transformação do objeto |
| 4,87 | 1,95 | Fundo bege; chinelo rosa + "grão de arroz na palmilha" | radial |
| 6,9 | 2,55 | Imagem fotorrealista: pé em chinelo rosa sobre vermelho; "Macia e confortável"; bolhas | zoom na textura circular |
| 9,45 | 1,6 | Branco: anel de pontos → "flor" de chinelos coloridos; "Uma cor pra cada dia" | radial branco a partir das bolhas |
| 11,1 | 2,8 | Imagem fotorrealista de praia; "da praia" / "pra rua" / "Brasileira" | íris a partir do centro da flor |
| 13,8 | 0,47 | Formas azuis irregulares sobem → azul chapado; chinelo em traço | wipe em formato de pinceladas |
| 14,27 | 1,7 | "desde 1962"; fundo troca teal → rosa → amarelo | radiais em sequência |
| 16,0 | 1,6 | Azul; padrão "ORIGINAL A ORIGINAL"; produto troca de cor; respingos; anéis de novo | radial |
| 17,6 | 4,1 | Branco: "havaianas" → "Todo mundo usa." → "ORIGINAL DO BRASIL DESDE 1962" | fade para branco |
| 21,7 | 4,67 | Cartão vermelho de créditos + CTA | radial vermelho a partir de um ponto |

### Métricas de ritmo

| | A | B |
| --- | --- | --- |
| Cortes secos (pontuação de cena ≥ 0,30) | 1 (0,53 s) | 1 (0,03 s) |
| Picos de mudança visual na tela | 19 | 19 |
| Intervalo mediano entre picos | 1,13 s | 1,00 s |
| Duração típica de uma cena (tabelas acima) | ~2–4 s | ~0,6–2,8 s |
| Final sem novidades visuais | 3,4 s (assinatura) | 4,7 s (créditos) |

Os dois são **contínuos**: quase nenhuma troca é corte seco, quase tudo é transição ou transformação de elemento. B é mais denso: troca o fundo ou o elemento principal com mais frequência.

## 3. Animações de texto e elementos

### Texto — recorrente nos dois

| Padrão | A (exemplos) | B (exemplos) | Medição |
| --- | --- | --- | --- |
| Revelação da esquerda para a direita, por letra, com opacidade e desfoque | "Agora" 5,87–6,13 s; "mês inteiro" 0,8–0,93 s | "havaianas" 17,97–18,3 s; "Macia" 7,3–7,6 s | "Agora": 8 quadros (0,27 s); logotipo de B: 12 quadros (0,40 s), quase linear |
| Frase construída palavra por palavra | "é a vez do seu dinheiro correr!" 6,27–7,6 s; "Então, enquanto você cuida da sua vida," 25,9–27,9 s | "Todo mundo usa." 18,47–18,97 s | — |
| Troca de texto por dissolve com desfoque | "Bateu meta." → "Juntou cada real." 4,17–4,37 s; "De dia." → "De noite." 18,27 s | "da praia/pra rua" → "Brasileira" 13,33–13,6 s | ~6 quadros (0,2 s) |
| Saída por desfoque rápido | "Agora" 7,87–7,93 s; logotipo 32,07–32,13 s | "Todo mundo usa." 20,0–20,3 s | 2–4 quadros |
| Hierarquia: título grande + linha secundária pequena | "Agora" / "é a vez…" | "Macia" / "e confortável"; "desde" / "1962" | — |
| Frases curtas terminadas em ponto | "Pagou conta.", "Bateu meta.", "De noite." | "Todo mundo usa." | — |

### Texto — exclusivo de A

- **Campo de busca digitado com cursor** ("Minha caixinha", 10,0–10,5 s).
- **Contador com dígitos rolando** como num odômetro, com os últimos dígitos borrados durante o movimento (23,0–24,1 s e 24,9–25,3 s). Ele desacelera até parar em 12.479,53 e depois sobe de novo até 12.480,00.
- **Item ativo de lista destacado**: o item selecionado fica escuro com um marcador, e os outros ficam cinza claro (12,4–15,9 s; 19,9–22,8 s).
- **Deslocamento horizontal rápido de texto com desfoque de movimento**: "Você correu" desliza para a esquerda entre 0,13 e 0,40 s.
- **Gradiente de cor no texto**: "inteiro" em roxo degradê; "Agora" clareia entre 7,2 e 7,9 s.

### Texto — exclusivo de B

- **Tipografia em padrão repetido**: fileiras de "LEVE LEVE…" (2,07–3,5 s) e "ORIGINAL A ORIGINAL" (16,4–17,3 s) em movimento, atrás do produto.
- **Texto atrás do objeto**: "Sabe aquele chinelo" aparece atrás do chinelo (0,4–0,9 s).

### Elementos

| A | B |
| --- | --- |
| Objetos 3D renderizados: moedas, caixa, ícones de app, escudo, mockups de celular | Produto 3D (chinelo) e imagens fotorrealistas (pé, praia) |
| Caixa surge crescendo rápido (9,7–9,9 s); a curva medida é ruidosa porque a tampa também se move | Produto cai do topo com desfoque de movimento e pousa (0,07–0,55 s): velocidade quase constante e desaceleração nos últimos ~4 quadros |
| Cards de notificação empilham, e um novo empurra a lista (4,3–4,6 s) | Produto gira e muda de cor várias vezes (3,8–4,2 s; 16,4–17,2 s) |
| Moedas entram pela direita com desfoque e quicam (4,3–4,6 s) | Pontos em anel se transformam em chinelos dispostos como pétalas (9,8–10,4 s) |
| Interruptor desliga → liga em ~4 quadros (16,53–16,67 s) | Partículas: bolhas brancas subindo (8,6–9,1 s) e respingos (16,5–16,9 s) |
| Barras do gráfico crescem em onda escalonada: 0,53 s, com sobra de ~7% antes de assentar | Chinelo vira linha e a linha vira o sublinhado do logotipo (4,2–4,53 s) |
| Ícones flutuam lentamente pela tela (16,0–17,4 s) | Pena flutuando (1,8–3,5 s) |
| Logotipo desenhado como traço (30,73–31,27 s, ~16 quadros) | — |

## 4. Transições

| Tipo | A | B | Medição |
| --- | --- | --- | --- |
| **Expansão radial a partir de um ponto** até preencher a tela | 1× (30,4 s, roxo, com anel concêntrico) | 7× (4,87; 9,4; 14,27; 14,53; 14,8; 16,0; 21,7 s) | A: 7 quadros, aceleração e desaceleração. B (final): 5 quadros, acelerando (próximo de easeInQuad) |
| **Dissolve ou fade para branco com desfoque** | 7× (1,6; 5,7; 7,9; 17,47; 22,8; 25,6; 28,2 s) | 2× (3,4; 17,6 s) | 2–6 quadros |
| **Transição feita pelo próprio elemento** | Zoom através da caixa (12,1–12,3 s); zoom-out do celular (17,5–17,67 s) | Zoom na textura (6,7–6,8 s); íris pelo centro da flor (11,1–11,4 s); chinelo → linha → logotipo (4,2 s); bolhas → círculo branco (9,4 s) | 3–9 quadros |
| Corte seco | 1× (0,53 s) | 1× (0,03 s) | — |
| Anéis concêntricos girando a partir do contorno do objeto | — | 2× (1,0–1,5 s; 17,27–17,53 s) | — |
| Wipe em formato de pinceladas | — | 1× (13,8–13,93 s) | — |
| "Explosão" de ícones para fora | 1× (15,93–16,0 s) | — | — |

## 5. Movimentos de câmera

### Câmera da captura (não faz parte da peça)

Medido por correlação de fase em regiões fixas do ambiente (moldura do monitor, teclado, dock):

| | A | B |
| --- | --- | --- |
| Velocidade mediana | 0,06–0,10 px por quadro | 0,02–0,03 px por quadro |
| Deslocamento total | até 69 px na vertical, com valores diferentes no topo (26 px) e na base (69 px) | < 8 px |
| Tremor | não perceptível (95% dos quadros abaixo de 0,6 px por quadro) | não perceptível |
| Leitura | Deriva lenta e contínua com mudança de perspectiva (ou inclinação). Não dá para afirmar se é mão estabilizada ou movimento intencional | Praticamente estática (apoio ou tripé) |

### Câmera virtual dentro das peças (observada visualmente)

- **A:** deslocamento horizontal rápido do texto (0,13–0,40 s), zoom-in através da caixa (12,1–12,3 s) e zoom-out revelando o celular (17,5–17,67 s).
- **B:** zoom na textura (6,7–6,8 s), íris (11,1–11,4 s) e câmera acompanhando os pés na praia (11,4–13,9 s, imagem fotorrealista).
- Nenhum dos dois mostra movimento contínuo de câmera nas cenas de interface ou de produto: a composição fica parada e os elementos se movem.

## 6. Efeitos visuais

| Efeito | A | B |
| --- | --- | --- |
| Desfoque em entradas e saídas (de texto e de elementos) | constante | constante |
| Desfoque de movimento em objetos rápidos | moedas, deslocamento do texto, ícones | queda do produto, saídas, pétalas |
| Brilho suave radial no fundo | brilho lilás (25,7–30,3 s) e no cartão roxo final | bordas suaves nas expansões radiais (4,87; 14,27; 21,7 s) |
| Exposição dupla durante dissolves | 1,6–1,73 s; 17,53 s | 3,4–3,6 s |
| Sombras suaves de contato | sob caixa, moedas e cards | sob o produto (14,6 s em diante) |
| Profundidade de campo (elementos desfocados em planos diferentes) | chips flutuantes com níveis de desfoque diferentes (26,0–28,0 s) | — |
| Partículas | — | bolhas e respingos |
| Troca de cor do objeto e do fundo em ciclo | — | 14,27–17,2 s |
| Imagens fotorrealistas | mão com celular (0,53–1,7 s) | pé (6,9–9,45 s) e praia (11,1–13,9 s) |

### Paleta, medida pelo brilho (Y) e pela saturação média da tela

- **A:** saturação baixa na maior parte do tempo, porque os fundos são brancos e lilases. Só há saturação alta no começo (0–0,53 s) e no fim (30,6 s em diante), quando a tela fica roxa. É essencialmente um **monocromático roxo sobre branco**.
- **B:** saturação oscilando entre ~0 e ~80 o tempo todo, com fundos que mudam de cor a cada cena: branco, azul, creme, bege, vermelho, foto, azul, teal, rosa, amarelo, azul, verde, rosa, branco e vermelho. É um **multicolor saturado**.

## 7. Curvas de animação e easing (medidas)

As medições usam máscaras de cor quadro a quadro, ajustadas a curvas padrão. Com 30 fps capturados de uma tela filmada, a precisão é limitada.

| Elemento | Duração | Melhor ajuste | Sobra (overshoot) |
| --- | --- | --- | --- |
| A — expansão radial roxa | 7 q (0,23 s) | easeInOutSine | 0% |
| A — revelação de "Agora" | 8 q (0,27 s) | easeOutQuad (por letra) | 0% |
| A — barras do gráfico (total) | 16 q (0,53 s) | easeInQuad ≈ linear (efeito do escalonamento) | ~7% |
| A — caixa 3D surgindo | ~11 q | inconclusivo (a tampa interfere na medida); visualmente há leve sobra em 9,8 s | — |
| B — expansão radial vermelha | 5 q (0,17 s) | easeInQuad (acelera até cobrir) | 0% |
| B — revelação do logotipo | 12 q (0,40 s) | linear | ~4% |
| B — queda do produto | 16 q (0,53 s) | linear com desaceleração no final | ~2% |

Leitura:

- **Transições de tela inteira** são muito curtas (5–7 quadros) e aceleram.
- **Entradas de texto** duram 0,27–0,40 s, com velocidade constante ou desacelerando.
- **Elementos de dados e objetos** duram ~0,5 s, com pouca sobra (≤ 7%).
- **Molas elásticas exageradas não aparecem em nenhum dos dois.**

## 8. Composição e profundidade

| | A | B |
| --- | --- | --- |
| Grade | 16:9. Texto centralizado nas cenas de frase. Divisão esquerda (lista ou texto) / direita (card ou celular) nas cenas de interface | 9:16. Pilha centralizada: texto no terço superior e produto no centro |
| Camadas | Fundo branco ou lilás → brilho suave → objetos 3D e cards com sombra → texto | Fundo de cor chapada → padrão tipográfico → **texto** → **produto na frente do texto** → partículas |
| Espaço vazio | muito: fundos limpos e poucos elementos por cena | moderado: fundo sempre colorido, às vezes preenchido por padrão |
| Escala dos títulos | grande, centralizada ("Agora", "mês inteiro") | grande ("1962", "Macia"), às vezes alinhada à esquerda ("Macia") |

## 9. Áudio e sincronização

| | A | B |
| --- | --- | --- |
| Conteúdo (espectrograma) | Música com componente vocal: harmônicos curvos entre 300 Hz e 3 kHz, típicos de voz. Não dá para afirmar se é canto ou fala | Música com componente vocal até ~19,6 s; depois, textura mais sustentada e sem esse padrão |
| Percussão grave (< 150 Hz) | Esparsa até ~6,1 s; regular depois. Ataques mais fortes de 30,6 s em diante | Regular desde o início |
| Tempo estimado | ~105 BPM, com baixa confiança (intervalos irregulares, IQR 0,35–0,58 s) | **130,8 BPM**, com boa confiança (IQR 0,42–0,49 s) |
| Distribuição de energia | graves 8% / médios 61% / agudos 30% | graves 21% / médios 61% / agudos 18% |
| Final | Sem silêncio | Música some entre 23,5 e 24,9 s; **1,46 s de silêncio** no fim |

### Sincronia imagem × som (medida)

| | A | B |
| --- | --- | --- |
| Picos visuais a ≤ 100 ms de uma batida | 16% (aleatório: 33%) | 37% (aleatório: 42%) |
| Distância média até a batida | 0,29 s (aleatório: 0,21 s) | 0,17 s (aleatório: 0,14 s) |
| Correlação entre movimento visual e volume | ≈ 0 | ≈ 0 |

**Não há sincronia sistemática com a batida em nenhum dos dois**: os eventos visuais não ficam mais perto das batidas do que instantes aleatórios. Coincidências pontuais:

- **A:** a transição radial para o logotipo (30,6 s) cai a 8 ms do primeiro ataque grave forte do trecho final.
- **B:** o radial vermelho dos créditos (21,73 s) fica a 59 ms de uma batida, e a música termina depois do cartão final.

Como o áudio pode ter sido adicionado na postagem, a falta de sincronia **não prova** que as peças originais não eram sincronizadas.

## 10. Recorrente × particular

### Recorrente nos dois (base da identidade)

1. **Continuidade:** quase sem cortes secos. As cenas se ligam por transição ou por transformação de elemento.
2. **Texto revelado da esquerda para a direita**, por letra ou palavra, com opacidade e desfoque. Trocas por dissolve com desfoque (~0,2 s) e saídas com desfoque rápido (2–4 quadros).
3. **Hierarquia título + linha secundária**, com frases curtas.
4. **Transições curtas** (5–8 quadros) e entradas de 0,27–0,53 s, com pouca ou nenhuma sobra.
5. **Expansão radial** como transição: presente nos dois, frequente em B.
6. **Elemento vira transição**: zoom através de um objeto, objeto que se transforma.
7. **Objetos 3D com sombra suave sobre fundo limpo**, mais imagens fotorrealistas pontuais.
8. **Composição centralizada**, com poucos elementos por quadro.
9. **Encerramento em duas etapas:** logotipo da marca, depois cartão em cor sólida da marca com a assinatura do autor.
10. **Ritmo:** um evento visual a cada ~1 s, com final mais longo e parado (3–5 s).

### Particular de A

- Paleta monocromática (roxo sobre branco) e ritmo mais calmo (cenas de 2–4 s).
- Linguagem de **interface**: celular, cards, notificações, interruptores, campo digitado com cursor, listas com item ativo.
- **Dados**: contador odômetro e barras em onda.
- Narrativa em frases que continuam de uma cena para outra ("Então, enquanto você cuida da sua vida," → "o roxinho cuida do seu dinheiro.").
- Logotipo desenhado como traço, chips com profundidade de campo e brilho lilás.

### Particular de B

- Paleta multicolor saturada, com troca de cor do fundo e do produto em ciclo.
- **Produto como herói**, com movimento quase físico (queda, giro, pouso).
- **Padrões tipográficos repetidos** em movimento e **texto atrás do objeto**.
- Anéis concêntricos girando a partir do contorno, partículas e wipe em formato de pinceladas.
- Transformação chinelo → linha → logotipo, e CTA dentro da própria peça.

## 11. Limitações

- Peças vistas através de uma câmera: fontes, cores exatas e texturas **não são verificáveis**.
- Os 30 fps são da gravação: tempos e easing têm precisão de ±1 quadro, e as curvas são aproximações.
- O áudio pode não ser o original. A voz não foi transcrita.
- Detecção automática de cenas é pouco útil aqui, porque as transições são contínuas. O mapa de cenas foi montado olhando os quadros.
- As peças usam marcas reais (logotipos "nu" e "havaianas"). A identidade deve extrair **padrões de linguagem**, nunca logotipos, mascotes ou elementos dessas marcas.

---

## 12. Recomendações de arquitetura (sem implementação)

A biblioteca atual (`src/lib`) já resolve formatos responsivos, tema e presets de entrada. A proposta é **evoluir** essa base, não recomeçar.

### 12.1 Camadas

```
tokens/        valores puros: tempos, easings, desfoque, cores, tipografia
primitives/    animações atômicas reutilizáveis (texto, número, objeto)
transitions/   apresentações para TransitionSeries
elements/      blocos visuais (card, lista, contador, padrão tipográfico, brilho)
scenes/        moldes de cena (frase, interface, produto, dados, logotipo, créditos)
themes/        "peles" que combinam tokens: ex. monocromático-calmo, multicolor-vibrante
```

**Regra:** cada camada só importa das camadas acima dela na lista. Um tema troca valores, nunca comportamento.

### 12.2 Tokens derivados das medições

| Token | Valor sugerido (30 fps) | Origem |
| --- | --- | --- |
| `transition.fast` | 5 quadros | radial de B (5 q) |
| `transition.base` | 7 quadros | radial de A (7 q) |
| `exit.blur` | 3 quadros | saídas de 2–4 q |
| `textSwap` | 6 quadros | trocas de 0,2 s |
| `reveal.char` | 8–12 quadros por palavra | "Agora" 8 q; logotipo 12 q |
| `enter.object` | 16 quadros | queda e barras (16 q) |
| `hold.min` / `hold.base` | ~1 s / 2–3 s | intervalo de 1,0–1,13 s; cenas de 2–4 s |
| `outro.hold` | 3–5 s | 3,4 s e 4,7 s |
| `ease.enter` | easeOutQuad / easeOutCubic | texto e pouso |
| `ease.wipe` | easeInQuad ou easeInOutSine | radiais |
| `ease.data` | rápido no início, com sobra ≤ 7% | barras |
| `blur.max` | proporcional à unidade `px()` existente | desfoque visto em todas as entradas |

Os tokens devem ser definidos **em segundos** e convertidos para quadros, como já acontece em `useEntrance`.

### 12.3 Primitivas (prioridade pela recorrência)

1. **`CharReveal` / `WordReveal`**: esquerda → direita, opacidade + desfoque, com escalonamento configurável. Recorrente nos dois.
2. **`TextSwap`**: dissolve com desfoque entre dois textos. Recorrente.
3. **`BlurExit`**: saída padrão. Recorrente.
4. **`RollingNumber`**: contador odômetro. Variante de A.
5. **`TypeField`**: digitação com cursor. Variante de A.
6. **`ObjectEnter`**: queda, pouso ou crescimento com sobra controlada. Recorrente com variações.

### 12.4 Transições

| Transição | Prioridade | Parâmetros |
| --- | --- | --- |
| `radialReveal` | alta (recorrente) | ponto de origem (coordenada ou elemento), cor, suavidade da borda, anel opcional |
| `blurDissolve` / `fadeThrough(color)` | alta (recorrente) | cor intermediária, desfoque máximo |
| `zoomThrough` | média (recorrente, na forma de elemento) | alvo, escala final |
| `iris` | baixa (só B) | centro, raio |
| `outlineRings` | baixa (só B) | número de anéis, cores |
| `brushWipe` | baixa (visto uma vez) | — |

As transições devem ser implementadas como apresentações de `@remotion/transitions`, para encaixar no `TransitionSeries` que o projeto já usa.

### 12.5 Moldes de cena

Hook (frase grande) · Interface (texto + mockup) · Produto herói · Dados (contador + barras) · Lista com item ativo · Frase em várias cenas · Logotipo · Créditos/CTA.

Cada molde declara:

- **Layout por formato**, com o `pick()` e o `Stack` existentes. A é 16:9 e B é 9:16, o que confirma que os moldes precisam funcionar nos dois.
- **Pontos de entrada e saída**, para que a transição seguinte possa partir de um elemento (por exemplo, um radial que nasce do logotipo).

### 12.6 Ativos externos

3D (caixas, moedas, produto) e imagens fotorrealistas **não devem ser gerados pela biblioteca**. Recomendo **espaços para ativos** (`<Asset slot="hero">`, PNG/WebM com transparência), com animação de entrada aplicada por cima. O 3D em tempo real (`@remotion/three`) só se justifica depois, se houver necessidade real.

### 12.7 Áudio

As referências **não mostram** sincronia com a batida. Por isso:

- **Sincronia opcional:** um utilitário de grade de batidas (BPM + deslocamento → marcadores em quadros), mas sem impor sincronia por padrão.
- **Pontos de acento:** marcar o radial do logotipo e o cartão final, os momentos que coincidiram nas duas referências.
- **Volume de entrega:** alvo de −14 LUFS, o valor observado nos dois.

### 12.8 Identidade = recorrente; variantes = particular

- **Tema base** com os 10 traços recorrentes.
- **Tema "calmo"** com as particularidades de A: monocromático, interface, dados, cenas mais longas.
- **Tema "vibrante"** com as particularidades de B: multicolor, produto herói, padrões tipográficos, ciclos de cor.

Os dois temas compartilham as mesmas primitivas.

### 12.9 Próximos passos sugeridos

1. Validar esta análise e os tokens com você.
2. Implementar tokens + `CharReveal` / `TextSwap` / `BlurExit` + `radialReveal` / `blurDissolve`, e testar nos 3 formatos.
3. Recriar 2 ou 3 cenas-teste **com conteúdo próprio** (sem as marcas das referências) e comparar ritmo e curvas com as medições deste documento.
