/**
 * TapCursor — cursor (seta ou dedo-círculo) que viaja entre pontos e "clica",
 * com afundamento e onda no toque.
 *
 * Origem: ref-aline-03 (7,5–9,0 s: seta passa por ícones de serviço e clica em cada
 * um, o ícone reage) e ref-aline-01 (2º trecho, 5,5–9,5 s: círculo clica no botão
 * "MOTION" e depois no "seguir"). Cada ponto tem um tempo de chegada; o clique
 * acontece na chegada.
 */
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { resolveEasing } from "../easing";
import { useMotion } from "../MotionProvider";

export type TapPoint = {
  /** Posição em px de design, relativa ao contêiner. */
  x: number;
  y: number;
  /** Chegada, em segundos. */
  at: number;
  /** Clica ao chegar (padrão: true). */
  tap?: boolean;
};

export type TapCursorProps = {
  readonly points: TapPoint[];
  /** Tempo de viagem entre pontos, em segundos. */
  readonly travel?: number;
  /** Aparece neste tempo (segundos). Padrão: 0,25 s antes do 1º ponto. */
  readonly appearAt?: number;
  /** Some neste tempo (segundos). */
  readonly hideAt?: number;
  readonly variant?: "arrow" | "dot";
  /** Tamanho em px de design. */
  readonly size?: number;
  readonly color?: string;
  readonly rippleColor?: string;
};

/** Progresso do clique (0→1→0) em torno de `at`; útil para o alvo reagir junto. */
export const tapPulse = (t: number, at: number, len = 0.22) =>
  t < at || t > at + len ? 0 : Math.sin(((t - at) / len) * Math.PI);

export const TapCursor: React.FC<TapCursorProps> = ({
  points,
  travel = 0.35,
  appearAt,
  hideAt,
  variant = "arrow",
  size = 70,
  color = "#FFFFFF",
  rippleColor,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const t = frame / m.fps;
  if (!points.length) return null;
  const ease = resolveEasing("camera");
  const show = appearAt ?? points[0].at - 0.25;
  const op =
    interpolate(t, [show, show + 0.15], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    (hideAt === undefined
      ? 1
      : interpolate(t, [hideAt, hideAt + 0.15], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }));
  if (op <= 0) return null;

  // posição: interpola até o próximo ponto durante `travel` antes da chegada
  let x = points[0].x;
  let y = points[0].y;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const s = b.at - travel;
    const k = ease(Math.min(1, Math.max(0, (t - s) / travel)));
    if (t >= s) {
      x = a.x + (b.x - a.x) * k;
      y = a.y + (b.y - a.y) * k;
    }
  }
  let press = 0;
  let ripple = -1;
  for (const pt of points) {
    if (pt.tap === false) continue;
    press = Math.max(press, tapPulse(t, pt.at));
    if (t >= pt.at && t < pt.at + 0.45) ripple = (t - pt.at) / 0.45;
  }
  const s = m.px(size);

  return (
    <div
      style={{
        position: "absolute",
        left: m.px(x),
        top: m.px(y),
        width: 0,
        height: 0,
        opacity: op,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      {ripple >= 0 ? (
        <div
          style={{
            position: "absolute",
            left: -s * (0.4 + ripple * 0.9),
            top: -s * (0.4 + ripple * 0.9),
            width: s * (0.8 + ripple * 1.8),
            height: s * (0.8 + ripple * 1.8),
            borderRadius: "50%",
            border: `${m.px(4)}px solid ${rippleColor ?? color}`,
            opacity: 1 - ripple,
          }}
        />
      ) : null}
      <div style={{ transform: `scale(${1 - press * 0.18})`, transformOrigin: "0 0" }}>
        {variant === "dot" ? (
          <div
            style={{
              position: "absolute",
              left: -s / 2,
              top: -s / 2,
              width: s,
              height: s,
              borderRadius: "50%",
              background: color,
              opacity: 0.85,
              boxShadow: `0 ${m.px(6)}px ${m.px(18)}px rgba(0,0,0,.25)`,
            }}
          />
        ) : (
          <svg
            width={s}
            height={s * 1.25}
            viewBox="0 0 40 50"
            style={{ position: "absolute", left: -s * 0.12, top: -s * 0.05, overflow: "visible" }}
          >
            <path
              d="M4 2 L4 40 L14 31 L21 47 L28 44 L21 28 L35 28 Z"
              fill={color}
              stroke="rgba(0,0,0,.55)"
              strokeWidth={2.2}
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
};
