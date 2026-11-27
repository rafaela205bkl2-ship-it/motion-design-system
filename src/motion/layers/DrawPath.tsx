/**
 * DrawPath — traço SVG que se desenha (stroke-dashoffset por quadro), com saída opcional
 * apagando a partir do início.
 *
 * Uso típico: linhas finas de marca (moldura de logotipo, cantoneiras em "L",
 * sublinhados). Origem: ref-aline-01 (2º trecho, 4,0 s: anel que se fecha antes da
 * troca de tela) e o detalhe de linha fina em "L" da identidade da cliente.
 * As coordenadas seguem o `viewBox` do SVG pai; use `pathLength` normalizado.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import type { EasingInput } from "../easing";
import { progressAt, useMotion, type TimeValue } from "../MotionProvider";

export type DrawPathProps = {
  readonly d: string;
  readonly delay?: number;
  readonly duration?: TimeValue;
  readonly easing?: EasingInput;
  /** Apaga o traço a partir deste tempo (segundos). */
  readonly exitAt?: number;
  readonly exitDuration?: TimeValue;
  readonly stroke?: string;
  /** Espessura nas unidades do viewBox. */
  readonly strokeWidth?: number;
  readonly linecap?: "round" | "butt" | "square";
  readonly speed?: number;
};

export const DrawPath: React.FC<DrawPathProps> = ({
  d,
  delay = 0,
  duration = 0.7,
  easing = "camera",
  exitAt,
  exitDuration = 0.35,
  stroke,
  strokeWidth = 3,
  linecap = "round",
  speed = 1,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const p = progressAt(frame, m.fps, delay, m.dur(duration, speed), easing);
  const e =
    exitAt === undefined ? 0 : progressAt(frame, m.fps, exitAt, m.dur(exitDuration, speed), "exit");
  if (p <= 0) return null;
  // comprimento normalizado em 1000; a saída "come" o traço pelo início
  const visible = 1000 * (p - e);
  const offset = -1000 * e;
  return (
    <path
      d={d}
      pathLength={1000}
      fill="none"
      stroke={stroke ?? m.palette.ink}
      strokeWidth={strokeWidth}
      strokeLinecap={linecap}
      strokeDasharray={`${Math.max(0, visible)} 2000`}
      strokeDashoffset={offset}
    />
  );
};
