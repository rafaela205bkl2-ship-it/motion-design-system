/**
 * Caixa técnica de detecção: o contorno se desenha, marcas nos cantos aparecem e um
 * rótulo pequeno nasce junto — o "olhar analítico" sobre uma imagem.
 *
 * Origem: ref-004 (2,5–5,0 s: caixas azuis sobre fragmentos de pintura, com rótulos técnicos).
 * Coordenadas em px de design, relativas ao quadro (1080 no lado menor).
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import type { EasingInput } from "../easing";
import { progressAt, useMotion } from "../MotionProvider";

export type TechBoxProps = {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly at?: number;
  readonly duration?: number;
  readonly exitAt?: number;
  readonly color?: string;
  /** Espessura em px de design. */
  readonly stroke?: number;
  readonly label?: string;
  readonly labelColor?: string;
  readonly font?: string;
  readonly easing?: EasingInput;
};

export const TechBox: React.FC<TechBoxProps> = ({
  x,
  y,
  w,
  h,
  at = 0,
  duration = 0.35,
  exitAt,
  color = "#13273F",
  stroke = 3,
  label,
  labelColor = "#FFFFFF",
  font,
  easing = "enterStrong",
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const p = progressAt(frame, m.fps, at, duration, easing);
  const out =
    exitAt === undefined ? 0 : progressAt(frame, m.fps, exitAt, 0.15, "exit");
  if (p <= 0 || out >= 1) return null;
  const X = m.px(x);
  const Y = m.px(y);
  const W = m.px(w);
  const H = m.px(h);
  const s = m.px(stroke);
  const per = 2 * (W + H);
  const tick = m.px(14);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        opacity: 1 - out,
        pointerEvents: "none",
      }}
    >
      <svg
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
        width="100%"
        height="100%"
      >
        <rect
          x={X}
          y={Y}
          width={W}
          height={H}
          fill="none"
          stroke={color}
          strokeWidth={s}
          strokeDasharray={per}
          strokeDashoffset={per * (1 - p)}
        />
        {p > 0.6
          ? [
              [X, Y, 1, 1],
              [X + W, Y, -1, 1],
              [X, Y + H, 1, -1],
              [X + W, Y + H, -1, -1],
            ].map(([cx, cy, dx, dy], i) => (
              <path
                key={i}
                d={`M${cx - dx * tick * 0.5},${cy + dy * tick} L${cx - dx * tick * 0.5},${cy - dy * tick * 0.5} L${cx + dx * tick},${cy - dy * tick * 0.5}`}
                fill="none"
                stroke={color}
                strokeWidth={s * 1.6}
              />
            ))
          : null}
      </svg>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: X - s / 2,
            top: Y - m.px(30),
            height: m.px(30),
            padding: `0 ${m.px(10)}px`,
            display: "flex",
            alignItems: "center",
            background: color,
            color: labelColor,
            fontFamily: font,
            fontWeight: 700,
            fontStyle: "italic",
            fontSize: m.px(15),
            letterSpacing: "0.22em",
            whiteSpace: "nowrap",
            clipPath: `inset(0 ${(1 - Math.min(1, p * 1.4)) * 100}% 0 0)`,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};
