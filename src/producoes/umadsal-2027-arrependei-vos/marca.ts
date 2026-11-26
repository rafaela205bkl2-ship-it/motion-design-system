/**
 * Identidade UMADSAL 2027 aplicada ao filme.
 *
 * Cores: paleta oficial do PDF "ARREPENDEI-VOS" (pág. 5) + as duas cores medidas no lettering oficial
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
  /** Preto da paleta (PDF "ARREPENDEI-VOS", pág. 5: #0e0e0e) */
  preto: "#0E0E0E",
  /** Azul da paleta (PDF "ARREPENDEI-VOS", pág. 5: #142840) */
  navy: "#142840",
  /** Vinho da paleta (PDF "ARREPENDEI-VOS", pág. 5: #4e0000) */
  vinho: "#4E0000",
  /** Dourado da paleta (PDF "ARREPENDEI-VOS", pág. 5: #c89236) */
  ouro: "#C89236",
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
  cartazVinho: {
    src: asset("imagens/cartaz-vinho.jpg"),
    size: [3840, 2160] as const,
  },
  cartazCreme: {
    src: asset("imagens/cartaz-creme.jpg"),
    size: [3840, 2160] as const,
  },
  palco: { src: asset("imagens/palco-2027.jpg"), size: [3840, 2160] as const },
  crachas: {
    src: asset("imagens/crachas-2027.jpg"),
    size: [3840, 2160] as const,
  },
  logoVermelho: {
    src: asset("imagens/logo-vermelho.jpg"),
    size: [3840, 2160] as const,
  },
  prodigo: {
    src: asset("imagens/filho-prodigo.jpg"),
    size: [3200, 4176] as const,
  },
};

/** Objetos recortados (The Met Open Access, CC0) e fragmentos das pinturas/estampa. Créditos: objetos/creditos.json */
export const OBJ = {
  ampulheta: {
    src: asset("objetos/ampulheta.png"),
    size: [554, 1661] as const,
  },
  "astrolabio-1462": {
    src: asset("objetos/astrolabio-1462.png"),
    size: [931, 1271] as const,
  },
  "astrolabio-1654": {
    src: asset("objetos/astrolabio-1654.png"),
    size: [833, 1239] as const,
  },
  "cabeca-marmore": {
    src: asset("objetos/cabeca-marmore.png"),
    size: [858, 1253] as const,
  },
  "calice-1230": {
    src: asset("objetos/calice-1230.png"),
    size: [1018, 1351] as const,
  },
  "calice-1400": {
    src: asset("objetos/calice-1400.png"),
    size: [1014, 1431] as const,
  },
  "calice-1460": {
    src: asset("objetos/calice-1460.png"),
    size: [761, 1496] as const,
  },
  "elmo-1535": {
    src: asset("objetos/elmo-1535.png"),
    size: [1300, 1375] as const,
  },
  "elmo-1550": {
    src: asset("objetos/elmo-1550.png"),
    size: [1400, 1362] as const,
  },
  "elmo-dourado": {
    src: asset("objetos/elmo-dourado.png"),
    size: [1135, 1336] as const,
  },
  "espada-1400": {
    src: asset("objetos/espada-1400.png"),
    size: [363, 1519] as const,
  },
  "globo-celeste": {
    src: asset("objetos/globo-celeste.png"),
    size: [894, 1069] as const,
  },
  "gravura-mao-criador": {
    src: asset("objetos/gravura-mao-criador.png"),
    size: [264, 290] as const,
  },
  "gravura-mao-humana": {
    src: asset("objetos/gravura-mao-humana.png"),
    size: [327, 331] as const,
  },
  lira: { src: asset("objetos/lira.png"), size: [719, 1750] as const },
  "mao-adao": { src: asset("objetos/mao-adao.png"), size: [432, 202] as const },
  "mao-criador": {
    src: asset("objetos/mao-criador.png"),
    size: [292, 161] as const,
  },
  "medalha-1749": {
    src: asset("objetos/medalha-1749.png"),
    size: [894, 905] as const,
  },
  "moeda-ouro": {
    src: asset("objetos/moeda-ouro.png"),
    size: [764, 715] as const,
  },
  "relogio-1565": {
    src: asset("objetos/relogio-1565.png"),
    size: [574, 974] as const,
  },
};
export type ObjNome = keyof typeof OBJ;

/** Trilha sem narração (música + efeitos), gerada por scripts/trilha-umadsal-2027.py. A versão com voz é audio/filme-final.mp3. */
export const TRILHA = asset("audio/filme-mix.mp3");
