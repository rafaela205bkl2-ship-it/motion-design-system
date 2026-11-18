import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "800"],
  subsets: ["latin", "latin-ext"],
});

/**
 * Tema da biblioteca v1 (legado), usado só pelas composições antigas das pastas
 * "Video" e "Cenas" (src/scenes, src/lib/components).
 *
 * @deprecated Não faz parte da identidade atual (DESIGN.md, MASTER_STYLE_GUIDE.md).
 * Produções novas usam os temas de `src/motion` (base, calmo, vibrante).
 */
export const theme = {
  fontFamily,
  background: "#0B0B1A",
  surface: "rgba(255, 255, 255, 0.06)",
  border: "rgba(255, 255, 255, 0.12)",
  text: "#FFFFFF",
  muted: "#A9ACC9",
  accent: "#7C5CFF",
  accent2: "#22D3EE",
} as const;
