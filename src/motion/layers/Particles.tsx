/**
 * Partículas determinísticas que viajam de uma forma para outra.
 *
 * Por quê: transformar um elemento em outro (padrão "elemento vira transição", ref-001 e ref-002)
 * sem corte. A semente fixa garante o mesmo resultado em todo render.
 *
 * Formas são listas de pontos normalizados (0–1 na tela). Use `particleShapes` para gerar
 * as comuns ou passe seus próprios pontos. O progresso é calculado por `start`/`duration`
 * ou passado direto em `progress`.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { EasingInput } from "../easing";
import { progressAt, useMotion, type TimeValue } from "../MotionProvider";

export type Point = readonly [number, number];

/** Gerador pseudoaleatório determinístico (mulberry32). */
export const seeded = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const particleShapes = {
  /** Espalhadas pela tela inteira. */
  scatter: (n: number, seed = 1, margin = 0): Point[] => {
    const r = seeded(seed);
    return Array.from({ length: n }, () => [
      margin + r() * (1 - 2 * margin),
      margin + r() * (1 - 2 * margin),
    ]);
  },
  /** Disco cheio centrado em (cx, cy) com raio em fração da LARGURA. */
  disc: (n: number, cx = 0.5, cy = 0.5, radius = 0.2, aspect = 9 / 16, seed = 2): Point[] => {
    const r = seeded(seed);
    return Array.from({ length: n }, () => {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r()) * radius;
      return [cx + Math.cos(a) * d, cy + Math.sin(a) * d * aspect];
    });
  },
  /** Anel. */
  ring: (n: number, cx = 0.5, cy = 0.5, radius = 0.3, aspect = 9 / 16, seed = 3): Point[] => {
    const r = seeded(seed);
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      const j = (r() - 0.5) * 0.02;
      return [cx + Math.cos(a) * (radius + j), cy + Math.sin(a) * (radius + j) * aspect];
    });
  },
  /** Linha horizontal (horizonte) com leve espessura. */
  line: (n: number, y = 0.6, x0 = 0, x1 = 1, thickness = 0.004, seed = 4): Point[] => {
    const r = seeded(seed);
    return Array.from({ length: n }, () => [x0 + r() * (x1 - x0), y + (r() - 0.5) * thickness]);
  },
};

export type ParticlesProps = {
  /** Forma inicial. */
  readonly from: Point[];
  /** Forma final (mesmo tamanho; se menor, repete). */
  readonly to?: Point[];
  /** Progresso 0–1; se ausente, usa start/duration. */
  readonly progress?: number;
  readonly start?: number;
  readonly duration?: TimeValue;
  readonly easing?: EasingInput;
  readonly speed?: number;
  /** Atraso aleatório por partícula, em fração da duração (0–1). */
  readonly spread?: number;
  /** Curvatura do trajeto (px de design). */
  readonly swirl?: number;
  /** Tamanho em px de design: [mínimo, máximo]. */
  readonly size?: readonly [number, number];
  readonly colors?: string[];
  /** Cintilação (0–1). */
  readonly twinkle?: number;
  /** Deriva contínua (px de design). */
  readonly drift?: number;
  readonly opacity?: number;
  readonly seed?: number;
  readonly blend?: React.CSSProperties["mixBlendMode"];
};

export const Particles: React.FC<ParticlesProps> = ({
  from,
  to,
  progress,
  start = 0,
  duration = 1.5,
  easing = "camera",
  speed = 1,
  spread = 0.35,
  swirl = 120,
  size = [3, 9],
  colors,
  twinkle = 0.4,
  drift = 10,
  opacity = 1,
  seed = 7,
  blend = "screen",
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const t = frame / m.fps;
  const target = to ?? from;
  const r = seeded(seed);
  const cols = colors ?? [m.palette.accent, m.palette.highlight, m.palette.glow];
  const d = m.dur(duration, speed);
  const s0 = start / speed;

  return (
    <AbsoluteFill style={{ mixBlendMode: blend, pointerEvents: "none", opacity }}>
      {from.map((p, i) => {
        const q = target[i % target.length];
        const delay = r() * spread;
        const sz = m.px(size[0] + r() * (size[1] - size[0]));
        const color = cols[Math.floor(r() * cols.length)];
        const phase = r() * Math.PI * 2;
        const side = r() < 0.5 ? -1 : 1;
        const k =
          progress !== undefined
            ? Math.min(1, Math.max(0, (progress - delay) / Math.max(0.001, 1 - spread)))
            : progressAt(frame, m.fps, s0 + delay * d, d * (1 - spread), easing);
        const arc = Math.sin(k * Math.PI) * m.px(swirl) * side;
        const x = (p[0] + (q[0] - p[0]) * k) * 100;
        const y = (p[1] + (q[1] - p[1]) * k) * 100;
        const dx = Math.sin(t * 0.9 + phase) * m.px(drift) + arc;
        const dy = Math.cos(t * 0.7 + phase) * m.px(drift);
        const tw = 1 - twinkle * (0.5 + 0.5 * Math.sin(t * 6 + phase));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: sz,
              height: sz,
              marginLeft: -sz / 2,
              marginTop: -sz / 2,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${color} 0%, ${color} 35%, transparent 70%)`,
              transform: `translate(${dx}px, ${dy}px)`,
              opacity: tw,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
