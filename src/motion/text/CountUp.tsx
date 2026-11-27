/**
 * CountUp — número que dispara até o valor final, com prefixo/sufixo e formatação local.
 *
 * Origem: ref-aline-01 (2,5–3,5 s: saldo sobe "0,00 → 988.988,00" em ~0,6 s,
 * com desaceleração forte no fim) e ref-aline-02 (0,5–1,5 s: "€487 → €540").
 * A curva padrão é `enterStrong` (easeOutExpo): rápido no início, pousa no valor.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import type { EasingInput } from "../easing";
import { progressAt, useMotion, type TimeValue } from "../MotionProvider";

export type CountUpProps = {
  readonly to: number;
  readonly from?: number;
  /** Início, em segundos. */
  readonly delay?: number;
  /** Duração da contagem (segundos ou token). */
  readonly duration?: TimeValue;
  readonly easing?: EasingInput;
  readonly decimals?: number;
  /** Locale de formatação (separadores). */
  readonly locale?: string;
  readonly prefix?: string;
  readonly suffix?: string;
  /** Tamanho da fonte em px de design. */
  readonly size?: number;
  readonly font?: "display" | "body";
  readonly fontFamily?: string;
  readonly weight?: number;
  readonly color?: string;
  readonly speed?: number;
  readonly style?: React.CSSProperties;
};

export const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  delay = 0,
  duration = 0.9,
  easing = "enterStrong",
  decimals = 0,
  locale = "pt-BR",
  prefix = "",
  suffix = "",
  size = 160,
  font = "display",
  fontFamily,
  weight,
  color,
  speed = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const p = progressAt(frame, m.fps, delay, m.dur(duration, speed), easing);
  const v = from + (to - from) * p;
  const txt = v.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return (
    <div
      style={{
        fontFamily:
          fontFamily ?? (font === "display" ? m.theme.fonts.display : m.theme.fonts.body),
        fontWeight: weight ?? m.theme.weights.display,
        fontSize: m.px(size),
        lineHeight: 1,
        letterSpacing: m.theme.displayTracking,
        color: color ?? m.palette.ink,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {prefix}
      {txt}
      {suffix}
    </div>
  );
};
