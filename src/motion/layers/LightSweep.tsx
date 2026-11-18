/**
 * Faixa de luz que atravessa a tela (ou um cartão) uma vez.
 *
 * Por quê: brilho que passa por texto e cartões para marcar a chegada de algo importante,
 * como a luz que "acende" um objeto. Usa `mixBlendMode: screen` para clarear sem cobrir.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { EasingInput } from "../easing";
import { progressAt, useMotion, type TimeValue } from "../MotionProvider";

export type LightSweepProps = {
  readonly delay?: number;
  readonly duration?: TimeValue;
  readonly easing?: EasingInput;
  readonly speed?: number;
  /** Ângulo da faixa (graus). */
  readonly angle?: number;
  /** Largura da faixa em % da tela. */
  readonly width?: number;
  readonly color?: string;
  readonly opacity?: number;
  /** "forward" (esquerda → direita) ou "reverse". */
  readonly direction?: "forward" | "reverse";
};

export const LightSweep: React.FC<LightSweepProps> = ({
  delay = 0,
  duration = 0.9,
  easing = "camera",
  speed = 1,
  angle = 110,
  width = 18,
  color = "rgba(255,255,255,0.55)",
  opacity = 1,
  direction = "forward",
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const p = progressAt(frame, m.fps, delay / speed, m.dur(duration, speed), easing);
  if (p <= 0 || p >= 1) return null;
  const pos = (direction === "forward" ? p : 1 - p) * (100 + width * 2) - width;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, transparent ${pos - width / 2}%, ${color} ${pos}%, transparent ${pos + width / 2}%)`,
        mixBlendMode: "screen",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};
