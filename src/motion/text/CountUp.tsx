/**
 * Número que conta de `from` até `value`, com formatação local (pt-BR por
 * padrão), prefixo/sufixo e entrada com desfoque.
 *
 * Origem: contador que desacelera até o valor final observado em ref-004
 * (23,0–25,0 s) e em ref-001. Tempo em segundos; tamanho em px de design.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import type { EasingInput } from "../easing";
import { progressAt, useMotion, type TimeValue } from "../MotionProvider";

export type CountUpProps = {
  readonly value: number;
  readonly from?: number;
  /** Início, em segundos. */
  readonly delay?: number;
  /** Duração da contagem. */
  readonly duration?: TimeValue;
  readonly easing?: EasingInput;
  readonly decimals?: number;
  readonly locale?: string;
  /** Separador de milhar (false para anos: "2026"). */
  readonly grouping?: boolean;
  readonly prefix?: string;
  readonly suffix?: string;
  /** Tamanho da fonte em px de design. */
  readonly size?: number;
  readonly color?: string;
  readonly font?: "display" | "body";
  readonly weight?: number;
  readonly speed?: number;
  readonly intensity?: number;
  readonly style?: React.CSSProperties;
};

export const CountUp: React.FC<CountUpProps> = ({
  value,
  from = 0,
  delay = 0,
  duration = 1.4,
  easing = "enterStrong",
  decimals = 0,
  locale = "pt-BR",
  grouping = true,
  prefix = "",
  suffix = "",
  size = 140,
  color,
  font = "display",
  weight,
  speed = 1,
  intensity = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const p = progressAt(frame, m.fps, delay, m.dur(duration, speed), easing);
  const appear = progressAt(
    frame,
    m.fps,
    delay,
    m.dur("reveal", speed),
    "enter",
  );
  const n = from + (value - from) * p;
  const text = n.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouping,
  });
  return (
    <div
      style={{
        fontFamily:
          font === "display" ? m.theme.fonts.display : m.theme.fonts.body,
        fontWeight: weight ?? m.theme.weights.display,
        fontSize: m.px(size),
        letterSpacing: m.theme.displayTracking,
        lineHeight: 1,
        color: color ?? m.palette.ink,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
        opacity: appear,
        transform: `translateY(${(1 - appear) * m.dist("text", intensity)}px)`,
        filter:
          appear < 1
            ? `blur(${m.blur("reveal", intensity) * (1 - appear)}px)`
            : undefined,
        ...style,
      }}
    >
      {prefix}
      {text}
      {suffix}
    </div>
  );
};
