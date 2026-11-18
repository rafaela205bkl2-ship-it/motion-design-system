/**
 * Cartão com conteúdo dentro (vídeo, imagem ou cenário) em perspectiva:
 * cantos arredondados, borda luminosa, sombra suave de contato e brilho que atravessa.
 *
 * Por quê: cartões e interfaces flutuando em profundidade na ref-001 (12,3–16 s; 26–28 s).
 * Aqui eles servem de moldura para cenas reais, fazendo a ponte entre gráfico e imagem.
 *
 * Inclinação e brilho são números: anime-os na cena. Medidas em px de design.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { useMotion } from "../MotionProvider";

export type FootageCardProps = {
  readonly children?: React.ReactNode;
  readonly width?: number;
  readonly height?: number;
  readonly radius?: number;
  /** Fundo quando não há conteúdo. */
  readonly background?: string;
  /** Cor da borda luminosa (vazio = sem borda). */
  readonly edge?: string;
  readonly edgeWidth?: number;
  /** Inclinação (graus). */
  readonly tiltX?: number;
  readonly tiltY?: number;
  readonly rotate?: number;
  /** Progresso 0–1 do brilho diagonal (fora de 0–1 = sem brilho). */
  readonly sheen?: number;
  /** Intensidade da sombra (0–1). */
  readonly shadow?: number;
  /** Escurece a base para texto legível (0–1). */
  readonly scrim?: number;
  /** Texto pequeno sobre o cartão, embaixo. */
  readonly caption?: React.ReactNode;
  readonly style?: React.CSSProperties;
};

export const FootageCard: React.FC<FootageCardProps> = ({
  children,
  width = 640,
  height = 860,
  radius = 44,
  background,
  edge,
  edgeWidth = 2,
  tiltX = 0,
  tiltY = 0,
  rotate = 0,
  sheen = -1,
  shadow = 0.5,
  scrim = 0,
  caption,
  style,
}) => {
  const m = useMotion();
  const r = m.px(radius);
  return (
    <div
      style={{
        position: "relative",
        width: m.px(width),
        height: m.px(height),
        transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${rotate}deg)`,
        borderRadius: r,
        boxShadow:
          shadow > 0
            ? `0 ${m.px(40)}px ${m.px(90)}px rgba(0,0,0,${0.45 * shadow}), 0 ${m.px(8)}px ${m.px(20)}px rgba(0,0,0,${0.3 * shadow})`
            : undefined,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: r,
          overflow: "hidden",
          background: background ?? m.palette.surface,
        }}
      >
        {children}
        {scrim > 0 ? (
          <AbsoluteFill
            style={{
              background: `linear-gradient(to top, rgba(0,0,0,${0.75 * scrim}) 0%, transparent 55%)`,
            }}
          />
        ) : null}
        {sheen >= 0 && sheen <= 1 ? (
          <AbsoluteFill
            style={{
              background: `linear-gradient(115deg, transparent ${sheen * 160 - 40}%, rgba(255,255,255,0.35) ${sheen * 160 - 20}%, transparent ${sheen * 160}%)`,
              mixBlendMode: "screen",
            }}
          />
        ) : null}
        {caption ? (
          <div
            style={{
              position: "absolute",
              left: m.px(40),
              right: m.px(40),
              bottom: m.px(36),
            }}
          >
            {caption}
          </div>
        ) : null}
      </div>
      {edge ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: r,
            border: `${m.px(edgeWidth)}px solid ${edge}`,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </div>
  );
};
