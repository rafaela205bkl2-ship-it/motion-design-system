/**
 * Peças da versão 2 (60 s): campos de cor da paleta, tipografia gigante cinética,
 * objeto que entra deslizando (ref-003) e lampejos. Tudo sobre a biblioteca src/motion.
 */
import React from "react";
import { AbsoluteFill, Img, interpolate } from "remotion";
import { TextReveal, TextStrike, useLayout } from "../../../motion";
import { COR, FONTES, OBJ, type ObjNome } from "../marca";
import { useAbs, useRel } from "../tempo";

/** Campo de cor chapada com leve brilho central (nunca liso). */
export const Campo: React.FC<{
  cor: string;
  brilho?: string;
  forca?: number;
  children?: React.ReactNode;
}> = ({ cor, brilho = "rgba(255,255,255,0.10)", forca = 1, children }) => (
  <AbsoluteFill style={{ background: cor }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 45%, ${brilho} 0%, transparent 65%)`,
        opacity: forca,
      }}
    />
    {children}
  </AbsoluteFill>
);

/**
 * Palavra gigante, cortada pelas bordas, entrando letra a letra e deslizando devagar
 * (ref-003, 59,5–61,5 s e 76,5–80 s).
 */
export const TipoGigante: React.FC<{
  texto: string;
  de: number;
  ate: number;
  size?: number;
  color?: string;
  voz?: "marca" | "filme";
  deriva?: number;
  y?: number;
  x?: number;
  risco?: number;
  corRisco?: string;
  tracking?: string;
}> = ({
  texto,
  de,
  ate,
  size = 300,
  color = COR.marfim,
  voz = "marca",
  deriva = -40,
  y = 0,
  x = 0,
  risco,
  corRisco = COR.vermelho,
  tracking,
}) => {
  const rel = useRel();
  const abs = useAbs();
  const { px } = useLayout();
  const desliza = px(deriva * (abs - de));
  const conteudo = (
    <TextReveal
      text={texto}
      by="char"
      delay={rel(de)}
      duration={0.28}
      stagger={0.022}
      exitAt={rel(ate) - 0.1}
      exitDuration={0.1}
      size={size}
      font={voz === "marca" ? "body" : "display"}
      weight={voz === "marca" ? 800 : 500}
      tracking={tracking ?? (voz === "marca" ? "0.0em" : "0.04em")}
      lineHeight={0.9}
      color={color}
      from={{ x: 70, y: 0, blur: 14 }}
      exitTo={{ x: -40, y: 0, blur: 10 }}
      easing="enterStrong"
      style={{
        fontStyle: voz === "marca" ? "italic" : "normal",
        whiteSpace: "nowrap",
        fontFamily: voz === "marca" ? FONTES.marca : FONTES.filme,
      }}
    />
  );
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div style={{ transform: `translate(${desliza + px(x)}px, ${px(y)}px)` }}>
        {risco !== undefined ? (
          <TextStrike
            at={rel(risco)}
            color={corRisco}
            thickness={size * 0.06}
            y={0.5}
            dimTo={0.55}
            duration={0.25}
          >
            {conteudo}
          </TextStrike>
        ) : (
          conteudo
        )}
      </div>
    </AbsoluteFill>
  );
};

/** Objeto recortado em escala por altura (px de design). */
export const Objeto: React.FC<{
  nome: ObjNome;
  altura: number;
  style?: React.CSSProperties;
  sombra?: boolean;
}> = ({ nome, altura, style, sombra = true }) => {
  const { px } = useLayout();
  const [w, h] = OBJ[nome].size;
  return (
    <Img
      src={OBJ[nome].src}
      style={{
        height: px(altura),
        width: (px(altura) * w) / h,
        display: "block",
        filter: sombra
          ? `drop-shadow(0 ${px(30)}px ${px(40)}px rgba(0,0,0,0.45))`
          : undefined,
        ...style,
      }}
    />
  );
};

/**
 * Objeto que entra pela direita com desfoque de movimento, assenta, e sai pela esquerda
 * quando o próximo chega (substituição rápida mantendo a composição — ref-003, 3,9–9,9 s).
 */
export const ObjetoDesliza: React.FC<{
  nome: ObjNome;
  de: number;
  ate: number;
  altura?: number;
  x?: number;
  rotulo?: string;
}> = ({ nome, de, ate, altura = 620, x = 180, rotulo }) => {
  const abs = useAbs();
  const { px } = useLayout();
  const entra = interpolate(abs, [de, de + 0.18], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - (1 - t) ** 3,
  });
  const sai = interpolate(abs, [ate - 0.08, ate], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (abs < de || abs > ate) return null;
  const dx = px(900) * entra - px(700) * sai;
  const blur = (entra > 0.02 ? entra * 18 : 0) + sai * 14;
  const flutua = Math.sin((abs - de) * 3) * px(6);
  const rot = 6 * entra - 4 * sai;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          transform: `translate(${px(x) + dx}px, ${flutua}px) rotate(${rot}deg)`,
          filter: blur > 0.2 ? `blur(${px(blur)}px)` : undefined,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: px(28),
        }}
      >
        <Objeto nome={nome} altura={altura} />
        {rotulo ? (
          <div
            style={{
              fontFamily: FONTES.marca,
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: px(16),
              letterSpacing: "0.32em",
              color: COR.marfim,
              opacity: 0.8,
              whiteSpace: "nowrap",
            }}
          >
            {rotulo}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/** Mostra o filho só dentro de [de, ate) — para cortes secos. */
export const Janela: React.FC<{
  de: number;
  ate: number;
  children: React.ReactNode;
}> = ({ de, ate, children }) => {
  const abs = useAbs();
  return abs >= de && abs < ate ? <>{children}</> : null;
};
