/** Ato 4 — A nova era (cenas 14–16). O ritmo sobe: estrada, helicóptero, montagem em cartões. */
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, CameraMove, FootageCard, MotionProvider, Plane3D, Stage3D, useLayout } from "../../../motion";
import type { CenaProps } from "../../_runtime/ProducaoGenerica";
import { CidadeNoite, Estrada, PorDoSol, Praia } from "../cenarios";
import { Frase, kf, useT } from "../kit";
import { COR } from "../tema";

/** Cena 14: estrada em velocidade; a frase treme junto com a câmera. */
export const C14Talvez: React.FC<CenaProps> = ({ tema }) => {
  const t = useT();
  const sx = Math.sin(t * 23) * 3 + Math.sin(t * 37) * 2;
  const sy = Math.cos(t * 29) * 3;
  return (
    <MotionProvider theme={tema}>
      <CameraMove from={{ scale: 1.06, x: sx, y: sy }} to={{ scale: 1.14, x: sx, y: sy }} duration={2.5}>
        <Estrada />
        <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(11,10,16,0.55), rgba(11,10,16,0) 45%)" }} />
        <Frase texto="Talvez a maior viagem" topo={520} size={124} delay={0.1} color={COR.creme} />
      </CameraMove>
    </MotionProvider>
  );
};

/** Cena 15: helicóptero sobre a cidade; quadrados giram e fecham a tela. */
export const C15ViceCity: React.FC<CenaProps> = ({ tema }) => {
  const t = useT();
  const { px } = useLayout();
  return (
    <MotionProvider theme={tema}>
      <CameraMove from={{ scale: 1.02 }} to={{ scale: 1.1, x: -40 }} duration={3}>
        <CidadeNoite helicoptero />
      </CameraMove>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(11,10,16,0.5), rgba(11,10,16,0) 60%)" }} />
      <Frase serif texto="não seja por" topo={640} size={88} delay={0.05} color={COR.creme} />
      <Frase texto="*Vice City*." topo={750} size={160} delay={0.3} color={COR.creme} highlightColor={COR.rosa} />
      {[0, 1, 2].map((i) => {
        const p = kf(t, [2.1 + i * 0.12, 2.95], [0, 1], "wipe");
        if (p <= 0) return null;
        const s = px(120 + p * 2600);
        return (
          <AbsoluteFill key={i} style={{ alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                width: s,
                height: s,
                transform: `rotate(${45 + p * 90 * (i % 2 ? -1 : 1)}deg)`,
                border: `${px(18 + i * 10)}px solid ${[COR.rosa, COR.laranja, COR.creme][i]}`,
                background: i === 2 && p > 0.7 ? COR.noite : "transparent",
              }}
            />
          </AbsoluteFill>
        );
      })}
    </MotionProvider>
  );
};

/** Cena 16: cartões atravessam um palco 3D em direção à câmera. */
export const C16Perceber: React.FC<CenaProps> = ({ tema }) => {
  const t = useT();
  const cartoes = [<CidadeNoite key="a" />, <Estrada key="b" />, <PorDoSol key="c" />, <Praia key="d" clima="nova" />, <CidadeNoite key="e" helicoptero />];
  return (
    <MotionProvider theme={tema}>
      <Backdrop glows={[{ x: 0.5, y: 0.55, size: 1300, color: COR.rosa, opacity: 0.3 }]} grain={0.12} />
      <Stage3D perspective={1100}>
        {cartoes.map((c, i) => {
          const s = 0.15 + i * 0.55;
          const z = kf(t, [s, s + 1.25], [-2600, 900], "linear");
          const op = kf(t, [s, s + 0.2, s + 1.0, s + 1.25], [0, 1, 1, 0]);
          if (op <= 0) return null;
          return (
            <Plane3D key={i} x={i % 2 ? 170 : -170} y={80} z={z} rotateY={i % 2 ? -14 : 14} rotateZ={i % 2 ? 3 : -3} opacity={op}>
              <FootageCard width={560} height={760} radius={36} edge="rgba(255,240,220,0.35)" shadow={0.7}>
                {c}
              </FootageCard>
            </Plane3D>
          );
        })}
      </Stage3D>
      <Frase texto="Talvez seja perceber" topo={250} size={110} delay={0.1} color={COR.creme} />
    </MotionProvider>
  );
};
