/** Ato 3 — O novo mundo (cenas 9–13). Travessia: o ponto de luz vira o sol de uma nova cidade. */
import React from "react";
import { AbsoluteFill } from "remotion";
import {
  Backdrop,
  CameraMove,
  DepthType,
  FootageCard,
  LightSweep,
  MotionProvider,
  Particles,
  Plane3D,
  Stage3D,
  particleShapes,
  useLayout,
} from "../../../motion";
import type { CenaProps } from "../../_runtime/ProducaoGenerica";
import { CidadeNoite, PorDoSol, Praia } from "../cenarios";
import { Frase, PontoDeLuz, kf, useT } from "../kit";
import { COR } from "../tema";

/** Cena 9: silêncio. Só o ponto de luz respira. */
export const C9Silencio: React.FC<CenaProps> = ({ tema }) => {
  const t = useT();
  return (
    <MotionProvider theme={tema}>
      <AbsoluteFill style={{ background: COR.noite }} />
      <PontoDeLuz raio={22 + Math.sin(t * 3.2) * 3 + kf(t, [1.4, 2], [0, 14], "wipe")} cor={COR.laranja} />
      <Frase serif texto="Então, o *silêncio* acabou." topo={1180} size={84} delay={0.3} color={COR.creme} highlightColor={COR.laranja} />
    </MotionProvider>
  );
};

const N = 360;
const ORIGEM = particleShapes.disc(N, 0.5, 0.5, 0.03, 9 / 16, 21);
const DESTINO = [
  ...particleShapes.disc(Math.round(N * 0.6), 0.5, 0.52, 0.24, 9 / 16, 22),
  ...particleShapes.line(N - Math.round(N * 0.6), 0.625, 0.02, 0.98, 0.006, 23),
];

/** Cena 10: partículas saem do ponto e formam o sol e o horizonte; a cidade nova aparece. */
export const C10Renasce: React.FC<CenaProps> = ({ tema }) => {
  const t = useT();
  return (
    <MotionProvider theme={tema}>
      <AbsoluteFill style={{ background: COR.noite }} />
      <AbsoluteFill style={{ opacity: kf(t, [0.9, 2.4], [0, 1]) }}>
        <CameraMove from={{ scale: 1.18 }} to={{ scale: 1.02 }} duration={4} originY={0.52}>
          <PorDoSol sol={kf(t, [1.2, 2.6], [0, 1])} />
        </CameraMove>
      </AbsoluteFill>
      <Particles from={ORIGEM} to={DESTINO} start={0.15} duration={2.1} spread={0.4} swirl={160} size={[4, 11]} colors={[COR.laranja, COR.rosa, "#FFE08A"]} opacity={kf(t, [2.4, 3.4], [1, 0.25])} />
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(11,10,16,0.55), rgba(11,10,16,0) 35%)" }} />
      <Frase texto="Uma cidade *renasce*." topo={380} size={124} delay={2.0} color={COR.creme} highlightColor={COR.rosa} />
    </MotionProvider>
  );
};

/** Cena 11: um cartão atravessa a tela e revela a praia da nova cidade. */
export const C11NovasHistorias: React.FC<CenaProps> = ({ tema }) => {
  const t = useT();
  const cx = kf(t, [0.15, 1.3], [820, -820], "camera");
  const revela = Math.max(0, Math.min(100, ((cx + 540) / 1080) * 100));
  return (
    <MotionProvider theme={tema}>
      <PorDoSol />
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${revela}%)` }}>
        <CameraMove from={{ scale: 1.1 }} to={{ scale: 1.02 }} duration={3}>
          <Praia clima="nova" />
        </CameraMove>
      </AbsoluteFill>
      <Stage3D>
        <Plane3D x={cx} rotateY={kf(t, [0.15, 1.3], [-25, 25])} opacity={kf(t, [0.1, 0.2, 1.2, 1.35], [0, 1, 1, 0])}>
          <FootageCard width={300} height={1500} radius={60} background={`linear-gradient(180deg, ${COR.rosa}, ${COR.laranja})`} shadow={0.8} sheen={0.5} />
        </Plane3D>
      </Stage3D>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(11,10,16,0.5), rgba(11,10,16,0) 32%)" }} />
      <Frase texto="Novas histórias *começam*." topo={360} size={116} delay={1.15} color={COR.creme} highlightColor={COR.creme} />
    </MotionProvider>
  );
};

/** Conteúdo abstrato de um cartão de personagem: luz, horizonte e o nome. Nenhuma figura. */
const CartaoNome: React.FC<{ readonly nome: string; readonly numero: string; readonly cores: [string, string, string] }> = ({ nome, numero, cores }) => {
  const { px } = useLayout();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(170deg, ${cores[0]} 0%, ${cores[1]} 55%, ${cores[2]} 100%)` }}>
      <div style={{ position: "absolute", left: "50%", top: "38%", width: px(300), height: px(300), marginLeft: px(-150), marginTop: px(-150), borderRadius: "50%", background: "radial-gradient(circle, rgba(255,230,170,0.95), rgba(255,140,90,0.0) 70%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: "58%", height: px(3), background: "rgba(255,240,220,0.6)" }} />
      <div style={{ position: "absolute", left: px(36), top: px(32), fontFamily: "inherit", fontSize: px(30), fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,245,230,0.85)" }}>{numero}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: px(48), textAlign: "center", fontFamily: "inherit", fontSize: px(92), fontWeight: 800, letterSpacing: "-0.03em", color: COR.creme }}>{nome}</div>
    </AbsoluteFill>
  );
};

/** Cena 12: dois cartões entram girando e se encaixam lado a lado. */
export const C12JasonLucia: React.FC<CenaProps> = ({ tema }) => {
  const t = useT();
  const a = kf(t, [0.15, 1.1], [0, 1], "enterStrong");
  const b = kf(t, [0.45, 1.4], [0, 1], "enterStrong");
  return (
    <MotionProvider theme={tema}>
      <Backdrop glows={[{ x: 0.3, y: 0.55, size: 1100, color: COR.laranja, opacity: 0.35 }, { x: 0.75, y: 0.45, size: 1100, color: COR.rosa, opacity: 0.35 }]} grain={0.12} />
      <Frase texto="*Jason* e *Lucia*" topo={330} size={124} delay={0.2} color={COR.creme} highlightColor={COR.rosa} />
      <Stage3D perspective={1400}>
        <Plane3D x={-230 - (1 - a) * 600} y={60} rotateY={95 * (1 - a) + 10} rotateZ={-3 * a} opacity={kf(t, [0.15, 0.4], [0, 1])}>
          <div style={{ fontFamily: tema.fonts.display }}>
            <FootageCard width={420} height={640} radius={36} edge="rgba(255,240,220,0.5)" sheen={kf(t, [1.6, 2.5], [0, 1])} shadow={0.8}>
              <CartaoNome nome="Jason" numero="01" cores={["#3A1B52", COR.laranja, "#2A1745"]} />
            </FootageCard>
          </div>
        </Plane3D>
        <Plane3D x={230 + (1 - b) * 600} y={60} rotateY={-95 * (1 - b) - 10} rotateZ={3 * b} opacity={kf(t, [0.45, 0.7], [0, 1])}>
          <div style={{ fontFamily: tema.fonts.display }}>
            <FootageCard width={420} height={640} radius={36} edge="rgba(255,240,220,0.5)" sheen={kf(t, [1.8, 2.7], [0, 1])} shadow={0.8}>
              <CartaoNome nome="Lucia" numero="02" cores={["#1D2C56", COR.rosa, "#3A1B52"]} />
            </FootageCard>
          </div>
        </Plane3D>
      </Stage3D>
      <Frase serif texto="Prestes a nos levar para um novo mundo." topo={1440} size={58} delay={1.5} color={COR.creme} />
    </MotionProvider>
  );
};

/** Cena 13: a cidade à noite; a luz atravessa a palavra. */
export const C13Alem: React.FC<CenaProps> = ({ tema }) => {
  const t = useT();
  return (
    <MotionProvider theme={tema}>
      <CameraMove from={{ scale: 1.0 }} to={{ scale: 1.1, y: 30 }} duration={3}>
        <CidadeNoite />
      </CameraMove>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(11,10,16,0.55), rgba(11,10,16,0) 60%)" }} />
      <Frase serif texto="Além de tudo que" topo={600} size={88} delay={0.1} color={COR.creme} />
      <Stage3D>
        <Plane3D y={-180} z={kf(t, [0.4, 1.4], [-500, 0], "enterStrong")} rotateX={kf(t, [0.4, 3], [18, 6])} opacity={kf(t, [0.4, 0.7], [0, 1])}>
          <DepthType text="conhecemos." size={150} depth={36} layers={10} color={COR.rosa} sideLight="#B33C7A" sideDark="#2A1238" sheen={kf(t, [1.5, 2.4], [0, 1])} />
        </Plane3D>
      </Stage3D>
      <LightSweep delay={1.5} duration={0.9} color="rgba(255,190,150,0.25)" />
    </MotionProvider>
  );
};
