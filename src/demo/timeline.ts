import { duration, type DurationToken } from "../motion";
import data from "./timeline.json";

export type SceneId =
  | "abertura"
  | "camadas"
  | "energia"
  | "formas"
  | "marca"
  | "creditos";

type Cue = { name: string; t: number; sfx?: string };
type SceneData = {
  id: string;
  frames: number;
  out?: { type: string; token: string; sfx?: string };
  cues: Cue[];
};

export const timeline = data as {
  fps: number;
  bpm: number;
  scenes: SceneData[];
};

/** Quadros de uma transição a partir do token (sem escala de tema: o JSON é a fonte única). */
export const tokenFrames = (token: string) =>
  Math.max(1, Math.round(duration[token as DurationToken] * timeline.fps));

/** Duração total da demonstração, em quadros. */
export const totalFrames = timeline.scenes.reduce(
  (acc, s) => acc + s.frames - (s.out ? tokenFrames(s.out.token) : 0),
  0,
);

/** Tempo (s) de uma marcação dentro da cena — a mesma usada pela trilha sonora. */
export const cue = (scene: SceneId, name: string): number => {
  const s = timeline.scenes.find((x) => x.id === scene);
  const c = s?.cues.find((x) => x.name === name);
  if (!c) throw new Error(`Marcação inexistente: ${scene}.${name}`);
  return c.t;
};

export const sceneFrames = (scene: SceneId) => {
  const s = timeline.scenes.find((x) => x.id === scene);
  if (!s) throw new Error(`Cena inexistente: ${scene}`);
  return s.frames;
};
