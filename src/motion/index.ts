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
export { RollingNumber } from "./text/RollingNumber";
export type { RollingNumberProps } from "./text/RollingNumber";

// 3D (CSS)
export { Stage3D, Plane3D } from "./three/Stage3D";
export type { Stage3DProps, Plane3DProps } from "./three/Stage3D";
export { DepthType } from "./three/DepthType";
export type { DepthTypeProps } from "./three/DepthType";

// Objetos
export { ObjectEnter } from "./object/ObjectEnter";
export type {
  ObjectEnterProps,
  ObjectMotion,
  EnterFrom,
} from "./object/ObjectEnter";
export { FootageCard } from "./object/FootageCard";
export type { FootageCardProps } from "./object/FootageCard";

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
export { Particles, particleShapes, seeded } from "./layers/Particles";
export type { ParticlesProps, Point } from "./layers/Particles";
export { CameraMove } from "./layers/CameraMove";
export type { CameraMoveProps, CameraState } from "./layers/CameraMove";
export { FilmLook, CrtReveal } from "./layers/FilmLook";
export type { FilmLookProps, CrtRevealProps } from "./layers/FilmLook";
export { LightSweep } from "./layers/LightSweep";
export type { LightSweepProps } from "./layers/LightSweep";
export { VolumetricLight } from "./layers/VolumetricLight";
export type { VolumetricLightProps } from "./layers/VolumetricLight";
export { Atmosphere } from "./layers/Atmosphere";
export type { AtmosphereProps } from "./layers/Atmosphere";
export { LensFlare } from "./layers/LensFlare";
export type { LensFlareProps } from "./layers/LensFlare";
export { Grade } from "./layers/Grade";
export type { GradeProps } from "./layers/Grade";

// Interface de jogo (HUD)
export { HudRadar } from "./hud/HudRadar";
export type { HudRadarProps } from "./hud/HudRadar";
export { MissionCard } from "./hud/MissionCard";
export type { MissionCardProps } from "./hud/MissionCard";
export { HudFrame } from "./hud/HudFrame";
export type { HudFrameProps } from "./hud/HudFrame";

// Layout responsivo (da base existente)
export { useLayout, getFormat, FORMATS } from "../lib/layout";
export type { FormatName, PerFormat } from "../lib/layout";
