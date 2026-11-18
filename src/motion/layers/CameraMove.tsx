/**
 * Movimento de câmera sobre uma placa (imagem, vídeo ou cenário): avanço, recuo,
 * deriva e rotação entre dois estados, com curva de câmera.
 *
 * Por quê: dar vida a planos parados e fazer texto e placa se moverem juntos
 * (texto "preso" à cena) ou em velocidades diferentes (parallax).
 * Coloque o texto dentro do mesmo `CameraMove` para acompanhar a câmera, ou em outro
 * `CameraMove` com valores menores para parallax.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { EasingInput } from "../easing";
import { progressAt, useMotion, type TimeValue } from "../MotionProvider";

export type CameraState = {
  /** Deslocamento em px de design. */
  readonly x?: number;
  readonly y?: number;
  readonly scale?: number;
  /** Graus. */
  readonly rotate?: number;
};

export type CameraMoveProps = {
  readonly children: React.ReactNode;
  readonly from?: CameraState;
  readonly to?: CameraState;
  readonly delay?: number;
  readonly duration?: TimeValue;
  readonly easing?: EasingInput;
  readonly speed?: number;
  /** Multiplica o deslocamento e a variação de escala. */
  readonly intensity?: number;
  /** Ponto de origem do zoom, em fração (0–1). */
  readonly originX?: number;
  readonly originY?: number;
  readonly style?: React.CSSProperties;
};

export const CameraMove: React.FC<CameraMoveProps> = ({
  children,
  from = {},
  to = { scale: 1.08 },
  delay = 0,
  duration = 3,
  easing = "camera",
  speed = 1,
  intensity = 1,
  originX = 0.5,
  originY = 0.5,
  style,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const p = progressAt(frame, m.fps, delay / speed, m.dur(duration, speed), easing);
  const lerp = (a = 0, b = 0) => a + (b - a) * p;
  const s0 = from.scale ?? 1;
  const s1 = to.scale ?? 1;
  const scale = 1 + (lerp(s0, s1) - 1) * intensity;
  const x = m.px(lerp(from.x, to.x) * intensity);
  const y = m.px(lerp(from.y, to.y) * intensity);
  const rot = lerp(from.rotate, to.rotate) * intensity;
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rot}deg)`,
        transformOrigin: `${originX * 100}% ${originY * 100}%`,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
