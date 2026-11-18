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

  // ------------------------------------------------------------ 3D, partículas e cinema (produção 13-anos-depois)
  {
    name: "Stage3D",
    kind: "camada",
    file: "src/motion/three/Stage3D.tsx",
    description:
      "Palco 3D em CSS: perspectiva + câmera (cameraZ/X/Y, rotateX/Y/Z). Anime os números na cena. filter/overflow dentro achatam o 3D.",
    props: ["perspective", "cameraZ", "cameraX", "cameraY", "rotateX", "rotateY", "originX", "originY"],
    example: "<Stage3D cameraZ={z}><Plane3D z={-400}>…</Plane3D></Stage3D>",
  },
  {
    name: "Plane3D",
    kind: "camada",
    file: "src/motion/three/Stage3D.tsx",
    description: "Plano centrado no palco, posicionado em x/y/z (px de design) com rotações e escala.",
    props: ["x", "y", "z", "rotateX", "rotateY", "rotateZ", "scale", "opacity"],
  },
  {
    name: "DepthType",
    kind: "componente",
    file: "src/motion/three/DepthType.tsx",
    description:
      "Tipografia com volume: texto extrudado em camadas, laterais em degradê e brilho opcional na face.",
    props: ["text", "size", "depth", "layers", "color", "sideLight", "sideDark", "rotateX", "rotateY", "sheen", "outline"],
    example: '<DepthType text="2013" size={420} depth={90} rotateY={-18} />',
  },
  {
    name: "RollingNumber",
    kind: "componente",
    file: "src/motion/text/RollingNumber.tsx",
    description:
      "Odômetro entre uma sequência de valores (ref-001, 23 s). Funciona em 3D (sem overflow) e aceita renderDigit.",
    props: ["values", "times", "duration", "stagger", "easing", "size", "renderDigit"],
    example: "<RollingNumber values={[2013, 2018]} times={[0.5]} size={300} />",
  },
  {
    name: "FootageCard",
    kind: "componente",
    file: "src/motion/object/FootageCard.tsx",
    description:
      "Cartão em perspectiva com conteúdo dentro (vídeo, imagem, cenário), borda luminosa, sombra, véu e brilho.",
    props: ["width", "height", "radius", "edge", "tiltX", "tiltY", "rotate", "sheen", "shadow", "scrim", "caption"],
  },
  {
    name: "Particles",
    kind: "camada",
    file: "src/motion/layers/Particles.tsx",
    description:
      "Partículas determinísticas que viajam de uma forma para outra (elemento vira transição).",
    props: ["from", "to", "progress", "start", "duration", "spread", "swirl", "size", "colors", "twinkle", "drift", "seed"],
    example: "<Particles from={particleShapes.scatter(300)} to={particleShapes.disc(300)} start={0.5} />",
  },
  {
    name: "particleShapes",
    kind: "utilitário",
    file: "src/motion/layers/Particles.tsx",
    description: "Formas prontas para Particles: scatter, disc, ring, line (pontos normalizados 0–1).",
  },
  {
    name: "seeded",
    kind: "utilitário",
    file: "src/motion/layers/Particles.tsx",
    description: "Gerador pseudoaleatório determinístico (mesmo resultado em todo render).",
  },
  {
    name: "CameraMove",
    kind: "camada",
    file: "src/motion/layers/CameraMove.tsx",
    description:
      "Câmera sobre uma placa: avanço/recuo, deriva e rotação entre dois estados. Texto dentro acompanha a câmera; em outro CameraMove, parallax.",
    props: ["from", "to", "delay", "duration", "easing", "speed", "intensity", "originX", "originY"],
    example: "<CameraMove to={{ scale: 1.08, x: -20 }} duration={4}>…</CameraMove>",
  },
  {
    name: "FilmLook",
    kind: "camada",
    file: "src/motion/layers/FilmLook.tsx",
    description: "Textura de TV/filme antigo: linhas de varredura, granulação, vinheta, tremulação e tom.",
    props: ["intensity", "scanlines", "grain", "vignette", "flicker", "tint"],
  },
  {
    name: "CrtReveal",
    kind: "transição",
    file: "src/motion/layers/FilmLook.tsx",
    description: "A cena liga como TV de tubo: ponto → linha horizontal → tela cheia, com clarão.",
    props: ["delay", "duration", "speed", "flash"],
  },
  {
    name: "LightSweep",
    kind: "camada",
    file: "src/motion/layers/LightSweep.tsx",
    description: "Faixa de luz que atravessa a tela ou um cartão uma vez (screen).",
    props: ["delay", "duration", "angle", "width", "color", "direction"],
  },

  // ------------------------------------------------------------ luz, atmosfera e HUD (13-anos-depois v2)
  {
    name: "VolumetricLight",
    kind: "camada",
    file: "src/motion/layers/VolumetricLight.tsx",
    description: "Raios de luz volumétrica a partir de uma fonte (sol, holofote), com leque, alcance e oscilação.",
    props: ["x", "y", "direction", "spread", "rays", "color", "intensity", "reach", "sway", "softness"],
  },
  {
    name: "Atmosphere",
    kind: "camada",
    file: "src/motion/layers/Atmosphere.tsx",
    description: "Névoa procedural em movimento numa faixa da tela; empilhe camadas com drift diferente para parallax.",
    props: ["color", "density", "from", "to", "drift", "scale", "seed", "blend"],
  },
  {
    name: "LensFlare",
    kind: "camada",
    file: "src/motion/layers/LensFlare.tsx",
    description: "Reflexo de lente: brilho, risco anamórfico e fantasmas alinhados com o centro.",
    props: ["x", "y", "color", "streakColor", "intensity", "streak", "ghosts"],
  },
  {
    name: "Grade",
    kind: "camada",
    file: "src/motion/layers/Grade.tsx",
    description: "Correção de cor por cima da cena: split toning, bloom simulado e vinheta.",
    props: ["highlights", "shadows", "amount", "vignette", "bloom", "bloomX", "bloomY"],
  },
  {
    name: "HudRadar",
    kind: "componente",
    file: "src/motion/hud/HudRadar.tsx",
    description: "Radar circular de jogo genérico: anéis, varredura, pontos, rota que se desenha e marcador.",
    props: ["size", "delay", "color", "accent", "spin", "blips", "label"],
  },
  {
    name: "MissionCard",
    kind: "componente",
    file: "src/motion/hud/MissionCard.tsx",
    description: "Cartão de missão: rótulo, título e barra de progresso; entra com máscara e sai com desfoque.",
    props: ["label", "title", "delay", "exitAt", "accent", "width", "from", "progress"],
  },
  {
    name: "HudFrame",
    kind: "camada",
    file: "src/motion/hud/HudFrame.tsx",
    description: "Moldura de visor: cantos, REC piscando, contador de tempo e rótulo de local, na área segura.",
    props: ["label", "sublabel", "delay", "color", "accent", "clockFrom", "rec"],
  },

  // ------------------------------------------------------------ linguagem publicitária (13-anos-depois v3)
  {
    name: "FloatingShapes",
    kind: "componente",
    file: "src/motion/three/FloatingShapes.tsx",
    description:
      "Formas 3D flutuando (cube, disc, ring, pill, tile) com volume, sombra, entrada com sobra e flutuação (ref-001, 8–22 s). Use em Stage3D; z>0 passa na frente.",
    props: ["shapes", "speed", "float", "enter", "duration", "exitAt", "overshoot", "shadow"],
    example: '<FloatingShapes shapes={[{ kind: "cube", x: -300, y: -200, z: 120, color: "#FF5C8A" }]} />',
  },
  {
    name: "KineticWord",
    kind: "componente",
    file: "src/motion/text/KineticWord.tsx",
    description:
      "Tipografia de impacto: letras enormes virando em 3D com escala e sobra, linhas empilhadas, saída voando para a câmera.",
    props: ["text", "size", "delay", "stagger", "duration", "exitAt", "color", "highlight", "flip", "align"],
    example: '<KineticWord text={"A MAIOR\\n*VIAGEM*"} size={240} delay={0.2} />',
  },
  {
    name: "backOut",
    kind: "utilitário",
    file: "src/motion/easing.ts",
    description: "Curva com sobra a partir de progresso 0–1: backOut(p, 0.05). Sobra ≤ 7%.",
  },
];
