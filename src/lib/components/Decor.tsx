import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useProgress } from "../animations";
import { useLayout } from "../layout";
import { theme } from "../theme";

/**
 * Fundo com manchas de luz em movimento lento.
 * As posições usam porcentagem, então se adaptam a qualquer proporção.
 */
export const GlowBackground: React.FC<{
  readonly colorA?: string;
  readonly colorB?: string;
}> = ({ colorA = theme.accent, colorB = theme.accent2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { px, pick } = useLayout();
  const t = frame / fps;
  const blob = px(pick({ vertical: 900, horizontal: 1000, square: 800 }));

  const blobStyle = (color: string): React.CSSProperties => ({
    position: "absolute",
    width: blob,
    height: blob,
    borderRadius: "50%",
    background: color,
    filter: `blur(${px(180)}px)`,
    opacity: 0.45,
    translate: "-50% -50%",
  });

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          ...blobStyle(colorA),
          left: `${15 + 6 * Math.sin(t * 0.6)}%`,
          top: `${pick({ vertical: 18, horizontal: 20, square: 15 }) + 5 * Math.cos(t * 0.5)}%`,
        }}
      />
      <div
        style={{
          ...blobStyle(colorB),
          left: `${85 + 6 * Math.cos(t * 0.4)}%`,
          top: `${pick({ vertical: 82, horizontal: 80, square: 85 }) + 5 * Math.sin(t * 0.7)}%`,
        }}
      />
    </div>
  );
};

/**
 * Elemento visual de anéis concêntricos girando.
 * Útil como "herói" ao lado (16:9) ou acima (9:16) do texto.
 */
export const Orb: React.FC<{
  /** Diâmetro em pixels de design (base 1080). */
  readonly size?: number;
  readonly delay?: number;
}> = ({ size = 520, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { px } = useLayout();
  const appear = useProgress({ delay, duration: 1.2 });
  const d = px(size);
  const rotation = interpolate(frame, [0, 10 * fps], [0, 360]);

  return (
    <div
      style={{
        width: d,
        height: d,
        position: "relative",
        flexShrink: 0,
        opacity: appear,
        scale: String(0.6 + 0.4 * appear),
      }}
    >
      {[1, 0.74, 0.5].map((r, i) => (
        <div
          key={r}
          style={{
            position: "absolute",
            inset: `${((1 - r) / 2) * 100}%`,
            borderRadius: "50%",
            border: `${px(3)}px solid ${theme.border}`,
            borderTopColor: i % 2 === 0 ? theme.accent2 : theme.accent,
            rotate: `${rotation * (i % 2 === 0 ? 1 : -1.4)}deg`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: "34%",
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 30%, #fff, ${theme.accent} 45%, ${theme.background} 100%)`,
          boxShadow: `0 0 ${px(120)}px ${theme.accent}`,
        }}
      />
    </div>
  );
};
