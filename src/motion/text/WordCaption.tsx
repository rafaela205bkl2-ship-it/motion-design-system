/**
 * Legenda sincronizada palavra a palavra (tempos de transcrição).
 *
 * - As palavras são agrupadas em blocos curtos (até `maxWords`, quebrando em
 *   pontuação ou pausas maiores que `pauseBreak`).
 * - O bloco nasce inteiro (opacidade + desfoque); as palavras ainda não ditas
 *   ficam esmaecidas (`upcomingOpacity`) e "acendem" no instante em que são
 *   ditas. A palavra falada no momento fica na cor `activeColor`.
 * - `*palavra*` no texto marca destaque permanente (cor de destaque do tema).
 * - Um bloco só aparece depois que o anterior saiu ("nunca dois textos
 *   legíveis no mesmo lugar", MASTER_STYLE_GUIDE §11).
 *
 * Origem: revelação palavra a palavra com destaque de ref-004 (1,0–1,5 s) e
 * ref-001, aplicada a falas reais (Feira das Nações 2026). Tempo em segundos.
 */
import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { progressAt, useMotion } from "../MotionProvider";

export type CaptionWord = {
  /** Palavra (aceita `*destaque*`). */
  readonly text: string;
  /** Início e fim da fala da palavra, em segundos (relativos à sequência). */
  readonly start: number;
  readonly end: number;
};

export type WordCaptionProps = {
  readonly words: CaptionWord[];
  readonly maxWords?: number;
  /** Pausa (s) que força um novo bloco. */
  readonly pauseBreak?: number;
  /** Antecipação do bloco antes da primeira palavra (s). */
  readonly lead?: number;
  /** Permanência depois da última palavra (s). */
  readonly tail?: number;
  /** Tamanho da fonte em px de design. */
  readonly size?: number;
  readonly color?: string;
  readonly activeColor?: string;
  readonly highlightColor?: string;
  /** Fundo do bloco (ex.: "rgba(0,0,0,.45)"); omitido = sem fundo. */
  readonly background?: string;
  /** Largura máxima em px de design. */
  readonly maxWidth?: number;
  readonly font?: "display" | "body";
  readonly weight?: number;
  readonly uppercase?: boolean;
  /** Opacidade das palavras do bloco que ainda não foram ditas (0 = só aparecem quando ditas). */
  readonly upcomingOpacity?: number;
  readonly speed?: number;
  readonly intensity?: number;
  readonly style?: React.CSSProperties;
};

type Group = {
  words: (CaptionWord & { highlight: boolean; clean: string })[];
  from: number;
  to: number;
};

const PUNCT = /[.!?;:,]$/;

export const WordCaption: React.FC<WordCaptionProps> = ({
  words,
  maxWords = 5,
  pauseBreak = 0.6,
  lead = 0.12,
  tail = 0.45,
  size = 50,
  color,
  activeColor,
  highlightColor,
  background,
  maxWidth = 1400,
  font = "display",
  weight,
  uppercase = false,
  upcomingOpacity = 0.42,
  speed = 1,
  intensity = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const t = frame / m.fps;
  const ink = color ?? "#FFFFFF";
  const active = activeColor ?? m.palette.accent;
  const hi = highlightColor ?? m.palette.accent;
  const swap = m.dur("swap", speed);

  const groups = useMemo(() => {
    const gs: Group[] = [];
    let cur: Group["words"] = [];
    words.forEach((w, i) => {
      const highlight = w.text.includes("*");
      const clean = w.text.replace(/\*/g, "");
      cur.push({ ...w, highlight, clean });
      const next = words[i + 1];
      const brk =
        !next ||
        cur.length >= maxWords ||
        PUNCT.test(clean) ||
        next.start - w.end > pauseBreak;
      if (brk) {
        gs.push({ words: cur, from: cur[0].start - lead, to: w.end + tail });
        cur = [];
      }
    });
    // o próximo bloco só nasce quando o anterior já saiu
    for (let i = 0; i < gs.length - 1; i++) {
      gs[i].to = Math.min(gs[i].to, gs[i + 1].from - swap);
    }
    return gs;
  }, [words, maxWords, pauseBreak, lead, tail, swap]);

  const g = groups.find((x) => t >= x.from && t < x.to + m.dur("micro", speed));
  if (!g) return null;
  const exit = progressAt(frame, m.fps, g.to, m.dur("micro", speed), "exit");
  // o bloco inteiro nasce junto (desfoque); cada palavra acende quando é dita
  const enter = progressAt(
    frame,
    m.fps,
    g.from,
    m.dur("reveal", speed),
    "enter",
  );

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "baseline",
        columnGap: "0.28em",
        maxWidth: m.px(maxWidth),
        padding: background ? `${m.px(14)}px ${m.px(30)}px` : undefined,
        borderRadius: m.px(18),
        background,
        fontFamily:
          font === "display" ? m.theme.fonts.display : m.theme.fonts.body,
        fontWeight: weight ?? m.theme.weights.display,
        fontSize: m.px(size),
        lineHeight: 1.15,
        letterSpacing: "-0.01em",
        textTransform: uppercase ? "uppercase" : undefined,
        textShadow: background
          ? undefined
          : `0 ${m.px(3)}px ${m.px(18)}px rgba(0,0,0,.55)`,
        opacity: enter * (1 - exit),
        transform: `translateY(${(1 - enter) * m.px(16) * intensity}px)`,
        filter:
          enter < 1
            ? `blur(${m.blur(10, intensity) * (1 - enter)}px)`
            : exit > 0
              ? `blur(${m.blur("exit", intensity) * exit}px)`
              : undefined,
        ...style,
      }}
    >
      {g.words.map((w, i) => {
        const p = progressAt(
          frame,
          m.fps,
          w.start - 0.04,
          m.dur("reveal", speed),
          "enter",
        );
        const speaking = t >= w.start && t < w.end + 0.08;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: upcomingOpacity + (1 - upcomingOpacity) * p,
              transform: `translateY(${(1 - p) * m.px(6) * intensity}px) scale(${speaking ? 1.06 : 1})`,
              color: w.highlight ? hi : speaking ? active : ink,
            }}
          >
            {w.clean}
          </span>
        );
      })}
    </div>
  );
};
