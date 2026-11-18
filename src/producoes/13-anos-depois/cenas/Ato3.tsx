/** Ato 3 — O novo mundo (cenas 9–13). Travessia: o ponto de luz vira o sol de uma nova cidade. */
import React from "react";
import { AbsoluteFill } from "remotion";
import {
  Atmosphere,
  Backdrop,
  CameraMove,
  Grade,
  HudFrame,
  LensFlare,
  MissionCard,
  VolumetricLight,
  DepthType,
  FloatingShapes,
  FootageCard,
  KineticWord,
  LightSweep,
  MotionProvider,
  Particles,
  Plane3D,
  Stage3D,
  particleShapes,
  useLayout,
} from "../../../motion";
import type { CenaProps } from "../../_runtime/ProducaoGenerica";
import { CidadeNoite, PLACAS, Placa, PorDoSol, RuaArtDeco } from "../cenarios";
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
          <Atmosphere color="#FF9A6B" density={0.5} from={0.55} to={0.7} drift={26} seed={12} />
          <VolumetricLight x={540} y={1000} direction={0} spread={320} rays={22} color="rgba(255,190,140,0.55)" intensity={kf(t, [1.8, 3.0], [0, 0.7])} reach={1500} />
        </CameraMove>
      </AbsoluteFill>
      <LensFlare x={540} y={kf(t, [0, 4], [1040, 990])} intensity={kf(t, [1.6, 2.8], [0, 0.6])} color="#FFD08A" />
      <Particles from={ORIGEM} to={DESTINO} start={0.15} duration={2.1} spread={0.4} swirl={160} size={[4, 11]} colors={[COR.laranja, COR.rosa, "#FFE08A"]} opacity={kf(t, [2.4, 3.4], [1, 0.25])} />
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(11,10,16,0.55), rgba(11,10,16,0) 35%)" }} />
      <Grade highlights="#FF9A6B" shadows="#2A1745" amount={0.4} vignette={0.45} />
      <Frase serif texto="Uma cidade" topo={330} size={96} delay={1.9} color={COR.creme} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 450 }}>
        <KineticWord text="*renasce.*" size={230} delay={2.15} highlight={COR.rosa} />
      </AbsoluteFill>
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
        <CameraMove from={{ scale: 1.12 }} to={{ scale: 1.03 }} duration={3}>
          <RuaArtDeco
            cam={kf(t, [0, 3], [-120, 140], "camera")}
            atras={
              <AbsoluteFill style={{ alignItems: "center", paddingTop: 250 }}>
                <KineticWord text="VICE" size={430} delay={0.55} stagger={0.07} duration={0.8} color={COR.rosa} tracking="-0.05em" />
              </AbsoluteFill>
            }
          />
          <VolumetricLight x={780} y={1060} direction={0} spread={300} rays={20} color="rgba(255,214,170,0.5)" intensity={0.55} reach={1500} />
          <Atmosphere color="#FFC49A" density={0.4} from={0.55} to={0.75} drift={30} seed={14} />
        </CameraMove>
        <LensFlare x={kf(t, [0, 3], [700, 900])} y={1060} intensity={0.5} />
      </AbsoluteFill>
      <Stage3D>
        <Plane3D x={cx} rotateY={kf(t, [0.15, 1.3], [-25, 25])} opacity={kf(t, [0.1, 0.2, 1.2, 1.35], [0, 1, 1, 0])}>
          <FootageCard width={300} height={1500} radius={60} background={`linear-gradient(180deg, ${COR.rosa}, ${COR.laranja})`} shadow={0.8} sheen={0.5} />
        </Plane3D>
      </Stage3D>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, transparent 52%, rgba(11,10,16,0.62) 60%, rgba(11,10,16,0.62) 72%, transparent 80%)" }} />
      <Frase texto="Novas histórias *começam*." topo={1150} size={116} delay={1.15} color={COR.creme} highlightColor={COR.creme} />
      <AbsoluteFill style={{ justifyContent: "flex-start", paddingLeft: 80, paddingTop: 650 }}>
        <MissionCard label="Capítulo 01" title="Uma nova cidade" delay={1.5} accent={COR.rosa} width={600} progress={0.15} />
      </AbsoluteFill>
      <Grade highlights="#FFC49A" shadows="#3A2A65" amount={0.35} vignette={0.4} />
    </MotionProvider>
  );
};

/** Conteúdo abstrato de um cartão de personagem: luz, horizonte e o nome. Nenhuma figura. */
const CartaoNome: React.FC<{ readonly nome: string; readonly numero: string; readonly cores: [string, string, string]; readonly slot: string }> = ({ nome, numero, cores, slot }) => {
  const { px } = useLayout();
  if (PLACAS[slot]) {
    // placa fornecida pela usuária: imagem + nome por cima
    return (
      <AbsoluteFill>
        <Placa slot={slot}>{null}</Placa>
        <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(11,10,16,0.85) 0%, rgba(11,10,16,0) 45%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: px(48), textAlign: "center", fontFamily: "inherit", fontSize: px(92), fontWeight: 800, letterSpacing: "-0.03em", color: COR.creme }}>{nome}</div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <RuaArtDeco cam={numero === "01" ? -220 : 260} carro={numero === "01"} />
      <AbsoluteFill style={{ background: `linear-gradient(170deg, ${cores[0]}AA 0%, ${cores[1]}55 50%, ${cores[2]}EE 100%)` }} />
      <div style={{ position: "absolute", left: px(36), top: px(32), fontFamily: "inherit", fontSize: px(24), fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,245,230,0.9)" }}>PERSONAGEM {numero}</div>
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
        <FloatingShapes
          enter="scale"
          shapes={[
            { kind: "ring", x: -420, y: -260, z: -200, size: 120, color: COR.laranja, delay: 0.9, spin: 50 },
            { kind: "disc", x: 420, y: 330, z: 260, size: 110, color: COR.rosa, delay: 1.0, spin: 80 },
            { kind: "pill", x: 20, y: -330, z: 320, size: 80, color: COR.creme, delay: 1.1, rz: 30 },
            { kind: "cube", x: -420, y: 300, z: 180, size: 90, color: "#7B4BD6", delay: 1.2 },
            { kind: "tile", x: 430, y: -200, z: -260, size: 100, color: COR.oceano, delay: 1.3 },
          ]}
        />
        <Plane3D x={-230 - (1 - a) * 600} y={60} rotateY={95 * (1 - a) + 10} rotateZ={-3 * a} opacity={kf(t, [0.15, 0.4], [0, 1])}>
          <div style={{ fontFamily: tema.fonts.display }}>
            <FootageCard width={420} height={640} radius={36} edge="rgba(255,240,220,0.5)" sheen={kf(t, [1.6, 2.5], [0, 1])} shadow={0.8}>
              <CartaoNome slot="cartao-jason" nome="Jason" numero="01" cores={["#3A1B52", COR.laranja, "#2A1745"]} />
            </FootageCard>
          </div>
        </Plane3D>
        <Plane3D x={230 + (1 - b) * 600} y={60} rotateY={-95 * (1 - b) - 10} rotateZ={3 * b} opacity={kf(t, [0.45, 0.7], [0, 1])}>
          <div style={{ fontFamily: tema.fonts.display }}>
            <FootageCard width={420} height={640} radius={36} edge="rgba(255,240,220,0.5)" sheen={kf(t, [1.8, 2.7], [0, 1])} shadow={0.8}>
              <CartaoNome slot="cartao-lucia" nome="Lucia" numero="02" cores={["#1D2C56", COR.rosa, "#3A1B52"]} />
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
        <Atmosphere color="#7B4BD6" density={0.45} from={0.5} to={0.75} drift={22} seed={16} />
        <VolumetricLight x={260} y={1300} direction={kf(t, [0, 3], [-20, 10])} spread={14} rays={2} color="rgba(220,200,255,0.5)" intensity={0.6} reach={1500} softness={10} seed={4} />
        <VolumetricLight x={860} y={1300} direction={kf(t, [0, 3], [25, -5])} spread={14} rays={2} color="rgba(255,190,220,0.45)" intensity={0.55} reach={1500} softness={10} seed={8} />
      </CameraMove>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(11,10,16,0.55), rgba(11,10,16,0) 60%)" }} />
      <Frase serif texto="Além de tudo que" topo={600} size={88} delay={0.1} color={COR.creme} />
      <Stage3D>
        <Plane3D y={-180} z={kf(t, [0.4, 1.4], [-500, 0], "enterStrong")} rotateX={kf(t, [0.4, 3], [18, 6])} opacity={kf(t, [0.4, 0.7], [0, 1])}>
          <DepthType text="conhecemos." size={150} depth={36} layers={10} color={COR.rosa} sideLight="#B33C7A" sideDark="#2A1238" sheen={kf(t, [1.5, 2.4], [0, 1])} />
        </Plane3D>
      </Stage3D>
      <LightSweep delay={1.5} duration={0.9} color="rgba(255,190,150,0.25)" />
      <HudFrame label="VICE CITY" sublabel="23:14 · AO VIVO" delay={0.2} rec />
      <Grade highlights="#B06AD0" shadows="#0B0A1A" amount={0.4} vignette={0.5} />
    </MotionProvider>
  );
};
