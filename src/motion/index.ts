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
export { keyframes } from "./keyframes";
export type { Keyframe } from "./keyframes";

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
export { TypeOn, getTypeOnDuration } from "./text/TypeOn";
export type { TypeOnProps } from "./text/TypeOn";
export { CountUp } from "./text/CountUp";
export type { CountUpProps } from "./text/CountUp";
export { OrbitText } from "./text/OrbitText";
export type { OrbitTextProps } from "./text/OrbitText";

// Objetos
export { ObjectEnter } from "./object/ObjectEnter";
export type {
  ObjectEnterProps,
  ObjectMotion,
  EnterFrom,
} from "./object/ObjectEnter";
export { Tilt3D } from "./object/Tilt3D";
export type { Tilt3DProps, TiltState } from "./object/Tilt3D";
export { TapCursor, tapPulse } from "./object/TapCursor";
export type { TapCursorProps, TapPoint } from "./object/TapCursor";
export { Device3D } from "./object/Device3D";
export type { Device3DProps } from "./object/Device3D";

// Transições
export { radialReveal } from "./transitions/radialReveal";
export type { RadialRevealProps } from "./transitions/radialReveal";
export { blurDissolve } from "./transitions/blurDissolve";
export type { BlurDissolveProps } from "./transitions/blurDissolve";
export { diagonalWipe } from "./transitions/diagonalWipe";
export type { DiagonalWipeProps } from "./transitions/diagonalWipe";
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
export { DrawPath } from "./layers/DrawPath";
export type { DrawPathProps } from "./layers/DrawPath";

// Layout responsivo (da base existente)
export { useLayout, getFormat, FORMATS } from "../lib/layout";
export type { FormatName, PerFormat } from "../lib/layout";
