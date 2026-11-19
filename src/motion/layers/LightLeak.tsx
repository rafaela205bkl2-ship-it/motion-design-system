/**
 * Estouro de luz (light leak): uma onda de luz quente que lava a tela inteira e recua.
 *
 * Por quê: na ref-003 o estouro marca o início e o reinício de cada ciclo
 * (0,00–0,40 s; 14,0–14,8 s; 28,0–28,8 s; 41,5 s). A tela chega ao creme quase
 * branco em ~0,13 s e a imagem volta a aparecer, ainda queimada, em ~0,4 s. Manchas
 * de cor (amarelo, laranja, vermelho) atravessam a tela enquanto a luz recua.
 *
 * Use como transição de ciclo, abertura ou fechamento. Tudo em segundos;
 * as manchas são gradientes (sem imagem), então o render é determinístico.
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { resolveEasing } from "../easing";
import { useMotion } from "../MotionProvider";

export type LightLeakProps = {
  /** Instante do pico (s), quando a tela fica mais clara. */
  readonly at: number;
  /** Tempo de subida até o pico (s). ref-003: ~0,13 s. */
  readonly rise?: number;
  /** Tempo de recuo depois do pico (s). ref-003: ~0,3–0,8 s. */
  readonly fall?: number;
  /** Cor do clarão (o "quase branco"). */
  readonly flash?: string;
  /** Manchas de cor que atravessam a tela durante o estouro. */
  readonly colors?: readonly string[];
  /** 0–1: quanto o pico cobre a tela (1 = creme sólido). */
  readonly intensity?: number;
  /** Direção em que as manchas viajam (graus; 0 = para a direita). */
  readonly angle?: number;
  readonly speed?: number;
};

export const LightLeak: React.FC<LightLeakProps> = ({
  at,
  rise = 0.13,
  fall = 0.45,
  flash = "#FFF6DC",
  colors = ["#FFD36B", "#FF9A3D", "#E8452C"],
  intensity = 1,
  angle = -20,
  speed = 1,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const t = frame / m.fps;
  const r = m.dur(rise, speed);
  const f = m.dur(fall, speed);
  const start = at - r - f * 0.4;
  const end = at + f * 1.4;
  if (t < start || t > end) return null;

  // Envelope do clarão: sobe rápido (enter forte) e recua suave.
  const up = interpolate(t, [at - r, at], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: resolveEasing("enterStrong"),
  });
  const down = interpolate(t, [at, at + f], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: resolveEasing("exit"),
  });
  const env = (t <= at ? up : down) * intensity;
  // As manchas começam antes e terminam depois do clarão.
  const travel = interpolate(t, [start, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const leakEnv = Math.sin(travel * Math.PI) * intensity;
  const rad = (angle * Math.PI) / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {colors.map((c, i) => {
        const k = (i + 1) / colors.length;
        const pos = -40 + travel * (140 + 30 * k);
        const x = 50 + dx * (pos - 50) + (i % 2 ? 18 : -14);
        const y = 50 + dy * (pos - 50) * 1.6 + (i - 1) * 22;
        return (
          <AbsoluteFill
            key={i}
            style={{
              background: `radial-gradient(ellipse ${55 + 25 * k}% ${38 + 20 * k}% at ${x}% ${y}%, ${c} 0%, transparent 70%)`,
              mixBlendMode: "screen",
              opacity: leakEnv * (0.85 - i * 0.12),
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 120% 90% at 50% 35%, ${flash} 0%, ${flash} 45%, ${colors[0] ?? flash} 100%)`,
          opacity: Math.min(env * 1.05, 1),
        }}
      />
    </AbsoluteFill>
  );
};
