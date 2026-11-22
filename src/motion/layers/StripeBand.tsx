/**
 * Faixas de cor que entram deslizando, uma após a outra, e (opcionalmente)
 * saem pelo lado oposto. Preenchem o elemento pai (100% × 100%).
 *
 * Usos:
 * - **Transição sobre um corte** (`coverAt`): as faixas cobrem a tela no
 *   instante do corte e se abrem em seguida — continuidade sem trocar de cena.
 * - **Etiqueta/fundo de bloco** (`delay` sem saída): as faixas entram e ficam.
 *
 * Por quê: padrão de "faixas escalonadas" observado em ref-003 (4,5 s e 29,0 s: blocos de cor
 * que varrem a tela entre recortes de vídeo), aplicado às cores de bandeiras
 * na Feira das Nações 2026. Cada faixa é um plano do tamanho do pai, recortado
 * (clip-path) na sua fatia; assim o deslocamento é sempre de 100% do pai.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import type { EasingInput } from "../easing";
import { progressAt, useMotion, type TimeValue } from "../MotionProvider";

export type Stripe = {
  readonly color: string;
  /** "checker" = xadrez com `color2` (ex.: Croácia). */
  readonly pattern?: "solid" | "checker";
  readonly color2?: string;
  /** Peso relativo da faixa (padrão 1). */
  readonly weight?: number;
};

export type StripeBandProps = {
  readonly stripes: Stripe[];
  /** "vertical" = colunas lado a lado; "horizontal" = linhas empilhadas. */
  readonly orientation?: "vertical" | "horizontal";
  /** Lado de onde as faixas entram (saem pelo oposto). */
  readonly from?: "left" | "right" | "top" | "bottom";
  /** Início da entrada, em segundos. Ignorado se `coverAt` for dado. */
  readonly delay?: number;
  /** Instante em que todas as faixas cobrem o pai (modo transição). */
  readonly coverAt?: number;
  /** Tempo coberto antes de abrir (modo transição), em segundos. */
  readonly hold?: number;
  /** Início da saída, em segundos. Omitido = fica (exceto com `coverAt`). */
  readonly exitAt?: number;
  /** Duração do deslocamento de cada faixa. */
  readonly duration?: TimeValue;
  /** Intervalo entre faixas, em segundos. */
  readonly stagger?: number;
  readonly easing?: EasingInput;
  readonly exitEasing?: EasingInput;
  /** Inclinação das bordas, em graus. */
  readonly skew?: number;
  /** Tamanho da casa do xadrez em px de design. */
  readonly checkerSize?: number;
  readonly speed?: number;
  readonly style?: React.CSSProperties;
};

const SLIDE: Record<NonNullable<StripeBandProps["from"]>, [number, number]> = {
  left: [-1, 0],
  right: [1, 0],
  top: [0, -1],
  bottom: [0, 1],
};

export const StripeBand: React.FC<StripeBandProps> = ({
  stripes,
  orientation = "vertical",
  from = "left",
  delay = 0,
  coverAt,
  hold = 0.07,
  exitAt,
  duration = 0.4,
  stagger = 0.05,
  easing = "wipe",
  exitEasing = "enter",
  skew = 0,
  checkerSize = 46,
  speed = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const dur = m.dur(duration, speed);
  const stag = m.stag(stagger, speed);
  const n = stripes.length;
  const start = coverAt !== undefined ? coverAt - dur - (n - 1) * stag : delay;
  const out = coverAt !== undefined ? coverAt + hold : exitAt;
  const [dx, dy] = SLIDE[from];
  const total = stripes.reduce((a, s) => a + (s.weight ?? 1), 0);

  let acc = 0;
  const bands = stripes.map((s, i) => {
    const a = acc / total;
    acc += s.weight ?? 1;
    const b = acc / total;
    const pin = progressAt(frame, m.fps, start + i * stag, dur, easing);
    const pout =
      out === undefined
        ? 0
        : progressAt(frame, m.fps, out + i * stag, dur, exitEasing);
    if (pin <= 0 || pout >= 1) return null;
    // entra de (dx,dy)·100% até 0, depois segue até −(dx,dy)·100%
    const k = 1 - pin - pout;
    const tx = dx * k * 100;
    const ty = dy * k * 100;
    // pequena sobreposição entre faixas para não abrir fresta
    const eps = 0.15;
    const clip =
      orientation === "vertical"
        ? `inset(0 ${Math.max(0, (1 - b) * 100 - eps)}% 0 ${Math.max(0, a * 100 - eps)}%)`
        : `inset(${Math.max(0, a * 100 - eps)}% 0 ${Math.max(0, (1 - b) * 100 - eps)}% 0)`;
    const cs = m.px(checkerSize);
    const bg =
      s.pattern === "checker"
        ? {
            backgroundColor: s.color,
            backgroundImage: `conic-gradient(${s.color} 25%, ${s.color2 ?? "#FFFFFF"} 0 50%, ${s.color} 0 75%, ${s.color2 ?? "#FFFFFF"} 0)`,
            backgroundSize: `${cs * 2}px ${cs * 2}px`,
          }
        : { backgroundColor: s.color };
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          inset: 0,
          clipPath: clip,
          transform: `translate(${tx}%, ${ty}%)`,
          ...bg,
        }}
      />
    );
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: skew ? "-25%" : 0,
          transform: skew
            ? orientation === "vertical"
              ? `skewX(${skew}deg)`
              : `skewY(${skew}deg)`
            : undefined,
        }}
      >
        {bands}
      </div>
    </div>
  );
};
