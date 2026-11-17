import { linearTiming } from "@remotion/transitions";
import { resolveEasing, type EasingInput } from "../easing";
import { duration as durationTokens, type DurationToken } from "../tokens";

/**
 * Timing para `TransitionSeries.Transition` a partir de tokens.
 *
 * motionTiming({fps, duration: 'fast', easing: 'wipe'})
 */
export const motionTiming = ({
  fps,
  duration = "base",
  easing = "wipeSmooth",
  speed = 1,
}: {
  fps: number;
  duration?: DurationToken | number;
  easing?: EasingInput;
  speed?: number;
}) => {
  const seconds =
    typeof duration === "number" ? duration : durationTokens[duration];
  return linearTiming({
    durationInFrames: Math.max(1, Math.round((seconds / speed) * fps)),
    easing: resolveEasing(easing),
  });
};

/** Quadros de uma transição (para somar na duração total da composição). */
export const transitionFrames = (
  fps: number,
  duration: DurationToken | number = "base",
  speed = 1,
) => {
  const seconds =
    typeof duration === "number" ? duration : durationTokens[duration];
  return Math.max(1, Math.round((seconds / speed) * fps));
};
