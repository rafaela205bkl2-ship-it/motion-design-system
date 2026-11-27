/**
 * Presets nomeados: combinações prontas de props, escolhidas por nome.
 *
 *   <TextReveal {...textPresets.impacto} text="Olá" />
 *   <ObjectEnter {...objectPresets.queda}>…</ObjectEnter>
 *   const t = transitionPreset("radial-rapido", { fps, origin: [0.5, 0.6] });
 *   <TransitionSeries.Transition presentation={t.presentation} timing={t.timing} />
 *
 * Um preset é só um objeto de props: qualquer prop passada depois o sobrescreve.
 * Para adicionar um preset, veja docs/estendendo-a-biblioteca.md.
 */
import type {
  TransitionPresentation,
  TransitionTiming,
} from "@remotion/transitions";
import type { ObjectEnterProps } from "./object/ObjectEnter";
import type { TextRevealProps } from "./text/TextReveal";
import { blurDissolve } from "./transitions/blurDissolve";
import { diagonalWipe } from "./transitions/diagonalWipe";
import { radialReveal } from "./transitions/radialReveal";
import { motionTiming } from "./transitions/timing";

type TextPreset = Partial<Omit<TextRevealProps, "text">>;
type ObjectPreset = Partial<Omit<ObjectEnterProps, "children">>;

export const textPresets = {
  /** Título padrão: letra a letra, sobe com desfoque. */
  titulo: { by: "char", easing: "enterStrong" },
  /** Título de impacto: nasce do centro, com escala e desfoque fortes. */
  impacto: {
    by: "char",
    direction: "center",
    easing: "enterStrong",
    from: { y: 60, scale: 0.9, blur: 24 },
  },
  /** Frase construída palavra por palavra (linha secundária, narrativa). */
  frase: { by: "word", font: "body", easing: "enter" },
  /** Revelação suave e contida (tema calmo). */
  suave: {
    by: "word",
    easing: "enterSoft",
    from: { y: 20, blur: 12 },
    speed: 0.85,
  },
  /** Rótulo pequeno em caixa alta (legendas, sobretítulos). */
  rotulo: {
    by: "char",
    font: "body",
    weight: 700,
    size: 32,
    tracking: "0.25em",
    uppercase: true,
    stagger: 0.012,
  },
  /** Revelação da direita para a esquerda. */
  reverso: { by: "char", direction: "end", from: { x: 40, y: 0, blur: 18 } },
} satisfies Record<string, TextPreset>;

export const objectPresets = {
  /** Queda com peso e achatamento no pouso. */
  queda: { motion: "fall", from: "top", distance: 1200 },
  /** Surge do centro com sobra (a do tema). */
  pop: { motion: "pop" },
  /** Entra pela lateral esquerda e desacelera. */
  deslizeEsquerda: { motion: "glide", from: "left", distance: 900 },
  /** Entra pela lateral direita e desacelera. */
  deslizeDireita: { motion: "glide", from: "right", distance: 900 },
  /** Sobe suave (cards, interface). */
  subida: { motion: "rise", from: "bottom", distance: 260 },
  /** Pop + flutuação contínua em repouso. */
  flutuante: { motion: "pop", float: 14, floatPeriod: 3.2 },
} satisfies Record<string, ObjectPreset>;

export type TextPresetName = keyof typeof textPresets;
export type ObjectPresetName = keyof typeof objectPresets;

export const TRANSITION_PRESETS = [
  "radial-rapido",
  "radial-suave",
  "dissolve",
  "fade-branco",
  "faixa-diagonal",
] as const;
export type TransitionPresetName = (typeof TRANSITION_PRESETS)[number];

/** Apresentação + timing prontos para `TransitionSeries.Transition`. */
export type PresetTransition = {
  presentation: TransitionPresentation<Record<string, unknown>>;
  timing: TransitionTiming;
};

/**
 * Transição pronta (apresentação + timing) por nome.
 * - radial-rapido: 5 q, acelera até cobrir (radial de B)
 * - radial-suave:  7 q, acelera e desacelera (radial de A)
 * - dissolve:      9 q, dissolve com desfoque
 * - fade-branco:   9 q, dissolve passando pelo branco
 * - faixa-diagonal: 12 q, faixa na cor do anel cruza a tela na diagonal (ref-aline-03)
 */
export const transitionPreset = (
  name: TransitionPresetName,
  opts: {
    fps: number;
    origin?: [number, number];
    ringColor?: string;
    through?: string;
  },
): PresetTransition => {
  const { fps, origin = [0.5, 0.5], ringColor, through = "#FFFFFF" } = opts;
  const out = (presentation: unknown, timing: TransitionTiming) => ({
    presentation: presentation as TransitionPresentation<
      Record<string, unknown>
    >,
    timing,
  });
  switch (name) {
    case "radial-rapido":
      return out(
        radialReveal({
          origin,
          ringColor,
          ringWidth: 30,
          softness: 4,
        }),
        motionTiming({ fps, duration: "fast", easing: "wipe" }),
      );
    case "radial-suave":
      return out(
        radialReveal({
          origin,
          ringColor,
          ringWidth: 26,
          softness: 6,
          zoom: 0.07,
        }),
        motionTiming({ fps, duration: "base", easing: "wipeSmooth" }),
      );
    case "dissolve":
      return out(
        blurDissolve({ blur: 30, scale: 0.05 }),
        motionTiming({
          fps,
          duration: "dissolve",
          easing: "wipeSmooth",
        }),
      );
    case "fade-branco":
      return out(
        blurDissolve({
          blur: 34,
          through,
          throughStrength: 0.95,
        }),
        motionTiming({
          fps,
          duration: "dissolve",
          easing: "wipeSmooth",
        }),
      );
    case "faixa-diagonal":
      return out(
        diagonalWipe({ bandColor: ringColor ?? through, bandWidth: 240, angle: 125 }),
        motionTiming({ fps, duration: "wipe", easing: "wipeSmooth" }),
      );
  }
};
