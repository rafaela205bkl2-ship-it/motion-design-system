import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { EasingInput } from "../easing";
import { progressAt, useMotion, type TimeValue } from "../MotionProvider";

export type BloomStep = {
  readonly color: string;
  /** Início da expansão, em segundos. */
  readonly at: number;
};

export type ColorBloomProps = {
  readonly steps: BloomStep[];
  /** Origem em fração da tela. */
  readonly origin?: [number, number];
  readonly duration?: TimeValue;
  readonly easing?: EasingInput;
  /** Borda suave, em px de design. */
  readonly softness?: number;
};

/**
 * Ciclo de cores dentro de uma cena: cada cor nasce num círculo que se
 * expande a partir da origem e cobre a anterior. Use como camada de fundo.
 */
export const ColorBloom: React.FC<ColorBloomProps> = ({
  steps,
  origin = [0.5, 0.5],
  duration = "fast",
  easing = "wipe",
  softness = 40,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const m = useMotion();
  const ox = origin[0] * width;
  const oy = origin[1] * height;
  const maxR = Math.max(
    Math.hypot(ox, oy),
    Math.hypot(width - ox, oy),
    Math.hypot(ox, height - oy),
    Math.hypot(width - ox, height - oy),
  );
  const soft = m.px(softness);
  const dur = m.dur(duration);

  return (
    <AbsoluteFill>
      {steps.map((s, i) => {
        const p = progressAt(frame, m.fps, s.at, dur, easing);
        if (p <= 0) return null;
        const r = (maxR + soft) * p;
        const mask = `radial-gradient(circle at ${ox}px ${oy}px, #000 ${Math.max(0, r - soft)}px, transparent ${r}px)`;
        return (
          <AbsoluteFill
            key={i}
            style={{
              background: s.color,
              maskImage: p >= 1 ? undefined : mask,
              WebkitMaskImage: p >= 1 ? undefined : mask,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
