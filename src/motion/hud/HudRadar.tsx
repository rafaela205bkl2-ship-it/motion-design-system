/**
 * Radar circular de jogo (minimapa genérico): anéis, varredura, pontos, rota que se desenha
 * e marcador do jogador. Original, sem reproduzir o HUD de nenhum jogo específico.
 *
 * Por quê: elementos de interface de jogo integrados à cena dizem "jogo" sem mostrar o jogo.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { progressAt, useMotion } from "../MotionProvider";
import { seeded } from "../layers/Particles";

export type HudRadarProps = {
  /** Diâmetro em px de design. */
  readonly size?: number;
  readonly delay?: number;
  readonly speed?: number;
  readonly color?: string;
  readonly accent?: string;
  /** Rotação do mapa ao longo do tempo (graus por segundo). */
  readonly spin?: number;
  readonly blips?: number;
  readonly seed?: number;
  /** Texto pequeno abaixo do radar. */
  readonly label?: string;
};

export const HudRadar: React.FC<HudRadarProps> = ({
  size = 260,
  delay = 0,
  speed = 1,
  color = "rgba(244,233,218,0.85)",
  accent = "#FF5C8A",
  spin = 6,
  blips = 7,
  seed = 9,
  label,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const t = frame / m.fps;
  const enter = progressAt(frame, m.fps, delay / speed, m.dur(0.6, speed), "enterStrong");
  const route = progressAt(frame, m.fps, delay / speed + 0.3, m.dur(1.6, speed), "camera");
  const S = m.px(size);
  const r = seeded(seed);
  const pts = Array.from({ length: blips }, () => {
    const a = r() * Math.PI * 2;
    const d = 0.25 + r() * 0.6;
    return { x: 50 + Math.cos(a) * d * 45, y: 50 + Math.sin(a) * d * 45, ph: r() * 6 };
  });
  const sweep = (t * 90 * speed) % 360;
  const path = "M50 50 L50 38 L62 30 L70 18";
  return (
    <div style={{ width: S, opacity: enter, transform: `scale(${0.85 + 0.15 * enter})`, transformOrigin: "50% 50%" }}>
      <div style={{ position: "relative", width: S, height: S, borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle, rgba(20,14,34,0.72), rgba(10,8,18,0.86))", boxShadow: `0 0 0 ${m.px(3)}px rgba(244,233,218,0.25), 0 ${m.px(12)}px ${m.px(40)}px rgba(0,0,0,0.5)` }}>
        <div style={{ position: "absolute", inset: 0, background: `conic-gradient(from ${sweep}deg, ${accent}55 0deg, transparent 50deg, transparent 360deg)`, borderRadius: "50%" }} />
        <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <g transform={`rotate(${t * spin} 50 50)`} stroke={color} fill="none" strokeOpacity={0.35} strokeWidth={0.5}>
            <circle cx={50} cy={50} r={16} />
            <circle cx={50} cy={50} r={32} />
            <line x1={50} y1={4} x2={50} y2={96} />
            <line x1={4} y1={50} x2={96} y2={50} />
            <path d="M10 70 L35 62 L48 74 L80 66 L95 72" strokeOpacity={0.25} strokeWidth={2.5} />
            <path d="M20 20 L30 45 L22 80" strokeOpacity={0.2} strokeWidth={2} />
            <path d={path} stroke={accent} strokeOpacity={1} strokeWidth={1.6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - route} strokeLinecap="round" />
            {pts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={1.6 + 0.6 * Math.sin(t * 3 + p.ph)} fill={i === 0 ? accent : color} stroke="none" opacity={0.85} />
            ))}
          </g>
          <polygon points="50,44 54,55 50,52 46,55" fill={color} />
        </svg>
      </div>
      {label ? (
        <div style={{ marginTop: m.px(14), textAlign: "center", fontSize: m.px(24), fontWeight: 700, letterSpacing: "0.22em", color, fontFamily: m.theme.fonts.display }}>{label}</div>
      ) : null}
    </div>
  );
};
