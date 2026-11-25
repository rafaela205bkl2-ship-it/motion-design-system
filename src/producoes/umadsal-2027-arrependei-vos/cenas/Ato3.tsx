/**
 * ATO 3 — A IDENTIDADE (103,5–128,5 s). Narração N10–N12.
 * Match cut: a mão pintada do Criador vira a mão gravada da estampa 2027.
 * Retorno (Rembrandt) → "É tempo": revelações progressivas da identidade
 * (gravura, estrelas, paleta, lettering) e montagem acelerada até o silêncio.
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { CameraPlate, Flash, LightRays, Particles } from "../../../motion";
import { COR, IMG } from "../marca";
import { HIT, Plano, txt, useAbs, useRel } from "../tempo";
import { Grade, Rotulo, TextoMarca } from "../ui";

export const Ecoa: React.FC = () => {
  const rel = useRel();
  const abs = useAbs();
  const mix = interpolate(abs, [105.0, 106.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t * t * (3 - 2 * t),
  });
  return (
    <AbsoluteFill style={{ background: COR.preto }}>
      <AbsoluteFill style={{ opacity: 1 - mix }}>
        <CameraPlate
          src={IMG.adao.src}
          size={IMG.adao.size}
          filter="sepia(0.32) saturate(0.95) contrast(1.1)"
          keys={[
            { t: 0, x: 0.45, y: 0.41, zoom: 2.9, rotate: 0 },
            { t: rel(104.6), rotate: 0 },
            { t: rel(106.3), x: 0.44, y: 0.42, zoom: 3.2, rotate: -26 },
          ]}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: mix }}>
        <CameraPlate
          src={IMG.camisas.src}
          size={IMG.camisas.size}
          keys={[
            { t: rel(105.0), x: 0.372, y: 0.49, zoom: 2.7, rotate: 10 },
            { t: rel(106.3), x: 0.37, y: 0.5, zoom: 2.6, rotate: 0 },
            { t: rel(108.4), x: 0.355, y: 0.545, zoom: 2.15, rotate: 0 },
          ]}
        />
        <Grade forca={0} escurecer={0.12} />
      </AbsoluteFill>
      <Particles
        count={36}
        angle={-100}
        speed={8}
        size={[1.5, 3.5]}
        opacity={[0.1, 0.5]}
        color={COR.luz}
        seed="ecoa"
      />
    </AbsoluteFill>
  );
};

export const Voltar: React.FC = () => {
  const rel = useRel();
  return (
    <AbsoluteFill style={{ background: COR.preto }}>
      <CameraPlate
        src={IMG.prodigo.src}
        size={IMG.prodigo.size}
        filter="contrast(1.12) saturate(0.95) brightness(1.1)"
        keys={[
          { t: 0, x: 0.28, y: 0.585, zoom: 2.4 },
          { t: rel(112), x: 0.28, y: 0.52, zoom: 1.8 },
          { t: rel(116.4), x: 0.3, y: 0.44, zoom: 1.3 },
        ]}
      />
      <LightRays
        origin={[-0.08, 0.05]}
        direction={118}
        spread={36}
        rays={9}
        reach={1.3}
        intensity={0.32}
        color={COR.luz}
        fadeIn={2}
        seed="voltar"
      />
      <Particles
        count={40}
        area={[0, 0, 0.7, 1]}
        angle={-70}
        speed={6}
        size={[1.5, 3.5]}
        opacity={[0.1, 0.5]}
        color={COR.luz}
        seed="poeira-voltar"
      />
      <Rotulo
        texto="REMBRANDT · O RETORNO DO FILHO PRÓDIGO · c. 1669"
        de={109.6}
        ate={114.6}
      />
    </AbsoluteFill>
  );
};

type Detalhe = {
  img: { src: string; size: readonly [number, number] };
  de: number;
  ate: number;
  x: number;
  y: number;
  z: number;
  x2?: number;
  y2?: number;
  z2?: number;
};

const DETALHES: Detalhe[] = [
  // revelações progressivas (uma por frase)
  {
    img: IMG.camisas,
    de: 116.0,
    ate: 117.0,
    x: 0.43,
    y: 0.36,
    z: 2.6,
    z2: 2.75,
  },
  {
    img: IMG.camisas,
    de: 117.0,
    ate: 120.0,
    x: 0.335,
    y: 0.6,
    z: 2.5,
    z2: 2.85,
    y2: 0.585,
  },
  {
    img: IMG.paleta,
    de: 120.0,
    ate: 123.0,
    x: 0.44,
    y: 0.45,
    z: 1.45,
    x2: 0.56,
    y2: 0.5,
    z2: 1.7,
  },
  {
    img: IMG.paleta,
    de: 123.0,
    ate: 124.5,
    x: 0.625,
    y: 0.47,
    z: 2.5,
    z2: 2.75,
  },
  // montagem acelerada até o silêncio do clímax
  { img: IMG.camisas, de: 124.5, ate: 125.0, x: 0.47, y: 0.51, z: 2.9 },
  { img: IMG.paleta, de: 125.0, ate: 125.5, x: 0.48, y: 0.33, z: 2.4 },
  { img: IMG.camisas, de: 125.5, ate: 125.875, x: 0.44, y: 0.64, z: 2.4 },
  { img: IMG.adao, de: 125.875, ate: 126.25, x: 0.38, y: 0.45, z: 3.0 },
  { img: IMG.paleta, de: 126.25, ate: 126.5, x: 0.52, y: 0.66, z: 2.4 },
  { img: IMG.prodigo, de: 126.5, ate: 126.75, x: 0.28, y: 0.59, z: 2.6 },
  { img: IMG.camisas, de: 126.75, ate: 127.0, x: 0.42, y: 0.26, z: 2.9 },
  { img: IMG.paleta, de: 127.0, ate: 127.125, x: 0.38, y: 0.6, z: 2.4 },
  { img: IMG.camisas, de: 127.125, ate: 127.25, x: 0.36, y: 0.815, z: 2.9 },
  { img: IMG.masaccio, de: 127.25, ate: 127.375, x: 0.5, y: 0.76, z: 1.1 },
  { img: IMG.camisas, de: 127.375, ate: 127.5, x: 0.66, y: 0.38, z: 2.6 },
];

const DetalhePlate: React.FC<{ d: Detalhe }> = ({ d }) => {
  const rel = useRel();
  return (
    <CameraPlate
      src={d.img.src}
      size={d.img.size}
      easing="linear"
      keys={[
        { t: 0, x: d.x, y: d.y, zoom: d.z },
        {
          t: rel(d.ate),
          x: d.x2 ?? d.x,
          y: d.y2 ?? d.y,
          zoom: d.z2 ?? d.z * 1.05,
        },
      ]}
    />
  );
};

export const ETempo: React.FC = () => {
  const rel = useRel();
  const abs = useAbs();
  const sombra = interpolate(
    abs,
    [116.8, 117.2, 123.0, 123.3, 124.9, 125.2],
    [0, 1, 1, 1.35, 1.35, 0.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill style={{ background: COR.preto }}>
      {DETALHES.map((d, i) => (
        <Plano
          key={i}
          de={d.de}
          ate={d.ate}
          entra={i === 0 ? 0.5 : 0}
          nome={`detalhe-${i}`}
        >
          <DetalhePlate d={d} />
        </Plano>
      ))}
      {/* sombra central para a leitura das palavras */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 60%, transparent 80%)",
          opacity: sombra,
        }}
      />
      {(["tempo1", "tempo2", "tempo3"] as const).map((id) => {
        const t = txt(id);
        return (
          <AbsoluteFill
            key={id}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <TextoMarca
              texto={t.texto}
              de={t.inicio}
              ate={t.fim}
              size={100}
              tracking="0.32em"
              color={id === "tempo3" ? COR.vermelho : COR.marfim}
              stagger={0.03}
            />
          </AbsoluteFill>
        );
      })}
      <Flash
        at={[HIT.tempo1, HIT.tempo2, HIT.tempo3].map(rel)}
        peak={0.35}
        decay={0.4}
      />
      <Flash
        at={[124.5, 125, 125.5, 126, 126.25, 126.5, 126.75, 127].map(rel)}
        peak={0.14}
        decay={0.1}
      />
    </AbsoluteFill>
  );
};
