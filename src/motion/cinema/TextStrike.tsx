/**
 * Risco que atravessa um texto (ou qualquer elemento) num instante: "não é isto…".
 * A linha cresce da esquerda para a direita com chegada decidida.
 *
 * Origem: ref-003 (tipografia editorial que corrige/contradiz a frase anterior) e
 * roteiro UMADSAL 2027 ("não é sobre aparências, mas sobre entrega").
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import type { EasingInput } from "../easing";
import { progressAt, useMotion } from "../MotionProvider";

export type TextStrikeProps = {
  readonly children: React.ReactNode;
  readonly at: number;
  readonly duration?: number;
  readonly color?: string;
  /** Espessura em px de design. */
  readonly thickness?: number;
  /** Altura da linha, em fração da caixa (0 = topo). */
  readonly y?: number;
  /** Quanto a linha passa das bordas, em fração da largura. */
  readonly extend?: number;
  readonly easing?: EasingInput;
  /** Opacidade do texto depois de riscado. */
  readonly dimTo?: number;
};

export const TextStrike: React.FC<TextStrikeProps> = ({
  children,
  at,
  duration = 0.35,
  color = "#D7142A",
  thickness = 6,
  y = 0.52,
  extend = 0.04,
  easing = "enterStrong",
  dimTo = 0.45,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const p = progressAt(frame, m.fps, at, duration, easing);
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div style={{ opacity: 1 - (1 - dimTo) * p }}>{children}</div>
      <div
        style={{
          position: "absolute",
          left: `${-extend * 100}%`,
          top: `calc(${y * 100}% - ${m.px(thickness) / 2}px)`,
          width: `${(1 + 2 * extend) * 100 * p}%`,
          height: m.px(thickness),
          background: color,
        }}
      />
    </div>
  );
};
