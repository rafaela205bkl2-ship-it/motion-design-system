/**
 * TypeOn — texto "digitado" letra a letra, com cursor em barra.
 *
 * Origem: ref-aline-03 (peça de app de viagens, 3,0–3,5 s): a frase surge
 * caractere a caractere com um cursor colorido à frente; o cursor pisca
 * enquanto a frase fica parada. Aqui o ritmo é constante (cps) e o cursor
 * pisca por cálculo de quadro (sem CSS animation).
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { useMotion } from "../MotionProvider";

export type TypeOnProps = {
  /** Texto. `*palavras*` recebem a cor de destaque; `\n` quebra a linha. */
  readonly text: string;
  /** Início, em segundos. */
  readonly delay?: number;
  /** Caracteres por segundo (antes da velocidade do tema). */
  readonly cps?: number;
  /** Mostra o cursor em barra. */
  readonly cursor?: boolean;
  readonly cursorColor?: string;
  /** Some com o cursor depois deste tempo (segundos). Omitido = fica piscando. */
  readonly cursorHideAt?: number;
  /** Tamanho da fonte em px de design. */
  readonly size?: number;
  readonly font?: "display" | "body";
  readonly fontFamily?: string;
  readonly weight?: number;
  readonly color?: string;
  readonly highlightColor?: string;
  readonly lineHeight?: number;
  readonly tracking?: string;
  readonly align?: "left" | "center" | "right";
  readonly maxWidth?: number;
  readonly speed?: number;
  readonly style?: React.CSSProperties;
};

type Piece = { ch: string; hl: boolean };

const parse = (text: string): Piece[] => {
  const out: Piece[] = [];
  let hl = false;
  for (const ch of Array.from(text)) {
    if (ch === "*") {
      hl = !hl;
      continue;
    }
    out.push({ ch, hl });
  }
  return out;
};

/** Duração total da digitação, em segundos (útil para encadear eventos). */
export const getTypeOnDuration = (text: string, cps = 22, speed = 1) =>
  parse(text).length / (cps * speed);

export const TypeOn: React.FC<TypeOnProps> = ({
  text,
  delay = 0,
  cps = 22,
  cursor = true,
  cursorColor,
  cursorHideAt,
  size = 96,
  font = "display",
  fontFamily,
  weight,
  color,
  highlightColor,
  lineHeight = 1.08,
  tracking,
  align = "left",
  maxWidth,
  speed = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const t = frame / m.fps - delay;
  const pieces = parse(text);
  const rate = cps * m.speed * speed;
  const shown = Math.max(0, Math.min(pieces.length, Math.floor(t * rate)));
  const typing = shown < pieces.length;
  // pisca a ~1,9 Hz quando parado; aceso enquanto digita
  const blinkOn = typing || Math.floor(t * 3.8) % 2 === 0;
  const showCursor =
    cursor && t >= 0 && blinkOn && (cursorHideAt === undefined || t + delay < cursorHideAt);
  const ink = color ?? m.palette.ink;
  const hlc = highlightColor ?? m.palette.accent;

  return (
    <div
      style={{
        fontFamily:
          fontFamily ?? (font === "display" ? m.theme.fonts.display : m.theme.fonts.body),
        fontWeight: weight ?? (font === "display" ? m.theme.weights.display : m.theme.weights.body),
        fontSize: m.px(size),
        lineHeight,
        letterSpacing: tracking ?? (font === "display" ? m.theme.displayTracking : undefined),
        color: ink,
        textAlign: align,
        maxWidth: maxWidth ? m.px(maxWidth) : undefined,
        whiteSpace: "pre-wrap",
        ...style,
      }}
    >
      {pieces.slice(0, shown).map((p, i) =>
        p.ch === "\n" ? (
          <br key={i} />
        ) : (
          <span key={i} style={{ color: p.hl ? hlc : undefined }}>
            {p.ch}
          </span>
        ),
      )}
      {showCursor ? (
        <span
          style={{
            display: "inline-block",
            width: "0.09em",
            height: "0.95em",
            marginLeft: "0.04em",
            verticalAlign: "-0.1em",
            background: cursorColor ?? hlc,
          }}
        />
      ) : null}
    </div>
  );
};
