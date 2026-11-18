/**
 * Formas geométricas 3D flutuando no palco: cubos, discos (moedas), anéis, pílulas e placas,
 * com volume real em CSS 3D, sombra suave, entrada escalonada com sobra e flutuação contínua.
 *
 * Por quê: os objetos 3D que flutuam e cercam o texto e as interfaces na ref-001
 * (moedas e ícones, 8–22 s; ícones orbitando "No automático", 16–17 s). Use dentro de `Stage3D`.
 * Com z positivo a forma passa na frente do conteúdo; com z negativo, atrás.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { backOut } from "../easing";
import { progressAt, useMotion } from "../MotionProvider";
import { mixHex } from "../themes";

export type ShapeKind = "cube" | "disc" | "ring" | "pill" | "tile";

export type FloatingShape = {
  readonly kind: ShapeKind;
  /** Posição relativa ao centro, em px de design. */
  readonly x: number;
  readonly y: number;
  readonly z?: number;
  /** Tamanho em px de design. */
  readonly size?: number;
  readonly color?: string;
  /** Instante de entrada (s). */
  readonly delay?: number;
  /** Rotação inicial (graus). */
  readonly rx?: number;
  readonly ry?: number;
  readonly rz?: number;
  /** Velocidade de giro (graus/s) em Y. */
  readonly spin?: number;
};

export type FloatingShapesProps = {
  readonly shapes: FloatingShape[];
  /** Multiplica a velocidade de tudo. */
  readonly speed?: number;
  /** Amplitude da flutuação (px de design). */
  readonly float?: number;
  /** De onde entram: "scale" (crescem no lugar) ou "below"/"above"/"left"/"right" (vêm de fora). */
  readonly enter?: "scale" | "below" | "above" | "left" | "right";
  /** Duração da entrada (s). */
  readonly duration?: number;
  /** Instante de saída (s): as formas encolhem e somem. */
  readonly exitAt?: number;
  readonly overshoot?: number;
  readonly shadow?: boolean;
};

const Face: React.FC<{ readonly t: string; readonly w: number; readonly h: number; readonly c: string; readonly r?: number }> = ({ t, w, h, c, r = 0 }) => (
  <div style={{ position: "absolute", left: -w / 2, top: -h / 2, width: w, height: h, background: c, borderRadius: r, transform: t, backfaceVisibility: "hidden" }} />
);

const Shape: React.FC<{ readonly s: FloatingShape; readonly px: (n: number) => number }> = ({ s, px }) => {
  const size = px(s.size ?? 120);
  const c = s.color ?? "#FF5C8A";
  const light = mixHex(c, "#FFFFFF", 0.35);
  const dark = mixHex(c, "#000000", 0.35);
  const darker = mixHex(c, "#000000", 0.55);
  const h = size / 2;
  switch (s.kind) {
    case "cube": {
      const r = size * 0.18;
      return (
        <>
          <Face t={`translateZ(${h}px)`} w={size} h={size} c={c} r={r} />
          <Face t={`rotateY(180deg) translateZ(${h}px)`} w={size} h={size} c={dark} r={r} />
          <Face t={`rotateY(90deg) translateZ(${h}px)`} w={size} h={size} c={dark} r={r} />
          <Face t={`rotateY(-90deg) translateZ(${h}px)`} w={size} h={size} c={light} r={r} />
          <Face t={`rotateX(90deg) translateZ(${h}px)`} w={size} h={size} c={light} r={r} />
          <Face t={`rotateX(-90deg) translateZ(${h}px)`} w={size} h={size} c={darker} r={r} />
        </>
      );
    }
    case "disc":
    case "ring": {
      const layers = 8;
      const depth = size * 0.16;
      return (
        <>
          {Array.from({ length: layers }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: -h,
                top: -h,
                width: size,
                height: size,
                borderRadius: "50%",
                transform: `translateZ(${-depth / 2 + (i / (layers - 1)) * depth}px)`,
                background: s.kind === "disc" ? (i === layers - 1 ? `radial-gradient(circle at 35% 30%, ${light}, ${c} 60%)` : i === 0 ? dark : darker) : "transparent",
                border: s.kind === "ring" ? `${size * 0.16}px solid ${i === layers - 1 ? c : darker}` : undefined,
                boxSizing: "border-box",
              }}
            />
          ))}
        </>
      );
    }
    case "pill": {
      const layers = 7;
      const w = size * 1.7;
      const depth = size * 0.5;
      return (
        <>
          {Array.from({ length: layers }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: -w / 2,
                top: -h * 0.6,
                width: w,
                height: size * 0.6,
                borderRadius: size,
                transform: `translateZ(${-depth / 2 + (i / (layers - 1)) * depth}px)`,
                background: i === layers - 1 ? `linear-gradient(180deg, ${light}, ${c})` : darker,
              }}
            />
          ))}
        </>
      );
    }
    case "tile":
    default: {
      const layers = 5;
      const depth = size * 0.14;
      return (
        <>
          {Array.from({ length: layers }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: -h,
                top: -h,
                width: size,
                height: size,
                borderRadius: size * 0.24,
                transform: `translateZ(${-depth / 2 + (i / (layers - 1)) * depth}px)`,
                background: i === layers - 1 ? `linear-gradient(145deg, ${light}, ${c})` : darker,
              }}
            />
          ))}
        </>
      );
    }
  }
};

export const FloatingShapes: React.FC<FloatingShapesProps> = ({
  shapes,
  speed = 1,
  float = 18,
  enter = "scale",
  duration = 0.7,
  exitAt,
  overshoot,
  shadow = true,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const t = frame / m.fps;
  const ov = overshoot ?? m.theme.motion.overshoot;
  return (
    <>
      {shapes.map((s, i) => {
        const d = (s.delay ?? i * 0.08) / speed;
        const lin = progressAt(frame, m.fps, d, m.dur(duration, speed), "linear");
        const k = backOut(lin, ov);
        const out = exitAt !== undefined ? progressAt(frame, m.fps, exitAt / speed, m.dur(0.35, speed), "exit") : 0;
        if (k <= 0.001 || out >= 0.999) return null;
        const off = m.px(900) * (1 - Math.min(1, k));
        const ex = enter === "left" ? -off : enter === "right" ? off : 0;
        const ey = enter === "below" ? off : enter === "above" ? -off : 0;
        const sc = enter === "scale" ? Math.max(0, k) : 1;
        const fy = Math.sin(t * 1.3 * speed + i * 1.9) * m.px(float);
        const fx = Math.cos(t * 0.9 * speed + i * 1.3) * m.px(float * 0.5);
        const spin = (s.spin ?? 20) * t * speed;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transformStyle: "preserve-3d",
              transform: `translate3d(${m.px(s.x) + ex + fx}px, ${m.px(s.y) + ey + fy}px, ${m.px(s.z ?? 0)}px) scale(${sc * (1 - out)})`,
            }}
          >
            {shadow ? (
              <div
                style={{
                  position: "absolute",
                  left: -m.px(s.size ?? 120) * 0.6,
                  top: m.px(s.size ?? 120) * 0.7,
                  width: m.px(s.size ?? 120) * 1.2,
                  height: m.px(s.size ?? 120) * 0.3,
                  borderRadius: "50%",
                  background: "radial-gradient(ellipse, rgba(10,6,20,0.35), transparent 70%)",
                  transform: "translateZ(-40px)",
                }}
              />
            ) : null}
            <div
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateX(${(s.rx ?? -18) + Math.sin(t + i) * 6}deg) rotateY(${(s.ry ?? 25) + spin}deg) rotateZ(${s.rz ?? 0}deg)`,
              }}
            >
              <Shape s={s} px={m.px} />
            </div>
          </div>
        );
      })}
    </>
  );
};
