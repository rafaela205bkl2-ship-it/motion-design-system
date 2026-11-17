/**
 * Objetos originais da demonstração, desenhados só com CSS/SVG.
 * Todos usam pixels de design (base 1080) via useLayout().px.
 */
import React from "react";
import { useLayout } from "../lib/layout";

const mix = (color: string, other: string, pct: number) =>
  `color-mix(in oklab, ${color} ${pct}%, ${other})`;

/** Esfera com luz principal, luz de borda e brilho especular. */
export const Orb: React.FC<{
  readonly size?: number;
  readonly color: string;
  readonly style?: React.CSSProperties;
}> = ({ size = 320, color, style }) => {
  const { px } = useLayout();
  const s = px(size);
  return (
    <div
      style={{
        width: s,
        height: s,
        borderRadius: "50%",
        position: "relative",
        background: `radial-gradient(circle at 34% 28%, ${mix(color, "#fff", 35)} 0%, ${color} 38%, ${mix(color, "#000", 55)} 100%)`,
        boxShadow: `inset ${-s * 0.06}px ${-s * 0.08}px ${s * 0.16}px ${mix(color, "#000", 40)}, inset ${s * 0.03}px ${s * 0.03}px ${s * 0.08}px ${mix(color, "#fff", 30)}`,
        ...style,
      }}
    >
      {/* luz de borda (rim light) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle at 72% 82%, ${mix(color, "#fff", 45)} 0%, transparent 32%)`,
          opacity: 0.55,
        }}
      />
      {/* brilho especular */}
      <div
        style={{
          position: "absolute",
          left: "20%",
          top: "14%",
          width: "30%",
          height: "20%",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 70%)",
          rotate: "-28deg",
        }}
      />
    </div>
  );
};

/** Cápsula com volume (gradiente, faixa de brilho e sombra interna). */
export const Capsule: React.FC<{
  readonly width?: number;
  readonly color: string;
  readonly style?: React.CSSProperties;
}> = ({ width = 560, color, style }) => {
  const { px } = useLayout();
  const w = px(width);
  const h = w * 0.4;
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: h,
        position: "relative",
        background: `linear-gradient(180deg, ${mix(color, "#fff", 40)} 0%, ${color} 42%, ${mix(color, "#000", 50)} 100%)`,
        boxShadow: `inset 0 ${-h * 0.1}px ${h * 0.22}px ${mix(color, "#000", 45)}, inset 0 ${h * 0.06}px ${h * 0.1}px ${mix(color, "#fff", 30)}`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "9%",
          right: "9%",
          top: "12%",
          height: "22%",
          borderRadius: h,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0))",
        }}
      />
    </div>
  );
};

/** Anel espesso com gradiente cônico e iluminação. */
export const Ring: React.FC<{
  readonly size?: number;
  readonly color: string;
  readonly style?: React.CSSProperties;
}> = ({ size = 340, color, style }) => {
  const { px } = useLayout();
  const s = px(size);
  const ringMask =
    "radial-gradient(circle, transparent 47%, #000 48%, #000 69%, transparent 70%)";
  return (
    <div style={{ width: s, height: s, position: "relative", ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `conic-gradient(from 210deg, ${mix(color, "#fff", 45)}, ${color}, ${mix(color, "#000", 50)}, ${color}, ${mix(color, "#fff", 45)})`,
          maskImage: ringMask,
          WebkitMaskImage: ringMask,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 25%, rgba(255,255,255,0.55), transparent 40%)",
          maskImage: ringMask,
          WebkitMaskImage: ringMask,
        }}
      />
    </div>
  );
};

/** Sombra de contato sob um objeto. */
export const ContactShadow: React.FC<{
  readonly width?: number;
  readonly opacity?: number;
  readonly color?: string;
  readonly style?: React.CSSProperties;
}> = ({ width = 300, opacity = 0.28, color = "#000", style }) => {
  const { px } = useLayout();
  const w = px(width);
  return (
    <div
      style={{
        width: w,
        height: w * 0.16,
        borderRadius: "50%",
        background: `radial-gradient(ellipse, ${color} 0%, transparent 70%)`,
        opacity,
        filter: `blur(${px(6)}px)`,
        ...style,
      }}
    />
  );
};

/** Cartão translúcido com conteúdo esquemático (interface fictícia). */
export const GlassCard: React.FC<{
  readonly width?: number;
  readonly height?: number;
  readonly accent: string;
  readonly ink: string;
  readonly label?: string;
  readonly value?: string;
  readonly lines?: number;
  readonly style?: React.CSSProperties;
}> = ({
  width = 640,
  height = 360,
  accent,
  ink,
  label,
  value,
  lines = 3,
  style,
}) => {
  const { px } = useLayout();
  return (
    <div
      style={{
        width: px(width),
        height: px(height),
        boxSizing: "border-box",
        padding: px(44),
        borderRadius: px(44),
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.86), rgba(255,255,255,0.58))",
        border: `${px(2)}px solid rgba(255,255,255,0.9)`,
        boxShadow: `0 ${px(40)}px ${px(90)}px rgba(16,33,46,0.16), 0 ${px(6)}px ${px(16)}px rgba(16,33,46,0.06)`,
        display: "flex",
        flexDirection: "column",
        gap: px(26),
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: px(22) }}>
        <div
          style={{
            width: px(72),
            height: px(72),
            borderRadius: px(22),
            background: `linear-gradient(135deg, ${accent}, ${mix(accent, "#fff", 55)})`,
          }}
        />
        {label ? (
          <div
            style={{
              fontFamily: "inherit",
              fontSize: px(34),
              fontWeight: 700,
              color: ink,
            }}
          >
            {label}
          </div>
        ) : (
          <div
            style={{
              width: px(220),
              height: px(22),
              borderRadius: px(11),
              background: `${ink}22`,
            }}
          />
        )}
      </div>
      {value ? (
        <div
          style={{
            fontSize: px(64),
            fontWeight: 800,
            color: ink,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
      ) : null}
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          style={{
            width: `${[92, 74, 58, 80][i % 4]}%`,
            height: px(18),
            borderRadius: px(9),
            background: i === 0 ? `${accent}55` : `${ink}18`,
          }}
        />
      ))}
    </div>
  );
};

/**
 * Símbolo da marca fictícia "ondula": três ondas desenhadas como traço.
 * `progress` 0 → 1 desenha o símbolo.
 */
export const OndulaMark: React.FC<{
  readonly size?: number;
  readonly color: string;
  readonly progress: number;
  readonly stagger?: number;
}> = ({ size = 260, color, progress, stagger = 0.18 }) => {
  const { px } = useLayout();
  const s = px(size);
  const paths = [
    "M 20 70 C 50 40, 80 40, 100 70 S 150 100, 180 70",
    "M 20 105 C 50 75, 80 75, 100 105 S 150 135, 180 105",
    "M 20 140 C 50 110, 80 110, 100 140 S 150 170, 180 140",
  ];
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 200 200"
      style={{ overflow: "visible" }}
    >
      <rect
        x="6"
        y="6"
        width="188"
        height="188"
        rx="56"
        fill="none"
        stroke={color}
        strokeWidth="12"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - Math.min(1, progress * 1.15)}
        strokeLinecap="round"
      />
      {paths.map((d, i) => {
        const local = Math.min(
          1,
          Math.max(0, (progress - i * stagger) / (1 - 2 * stagger)),
        );
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - local}
          />
        );
      })}
    </svg>
  );
};
