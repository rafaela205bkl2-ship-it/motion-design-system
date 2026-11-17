import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";

export type RadialRevealProps = {
  /** Ponto de origem em fração da tela: [0.5, 0.5] = centro. */
  origin?: [number, number];
  /** Largura da borda suave, em px de design (0 = borda dura). */
  softness?: number;
  /** Anel que corre à frente da borda (cor). Omitido = sem anel. */
  ringColor?: string;
  /** Espessura do anel, em px de design. */
  ringWidth?: number;
  /** Zoom de entrada da nova cena (0 = nenhum; 0.06 = começa 6% maior). */
  zoom?: number;
  /** Escurece/encolhe levemente a cena que sai (0–1). */
  exitDepth?: number;
};

const RadialRevealPresentation: React.FC<
  TransitionPresentationComponentProps<RadialRevealProps>
> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps,
}) => {
  const { width, height } = useVideoConfig();
  const unit = Math.min(width, height) / 1080;
  const {
    origin = [0.5, 0.5],
    softness = 6,
    ringColor,
    ringWidth = 26,
    zoom = 0.05,
    exitDepth = 0.35,
  } = passedProps;

  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill
        style={{
          scale: String(1 - 0.03 * exitDepth * p),
          filter:
            exitDepth > 0
              ? `brightness(${1 - 0.25 * exitDepth * p})`
              : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  const ox = origin[0] * width;
  const oy = origin[1] * height;
  // raio até o canto mais distante, mais a borda suave e o anel
  const maxR =
    Math.max(
      Math.hypot(ox, oy),
      Math.hypot(width - ox, oy),
      Math.hypot(ox, height - oy),
      Math.hypot(width - ox, height - oy),
    ) +
    (softness + ringWidth) * unit;
  const r = maxR * p;
  const soft = softness * unit;
  const ring = ringColor ? ringWidth * unit : 0;
  const mask = `radial-gradient(circle at ${ox}px ${oy}px, #000 ${Math.max(0, r - ring - soft)}px, transparent ${Math.max(0.01, r - ring)}px)`;

  return (
    <AbsoluteFill>
      {ringColor && p > 0 && p < 1 ? (
        <AbsoluteFill
          style={{
            background: ringColor,
            maskImage: `radial-gradient(circle at ${ox}px ${oy}px, #000 ${Math.max(0, r - soft)}px, transparent ${Math.max(0.01, r)}px)`,
            WebkitMaskImage: `radial-gradient(circle at ${ox}px ${oy}px, #000 ${Math.max(0, r - soft)}px, transparent ${Math.max(0.01, r)}px)`,
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          maskImage: p >= 1 ? undefined : mask,
          WebkitMaskImage: p >= 1 ? undefined : mask,
        }}
      >
        <AbsoluteFill
          style={{
            scale: String(1 + zoom * (1 - p)),
            transformOrigin: `${ox}px ${oy}px`,
          }}
        >
          {children}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Nova cena surge num círculo que se expande a partir de um ponto.
 * Use com `motionTiming('fast', 'wipe')` (acelera até cobrir, como nas referências).
 */
export const radialReveal = (
  props: RadialRevealProps = {},
): TransitionPresentation<RadialRevealProps> => ({
  component: RadialRevealPresentation,
  props,
});
