/**
 * ATO 1 — O CHAMADO (0–19,8 s). Sem narração.
 * Escuridão → feixe de luz com poeira → "UMADSAL 2027" → silêncio com lampejos
 * → impacto: ARREPENDEI-VOS (lettering oficial) com halo, raios e brasas.
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import {
  Flash,
  LightRays,
  Particles,
  Shine,
  useLayout,
  useProgress,
} from "../../../motion";
import { COR } from "../marca";
import { HIT, txt, useAbs, useRel } from "../tempo";
import { Halo, Lettering, TextoMarca, useTremor } from "../ui";

export const Abertura: React.FC = () => {
  const abs = useAbs();
  const rel = useRel();
  const { px } = useLayout();
  const t = txt("umadsal2027");
  // feixe de luz nasce devagar e some antes do silêncio
  const feixe = interpolate(abs, [0.6, 5.5, 8.4, 9.3], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const linha = interpolate(
    abs,
    [t.inicio + 0.5, t.inicio + 1.4, t.fim - 0.6, t.fim - 0.2],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  // lampejos subliminares do lettering durante o crescendo (2–3 quadros cada)
  const lampejo = [9.9, 10.32, 10.58].some((x) => abs >= x && abs < x + 0.08)
    ? 1
    : 0;
  return (
    <AbsoluteFill style={{ background: COR.preto }}>
      <AbsoluteFill style={{ opacity: feixe }}>
        <LightRays
          origin={[0.3, -0.25]}
          direction={168}
          spread={26}
          rays={9}
          reach={1.25}
          intensity={0.32}
          color={COR.luz}
          spin={0.4}
          softness={18}
          fadeIn={0.1}
        />
        <Particles
          count={70}
          area={[0.12, 0.0, 0.62, 1]}
          angle={-75}
          speed={7}
          wobble={10}
          size={[1.4, 4]}
          opacity={[0.08, 0.55]}
          color={COR.luz}
          fadeIn={3}
          delay={rel(1)}
          seed="poeira-abertura"
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: px(26),
        }}
      >
        <Shine at={rel(t.inicio + 1.0)} duration={1.6} intensity={2.4}>
          <TextoMarca
            texto={t.texto}
            de={t.inicio}
            ate={t.fim}
            size={44}
            tracking="0.62em"
            stagger={0.06}
          />
        </Shine>
        <div
          style={{
            width: px(420 * linha),
            height: px(1.5),
            background: COR.marfim,
            opacity: 0.45,
          }}
        />
      </AbsoluteFill>
      {lampejo ? (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: 0.5,
            transform: "scale(1.15)",
          }}
        >
          <Lettering altura={760} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

export const Arrependei: React.FC = () => {
  const rel = useRel();
  const T = rel(HIT.arrependei);
  const entrada = useProgress({
    start: T,
    duration: 0.55,
    easing: "enterStrong",
  });
  const empurra = useProgress({
    start: T + 0.4,
    duration: 8.4,
    easing: "camera",
  });
  const halo = useProgress({ start: T, duration: 1.4, easing: "enterSoft" });
  const tremor = useTremor(HIT.arrependei, 16, 0.5);
  const { px } = useLayout();
  const escala = (1.22 - 0.22 * entrada) * (1 + 0.06 * empurra);
  return (
    <AbsoluteFill style={{ background: COR.preto }}>
      <AbsoluteFill style={{ transform: tremor }}>
        <Halo size={1500} intensidade={1.6 - 0.75 * halo} />
        <LightRays
          origin={[0.5, 0.5]}
          spread={360}
          rays={26}
          reach={0.75}
          intensity={0.3}
          color="#FFB36B"
          spin={2.5}
          softness={14}
          delay={T}
          fadeIn={0.5}
          seed="gloria"
        />
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div
            style={{
              transform: `scale(${escala})`,
              opacity: entrada,
              filter: `blur(${px((1 - entrada) * 18)}px)`,
            }}
          >
            <Lettering
              altura={720}
              style={{
                filter: `drop-shadow(0 0 ${px(40)}px rgba(223,18,35,0.35))`,
              }}
            />
          </div>
        </AbsoluteFill>
        <Particles
          count={46}
          angle={-90}
          speed={46}
          wobble={18}
          size={[2, 5.5]}
          opacity={[0.25, 0.9]}
          color="#FF8A3D"
          delay={T + 0.15}
          fadeIn={0.6}
          seed="brasas"
        />
      </AbsoluteFill>
      <Flash at={[T]} decay={0.55} />
    </AbsoluteFill>
  );
};
