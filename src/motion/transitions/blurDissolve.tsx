import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";

export type BlurDissolveProps = {
  /** Desfoque máximo em px de design. */
  blur?: number;
  /** Variação de escala (0.04 = a cena que sai cresce 4%, a que entra começa 4% menor). */
  scale?: number;
  /** Cor intermediária (ex.: '#FFFFFF' para "fade para branco"). Omitido = dissolve direto. */
  through?: string;
  /** Opacidade máxima da cor intermediária (0–1). */
  throughStrength?: number;
};

const BlurDissolvePresentation: React.FC<
  TransitionPresentationComponentProps<BlurDissolveProps>
> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps,
}) => {
  const { width, height } = useVideoConfig();
  const unit = Math.min(width, height) / 1080;
  const {
    blur = 28,
    scale = 0.04,
    through,
    throughStrength = 0.9,
  } = passedProps;

  if (presentationDirection === "exiting") {
    const b = blur * unit * p;
    return (
      <AbsoluteFill
        style={{
          opacity: through ? 1 : 1 - p,
          filter: b > 0.05 ? `blur(${b}px)` : undefined,
          scale: String(1 + scale * p),
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  const b = blur * unit * (1 - p);
  // com cor intermediária: a nova cena só aparece na segunda metade
  const enterOpacity = through
    ? Math.min(1, Math.max(0, (p - 0.35) / 0.65))
    : p;
  const veil = through ? Math.sin(Math.PI * p) * throughStrength : 0;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: enterOpacity,
          filter: b > 0.05 ? `blur(${b}px)` : undefined,
          scale: String(1 - scale * (1 - p)),
        }}
      >
        {children}
      </AbsoluteFill>
      {through && veil > 0.001 ? (
        <AbsoluteFill style={{ background: through, opacity: veil }} />
      ) : null}
    </AbsoluteFill>
  );
};

/**
 * Dissolve com desfoque: a cena que sai desfoca e cresce levemente, a que entra
 * nasce desfocada. Com `through`, passa por uma cor (fade para branco das referências).
 */
export const blurDissolve = (
  props: BlurDissolveProps = {},
): TransitionPresentation<BlurDissolveProps> => ({
  component: BlurDissolvePresentation,
  props,
});
