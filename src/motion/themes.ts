import { loadFont as loadBricolage } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadManrope } from "@remotion/google-fonts/Manrope";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";

const jakarta = loadJakarta("normal", {
  weights: ["500", "700", "800"],
  subsets: ["latin", "latin-ext"],
});
const manrope = loadManrope("normal", {
  weights: ["500", "700", "800"],
  subsets: ["latin", "latin-ext"],
});
const bricolage = loadBricolage("normal", {
  weights: ["500", "700", "800"],
  subsets: ["latin", "latin-ext"],
});

export type Palette = {
  /** Fundo principal. */
  background: string;
  /** Superfícies (cards). */
  surface: string;
  /** Texto principal. */
  ink: string;
  /** Texto secundário. */
  muted: string;
  /** Cor de destaque principal. */
  accent: string;
  /** Destaque secundário. */
  accent2: string;
  /**
   * Cor das palavras de destaque em texto (`*asteriscos*`).
   * Precisa de contraste ≥ 3:1 sobre `background` (texto grande, WCAG).
   */
  highlight: string;
  /** Brilho suave de fundo. */
  glow: string;
  /** Sequência de cores para ciclos e conjuntos. */
  spectrum: string[];
};

export type MotionProfile = {
  /** Multiplicador de velocidade: >1 acelera todas as durações. */
  speed: number;
  /** Multiplicador de intensidade: desfoque e distâncias. */
  intensity: number;
  /** Sobra padrão das entradas com mola. */
  overshoot: number;
  /** Multiplicador das pausas entre eventos. */
  holdScale: number;
};

export type Theme = {
  name: "base" | "calmo" | "vibrante";
  palette: Palette;
  fonts: { display: string; body: string };
  weights: { display: number; body: number };
  /** Espaçamento entre letras dos títulos (em em). */
  displayTracking: string;
  motion: MotionProfile;
};

/**
 * BASE — os traços recorrentes nas duas referências:
 * fundo limpo, composição centralizada, revelações com desfoque, transições curtas.
 */
export const baseTheme: Theme = {
  name: "base",
  palette: {
    background: "#F3F0EA",
    surface: "#FFFFFF",
    ink: "#16141B",
    muted: "#6F6B77",
    accent: "#3654F5",
    accent2: "#FF6A47",
    highlight: "#3654F5",
    glow: "#C9D2FF",
    spectrum: ["#3654F5", "#FF6A47", "#16141B", "#9AA8FF"],
  },
  fonts: { display: jakarta.fontFamily, body: jakarta.fontFamily },
  weights: { display: 800, body: 500 },
  displayTracking: "-0.035em",
  motion: { speed: 1, intensity: 1, overshoot: 0.04, holdScale: 1 },
};

/**
 * CALMO — particularidades de A: monocromático, cenas longas,
 * movimentos contidos, profundidade por desfoque.
 */
export const calmTheme: Theme = {
  name: "calmo",
  palette: {
    background: "#E9EFF3",
    surface: "#FFFFFF",
    ink: "#10212E",
    muted: "#5D7282",
    accent: "#1F6E8C",
    accent2: "#7FB3C8",
    highlight: "#1F6E8C",
    glow: "#BFDCE8",
    spectrum: ["#1F6E8C", "#4F93AE", "#7FB3C8", "#B5D3DF"],
  },
  fonts: { display: manrope.fontFamily, body: manrope.fontFamily },
  weights: { display: 800, body: 500 },
  displayTracking: "-0.03em",
  motion: { speed: 0.82, intensity: 0.8, overshoot: 0.015, holdScale: 1.3 },
};

/**
 * VIBRANTE — particularidades de B: multicolor saturado,
 * produto herói, ciclos de cor, ritmo denso.
 */
export const vibrantTheme: Theme = {
  name: "vibrante",
  palette: {
    background: "#FF4F2E",
    surface: "#FFF3E4",
    ink: "#17110E",
    muted: "#43271C",
    accent: "#FFC531",
    accent2: "#2A3FE0",
    // Açafrão sobre a Labareda dá 2,07:1; branco dá 3,28:1.
    highlight: "#FFFFFF",
    glow: "#FF9A6B",
    spectrum: ["#FF4F2E", "#FFC531", "#16B3A3", "#2A3FE0", "#F45BA6"],
  },
  fonts: { display: bricolage.fontFamily, body: jakarta.fontFamily },
  weights: { display: 800, body: 700 },
  displayTracking: "-0.04em",
  motion: { speed: 1.15, intensity: 1.2, overshoot: 0.065, holdScale: 0.85 },
};

export const themes = {
  base: baseTheme,
  calmo: calmTheme,
  vibrante: vibrantTheme,
} as const;
export type ThemeName = keyof typeof themes;

/* ------------------------------------------------------------------ */
/* Criação e combinação de temas                                       */
/* ------------------------------------------------------------------ */

type ThemeOverrides = {
  name?: Theme["name"];
  palette?: Partial<Palette>;
  fonts?: Partial<Theme["fonts"]>;
  weights?: Partial<Theme["weights"]>;
  displayTracking?: string;
  motion?: Partial<MotionProfile>;
};

/**
 * Cria um tema a partir de outro, trocando só o necessário.
 *
 *   const marca = createTheme("calmo", { palette: { accent: "#0A7" } });
 */
export const createTheme = (
  base: ThemeName | Theme,
  overrides: ThemeOverrides = {},
): Theme => {
  const b = typeof base === "string" ? themes[base] : base;
  return {
    name: overrides.name ?? b.name,
    palette: { ...b.palette, ...overrides.palette },
    fonts: { ...b.fonts, ...overrides.fonts },
    weights: { ...b.weights, ...overrides.weights },
    displayTracking: overrides.displayTracking ?? b.displayTracking,
    motion: { ...b.motion, ...overrides.motion },
  };
};

const hexToRgb = (hex: string): [number, number, number] | null => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Mistura duas cores hexadecimais (t = 0 → a, t = 1 → b). Retorna hex. */
export const mixHex = (a: string, b: string, t: number): string => {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  if (!ca || !cb) return t < 0.5 ? a : b;
  const c = ca.map((v, i) => Math.round(v + (cb[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Combina dois temas — por exemplo, o ritmo do vibrante com a paleta do calmo.
 *
 *   blendThemes("calmo", "vibrante", { motion: 0.5, palette: 0 })
 *
 * - `motion`: 0 = movimento de A, 1 = de B, valores intermediários interpolam
 *   velocidade, intensidade, sobra e pausas.
 * - `palette`: 0 = cores de A, 1 = de B, intermediários misturam cada cor.
 * - `fonts`: de qual tema vêm as fontes.
 */
export const blendThemes = (
  a: ThemeName | Theme,
  b: ThemeName | Theme,
  opts: { motion?: number; palette?: number; fonts?: "a" | "b" } = {},
): Theme => {
  const A = typeof a === "string" ? themes[a] : a;
  const B = typeof b === "string" ? themes[b] : b;
  const tm = opts.motion ?? 0.5;
  const tp = opts.palette ?? 0;
  const pick = (opts.fonts ?? (tp < 0.5 ? "a" : "b")) === "a" ? A : B;
  const keys = Object.keys(A.palette) as (keyof Palette)[];
  const palette = {} as Palette;
  for (const k of keys) {
    if (k === "spectrum") {
      palette.spectrum = tp < 0.5 ? A.palette.spectrum : B.palette.spectrum;
    } else {
      palette[k] = mixHex(A.palette[k], B.palette[k], tp);
    }
  }
  return {
    name: tm < 0.5 ? A.name : B.name,
    palette,
    fonts: pick.fonts,
    weights: pick.weights,
    displayTracking: pick.displayTracking,
    motion: {
      speed: lerp(A.motion.speed, B.motion.speed, tm),
      intensity: lerp(A.motion.intensity, B.motion.intensity, tm),
      overshoot: lerp(A.motion.overshoot, B.motion.overshoot, tm),
      holdScale: lerp(A.motion.holdScale, B.motion.holdScale, tm),
    },
  };
};
