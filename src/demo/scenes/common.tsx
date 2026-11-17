import React from "react";

/**
 * Posiciona o filho centralizado num ponto (fração da tela).
 * A caixa ocupa a largura inteira e é deslocada no eixo x — assim o
 * texto tem a tela toda para quebrar linha, e não só metade dela.
 */
export const At: React.FC<{
  readonly x?: number;
  readonly y: number;
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ x = 0.5, y, children, style }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      width: "100%",
      top: `${y * 100}%`,
      translate: `${(x - 0.5) * 100}% -50%`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      ...style,
    }}
  >
    {children}
  </div>
);
