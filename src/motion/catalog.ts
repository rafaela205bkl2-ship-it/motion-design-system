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
  // ------------------------------------------------------------ cinema
  {
    name: "keyframeAt",
    kind: "utilitário",
    file: "src/motion/cinema/keyframes.ts",
    description:
      "Valor de uma propriedade em quadros-chave (segundos), com curva por trecho.",
    props: ["keys", "prop", "t", "fallback", "easing"],
    example: 'keyframeAt([{ t: 0, x: 0.2 }, { t: 4, x: 0.8 }], "x", t, 0.5)',
  },
  {
    name: "CameraPlate",
    kind: "camada",
    file: "src/motion/cinema/CameraPlate.tsx",
    description:
      "Câmera virtual sobre imagem fixa: pan, zoom, giro, foco e brilho por quadros-chave (ponto focal em fração da imagem).",
    props: [
      "src",
      "size",
      "keys[{t, x, y, zoom, rotate, blur, brightness, opacity}]",
      "easing",
      "clamp",
      "filter",
      "speed",
    ],
    example:
      '<CameraPlate src={staticFile("x.jpg")} size={[3600, 2400]} keys={[{ t: 0, x: 0.3, zoom: 1.4 }, { t: 6, x: 0.6, zoom: 1.1 }]} />',
  },
  {
    name: "FilmLook",
    kind: "camada",
    file: "src/motion/cinema/FilmLook.tsx",
    description:
      "Acabamento de película sobre a cena: grão vivo, vinheta, flicker, gate weave, tingimento e letterbox animável.",
    props: [
      "grain",
      "vignette",
      "flicker",
      "weave",
      "tint",
      "tintStrength",
      "letterbox",
      "ratio",
    ],
    example: "<FilmLook grain={0.16} letterbox={1}>{cena}</FilmLook>",
  },
  {
    name: "LightRays",
    kind: "camada",
    file: "src/motion/cinema/LightRays.tsx",
    description:
      "Raios de luz (god rays) a partir de um ponto: feixes irregulares, giro lento, queda por distância.",
    props: [
      "origin",
      "color",
      "intensity",
      "rays",
      "spread",
      "direction",
      "reach",
      "spin",
      "softness",
      "delay",
      "fadeIn",
    ],
    example:
      "<LightRays origin={[0.8, -0.1]} direction={200} spread={60} intensity={0.45} />",
  },
  {
    name: "Particles",
    kind: "camada",
    file: "src/motion/cinema/Particles.tsx",
    description:
      "Partículas determinísticas: poeira num feixe de luz, brasas subindo, pó dourado.",
    props: [
      "count",
      "color",
      "size",
      "speed",
      "angle",
      "wobble",
      "opacity",
      "twinkle",
      "area",
      "glow",
      "delay",
      "fadeIn",
    ],
    example: '<Particles count={50} angle={-90} speed={30} color="#FFB36B" />',
  },
  {
    name: "Shine",
    kind: "componente",
    file: "src/motion/cinema/Shine.tsx",
    description:
      "Faixa de luz que varre um elemento respeitando a forma dele (texto, logotipo, lettering).",
    props: ["at", "duration", "angle", "width", "intensity", "easing"],
    example: "<Shine at={1.2}><Img src={logo} /></Shine>",
  },
  {
    name: "MaskReveal",
    kind: "componente",
    file: "src/motion/cinema/MaskReveal.tsx",
    description:
      "Revelação por máscara de borda suave numa direção (ou do centro), com desfoque inicial opcional.",
    props: ["at", "duration", "direction", "softness", "easing", "blurFrom"],
    example:
      '<MaskReveal at={0.5} direction="right"><Img src={logo} /></MaskReveal>',
  },
  {
    name: "Flash",
    kind: "camada",
    file: "src/motion/cinema/Flash.tsx",
    description:
      "Clarão de tela inteira em instantes definidos (impactos, cortes de trailer).",
    props: ["at[]", "color", "attack", "decay", "peak", "blend"],
    example: "<Flash at={[11, 128.5]} decay={0.6} />",
  },
  {
    name: "TextStrike",
    kind: "componente",
    file: "src/motion/cinema/TextStrike.tsx",
    description:
      "Risco que atravessa um texto num instante, esmaecendo o que foi riscado.",
    props: ["at", "duration", "color", "thickness", "y", "extend", "dimTo"],
    example:
      '<TextStrike at={1.6}><TextReveal text="APARÊNCIAS" /></TextStrike>',
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
