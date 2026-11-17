import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useMotion } from "../MotionProvider";

export type Glow = {
  /** Posição em fração da tela. */
  x: number;
  y: number;
  /** Diâmetro em px de design. */
  size: number;
  color: string;
  opacity?: number;
};

export type BackdropProps = {
  /** Cor de fundo. Padrão: a do tema. */
  readonly color?: string;
  /** Brilhos suaves. Padrão: um brilho com a cor `glow` do tema. */
  readonly glows?: Glow[];
  /** Movimento lento dos brilhos, em px de design (0 = parado). */
  readonly glowDrift?: number;
  /** Intensidade da vinheta (0–1). */
  readonly vignette?: number;
  /** Intensidade da granulação (0–1). Quebra o "liso digital" e reduz banding. */
  readonly grain?: number;
  readonly children?: React.ReactNode;
};

/** Fundo de cena: cor, brilhos radiais suaves, vinheta e granulação. */
export const Backdrop: React.FC<BackdropProps> = ({
  color,
  glows,
  glowDrift = 30,
  vignette = 0.18,
  grain = 0.12,
  children,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const t = frame / m.fps;
  const list = glows ?? [
    { x: 0.5, y: 0.42, size: 1300, color: m.palette.glow, opacity: 0.7 },
  ];

  return (
    <AbsoluteFill
      style={{ background: color ?? m.palette.background, overflow: "hidden" }}
    >
      {list.map((g, i) => {
        const dx = Math.sin(t * 0.35 + i * 2.1) * m.px(glowDrift);
        const dy = Math.cos(t * 0.28 + i * 1.3) * m.px(glowDrift);
        const s = m.px(g.size);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(${g.x * 100}% - ${s / 2}px)`,
              top: `calc(${g.y * 100}% - ${s / 2}px)`,
              width: s,
              height: s,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${g.color} 0%, transparent 68%)`,
              opacity: g.opacity ?? 0.7,
              translate: `${dx}px ${dy}px`,
            }}
          />
        );
      })}
      {children}
      {vignette > 0 ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,${vignette}) 100%)`,
          }}
        />
      ) : null}
      {grain > 0 ? (
        <AbsoluteFill
          style={{
            opacity: grain,
            mixBlendMode: "overlay",
            pointerEvents: "none",
          }}
        >
          {/* ruído procedural: determinístico, semente muda a cada quadro para a granulação "viver" */}
          {/* meia resolução + escala 2x: 4x menos pixels para o filtro calcular */}
          <svg
            width="50%"
            height="50%"
            style={{ display: "block", scale: "2", transformOrigin: "0 0" }}
          >
            <filter
              id={`grain-${frame % 6}`}
              x="0"
              y="0"
              width="100%"
              height="100%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency={1.1 / m.unit}
                numOctaves={2}
                seed={frame % 6}
                stitchTiles="stitch"
              />
              <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 1.6 -0.3" />
            </filter>
            <rect
              width="100%"
              height="100%"
              filter={`url(#grain-${frame % 6})`}
            />
          </svg>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
