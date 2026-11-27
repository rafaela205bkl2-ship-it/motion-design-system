/**
 * Tilt3D — plano (cartão, celular, tela) que entra girado em perspectiva e pousa,
 * com balanço lento opcional enquanto parado.
 *
 * Origem: ref-aline-01 (0,0–1,5 s: celular entra inclinado e endireita; 12–14 s:
 * tela gira em Y com perspectiva forte) e ref-aline-03 (6,0–9,5 s: celular inclinado
 * em X/Y que se endireita enquanto o cursor clica). A sobra fica no limite do guia (≤ 7%).
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { overshootProgress, type EasingInput } from "../easing";
import { progressAt, useMotion, type TimeValue } from "../MotionProvider";

export type TiltState = {
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
  /** Deslocamento em px de design. */
  x?: number;
  y?: number;
  opacity?: number;
};

export type Tilt3DProps = {
  readonly children: React.ReactNode;
  /** Estado inicial (graus / px de design). */
  readonly from?: TiltState;
  /** Estado de repouso. */
  readonly to?: TiltState;
  /** Início, em segundos. */
  readonly delay?: number;
  readonly duration?: TimeValue;
  /** Sobra da chegada (0–0,07). Omitido = a do tema. */
  readonly overshoot?: number;
  /** Balanço parado: amplitude em graus (0 = sem balanço). */
  readonly sway?: number;
  /** Período do balanço, em segundos. */
  readonly swayPeriod?: number;
  /** Perspectiva em px de design (menor = mais dramático). */
  readonly perspective?: number;
  /** Saída: início em segundos e estado final. */
  readonly exitAt?: number;
  readonly exitTo?: TiltState;
  readonly exitDuration?: TimeValue;
  readonly exitEasing?: EasingInput;
  readonly speed?: number;
  readonly style?: React.CSSProperties;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const get = (s: TiltState, k: keyof TiltState, def: number) => s[k] ?? def;

export const Tilt3D: React.FC<Tilt3DProps> = ({
  children,
  from = { rotateX: 28, rotateY: -32, scale: 0.82, opacity: 0 },
  to = {},
  delay = 0,
  duration = "enter",
  overshoot,
  sway = 0,
  swayPeriod = 4,
  perspective = 1600,
  exitAt,
  exitTo = { scale: 0.9, opacity: 0, rotateY: 20 },
  exitDuration = "swap",
  exitEasing = "exit",
  speed = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const dur = m.dur(duration, speed);
  const start = Math.round(delay * m.fps);
  const p = overshootProgress({
    frame: frame - start,
    fps: m.fps,
    durationInFrames: Math.max(1, Math.round(dur * m.fps)),
    amount: overshoot ?? m.theme.motion.overshoot,
  });
  const fade = progressAt(frame, m.fps, delay, dur * 0.45, "enter");
  const e =
    exitAt === undefined
      ? 0
      : progressAt(frame, m.fps, exitAt, m.dur(exitDuration, speed), exitEasing);
  const t = frame / m.fps;
  const sw = sway ? Math.sin((t / swayPeriod) * Math.PI * 2) * sway : 0;
  const sw2 = sway ? Math.cos((t / swayPeriod) * Math.PI * 2 * 0.7) * sway * 0.6 : 0;

  const val = (k: keyof TiltState, def: number) => {
    const a = lerp(get(from, k, def), get(to, k, def), k === "opacity" ? fade : p);
    return lerp(a, get(exitTo, k, get(to, k, def)), e);
  };

  return (
    <div style={{ perspective: m.px(perspective), ...style }}>
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: `translate(${m.px(val("x", 0))}px, ${m.px(val("y", 0))}px) rotateX(${val("rotateX", 0) + sw2}deg) rotateY(${val("rotateY", 0) + sw}deg) rotateZ(${val("rotateZ", 0)}deg) scale(${val("scale", 1)})`,
          opacity: val("opacity", 1),
        }}
      >
        {children}
      </div>
    </div>
  );
};
