/** Ato 2 — A espera (cenas 5–8). Creme: o ano vira um objeto que rola como odômetro. */
import React from "react";
import { AbsoluteFill } from "remotion";
import {
  Backdrop,
  DepthType,
  FloatingShapes,
  FootageCard,
  Layer,
  MotionProvider,
  ObjectEnter,
  Plane3D,
  RollingNumber,
  Stage3D,
  useLayout,
} from "../../../motion";
import type { CenaProps } from "../../_runtime/ProducaoGenerica";
import { CidadeAntiga, Colinas, Praia } from "../cenarios";
import { Frase, PontoDeLuz, kf, useT } from "../kit";
import { COR } from "../tema";

const Ano: React.FC<{ readonly de: number; readonly para: number; readonly em: number; readonly tamanho?: number }> = ({ de, para, em, tamanho = 300 }) => (
  <RollingNumber
    values={[de, para]}
    times={[em]}
    duration={0.75}
    stagger={0.07}
    size={tamanho}
    renderDigit={(d) => <DepthType text={d} size={tamanho} depth={tamanho * 0.2} layers={12} color="#1A1420" sideLight="#3D5BA8" sideDark="#121A36" />}
  />
);

const FORMAS_ANO = [
  { kind: "cube" as const, x: -330, y: -420, z: 80, size: 120, color: COR.oceano, delay: 0.1 },
  { kind: "disc" as const, x: 340, y: -360, z: 160, size: 130, color: COR.laranja, delay: 0.18, spin: 60 },
  { kind: "pill" as const, x: 330, y: 560, z: 60, size: 90, color: COR.rosa, delay: 0.26, rz: -20 },
  { kind: "tile" as const, x: -330, y: 590, z: -120, size: 110, color: "#7B4BD6", delay: 0.34 },
  { kind: "ring" as const, x: -60, y: -560, z: -260, size: 100, color: COR.laranja, delay: 0.42, spin: 40 },
];

const Fundo: React.FC = () => (
  <Backdrop
    glows={[
      { x: 0.3, y: 0.3, size: 1100, color: "#F7C9A8", opacity: 0.6 },
      { x: 0.75, y: 0.7, size: 900, color: "#CFD8F2", opacity: 0.5 },
    ]}
    grain={0.12}
  />
);

/** Cena 5: 2013 → 2018. */
export const C5Ano2018: React.FC<CenaProps> = ({ tema }) => {
  const t = useT();
  return (
    <MotionProvider theme={tema}>
      <Fundo />
      <Stage3D perspective={1500}>
        <Plane3D y={-60} rotateY={kf(t, [0, 3], [-16, -6])} rotateX={kf(t, [0, 3], [12, 6])} scale={kf(t, [0, 0.5], [0.92, 1], "enterStrong")}>
          <Ano de={2013} para={2018} em={0.4} />
        </Plane3D>
        <FloatingShapes shapes={FORMAS_ANO} enter="scale" />
      </Stage3D>
      <Frase serif texto="Os anos passaram." topo={1230} size={84} delay={0.9} color="#1A1420" />
    </MotionProvider>
  );
};

/** Cena 6: 2018 → 2022; cartões de memória se espalham como fotos. */
export const C6Ano2022: React.FC<CenaProps> = ({ tema }) => {
  const t = useT();
  const cartoes = [
    { x: -250, r: -9, d: 0.35, c: <CidadeAntiga /> },
    { x: 0, r: 2, d: 0.5, c: <Praia clima="memoria" /> },
    { x: 250, r: 10, d: 0.65, c: <Colinas /> },
  ];
  return (
    <MotionProvider theme={tema}>
      <Fundo />
      <Stage3D perspective={1500}>
        <Plane3D y={-470} rotateX={8}>
          <Ano de={2018} para={2022} em={0.2} tamanho={210} />
        </Plane3D>
        {cartoes.map((k, i) => {
          const p = kf(t, [k.d, k.d + 0.7], [0, 1], "enterStrong");
          return (
            <Plane3D key={i} x={k.x * p} y={160 + (1 - p) * 700} z={i * 6} rotateZ={k.r * p + (1 - p) * 25} rotateY={(1 - p) * 70} opacity={kf(t, [k.d, k.d + 0.2], [0, 1])}>
              <FootageCard width={400} height={530} radius={30} edge="#FFFFFF" edgeWidth={10} shadow={0.6}>
                {k.c}
              </FootageCard>
            </Plane3D>
          );
        })}
      </Stage3D>
      <Frase serif texto="Novos consoles. Novas fases da vida." topo={1500} size={58} delay={1.0} color="#1A1420" />
    </MotionProvider>
  );
};

const COMENTARIOS = [
  { txt: "e aí, sai quando?", x: 120, y: 330, d: 0.75 },
  { txt: "já faz quantos anos…", x: 520, y: 470, d: 0.35 },
  { txt: "esse ano vai!", x: 150, y: 620, d: 0.55 },
  { txt: "alguém ainda esperando?", x: 430, y: 1180, d: 0.45 },
  { txt: "trailer quando?", x: 110, y: 1330, d: 0.65 },
  { txt: "cresci esperando isso", x: 470, y: 1460, d: 0.85 },
];

const Comentario: React.FC<{ readonly texto: string; readonly i: number }> = ({ texto, i }) => {
  const { px } = useLayout();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: px(18),
        padding: `${px(20)}px ${px(30)}px ${px(20)}px ${px(20)}px`,
        borderRadius: px(60),
        background: "#FFFFFF",
        boxShadow: `0 ${px(18)}px ${px(40)}px rgba(26,20,32,0.12)`,
        fontFamily: "inherit",
        fontSize: px(34),
        fontWeight: 600,
        color: "#1A1420",
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ width: px(46), height: px(46), borderRadius: "50%", background: [COR.rosa, COR.laranja, COR.oceano][i % 3] }} />
      {texto}
    </div>
  );
};

/** Cena 7: "Quando vamos voltar?" entre comentários genéricos que flutuam em profundidade. */
export const C7Quando: React.FC<CenaProps> = ({ tema }) => {
  const { px } = useLayout();
  return (
    <MotionProvider theme={tema}>
      <Fundo />
      {[0.4, 0.2, 0].map((depth, band) => (
        <Layer key={band} depth={depth} drift={14}>
          {COMENTARIOS.filter((_, i) => i % 3 === band).map((c) => {
            const i = COMENTARIOS.indexOf(c);
            return (
              <div key={i} style={{ position: "absolute", left: px(c.x), top: px(c.y), fontFamily: tema.fonts.display }}>
                <ObjectEnter motion="pop" delay={c.d} float={10} floatPeriod={3 + i * 0.4}>
                  <Comentario texto={c.txt} i={i} />
                </ObjectEnter>
              </div>
            );
          })}
        </Layer>
      ))}
      <Stage3D perspective={1300}>
        <FloatingShapes
          enter="below"
          duration={0.9}
          shapes={[
            { kind: "pill", x: -340, y: 80, z: 220, size: 80, color: COR.rosa, delay: 0.2, rz: 25 },
            { kind: "cube", x: 360, y: -60, z: 140, size: 90, color: COR.oceano, delay: 0.3 },
            { kind: "disc", x: 300, y: 620, z: -80, size: 110, color: COR.laranja, delay: 0.4, spin: 70 },
            { kind: "tile", x: -300, y: -640, z: -160, size: 100, color: "#7B4BD6", delay: 0.5 },
          ]}
        />
      </Stage3D>
      <Frase texto="*Quando* vamos voltar?" topo={790} size={124} delay={1.0} color="#1A1420" />
    </MotionProvider>
  );
};

/** Cena 8: 2022 → 2026; o número recua, a luz apaga e sobra um ponto de luz. */
export const C8Ano2026: React.FC<CenaProps> = ({ tema }) => {
  const t = useT();
  return (
    <MotionProvider theme={tema}>
      <Fundo />
      <Stage3D perspective={1500}>
        <Plane3D y={-40} z={kf(t, [2.0, 3.2], [0, -900], "exit")} rotateY={kf(t, [0, 3], [-12, 4])} rotateX={8} opacity={kf(t, [2.3, 3.2], [1, 0])}>
          <Ano de={2022} para={2026} em={0.35} tamanho={320} />
        </Plane3D>
        <FloatingShapes shapes={FORMAS_ANO.map((f) => ({ ...f, x: f.x * 1.05, y: f.y * 0.95 }))} enter="scale" exitAt={2.0} />
      </Stage3D>
      <AbsoluteFill style={{ background: COR.noite, opacity: kf(t, [2.2, 3.3], [0, 1]) }} />
      <PontoDeLuz raio={kf(t, [2.7, 3.7], [0, 22], "enterStrong")} cor={COR.laranja} />
    </MotionProvider>
  );
};
