/**
 * OrbitText — letras distribuídas numa elipse em perspectiva, girando em volta de um
 * objeto central. As letras de trás ficam menores, mais claras e desfocadas.
 *
 * Origem: ref-aline-01 (2º trecho, 0,4–1,4 s): o ícone do app gira em 3D enquanto as
 * letras do nome orbitam em volta dele, passando na frente e atrás; o conjunto
 * acelera e some antes da troca de cena. Use `children` para o objeto central:
 * as letras de trás são desenhadas antes dele e as da frente, depois.
 */
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useMotion } from "../MotionProvider";

export type OrbitTextProps = {
  readonly text: string;
  /** Raio horizontal da órbita, em px de design. */
  readonly radius?: number;
  /** Achatamento vertical da elipse (0 = linha, 1 = círculo). */
  readonly tilt?: number;
  /** Voltas por segundo (antes da velocidade do tema). */
  readonly turns?: number;
  /** Início (aparecem) e fim (somem), em segundos. */
  readonly delay?: number;
  readonly hideAt?: number;
  /** Tamanho das letras em px de design. */
  readonly size?: number;
  readonly fontFamily?: string;
  readonly weight?: number;
  readonly color?: string;
  readonly children?: React.ReactNode;
};

export const OrbitText: React.FC<OrbitTextProps> = ({
  text,
  radius = 360,
  tilt = 0.28,
  turns = 0.6,
  delay = 0,
  hideAt,
  size = 64,
  fontFamily,
  weight,
  color,
  children,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const t = frame / m.fps - delay;
  const chars = Array.from(text);
  const n = chars.length;
  const op =
    interpolate(t, [0, 0.25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    (hideAt === undefined
      ? 1
      : interpolate(t + delay, [hideAt - 0.2, hideAt], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }));
  const base = t * turns * m.speed * Math.PI * 2;

  const items = chars.map((ch, i) => {
    const a = base + (i / n) * Math.PI * 2;
    const z = Math.cos(a); // 1 = frente, -1 = atrás
    return { ch, i, x: Math.sin(a) * radius, y: -z * radius * tilt * 0.35, z };
  });
  const render = (list: typeof items) =>
    list.map(({ ch, i, x, y, z }) => {
      const depth = (1 - z) / 2; // 0 frente → 1 atrás
      return (
        <span
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) translate(${m.px(x)}px, ${m.px(y)}px) scale(${1 - depth * 0.45})`,
            fontFamily: fontFamily ?? m.theme.fonts.display,
            fontWeight: weight ?? m.theme.weights.display,
            fontSize: m.px(size),
            color: color ?? m.palette.ink,
            opacity: op * (1 - depth * 0.6),
            filter: depth > 0.05 ? `blur(${m.px(depth * 6)}px)` : undefined,
            whiteSpace: "pre",
          }}
        >
          {ch}
        </span>
      );
    });

  return (
    <div style={{ position: "relative", width: 0, height: 0 }}>
      {op > 0 ? render(items.filter((it) => it.z < 0)) : null}
      <div style={{ position: "absolute", left: 0, top: 0, transform: "translate(-50%, -50%)" }}>
        {children}
      </div>
      {op > 0 ? render(items.filter((it) => it.z >= 0)) : null}
    </div>
  );
};
