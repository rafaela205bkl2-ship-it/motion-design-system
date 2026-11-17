import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { progressAt, useMotion } from "../MotionProvider";

export type KineticTypeProps = {
  /** Texto repetido (ex.: "RITMO •"). */
  readonly text: string;
  /** Número de fileiras. */
  readonly rows?: number;
  /** Tamanho da fonte em px de design. */
  readonly size?: number;
  /** Velocidade em px de design por segundo. */
  readonly speed?: number;
  /** Fileiras alternam o sentido. */
  readonly alternate?: boolean;
  /** Inclinação do bloco, em graus. */
  readonly angle?: number;
  readonly color?: string;
  readonly opacity?: number;
  /** Só contorno (texto vazado) nas fileiras ímpares. */
  readonly outlineOdd?: boolean;
  /** Entrada: início e duração do fade, em segundos. */
  readonly delay?: number;
  readonly fadeIn?: number;
};

/** Padrão tipográfico em fileiras que deslizam — camada de fundo. */
export const KineticType: React.FC<KineticTypeProps> = ({
  text,
  rows = 9,
  size = 180,
  speed = 90,
  alternate = true,
  angle = -8,
  color,
  opacity = 0.18,
  outlineOdd = true,
  delay = 0,
  fadeIn = 0.4,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const t = frame / m.fps;
  const appear = progressAt(frame, m.fps, delay, fadeIn, "enter");
  const fs = m.px(size);
  const c = color ?? m.palette.ink;
  const line = `${text} `.repeat(14);

  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: opacity * appear }}>
      <div
        style={{
          position: "absolute",
          left: "-50%",
          top: "-15%",
          width: "200%",
          height: "130%",
          rotate: `${angle}deg`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: fs * 0.08,
        }}
      >
        {Array.from({ length: rows }, (_, i) => {
          const dir = alternate && i % 2 === 1 ? 1 : -1;
          // sem módulo: o texto é longo o bastante para uma cena inteira, e assim não há "salto"
          const offset = t * m.px(speed) * dir - fs * 4 - (i % 3) * fs * 0.9;
          const outline = outlineOdd && i % 2 === 1;
          return (
            <div
              key={i}
              style={{
                fontFamily: m.theme.fonts.display,
                fontWeight: 800,
                fontSize: fs,
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
                translate: `${offset}px 0px`,
                color: outline ? "transparent" : c,
                WebkitTextStroke: outline ? `${m.px(3)}px ${c}` : undefined,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
