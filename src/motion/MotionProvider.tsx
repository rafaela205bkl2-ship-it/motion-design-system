import React, { createContext, useContext, useMemo } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useLayout } from "../lib/layout";
import { resolveEasing, type EasingInput } from "./easing";
import { themes, type Theme, type ThemeName } from "./themes";
import {
  blur as blurTokens,
  distance as distanceTokens,
  duration as durationTokens,
  stagger as staggerTokens,
  type BlurToken,
  type DistanceToken,
  type DurationToken,
  type StaggerToken,
} from "./tokens";

type MotionContextValue = {
  theme: Theme;
  /** Multiplicadores locais, compostos com os do tema. */
  speed: number;
  intensity: number;
};

const MotionContext = createContext<MotionContextValue>({
  theme: themes.base,
  speed: 1,
  intensity: 1,
});

/**
 * Define o tema e, opcionalmente, ajustes locais de ritmo.
 * Pode ser aninhado: cada cena pode ter seu próprio tema.
 *
 * <MotionProvider theme="vibrante" speed={1.2}>…</MotionProvider>
 */
export const MotionProvider: React.FC<{
  readonly theme?: ThemeName | Theme;
  /** Multiplica a velocidade do tema (1.2 = 20% mais rápido). */
  readonly speed?: number;
  /** Multiplica a intensidade do tema (desfoque e distâncias). */
  readonly intensity?: number;
  readonly children: React.ReactNode;
}> = ({ theme, speed = 1, intensity = 1, children }) => {
  const parent = useContext(MotionContext);
  const value = useMemo<MotionContextValue>(() => {
    const t =
      theme === undefined
        ? parent.theme
        : typeof theme === "string"
          ? themes[theme]
          : theme;
    // ao trocar de tema, os multiplicadores locais do pai não são herdados
    const inherit = theme === undefined;
    return {
      theme: t,
      speed: (inherit ? parent.speed : 1) * speed,
      intensity: (inherit ? parent.intensity : 1) * intensity,
    };
  }, [theme, speed, intensity, parent]);
  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
};

export type TimeValue = number | DurationToken;

/**
 * Acesso resolvido aos tokens: já aplica velocidade/intensidade do tema
 * e converte pixels de design para pixels reais.
 */
export const useMotion = () => {
  const ctx = useContext(MotionContext);
  const { fps } = useVideoConfig();
  const { px, unit } = useLayout();
  const speed = ctx.speed * ctx.theme.motion.speed;
  const intensity = ctx.intensity * ctx.theme.motion.intensity;

  return {
    theme: ctx.theme,
    palette: ctx.theme.palette,
    fps,
    speed,
    intensity,
    px,
    unit,
    /** Duração em segundos, já escalada pela velocidade. */
    dur: (v: TimeValue, localSpeed = 1) =>
      (typeof v === "number" ? v : durationTokens[v]) / (speed * localSpeed),
    /** Escalonamento em segundos. */
    stag: (v: number | StaggerToken, localSpeed = 1) =>
      (typeof v === "number" ? v : staggerTokens[v]) / (speed * localSpeed),
    /** Desfoque em pixels reais. */
    blur: (v: number | BlurToken, localIntensity = 1) =>
      px(
        (typeof v === "number" ? v : blurTokens[v]) *
          intensity *
          localIntensity,
      ),
    /** Distância em pixels reais. */
    dist: (v: number | DistanceToken, localIntensity = 1) =>
      px(
        (typeof v === "number" ? v : distanceTokens[v]) *
          intensity *
          localIntensity,
      ),
    /** Pausa (holdScale do tema). */
    hold: (seconds: number) => seconds * ctx.theme.motion.holdScale,
  };
};

/**
 * Progresso 0 → 1 entre `start` e `start + duration` (segundos).
 * Use dentro de qualquer componente para animações próprias.
 */
export const useProgress = ({
  start = 0,
  duration,
  easing = "enter",
}: {
  start?: number;
  duration: number;
  easing?: EasingInput;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return progressAt(frame, fps, start, duration, easing);
};

/** Versão pura de `useProgress`, para cálculos em loops. */
export const progressAt = (
  frame: number,
  fps: number,
  start: number,
  duration: number,
  easing: EasingInput = "enter",
) => {
  const a = start * fps;
  const b = a + Math.max(duration * fps, 0.0001);
  return interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: resolveEasing(easing),
  });
};
