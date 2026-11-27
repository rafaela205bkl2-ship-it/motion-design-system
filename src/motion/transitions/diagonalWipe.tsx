/**
 * diagonalWipe — uma faixa colorida atravessa a tela na diagonal e a nova cena
 * aparece atrás dela.
 *
 * Origem: ref-aline-03 (5,0–5,5 s: logotipo sai e uma faixa vermelha cruza a tela
 * branca em diagonal, ~45°, abrindo a próxima cena em ~0,4 s). A faixa acelera e
 * desacelera (`wipeSmooth`); a borda é dura, como na referência.
 */
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";

export type DiagonalWipeProps = {
  /** Cor da faixa. */
  bandColor?: string;
  /** Largura da faixa, em px de design. */
  bandWidth?: number;
  /** Direção da varredura em graus CSS (90 = para a direita; 125 = para baixo e à direita). */
  angle?: number;
  /** Desloca levemente a cena que sai na direção do movimento (px de design). */
  push?: number;
};

const DiagonalWipePresentation: React.FC<
  TransitionPresentationComponentProps<DiagonalWipeProps>
> = ({ children, presentationDirection, presentationProgress: p, passedProps }) => {
  const { width, height } = useVideoConfig();
  const unit = Math.min(width, height) / 1080;
  const { bandColor = "#FFFFFF", bandWidth = 220, angle = 125, push = 60 } = passedProps;
  // `angle` = direção da varredura no padrão CSS (90 = para a direita, 135 = para baixo-direita)
  const rad = (angle * Math.PI) / 180;
  const dir = { x: Math.sin(rad), y: -Math.cos(rad) };
  // comprimento da linha de gradiente do CSS para esse ângulo
  const span = Math.abs(width * Math.sin(rad)) + Math.abs(height * Math.cos(rad));
  const band = bandWidth * unit;
  const pos = (span + band) * p; // borda da frente da faixa
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill
        style={{
          transform: `translate(${dir.x * push * unit * p}px, ${dir.y * push * unit * p}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  const revealEnd = Math.max(0, pos - band);
  const mask = `linear-gradient(${angle}deg, #000 ${revealEnd}px, transparent ${revealEnd + 0.5}px)`;
  const bandMask = `linear-gradient(${angle}deg, transparent ${revealEnd}px, #000 ${revealEnd + 0.5}px, #000 ${pos}px, transparent ${pos + 0.5}px)`;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          maskImage: p >= 1 ? undefined : mask,
          WebkitMaskImage: p >= 1 ? undefined : mask,
        }}
      >
        {children}
      </AbsoluteFill>
      {p > 0 && p < 1 ? (
        <AbsoluteFill
          style={{ background: bandColor, maskImage: bandMask, WebkitMaskImage: bandMask }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/** Faixa diagonal que limpa a tela. Use com `motionTiming({ duration: 0.4, easing: "wipeSmooth" })`. */
export const diagonalWipe = (
  props: DiagonalWipeProps = {},
): TransitionPresentation<DiagonalWipeProps> => ({
  component: DiagonalWipePresentation,
  props,
});
