/**
 * Faíscas e poeira subindo em fluxo contínuo (brasas), com cintilação e desfoque por profundidade.
 *
 * Por quê: na ref-003 há faíscas e partículas de poeira subindo durante toda a peça,
 * mais densas no terço inferior, junto do brilho quente da base. Diferente de `Particles`
 * (que leva pontos de uma forma a outra), aqui o fluxo é infinito e cíclico: cada
 * partícula nasce embaixo, sobe com balanço lateral e reaparece, sem "fim" visível.
 *
 * Determinístico (`seeded`): o mesmo quadro sempre gera a mesma imagem.
 */
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useMotion } from "../MotionProvider";
import { seeded } from "./Particles";

export type EmbersProps = {
  /** Quantidade de partículas. */
  readonly count?: number;
  /** Faixa vertical onde nascem (0–1 da altura); sobem até `top`. */
  readonly from?: number;
  readonly top?: number;
  /** Velocidade de subida (alturas de tela por segundo). */
  readonly rise?: number;
  /** Balanço lateral (px de design). */
  readonly sway?: number;
  /** Vento: deriva horizontal ao subir (fração da largura por ciclo). */
  readonly wind?: number;
  /** Tamanho base (px de design). */
  readonly size?: number;
  readonly colors?: readonly string[];
  /** 0–1: fração de partículas desfocadas (fora de foco, mais próximas da câmera). */
  readonly bokeh?: number;
  readonly opacity?: number;
  readonly speed?: number;
  readonly seed?: number;
};

export const Embers: React.FC<EmbersProps> = ({
  count = 70,
  from = 1.02,
  top = 0.25,
  rise = 0.09,
  sway = 14,
  wind = 0.04,
  size = 3,
  colors = ["#FFB259", "#FF7A2E", "#FFE2A8"],
  bokeh = 0.18,
  opacity = 1,
  speed = 1,
  seed = 11,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const { width: W, height: H } = useVideoConfig();
  const parts = useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: count }, () => ({
      x: r(),
      phase: r(),
      v: 0.6 + r() * 0.9,
      s: 0.5 + r() * r() * 2.2,
      sw: r() * Math.PI * 2,
      tw: 2 + r() * 5,
      c: Math.floor(r() * colors.length),
      blur: r() < bokeh,
      streak: r() < 0.35,
    }));
  }, [count, seed, colors.length, bokeh]);

  const t = (frame / m.fps) * speed * m.speed;
  const span = from - top;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity }}>
      {parts.map((p, i) => {
        const cycle = span / (rise * p.v);
        const k = ((t / cycle + p.phase) % 1 + 1) % 1;
        const y = (from - k * span) * H;
        const x = (p.x + wind * k) * W + Math.sin(t * 1.3 + p.sw) * m.px(sway) * p.v;
        const life = Math.sin(k * Math.PI);
        const twinkle = 0.55 + 0.45 * Math.sin(t * p.tw + p.sw * 3);
        const sz = m.px(size * p.s * (p.blur ? 3.2 : 1));
        const len = p.streak && !p.blur ? sz * 3.5 : sz;
        const c = colors[p.c];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - sz / 2,
              top: y - len / 2,
              width: sz,
              height: len,
              borderRadius: sz,
              background: c,
              boxShadow: `0 0 ${sz * 2.5}px ${c}`,
              opacity: life * twinkle * (p.blur ? 0.35 : 0.95),
              filter: p.blur ? `blur(${sz * 0.6}px)` : undefined,
              transform: `rotate(${Math.sin(t + p.sw) * 18}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
