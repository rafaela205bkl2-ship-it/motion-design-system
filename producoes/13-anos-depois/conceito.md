# Etapa 2 — Concepção

## Conceito criativo: "O tempo é o objeto"

O vídeo não mostra GTA VI. Ele mostra **o tempo passando**, e o universo do jogo é onde esse tempo aconteceu.

O fio condutor é um objeto físico: **o número do ano**. Ele nasce como "2013", em 3D, na frente de Los Santos.
Atravessa o vídeo girando como um odômetro (2018, 2022, 2026), se desmonta em cartões de memória e,
no ponto de virada, o último dígito vira o sol de Vice City. No fim, sobra um "13" sozinho: treze anos.

A linguagem da ref-001 entra como gramática: **elemento vira transição**, objetos com peso e sombra suave,
texto que se constrói com desfoque, cartões flutuando em profundidade e composição parada com elementos em movimento.
O universo de GTA VI entra como **matéria**: as cenas reais são placas por trás, dentro e através dos objetos gráficos.

## Direção de arte: "Hora Dourada"

Três climas, um por ato, para não ficar tudo neon:

| Clima | Atos | Visual |
| --- | --- | --- |
| **Memória** | cenas 1–8 | GTA V com cor lavada e quente, grão leve, TV de tubo; fundo creme nos momentos gráficos (respiro da ref-001) |
| **Travessia** | cenas 9–16 | preto profundo → pôr do sol de Vice City; rosa, laranja e roxo só na luz e nos acentos |
| **Silêncio** | cenas 17–21 | quase monocromático: azul-noite e creme; um único acento laranja |

**Paleta proposta** (vira um tema da biblioteca com `createTheme`, sem mexer nos três atuais):

| Papel | Cor | Uso |
| --- | --- | --- |
| Noite | `#0B0A10` | fundo dos momentos de silêncio |
| Crepúsculo | `#2A1745` | sombras e fundo da travessia |
| Rosa pôr do sol | `#FF5C8A` | destaque principal (palavra-chave) |
| Laranja hora dourada | `#FF8A3D` | luz, sol, acento final |
| Azul oceano | `#2B4C9B` | segundo acento, frio |
| Creme areia | `#F4E9DA` | papel dos momentos gráficos e texto sobre o escuro |

Contraste a conferir no protótipo (regra do DESIGN.md: texto ≥ 3:1 sobre o fundo).

**Tipografia** (Google Fonts, nada da identidade oficial):
- **Bricolage Grotesque 800**, já na biblioteca: números gigantes e frases de impacto.
- **Instrument Serif itálico**: frases de memória ("Tudo parecia diferente."). O contraste serifa/grotesca separa passado e presente.
- O nome do jogo no fim é **texto** nessa tipografia. **Não** recriamos o logotipo oficial nem usamos a fonte Pricedown.

## Storyboard (9:16, 1080×1920, ~68 s)

Área segura do TikTok respeitada: nada importante nos 280 px de baixo (legenda e botões) nem na faixa direita de ícones.
Texto principal entre ~22% e ~70% da altura.

| # | Tempo | Texto na tela | Imagem | Movimento e integração |
| --- | --- | --- | --- | --- |
| 1 | 0,0–1,5 | — | preto | linha de TV de tubo abre na horizontal; chiado. **Gancho visual.** |
| 2 | 1,5–5,0 | **2013** · "Uma geração inteira encontrou um novo mundo." | GTA V: Los Santos ao pôr do sol | número 3D gigante em primeiro plano; câmera avança devagar; carro cruza ao fundo, **atrás** do número (integração 3) |
| 3 | 5,0–7,5 | "Tudo parecia *diferente*." | GTA V: Vinewood de dia | palavra nasce longe, aproxima-se e passa pela câmera (integração 6) |
| 4 | 7,5–10,0 | "Outros sonhos. Outros *planos*." | GTA V: praia | frase presa ao plano, acompanha a panorâmica (integração 1) |
| 5 | 10,0–13,0 | **2018** · "Os anos passaram." | fundo creme | odômetro gira 2013 → 2018; dígitos se soltam e viram cartões |
| 6 | 13,0–16,0 | **2022** · "Novos consoles. Novas fases da vida." | cartões com cenas de GTA V | cartões empilham e viram como fotos antigas |
| 7 | 16,0–20,0 | "*Quando* vamos voltar?" | creme, desfoque | cartões de comentário genéricos (escritos por nós, sem nomes reais) flutuam em profundidade, como os chips da ref-001 |
| 8 | 20,0–24,0 | **2026** | creme → preto | odômetro trava; o "0" se acende e vira um ponto de luz |
| 9 | 24,0–26,0 | "Então, o *silêncio* acabou." | preto | trilha corta; o ponto de luz respira no centro |
| 10 | 26,0–30,0 | "Uma cidade *renasce*." | GTA VI: Vice City ao pôr do sol | o ponto vira sol; partículas de Los Santos se reorganizam no horizonte de Vice City. **Virada do vídeo.** |
| 11 | 30,0–33,0 | "Novas histórias *começam*." | GTA VI: praia | cartão atravessa a tela e revela a cena (integração 2) |
| 12 | 33,0–37,0 | "*Jason* e *Lucia*" | imagens oficiais dos dois | dois cartões 3D entram girando e se encaixam lado a lado, com nome e brilho que atravessa (integração 4) |
| 13 | 37,0–40,0 | "Além de tudo que *conhecemos*." | GTA VI: Vice City à noite | texto em profundidade; luz da cidade reflete no texto (integração 8) |
| 14 | 40,0–42,5 | "Talvez a maior viagem" | GTA VI: carro em perseguição | ritmo sobe; palavra presa ao movimento da câmera |
| 15 | 42,5–45,5 | "não seja por *Vice City*." | GTA VI: helicóptero | formas geométricas viram transição (integração 5) |
| 16 | 45,5–49,0 | "Talvez seja perceber" | montagem em cartões: veículos, praia, noite | cartões rápidos (~0,5 s cada) num palco 3D |
| 17 | 49,0–53,0 | "quanto *tempo* passou" | cartão de 2013 e cartão de 2026 lado a lado | ritmo cai; câmera recua devagar |
| 18 | 53,0–57,0 | "desde a última vez que estivemos *aqui*." | fade para creme | — |
| 19 | 57,0–61,0 | "Treze anos *depois*." | noite | silêncio; "13" em 3D gira devagar |
| 20 | 61,0–65,0 | versão publicada: "Hoje, a história *continua*." · pós: "A história *continua*." | noite | — |
| 21 | 65,0–70,0 | GRAND THEFT AUTO VI · 19.11.2026 · "produção de fã, não oficial" | noite, brilho laranja | título em tipografia própria, composição 3D sóbria; data parada |

**Encerramento em duas versões** (uma propriedade da composição, sem refazer animação):
- **Versão publicada (pedido da usuária):** "Hoje, a história continua."
- **A partir de 19/11/2026:** "A história continua." e a data vira referência ("Desde 19.11.2026").

## Câmera

- **Placas do jogo:** avanço lento (escala 1,00 → 1,08 em 3–4 s), deriva lateral de ~22 px, parallax entre placa e texto.
- **Momentos gráficos:** composição parada, os elementos se movem (como na ref-001).
- **Travessia (cenas 9–10):** um único movimento contínuo: aproximação do ponto de luz até ele virar sol.
- **Montagem (cena 16):** cartões passam por um palco 3D fixo; a câmera só inclina.

## Trilha e desenho de som

| Ato | Trilha | Efeitos |
| --- | --- | --- |
| Memória (0–24 s) | introdução atmosférica: pad quente, piano esparso | TV ligando, chiado, clique de odômetro a cada ano |
| Silêncio (24–26 s) | corte total | só um grave longo |
| Travessia (26–49 s) | entrada da batida (~100 BPM), crescimento | whoosh centrado nas transições, impacto no sol, sweep nos cartões |
| Silêncio final (49–65 s) | volta ao pad, sem batida | respiração, um sino grave no "13" |
| Encerramento (65–70 s) | acorde final; termina depois do cartão parar | acento no título |

Loudness de entrega: −14 LUFS, pico abaixo de −1 dBTP (MASTER_STYLE_GUIDE §9).
Áudio dos trailers **não** é usado. Locução, se houver, entra numa trilha separada sem mudar os tempos.

## Elementos 3D necessários

Números 2013/2018/2022/2026/13 com volume · cartões de memória com vídeo dentro · cartões de comentário ·
ponto de luz/sol · partículas · formas geométricas de transição · título final com profundidade.
Nenhum personagem é desenhado ou recriado: Jason e Lucia aparecem **só** nas imagens oficiais fornecidas.

## Organização dos arquivos

A estrutura pedida foi mapeada para a arquitetura que já existe, para não criar um segundo sistema:

| Pedido | Onde fica |
| --- | --- |
| /references | `reference-library/` + `producoes/13-anos-depois/referencias.md` |
| /assets, /audio | `public/producoes/13-anos-depois/{imagens,videos,audio}/` |
| /scenes | `src/producoes/13-anos-depois/cenas/` |
| /components, /animations, /typography | `src/motion/` (biblioteca, reutilizável por outras produções) |
| /storyboard | `producoes/13-anos-depois/` (este arquivo, roteiro, narração) |
| /exports | `out/` (não versionado) |

## Plano das próximas etapas

- **Etapa 3, protótipo (~12 s):** cenas 2 (2013 em 3D sobre Los Santos) e 10–12 (troca de mundo e cartões de Jason e Lucia).
  Valida o 3D em CSS, a integração com placa real e a legibilidade no celular. Renderizo quadros-chave e um MP4 curto.
- **Etapa 4:** componentes novos na biblioteca + as 21 batidas.
- **Etapa 5:** render 1080×1920 H.264 30 fps e revisão completa.
