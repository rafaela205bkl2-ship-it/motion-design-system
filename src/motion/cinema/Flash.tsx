/**
 * Clarão de tela inteira em instantes definidos (impactos, cortes de trailer).
 * Ataque curto e decaimento exponencial.
 *
 * Origem: ref-003 (cortes de impacto com clarão/"blown out" entre blocos) e linguagem de trailer.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useMotion } from "../MotionProvider";

export type FlashProps = {
  /** Instantes dos clarões (s). */
  readonly at: readonly number[];
  readonly color?: string;
  /** Subida (s). */
  readonly attack?: number;
  /** Decaimento (s) até ~5%. */
  readonly decay?: number;
  readonly peak?: number;
  readonly blend?: React.CSSProperties["mixBlendMode"];
};

export const Flash: React.FC<FlashProps> = ({
  at,
  color = "#FFFFFF",
  attack = 0.03,
  decay = 0.45,
  peak = 1,
  blend = "normal",
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const t = frame / m.fps;
  let o = 0;
  for (const a of at) {
    const d = t - a;
    if (d < -attack || d > decay * 2) continue;
    const v = d < 0 ? 1 + d / attack : Math.exp((-3 * d) / decay);
    o = Math.max(o, v);
  }
  if (o <= 0.002) return null;
  return (
    <AbsoluteFill
      style={{
        background: color,
        opacity: o * peak,
        mixBlendMode: blend,
        pointerEvents: "none",
      }}
    />
  );
};
