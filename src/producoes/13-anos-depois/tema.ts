/**
 * Direção de arte "Hora Dourada" (producoes/13-anos-depois/conceito.md).
 * Quatro climas sobre a mesma gramática, criados com createTheme (os temas da biblioteca não mudam).
 *
 * Mapa estilo do roteiro → clima:
 *   calmo    → memória (placas de 2013, quentes e lavadas)
 *   base     → creme (momentos gráficos, respiro da ref-001)
 *   vibrante → travessia (pôr do sol e noite de uma nova cidade)
 *   misto    → silêncio (azul-noite, um único acento laranja)
 */
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { createTheme, type Theme } from "../../motion";

const serif = loadSerif("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });
loadSerif("italic", { weights: ["400"], subsets: ["latin", "latin-ext"] });

/** Fonte das frases de memória (itálico). */
export const SERIF = serif.fontFamily;

export const COR = {
  noite: "#0B0A10",
  crepusculo: "#2A1745",
  rosa: "#FF5C8A",
  laranja: "#FF8A3D",
  oceano: "#2B4C9B",
  creme: "#F4E9DA",
  ambar: "#F2B66D",
  azulNoite: "#0A0E1A",
} as const;

const vibrante = createTheme("vibrante", {});

export const memoria: Theme = createTheme("calmo", {
  palette: {
    background: "#1A1218",
    surface: COR.creme,
    ink: COR.creme,
    muted: "#E3D2BF",
    accent: "#E8A25C",
    accent2: "#C66B4E",
    highlight: COR.ambar,
    glow: "#E8A25C",
    spectrum: ["#E8A25C", "#C66B4E", "#F4E9DA", "#8A5F62"],
  },
  fonts: { display: vibrante.fonts.display, body: SERIF },
  weights: { display: 800, body: 400 },
  displayTracking: "-0.04em",
  motion: { speed: 0.9, intensity: 1, overshoot: 0.03, holdScale: 1.1 },
});

export const creme: Theme = createTheme("base", {
  palette: {
    background: COR.creme,
    surface: "#FFFFFF",
    ink: "#1A1420",
    muted: "#6B5E57",
    accent: COR.oceano,
    accent2: COR.laranja,
    highlight: COR.oceano,
    glow: "#F7C9A8",
    spectrum: [COR.oceano, COR.laranja, COR.rosa, "#1A1420"],
  },
  fonts: { display: vibrante.fonts.display, body: SERIF },
  weights: { display: 800, body: 400 },
  displayTracking: "-0.04em",
  motion: { speed: 1, intensity: 1, overshoot: 0.04, holdScale: 1 },
});

export const travessia: Theme = createTheme("vibrante", {
  palette: {
    background: COR.noite,
    surface: COR.creme,
    ink: COR.creme,
    muted: "#CBBBD6",
    accent: COR.rosa,
    accent2: COR.laranja,
    highlight: COR.rosa,
    glow: COR.rosa,
    spectrum: [COR.rosa, COR.laranja, "#7B4BD6", COR.oceano, COR.creme],
  },
  fonts: { display: vibrante.fonts.display, body: SERIF },
  weights: { display: 800, body: 400 },
  displayTracking: "-0.04em",
  motion: { speed: 1.1, intensity: 1.1, overshoot: 0.05, holdScale: 0.9 },
});

export const silencio: Theme = createTheme("calmo", {
  palette: {
    background: COR.azulNoite,
    surface: COR.creme,
    ink: COR.creme,
    muted: "#AEB8CF",
    accent: COR.laranja,
    accent2: COR.oceano,
    highlight: COR.laranja,
    glow: COR.oceano,
    spectrum: [COR.laranja, COR.oceano, COR.creme],
  },
  fonts: { display: vibrante.fonts.display, body: SERIF },
  weights: { display: 800, body: 400 },
  displayTracking: "-0.04em",
  motion: { speed: 0.85, intensity: 0.9, overshoot: 0.02, holdScale: 1.3 },
});

export const TEMAS = { calmo: memoria, base: creme, vibrante: travessia, misto: silencio };
