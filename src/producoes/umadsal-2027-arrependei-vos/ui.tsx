/**
 * Peças de interface do filme, montadas só com a biblioteca (TextReveal, Shine…).
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TextReveal, useLayout, useMotion } from "../../motion";
import { COR, IMG } from "./marca";
import { useAbs, useRel } from "./tempo";

/** Altura das tarjas do letterbox 2,39:1 em px de design (1080 − 1920/2,39) / 2. */
export const TARJA = 138;

/** Rótulo de obra, estilo legenda de museu (canto inferior esquerdo, dentro do letterbox). */
export const Rotulo: React.FC<{
  texto: string;
  de: number;
  ate: number;
  lado?: "esq" | "dir";
}> = ({ texto, de, ate, lado = "esq" }) => {
  const rel = useRel();
  const abs = useAbs();
  const { px } = useLayout();
  const linha = interpolate(abs, [de, de + 0.6, ate, ate + 0.3], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 22%, transparent 40%)",
          opacity: linha,
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: lado === "esq" ? "flex-start" : "flex-end",
          padding: `0 ${px(150)}px ${px(TARJA + 44)}px`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: px(18) }}>
          <div
            style={{
              width: px(46 * linha),
              height: px(1.5),
              background: COR.marfim,
              opacity: 0.55,
            }}
          />
          <TextReveal
            text={texto}
            by="char"
            delay={rel(de)}
            exitAt={rel(ate)}
            stagger={0.012}
            duration={0.5}
            size={22}
            font="body"
            weight={700}
            tracking="0.34em"
            color={COR.marfim}
            align="left"
            from={{ y: 0, blur: 8 }}
            style={{ fontStyle: "italic", opacity: 0.88 }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Título narrativo central (serifa renascentista, caixa alta). */
export const Titulo: React.FC<{
  texto: string;
  de: number;
  ate: number;
  size?: number;
  color?: string;
  y?: number;
}> = ({ texto, de, ate, size = 92, color = COR.marfim, y = 0 }) => {
  const rel = useRel();
  const { px } = useLayout();
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        transform: `translateY(${px(y)}px)`,
      }}
    >
      <TextReveal
        text={texto}
        by="char"
        direction="center"
        delay={rel(de)}
        duration={0.9}
        stagger={0.035}
        exitAt={rel(ate) - 0.45}
        exitDuration={0.45}
        size={size}
        weight={500}
        tracking="0.16em"
        color={color}
        from={{ y: 0, blur: 22, scale: 1.04 }}
        exitTo={{ y: 0, blur: 18, scale: 1.02 }}
        easing="enterSoft"
      />
    </AbsoluteFill>
  );
};

/** Texto na voz da identidade (grotesca bold itálica, espaçamento largo). */
export const TextoMarca: React.FC<
  {
    texto: string;
    de: number;
    ate?: number;
    size?: number;
    color?: string;
    tracking?: string;
    by?: "char" | "word";
  } & {
    align?: "left" | "center" | "right";
    maxWidth?: number;
    lineHeight?: number;
    stagger?: number;
    weight?: number;
  }
> = ({
  texto,
  de,
  ate,
  size = 40,
  color = COR.marfim,
  tracking = "0.4em",
  by = "char",
  align = "center",
  maxWidth,
  lineHeight = 1.15,
  stagger,
  weight = 800,
}) => {
  const rel = useRel();
  return (
    <TextReveal
      text={texto}
      by={by}
      direction={by === "char" && align === "center" ? "center" : "start"}
      delay={rel(de)}
      exitAt={ate !== undefined ? rel(ate) - 0.35 : undefined}
      exitDuration={0.35}
      duration={0.6}
      stagger={stagger ?? (by === "char" ? 0.03 : 0.1)}
      size={size}
      font="body"
      weight={weight}
      tracking={tracking}
      color={color}
      align={align}
      maxWidth={maxWidth}
      lineHeight={lineHeight}
      from={{ y: 0, blur: 14, scale: 1.0 }}
      style={{ fontStyle: "italic" }}
    />
  );
};

/** Asterisco de 8 hastes da estampa 2027 (Mystic Navy), desenhado em vetor. */
export const Asterisco: React.FC<{
  size: number;
  color?: string;
  stroke?: number;
}> = ({ size, color = COR.navy, stroke = 0.045 }) => (
  <svg
    width={size}
    height={size}
    viewBox="-1 -1 2 2"
    style={{ overflow: "visible" }}
  >
    {[0, 45, 90, 135].map((a) => (
      <line
        key={a}
        x1={-Math.cos((a * Math.PI) / 180)}
        y1={-Math.sin((a * Math.PI) / 180)}
        x2={Math.cos((a * Math.PI) / 180)}
        y2={Math.sin((a * Math.PI) / 180)}
        stroke={color}
        strokeWidth={stroke * 2}
      />
    ))}
  </svg>
);

/** Estrela de 4 pontas alongada da estampa 2027 (Mystic Navy), desenhada em vetor. */
export const Brilho: React.FC<{ size: number; color?: string }> = ({
  size,
  color = COR.navy,
}) => (
  <svg
    width={size * 0.5}
    height={size}
    viewBox="-0.5 -1 1 2"
    style={{ overflow: "visible" }}
  >
    <path
      d="M0,-1 C0.03,-0.2 0.08,-0.08 0.5,0 C0.08,0.08 0.03,0.2 0,1 C-0.03,0.2 -0.08,0.08 -0.5,0 C-0.08,-0.08 -0.03,-0.2 0,-1 Z"
      fill={color}
    />
  </svg>
);

/** Lettering oficial ARREPENDEI-VOS (imagem do PDF, sem alteração de forma ou cor). */
export const Lettering: React.FC<{
  altura: number;
  style?: React.CSSProperties;
}> = ({ altura, style }) => {
  const { px } = useLayout();
  const [w, h] = IMG.lettering.size;
  return (
    <Img
      src={IMG.lettering.src}
      style={{
        height: px(altura),
        width: (px(altura) * w) / h,
        display: "block",
        ...style,
      }}
    />
  );
};

/** Halo de luz quente atrás de um elemento (para o lettering sobre o escuro). */
export const Halo: React.FC<{
  size: number;
  intensidade?: number;
  cores?: [string, string];
}> = ({ size, intensidade = 1, cores = [COR.ouro, COR.vinho] }) => {
  const m = useMotion();
  const s = m.px(size);
  return (
    <div
      style={{
        position: "absolute",
        width: s,
        height: s * 0.8,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(ellipse at center, ${cores[0]} 0%, ${cores[1]} 38%, transparent 70%)`,
        opacity: 0.55 * intensidade,
        mixBlendMode: "screen",
      }}
    />
  );
};

/** Gradação de cor por camadas (sobre um plano): tingimento, sombra e contraste. */
export const Grade: React.FC<{
  cor?: string;
  forca?: number;
  escurecer?: number;
  quente?: number;
}> = ({ cor = COR.navy, forca = 0.5, escurecer = 0, quente = 0 }) => (
  <>
    {forca > 0 ? (
      <AbsoluteFill
        style={{ background: cor, mixBlendMode: "soft-light", opacity: forca }}
      />
    ) : null}
    {quente > 0 ? (
      <AbsoluteFill
        style={{
          background: COR.ouro,
          mixBlendMode: "overlay",
          opacity: quente,
        }}
      />
    ) : null}
    {escurecer > 0 ? (
      <AbsoluteFill style={{ background: "#000", opacity: escurecer }} />
    ) : null}
  </>
);

/** Tremor de câmera que decai (impactos). */
export const useTremor = (abs: number, forca = 14, duracao = 0.45) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = useRel();
  const { px } = useLayout();
  const d = frame / fps - rel(abs);
  if (d < 0 || d > duracao) return "translate(0px, 0px)";
  const k = (1 - d / duracao) ** 2;
  return `translate(${px(Math.sin(d * 90) * forca * k)}px, ${px(Math.cos(d * 73) * forca * 0.7 * k)}px)`;
};
