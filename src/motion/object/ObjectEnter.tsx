import React from "react";
import { useCurrentFrame } from "remotion";
import { overshootProgress, resolveEasing, type EasingInput } from "../easing";
import { progressAt, useMotion, type TimeValue } from "../MotionProvider";

export type EnterFrom = "top" | "bottom" | "left" | "right" | "none";

export type ObjectMotion =
  /** Velocidade quase constante e pouso desacelerado (queda). */
  | "fall"
  /** Cresce a partir do centro com sobra controlada. */
  | "pop"
  /** Desliza com desaceleração forte. */
  | "glide"
  /** Sobe suave, sem sobra. */
  | "rise";

export type ObjectEnterProps = {
  readonly children: React.ReactNode;
  readonly motion?: ObjectMotion;
  /** Direção de onde o objeto vem. 'none' = só escala/opacidade. */
  readonly from?: EnterFrom;
  /** Distância percorrida em px de design. */
  readonly distance?: number;
  /** Início, em segundos. */
  readonly delay?: number;
  readonly duration?: TimeValue;
  readonly easing?: EasingInput;
  /** Sobra (0–0.15) das entradas com mola ('pop'). Padrão: a do tema. */
  readonly overshoot?: number;
  /** Achatamento no pouso da queda (0 = nenhum; 0.08 = 8%). */
  readonly impact?: number;
  /** Escala inicial. */
  readonly scaleFrom?: number;
  /** Rotação inicial, em graus. */
  readonly rotateFrom?: number;
  /** Rotação final, em graus. */
  readonly rotate?: number;
  /** Simulação de desfoque de movimento (0 = desligado, 1 = padrão). */
  readonly stretch?: number;
  /** Desfoque inicial em px de design. */
  readonly blurFrom?: number;
  readonly intensity?: number;
  readonly speed?: number;
  /** Flutuação em repouso, em px de design (0 = parado). */
  readonly float?: number;
  /** Período da flutuação, em segundos. */
  readonly floatPeriod?: number;
  /** Saída opcional. */
  readonly exitAt?: number;
  readonly exitTo?: EnterFrom;
  readonly exitDuration?: TimeValue;
  readonly style?: React.CSSProperties;
};

const VEC: Record<EnterFrom, [number, number]> = {
  top: [0, -1],
  bottom: [0, 1],
  left: [-1, 0],
  right: [1, 0],
  none: [0, 0],
};

/**
 * Entrada de objeto com peso: queda, pop, deslize ou subida.
 * O "esticamento" é proporcional à velocidade instantânea, simulando
 * desfoque de movimento na direção do deslocamento.
 */
export const ObjectEnter: React.FC<ObjectEnterProps> = ({
  children,
  motion = "fall",
  from = motion === "pop" ? "none" : "top",
  distance,
  delay = 0,
  duration = "enter",
  easing,
  overshoot,
  impact = 0.07,
  scaleFrom,
  rotateFrom = 0,
  rotate = 0,
  stretch = 1,
  blurFrom,
  intensity = 1,
  speed = 1,
  float = 0,
  floatPeriod = 3.2,
  exitAt,
  exitTo = "top",
  exitDuration = "swap",
  style,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const fps = m.fps;
  const dur = m.dur(duration, speed);
  const durFrames = dur * fps;
  const local = frame - delay * fps;
  const amount = overshoot ?? (motion === "pop" ? m.theme.motion.overshoot : 0);

  const progress = (f: number) => {
    if (f <= 0) return 0;
    if (motion === "pop" || (motion !== "fall" && amount > 0.001 && !easing)) {
      return overshootProgress({
        frame: f,
        fps,
        durationInFrames: durFrames,
        amount,
      });
    }
    const ease = resolveEasing(
      easing ??
        (motion === "fall"
          ? "land"
          : motion === "glide"
            ? "enterStrong"
            : "enter"),
    );
    return ease(Math.min(1, f / durFrames));
  };

  const p = progress(local);
  const pPrev = progress(local - 1);
  const [vx, vy] = VEC[from];
  const d = m.dist(distance ?? (motion === "pop" ? 0 : 420), intensity);

  const x = vx * d * (1 - p);
  const y = vy * d * (1 - p);
  const sFrom =
    scaleFrom ?? (motion === "pop" ? 0.55 : motion === "rise" ? 0.96 : 1);
  const scale = sFrom + (1 - sFrom) * p;
  const opacity = Math.min(
    1,
    Math.max(0, p * (motion === "fall" || motion === "glide" ? 4 : 2.2)),
  );

  // velocidade em px reais por quadro → esticamento e desfoque
  const v = Math.abs(p - pPrev) * d;
  const stretchK = Math.min(0.32, (v / m.px(220)) * 0.32) * stretch;
  const motionBlur = Math.min(m.px(16), v * 0.06) * stretch;
  const bFrom = m.blur(blurFrom ?? (motion === "pop" ? 10 : 0), intensity);
  const blurPx = motionBlur + bFrom * Math.max(0, 1 - Math.min(1, p));
  // pouso da queda: achatamento amortecido no eixo do movimento
  const sinceLand = (local - durFrames) / fps;
  const squash =
    motion === "fall" && sinceLand >= 0 && impact > 0
      ? impact * Math.exp(-sinceLand * 9) * Math.cos(sinceLand * 34)
      : 0;
  const along = stretchK - squash;
  const across = -stretchK * 0.35 + squash * 0.6;
  const sx = vx !== 0 ? 1 + along : 1 + across;
  const sy = vy !== 0 ? 1 + along : 1 + across;
  const stretchActive =
    from !== "none" && (stretchK > 0.001 || Math.abs(squash) > 0.001);

  // flutuação depois de assentar
  const settled = progressAt(frame, fps, delay + dur, 0.6, "camera");
  const t = frame / fps;
  const floatY = float
    ? Math.sin((t / floatPeriod) * Math.PI * 2) * m.px(float) * settled
    : 0;
  const floatR = float
    ? Math.sin((t / floatPeriod) * Math.PI * 2 + 1.2) * 1.2 * settled
    : 0;

  // saída
  const e =
    exitAt === undefined
      ? 0
      : progressAt(frame, fps, exitAt, m.dur(exitDuration, speed), "exit");
  const [ex, ey] = VEC[exitTo];
  const exitD = m.dist(260, intensity) * e;

  const rot = rotateFrom + (rotate - rotateFrom) * p + floatR;

  const totalBlur = blurPx + e * m.px(14);

  // Externo: posição e esticamento no eixo da TELA. Interno: rotação e escala do objeto.
  return (
    <div
      style={{
        translate: `${x + ex * exitD}px ${y + floatY + ey * exitD}px`,
        scale: stretchActive ? `${sx} ${sy}` : undefined,
        transformOrigin:
          from === "top"
            ? "50% 85%"
            : from === "bottom"
              ? "50% 15%"
              : "50% 50%",
        opacity: opacity * (1 - e),
        filter: totalBlur > 0.05 ? `blur(${totalBlur}px)` : undefined,
        willChange: "translate, scale, filter",
        ...style,
      }}
    >
      <div
        style={{ rotate: `${rot}deg`, scale: String(scale * (1 - 0.15 * e)) }}
      >
        {children}
      </div>
    </div>
  );
};
