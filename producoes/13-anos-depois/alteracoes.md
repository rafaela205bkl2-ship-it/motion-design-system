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
