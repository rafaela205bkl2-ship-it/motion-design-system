import type React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useLayout } from "./layout";

export type EntrancePreset =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "slide-left"
  | "slide-right"
  | "scale"
  | "pop"
  | "blur";

export const ENTRANCE_PRESETS: EntrancePreset[] = [
  "fade",
  "fade-up",
  "fade-down",
  "slide-left",
  "slide-right",
  "scale",
  "pop",
  "blur",
];

export type EntranceOptions = {
  /** Atraso em segundos, relativo ao início do elemento. */
  readonly delay?: number;
  /** Duração em segundos. */
  readonly duration?: number;
  readonly preset?: EntrancePreset;
  /** Distância do deslocamento em pixels de design (base 1080). */
  readonly distance?: number;
};

const easeOutExpo = Easing.bezier(0.16, 1, 0.3, 1);

/**
 * Progresso 0 → 1 de uma entrada. Usa segundos, então funciona em qualquer fps.
 */
export const useProgress = ({
  delay = 0,
  duration = 0.8,
}: Pick<EntranceOptions, "delay" | "duration">) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [delay * fps, (delay + duration) * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutExpo,
  });
};

/**
 * Estilo de entrada responsivo. Distâncias são convertidas pela unidade
 * do formato atual, então o movimento tem o mesmo "peso" em qualquer proporção.
 */
export const useEntrance = ({
  delay = 0,
  duration = 0.8,
  preset = "fade-up",
  distance = 60,
}: EntranceOptions = {}): React.CSSProperties => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { px } = useLayout();
  const p = useProgress({ delay, duration });
  const d = px(distance);

  switch (preset) {
    case "fade":
      return { opacity: p };
    case "fade-up":
      return { opacity: p, translate: `0px ${(1 - p) * d}px` };
    case "fade-down":
      return { opacity: p, translate: `0px ${-(1 - p) * d}px` };
    case "slide-left":
      return { opacity: p, translate: `${(1 - p) * d * 2}px 0px` };
    case "slide-right":
      return { opacity: p, translate: `${-(1 - p) * d * 2}px 0px` };
    case "scale":
      return { opacity: p, scale: String(0.85 + 0.15 * p) };
    case "blur":
      return {
        opacity: p,
        filter: `blur(${(1 - p) * px(24)}px)`,
        scale: String(1.08 - 0.08 * p),
      };
    case "pop": {
      const s = spring({
        frame: frame - delay * fps,
        fps,
        config: { damping: 11, stiffness: 160 },
        durationInFrames: duration * fps,
      });
      return {
        opacity: Math.min(1, s * 2),
        scale: String(Math.max(0, s)),
      };
    }
    default:
      return {};
  }
};
