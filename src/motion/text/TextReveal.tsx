import React, { useMemo } from "react";
import { random, useCurrentFrame } from "remotion";
import type { EasingInput } from "../easing";
import { progressAt, useMotion, type TimeValue } from "../MotionProvider";
import type { StaggerToken } from "../tokens";

export type RevealDirection = "start" | "end" | "center" | "edges" | "random";

/** Estado inicial (entrada) ou final (saída) de cada unidade. Distâncias em px de design. */
export type RevealState = {
  x?: number;
  y?: number;
  scale?: number;
  blur?: number;
  rotate?: number;
};

export type TextRevealProps = {
  /** Texto. `*palavras*` recebem a cor de destaque; `\n` quebra a linha. */
  readonly text: string;
  /** Unidade de animação. */
  readonly by?: "char" | "word";
  /** Ordem em que as unidades aparecem. */
  readonly direction?: RevealDirection;
  /** Início, em segundos, relativo à sequência. */
  readonly delay?: number;
  /** Duração de cada unidade (segundos ou token). */
  readonly duration?: TimeValue;
  /** Intervalo entre unidades (segundos ou token). */
  readonly stagger?: number | StaggerToken;
  readonly easing?: EasingInput;
  /** Estado inicial. Padrão: desfocado, deslocado para baixo. */
  readonly from?: RevealState;
  /** Multiplica desfoque e distâncias desta instância. */
  readonly intensity?: number;
  /** Multiplica a velocidade desta instância. */
  readonly speed?: number;

  /** Início da saída, em segundos. Omitido = sem saída. */
  readonly exitAt?: number;
  readonly exitDuration?: TimeValue;
  /** 'all' = todas as unidades juntas; 'unit' = escalonado. */
  readonly exitBy?: "all" | "unit";
  readonly exitDirection?: RevealDirection;
  readonly exitStagger?: number | StaggerToken;
  readonly exitTo?: RevealState;
  readonly exitEasing?: EasingInput;

  /** Tamanho da fonte em px de design. */
  readonly size?: number;
  readonly font?: "display" | "body";
  readonly weight?: number;
  readonly color?: string;
  readonly highlightColor?: string;
  readonly lineHeight?: number;
  readonly tracking?: string;
  readonly align?: "left" | "center" | "right";
  /** Largura máxima em px de design. */
  readonly maxWidth?: number;
  readonly uppercase?: boolean;
  readonly as?: "div" | "h1" | "h2" | "h3" | "p" | "span";
  readonly style?: React.CSSProperties;
};

type Unit = { text: string; highlight: boolean };
type Word = { units: Unit[]; highlight: boolean };
type Line = Word[];

const parse = (
  text: string,
  by: "char" | "word",
): { lines: Line[]; count: number } => {
  let highlight = false;
  let count = 0;
  const lines = text.split("\n").map((line) =>
    line
      .split(/\s+/)
      .filter(Boolean)
      .map((raw) => {
        const starts = raw.startsWith("*");
        if (starts) highlight = true;
        const isHl = highlight;
        if (/\*[.,!?:;…]*$/.test(raw)) highlight = false;
        const clean = raw.replace(/\*/g, "");
        const units =
          by === "char"
            ? Array.from(clean).map((c) => ({ text: c, highlight: isHl }))
            : [{ text: clean, highlight: isHl }];
        count += units.length;
        return { units, highlight: isHl };
      }),
  );
  return { lines, count };
};

/** Converte índice → posição na ordem de animação (0 = primeiro). */
const makeOrder = (
  n: number,
  direction: RevealDirection,
  seed: string,
): number[] => {
  const idx = Array.from({ length: n }, (_, i) => i);
  const mid = (n - 1) / 2;
  const key = (i: number) => {
    switch (direction) {
      case "end":
        return n - 1 - i;
      case "center":
        return Math.abs(i - mid);
      case "edges":
        return mid - Math.abs(i - mid);
      case "random":
        return random(`${seed}-${i}`);
      default:
        return i;
    }
  };
  const sorted = [...idx].sort((a, b) => key(a) - key(b) || a - b);
  const order = new Array<number>(n);
  sorted.forEach((unitIndex, rank) => {
    order[unitIndex] =
      direction === "center" || direction === "edges"
        ? Math.round(key(unitIndex))
        : rank;
  });
  return order;
};

/** Tempo total (s) da entrada, útil para encadear eventos. */
export const getRevealDuration = (
  unitCount: number,
  unitDuration: number,
  staggerSeconds: number,
) => unitDuration + Math.max(0, unitCount - 1) * staggerSeconds;

/**
 * Revelação de texto por letra ou palavra, com opacidade, desfoque,
 * deslocamento e escala — e saída opcional em desfoque.
 */
export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  by = "char",
  direction = "start",
  delay = 0,
  duration = "reveal",
  stagger,
  easing = "enter",
  from,
  intensity = 1,
  speed = 1,
  exitAt,
  exitDuration = "swap",
  exitBy = "all",
  exitDirection = "start",
  exitStagger,
  exitTo,
  exitEasing = "exit",
  size = 96,
  font = "display",
  weight,
  color,
  highlightColor,
  lineHeight = 1.05,
  tracking,
  align = "center",
  maxWidth,
  uppercase = false,
  as: Tag = "div",
  style,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const { lines, count } = useMemo(() => parse(text, by), [text, by]);
  const order = useMemo(
    () => makeOrder(count, direction, text),
    [count, direction, text],
  );
  const exitOrder = useMemo(
    () => makeOrder(count, exitDirection, `${text}-x`),
    [count, exitDirection, text],
  );

  const unitDur = m.dur(duration, speed);
  const stag = m.stag(stagger ?? (by === "char" ? "char" : "word"), speed);
  const exitDur = m.dur(exitDuration, speed);
  const exitStag = m.stag(exitStagger ?? "char", speed) * 0.5;

  const f = {
    x: from?.x ?? 0,
    y: from?.y ?? 38,
    scale: from?.scale ?? 1,
    blur: from?.blur ?? 18,
    rotate: from?.rotate ?? 0,
  };
  const t = {
    x: exitTo?.x ?? 0,
    y: exitTo?.y ?? -18,
    scale: exitTo?.scale ?? 1.02,
    blur: exitTo?.blur ?? 16,
    rotate: exitTo?.rotate ?? 0,
  };

  const k = intensity;
  let i = -1;
  const isWord = by === "word";

  const renderUnit = (u: Unit, key: string) => {
    i += 1;
    const p = progressAt(
      frame,
      m.fps,
      delay + order[i] * stag,
      unitDur,
      easing,
    );
    const e =
      exitAt === undefined
        ? 0
        : progressAt(
            frame,
            m.fps,
            exitAt + (exitBy === "unit" ? exitOrder[i] * exitStag : 0),
            exitDur,
            exitEasing,
          );
    const opacity = p * (1 - e);
    const blurPx = m.blur((1 - p) * f.blur + e * t.blur, k);
    const x = m.dist((1 - p) * f.x + e * t.x, k);
    const y = m.dist((1 - p) * f.y + e * t.y, k);
    const scale = (f.scale + (1 - f.scale) * p) * (1 + (t.scale - 1) * e);
    const rotate = (1 - p) * f.rotate + e * t.rotate;
    return (
      <span
        key={key}
        style={{
          display: "inline-block",
          whiteSpace: "pre",
          opacity,
          filter: blurPx > 0.05 ? `blur(${blurPx}px)` : undefined,
          translate: `${x}px ${y}px`,
          scale: String(scale),
          rotate: rotate ? `${rotate}deg` : undefined,
          color: u.highlight ? (highlightColor ?? m.palette.accent) : undefined,
          willChange: "opacity, filter, translate",
        }}
      >
        {u.text}
      </span>
    );
  };

  return (
    <Tag
      style={{
        margin: 0,
        fontFamily:
          font === "display" ? m.theme.fonts.display : m.theme.fonts.body,
        fontWeight:
          weight ??
          (font === "display" ? m.theme.weights.display : m.theme.weights.body),
        fontSize: m.px(size),
        lineHeight,
        letterSpacing:
          tracking ?? (font === "display" ? m.theme.displayTracking : "0em"),
        color: color ?? m.palette.ink,
        textAlign: align,
        textTransform: uppercase ? "uppercase" : undefined,
        maxWidth: maxWidth ? m.px(maxWidth) : undefined,
        fontKerning: "normal",
        ...style,
      }}
    >
      {lines.map((line, li) => (
        <span key={li} style={{ display: "block" }}>
          {line.map((word, wi) => (
            <React.Fragment key={wi}>
              {isWord ? (
                renderUnit(word.units[0], `${li}-${wi}`)
              ) : (
                <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                  {word.units.map((u, ci) =>
                    renderUnit(u, `${li}-${wi}-${ci}`),
                  )}
                </span>
              )}
              {wi < line.length - 1 ? " " : null}
            </React.Fragment>
          ))}
        </span>
      ))}
    </Tag>
  );
};
