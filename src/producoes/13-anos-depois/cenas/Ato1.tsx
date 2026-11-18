/** Ato 1 — O tempo passou (cenas 1–4). Memória: 2013, cor quente e lavada, textura de TV. */
import React from "react";
import { AbsoluteFill } from "remotion";
import { CameraMove, CrtReveal, DepthType, FilmLook, MotionProvider, Plane3D, Stage3D } from "../../../motion";
import type { CenaProps } from "../../_runtime/ProducaoGenerica";
import { CidadeAntiga, Colinas, Praia } from "../cenarios";
import { Frase, kf, useT } from "../kit";
import { COR } from "../tema";

const filme = { intensity: 0.8, scanlines: 0.25, grain: 0.35, vignette: 0.55, flicker: 0.3, tint: "#E8A25C" };

/** Cena 1: tela preta, a TV de tubo liga sobre a cidade de 2013. */
export const C1TvLiga: React.FC<CenaProps> = ({ tema }) => (
  <MotionProvider theme={tema}>
    <CrtReveal delay={0.55} duration={0.75}>
      <CidadeAntiga />
      <FilmLook {...filme} intensity={1.2} />
    </CrtReveal>
  </MotionProvider>
);

/** Cena 2: "2013" em 3D em primeiro plano; a avenida corre atrás do número. */
export const C2Ano2013: React.FC<CenaProps> = ({ tema }) => {
  const t = useT();
  const z = kf(t, [0, 1.5], [-1500, 0], "enterStrong");
  const rotY = kf(t, [0, 3.5], [-30, -9]);
  const rotX = kf(t, [0, 3.5], [10, 4]);
  return (
    <MotionProvider theme={tema}>
      <CameraMove from={{ scale: 1.0 }} to={{ scale: 1.1, y: -20 }} duration={3.5} originY={0.6}>
        <CidadeAntiga />
      </CameraMove>
      <Stage3D perspective={1300}>
        <Plane3D y={20} z={z} rotateY={rotY} rotateX={rotX} opacity={kf(t, [0, 0.35], [0, 1])}>
          <DepthType text="2013" size={360} depth={110} layers={18} color={COR.creme} sideLight="#D98E62" sideDark="#3A2833" sheen={kf(t, [1.4, 2.6], [0, 1])} sheenColor="rgba(255,236,200,0.9)" />
        </Plane3D>
      </Stage3D>
      <FilmLook {...filme} />
      <Frase serif texto="Uma geração inteira encontrou um novo mundo." topo={1330} size={58} delay={1.3} color={COR.creme} maxWidth={760} />
    </MotionProvider>
  );
};

/** Cena 3: "diferente." nasce longe, para diante de nós e passa pela câmera. */
export const C3Diferente: React.FC<CenaProps> = ({ tema }) => {
  const t = useT();
  const z = kf(t, [0.3, 1.1, 2.05, 2.5], [-1800, 0, 60, 1300], "camera");
  return (
    <MotionProvider theme={tema}>
      <CameraMove from={{ scale: 1.04 }} to={{ scale: 1.12, x: -30 }} duration={2.5}>
        <Colinas />
      </CameraMove>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(26,18,24,0.15) 15%, rgba(26,18,24,0.62) 30%, rgba(26,18,24,0.5) 52%, rgba(26,18,24,0.1) 70%, rgba(26,18,24,0.45))" }} />
      <Frase serif texto="Tudo parecia" topo={600} size={96} delay={0.05} color={COR.creme} />
      <Stage3D perspective={1100}>
        <Plane3D y={40} z={z} rotateX={kf(t, [0.3, 2.5], [14, -6])} opacity={kf(t, [0.3, 0.6, 2.25, 2.5], [0, 1, 1, 0])}>
          <DepthType text="diferente." size={176} depth={46} layers={12} color={COR.creme} sideLight="#D98E62" sideDark="#3A2833" />
        </Plane3D>
      </Stage3D>
      <FilmLook {...filme} />
    </MotionProvider>
  );
};

/** Cena 4: a frase fica presa à praia e acompanha a panorâmica. */
export const C4OutrosPlanos: React.FC<CenaProps> = ({ tema }) => (
  <MotionProvider theme={tema}>
    <CameraMove from={{ scale: 1.05, x: 30 }} to={{ scale: 1.12, x: -50 }} duration={2.5}>
      <Praia clima="memoria" />
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(26,18,24,0.2) 15%, rgba(26,18,24,0.66) 28%, rgba(26,18,24,0.5) 45%, rgba(26,18,24,0.05) 60%)" }} />
      <Frase serif texto="Outros sonhos." topo={560} size={100} delay={0.05} color={COR.creme} />
      <Frase texto="Outros *planos*." topo={690} size={128} delay={0.45} color={COR.creme} highlightColor={COR.ambar} />
    </CameraMove>
    <AbsoluteFill style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(26,18,24,0.55) 62%, rgba(26,18,24,0.55) 70%, transparent 76%)" }} />
    <Frase serif texto="E muito tempo pela frente." topo={1180} size={58} delay={1.15} color={COR.creme} />
    <FilmLook {...filme} />
  </MotionProvider>
);
