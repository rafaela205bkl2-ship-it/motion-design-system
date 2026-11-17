/**
 * Fotografia: movimento de câmera (Ken Burns) e moldura.
 *
 * Usados em produções com fotos fornecidas (ex.: despedida universitária).
 * O arquivo original nunca é modificado: a imagem é exibida com `objectFit`
 * e transformada só na tela, em qualquer resolução.
 */
import React from "react";
import { Img } from "remotion";
import type { EasingInput } from "../easing";
import { useMotion, useProgress, type TimeValue } from "../MotionProvider";

/** Enquadramento: escala e deslocamento em % do quadro. */
export type CameraState = { scale?: number; x?: number; y?: number };

export type KenBurnsProps = {
  readonly src: string;
  /** Enquadramento inicial e final (aproximação = scale crescente). */
  readonly from?: CameraState;
  readonly to?: CameraState;
  /** Início e duração do movimento, em segundos. */
  readonly start?: number;
  readonly duration?: TimeValue;
  readonly easing?: EasingInput;
  /** Desfoque inicial (px de design) que some em `focusDuration`. */
  readonly blurFrom?: number;
  readonly focusDuration?: number;
  /** Ponto focal da imagem (CSS object-position), ex.: "50% 30%". */
  readonly focus?: string;
  readonly fit?: "cover" | "contain";
  readonly style?: React.CSSProperties;
};

/** Imagem que preenche o contêiner com aproximação/pan lento. */
export const KenBurns: React.FC<KenBurnsProps> = ({
  src,
  from = { scale: 1.08 },
  to = { scale: 1.0 },
  start = 0,
  duration = 6,
  easing = "camera",
  blurFrom = 0,
  focusDuration = 1.2,
  focus = "50% 50%",
  fit = "cover",
  style,
}) => {
  const m = useMotion();
  const p = useProgress({ start, duration: m.dur(duration), easing });
  const f = useProgress({ start, duration: focusDuration, easing: "enter" });
  const lerp = (a = 0, b = 0) => a + (b - a) * p;
  const s = lerp(from.scale ?? 1, to.scale ?? 1);
  const x = lerp(from.x, to.x);
  const y = lerp(from.y, to.y);
  const b = m.blur(blurFrom) * (1 - f);
  return (
    <div
      style={{ position: "absolute", inset: 0, overflow: "hidden", ...style }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: fit,
          objectPosition: focus,
          scale: String(s),
          translate: `${x}% ${y}%`,
          filter: b > 0.05 ? `blur(${b}px)` : undefined,
        }}
      />
    </div>
  );
};

export type PhotoFrameProps = {
  readonly src: string;
  /** Largura em px de design. */
  readonly width: number;
  /** Proporção largura/altura da FOTO (do inventário). */
  readonly ratio: number;
  /** Borda de papel em px de design (0 = sem moldura). */
  readonly border?: number;
  /** Margem inferior extra (estilo instantânea) em px de design. */
  readonly bottomBorder?: number;
  readonly paper?: string;
  readonly radius?: number;
  /** Rotação em graus. */
  readonly rotate?: number;
  /** Intensidade da sombra (0–1). */
  readonly shadow?: number;
  /** Legenda manuscrita/curta na margem inferior. */
  readonly caption?: string;
  /** Movimento interno sutil da foto (aproximação). */
  readonly drift?: boolean;
  readonly start?: number;
  readonly focus?: string;
  readonly style?: React.CSSProperties;
};

/** Foto emoldurada com sombra — peça básica de colagens e paredes de fotos. */
export const PhotoFrame: React.FC<PhotoFrameProps> = ({
  src,
  width,
  ratio,
  border = 14,
  bottomBorder,
  paper,
  radius = 6,
  rotate = 0,
  shadow = 0.35,
  caption,
  drift = true,
  start = 0,
  focus,
  style,
}) => {
  const m = useMotion();
  const w = m.px(width);
  const bd = m.px(border);
  const bb = m.px(bottomBorder ?? (caption ? border * 3.2 : border));
  const h = w / ratio;
  return (
    <div
      style={{
        width: w + bd * 2,
        padding: `${bd}px ${bd}px ${bb}px`,
        boxSizing: "border-box",
        background: paper ?? m.palette.surface,
        borderRadius: m.px(radius),
        rotate: `${rotate}deg`,
        boxShadow: `0 ${m.px(24)}px ${m.px(60)}px rgba(20,14,8,${shadow}), 0 ${m.px(4)}px ${m.px(10)}px rgba(20,14,8,${shadow * 0.6})`,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: w,
          height: h,
          overflow: "hidden",
          borderRadius: m.px(Math.max(0, radius - 3)),
        }}
      >
        <KenBurns
          src={src}
          from={{ scale: drift ? 1.06 : 1 }}
          to={{ scale: 1 }}
          start={start}
          duration={drift ? 5 : 0.01}
          focus={focus}
        />
      </div>
      {caption ? (
        <div
          style={{
            height: bb - bd,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: m.theme.fonts.body,
            fontWeight: 700,
            fontSize: m.px(26),
            color: m.palette.muted,
            letterSpacing: "0.04em",
          }}
        >
          {caption}
        </div>
      ) : null}
    </div>
  );
};
