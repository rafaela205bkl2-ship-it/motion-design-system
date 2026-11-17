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
    muted: "#5E4A40",
    accent: "#FFC531",
    accent2: "#2A3FE0",
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
