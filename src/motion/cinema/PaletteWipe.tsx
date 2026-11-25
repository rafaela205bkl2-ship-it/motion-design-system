/**
 * Transição por faixas de cor: as cores da paleta da marca atravessam a tela em sequência,
 * cobrem o quadro no instante `at` e saem, revelando a próxima cena.
 *
 * Origem: filme UMADSAL 2027 v2 — a paleta oficial (Pantone) vira elemento de montagem;
 * ref-003 (cortes de bloco com cartões de cor chapada).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { EasingInput } from "../easing";
import { progressAt, useMotion } from "../MotionProvider";

export type PaletteWipeProps = {
  /** Instante (s) em que as faixas cobrem a tela inteira. */
  readonly at: number;
  /** Cores das faixas, da primeira à última. */
  readonly colors: readonly string[];
  /** Duração total (entrada + saída), em segundos. */
  readonly duration?: number;
  readonly direction?: "right" | "left" | "up" | "down";
  /** Atraso entre faixas, em fração da metade da duração. */
  readonly stagger?: number;
  readonly easing?: EasingInput;
};

export const PaletteWipe: React.FC<PaletteWipeProps> = ({
  at,
  colors,
  duration = 0.6,
  direction = "right",
  stagger = 0.18,
  easing = "wipeSmooth",
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const half = duration / 2;
  const t = frame / m.fps;
  if (t < at - half - 0.05 || t > at + half + 0.05) return null;
  const horiz = direction === "right" || direction === "left";
  const sign = direction === "right" || direction === "down" ? 1 : -1;
  const n = colors.length;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {colors.map((c, i) => {
        // entrada escalonada (a de baixo primeiro): todas cobrem a tela em `at`;
        // saída na ordem inversa (a de cima primeiro), revelando as cores em cascata
        const k = n - 1 - i;
        const pinI = progressAt(
          frame,
          m.fps,
          at - half + i * stagger * half,
          half - i * stagger * half,
          easing,
        );
        const pout = progressAt(
          frame,
          m.fps,
          at + k * stagger * half,
          half - k * stagger * half * 0.5,
          easing,
        );
        // posição: -100% (fora) → 0 (cobrindo) → +100% (saiu do outro lado)
        const pos = (-1 + pinI + pout) * 100 * sign;
        return (
          <AbsoluteFill
            key={i}
            style={{
              background: c,
              transform: horiz ? `translateX(${pos}%)` : `translateY(${pos}%)`,
              zIndex: i,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
