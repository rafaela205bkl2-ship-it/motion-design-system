/**
 * Tokens de animação.
 *
 * Valores derivados das medições das referências
 * (docs/referencias/analise-referencias.md, seções 7 e 12.2).
 * Durações em SEGUNDOS — convertidas para quadros no uso, então funcionam em qualquer fps.
 * Distâncias e desfoques em PIXELS DE DESIGN (lado menor = 1080), convertidos por `px()`.
 */

export const duration = {
  /** Saída em desfoque (2–4 quadros medidos). */
  micro: 3 / 30,
  /** Transição rápida de tela inteira (radial final de B: 5 q). */
  fast: 5 / 30,
  /** Troca de texto (≈ 6 q medidos). */
  swap: 6 / 30,
  /** Transição padrão de tela inteira (radial de A: 7 q). */
  base: 7 / 30,
  /** Dissolve com desfoque entre cenas. */
  dissolve: 9 / 30,
  /** Faixa diagonal que limpa a tela (≈ 12 q medidos em ref-aline-03, 5,0–5,4 s). */
  wipe: 12 / 30,
  /** Revelação de uma unidade de texto (letra/palavra). */
  reveal: 10 / 30,
  /** Entrada de objeto (queda e barras: 16 q). */
  enter: 16 / 30,
  /** Pausa mínima de leitura (~1 evento por segundo). */
  hold: 1,
  /** Duração típica de cena. */
  scene: 2.5,
  /** Encerramento parado (3,4–4,7 s medidos). */
  outro: 4,
} as const;

export const stagger = {
  /** Entre letras. */
  char: 0.03,
  /** Entre palavras. */
  word: 0.075,
  /** Entre itens/objetos. */
  item: 0.12,
} as const;

/** Desfoque máximo em pixels de design. */
export const blur = {
  reveal: 18,
  exit: 16,
  dissolve: 28,
  object: 14,
  depth: 22,
} as const;

/** Distâncias em pixels de design. */
export const distance = {
  text: 38,
  object: 420,
  drift: 22,
} as const;

/** Sobra (overshoot) como fração do valor final. Referências: ≤ 7%. */
export const overshoot = {
  none: 0,
  subtle: 0.02,
  base: 0.04,
  lively: 0.065,
} as const;

export type DurationToken = keyof typeof duration;
export type StaggerToken = keyof typeof stagger;
export type BlurToken = keyof typeof blur;
export type DistanceToken = keyof typeof distance;
export type OvershootToken = keyof typeof overshoot;

export const tokens = { duration, stagger, blur, distance, overshoot } as const;
