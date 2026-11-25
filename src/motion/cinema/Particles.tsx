/**
 * Partículas determinísticas: poeira suspensa num feixe de luz, brasas subindo,
 * pó dourado. Cada partícula tem velocidade, oscilação e cintilação próprias.
 *
 * Origem: direção de arte do filme UMADSAL 2027 (atmosfera de luz direcionada).
 */
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { progressAt, useMotion } from "../MotionProvider";

export type ParticlesProps = {
  readonly count?: number;
  readonly color?: string;
  /** Diâmetro mínimo e máximo, em px de design. */
  readonly size?: readonly [number, number];
  /** Velocidade média, em px de design por segundo. */
  readonly speed?: number;
  /** Direção do movimento, em graus (0 = direita, -90 = para cima). */
  readonly angle?: number;
  /** Oscilação lateral, em px de design. */
  readonly wobble?: number;
  /** Opacidade mínima e máxima. */
  readonly opacity?: readonly [number, number];
  /** Cintilação (0–1). */
  readonly twinkle?: number;
  /** Área ocupada, em fração da tela [x0, y0, x1, y1]. */
  readonly area?: readonly [number, number, number, number];
  /** Halo em volta de cada partícula. */
  readonly glow?: boolean;
  readonly delay?: number;
  readonly fadeIn?: number;
  readonly seed?: string;
  readonly blend?: React.CSSProperties["mixBlendMode"];
};

export const Particles: React.FC<ParticlesProps> = ({
  count = 60,
  color = "#FFE6B8",
  size = [2, 6],
  speed = 18,
  angle = -90,
  wobble = 14,
  opacity = [0.15, 0.8],
  twinkle = 0.5,
  area = [0, 0, 1, 1],
  glow = true,
  delay = 0,
  fadeIn = 1.2,
  seed = "p",
  blend = "screen",
}) => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const m = useMotion();
  const t = frame / m.fps;
  const fade = progressAt(frame, m.fps, delay, fadeIn, "enterSoft");
  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: random(`${seed}-x-${i}`),
        y: random(`${seed}-y-${i}`),
        s: size[0] + random(`${seed}-s-${i}`) * (size[1] - size[0]),
        v: 0.4 + random(`${seed}-v-${i}`) * 1.2,
        ph: random(`${seed}-ph-${i}`) * Math.PI * 2,
        o: opacity[0] + random(`${seed}-o-${i}`) * (opacity[1] - opacity[0]),
        tw: 0.6 + random(`${seed}-tw-${i}`) * 2.2,
      })),
    [count, seed, size, opacity],
  );
  const [ax0, ay0, ax1, ay1] = area;
  const aw = (ax1 - ax0) * W;
  const ah = (ay1 - ay0) * H;
  const rad = (angle * Math.PI) / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);

  return (
    <AbsoluteFill
      style={{ mixBlendMode: blend, opacity: fade, pointerEvents: "none" }}
    >
      {parts.map((p, i) => {
        const d = m.px(speed) * p.v * t;
        const wob = Math.sin(t * 0.8 * p.tw + p.ph) * m.px(wobble);
        const px0 = p.x * aw + dx * d - dy * wob;
        const py0 = p.y * ah + dy * d + dx * wob;
        const x = ax0 * W + (((px0 % aw) + aw) % aw);
        const y = ay0 * H + (((py0 % ah) + ah) % ah);
        const s = m.px(p.s);
        const tw = 1 - twinkle * 0.5 * (1 + Math.sin(t * p.tw * 2.4 + p.ph));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - s / 2,
              top: y - s / 2,
              width: s,
              height: s,
              borderRadius: "50%",
              background: glow
                ? `radial-gradient(circle, ${color} 0%, ${color} 30%, transparent 70%)`
                : color,
              opacity: p.o * tw,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
