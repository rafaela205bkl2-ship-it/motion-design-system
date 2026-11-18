/**
 * Névoa atmosférica em movimento: ruído procedural de baixa frequência, colorido, numa faixa
 * da tela, deslizando devagar. Várias camadas com velocidades diferentes dão parallax de névoa.
 *
 * Por quê: ar entre a câmera e o cenário é o que separa "ilustração" de "plano de cinema".
 * Ruído calculado em 1/4 da resolução e ampliado: barato para renderizar.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useMotion } from "../MotionProvider";

export type AtmosphereProps = {
  /** Cor da névoa (hex #RRGGBB). */
  readonly color?: string;
  /** Densidade 0–1. */
  readonly density?: number;
  /** Faixa vertical em fração da altura (0 = topo). */
  readonly from?: number;
  readonly to?: number;
  /** Deslocamento horizontal em px de design por segundo. */
  readonly drift?: number;
  /** Tamanho das nuvens (maior = mais largas). */
  readonly scale?: number;
  readonly seed?: number;
  readonly blend?: React.CSSProperties["mixBlendMode"];
};

const rgb = (hex: string): [number, number, number] => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  const n = m ? parseInt(m[1], 16) : 0xf4d9c8;
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export const Atmosphere: React.FC<AtmosphereProps> = ({
  color = "#F4D9C8",
  density = 0.5,
  from = 0.45,
  to = 0.85,
  drift = 24,
  scale = 1,
  seed = 4,
  blend = "screen",
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  // camada desenhada em 1/4: deslocamentos também em 1/4
  const dx = -((frame / m.fps) * m.px(drift)) / 4;
  const id = `atm-${seed}`;
  const [r, g, b] = rgb(color);
  const mask = `linear-gradient(to bottom, transparent ${from * 100 - 8}%, black ${from * 100 + 6}%, black ${to * 100 - 6}%, transparent ${to * 100 + 8}%)`;
  // nuvens com ~400 px de design de largura; a camada é desenhada em 1/4 da resolução
  const freq = 0.01 / (m.unit * scale);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: blend, opacity: density, maskImage: mask, WebkitMaskImage: mask, overflow: "hidden" }}>
      <svg width="25%" height="25%" style={{ display: "block", scale: "4", transformOrigin: "0 0", overflow: "visible" }}>
        <filter id={id} x="0" y="0" width="400%" height="100%" filterUnits="userSpaceOnUse">
          <feTurbulence type="fractalNoise" baseFrequency={`${freq} ${freq * 2.2}`} numOctaves={3} seed={seed} />
          <feColorMatrix values={`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  0 0 0 2.4 -1.0`} />
        </filter>
        {/* o ruído vive no espaço do grupo: transladar o grupo move a névoa */}
        <g transform={`translate(${dx} 0)`}>
          <rect x={0} y={0} width="400%" height="100%" filter={`url(#${id})`} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
