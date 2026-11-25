// Biblioteca de motion design — ponto único de importação.

// Tokens, curvas e temas
export * from "./tokens";
export {
  easings,
  resolveEasing,
  overshootProgress,
  dampingForOvershoot,
} from "./easing";
export type { EasingName, EasingInput } from "./easing";
export * from "./themes";
export {
  MotionProvider,
  useMotion,
  useProgress,
  progressAt,
} from "./MotionProvider";
export type { TimeValue } from "./MotionProvider";

// Presets nomeados
export {
  textPresets,
  objectPresets,
  transitionPreset,
  TRANSITION_PRESETS,
} from "./presets";
export type {
  TextPresetName,
  ObjectPresetName,
  TransitionPresetName,
} from "./presets";

// Catálogo consultável (o que existe e como usar)
export { catalog } from "./catalog";
export type { CatalogEntry } from "./catalog";

// Texto
export { TextReveal, getRevealDuration } from "./text/TextReveal";
export type {
  TextRevealProps,
  RevealDirection,
  RevealState,
} from "./text/TextReveal";
export { TextSwap } from "./text/TextSwap";
export type { TextSwapProps, TextSwapItem } from "./text/TextSwap";

// Objetos
export { ObjectEnter } from "./object/ObjectEnter";
export type {
  ObjectEnterProps,
  ObjectMotion,
  EnterFrom,
} from "./object/ObjectEnter";

// Transições
export { radialReveal } from "./transitions/radialReveal";
export type { RadialRevealProps } from "./transitions/radialReveal";
export { blurDissolve } from "./transitions/blurDissolve";
export type { BlurDissolveProps } from "./transitions/blurDissolve";
export { motionTiming, transitionFrames } from "./transitions/timing";

// Camadas
export { Layer } from "./layers/Layer";
export type { LayerProps } from "./layers/Layer";
export { Backdrop } from "./layers/Backdrop";
export type { BackdropProps, Glow } from "./layers/Backdrop";
export { KineticType } from "./layers/KineticType";
export type { KineticTypeProps } from "./layers/KineticType";
export { ColorBloom } from "./layers/ColorBloom";
export type { ColorBloomProps, BloomStep } from "./layers/ColorBloom";

// Layout responsivo (da base existente)
export { useLayout, getFormat, FORMATS } from "../lib/layout";
export type { FormatName, PerFormat } from "../lib/layout";

// Cinema (filmes, trailers, lançamentos de marca)
export { keyframeAt } from "./cinema/keyframes";
export type { Keyframe } from "./cinema/keyframes";
export { CameraPlate } from "./cinema/CameraPlate";
export type { CameraPlateProps, CameraKey } from "./cinema/CameraPlate";
export { FilmLook } from "./cinema/FilmLook";
export type { FilmLookProps } from "./cinema/FilmLook";
export { LightRays } from "./cinema/LightRays";
export type { LightRaysProps } from "./cinema/LightRays";
export { Particles } from "./cinema/Particles";
export type { ParticlesProps } from "./cinema/Particles";
export { Shine } from "./cinema/Shine";
export type { ShineProps } from "./cinema/Shine";
export { MaskReveal } from "./cinema/MaskReveal";
export type { MaskRevealProps } from "./cinema/MaskReveal";
export { Flash } from "./cinema/Flash";
export type { FlashProps } from "./cinema/Flash";
export { TextStrike } from "./cinema/TextStrike";
export type { TextStrikeProps } from "./cinema/TextStrike";
