# Alterações — versão 1 (18/11/2026)

## O que foi feito

**Biblioteca (`src/motion`, registrados em `catalog.ts`, reutilizáveis por qualquer produção):**

| Componente | Arquivo | Para quê |
| --- | --- | --- |
| `Stage3D`, `Plane3D` | `three/Stage3D.tsx` | palco 3D em CSS com câmera e planos em x/y/z |
| `DepthType` | `three/DepthType.tsx` | tipografia extrudada com laterais em degradê e brilho |
| `RollingNumber` | `text/RollingNumber.tsx` | odômetro (candidato da ref-001), funciona em 3D |
| `FootageCard` | `object/FootageCard.tsx` | cartão em perspectiva com conteúdo, borda, sombra, véu e brilho |
| `Particles`, `particleShapes`, `seeded` | `layers/Particles.tsx` | partículas determinísticas que mudam de forma |
| `CameraMove` | `layers/CameraMove.tsx` | câmera sobre placas (avanço, deriva, parallax) |
| `FilmLook`, `CrtReveal` | `layers/FilmLook.tsx` | textura de TV antiga e abertura de TV de tubo |
| `LightSweep` | `layers/LightSweep.tsx` | faixa de luz que atravessa a tela |

Todos aceitam ajustes de tempo (segundos), intensidade, direção e escala, e seguem o tema.

**Runtime:** `ProducaoGenerica` aceita `temas` (temas próprios por estilo, que também colorem os anéis das transições).
As produções existentes não mudam.

**Produção (`src/producoes/13-anos-depois/`):**
- `tema.ts`: quatro climas "Hora Dourada" (memória, creme, travessia, silêncio) com `createTheme`.
- `cenarios.tsx`: cenários procedurais originais (cidade 2013, colinas, praia, pôr do sol, cidade à noite,
  estrada) e `PLACAS`, que troca um cenário por um vídeo ou imagem real quando houver.
- `cenas/Ato1–5.tsx`: as 21 cenas.
- `Producao.tsx`: liga cenas e temas ao runtime.

**Trilha:** `scripts/gerar-trilha-13-anos.py` sintetiza música e efeitos originais a partir da linha do tempo.
Saída em `public/producoes/13-anos-depois/audio/` (trilha final em −14 LUFS; versões separadas de música e efeitos
regeneráveis).

## Limitações desta versão

- **Sem cenas reais do jogo.** A rede deste ambiente recusa rockstargames.com, YouTube, Wikimedia e Behance.
  Os cenários são originais e, por isso, mais gráficos do que cinematográficos.
- **Personagens:** Jason e Lucia aparecem como cartões tipográficos (nomes), sem figura.
- **Nome do jogo:** em tipografia própria, não o logotipo oficial.
- **Gravação do Drive (conceito de UI do Behance):** usada só como estudo de layout; não entra no vídeo
  por ser trabalho autoral de terceiros com marcas da Rockstar.
- **Sem locução:** nenhum serviço de voz disponível; o tempo está reservado para inserir depois.

## Como adicionar seus materiais (sem código)

Arraste os arquivos para `public/producoes/13-anos-depois/materiais/` (pastas e formatos em `LEIA-ME.md`
dentro dela) e rode `npm run materiais`. O comando renomeia, converte vídeos para MP4 H.264 e escreve
`src/producoes/13-anos-depois/materiais.gerado.json`, que as cenas leem. `npm run dev` faz isso sozinho ao abrir
o Studio, e `npm run materiais -- --watch` integra a cada arquivo novo.

## Render

```bash
npm run render:13-anos-depois
```

```bash
npm run render:13-anos-depois-pos
```

# Alterações — versão 2 (18/11/2026)

Foco: realismo cinematográfico e linguagem de trailer de jogo, sobre a mesma estrutura da v1
(mesmas 21 cenas, mesmos tempos, mesma trilha).

**Biblioteca (`src/motion`, registrados no catálogo):**

| Componente | Arquivo | Para quê |
| --- | --- | --- |
| `VolumetricLight` | `layers/VolumetricLight.tsx` | raios de luz a partir do sol ou de holofotes |
| `Atmosphere` | `layers/Atmosphere.tsx` | névoa procedural em movimento, em faixas e camadas |
| `LensFlare` | `layers/LensFlare.tsx` | reflexo de lente com risco anamórfico e fantasmas |
| `Grade` | `layers/Grade.tsx` | correção de cor por ato (split toning, bloom, vinheta) |
| `HudRadar` | `hud/HudRadar.tsx` | radar de jogo genérico com varredura e rota |
| `MissionCard` | `hud/MissionCard.tsx` | cartão de missão com barra de progresso |
| `HudFrame` | `hud/HudFrame.tsx` | moldura de visor: cantos, REC, contador e local |

**Produção:**
- `RuaArtDeco` (em `cenarios.tsx`): rua art déco ao entardecer em seis camadas (céu com gaivotas, prédios
  distantes, fachadas, palmeiras, rua molhada com reflexo, carro clássico genérico e folhas desfocadas em
  primeiro plano). A câmera desloca cada camada conforme a profundidade: paralaxe real, não imagem parada.
- Cenas 2–4: raios de sol, névoa e reflexo de lente sobre 2013.
- Cena 10: luz volumétrica e reflexo de lente quando o sol nasce.
- Cena 11: a rua art déco é revelada com paralaxe e um cartão de missão ("Capítulo 01").
- Cena 12: cartões de personagem com a rua art déco ao fundo (sem figuras de personagens).
- Cena 13: névoa e holofotes varrendo a cidade, com moldura de visor.
- Cena 14: radar e velocímetro rolando até 186 km/h.
- Cena 15: holofote volumétrico seguindo o helicóptero e moldura de visor.
- Cena 16: montagem com a rua art déco e cartão de missão.
- Cena 17: cartão de 2026 com a rua art déco.

**Referências de estilo** (fotos enviadas pela usuária, usadas só como referência e fora do vídeo):
céu lilás e rosa com sol baixo, prédios art déco claros com janelas em faixa, palmeiras, carro clássico em
primeiro plano e luz de fim de tarde.
