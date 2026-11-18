/**
 * Tipografia cinética de impacto: palavras enormes que entram letra por letra virando em 3D
 * (eixo X), com escala e sobra, linhas empilhadas e saída que voa em direção à câmera.
 *
 * Por quê: o texto como protagonista, grande e expressivo, da linguagem publicitária da ref-001
 * ("Agora", 5,87 s, revelado letra a letra), levado para escala de cartaz.
 * `*palavra*` usa a cor de destaque.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { backOut } from "../easing";
import { progressAt, useMotion } from "../MotionProvider";

export type KineticWordProps = {
  /** Linhas separadas por \n; *destaque* entre asteriscos. */
  readonly text: string;
  /** Tamanho em px de design. */
  readonly size?: number;
  readonly delay?: number;
  /** Intervalo entre letras (s). */
  readonly stagger?: number;
  /** Duração da entrada de cada letra (s). */
  readonly duration?: number;
  readonly speed?: number;
  /** Instante de saída (s): as letras voam para a câmera. */
  readonly exitAt?: number;
  readonly color?: string;
  readonly highlight?: string;
  readonly lineHeight?: number;
  readonly tracking?: string;
  /** Rotação inicial de cada letra (graus no eixo X). */
  readonly flip?: number;
  readonly overshoot?: number;
  /** Alinhamento das linhas. */
  readonly align?: "left" | "center" | "right";
  readonly uppercase?: boolean;
};

export const KineticWord: React.FC<KineticWordProps> = ({
  text,
  size = 220,
  delay = 0,
  stagger = 0.035,
  duration = 0.55,
  speed = 1,
  exitAt,
  color,
  highlight,
  lineHeight = 0.88,
  tracking,
  flip = -95,
  overshoot = 0.06,
  align = "center",
  uppercase = false,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const lines = text.split("\n");
  let idx = 0;
  let hl = false;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end",
        fontFamily: m.theme.fonts.display,
        fontWeight: m.theme.weights.display,
        fontSize: m.px(size),
        lineHeight,
        letterSpacing: tracking ?? m.theme.displayTracking,
        perspective: m.px(900),
        textTransform: uppercase ? "uppercase" : undefined,
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", whiteSpace: "pre", transformStyle: "preserve-3d" }}>
          {Array.from(line).map((ch, ci) => {
            if (ch === "*") {
              hl = !hl;
              return null;
            }
            const i = idx++;
            const s = delay / speed + i * m.stag(stagger, speed);
            const lin = progressAt(frame, m.fps, s, m.dur(duration, speed), "linear");
            const k = backOut(lin, overshoot);
            const e = progressAt(frame, m.fps, s, m.dur(duration, speed), "enterStrong");
            const out = exitAt !== undefined ? progressAt(frame, m.fps, exitAt / speed + i * 0.012, m.dur(0.4, speed), "exit") : 0;
            return (
              <span
                key={ci}
                style={{
                  display: "inline-block",
                  color: hl ? (highlight ?? m.palette.highlight) : (color ?? m.palette.ink),
                  opacity: Math.min(1, e * 1.4) * (1 - out),
                  transformOrigin: "50% 100%",
                  transform: `translateY(${(1 - e) * m.px(size * 0.35)}px) translateZ(${out * m.px(900)}px) rotateX(${flip * (1 - k)}deg) scale(${0.6 + 0.4 * k})`,
                  filter: e < 0.95 ? `blur(${(1 - e) * m.px(10)}px)` : undefined,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
