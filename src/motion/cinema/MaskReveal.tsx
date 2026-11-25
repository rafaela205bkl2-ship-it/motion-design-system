/**
 * Revela um elemento com uma máscara de borda suave que avança numa direção
 * (ou do centro para fora). Para logotipos, lettering e imagens.
 *
 * Origem: ref-003 (tipografia que entra "cortada" e se completa) e direção de arte do
 * filme UMADSAL 2027 (lettering construído linha a linha; logotipo que se abre a partir do símbolo).
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import type { EasingInput } from "../easing";
import { progressAt, useMotion } from "../MotionProvider";

export type MaskRevealProps = {
  readonly children: React.ReactNode;
  readonly at?: number;
  readonly duration?: number;
  /** Para onde a revelação avança. */
  readonly direction?: "right" | "left" | "down" | "up" | "center";
  /** Largura da borda suave, em fração do elemento. */
  readonly softness?: number;
  readonly easing?: EasingInput;
  /** Desfoque inicial (px de design), que some com a revelação. */
  readonly blurFrom?: number;
  readonly style?: React.CSSProperties;
};

export const MaskReveal: React.FC<MaskRevealProps> = ({
  children,
  at = 0,
  duration = 1,
  direction = "right",
  softness = 0.2,
  easing = "enter",
  blurFrom = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const p = progressAt(frame, m.fps, at, duration, easing);
  const s = softness * 100;
  const e = p * (100 + s);
  let mask: string;
  if (direction === "center") {
    mask = `radial-gradient(ellipse at 50% 50%, black ${e - s}%, transparent ${e}%)`;
  } else {
    const dir = {
      right: "to right",
      left: "to left",
      down: "to bottom",
      up: "to top",
    }[direction];
    mask = `linear-gradient(${dir}, black ${e - s}%, transparent ${e}%)`;
  }
  const blur = blurFrom * (1 - p);
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        maskImage: p >= 1 ? undefined : mask,
        WebkitMaskImage: p >= 1 ? undefined : mask,
        filter: blur > 0.05 ? `blur(${m.px(blur)}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
