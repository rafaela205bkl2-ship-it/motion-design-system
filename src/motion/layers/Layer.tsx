import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useMotion } from "../MotionProvider";

export type LayerProps = {
  readonly children: React.ReactNode;
  /**
   * Profundidade: 0 = plano do foco (nítido, na frente), 1 = fundo distante.
   * Controla desfoque, deriva e ordem de empilhamento.
   */
  readonly depth?: number;
  /** Desfoque máximo (no depth 1), em px de design. */
  readonly blur?: number;
  /** Deriva lenta de câmera, em px de design (multiplicada pela profundidade). */
  readonly drift?: number;
  /** Direção da deriva em graus (0 = direita, 90 = baixo). */
  readonly driftAngle?: number;
  /** Período da deriva, em segundos. */
  readonly driftPeriod?: number;
  /** Escala extra das camadas de fundo (evita bordas durante a deriva). */
  readonly overscan?: number;
  readonly opacity?: number;
  readonly style?: React.CSSProperties;
};

/**
 * Camada de uma composição com profundidade.
 * Empilhe várias dentro de um <AbsoluteFill>: as de `depth` maior ficam
 * atrás, desfocadas e com menos movimento — como uma câmera com foco raso.
 */
export const Layer: React.FC<LayerProps> = ({
  children,
  depth = 0,
  blur = 22,
  drift = 0,
  driftAngle = -90,
  driftPeriod = 8,
  overscan = 0.04,
  opacity = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const t = frame / m.fps;
  const b = m.blur(blur * depth);
  // deriva: as camadas de trás se movem MENOS (paralaxe)
  const amp = m.dist(drift) * (1 - depth * 0.7);
  const phase = Math.sin((t / driftPeriod) * Math.PI * 2);
  const a = (driftAngle * Math.PI) / 180;

  return (
    <AbsoluteFill
      style={{
        zIndex: Math.round((1 - depth) * 100),
        filter: b > 0.05 ? `blur(${b}px)` : undefined,
        translate: drift
          ? `${Math.cos(a) * amp * phase}px ${Math.sin(a) * amp * phase}px`
          : undefined,
        scale: depth > 0 ? String(1 + overscan * depth) : undefined,
        opacity,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
