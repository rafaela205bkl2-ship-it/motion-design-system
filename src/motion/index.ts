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
