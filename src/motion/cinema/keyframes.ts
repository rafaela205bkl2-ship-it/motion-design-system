/**
 * Interpolação de quadros-chave em segundos, com curva por trecho.
 * Base da câmera virtual (CameraPlate) e de qualquer animação com vários pontos.
 */
import { resolveEasing, type EasingInput } from "../easing";

export type Keyframe = { t: number } & Record<string, number | undefined>;

/**
 * Valor de `prop` no tempo `t` (s). Antes do primeiro quadro-chave vale o primeiro;
 * depois do último, o último. Quadros-chave sem a propriedade são ignorados para ela.
 */
export const keyframeAt = (
  keys: readonly Keyframe[],
  prop: string,
  t: number,
  fallback: number,
  easing: EasingInput = "camera",
): number => {
  const pts = keys
    .filter((k) => typeof k[prop] === "number")
    .map((k) => ({ t: k.t, v: k[prop] as number }))
    .sort((a, b) => a.t - b.t);
  if (pts.length === 0) return fallback;
  if (t <= pts[0].t) return pts[0].v;
  const last = pts[pts.length - 1];
  if (t >= last.t) return last.v;
  const ease = resolveEasing(easing);
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    if (t >= a.t && t <= b.t) {
      const p = ease((t - a.t) / Math.max(b.t - a.t, 1e-6));
      return a.v + (b.v - a.v) * p;
    }
  }
  return last.v;
};
