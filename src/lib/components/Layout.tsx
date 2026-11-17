import type React from "react";
import { useLayout, type PerFormat } from "../layout";

type Align = "flex-start" | "center" | "flex-end" | "stretch";

/**
 * Preenche a tela respeitando a área segura do formato atual.
 * Por padrão centraliza o conteúdo nos três formatos.
 */
export const SafeArea: React.FC<{
  readonly children: React.ReactNode;
  readonly align?: PerFormat<Align> | Align;
  readonly justify?: PerFormat<Align> | Align;
  readonly style?: React.CSSProperties;
}> = ({ children, align = "center", justify = "center", style }) => {
  const { safe, pick } = useLayout();
  const resolve = (v: PerFormat<Align> | Align) =>
    typeof v === "string" ? v : pick(v);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        boxSizing: "border-box",
        paddingLeft: safe.x,
        paddingRight: safe.x,
        paddingTop: safe.top,
        paddingBottom: safe.bottom,
        display: "flex",
        flexDirection: "column",
        alignItems: resolve(align),
        justifyContent: resolve(justify),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Flexbox que muda de direção conforme o formato.
 * Padrão: coluna no vertical e no quadrado, linha no horizontal.
 */
export const Stack: React.FC<{
  readonly children: React.ReactNode;
  readonly direction?: PerFormat<
    "row" | "column" | "row-reverse" | "column-reverse"
  >;
  /** Espaçamento em pixels de design (base 1080). */
  readonly gap?: PerFormat<number> | number;
  readonly align?: PerFormat<Align> | Align;
  readonly justify?:
    | PerFormat<Align | "space-between">
    | Align
    | "space-between";
  readonly textAlign?: PerFormat<"left" | "center"> | "left" | "center";
  readonly style?: React.CSSProperties;
}> = ({
  children,
  direction = { vertical: "column", horizontal: "row", square: "column" },
  gap = 40,
  align = "center",
  justify = "center",
  textAlign = "center",
  style,
}) => {
  const { pick, px } = useLayout();
  const resolve = <T,>(v: PerFormat<T> | T): T =>
    typeof v === "object" && v !== null && "vertical" in v
      ? pick(v as PerFormat<T>)
      : (v as T);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: pick(direction),
        gap: px(resolve(gap)),
        alignItems: resolve(align),
        justifyContent: resolve(justify),
        textAlign: resolve(textAlign),
        width: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Grade com número de colunas por formato. */
export const Grid: React.FC<{
  readonly children: React.ReactNode;
  readonly columns?: PerFormat<number>;
  readonly gap?: number;
  readonly style?: React.CSSProperties;
}> = ({
  children,
  columns = { vertical: 1, horizontal: 3, square: 1 },
  gap = 32,
  style,
}) => {
  const { pick, px } = useLayout();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${pick(columns)}, minmax(0, 1fr))`,
        gap: px(gap),
        width: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
