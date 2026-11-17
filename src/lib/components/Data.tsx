import type React from "react";
import { Interactive, useCurrentFrame, useVideoConfig } from "remotion";
import { useEntrance, useProgress, type EntrancePreset } from "../animations";
import { useLayout } from "../layout";
import { theme } from "../theme";
import { entranceSchema, sizeField } from "./schema";

type CounterProps = {
  readonly value: number;
  readonly decimals?: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly label: string;
  readonly size?: number;
  readonly color?: string;
  readonly delay?: number;
  readonly preset?: EntrancePreset;
  readonly style?: React.CSSProperties;
};

/** Número que conta de 0 até `value`, com legenda abaixo. */
const CounterInner: React.FC<CounterProps> = ({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  label,
  size = 150,
  color = theme.text,
  delay = 0,
  preset = "fade-up",
  style,
}) => {
  const { px } = useLayout();
  const entrance = useEntrance({ delay, preset });
  const count = useProgress({ delay, duration: 1.6 }) * value;
  const formatted = count.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <div style={{ fontFamily: theme.fontFamily, ...style }}>
      <div style={entrance}>
        <div
          style={{
            fontSize: px(size),
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {prefix}
          {formatted}
          <span style={{ color: theme.accent2 }}>{suffix}</span>
        </div>
        <div
          style={{
            marginTop: px(size * 0.12),
            fontSize: px(size * 0.26),
            fontWeight: 600,
            color: theme.muted,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

export const Counter = Interactive.create({
  Component: CounterInner,
  layout: "none",
  schema: {
    value: {
      type: "number",
      default: 100,
      description: "Valor final",
      hiddenFromList: false,
      keyframable: false,
    },
    decimals: {
      type: "number",
      default: 0,
      min: 0,
      max: 3,
      integer: true,
      description: "Casas decimais",
      hiddenFromList: false,
      keyframable: false,
    },
    prefix: { type: "string", default: "", description: "Prefixo" },
    suffix: { type: "string", default: "", description: "Sufixo" },
    label: { type: "string", default: "Legenda", description: "Legenda" },
    size: sizeField(150),
    color: { type: "color", default: theme.text, description: "Cor" },
    ...entranceSchema(),
  },
});

type FeatureCardProps = {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
  readonly size?: number;
  readonly accent?: string;
  readonly delay?: number;
  readonly preset?: EntrancePreset;
  readonly style?: React.CSSProperties;
};

/**
 * Cartão de recurso. No horizontal fica com ícone em cima (cartões lado a lado);
 * no vertical e no quadrado, ícone à esquerda (cartões empilhados).
 */
const FeatureCardInner: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  size = 1,
  accent = theme.accent,
  delay = 0,
  preset = "fade-up",
  style,
}) => {
  const { px, pick } = useLayout();
  const entrance = useEntrance({ delay, preset });
  const s = (n: number) => px(n * size);
  const iconOnTop = pick({ vertical: false, horizontal: true, square: false });

  return (
    <div style={{ fontFamily: theme.fontFamily, ...style }}>
      <div
        style={{
          ...entrance,
          display: "flex",
          flexDirection: iconOnTop ? "column" : "row",
          alignItems: iconOnTop ? "flex-start" : "center",
          gap: s(32),
          padding: s(44),
          borderRadius: s(36),
          background: theme.surface,
          border: `${px(2)}px solid ${theme.border}`,
          textAlign: "left",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: s(110),
            height: s(110),
            borderRadius: s(28),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: s(58),
            background: `linear-gradient(135deg, ${accent}, ${theme.accent2})`,
          }}
        >
          {icon}
        </div>
        <div>
          <div
            style={{
              fontSize: s(48),
              fontWeight: 800,
              color: theme.text,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: s(10),
              fontSize: s(34),
              color: theme.muted,
              lineHeight: 1.3,
            }}
          >
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FeatureCard = Interactive.create({
  Component: FeatureCardInner,
  layout: "none",
  schema: {
    icon: { type: "string", default: "⚡", description: "Ícone (emoji)" },
    title: { type: "string", default: "Recurso", description: "Título" },
    description: {
      type: "string",
      default: "Descrição curta",
      description: "Descrição",
    },
    size: {
      type: "number",
      default: 1,
      min: 0.3,
      max: 3,
      step: 0.05,
      description: "Escala",
      hiddenFromList: false,
    },
    accent: { type: "color", default: theme.accent, description: "Cor" },
    ...entranceSchema(),
  },
});

type CtaProps = {
  readonly children: string;
  readonly size?: number;
  readonly color?: string;
  readonly delay?: number;
  readonly preset?: EntrancePreset;
  readonly pulse?: boolean;
  readonly style?: React.CSSProperties;
};

/** Botão de chamada para ação com pulso suave depois da entrada. */
const CtaButtonInner: React.FC<CtaProps> = ({
  children,
  size = 52,
  color = theme.accent,
  delay = 0,
  preset = "pop",
  pulse = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { px } = useLayout();
  const entrance = useEntrance({ delay, preset });
  const t = Math.max(0, frame / fps - delay - 0.8);
  const pulseScale = pulse ? 1 + 0.035 * Math.sin(t * Math.PI * 1.6) : 1;

  return (
    <div style={{ display: "inline-flex", ...style }}>
      <div style={entrance}>
        <div
          style={{
            scale: String(pulseScale),
            fontFamily: theme.fontFamily,
            fontSize: px(size),
            fontWeight: 800,
            color: theme.text,
            padding: `${px(size * 0.55)}px ${px(size * 1.2)}px`,
            borderRadius: px(999),
            background: `linear-gradient(135deg, ${color}, ${theme.accent2})`,
            boxShadow: `0 ${px(20)}px ${px(60)}px ${color}66`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const CtaButton = Interactive.create({
  Component: CtaButtonInner,
  layout: "none",
  schema: {
    children: { type: "string", default: "Saiba mais", description: "Texto" },
    size: sizeField(52),
    color: { type: "color", default: theme.accent, description: "Cor" },
    pulse: { type: "boolean", default: true, description: "Pulsar" },
    ...entranceSchema("pop"),
  },
});
