/**
 * Device3D — celular com espessura real: moldura metálica empilhada em camadas no eixo Z,
 * tampa traseira, tela com reflexo que corre conforme o giro, e ilha frontal.
 * A tela NÃO recorta o conteúdo em 3D (sem overflow hidden), então elementos da interface
 * podem "sair da tela" com translateZ.
 *
 * Origem: ref-aline-03 (6,0–9,5 s e 10,0–12,0 s) e ref-aline-01 (0–1,5 s): o aparelho gira
 * mostrando a lateral metálica, a câmera entra na tela e um cartão da interface se solta
 * e vem na direção de quem assiste. Use dentro de um contêiner com `perspective`
 * (por exemplo, `Tilt3D`) e passe a rotação atual em `rotateY` para o reflexo acompanhar.
 */
import React from "react";
import { useMotion } from "../MotionProvider";

export type Device3DProps = {
  /** Largura e altura da TELA, em px de design. */
  readonly width?: number;
  readonly height?: number;
  /** Borda preta em volta da tela (px de design). */
  readonly bezel?: number;
  /** Raio dos cantos do corpo (px de design). */
  readonly radius?: number;
  /** Espessura do aparelho (px de design). */
  readonly depth?: number;
  /** Cores da lateral metálica (claro → escuro). */
  readonly metal?: [string, string];
  readonly screenColor?: string;
  /** Rotação Y atual (graus), para mover o reflexo. */
  readonly rotateY?: number;
  readonly island?: boolean;
  readonly children?: React.ReactNode;
};

export const Device3D: React.FC<Device3DProps> = ({
  width = 520,
  height = 1060,
  bezel = 22,
  radius = 96,
  depth = 34,
  metal = ["#E7EDF3", "#7E8C99"],
  screenColor = "#F4F7FA",
  rotateY = 0,
  island = true,
  children,
}) => {
  const m = useMotion();
  const W = m.px(width + bezel * 2);
  const H = m.px(height + bezel * 2);
  const r = m.px(radius);
  const slices = 12;
  const step = m.px(depth) / slices;
  const shine = 50 + rotateY * 1.6;
  const corpo: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    width: W,
    height: H,
    borderRadius: r,
  };
  return (
    <div style={{ position: "relative", width: W, height: H, transformStyle: "preserve-3d" }}>
      {/* lateral metálica: camadas empilhadas atrás da frente */}
      {Array.from({ length: slices }, (_, i) => (
        <div
          key={i}
          style={{
            ...corpo,
            transform: `translateZ(${-(i + 1) * step}px)`,
            background: `linear-gradient(${90 + rotateY}deg, ${metal[1]}, ${metal[0]} ${shine}%, ${metal[1]})`,
          }}
        />
      ))}
      {/* tampa traseira */}
      <div style={{ ...corpo, transform: `translateZ(${-(slices + 1) * step}px)`, background: "#1A2633" }} />
      {/* frente: aro metálico + vidro preto */}
      <div
        style={{
          ...corpo,
          background: `linear-gradient(${120 + rotateY}deg, ${metal[0]}, ${metal[1]})`,
          transform: "translateZ(0px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: m.px(4),
          top: m.px(4),
          width: W - m.px(8),
          height: H - m.px(8),
          borderRadius: r - m.px(4),
          background: "#05101A",
          transform: "translateZ(0.5px)",
        }}
      />
      {/* tela */}
      <div
        style={{
          position: "absolute",
          left: m.px(bezel),
          top: m.px(bezel),
          width: m.px(width),
          height: m.px(height),
          borderRadius: r - m.px(bezel),
          background: screenColor,
          transform: "translateZ(1px)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
        {island ? (
          <div
            style={{
              position: "absolute",
              top: m.px(22),
              left: "50%",
              transform: "translateX(-50%) translateZ(1px)",
              width: m.px(width * 0.3),
              height: m.px(40),
              borderRadius: m.px(20),
              background: "#05101A",
            }}
          />
        ) : null}
        {/* reflexo do vidro, corre com o giro */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: r - m.px(bezel),
            background: `linear-gradient(115deg, transparent ${shine - 22}%, rgba(255,255,255,.22) ${shine - 8}%, transparent ${shine + 6}%)`,
            transform: "translateZ(2px)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};
