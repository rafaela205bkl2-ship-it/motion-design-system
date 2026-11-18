/**
 * Aparência de filme/TV antiga e a abertura de uma TV de tubo.
 *
 * - `FilmLook`: camada por cima da cena com linhas de varredura, vinheta,
 *   tremulação de brilho e granulação (mesmo ruído procedural do `Backdrop`).
 * - `CrtReveal`: a cena "liga" como uma TV de tubo: ponto → linha horizontal → tela cheia.
 *
 * Uso: memória e nostalgia (cenas de 2013). Intensidade baixa por padrão: é textura, não efeito.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { progressAt, useMotion } from "../MotionProvider";

export type FilmLookProps = {
  /** Intensidade geral (0–1). */
  readonly intensity?: number;
  /** Linhas de varredura (0–1). */
  readonly scanlines?: number;
  /** Granulação (0–1). */
  readonly grain?: number;
  /** Vinheta (0–1). */
  readonly vignette?: number;
  /** Tremulação de brilho (0–1). */
  readonly flicker?: number;
  /** Tom quente sobreposto (cor CSS ou vazio). */
  readonly tint?: string;
};

export const FilmLook: React.FC<FilmLookProps> = ({
  intensity = 1,
  scanlines = 0.35,
  grain = 0.3,
  vignette = 0.5,
  flicker = 0.25,
  tint,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const k = intensity;
  // tremulação determinística
  const fl = (Math.sin(frame * 1.7) * 0.5 + Math.sin(frame * 0.37) * 0.5) * 0.04 * flicker * k;
  const line = Math.max(2, m.px(4));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {tint ? (
        <AbsoluteFill style={{ background: tint, mixBlendMode: "soft-light", opacity: 0.6 * k }} />
      ) : null}
      {scanlines > 0 ? (
        <AbsoluteFill
          style={{
            background: `repeating-linear-gradient(to bottom, rgba(0,0,0,${0.35 * scanlines * k}) 0px, rgba(0,0,0,${0.35 * scanlines * k}) ${line / 2}px, transparent ${line / 2}px, transparent ${line}px)`,
            mixBlendMode: "multiply",
          }}
        />
      ) : null}
      {vignette > 0 ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,${0.75 * vignette * k}) 100%)`,
          }}
        />
      ) : null}
      {flicker > 0 ? (
        <AbsoluteFill style={{ background: fl > 0 ? "#fff" : "#000", opacity: Math.abs(fl) }} />
      ) : null}
      {grain > 0 ? (
        <AbsoluteFill style={{ opacity: grain * k, mixBlendMode: "overlay" }}>
          <svg width="50%" height="50%" style={{ display: "block", scale: "2", transformOrigin: "0 0" }}>
            <filter id={`film-${frame % 8}`} x="0" y="0" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency={1.3 / m.unit}
                numOctaves={2}
                seed={frame % 8}
                stitchTiles="stitch"
              />
              <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 1.8 -0.4" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#film-${frame % 8})`} />
          </svg>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

export type CrtRevealProps = {
  readonly children: React.ReactNode;
  readonly delay?: number;
  /** Duração total da abertura (s). */
  readonly duration?: number;
  readonly speed?: number;
  /** Cor do clarão da linha. */
  readonly flash?: string;
};

export const CrtReveal: React.FC<CrtRevealProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  speed = 1,
  flash = "#FFFFFF",
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const d = m.dur(duration, speed);
  const s = delay / speed;
  // 0–30%: ponto vira linha (largura); 30–100%: linha vira tela (altura)
  const w = progressAt(frame, m.fps, s, d * 0.3, "enterStrong");
  const h = progressAt(frame, m.fps, s + d * 0.3, d * 0.7, "enterStrong");
  const glow = 1 - progressAt(frame, m.fps, s + d * 0.25, d * 0.75, "exit");
  const sy = Math.max(0.004, h);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${Math.max(0.002, w)}, ${sy})`,
          opacity: w > 0 ? 1 : 0,
        }}
      >
        {children}
        <AbsoluteFill style={{ background: flash, opacity: glow * 0.9, mixBlendMode: "screen" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
