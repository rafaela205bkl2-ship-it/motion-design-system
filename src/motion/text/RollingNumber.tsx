/**
 * Número que rola como um odômetro entre uma sequência de valores.
 *
 * Observado em ref-001 (23,0–25,3 s): dígitos rolando até o valor final com sobra ~7%.
 * Cada dígito avança para a frente (9 → 0 dá a volta) e os vizinhos somem por opacidade,
 * sem `overflow: hidden`, para funcionar também dentro de um palco 3D.
 *
 * `renderDigit` permite trocar a face do dígito (por exemplo, por `DepthType`).
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import type { EasingInput } from "../easing";
import { progressAt, useMotion, type TimeValue } from "../MotionProvider";

export type RollingNumberProps = {
  /** Valores em sequência (ex.: [2013, 2018, 2022, 2026]). */
  readonly values: number[];
  /** Instante (s) em que cada troca começa; values.length − 1 itens. */
  readonly times: number[];
  /** Duração de cada troca. */
  readonly duration?: TimeValue;
  /** Atraso entre dígitos, da direita para a esquerda (s). */
  readonly stagger?: number;
  readonly easing?: EasingInput;
  readonly speed?: number;
  /** Altura de um dígito em px de design (= tamanho da fonte). */
  readonly size?: number;
  /** Quantas casas mostrar (completa com zeros à esquerda). */
  readonly digits?: number;
  /** Distância percorrida entre dígitos, em fração da altura. */
  readonly travel?: number;
  readonly color?: string;
  readonly font?: "display" | "body";
  readonly weight?: number;
  /** Desenha a face do dígito. Padrão: texto simples. */
  readonly renderDigit?: (digit: string, index: number) => React.ReactNode;
  readonly style?: React.CSSProperties;
};

const pad = (v: number, n: number) => String(Math.abs(Math.round(v))).padStart(n, "0");

export const RollingNumber: React.FC<RollingNumberProps> = ({
  values,
  times,
  duration = 0.7,
  stagger = 0.06,
  easing = "enterStrong",
  speed = 1,
  size = 260,
  digits,
  travel = 0.9,
  color,
  font = "display",
  weight,
  renderDigit,
  style,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const n = digits ?? Math.max(...values.map((v) => pad(v, 1).length));
  const strs = values.map((v) => pad(v, n));
  const d = m.dur(duration, speed);
  const h = m.px(size);

  const columns = Array.from({ length: n }, (_, col) => {
    // posição contínua do dígito: soma das voltas de cada troca
    let pos = Number(strs[0][col]);
    for (let s = 1; s < strs.length; s++) {
      const a = Number(strs[s - 1][col]);
      const b = Number(strs[s][col]);
      const delta = (b - a + 10) % 10;
      if (delta === 0) continue;
      const start = (times[s - 1] ?? 0) / speed + (n - 1 - col) * m.stag(stagger, speed);
      pos += delta * progressAt(frame, m.fps, start, d, easing);
    }
    const base = Math.floor(pos);
    const frac = pos - base;
    return [-1, 0, 1, 2].map((k) => {
      const digit = (((base + k) % 10) + 10) % 10;
      const offset = k - frac; // 0 = no lugar
      const op = Math.max(0, 1 - Math.abs(offset) * 1.6);
      // o dígito k = 0 sempre fica no fluxo (relativo) e dá a largura da coluna, mesmo invisível
      if (op <= 0.001 && k !== 0) return null;
      return (
        <div
          key={k}
          style={{
            position: k === 0 ? "relative" : "absolute",
            left: 0,
            top: 0,
            transform: `translateY(${offset * h * travel}px)`,
            opacity: op,
          }}
        >
          {renderDigit ? (
            renderDigit(String(digit), col)
          ) : (
            <span>{digit}</span>
          )}
        </div>
      );
    });
  });

  return (
    <div
      style={{
        display: "flex",
        transformStyle: "preserve-3d",
        fontFamily: font === "display" ? m.theme.fonts.display : m.theme.fonts.body,
        fontWeight: weight ?? m.theme.weights.display,
        fontSize: h,
        lineHeight: 1,
        color: color ?? m.palette.ink,
        letterSpacing: m.theme.displayTracking,
        fontVariantNumeric: "tabular-nums",
        ...style,
      }}
    >
      {columns.map((c, i) => (
        <div key={i} style={{ position: "relative", transformStyle: "preserve-3d" }}>
          {c}
        </div>
      ))}
    </div>
  );
};
