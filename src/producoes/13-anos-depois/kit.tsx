/**
 * Peças de composição desta produção, montadas só com a biblioteca.
 * Tudo em px de design do 9:16 (1080×1920). Área segura: laterais 80, topo 200, base 280.
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { TextReveal, resolveEasing, useLayout, type EasingInput, type TextRevealProps } from "../../motion";
import { SERIF } from "./tema";

/** Tempo local da cena em segundos. */
export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/** Interpolação por quadros-chave em segundos, sempre presa nas pontas. */
export const kf = (t: number, times: number[], values: number[], easing: EasingInput = "camera") =>
  interpolate(t, times, values, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: resolveEasing(easing),
  });

type FraseProps = Omit<TextRevealProps, "text"> & {
  readonly texto: string;
  /** Distância do topo em px de design. */
  readonly topo: number;
  /** Itálico serifado (memória). */
  readonly serif?: boolean;
};

/** Frase cinética posicionada verticalmente, centralizada na área segura. */
export const Frase: React.FC<FraseProps> = ({ texto, topo, serif = false, style, ...rest }) => {
  const { px, safe } = useLayout();
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        paddingTop: px(topo),
        paddingLeft: safe.x,
        paddingRight: safe.x,
        pointerEvents: "none",
      }}
    >
      <TextReveal
        text={texto}
        align="center"
        maxWidth={920}
        {...(serif
          ? { font: "body" as const, by: "word" as const, weight: 400, tracking: "-0.01em", lineHeight: 1.05 }
          : { by: "char" as const, easing: "enterStrong" as const, lineHeight: 0.98 })}
        {...rest}
        style={{ ...(serif ? { fontStyle: "italic", fontFamily: SERIF } : {}), ...style }}
      />
    </AbsoluteFill>
  );
};

/** Ponto de luz (semente do sol). */
export const PontoDeLuz: React.FC<{ readonly raio: number; readonly cor: string; readonly x?: number; readonly y?: number; readonly opacidade?: number }> = ({
  raio,
  cor,
  x = 540,
  y = 960,
  opacidade = 1,
}) => {
  const { px } = useLayout();
  const r = px(Math.max(0.01, raio));
  const halo = r * 7;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: opacidade }}>
      <div
        style={{
          position: "absolute",
          left: px(x) - halo,
          top: px(y) - halo,
          width: halo * 2,
          height: halo * 2,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${cor} 0%, ${cor}66 10%, transparent 60%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: px(x) - r,
          top: px(y) - r,
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          background: `radial-gradient(circle, #FFFFFF 0%, ${cor} 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};
