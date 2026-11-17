import type React from "react";
import { Interactive } from "remotion";
import { useEntrance, type EntrancePreset } from "../animations";
import { useLayout } from "../layout";
import { theme } from "../theme";
import { entranceSchema, sizeField } from "./schema";

const Word: React.FC<{
  readonly children: string;
  readonly delay: number;
  readonly preset: EntrancePreset;
}> = ({ children, delay, preset }) => {
  const style = useEntrance({ delay, preset, duration: 0.9 });
  return <span style={{ display: "inline-block", ...style }}>{children}</span>;
};

type TitleProps = {
  readonly children: string;
  readonly size?: number;
  readonly color?: string;
  readonly highlight?: string;
  readonly delay?: number;
  readonly preset?: EntrancePreset;
  readonly stagger?: number;
  readonly style?: React.CSSProperties;
};

/**
 * Título com entrada palavra por palavra.
 * Palavras envoltas em *asteriscos* recebem a cor de destaque.
 */
const TitleInner: React.FC<TitleProps> = ({
  children,
  size = 110,
  color = theme.text,
  highlight = theme.accent2,
  delay = 0,
  preset = "fade-up",
  stagger = 0.07,
  style,
}) => {
  const { px } = useLayout();
  const words = children.split(/\s+/).filter(Boolean);
  let inHighlight = false;

  return (
    <h1
      style={{
        margin: 0,
        fontFamily: theme.fontFamily,
        fontSize: px(size),
        fontWeight: 800,
        lineHeight: 1.04,
        letterSpacing: "-0.03em",
        color,
        ...style,
      }}
    >
      {words.map((word, i) => {
        // Suporta destaque de várias palavras: "*em movimento*"
        if (word.startsWith("*")) inHighlight = true;
        const isHighlight = inHighlight;
        if (/\*[.,!?:;]?$/.test(word)) inHighlight = false;
        const clean = word.replace(/\*/g, "");
        return (
          <span key={i} style={{ color: isHighlight ? highlight : undefined }}>
            <Word delay={delay + i * stagger} preset={preset}>
              {clean}
            </Word>
            {i < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </h1>
  );
};

export const Title = Interactive.create({
  Component: TitleInner,
  layout: "none",
  schema: {
    children: {
      type: "string",
      default: "Título",
      description: "Texto (*destaque*)",
    },
    size: sizeField(110),
    color: { type: "color", default: theme.text, description: "Cor" },
    highlight: {
      type: "color",
      default: theme.accent2,
      description: "Cor de destaque",
    },
    ...entranceSchema(),
  },
});

type ParagraphProps = {
  readonly children: string;
  readonly size?: number;
  readonly color?: string;
  readonly maxWidth?: number;
  readonly delay?: number;
  readonly preset?: EntrancePreset;
  readonly style?: React.CSSProperties;
};

const ParagraphInner: React.FC<ParagraphProps> = ({
  children,
  size = 46,
  color = theme.muted,
  maxWidth = 900,
  delay = 0,
  preset = "fade-up",
  style,
}) => {
  const { px } = useLayout();
  const entrance = useEntrance({ delay, preset });
  return (
    <p
      style={{
        margin: 0,
        fontFamily: theme.fontFamily,
        fontSize: px(size),
        fontWeight: 400,
        lineHeight: 1.35,
        color,
        maxWidth: px(maxWidth),
        ...style,
      }}
    >
      <span style={{ display: "inline-block", ...entrance }}>{children}</span>
    </p>
  );
};

export const Paragraph = Interactive.create({
  Component: ParagraphInner,
  layout: "none",
  schema: {
    children: {
      type: "string",
      default: "Texto de apoio",
      description: "Texto",
    },
    size: sizeField(46),
    color: { type: "color", default: theme.muted, description: "Cor" },
    maxWidth: sizeField(900, "Largura máxima (base 1080)"),
    ...entranceSchema(),
  },
});

type PillProps = {
  readonly children: string;
  readonly size?: number;
  readonly color?: string;
  readonly delay?: number;
  readonly preset?: EntrancePreset;
  readonly style?: React.CSSProperties;
};

/** Etiqueta curta acima do título (ex.: "NOVIDADE"). */
const PillInner: React.FC<PillProps> = ({
  children,
  size = 30,
  color = theme.accent,
  delay = 0,
  preset = "pop",
  style,
}) => {
  const { px } = useLayout();
  const entrance = useEntrance({ delay, preset });
  return (
    <div style={{ display: "inline-flex", ...style }}>
      <div
        style={{
          ...entrance,
          fontFamily: theme.fontFamily,
          fontSize: px(size),
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: theme.text,
          padding: `${px(size * 0.45)}px ${px(size * 0.9)}px`,
          borderRadius: px(999),
          background: `${color}33`,
          border: `${px(2)}px solid ${color}`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const Pill = Interactive.create({
  Component: PillInner,
  layout: "none",
  schema: {
    children: { type: "string", default: "Novidade", description: "Texto" },
    size: sizeField(30),
    color: { type: "color", default: theme.accent, description: "Cor" },
    ...entranceSchema("pop"),
  },
});
