/**
 * Elementos recorrentes da identidade (observados no carrossel da cliente):
 * - fundo marinho texturizado (granulação forte) ou azul-claro liso com grão;
 * - cabeçalho "by  ALINE  BARBOSA  serviço  CONTABILIDADE" nas telas claras;
 * - etiqueta "Prazer, Aline Barbosa" + monograma no topo das telas escuras;
 * - cantoneiras de linha fina em "L".
 * Tudo em px de design (useMotion().px) e tempo em segundos.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop, DrawPath, TextReveal, progressAt, useMotion } from "../../../motion";
import { LetrasAB } from "./Logo";
import { COR, FONTE_SERIFADA, FONTE_TEXTO } from "./tema";

/** Posiciona filhos em coordenadas de design (canto superior esquerdo ou centro). */
export const Pos: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly centro?: boolean;
  readonly w?: number;
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ x, y, centro = false, w, children, style }) => {
  const m = useMotion();
  return (
    <div
      style={{
        position: "absolute",
        left: m.px(x),
        top: m.px(y),
        width: w ? m.px(w) : undefined,
        transform: centro ? "translate(-50%, -50%)" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Fundo da marca: marinho texturizado ou azul-claro. */
export const Fundo: React.FC<{ readonly tipo: "marinho" | "claro"; readonly children?: React.ReactNode }> = ({
  tipo,
  children,
}) =>
  tipo === "marinho" ? (
    <Backdrop
      color={COR.marinho}
      glows={[
        { x: 0.25, y: 0.2, size: 1400, color: "#1F4566", opacity: 0.55 },
        { x: 0.85, y: 0.85, size: 1200, color: COR.marinhoFundo, opacity: 0.8 },
      ]}
      vignette={0.32}
      grain={0.22}
    >
      {children}
    </Backdrop>
  ) : (
    <Backdrop
      color={COR.azul}
      glows={[
        { x: 0.3, y: 0.25, size: 1500, color: "#C3D6E9", opacity: 0.7 },
        { x: 0.8, y: 0.9, size: 1100, color: "#94B1CF", opacity: 0.5 },
      ]}
      vignette={0.12}
      grain={0.14}
    >
      {children}
    </Backdrop>
  );

/** Cabeçalho das telas claras do carrossel. */
export const Cabecalho: React.FC<{ readonly delay?: number; readonly cor?: string }> = ({
  delay = 0.1,
  cor = COR.tinta,
}) => {
  const m = useMotion();
  const itens: { t: string; serif?: boolean }[] = [
    { t: "by", serif: true },
    { t: "ALINE" },
    { t: "BARBOSA" },
    { t: "serviço", serif: true },
    { t: "CONTABILIDADE" },
  ];
  return (
    <div
      style={{
        position: "absolute",
        top: m.px(150),
        left: m.px(90),
        right: m.px(90),
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
      }}
    >
      {itens.map((it, i) => (
        <TextReveal
          key={it.t}
          text={it.t}
          by="word"
          delay={delay + i * 0.06}
          size={it.serif ? 30 : 25}
          color={cor}
          tracking={it.serif ? "0em" : "0.02em"}
          style={{ fontFamily: it.serif ? FONTE_SERIFADA : FONTE_TEXTO, fontWeight: 400 }}
        />
      ))}
    </div>
  );
};

/** Etiqueta do topo das telas escuras: "Prazer, Aline Barbosa" + monograma. */
export const EtiquetaTopo: React.FC<{ readonly delay?: number; readonly cor?: string }> = ({
  delay = 0.1,
  cor = COR.gelo,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const p = progressAt(frame, m.fps, delay + 0.1, 0.4, "enter");
  return (
    <>
      <div style={{ position: "absolute", top: m.px(150), left: m.px(90) }}>
        <TextReveal
          text="*Prazer,* Aline Barbosa"
          by="word"
          delay={delay}
          size={30}
          color={cor}
          highlightColor={cor}
          tracking="0em"
          style={{ fontFamily: FONTE_TEXTO, fontWeight: 400 }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: m.px(120),
          right: m.px(90),
          opacity: p,
          transform: `translateY(${m.px((1 - p) * 20)}px)`,
        }}
      >
        <LetrasAB altura={92} cor={cor} />
      </div>
    </>
  );
};

/** Cantoneira de linha fina em "L" (detalhe do carrossel). */
export const Cantoneira: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly delay?: number;
  readonly cor?: string;
  /** Orientação: "baixo" = linha vertical que dobra para a direita embaixo. */
  readonly forma?: "baixo" | "cima";
}> = ({ x, y, w, h, delay = 0.2, cor = COR.tinta, forma = "baixo" }) => {
  const m = useMotion();
  const d = forma === "baixo" ? `M1 1 L1 ${h - 1} L${w} ${h - 1}` : `M0 1 L${w - 1} 1 L${w - 1} ${h}`;
  return (
    <svg
      width={m.px(w)}
      height={m.px(h)}
      viewBox={`0 0 ${w} ${h}`}
      style={{ position: "absolute", left: m.px(x), top: m.px(y), overflow: "visible" }}
    >
      <DrawPath d={d} delay={delay} duration={0.6} stroke={cor} strokeWidth={2.4} linecap="butt" />
    </svg>
  );
};

/** Camada que preenche a cena (atalho). */
export const Cena: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>{children}</AbsoluteFill>
);
