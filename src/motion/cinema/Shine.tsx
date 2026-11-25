/**
 * Faixa de luz que varre um elemento (texto, logotipo, lettering) respeitando a forma dele:
 * o conteúdo é desenhado duas vezes e a cópia clareada aparece só dentro da faixa.
 *
 * Origem: direção de arte do filme UMADSAL 2027 (revelação de marca com luz);
 * equivalente ao "light sweep" de aberturas de trailer.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import type { EasingInput } from "../easing";
import { progressAt, useMotion } from "../MotionProvider";

export type ShineProps = {
  readonly children: React.ReactNode;
  /** Início da varredura (s). */
  readonly at?: number;
  readonly duration?: number;
  /** Ângulo da faixa, em graus (0 = vertical, varrendo para a direita). */
  readonly angle?: number;
  /** Largura da faixa, em fração do elemento. */
  readonly width?: number;
  /** Brilho da cópia clareada. */
  readonly intensity?: number;
  readonly easing?: EasingInput;
  readonly style?: React.CSSProperties;
};

export const Shine: React.FC<ShineProps> = ({
  children,
  at = 0,
  duration = 1.4,
  angle = 18,
  width = 0.22,
  intensity = 2.2,
  easing = "wipeSmooth",
  style,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const p = progressAt(frame, m.fps, at, duration, easing);
  const active = p > 0 && p < 1;
  const c = (-width + p * (1 + 2 * width)) * 100;
  const w = width * 100;
  const mask = `linear-gradient(${90 + angle}deg, transparent ${c - w}%, black ${c}%, transparent ${c + w}%)`;
  return (
    <div style={{ position: "relative", display: "inline-block", ...style }}>
      {children}
      {active ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            filter: `brightness(${intensity}) saturate(0.8)`,
            maskImage: mask,
            WebkitMaskImage: mask,
            pointerEvents: "none",
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};
