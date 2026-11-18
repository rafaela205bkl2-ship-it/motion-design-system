/**
 * Correção de cor cinematográfica por cima da cena: tom nas sombras e nas altas luzes
 * (split toning), contraste suave, vinheta e um brilho de altas luzes (bloom) opcional.
 *
 * Por quê: uma cor única por ato amarra placas, gráficos e texto num mesmo filme.
 */
import React from "react";
import { AbsoluteFill } from "remotion";

export type GradeProps = {
  /** Tom das altas luzes (topo). */
  readonly highlights?: string;
  /** Tom das sombras (base). */
  readonly shadows?: string;
  /** Força do tom 0–1. */
  readonly amount?: number;
  /** Vinheta 0–1. */
  readonly vignette?: number;
  /** Brilho central 0–1 (simula bloom). */
  readonly bloom?: number;
  readonly bloomColor?: string;
  /** Posição do brilho (fração). */
  readonly bloomX?: number;
  readonly bloomY?: number;
};

export const Grade: React.FC<GradeProps> = ({
  highlights = "#FFB27A",
  shadows = "#2A1F5A",
  amount = 0.5,
  vignette = 0.45,
  bloom = 0,
  bloomColor = "#FFC89A",
  bloomX = 0.5,
  bloomY = 0.5,
}) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${highlights}, ${shadows})`, mixBlendMode: "soft-light", opacity: amount }} />
    {bloom > 0 ? (
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${bloomX * 100}% ${bloomY * 100}%, ${bloomColor} 0%, transparent 55%)`, mixBlendMode: "screen", opacity: bloom }} />
    ) : null}
    {vignette > 0 ? (
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 48%, transparent 50%, rgba(5,3,10,${0.85 * vignette}) 100%)` }} />
    ) : null}
  </AbsoluteFill>
);
