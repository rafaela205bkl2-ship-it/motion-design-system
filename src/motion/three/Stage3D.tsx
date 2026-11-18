/**
 * Palco 3D em CSS: perspectiva + câmera + planos posicionados no espaço.
 *
 * Por quê: a ref-001 usa objetos e cartões em profundidade (12,3–16 s; 26–28 s) e zoom
 * "através" de um objeto como transição (12,1–12,3 s). CSS 3D dá esse volume com render
 * rápido e determinístico, sem WebGL (que roda em software sem GPU).
 *
 * Os valores de câmera são números: anime-os com `progressAt`/`interpolate` na cena.
 * Distâncias em px de design.
 *
 * Atenção: `filter` e `overflow: hidden` achatam o 3D. Não os use em planos que
 * precisam manter profundidade (aplique desfoque fora do palco, com `Layer`).
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { useMotion } from "../MotionProvider";

export type Stage3DProps = {
  readonly children: React.ReactNode;
  /** Distância focal em px de design. Menor = perspectiva mais forte. */
  readonly perspective?: number;
  /** Posição da câmera no eixo Z (px de design). Positivo aproxima a câmera da cena. */
  readonly cameraZ?: number;
  /** Deslocamento da câmera (px de design). */
  readonly cameraX?: number;
  readonly cameraY?: number;
  /** Inclinação (graus). */
  readonly rotateX?: number;
  readonly rotateY?: number;
  readonly rotateZ?: number;
  /** Ponto de fuga, em fração da tela (0–1). */
  readonly originX?: number;
  readonly originY?: number;
  readonly style?: React.CSSProperties;
};

export const Stage3D: React.FC<Stage3DProps> = ({
  children,
  perspective = 1400,
  cameraZ = 0,
  cameraX = 0,
  cameraY = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  originX = 0.5,
  originY = 0.5,
  style,
}) => {
  const m = useMotion();
  return (
    <AbsoluteFill
      style={{
        perspective: m.px(perspective),
        perspectiveOrigin: `${originX * 100}% ${originY * 100}%`,
        ...style,
      }}
    >
      <AbsoluteFill
        style={{
          transformStyle: "preserve-3d",
          transform: `translate3d(${m.px(-cameraX)}px, ${m.px(-cameraY)}px, ${m.px(cameraZ)}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export type Plane3DProps = {
  readonly children: React.ReactNode;
  /** Posição relativa ao centro da tela, em px de design. */
  readonly x?: number;
  readonly y?: number;
  /** Profundidade (px de design). Negativo = mais longe. */
  readonly z?: number;
  readonly rotateX?: number;
  readonly rotateY?: number;
  readonly rotateZ?: number;
  readonly scale?: number;
  readonly opacity?: number;
  readonly style?: React.CSSProperties;
};

/** Plano centrado no palco, posicionado em x/y/z. Mantém o 3D dos filhos. */
export const Plane3D: React.FC<Plane3DProps> = ({
  children,
  x = 0,
  y = 0,
  z = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  scale = 1,
  opacity = 1,
  style,
}) => {
  const m = useMotion();
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 0,
        height: 0,
        transformStyle: "preserve-3d",
        transform: `translate3d(${m.px(x)}px, ${m.px(y)}px, ${m.px(z)}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          transform: "translate(-50%, -50%)",
          transformStyle: "preserve-3d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};
