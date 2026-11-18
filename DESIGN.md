---
name: Motion Design System
description: Identidade audiovisual para vídeos curtos em Remotion. Revelar, não aparecer.
colors:
  paper: "#F3F0EA"
  surface: "#FFFFFF"
  ink: "#16141B"
  graphite: "#6F6B77"
  cobalt: "#3654F5"
  coral: "#FF6A47"
  cobalt-haze: "#C9D2FF"
  calm-mist: "#E9EFF3"
  calm-ink: "#10212E"
  calm-slate: "#5D7282"
  petrol: "#1F6E8C"
  petrol-light: "#7FB3C8"
  calm-haze: "#BFDCE8"
  flare: "#FF4F2E"
  cream: "#FFF3E4"
  ember-ink: "#17110E"
  ember-brown: "#5E4A40"
  saffron: "#FFC531"
  ultramarine: "#2A3FE0"
  peach-glow: "#FF9A6B"
  teal-pop: "#16B3A3"
  orchid: "#F45BA6"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "120px"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  display-calm:
    fontFamily: "Manrope, sans-serif"
    fontSize: "120px"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  display-vibrant:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "120px"
    fontWeight: 800
    lineHeight: 1.0
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "58px"
    fontWeight: 500
    lineHeight: 1.25
  label:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    letterSpacing: "0.25em"
  caption:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "36px"
    fontWeight: 500
spacing:
  safe-vertical-x: "80px"
  safe-vertical-top: "200px"
  safe-vertical-bottom: "280px"
  safe-horizontal-x: "140px"
  safe-horizontal-y: "100px"
  safe-square: "90px"
  text-travel: "38px"
  drift: "22px"
components:
  title:
    textColor: "{colors.ink}"
    typography: "{typography.display}"
  title-highlight:
    textColor: "{colors.cobalt}"
    typography: "{typography.display}"
  kicker:
    textColor: "{colors.graphite}"
    typography: "{typography.label}"
  support-line:
    textColor: "{colors.graphite}"
    typography: "{typography.body}"
  end-card:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.surface}"
    typography: "{typography.display}"
---

<!--
Espelho portátil da identidade, no formato DESIGN.md.
Autoridade: MASTER_STYLE_GUIDE.md (regras) e src/motion (themes.ts, tokens.ts, layout.ts).
Se este arquivo divergir deles, eles valem; atualize este arquivo.
Medidas em px de DESIGN (lado menor = 1080), sempre convertidas por px() no código.
-->

# Design System: Motion Design System

## Overview

**Creative North Star: "A Revelação Calma"**

Tudo nesta identidade chega à tela emergindo, não aparecendo. Texto e objetos saem de um desfoque para a nitidez, as cenas se ligam por dissolves e aberturas radiais, e cada quadro carrega uma ideia só, centralizada, com muito espaço vazio em volta. O peso físico existe (objetos pousam e achatam), mas é contido: a sobra nunca passa de 7%.

O sistema tem três temperamentos sobre a mesma gramática: **Base** (papel quente, tinta escura, cobalto e coral), **Calmo** (azul-petróleo monocromático, mais lento) e **Vibrante** (multicolor saturado, mais rápido). O formato primário é vertical 9:16; 16:9 e 1:1 usam os mesmos tokens com valores por formato.

O tempo é um material de design tanto quanto a cor: cerca de um evento visual por segundo, pausas de leitura garantidas e um final parado.

**Key Characteristics:**
- Entradas por desfoque + opacidade; saídas sempre mais curtas que entradas.
- Uma ideia por cena, composição centralizada, no máximo 3 objetos principais.
- Fundo nunca liso: brilho radial suave + granulação leve.
- Títulos pesados (800) com espaçamento negativo; uma única palavra de destaque em cor.
- Continuidade: no máximo um corte seco por peça.

## Colors

Cada tema é uma paleta fechada de papel, tinta e dois acentos; não se misturam cores de temas diferentes fora de `blendThemes`.

### Primary
- **Cobalto Elétrico** (cobalt): acento do tema Base. Palavra de destaque nos títulos, anel das transições radiais, cartão final.
- **Azul-Petróleo** (petrol): acento do tema Calmo, nos mesmos papéis.
- **Açafrão** (saffron): acento do tema Vibrante. Ver a regra do Destaque Legível antes de usá-lo como cor de texto.

### Secondary
- **Coral Quente** (coral): segundo acento do Base. Formas, ciclos de cor e anéis; não é cor de texto sobre o papel.
- **Petróleo Claro** (petrol-light): segundo acento do Calmo, para formas e profundidade.
- **Ultramar** (ultramarine): segundo acento do Vibrante.

### Tertiary
- **Espectro Vibrante** (flare, saffron, teal-pop, ultramarine, orchid): sequência dos ciclos de cor (`ColorBloom`) e dos conjuntos de objetos do Vibrante.

### Neutral
- **Papel Quente** (paper) / **Névoa Fria** (calm-mist) / **Labareda** (flare): fundos de Base, Calmo e Vibrante.
- **Tinta** (ink) / **Tinta Petróleo** (calm-ink) / **Tinta Brasa** (ember-ink): texto principal.
- **Grafite** (graphite) / **Ardósia** (calm-slate) / **Marrom Brasa** (ember-brown): texto secundário e rótulos.
- **Branco** (surface) / **Creme** (cream): superfícies e cartões.
- **Halo Cobalto** (cobalt-haze) / **Halo Petróleo** (calm-haze) / **Brilho Pêssego** (peach-glow): brilho radial do fundo; nunca usados em texto.

### Named Rules
**The One Highlight Rule.** No máximo uma expressão em cor de destaque por título, marcada com `*asteriscos*` no roteiro.

**The Destaque Legível Rule.** Texto sobre o fundo precisa de contraste de pelo menos 3:1 (títulos ≥ 24 px de design contam como texto grande). Tinta, Grafite, Ardósia, Cobalto e Petróleo passam nos seus fundos. Coral, Petróleo Claro, Açafrão, Ultramar e Marrom Brasa não passam sobre os próprios fundos: ficam para formas, anéis e superfícies, ou para texto sobre o Creme. No Vibrante, o destaque sobre a Labareda vai em Tinta Brasa ou sobre uma superfície Creme.

**The Closed Palette Rule.** Cores novas entram por `createTheme(...)`, nunca como hex solto num componente.

## Typography

**Display Font:** Plus Jakarta Sans (Base) · Manrope (Calmo) · Bricolage Grotesque (Vibrante)
**Body Font:** Plus Jakarta Sans (Base e Vibrante) · Manrope (Calmo)

**Character:** grotescas geométricas em peso alto, apertadas nos títulos para formar blocos compactos que se leem num relance, com corpo em peso médio para não competir.

### Hierarchy
- **Display** (800, mínimo 120 px no 9:16 e 16:9, 104 px no 1:1, espaçamento −0,03 a −0,04 em): título principal, até 48 caracteres e 2 linhas no 9:16.
- **Body** (500–700, 52–66 px): uma frase de apoio por cena.
- **Label** (700, 30–34 px, caixa alta, espaçamento 0,22–0,3 em): sobretítulo de até 4 palavras.
- **Caption** (500, 36 px): créditos e legendas.

### Named Rules
**The Short Sentence Rule.** Frases curtas terminadas em ponto ("Comece hoje."), título grande + uma linha pequena.

**The Reading Time Rule.** Um texto fica totalmente visível por pelo menos 0,3 s + 0,06 s × número de palavras antes de sair.

## Layout

Canvas em px de design, com o lado menor valendo 1080: 9:16 (1080×1920, primário), 16:9 (1920×1080) e 1:1 (1080×1080). Tudo passa por `px()`; valores que mudam por formato usam `pick()`.

Áreas seguras: 9:16 com laterais de 80, topo de 200 e base de 280; 16:9 com laterais de 140 e topo/base de 100; 1:1 com 90 em todos os lados.

A composição é centralizada por padrão. No 16:9 com imagem ou objeto, o texto e o visual dividem a tela lado a lado. O ritmo vem do tempo, não da grade: ~1 evento por segundo, cena de 2,5 s (Calmo 3–4 s, Vibrante 1,5–2,5 s) e encerramento parado de 3–5 s.

### Named Rules
**The One Idea Rule.** Uma ideia principal por cena; nunca dois textos legíveis ao mesmo tempo no mesmo lugar.

## Elevation & Depth

Sem sombras. A profundidade vem de camadas desfocadas e escala: `Backdrop` (brilho radial + vinheta 0,18 + granulação 0,10–0,14) → padrão ou ciclo de cor → camadas de profundidade (`Layer`, profundidade 0,4–0,85, desfocadas até 22 px) → foco nítido (profundidade 0). O desfoque também marca o tempo: até 18 px na revelação de texto, 16 na saída, 28 no dissolve.

### Named Rules
**The Blur Is Depth Rule.** Para afastar algo, desfoque e reduza; não adicione sombra.

**The Never Flat Rule.** Nenhum fundo é cor chapada sem brilho e granulação, exceto o cartão final.

## Shapes

Formas simples e cheias, sem contorno: círculos (os brilhos de fundo e as aberturas radiais) e blocos de cor de tela inteira (`ColorBloom`, cartão final). As transições radiais nascem no objeto principal, com um anel fino na cor da cena seguinte. Texto pode passar atrás de um objeto desde que ~60% de cada letra continue visível.

## Components

### Título com revelação (`TextReveal`)
- **Character:** decidido e limpo.
- **Comportamento:** cada letra ou palavra entra com opacidade, desfoque de 18 px e subida de 38 px, em 10 quadros (a 30 fps), escalonada 0,03 s (letra) ou 0,075 s (palavra), curva easeOutCubic (easeOutExpo nos títulos grandes).
- **Destaque:** a expressão entre asteriscos usa o acento do tema.

### Troca de texto (`TextSwap`)
- O texto antigo se desfaz em 3 quadros; o novo só nasce depois, em 6 quadros. Os dois nunca são legíveis juntos.

### Entrada de objeto (`ObjectEnter`)
- Queda, subida ou pop em 16 quadros. Sobra pelo tema: Calmo 1,5%, Base 4%, Vibrante 6,5%; nunca acima de 7%.

### Transições (`radialReveal`, `blurDissolve`)
- **Dissolve** (9 q, com desfoque de 28 px): mesmo tema, mudança de assunto.
- **Fade para branco**: mudança de tema.
- **Radial suave** (7 q, easeInOutSine) / **radial rápido** (5 q, easeInQuad): mudança de bloco ou acento de energia.

### Fundo (`Backdrop`) e tipografia cinética (`KineticType`)
- Brilho na cor `glow` do tema com deriva lenta, vinheta e granulação. No Vibrante, cor chapada com `KineticType` atrás do conteúdo.

### Cartão final
- Cor sólida (acento ou tinta) com assinatura ou CTA, parado por 3–5 s, depois da marca.

## Do's and Don'ts

### Do:
- **Do** importar de `src/motion` e consultar `npm run catalogo` antes de criar qualquer peça.
- **Do** definir tempo em segundos (`duration.*`) e medidas em px de design (`px()`, `pick()`).
- **Do** fazer as saídas mais curtas que as entradas (3 q contra 10–16 q).
- **Do** abrir com o elemento principal nos primeiros 0,5 s e o título até 1 s.
- **Do** usar `fade-branco` ou um radial na cor da próxima cena ao trocar de tema.

### Don't:
- **Don't** usar CSS `transition`/`animation` nem `background-image` com URL; anime com `interpolate`/`useProgress`.
- **Don't** usar pixels ou quadros fixos.
- **Don't** usar `linear` ou easing de entrada (ease-in) para algo que aparece, nem molas com sobra acima de 7%.
- **Don't** pôr mais de 2 linhas de título no 9:16 nem mais de 3 objetos principais por cena.
- **Don't** usar mais de um corte seco por peça.
- **Don't** reproduzir marcas, logotipos, produtos, textos ou trilhas das referências.
