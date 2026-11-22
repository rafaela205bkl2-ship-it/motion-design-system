/**
 * Globo 3D em linhas (meridianos e paralelos) com projeção ortográfica,
 * girando no eixo vertical, com inclinação e marcadores opcionais.
 *
 * Por quê: dá profundidade "3D" real sem depender de WebGL. O cálculo é
 * puro (SVG) e determinístico por quadro, então renderiza igual em qualquer
 * máquina. As linhas da metade de trás ficam tênues e as da frente, cheias,
 * o que dá a leitura de volume.
 *
 * Origem: volume 3D em órbita observado em ref-004 (16–17 s); globo do painel
 * da Feira das Nações 2026,
 * reinterpretado como grafismo em linha). Tempo em segundos, tamanho em px de design.
 */
import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import type { EasingInput } from "../easing";
import { progressAt, useMotion, type TimeValue } from "../MotionProvider";

export type GlobeMarker = {
  /** Latitude em graus (−90 a 90). */
  readonly lat: number;
  /** Longitude em graus (−180 a 180). */
  readonly lon: number;
  readonly color?: string;
  /** Raio do marcador em px de design. */
  readonly size?: number;
  /** Momento em que o marcador surge (segundos). */
  readonly at?: number;
};

export type Globe3DProps = {
  /** Diâmetro em px de design. */
  readonly size?: number;
  /** Cor das linhas. Padrão: destaque do tema. */
  readonly color?: string;
  /** Espessura das linhas em px de design. */
  readonly strokeWidth?: number;
  /** Intervalo entre meridianos/paralelos, em graus. */
  readonly step?: number;
  /** Rotação em graus por segundo (já escalada pela velocidade do tema). */
  readonly spin?: number;
  /** Longitude virada para a câmera no início (graus). */
  readonly startLon?: number;
  /** Inclinação do eixo, em graus (positivo = mostra mais o norte). */
  readonly tilt?: number;
  /** Opacidade das linhas de trás (0–1). */
  readonly backOpacity?: number;
  readonly markers?: GlobeMarker[];
  /** Entrada: o globo cresce e se desenha a partir de `delay`. */
  readonly delay?: number;
  readonly duration?: TimeValue;
  readonly easing?: EasingInput;
  /** Brilho atrás do globo (cor) — omitido = sem brilho. */
  readonly glow?: string;
  readonly speed?: number;
  readonly style?: React.CSSProperties;
};

type Vec = [number, number, number];

const DEG = Math.PI / 180;

/** Ponto da esfera unitária → girado (rotY, depois inclinação em X). */
const project = (lat: number, lon: number, rot: number, tilt: number): Vec => {
  const la = lat * DEG;
  const lo = (lon + rot) * DEG;
  const x = Math.cos(la) * Math.sin(lo);
  const y = Math.sin(la);
  const z = Math.cos(la) * Math.cos(lo);
  const t = tilt * DEG;
  // inclinação em X: z para frente, y para cima
  return [
    x,
    y * Math.cos(t) - z * Math.sin(t),
    y * Math.sin(t) + z * Math.cos(t),
  ];
};

/** Divide uma polilinha em trechos da frente (z ≥ 0) e de trás. */
const splitPaths = (pts: Vec[], r: number, c: number) => {
  const front: string[] = [];
  const back: string[] = [];
  let cur: string[] = [];
  let curFront = pts[0][2] >= 0;
  const flush = () => {
    if (cur.length > 1) (curFront ? front : back).push(`M${cur.join("L")}`);
  };
  pts.forEach((p, i) => {
    const isFront = p[2] >= 0;
    const xy = `${(c + p[0] * r).toFixed(2)},${(c - p[1] * r).toFixed(2)}`;
    if (i > 0 && isFront !== curFront) {
      cur.push(xy);
      flush();
      cur = [xy];
      curFront = isFront;
    } else {
      cur.push(xy);
    }
  });
  flush();
  return { front, back };
};

export const Globe3D: React.FC<Globe3DProps> = ({
  size = 520,
  color,
  strokeWidth = 2,
  step = 20,
  spin = 18,
  startLon = 40,
  tilt = 18,
  backOpacity = 0.18,
  markers = [],
  delay = 0,
  duration = "enter",
  easing = "enterStrong",
  glow,
  speed = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const t = frame / m.fps;
  const ink = color ?? m.palette.accent;
  const D = m.px(size);
  const r = D / 2 - m.px(strokeWidth) * 2;
  const c = D / 2;
  const enter = progressAt(frame, m.fps, delay, m.dur(duration, speed), easing);
  const rot = startLon - spin * m.speed * speed * t;

  const lines = useMemo(() => {
    const out: Vec[][] = [];
    for (let lon = -180; lon < 180; lon += step) {
      const pts: Vec[] = [];
      for (let lat = -90; lat <= 90; lat += 5) pts.push([lat, lon, 0]);
      out.push(pts);
    }
    for (let lat = -90 + step; lat < 90; lat += step) {
      const pts: Vec[] = [];
      for (let lon = -180; lon <= 180; lon += 5) pts.push([lat, lon, 0]);
      out.push(pts);
    }
    return out;
  }, [step]);

  const front: string[] = [];
  const back: string[] = [];
  lines.forEach((ll) => {
    const pts = ll.map(([la, lo]) => project(la, lo, rot, tilt));
    const s = splitPaths(pts, r, c);
    front.push(...s.front);
    back.push(...s.back);
  });

  const sw = m.px(strokeWidth);
  return (
    <div
      style={{
        width: D,
        height: D,
        position: "relative",
        transform: `scale(${0.6 + 0.4 * enter}) rotate(${(1 - enter) * -25}deg)`,
        opacity: enter,
        filter:
          enter < 1 ? `blur(${m.blur("object") * (1 - enter)}px)` : undefined,
        ...style,
      }}
    >
      {glow ? (
        <div
          style={{
            position: "absolute",
            inset: -D * 0.25,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${glow} 0%, transparent 62%)`,
            opacity: 0.55,
          }}
        />
      ) : null}
      <svg
        width={D}
        height={D}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={ink}
          strokeWidth={sw * 1.4}
        />
        <path
          d={back.join("")}
          fill="none"
          stroke={ink}
          strokeWidth={sw}
          opacity={backOpacity}
        />
        <path
          d={front.join("")}
          fill="none"
          stroke={ink}
          strokeWidth={sw}
          strokeLinecap="round"
        />
        {markers.map((mk, i) => {
          const p = project(mk.lat, mk.lon, rot, tilt);
          if (p[2] < -0.05) return null;
          const k = progressAt(
            frame,
            m.fps,
            mk.at ?? delay,
            m.dur("enter", speed),
            "enterStrong",
          );
          const rr = m.px(mk.size ?? 10) * k * (0.6 + 0.4 * Math.max(p[2], 0));
          const fade = Math.min(1, (p[2] + 0.05) / 0.25);
          return (
            <g key={i} opacity={fade}>
              <circle
                cx={c + p[0] * r}
                cy={c - p[1] * r}
                r={rr * 2.2}
                fill={mk.color ?? ink}
                opacity={0.25}
              />
              <circle
                cx={c + p[0] * r}
                cy={c - p[1] * r}
                r={rr}
                fill={mk.color ?? ink}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
