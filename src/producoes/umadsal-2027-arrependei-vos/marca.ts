/**
 * Identidade UMADSAL 2027 aplicada ao filme.
 *
 * Cores: paleta oficial do PDF "ID 2027" (pág. 3) + as duas cores medidas no lettering oficial
 * (pág. 1): o vermelho do topo do gradiente e o creme do fundo. Nada aqui é inventado.
 * Tipografia de apoio: grotesca bold itálica com espaçamento largo, como nos textos da camisa
 * (equivalente livre: Archivo). Os títulos narrativos do filme usam Cormorant Garamond
 * (serifa renascentista), que NÃO faz parte da marca: é a voz do "arquivo histórico".
 */
import { loadFont as loadArchivo } from "@remotion/google-fonts/Archivo";
import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
import { staticFile } from "remotion";
import { createTheme } from "../../motion";

const archivo = loadArchivo("italic", {
  weights: ["700", "800"],
  subsets: ["latin", "latin-ext"],
});
const cormorant = loadCormorant("normal", {
  weights: ["500", "600"],
  subsets: ["latin", "latin-ext"],
});

export const FONTES = {
  /** Voz da identidade (textos da camisa, versículo, assinatura). */
  marca: archivo.fontFamily,
  /** Voz do filme (títulos narrativos, rótulos de obras). */
  filme: cormorant.fontFamily,
};

export const COR = {
  /** Pantone Black C "Armor Wash" — #030303 */
  preto: "#030303",
  /** Pantone 7546C "Mystic Navy" — #13273F */
  navy: "#13273F",
  /** Pantone 4975C "Red Inferno" — #4E0000 */
  vinho: "#4E0000",
  /** Pantone 15-0953 TCX "Golden Yellow" — #CB8E16 */
  ouro: "#CB8E16",
  /** Vermelho do topo do gradiente do lettering oficial (medido: 223, 18, 35). */
  vermelho: "#DF1223",
  /** Creme do fundo da apresentação oficial do lettering (medido: 255, 245, 236). */
  creme: "#FFF5EC",
  /** Marfim para texto sobre o escuro (derivado do creme). */
  marfim: "#F3EADB",
  /** Luz quente (raios, poeira). */
  luz: "#FFD9A0",
};

export const tema = createTheme("base", {
  palette: {
    background: COR.preto,
    surface: COR.creme,
    ink: COR.marfim,
    muted: "#9A8F80",
    accent: COR.vermelho,
    accent2: COR.ouro,
    glow: COR.vinho,
    spectrum: [COR.vermelho, COR.ouro, COR.navy, COR.vinho],
  },
  fonts: { display: cormorant.fontFamily, body: archivo.fontFamily },
  weights: { display: 500, body: 700 },
  displayTracking: "0.12em",
  motion: { speed: 0.85, intensity: 0.9, overshoot: 0.0, holdScale: 1.2 },
});

const BASE = "producoes/umadsal-2027-arrependei-vos/";
export const asset = (f: string) => staticFile(BASE + f);

/** Imagens com tamanho natural (para a câmera virtual). */
export const IMG = {
  lettering: {
    src: asset("imagens/lettering-arrependei-vos.png"),
    size: [2248, 2776] as const,
  },
  logo: { src: asset("imagens/umadsal-logo.png"), size: [3484, 1052] as const },
  camisas: {
    src: asset("imagens/camisas-2027.jpg"),
    size: [3840, 2160] as const,
  },
  paleta: {
    src: asset("imagens/paleta-2027.jpg"),
    size: [3840, 2160] as const,
  },
  papel: { src: asset("imagens/papel-preto.jpg"), size: [3840, 2160] as const },
  papelSimbolo: {
    src: asset("imagens/papel-preto-simbolo.jpg"),
    size: [3840, 2160] as const,
  },
  adao: {
    src: asset("imagens/criacao-de-adao.jpg"),
    size: [3524, 1599] as const,
  },
  atenas: {
    src: asset("imagens/escola-de-atenas.jpg"),
    size: [3600, 2793] as const,
  },
  vitruviano: {
    src: asset("imagens/homem-vitruviano.jpg"),
    size: [3200, 2819] as const,
  },
  expulsao: {
    src: asset("imagens/expulsao-michelangelo.jpg"),
    size: [1758, 770] as const,
  },
  masaccio: {
    src: asset("imagens/expulsao-masaccio.jpg"),
    size: [914, 1312] as const,
  },
  prodigo: {
    src: asset("imagens/filho-prodigo.jpg"),
    size: [3200, 4176] as const,
  },
};

export const TRILHA = asset("audio/filme-mix.mp3");
