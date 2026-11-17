import { Easing, spring } from "remotion";

/**
 * Curvas nomeadas. Os nomes descrevem a INTENÇÃO; os comentários,
 * a curva clássica equivalente e de onde veio a escolha.
 */
export const easings = {
  linear: (t: number) => t,
  /** easeOutCubic — entradas de texto e elementos. */
  enter: Easing.bezier(0.33, 1, 0.68, 1),
  /** easeOutQuad — entradas mais suaves (revelação de "Agora" em A). */
  enterSoft: Easing.bezier(0.5, 1, 0.89, 1),
  /** easeOutExpo — chegada decidida, para títulos grandes. */
  enterStrong: Easing.bezier(0.16, 1, 0.3, 1),
  /** easeInCubic — saídas. */
  exit: Easing.bezier(0.32, 0, 0.67, 0),
  /** easeInQuad — transição que acelera até cobrir (radial final de B). */
  wipe: Easing.bezier(0.11, 0, 0.5, 0),
  /** easeInOutSine — transição que acelera e desacelera (radial de A). */
  wipeSmooth: Easing.bezier(0.37, 0, 0.63, 1),
  /** Quase linear com desaceleração no fim (queda do produto em B). */
  land: Easing.bezier(0.38, 0.38, 0.32, 1),
  /** easeInOutCubic — movimentos de câmera/camada. */
  camera: Easing.bezier(0.65, 0, 0.35, 1),
} as const;

export type EasingName = keyof typeof easings;
export type EasingInput = EasingName | ((t: number) => number);

export const resolveEasing = (e: EasingInput): ((t: number) => number) =>
  typeof e === "function" ? e : easings[e];

/* ------------------------------------------------------------------ */
/* Mola com sobra controlada                                           */
/* ------------------------------------------------------------------ */

const STIFFNESS = 180;
const MASS = 0.6;
const dampingCache = new Map<number, number>();

const measureOvershoot = (damping: number) => {
  let max = 0;
  for (let f = 0; f < 120; f++) {
    max = Math.max(
      max,
      spring({
        frame: f,
        fps: 60,
        config: { damping, stiffness: STIFFNESS, mass: MASS },
      }),
    );
  }
  return max - 1;
};

/** Encontra o amortecimento que produz a sobra pedida (busca binária, memorizada). */
export const dampingForOvershoot = (target: number): number => {
  const key = Math.round(target * 1000) / 1000;
  const cached = dampingCache.get(key);
  if (cached !== undefined) return cached;
  if (key <= 0.001) {
    dampingCache.set(key, 60);
    return 60;
  }
  let lo = 2;
  let hi = 60;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (measureOvershoot(mid) > key) lo = mid;
    else hi = mid;
  }
  const d = (lo + hi) / 2;
  dampingCache.set(key, d);
  return d;
};

/**
 * Progresso 0 → 1 (+ sobra) de uma mola cujo movimento principal
 * dura `durationInFrames`. Sobra 0 = chegada sem passar do alvo.
 */
export const overshootProgress = ({
  frame,
  fps,
  durationInFrames,
  amount,
}: {
  frame: number;
  fps: number;
  durationInFrames: number;
  amount: number;
}) => {
  if (frame <= 0) return 0;
  if (amount <= 0.001) {
    return easings.enter(Math.min(1, frame / Math.max(1, durationInFrames)));
  }
  return spring({
    frame,
    fps,
    durationInFrames: Math.max(1, durationInFrames),
    config: {
      damping: dampingForOvershoot(amount),
      stiffness: STIFFNESS,
      mass: MASS,
    },
  });
};
