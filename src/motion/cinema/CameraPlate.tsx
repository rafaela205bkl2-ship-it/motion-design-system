/**
 * Câmera virtual sobre uma imagem fixa (pintura, foto, mockup): pan, zoom, giro e
 * foco por quadros-chave em segundos.
 *
 * Origem: ref-003 (manifesto com arquivo histórico) — todo plano de arquivo tem um
 * movimento lento e contínuo (push-in, travelling lateral), nunca uma imagem parada;
 * ref-004 — aproximações em detalhes de pinturas.
 *
 * x/y = ponto focal em fração da imagem (0–1), centralizado na tela.
 * zoom = escala relativa ao "cover" (1 = a imagem cobre a tela exatamente).
 */
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from "remotion";
import type { EasingInput } from "../easing";
import { useMotion } from "../MotionProvider";
import { keyframeAt } from "./keyframes";

export type CameraKey = {
  /** Segundos, relativos ao início da sequência. */
  t: number;
  x?: number;
  y?: number;
  zoom?: number;
  /** Graus. */
  rotate?: number;
  /** Desfoque (foco) em px de design. */
  blur?: number;
  /** Brilho (1 = original). */
  brightness?: number;
  opacity?: number;
};

export type CameraPlateProps = {
  readonly src: string;
  /** Tamanho natural da imagem em px [largura, altura]. */
  readonly size: readonly [number, number];
  readonly keys: readonly CameraKey[];
  readonly easing?: EasingInput;
  /** Impede que a borda da imagem apareça (padrão: true). */
  readonly clamp?: boolean;
  /** Filtro CSS extra (gradação de cor), aplicado depois de brilho/foco. */
  readonly filter?: string;
  /** Multiplica a velocidade de todos os quadros-chave. */
  readonly speed?: number;
  /** Tamanho do quadro da câmera em px de design [largura, altura] (padrão: a tela inteira). Para mosaicos e janelas. */
  readonly viewport?: readonly [number, number];
  readonly style?: React.CSSProperties;
  readonly children?: React.ReactNode;
};

export const CameraPlate: React.FC<CameraPlateProps> = ({
  src,
  size,
  keys,
  easing = "camera",
  clamp = true,
  filter,
  speed = 1,
  viewport,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const video = useVideoConfig();
  const m = useMotion();
  const W = viewport ? m.px(viewport[0]) : video.width;
  const H = viewport ? m.px(viewport[1]) : video.height;
  const t = (frame / m.fps) * speed;
  const [iw, ih] = size;
  const k = (p: string, d: number) =>
    keyframeAt(
      keys as unknown as Parameters<typeof keyframeAt>[0],
      p,
      t,
      d,
      easing,
    );

  const zoom = k("zoom", 1);
  const s = Math.max(W / iw, H / ih) * Math.max(zoom, 0.05);
  const w = iw * s;
  const h = ih * s;
  let tx = W / 2 - k("x", 0.5) * w;
  let ty = H / 2 - k("y", 0.5) * h;
  if (clamp) {
    tx = w >= W ? Math.min(0, Math.max(W - w, tx)) : (W - w) / 2;
    ty = h >= H ? Math.min(0, Math.max(H - h, ty)) : (H - h) / 2;
  }
  const blur = k("blur", 0);
  const bright = k("brightness", 1);
  const f = [
    blur > 0.05 ? `blur(${m.px(blur)}px)` : "",
    Math.abs(bright - 1) > 0.001 ? `brightness(${bright})` : "",
    filter ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <AbsoluteFill
      style={{ overflow: "hidden", opacity: k("opacity", 1), ...style }}
    >
      <Img
        src={src}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: w,
          height: h,
          maxWidth: "none",
          transform: `translate(${tx}px, ${ty}px) rotate(${k("rotate", 0)}deg)`,
          transformOrigin: `${W / 2 - tx}px ${H / 2 - ty}px`,
          filter: f || undefined,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};
