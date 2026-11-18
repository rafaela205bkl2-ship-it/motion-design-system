/** Ato 5 — O momento chegou (cenas 17–21). Silêncio: azul-noite, um único acento laranja. */
import React from "react";
import { AbsoluteFill, getInputProps } from "remotion";
import {
  Backdrop,
  DepthType,
  FilmLook,
  FloatingShapes,
  KineticWord,
  FootageCard,
  MotionProvider,
  Particles,
  Plane3D,
  Stage3D,
  particleShapes,
  useLayout,
} from "../../../motion";
import type { CenaProps } from "../../_runtime/ProducaoGenerica";
import { CidadeAntiga, RuaArtDeco } from "../cenarios";
import { Frase, kf, useT } from "../kit";
import { COR, SERIF } from "../tema";

/**
 * Encerramento antes ou depois do lançamento (19/11/2026).
 * Renderize com --props='{"posLancamento":true}' para a versão pós-lançamento.
 */
const posLancamento = () => Boolean((getInputProps() as { posLancamento?: boolean }).posLancamento);

const Noite: React.FC = () => (
  <Backdrop color={COR.azulNoite} glows={[{ x: 0.5, y: 0.95, size: 1500, color: "#2B4C9B", opacity: 0.45 }]} grain={0.12} vignette={0.3} />
);

const Etiqueta: React.FC<{ readonly texto: string }> = ({ texto }) => {
  const { px } = useLayout();
  return <div style={{ fontSize: px(64), fontWeight: 800, color: COR.creme, letterSpacing: "-0.03em" }}>{texto}</div>;
};

/** Cena 17: 2013 e 2026 lado a lado; a câmera recua devagar. */
export const C17QuantoTempo: React.FC<CenaProps> = ({ tema }) => {
  const t = useT();
  return (
    <MotionProvider theme={tema}>
      <Noite />
      <Stage3D perspective={1500} cameraZ={kf(t, [0, 4], [260, 0])}>
        <Plane3D x={-225} y={-60} rotateY={10} rotateZ={-2} opacity={kf(t, [0, 0.4], [0, 1])}>
          <div style={{ fontFamily: tema.fonts.display }}>
            <FootageCard width={420} height={600} radius={30} shadow={0.8} scrim={0.8} caption={<Etiqueta texto="2013" />}>
              <CidadeAntiga />
              <FilmLook intensity={0.9} tint="#E8A25C" />
            </FootageCard>
          </div>
        </Plane3D>
        <Plane3D x={225} y={-60} rotateY={-10} rotateZ={2} opacity={kf(t, [0.25, 0.65], [0, 1])}>
          <div style={{ fontFamily: tema.fonts.display }}>
            <FootageCard width={420} height={600} radius={30} shadow={0.8} scrim={0.8} caption={<Etiqueta texto="2026" />}>
              <RuaArtDeco cam={120} />
            </FootageCard>
          </div>
        </Plane3D>
      </Stage3D>
      <Frase texto="quanto *tempo* passou" topo={1330} size={112} delay={0.8} color={COR.creme} highlightColor={COR.laranja} />
    </MotionProvider>
  );
};

const POEIRA = particleShapes.scatter(70, 51);

/** Cena 18: poeira de luz e a frase final da narração. */
export const C18UltimaVez: React.FC<CenaProps> = ({ tema }) => (
  <MotionProvider theme={tema}>
    <Noite />
    <Particles from={POEIRA} progress={0} size={[2, 6]} colors={[COR.creme, COR.laranja]} drift={26} twinkle={0.6} opacity={0.6} />
    <Frase serif texto={"desde a última vez\nque estivemos *aqui*."} topo={780} size={96} delay={0.25} color={COR.creme} highlightColor={COR.laranja} />
  </MotionProvider>
);

/** Cena 19: "13" em 3D gira devagar. */
export const C19TrezeAnos: React.FC<CenaProps> = ({ tema }) => {
  const t = useT();
  return (
    <MotionProvider theme={tema}>
      <Noite />
      <Stage3D perspective={1400}>
        <Plane3D y={-160} rotateY={kf(t, [0, 4], [-38, 22], "camera")} rotateX={8} scale={kf(t, [0, 0.8], [0.85, 1], "enterStrong")} opacity={kf(t, [0, 0.4], [0, 1])}>
          <DepthType text="13" size={540} depth={140} layers={20} color={COR.creme} sideLight={COR.laranja} sideDark="#1A1F3A" sheen={kf(t, [1.4, 2.6], [0, 1])} sheenColor="rgba(255,210,170,0.8)" />
        </Plane3D>
      </Stage3D>
      <Stage3D perspective={1400}>
        <FloatingShapes
          enter="scale"
          duration={0.9}
          float={24}
          shapes={[
            { kind: "ring", x: -360, y: -420, z: 240, size: 130, color: COR.laranja, delay: 0.6, spin: 30 },
            { kind: "disc", x: 380, y: -40, z: -220, size: 120, color: COR.oceano, delay: 0.8, spin: 45 },
            { kind: "pill", x: -320, y: 120, z: -160, size: 80, color: COR.creme, delay: 1.0, rz: 20 },
            { kind: "cube", x: 330, y: -520, z: 120, size: 80, color: COR.laranja, delay: 1.2 },
          ]}
        />
      </Stage3D>
      <Frase texto="Treze anos *depois*." topo={1330} size={108} delay={1.0} color={COR.creme} highlightColor={COR.laranja} />
    </MotionProvider>
  );
};

/** Cena 20: a promessa (antes ou depois do lançamento). */
export const C20Continua: React.FC<CenaProps> = ({ tema }) => (
  <MotionProvider theme={tema}>
    <Noite />
    {posLancamento() ? null : <Frase serif texto="Hoje," topo={720} size={100} delay={0.2} color={COR.creme} />}
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 850 }}>
      <KineticWord text={"A história\n*continua.*"} size={150} delay={0.6} stagger={0.04} color={COR.creme} highlight={COR.laranja} />
    </AbsoluteFill>
  </MotionProvider>
);

/** Cena 21: o nome em tipografia própria (não é o logotipo oficial) e a data, parados. */
export const C21Encerramento: React.FC<CenaProps> = ({ tema }) => {
  const t = useT();
  const { px } = useLayout();
  const entra = kf(t, [0.15, 1.3], [0, 1], "enterStrong");
  return (
    <MotionProvider theme={tema}>
      <Backdrop color={COR.azulNoite} glows={[{ x: 0.5, y: 0.62, size: 1500, color: COR.laranja, opacity: 0.22 * entra }]} grain={0.12} vignette={0.35} />
      <Stage3D perspective={1600}>
        <Plane3D y={-140} z={(1 - entra) * -700} rotateX={kf(t, [0, 5], [16, 6])} opacity={entra}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: px(10), transformStyle: "preserve-3d" }}>
            <DepthType text="GRAND THEFT AUTO" size={82} depth={22} layers={8} color={COR.creme} sideLight="#8A6A5A" sideDark="#141A30" tracking="0.02em" />
            <DepthType text="VI" size={360} depth={90} layers={16} color={COR.creme} sideLight={COR.laranja} sideDark="#141A30" sheen={kf(t, [1.4, 2.4], [0, 1])} />
          </div>
        </Plane3D>
      </Stage3D>
      <Frase texto={posLancamento() ? "Desde 19.11.2026" : "19.11.2026"} topo={1200} size={64} delay={1.3} by="char" tracking="0.18em" color={COR.laranja} />
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: px(300) }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: px(30), color: "rgba(244,233,218,0.6)", opacity: kf(t, [1.8, 2.4], [0, 1]), textAlign: "center" }}>
          Produção de fã, não oficial. Sem afiliação com a Rockstar Games.
        </div>
      </AbsoluteFill>
    </MotionProvider>
  );
};
