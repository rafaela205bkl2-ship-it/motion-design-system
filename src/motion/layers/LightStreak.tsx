/**
 * Risco de luz desenhado: um feixe de vários fios paralelos que percorre um caminho,
 * com a cabeça brilhante na frente e a cauda se apagando atrás (light painting).
 *
 * Por quê: na ref-003 riscos laranja cruzam a composição em zigue-zague e em arcos
 * (0,40–1,30 s; 4,5; 9,0; 11,5; 13,5; 19,0; 31,0 s), cada um por ~0,5–0,8 s,
 * passando sobre e entre as figuras. É o elemento gráfico que "costura" a peça.
 *
 * O caminho é uma lista de pontos em fração da tela (0–1), suavizada por Catmull-Rom.
 * Coloque o componente entre camadas para o risco passar atrás de um elemento e na
 * frente de outro (ou use `split` com duas instâncias e `range`).
 */
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { EasingInput } from "../easing";
import { progressAt, useMotion } from "../MotionProvider";

export type LightStreakProps = {
  /** Pontos do caminho em fração da tela: [x, y], 0–1 (podem sair da tela). */
  readonly points: readonly (readonly [number, number])[];
  readonly delay?: number;
  /** Tempo para a cabeça ir do início ao fim (s). ref-003: 0,5–0,8 s. */
  readonly duration?: number;
  readonly easing?: EasingInput;
  readonly speed?: number;
  /** Comprimento da cauda em fração do caminho. */
  readonly trail?: number;
  /** Número de fios paralelos. */
  readonly strands?: number;
  /** Distância entre fios (px de design). */
  readonly gap?: number;
  /** Espessura de cada fio (px de design). */
  readonly width?: number;
  readonly color?: string;
  /** Cor do núcleo (mais clara). */
  readonly core?: string;
  /** Brilho ao redor (px de design de desfoque). */
  readonly glow?: number;
  readonly opacity?: number;
};

type P = readonly [number, number];

/** Catmull-Rom → Bézier cúbica (caminho suave passando pelos pontos). */
const smoothPath = (pts: readonly P[], off: number): string => {
  if (pts.length < 2) return "";
  // Desloca cada ponto pela normal local (fios paralelos).
  const n = pts.map((p, i) => {
    const a = pts[Math.max(i - 1, 0)];
    const b = pts[Math.min(i + 1, pts.length - 1)];
    const tx = b[0] - a[0];
    const ty = b[1] - a[1];
    const l = Math.hypot(tx, ty) || 1;
    return [p[0] - (ty / l) * off, p[1] + (tx / l) * off] as const;
  });
  let d = `M ${n[0][0]} ${n[0][1]}`;
  for (let i = 0; i < n.length - 1; i++) {
    const p0 = n[Math.max(i - 1, 0)];
    const p1 = n[i];
    const p2 = n[i + 1];
    const p3 = n[Math.min(i + 2, n.length - 1)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
  }
  return d;
};

export const LightStreak: React.FC<LightStreakProps> = ({
  points,
  delay = 0,
  duration = 0.7,
  easing = "camera",
  speed = 1,
  trail = 0.45,
  strands = 4,
  gap = 7,
  width = 2.4,
  color = "#FF8A3D",
  core = "#FFE9C7",
  glow = 10,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const { width: W, height: H } = useVideoConfig();
  const d = m.dur(duration, speed);
  // A cabeça percorre 0 → 1 + trail, para a cauda também sair.
  const p = progressAt(frame, m.fps, delay / speed, d * (1 + trail), easing) * (1 + trail);
  const gapPx = m.px(gap);
  const abs = useMemo(() => points.map(([x, y]) => [x * W, y * H] as const), [points, W, H]);
  const paths = useMemo(
    () =>
      Array.from({ length: strands }, (_, i) => {
        const off = (i - (strands - 1) / 2) * gapPx;
        return smoothPath(abs, off);
      }),
    [abs, strands, gapPx],
  );
  if (p <= 0 || p >= 1 + trail) return null;
  const head = Math.min(p, 1);
  const tail = Math.max(p - trail, 0);
  const vis = head - tail;
  // pathLength=1 normaliza o traço: dasharray em fração do caminho.
  const dash = `${vis} ${2}`;
  const offset = -tail;
  const fade = Math.min(1, (1 + trail - p) / (trail * 0.6));

  const strokes = (sw: number, stroke: string, op: number, key: string) =>
    paths.map((dd, i) => (
      <path
        key={`${key}-${i}`}
        d={dd}
        pathLength={1}
        fill="none"
        stroke={stroke}
        strokeWidth={sw * (1 - Math.abs(i - (strands - 1) / 2) / (strands * 1.2))}
        strokeLinecap="round"
        strokeDasharray={dash}
        strokeDashoffset={offset}
        opacity={op}
      />
    ));

  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity: opacity * fade }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g style={{ filter: `blur(${m.px(glow)}px)` }}>{strokes(m.px(width * 3.2), color, 0.9, "g")}</g>
        <g>{strokes(m.px(width), color, 1, "c")}</g>
        <g>{strokes(m.px(width * 0.45), core, 0.95, "n")}</g>
      </svg>
    </AbsoluteFill>
  );
};
