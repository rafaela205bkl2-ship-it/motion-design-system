/**
 * Bandeiras simplificadas (geometria plana em SVG, proporção 3:2) dos países
 * que aparecem no vídeo. Brasões detalhados viram formas geométricas.
 */
import React from "react";
import type { PaisId } from "../dados";

const Estrela: React.FC<{
  cx: number;
  cy: number;
  r: number;
  fill: string;
}> = ({ cx, cy, r, fill }) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.42;
    return `${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`;
  }).join(" ");
  return <polygon points={pts} fill={fill} />;
};

const desenho: Record<PaisId, React.ReactNode> = {
  brasil: (
    <>
      <rect width={30} height={20} fill="#009C3B" />
      <polygon points="15,2.2 27.6,10 15,17.8 2.4,10" fill="#FFDF00" />
      <circle cx={15} cy={10} r={4.6} fill="#002776" />
      <path
        d="M10.6 9.2 Q15 7.6 19.4 11"
        stroke="#FFFFFF"
        strokeWidth={0.7}
        fill="none"
      />
    </>
  ),
  turquia: (
    <>
      <rect width={30} height={20} fill="#E30A17" />
      <circle cx={11} cy={10} r={5} fill="#FFFFFF" />
      <circle cx={12.3} cy={10} r={4} fill="#E30A17" />
      <Estrela cx={17.6} cy={10} r={2.2} fill="#FFFFFF" />
    </>
  ),
  caboVerde: (
    <>
      <rect width={30} height={20} fill="#003893" />
      <rect y={10} width={30} height={1.25} fill="#FFFFFF" />
      <rect y={11.25} width={30} height={1.25} fill="#CF2027" />
      <rect y={12.5} width={30} height={1.25} fill="#FFFFFF" />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <Estrela
            key={i}
            cx={11.25 + Math.cos(a) * 4.2}
            cy={11.9 + Math.sin(a) * 4.2}
            r={0.75}
            fill="#F7D116"
          />
        );
      })}
    </>
  ),
  mexico: (
    <>
      <rect width={10} height={20} fill="#006847" />
      <rect x={10} width={10} height={20} fill="#FFFFFF" />
      <rect x={20} width={10} height={20} fill="#CE1126" />
      <circle cx={15} cy={10} r={2.6} fill="#8C5A2B" />
      <path
        d="M12.4 11.6 Q15 14 17.6 11.6"
        stroke="#006847"
        strokeWidth={0.8}
        fill="none"
      />
    </>
  ),
  israel: (
    <>
      <rect width={30} height={20} fill="#FFFFFF" />
      <rect y={2} width={30} height={3} fill="#0038B8" />
      <rect y={15} width={30} height={3} fill="#0038B8" />
      <polygon
        points="15,6.2 18.3,11.9 11.7,11.9"
        fill="none"
        stroke="#0038B8"
        strokeWidth={0.8}
      />
      <polygon
        points="15,13.8 18.3,8.1 11.7,8.1"
        fill="none"
        stroke="#0038B8"
        strokeWidth={0.8}
      />
    </>
  ),
  croacia: (
    <>
      <rect width={30} height={6.67} fill="#FF0000" />
      <rect y={6.67} width={30} height={6.67} fill="#FFFFFF" />
      <rect y={13.33} width={30} height={6.67} fill="#171796" />
      <rect
        x={11.5}
        y={5.2}
        width={7}
        height={8.4}
        fill="#FFFFFF"
        stroke="#FF0000"
        strokeWidth={0.4}
      />
      {Array.from({ length: 20 }, (_, i) => {
        const cx = i % 5;
        const cy = Math.floor(i / 5);
        return (cx + cy) % 2 === 0 ? (
          <rect
            key={i}
            x={11.5 + cx * 1.4}
            y={5.2 + cy * 1.4}
            width={1.4}
            height={1.4}
            fill="#FF0000"
          />
        ) : null;
      })}
      <path
        d="M11.5 10.8 L11.5 11.6 Q15 15.6 18.5 11.6 L18.5 10.8 Z"
        fill="#FF0000"
        opacity={0.85}
      />
    </>
  ),
  indonesia: (
    <>
      <rect width={30} height={10} fill="#CE1126" />
      <rect y={10} width={30} height={10} fill="#FFFFFF" />
    </>
  ),
  portugal: (
    <>
      <rect width={12} height={20} fill="#006600" />
      <rect x={12} width={18} height={20} fill="#FF0000" />
      <circle
        cx={12}
        cy={10}
        r={4.4}
        fill="none"
        stroke="#FFCC00"
        strokeWidth={1.2}
      />
      <path
        d="M9.9 7.6 h4.2 v3.6 q0 2 -2.1 2.6 q-2.1 -0.6 -2.1 -2.6 Z"
        fill="#FFFFFF"
        stroke="#FF0000"
        strokeWidth={0.5}
      />
      <rect x={11.4} y={8.6} width={1.2} height={3} fill="#003399" />
    </>
  ),
  nigeria: (
    <>
      <rect width={10} height={20} fill="#008751" />
      <rect x={10} width={10} height={20} fill="#FFFFFF" />
      <rect x={20} width={10} height={20} fill="#008751" />
    </>
  ),
};

export const Bandeira: React.FC<{
  readonly pais: PaisId;
  readonly largura: number;
  readonly raio?: number;
  readonly style?: React.CSSProperties;
}> = ({ pais, largura, raio = 0, style }) => (
  <svg
    width={largura}
    height={(largura * 2) / 3}
    viewBox="0 0 30 20"
    style={{
      display: "block",
      borderRadius: raio,
      overflow: "hidden",
      ...style,
    }}
  >
    {desenho[pais]}
  </svg>
);
