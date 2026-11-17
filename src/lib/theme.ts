import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "800"],
  subsets: ["latin", "latin-ext"],
});

/** Paleta e tipografia padrão. Troque aqui para mudar a identidade de todo o vídeo. */
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
