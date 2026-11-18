/**
 * Luz volumétrica (raios de luz / "god rays") saindo de uma fonte: sol, holofote, janela.
 *
 * Por quê: dá ar e volume à cena, como a luz atravessando névoa num trailer. Os raios são
 * faixas de um gradiente cônico (determinístico), com fade radial a partir da fonte e
 * oscilação lenta. Fica por cima da cena em `screen`, então só clareia.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useMotion } from "../MotionProvider";
import { seeded } from "./Particles";

export type VolumetricLightProps = {
  /** Fonte em px de design (0,0 = canto superior esquerdo do 9:16 1080×1920). */
  readonly x?: number;
  readonly y?: number;
  /** Direção central dos raios em graus (0 = para cima, 180 = para baixo). */
  readonly direction?: number;
  /** Abertura do leque em graus (360 = em volta toda). */
  readonly spread?: number;
  readonly rays?: number;
  readonly color?: string;
  /** Intensidade 0–1. */
  readonly intensity?: number;
  /** Alcance dos raios em px de design. */
  readonly reach?: number;
  /** Oscilação dos raios (graus). */
  readonly sway?: number;
  /** Velocidade da oscilação. */
  readonly speed?: number;
  /** Suavidade (desfoque em px de design). */
  readonly softness?: number;
  readonly seed?: number;
};

export const VolumetricLight: React.FC<VolumetricLightProps> = ({
  x = 540,
  y = 900,
  direction = 180,
  spread = 140,
  rays = 14,
  color = "rgba(255,210,160,0.55)",
  intensity = 0.7,
  reach = 1700,
  sway = 3,
  speed = 1,
  softness = 18,
  seed = 3,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const t = (frame / m.fps) * speed;
  const r = seeded(seed);
  const start = direction - spread / 2;
  const stops: string[] = ["transparent 0deg"];
  for (let i = 0; i < rays; i++) {
    const c = ((i + 0.5) / rays) * spread + (r() - 0.5) * (spread / rays) * 0.8;
    const w = (spread / rays) * (0.12 + r() * 0.35);
    const flick = 0.55 + 0.45 * Math.sin(t * (0.6 + r()) + i * 1.7);
    const a = Math.max(0, c - w / 2);
    const b = Math.min(spread, c + w / 2);
    stops.push(`transparent ${a.toFixed(2)}deg`, `${color} ${((a + b) / 2).toFixed(2)}deg`, `transparent ${b.toFixed(2)}deg`);
    void flick;
  }
  stops.push(`transparent ${spread}deg`, `transparent 360deg`);
  const rot = Math.sin(t * 0.5) * sway;
  const px = m.px(x);
  const py = m.px(y);
  const mask = `radial-gradient(circle at ${px}px ${py}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) ${m.px(reach) * 0.25}px, transparent ${m.px(reach)}px)`;
  const pulse = 0.85 + 0.15 * Math.sin(t * 1.3);
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "screen",
        opacity: intensity * pulse,
        pointerEvents: "none",
        filter: `blur(${m.px(softness)}px)`,
        background: `conic-gradient(from ${start + rot}deg at ${px}px ${py}px, ${stops.join(", ")})`,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
};
