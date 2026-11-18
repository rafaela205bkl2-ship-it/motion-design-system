/**
 * Reflexo de lente: brilho na fonte, risco anamórfico horizontal e "fantasmas" alinhados
 * entre a fonte e o centro da tela, como uma lente de cinema apontada para o sol.
 *
 * A posição da fonte pode ser animada; os fantasmas se movem na direção oposta, o que
 * reforça a sensação de câmera real.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useLayout } from "../../lib/layout";
import { useMotion } from "../MotionProvider";

export type LensFlareProps = {
  /** Fonte em px de design. */
  readonly x?: number;
  readonly y?: number;
  readonly color?: string;
  /** Cor do risco anamórfico. */
  readonly streakColor?: string;
  /** Intensidade 0–1. */
  readonly intensity?: number;
  /** Largura do risco em px de design. */
  readonly streak?: number;
  readonly ghosts?: number;
};

export const LensFlare: React.FC<LensFlareProps> = ({
  x = 540,
  y = 900,
  color = "#FFD7A0",
  streakColor = "rgba(150,190,255,0.7)",
  intensity = 0.7,
  streak = 1400,
  ghosts = 4,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const { width, height } = useLayout();
  const sx = m.px(x);
  const sy = m.px(y);
  const cx = width / 2;
  const cy = height / 2;
  const flick = 0.92 + 0.08 * Math.sin(frame * 0.7) * Math.sin(frame * 0.23);
  const glow = m.px(260);
  const sw = m.px(streak);
  const ghostColors = ["rgba(255,140,180,0.22)", "rgba(140,200,255,0.18)", "rgba(255,210,140,0.2)", "rgba(190,150,255,0.16)", "rgba(255,170,120,0.18)"];
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none", opacity: intensity * flick }}>
      <div style={{ position: "absolute", left: sx - glow, top: sy - glow, width: glow * 2, height: glow * 2, borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, ${color}55 18%, transparent 65%)` }} />
      <div style={{ position: "absolute", left: sx - sw / 2, top: sy - m.px(5), width: sw, height: m.px(10), borderRadius: m.px(10), background: `linear-gradient(90deg, transparent, ${streakColor}, #ffffff, ${streakColor}, transparent)`, filter: `blur(${m.px(3)}px)` }} />
      {Array.from({ length: ghosts }, (_, i) => {
        const k = 0.5 + i * 0.45; // posição ao longo do eixo fonte → centro → além
        const gx = sx + (cx - sx) * k * 2;
        const gy = sy + (cy - sy) * k * 2;
        const s = m.px(40 + ((i * 53) % 110));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: gx - s,
              top: gy - s,
              width: s * 2,
              height: s * 2,
              borderRadius: "50%",
              background: i % 2 ? `radial-gradient(circle, transparent 55%, ${ghostColors[i % 5]} 70%, transparent 76%)` : `radial-gradient(circle, ${ghostColors[i % 5]} 0%, transparent 70%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
