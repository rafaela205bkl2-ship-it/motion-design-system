/**
 * Acabamento de película sobre uma cena inteira: granulação viva, vinheta,
 * oscilação de luz (flicker), tremor de projeção (gate weave), tingimento e letterbox.
 *
 * Origem: ref-003 — todo o arquivo histórico é unificado por grão forte, vinheta e
 * tingimento monocromático (azul-acinzentado no meio, oliva no fim); a imagem "respira".
 *
 * Envolva a cena: <FilmLook grain={0.16} letterbox={1}>…</FilmLook>
 */
import React from "react";
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useMotion } from "../MotionProvider";

export type FilmLookProps = {
  readonly children?: React.ReactNode;
  /** Intensidade da granulação (0–1). */
  readonly grain?: number;
  /** Intensidade da vinheta (0–1). */
  readonly vignette?: number;
  /** Oscilação de brilho por quadro (0–0,1). */
  readonly flicker?: number;
  /** Tremor de projeção, em px de design. */
  readonly weave?: number;
  /** Cor de tingimento (blend soft-light) e sua força (0–1). */
  readonly tint?: string;
  readonly tintStrength?: number;
  /** Quanto das tarjas de letterbox está fechado (0 = tela cheia, 1 = proporção `ratio`). */
  readonly letterbox?: number;
  /** Proporção do quadro com letterbox (padrão 2,39:1, "scope"). */
  readonly ratio?: number;
  readonly letterboxColor?: string;
};

export const FilmLook: React.FC<FilmLookProps> = ({
  children,
  grain = 0.14,
  vignette = 0.4,
  flicker = 0.02,
  weave = 0.8,
  tint,
  tintStrength = 0.25,
  letterbox = 0,
  ratio = 2.39,
  letterboxColor = "#000",
}) => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const m = useMotion();
  // tremor: ruído determinístico suavizado (a cada 2 quadros)
  const f2 = Math.floor(frame / 2);
  const wx = (random(`wx-${f2}`) - 0.5) * 2 * m.px(weave);
  const wy = (random(`wy-${f2}`) - 0.5) * 2 * m.px(weave) * 0.6;
  const fl = 1 + (random(`fl-${frame}`) - 0.5) * 2 * flicker;
  const bar =
    Math.max(0, (H - W / ratio) / 2) * Math.min(Math.max(letterbox, 0), 1);
  const seed = frame % 8;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${wx}px, ${wy}px) scale(${1 + m.px(weave * 2) / W})`,
          filter: Math.abs(fl - 1) > 0.001 ? `brightness(${fl})` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
      {tint ? (
        <AbsoluteFill
          style={{
            background: tint,
            mixBlendMode: "soft-light",
            opacity: tintStrength,
          }}
        />
      ) : null}
      {vignette > 0 ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,${vignette}) 100%)`,
          }}
        />
      ) : null}
      {grain > 0 ? (
        <AbsoluteFill style={{ opacity: grain, mixBlendMode: "overlay" }}>
          {/* meia resolução + escala 2x: 4x menos pixels para o filtro (mesma técnica do Backdrop) */}
          <svg
            width="50%"
            height="50%"
            style={{ display: "block", scale: "2", transformOrigin: "0 0" }}
          >
            <filter
              id={`film-grain-${seed}`}
              x="0"
              y="0"
              width="100%"
              height="100%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency={1.25 / m.unit}
                numOctaves={2}
                seed={seed * 7 + 3}
                stitchTiles="stitch"
              />
              <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 1.8 -0.4" />
            </filter>
            <rect
              width="100%"
              height="100%"
              filter={`url(#film-grain-${seed})`}
            />
          </svg>
        </AbsoluteFill>
      ) : null}
      {bar > 0.5 ? (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: bar,
              background: letterboxColor,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: bar,
              background: letterboxColor,
            }}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
};
