/**
 * keyframes — interpola vários valores numéricos entre quadros-chave em segundos,
 * com curva entre cada par. Serve para "câmeras" (zoom, pan, rotação) que passam
 * por vários pontos, como o mergulho na tela do celular de ref-aline-03 (6,0–9,5 s):
 * aproxima, para em cada ícone, desliza até o próximo e afasta.
 *
 *   const cam = keyframes(t, [
 *     { t: 0, scale: 1, y: 0 },
 *     { t: 0.8, scale: 2, y: -120 },
 *   ], "camera");
 */
import { resolveEasing, type EasingInput } from "./easing";

export type Keyframe = { t: number } & Record<string, number>;

export const keyframes = <K extends Keyframe>(
  t: number,
  keys: K[],
  easing: EasingInput = "camera",
): Omit<K, "t"> => {
  const ease = resolveEasing(easing);
  const pick = (a: K, b: K, k: number) => {
    const out: Record<string, number> = {};
    for (const name of Object.keys(a)) {
      if (name === "t") continue;
      const va = a[name];
      const vb = b[name] ?? va;
      out[name] = va + (vb - va) * k;
    }
    return out as Omit<K, "t">;
  };
  if (t <= keys[0].t) return pick(keys[0], keys[0], 0);
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (t <= b.t) {
      const k = b.t === a.t ? 1 : ease((t - a.t) / (b.t - a.t));
      return pick(a, b, k);
    }
  }
  const last = keys[keys.length - 1];
  return pick(last, last, 0);
};
