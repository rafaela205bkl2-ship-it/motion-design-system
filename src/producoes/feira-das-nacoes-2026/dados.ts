/**
 * Dados da reedição: tempos medidos no vídeo oficial, bandeiras e falas.
 *
 * - Cortes: detecção de cena (ffmpeg, limiar 0,25) sobre videos/oficial.mp4.
 * - Falas: transcrição automática (Whisper large-v3) com tempo por palavra,
 *   revisada à mão. Tempos em segundos do vídeo original.
 */
import { createTheme, type CaptionWord, type Stripe } from "../../motion";

/** Identidade do evento: roxo profundo do painel + dourado do título. */
export const temaFeira = createTheme("vibrante", {
  palette: {
    background: "#1A0E4F",
    surface: "#FFFFFF",
    ink: "#FFFFFF",
    muted: "#D8D1FF",
    accent: "#F7BE3A",
    accent2: "#6B3DF2",
    glow: "#7C5CFF",
    spectrum: ["#1A0E4F", "#6B3DF2", "#F7BE3A", "#FFFFFF"],
  },
  motion: { speed: 1.05 },
});

export const DURACAO_VIDEO = 65.27;
export const DURACAO_ENCERRAMENTO = 5;

/** Textos editáveis (nomes a confirmar com a produção). */
export const TEXTOS = {
  pastor: { rotulo: "Palavra pastoral", nome: "Assembleia de Deus" },
  missoes: { rotulo: "Missões", nome: "Shlichut Israel" },
  versiculo: "“Ide por todo o mundo e pregai o evangelho.”",
  referencia: "Marcos 16:15",
};

export type PaisId =
  | "brasil"
  | "turquia"
  | "caboVerde"
  | "mexico"
  | "israel"
  | "croacia"
  | "indonesia"
  | "portugal"
  | "cuba"
  | "gambia";

export type Pais = {
  nome: string;
  /** Faixas da transição (cores da bandeira). */
  faixas: Stripe[];
  orientacao: "vertical" | "horizontal";
  /** Posição aproximada no globo. */
  lat: number;
  lon: number;
};

export const PAISES: Record<PaisId, Pais> = {
  brasil: {
    nome: "Brasil",
    faixas: [{ color: "#009C3B" }, { color: "#FFDF00" }, { color: "#002776" }],
    orientacao: "horizontal",
    lat: -14,
    lon: -51,
  },
  turquia: {
    nome: "Turquia",
    faixas: [
      { color: "#E30A17" },
      { color: "#FFFFFF", weight: 0.4 },
      { color: "#E30A17" },
    ],
    orientacao: "vertical",
    lat: 39,
    lon: 35,
  },
  caboVerde: {
    nome: "Cabo Verde",
    faixas: [
      { color: "#003893", weight: 2 },
      { color: "#FFFFFF", weight: 0.5 },
      { color: "#CF2027", weight: 0.5 },
      { color: "#FFFFFF", weight: 0.5 },
      { color: "#003893", weight: 1.2 },
    ],
    orientacao: "horizontal",
    lat: 16,
    lon: -24,
  },
  mexico: {
    nome: "México",
    faixas: [{ color: "#006847" }, { color: "#FFFFFF" }, { color: "#CE1126" }],
    orientacao: "vertical",
    lat: 23,
    lon: -102,
  },
  israel: {
    nome: "Israel",
    faixas: [
      { color: "#FFFFFF", weight: 0.6 },
      { color: "#0038B8", weight: 0.7 },
      { color: "#FFFFFF", weight: 2 },
      { color: "#0038B8", weight: 0.7 },
      { color: "#FFFFFF", weight: 0.6 },
    ],
    orientacao: "horizontal",
    lat: 31,
    lon: 35,
  },
  croacia: {
    nome: "Croácia",
    faixas: [
      { color: "#FF0000" },
      { color: "#FF0000", pattern: "checker", color2: "#FFFFFF" },
      { color: "#171796" },
    ],
    orientacao: "horizontal",
    lat: 45,
    lon: 16,
  },
  indonesia: {
    nome: "Indonésia",
    faixas: [{ color: "#CE1126" }, { color: "#FFFFFF" }],
    orientacao: "horizontal",
    lat: -2,
    lon: 118,
  },
  portugal: {
    nome: "Portugal",
    faixas: [
      { color: "#006600", weight: 2 },
      { color: "#FFCC00", weight: 0.35 },
      { color: "#FF0000", weight: 3 },
    ],
    orientacao: "vertical",
    lat: 39,
    lon: -8,
  },
  cuba: {
    nome: "Cuba",
    faixas: [
      { color: "#002A8F" },
      { color: "#FFFFFF" },
      { color: "#002A8F" },
      { color: "#FFFFFF" },
      { color: "#002A8F" },
    ],
    orientacao: "horizontal",
    lat: 22,
    lon: -80,
  },
  gambia: {
    nome: "Gâmbia",
    faixas: [
      { color: "#CE1126", weight: 6 },
      { color: "#FFFFFF", weight: 1 },
      { color: "#0C1C8C", weight: 4 },
      { color: "#FFFFFF", weight: 1 },
      { color: "#3A7728", weight: 6 },
    ],
    orientacao: "horizontal",
    lat: 13.4,
    lon: -15.3,
  },
};

/** Cortes do vídeo original em que entra uma transição de bandeira. */
export const TRANSICOES: {
  pais: PaisId;
  corte: number;
  de: "left" | "right" | "top" | "bottom";
}[] = [
  { pais: "mexico", corte: 28.27, de: "left" },
  { pais: "israel", corte: 36.3, de: "right" },
  { pais: "croacia", corte: 50.27, de: "left" },
  { pais: "indonesia", corte: 52.7, de: "right" },
  { pais: "portugal", corte: 56.3, de: "left" },
  { pais: "gambia", corte: 61.33, de: "right" },
];

/** Etiquetas de país: [início, fim] em segundos do vídeo. */
export const ETIQUETAS: {
  pais: PaisId;
  de: number;
  ate: number;
  rotulo?: string;
}[] = [
  { pais: "caboVerde", de: 3.6, ate: 6.55, rotulo: "Estande" },
  { pais: "mexico", de: 28.6, ate: 35.9, rotulo: "Estande" },
  { pais: "israel", de: 36.6, ate: 40.5, rotulo: "Estande" },
  { pais: "croacia", de: 50.55, ate: 52.45 },
  { pais: "indonesia", de: 53.0, ate: 56.05 },
  { pais: "portugal", de: 56.6, ate: 59.2, rotulo: "Apresentação" },
  { pais: "cuba", de: 59.45, ate: 61.1 },
  { pais: "gambia", de: 61.6, ate: 64.9 },
];

const w = (list: [string, number, number][]): CaptionWord[] =>
  list.map(([text, start, end]) => ({ text, start, end }));

/** Fala 1 (pastor), 10,17–28,27 s. Tempos de palavra do Whisper large-v3. */
export const FALA_PASTOR = w([
  ["Irmãos,", 10.25, 10.7],
  ["a", 10.77, 10.93],
  ["paz", 10.93, 11.13],
  ["do", 11.13, 11.27],
  ["Senhor!", 11.27, 11.6],
  ["Estamos", 11.63, 12.19],
  ["aqui", 12.19, 12.6],
  ["na", 12.65, 12.93],
  ["Assembleia", 12.93, 13.19],
  ["de", 13.19, 13.31],
  ["Deus,", 13.31, 13.8],
  ["Sede", 13.87, 14.23],
  ["Paralela,", 14.23, 14.9],
  ["para", 15.03, 15.55],
  ["mais", 15.55, 15.79],
  ["uma", 15.79, 15.97],
  ["edição", 15.97, 16.33],
  ["da", 16.33, 16.59],
  ["*Feira*", 16.59, 16.87],
  ["*das*", 16.87, 17.03],
  ["*Nações*", 17.03, 17.55],
  ["*2026.*", 17.61, 18.6],
  ["Esse", 19.09, 19.57],
  ["é", 19.57, 19.63],
  ["um", 19.63, 19.69],
  ["momento", 19.69, 19.95],
  ["*ímpar*", 19.95, 20.45],
  ["que", 20.51, 20.69],
  ["o", 20.69, 20.75],
  ["Senhor", 20.75, 20.87],
  ["nos", 20.87, 20.97],
  ["permite", 20.97, 21.4],
  ["pensarmos", 22.01, 22.85],
  ["um", 22.91, 23.03],
  ["pouco", 23.03, 23.31],
  ["sobre", 23.31, 23.45],
  ["os", 23.45, 23.55],
  ["nossos", 23.55, 23.83],
  ["irmãos", 23.83, 24.3],
  ["que", 24.31, 24.81],
  ["são", 24.81, 25.07],
  ["de", 25.07, 25.27],
  ["*outras*", 25.27, 25.55],
  ["*nações*", 25.55, 26.0],
  ["e", 26.05, 26.41],
  ["que", 26.41, 26.73],
  ["precisam", 26.73, 27.09],
  ["conhecer", 27.09, 27.29],
  ["a", 27.29, 27.61],
  ["*Cristo.*", 27.61, 28.1],
]);

/** Fala 2 (missões), 40,77–50,27 s. */
export const FALA_MISSOES = w([
  ["Esse", 41.1, 41.46],
  ["projeto", 41.46, 41.74],
  ["nos", 41.74, 42.22],
  ["traz", 42.22, 42.46],
  ["à", 42.46, 42.58],
  ["memória", 42.58, 42.92],
  ["a", 42.92, 43.08],
  ["importância", 43.08, 43.68],
  ["de", 43.68, 43.92],
  ["pregar", 43.92, 44.34],
  ["o", 44.34, 44.54],
  ["*Evangelho*", 44.54, 45.04],
  ["aos", 45.04, 45.16],
  ["*países*", 45.16, 45.48],
  ["*perseguidos*", 45.48, 46.15],
  ["e", 46.22, 46.52],
  ["de", 46.52, 46.66],
  ["sempre", 46.66, 47.0],
  ["nós", 47.0, 47.24],
  ["orarmos", 47.24, 47.84],
  ["pelos", 47.84, 48.16],
  ["nossos", 48.16, 48.46],
  ["*missionários*", 48.46, 49.0],
  ["que", 49.0, 49.2],
  ["estão", 49.2, 49.42],
  ["lá", 49.42, 49.58],
  ["fora.", 49.58, 50.1],
]);
