import { useVideoConfig } from "remotion";

/**
 * Formatos suportados pela biblioteca.
 * O formato é detectado automaticamente pela proporção da composição,
 * então qualquer resolução (ex.: 720×1280) funciona sem configuração extra.
 */
export type FormatName = "vertical" | "horizontal" | "square";

export const FORMATS = {
  vertical: { width: 1080, height: 1920 }, // 9:16 — Reels, TikTok, Shorts
  horizontal: { width: 1920, height: 1080 }, // 16:9 — YouTube, apresentações
  square: { width: 1080, height: 1080 }, // 1:1 — feed
} as const;

export const getFormat = (width: number, height: number): FormatName => {
  const ratio = width / height;
  if (ratio < 0.9) return "vertical";
  if (ratio > 1.1) return "horizontal";
  return "square";
};

/** Valor diferente por formato. `square` cai para `vertical` se omitido. */
export type PerFormat<T> = {
  vertical: T;
  horizontal: T;
  square?: T;
};

/**
 * Área segura em "pixels de design" (base 1080).
 * No vertical, o topo e a base ficam mais livres por causa da interface
 * dos apps (legenda, botões, nome do perfil).
 */
const SAFE_AREA: Record<
  FormatName,
  { x: number; top: number; bottom: number }
> = {
  vertical: { x: 80, top: 200, bottom: 280 },
  horizontal: { x: 140, top: 100, bottom: 100 },
  square: { x: 90, top: 90, bottom: 90 },
};

/**
 * Hook central da biblioteca.
 *
 * Todas as medidas são escritas em "pixels de design", pensando numa tela
 * cujo lado menor tem 1080px. `px()` converte para o tamanho real, então
 * um título de 110 tem a mesma presença em 1080×1920, 1920×1080 ou 720×1280.
 */
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const format = getFormat(width, height);
  const unit = Math.min(width, height) / 1080;
  const px = (designPx: number) => designPx * unit;

  const pick = <T>(values: PerFormat<T>): T => {
    if (format === "square") return values.square ?? values.vertical;
    return values[format];
  };

  const safeDesign = SAFE_AREA[format];

  return {
    width,
    height,
    format,
    isVertical: format === "vertical",
    isHorizontal: format === "horizontal",
    isSquare: format === "square",
    unit,
    px,
    pick,
    safe: {
      x: px(safeDesign.x),
      top: px(safeDesign.top),
      bottom: px(safeDesign.bottom),
    },
  };
};
