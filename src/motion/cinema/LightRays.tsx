/**
 * Raios de luz (god rays) partindo de um ponto: feixes irregulares, girando devagar,
 * com queda por distância. Luz direcionada para composições dramáticas.
 *
 * Origem: direção de arte do filme UMADSAL 2027 (luz barroca/renascentista: chiaroscuro);
 * os raios gravados da estampa 2027 (sol atrás das mãos) dão a referência de desenho.
 */
import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import type { EasingInput } from "../easing";
import { progressAt, useMotion } from "../MotionProvider";

export type LightRaysProps = {
  /** Origem em fração da tela (pode ficar fora: -0.2, 1.2…). */
  readonly origin?: readonly [number, number];
  readonly color?: string;
  /** Opacidade máxima (0–1). */
  readonly intensity?: number;
  /** Número de feixes. */
  readonly rays?: number;
  /** Abertura total do leque, em graus (360 = em volta). */
  readonly spread?: number;
  /** Direção central do leque, em graus (0 = para cima, 90 = direita, 180 = para baixo). */
  readonly direction?: number;
  /** Alcance, em fração da diagonal da tela. */
  readonly reach?: number;
  /** Giro em graus por segundo. */
  readonly spin?: number;
  /** Suavidade (desfoque) em px de design. */
  readonly softness?: number;
  readonly delay?: number;
  /** Duração do fade de entrada (s). */
  readonly fadeIn?: number;
  readonly easing?: EasingInput;
  readonly seed?: string;
  readonly blend?: React.CSSProperties["mixBlendMode"];
};

export const LightRays: React.FC<LightRaysProps> = ({
  origin = [0.5, -0.1],
  color = "#FFE3A6",
  intensity = 0.5,
  rays = 16,
  spread = 70,
  direction = 180,
  reach = 1.1,
  spin = 1.2,
  softness = 10,
  delay = 0,
  fadeIn = 1.5,
  easing = "enterSoft",
  seed = "rays",
  blend = "screen",
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const t = frame / m.fps;
  const p = progressAt(frame, m.fps, delay, fadeIn, easing);
  const stops = useMemo(() => {
    const out: string[] = [];
    const step = 360 / Math.max(rays * (360 / Math.max(spread, 1)), 1);
    let a = 0;
    let i = 0;
    while (a < 360) {
      const w = step * (0.25 + random(`${seed}-w-${i}`) * 0.5);
      const alpha = 0.35 + random(`${seed}-a-${i}`) * 0.65;
      // a opacidade de cada feixe vai na própria cor (color-mix)
      const c = `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`;
      out.push(
        `transparent ${a}deg`,
        `${c} ${a + w * 0.5}deg`,
        `transparent ${a + w}deg`,
      );
      a += step;
      i++;
    }
    return out.join(", ");
  }, [rays, spread, color, seed]);

  const rot = direction - spread / 2 + t * spin;
  const ox = origin[0] * 100;
  const oy = origin[1] * 100;
  // leque: só os ângulos dentro de `spread`
  const wedge = `conic-gradient(from ${direction - spread / 2}deg at ${ox}% ${oy}%, black 0deg, black ${spread}deg, transparent ${spread}deg)`;
  const fall = `radial-gradient(circle at ${ox}% ${oy}%, black 0%, rgba(0,0,0,0.5) ${reach * 45}%, transparent ${reach * 100}%)`;
  const shimmer = 0.85 + 0.15 * Math.sin(t * 1.7);

  return (
    <AbsoluteFill
      style={{
        mixBlendMode: blend,
        opacity: intensity * p * shimmer,
        pointerEvents: "none",
      }}
    >
      <AbsoluteFill style={{ maskImage: fall, WebkitMaskImage: fall }}>
        <AbsoluteFill
          style={{
            maskImage: spread >= 360 ? undefined : wedge,
            WebkitMaskImage: spread >= 360 ? undefined : wedge,
          }}
        >
          <AbsoluteFill
            style={{
              background: `conic-gradient(from ${rot}deg at ${ox}% ${oy}%, ${stops})`,
              filter: `blur(${m.px(softness)}px)`,
            }}
          />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
