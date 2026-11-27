/**
 * Identidade da cliente (Aline Barbosa — contabilidade e legalização de empresas).
 *
 * Cores medidas nas telas do carrossel (mediana de áreas lisas):
 *   marinho das telas escuras #112A3E · fundo da logo #0C202F
 *   azul-claro das telas claras #A7C1DA · caixa clara #B5CBE2
 * Fontes: Prata (serifada da logo e de "Prazer, eu sou, Aline.") + Poppins (textos).
 * Ritmo: as referências trocam de evento a cada 0,5–1,5 s → velocidade 1,15.
 */
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadPrata } from "@remotion/google-fonts/Prata";
import { createTheme } from "../../../motion";

const prata = loadPrata("normal", { weights: ["400"], subsets: ["latin"] });
const poppins = loadPoppins("normal", {
  weights: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin", "latin-ext"],
});
loadPoppins("italic", { weights: ["600", "700"], subsets: ["latin", "latin-ext"] });

export const FONTE_SERIFADA = prata.fontFamily;
export const FONTE_TEXTO = poppins.fontFamily;

export const COR = {
  marinho: "#112A3E",
  marinhoFundo: "#0C202F",
  marinhoClaro: "#1B3B57",
  azul: "#A7C1DA",
  azulCaixa: "#B5CBE2",
  azulProfundo: "#7FA0C2",
  gelo: "#F4F7FA",
  tinta: "#0F2436",
} as const;

const movimento = { speed: 1.15, intensity: 1, overshoot: 0.05, holdScale: 0.85 };

/** Telas escuras (marinho texturizado). */
export const temaMarinho = createTheme("base", {
  palette: {
    background: COR.marinho,
    surface: COR.marinhoClaro,
    ink: COR.gelo,
    muted: COR.azul,
    accent: COR.azul,
    accent2: COR.gelo,
    glow: "#1F4566",
    spectrum: [COR.marinho, COR.azul, COR.gelo, COR.azulProfundo],
  },
  fonts: { display: FONTE_SERIFADA, body: FONTE_TEXTO },
  weights: { display: 400, body: 500 },
  displayTracking: "-0.01em",
  motion: movimento,
});

/** Telas claras (azul do carrossel). */
export const temaClaro = createTheme(temaMarinho, {
  palette: {
    background: COR.azul,
    surface: COR.gelo,
    ink: COR.tinta,
    muted: "#36546F",
    accent: COR.marinho,
    accent2: COR.gelo,
    glow: "#C9DBEC",
  },
});
