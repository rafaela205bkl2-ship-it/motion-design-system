/**
 * Catálogo da biblioteca: tudo o que já existe e como usar.
 *
 * Fonte única para "o que eu posso reutilizar?" — consultado por pessoas,
 * pelo comando `npm run catalogo` e por sessões de IA (ver CLAUDE.md).
 * `npm run validar` falha se algo exportado em index.ts não estiver aqui.
 */

export type CatalogEntry = {
  /** Nome exato do export em src/motion/index.ts. */
  name: string;
  kind:
    | "componente"
    | "transição"
    | "camada"
    | "hook"
    | "tema"
    | "preset"
    | "token"
    | "utilitário";
  file: string;
  description: string;
  /** Props/argumentos mais usados. */
  props?: string[];
  example?: string;
};

export const catalog: CatalogEntry[] = [
  // ------------------------------------------------------------ tokens
  {
    name: "tokens",
    kind: "token",
    file: "src/motion/tokens.ts",
    description:
      "Todos os tokens agrupados (duration, stagger, blur, distance, overshoot).",
  },
  {
    name: "duration",
    kind: "token",
    file: "src/motion/tokens.ts",
    description:
      "Durações em segundos: micro 3q, fast 5q, swap 6q, base 7q, dissolve 9q, reveal 10q, enter 16q, hold 1s, scene 2.5s, outro 4s.",
  },
  {
    name: "stagger",
    kind: "token",
    file: "src/motion/tokens.ts",
    description:
      "Intervalos entre unidades: char 0.03s, word 0.075s, item 0.12s.",
  },
  {
    name: "blur",
    kind: "token",
    file: "src/motion/tokens.ts",
    description:
      "Desfoques em px de design: reveal 18, exit 16, dissolve 28, object 14, depth 22.",
  },
  {
    name: "distance",
    kind: "token",
    file: "src/motion/tokens.ts",
    description: "Distâncias em px de design: text 38, object 420, drift 22.",
  },
  {
    name: "overshoot",
    kind: "token",
    file: "src/motion/tokens.ts",
    description:
      "Sobras: none 0, subtle 2%, base 4%, lively 6.5% (referências ≤ 7%).",
  },
  // ------------------------------------------------------------ curvas
  {
    name: "easings",
    kind: "token",
    file: "src/motion/easing.ts",
    description:
      "Curvas nomeadas: linear, enter, enterSoft, enterStrong, exit, wipe, wipeSmooth, land, camera.",
  },
  {
    name: "resolveEasing",
    kind: "utilitário",
    file: "src/motion/easing.ts",
    description: "Converte nome de curva (ou função) em função de easing.",
  },
  {
    name: "overshootProgress",
    kind: "utilitário",
    file: "src/motion/easing.ts",
    description:
      "Progresso de mola com sobra exata pedida, em uma duração dada.",
    props: ["frame", "fps", "durationInFrames", "amount"],
  },
  {
    name: "dampingForOvershoot",
    kind: "utilitário",
    file: "src/motion/easing.ts",
    description:
      "Amortecimento que produz a sobra pedida (busca binária, memorizada).",
  },
  // ------------------------------------------------------------ temas
  {
    name: "themes",
    kind: "tema",
    file: "src/motion/themes.ts",
    description: "Mapa { base, calmo, vibrante }.",
  },
  {
    name: "baseTheme",
    kind: "tema",
    file: "src/motion/themes.ts",
    description:
      "Traços recorrentes: off-white, cobalto + coral, Plus Jakarta Sans, velocidade 1.",
  },
  {
    name: "calmTheme",
    kind: "tema",
    file: "src/motion/themes.ts",
    description:
      "Particularidades de A: monocromático azul-petróleo, Manrope, mais lento (0.82), pausas 1.3x.",
  },
  {
    name: "vibrantTheme",
    kind: "tema",
    file: "src/motion/themes.ts",
    description:
      "Particularidades de B: multicolor saturado, Bricolage Grotesque, mais rápido (1.15), sobra 6.5%.",
  },
  {
    name: "createTheme",
    kind: "tema",
    file: "src/motion/themes.ts",
    description: "Cria um tema derivado trocando só paleta/fontes/movimento.",
    example: 'createTheme("calmo", { palette: { accent: "#0A7" } })',
  },
  {
    name: "blendThemes",
    kind: "tema",
    file: "src/motion/themes.ts",
    description:
      "Combina dois temas: interpola o movimento e/ou mistura a paleta.",
    example: 'blendThemes("calmo", "vibrante", { motion: 0.5, palette: 0 })',
  },
  {
    name: "mixHex",
    kind: "utilitário",
    file: "src/motion/themes.ts",
    description: "Mistura duas cores hex.",
  },
  {
    name: "MotionProvider",
    kind: "componente",
    file: "src/motion/MotionProvider.tsx",
    description:
      "Define tema e ajustes locais de velocidade/intensidade. Pode ser aninhado.",
    props: ["theme", "speed", "intensity"],
    example: '<MotionProvider theme="vibrante" speed={1.1}>…</MotionProvider>',
  },
  {
    name: "useMotion",
    kind: "hook",
    file: "src/motion/MotionProvider.tsx",
    description:
      "Tokens resolvidos pelo tema: dur(), stag(), blur(), dist(), hold(), px(), palette, theme.",
  },
  {
    name: "useProgress",
    kind: "hook",
    file: "src/motion/MotionProvider.tsx",
    description:
      "Progresso 0→1 entre start e start+duration (segundos), com curva.",
    props: ["start", "duration", "easing"],
  },
  {
    name: "progressAt",
    kind: "utilitário",
    file: "src/motion/MotionProvider.tsx",
    description: "Versão pura de useProgress, para loops.",
  },
  // ------------------------------------------------------------ presets
  {
    name: "textPresets",
    kind: "preset",
    file: "src/motion/presets.ts",
    description: "titulo, impacto, frase, suave, rotulo, reverso.",
    example: '<TextReveal {...textPresets.impacto} text="Olá" />',
  },
  {
    name: "objectPresets",
    kind: "preset",
    file: "src/motion/presets.ts",
    description:
      "queda, pop, deslizeEsquerda, deslizeDireita, subida, flutuante.",
    example: "<ObjectEnter {...objectPresets.queda}>…</ObjectEnter>",
  },
  {
    name: "transitionPreset",
    kind: "preset",
    file: "src/motion/presets.ts",
    description:
      "Transição pronta por nome: radial-rapido, radial-suave, dissolve, fade-branco.",
    example:
      'const t = transitionPreset("radial-rapido", { fps, origin: [0.5, 0.6] })',
  },
  {
    name: "TRANSITION_PRESETS",
    kind: "preset",
    file: "src/motion/presets.ts",
    description: "Lista dos nomes de transição disponíveis.",
  },
  // ------------------------------------------------------------ texto
  {
    name: "TextReveal",
    kind: "componente",
    file: "src/motion/text/TextReveal.tsx",
    description:
      "Revelação por letra/palavra com opacidade, desfoque, deslocamento e escala; saída opcional.",
    props: [
      "text",
      "by",
      "direction",
      "delay",
      "duration",
      "stagger",
      "easing",
      "from",
      "exitAt",
      "exitBy",
      "exitTo",
      "size",
      "font",
      "color",
      "highlightColor",
      "align",
      "maxWidth",
      "intensity",
      "speed",
    ],
    example:
      '<TextReveal text="Seu *título*" by="char" delay={0.4} size={140} />',
  },
  {
    name: "getRevealDuration",
    kind: "utilitário",
    file: "src/motion/text/TextReveal.tsx",
    description: "Tempo total da entrada (unidades × escalonamento + duração).",
  },
  {
    name: "TextSwap",
    kind: "componente",
    file: "src/motion/text/TextSwap.tsx",
    description:
      "Troca de textos no mesmo lugar; saída em desfoque antes do próximo nascer.",
    props: [
      "items[{text, at}]",
      "overlap",
      "lastExitAt",
      "…props de TextReveal",
    ],
    example:
      '<TextSwap items={[{text: "Um.", at: 0.3}, {text: "Dois.", at: 1.3}]} />',
  },
  // ------------------------------------------------------------ objetos
  {
    name: "ObjectEnter",
    kind: "componente",
    file: "src/motion/object/ObjectEnter.tsx",
    description:
      "Entrada com peso: fall (pouso com achatamento), pop, glide, rise; esticamento por velocidade; flutuação.",
    props: [
      "motion",
      "from",
      "distance",
      "delay",
      "duration",
      "overshoot",
      "impact",
      "scaleFrom",
      "rotateFrom",
      "rotate",
      "stretch",
      "float",
      "exitAt",
      "exitTo",
      "intensity",
      "speed",
    ],
    example:
      '<ObjectEnter motion="fall" delay={0.4}><MeuObjeto /></ObjectEnter>',
  },
  // ------------------------------------------------------------ transições
  {
    name: "radialReveal",
    kind: "transição",
    file: "src/motion/transitions/radialReveal.tsx",
    description:
      "Nova cena num círculo a partir de um ponto; borda suave, anel opcional, zoom.",
    props: [
      "origin",
      "softness",
      "ringColor",
      "ringWidth",
      "zoom",
      "exitDepth",
    ],
  },
  {
    name: "blurDissolve",
    kind: "transição",
    file: "src/motion/transitions/blurDissolve.tsx",
    description:
      "Dissolve com desfoque; com `through`, passa por uma cor (fade para branco).",
    props: ["blur", "scale", "through", "throughStrength"],
  },
  {
    name: "motionTiming",
    kind: "utilitário",
    file: "src/motion/transitions/timing.ts",
    description: "Timing de TransitionSeries a partir de token + curva.",
    example: 'motionTiming({ fps, duration: "fast", easing: "wipe" })',
  },
  {
    name: "transitionFrames",
    kind: "utilitário",
    file: "src/motion/transitions/timing.ts",
    description: "Quadros de uma transição, para somar na duração total.",
  },
  // ------------------------------------------------------------ camadas
  {
    name: "Layer",
    kind: "camada",
    file: "src/motion/layers/Layer.tsx",
    description:
      "Plano de profundidade: depth 0 (foco) a 1 (fundo) → desfoque, deriva com paralaxe, empilhamento.",
    props: [
      "depth",
      "blur",
      "drift",
      "driftAngle",
      "driftPeriod",
      "overscan",
      "opacity",
    ],
  },
  {
    name: "Backdrop",
    kind: "camada",
    file: "src/motion/layers/Backdrop.tsx",
    description:
      "Fundo: cor, brilhos radiais em movimento lento, vinheta, granulação procedural.",
    props: ["color", "glows", "glowDrift", "vignette", "grain"],
  },
  {
    name: "KineticType",
    kind: "camada",
    file: "src/motion/layers/KineticType.tsx",
    description:
      "Padrão tipográfico em fileiras alternadas (vazado nas ímpares).",
    props: [
      "text",
      "rows",
      "size",
      "speed",
      "alternate",
      "angle",
      "color",
      "opacity",
    ],
  },
  {
    name: "ColorBloom",
    kind: "camada",
    file: "src/motion/layers/ColorBloom.tsx",
    description: "Ciclo de cores dentro da cena por expansões radiais.",
    props: ["steps[{color, at}]", "origin", "duration", "easing", "softness"],
  },
  {
    name: "StripeBand",
    kind: "camada",
    file: "src/motion/layers/StripeBand.tsx",
    description:
      "Faixas de cor escalonadas (ex.: cores de bandeira) que entram deslizando; com coverAt viram transição que cobre um corte e se abre (ref-003).",
    props: [
      "stripes[{color, pattern, color2, weight}]",
      "orientation",
      "from",
      "delay",
      "coverAt",
      "hold",
      "exitAt",
      "duration",
      "stagger",
      "skew",
    ],
    example:
      '<StripeBand coverAt={28.27} stripes={[{color:"#006847"},{color:"#FFF"},{color:"#CE1126"}]} />',
  },
  {
    name: "CountUp",
    kind: "componente",
    file: "src/motion/text/CountUp.tsx",
    description:
      "Número que conta até o valor final com formatação pt-BR, prefixo/sufixo e entrada com desfoque (ref-004, ref-001).",
    props: [
      "value",
      "from",
      "delay",
      "duration",
      "easing",
      "decimals",
      "prefix",
      "suffix",
      "size",
      "color",
    ],
    example: '<CountUp value={17000} prefix="+" delay={0.4} size={120} />',
  },
  {
    name: "WordCaption",
    kind: "componente",
    file: "src/motion/text/WordCaption.tsx",
    description:
      "Legenda sincronizada palavra a palavra a partir de tempos de transcrição; blocos curtos, palavra falada destacada, *destaque* permanente.",
    props: [
      "words[{text, start, end}]",
      "maxWords",
      "pauseBreak",
      "size",
      "activeColor",
      "highlightColor",
      "background",
      "maxWidth",
    ],
    example: '<WordCaption words={[{text: "Feira", start: 0.2, end: 0.5}]} />',
  },
  {
    name: "Globe3D",
    kind: "componente",
    file: "src/motion/object/Globe3D.tsx",
    description:
      "Globo 3D em linhas (projeção ortográfica, SVG) girando, com inclinação, marcadores lat/lon e entrada com desfoque (ref-004).",
    props: [
      "size",
      "color",
      "strokeWidth",
      "step",
      "spin",
      "startLon",
      "tilt",
      "markers[{lat, lon, color, at}]",
      "delay",
      "glow",
    ],
    example:
      "<Globe3D size={600} spin={20} markers={[{ lat: -14, lon: -51 }]} />",
  },
  // ------------------------------------------------------------ layout
  {
    name: "useLayout",
    kind: "hook",
    file: "src/lib/layout.ts",
    description:
      "Formato atual, px() (pixels de design), pick({vertical, horizontal, square}), área segura.",
  },
  {
    name: "getFormat",
    kind: "utilitário",
    file: "src/lib/layout.ts",
    description:
      "Formato pela proporção: < 0.9 vertical, > 1.1 horizontal, senão square.",
  },
  {
    name: "FORMATS",
    kind: "token",
    file: "src/lib/layout.ts",
    description:
      "Resoluções padrão: vertical 1080×1920, horizontal 1920×1080, square 1080×1080.",
  },
  {
    name: "catalog",
    kind: "utilitário",
    file: "src/motion/catalog.ts",
    description: "Este catálogo.",
  },
];
