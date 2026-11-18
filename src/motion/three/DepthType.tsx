/**
 * Tipografia com volume: o texto é extrudado em camadas no eixo Z, com face frontal,
 * laterais em degradê (luz → sombra) e brilho opcional que atravessa a face.
 *
 * Por quê: números e palavras como objetos físicos (ref-001: objetos 3D com sombra suave,
 * 8–22 s). Funciona dentro de `Stage3D`/`Plane3D`; fora de um palco, gira em torno do próprio centro.
 *
 * Custo: cada camada é uma cópia do texto. 10–16 camadas dão volume convincente.
 */
import React from "react";
import { mixHex } from "../themes";
import { useMotion } from "../MotionProvider";

export type DepthTypeProps = {
  readonly text: string;
  /** Tamanho da fonte em px de design. */
  readonly size?: number;
  /** Profundidade da extrusão em px de design. */
  readonly depth?: number;
  /** Número de camadas da extrusão. */
  readonly layers?: number;
  /** Cor da face. Padrão: tinta do tema. */
  readonly color?: string;
  /** Cor das laterais perto da face (luz). */
  readonly sideLight?: string;
  /** Cor das laterais no fundo (sombra). */
  readonly sideDark?: string;
  readonly font?: "display" | "body" | string;
  readonly weight?: number;
  readonly tracking?: string;
  readonly lineHeight?: number;
  /** Rotação do objeto (graus). */
  readonly rotateX?: number;
  readonly rotateY?: number;
  readonly rotateZ?: number;
  /** Progresso 0–1 do brilho que atravessa a face (fora de 0–1 = sem brilho). */
  readonly sheen?: number;
  readonly sheenColor?: string;
  /** Contorno no lugar da face cheia (largura em px de design; 0 = face cheia). */
  readonly outline?: number;
  readonly opacity?: number;
  readonly style?: React.CSSProperties;
};

export const DepthType: React.FC<DepthTypeProps> = ({
  text,
  size = 320,
  depth = 70,
  layers = 14,
  color,
  sideLight,
  sideDark,
  font = "display",
  weight,
  tracking,
  lineHeight = 0.9,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  sheen = -1,
  sheenColor = "rgba(255,255,255,0.85)",
  outline = 0,
  opacity = 1,
  style,
}) => {
  const m = useMotion();
  const face = color ?? m.palette.ink;
  const light = sideLight ?? mixHex(face, "#000000", 0.35);
  const dark = sideDark ?? mixHex(face, "#000000", 0.8);
  const family =
    font === "display"
      ? m.theme.fonts.display
      : font === "body"
        ? m.theme.fonts.body
        : font;
  const base: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    fontFamily: family,
    fontWeight: weight ?? m.theme.weights.display,
    fontSize: m.px(size),
    letterSpacing: tracking ?? m.theme.displayTracking,
    lineHeight,
    whiteSpace: "pre",
  };
  const step = m.px(depth) / Math.max(1, layers);
  const showSheen = sheen >= 0 && sheen <= 1;

  return (
    <div
      style={{
        position: "relative",
        transformStyle: "preserve-3d",
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        opacity,
        ...style,
      }}
    >
      {/* espaçador invisível dá o tamanho do bloco */}
      <div style={{ ...base, position: "relative", visibility: "hidden" }}>
        {text}
      </div>
      {Array.from({ length: layers }, (_, i) => {
        const k = layers - i; // do fundo para a frente
        const t = k / layers;
        return (
          <div
            key={i}
            aria-hidden
            style={{
              ...base,
              color: mixHex(light, dark, t),
              transform: `translateZ(${-k * step}px)`,
            }}
          >
            {text}
          </div>
        );
      })}
      <div
        style={{
          ...base,
          color: outline > 0 ? "transparent" : face,
          WebkitTextStroke: outline > 0 ? `${m.px(outline)}px ${face}` : undefined,
          transform: "translateZ(0.5px)",
        }}
      >
        {text}
      </div>
      {showSheen ? (
        <div
          aria-hidden
          style={{
            ...base,
            color: "transparent",
            backgroundImage: `linear-gradient(105deg, transparent ${sheen * 140 - 30}%, ${sheenColor} ${sheen * 140 - 15}%, transparent ${sheen * 140}%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            transform: "translateZ(1px)",
          }}
        >
          {text}
        </div>
      ) : null}
    </div>
  );
};
