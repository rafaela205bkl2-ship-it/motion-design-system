/**
 * UMADSAL 2027 | ARREPENDEI-VOS — versão 2 (60 s, 120 BPM).
 * Linguagem das referências: objetos que se substituem a cada batida sobre campos de cor (ref-003),
 * caixas técnicas e diagrama de fragmentos (ref-004), tipografia gigante cortada, cortes secos e
 * transições com as cores do PDF. Nenhuma nudez: só mãos, rostos e objetos.
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, random } from "remotion";
import {
  CameraPlate,
  Flash,
  LightRays,
  MaskReveal,
  Particles,
  Shine,
  TechBox,
  useLayout,
  useProgress,
} from "../../../motion";
import { COR, FONTES, IMG, type ObjNome } from "../marca";
import { HIT, txt, useAbs, useRel } from "../tempo";
import { Asterisco, Brilho, Lettering, TextoMarca, useTremor } from "../ui";
import { Campo, Janela, Objeto, PaginaLivro, TipoGigante } from "./kit";

const tg = (id: string) => txt(id);

/* ============================================================ ABERTURA (0–6) */
const STROBE: { cor: string; x: number; y: number }[] = [
  { cor: COR.creme, x: 0.22, y: 0.14 },
  { cor: COR.navy, x: 0.6, y: 0.2 },
  { cor: COR.ouro, x: 0.3, y: 0.5 },
  { cor: COR.preto, x: 0.78, y: 0.46 },
  { cor: COR.creme, x: 0.42, y: 0.86 },
  { cor: COR.navy, x: 0.62, y: 0.8 },
];

export const Abertura: React.FC = () => {
  const abs = useAbs();
  const rel = useRel();
  const { px } = useLayout();
  const nome = tg("umadsal2027");
  const pisca =
    abs < nome.inicio + 0.35
      ? random(`p-${Math.floor(abs * 30)}`) > 0.45
        ? 1
        : 0.15
      : 1;
  const T = HIT.arrependei;
  const entra = useProgress({
    start: rel(T),
    duration: 0.35,
    easing: "enterStrong",
  });
  const empurra = useProgress({
    start: rel(T),
    duration: 2.6,
    easing: "camera",
  });
  const tremor = useTremor(T, 18, 0.4);
  const k = Math.floor((abs - HIT.strobe) / 0.25);
  return (
    <AbsoluteFill style={{ background: COR.preto }}>
      <Janela de={0} ate={HIT.strobe}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: pisca,
          }}
        >
          <TextoMarca
            texto={nome.texto}
            de={nome.inicio}
            ate={nome.fim}
            size={42}
            tracking="0.62em"
            stagger={0.05}
          />
        </AbsoluteFill>
      </Janela>
      {/* strobe: fragmentos gigantes do lettering oficial sobre as cores do PDF */}
      <Janela de={HIT.strobe} ate={HIT.corteAbertura}>
        {k >= 0 && k < STROBE.length ? (
          <Campo cor={STROBE[k].cor} forca={0.6}>
            <CameraPlate
              src={IMG.lettering.src}
              size={IMG.lettering.size}
              clamp={false}
              keys={[
                {
                  t: rel(HIT.strobe + k * 0.25),
                  x: STROBE[k].x,
                  y: STROBE[k].y,
                  zoom: 2.6,
                },
                {
                  t: rel(HIT.strobe + k * 0.25 + 0.25),
                  x: STROBE[k].x + 0.03,
                  y: STROBE[k].y,
                  zoom: 2.8,
                },
              ]}
              easing="linear"
            />
          </Campo>
        ) : null}
      </Janela>
      <Janela de={T} ate={6.4}>
        <Campo cor={COR.creme} brilho="rgba(255,255,255,0.8)">
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              transform: tremor,
            }}
          >
            <div
              style={{
                transform: `scale(${(1.25 - 0.25 * entra) * (1 + 0.05 * empurra)})`,
              }}
            >
              <Shine at={rel(T + 0.8)} duration={1.0} intensity={1.6}>
                <Lettering altura={780} />
              </Shine>
            </div>
          </AbsoluteFill>
          <div
            style={{
              position: "absolute",
              left: px(140),
              top: px(110),
              opacity: entra,
            }}
          >
            <Asterisco size={px(70)} />
          </div>
          <div
            style={{
              position: "absolute",
              right: px(150),
              bottom: px(110),
              opacity: entra,
            }}
          >
            <Brilho size={px(90)} />
          </div>
        </Campo>
      </Janela>
      <Flash at={[rel(T)]} decay={0.4} />
    </AbsoluteFill>
  );
};

/* ============================================================ OBJETOS (6–14) — v3: match cuts */
// Sequência contínua: uma única câmera avança devagar enquanto os objetos se substituem por
// semelhança de forma — perfil → perfil → perfil, círculo → círculo → esfera, cúpula → cúpula.
// O giro dos objetos circulares continua através dos cortes (match cut de movimento).
type Peca = {
  nome: ObjNome;
  t: number;
  altura: number;
  rotulo: string;
  gira?: boolean;
  x?: number;
};
const PECAS: Peca[] = [
  {
    nome: "cabeca-marmore",
    t: 6.0,
    altura: 640,
    rotulo: "CABEÇA DE MÁRMORE · SÉC. IV a.C.",
  },
  {
    nome: "medalha-1749",
    t: 6.5,
    altura: 560,
    rotulo: "MEDALHA · 1749",
    gira: true,
  },
  {
    nome: "moeda-ouro",
    t: 7.0,
    altura: 540,
    rotulo: "MOEDA DE OURO · SÉC. II a.C.",
    gira: true,
  },
  { nome: "calice-1230", t: 7.5, altura: 640, rotulo: "CÁLICE · c. 1230" },
  {
    nome: "astrolabio-1654",
    t: 8.0,
    altura: 660,
    rotulo: "ASTROLÁBIO · 1654",
    gira: true,
  },
  {
    nome: "astrolabio-1462",
    t: 8.5,
    altura: 660,
    rotulo: "ASTROLÁBIO · 1462",
    gira: true,
  },
  { nome: "relogio-1565", t: 9.0, altura: 660, rotulo: "RELÓGIO · c. 1565" },
  {
    nome: "globo-celeste",
    t: 9.5,
    altura: 640,
    rotulo: "GLOBO CELESTE · 1621",
  },
  { nome: "elmo-dourado", t: 10.0, altura: 620, rotulo: "ELMO · SÉC. XVII" },
  { nome: "elmo-1550", t: 10.5, altura: 600, rotulo: "ELMO · c. 1550" },
  { nome: "elmo-1535", t: 11.0, altura: 600, rotulo: "ELMO · c. 1535" },
  { nome: "espada-1400", t: 11.5, altura: 780, rotulo: "ESPADA · c. 1400" },
];
const CATEG = [
  { id: "arte", luz: "rgba(40,70,120,0.55)", n: "01" },
  { id: "ciencia", luz: "rgba(200,146,54,0.30)", n: "02" },
  { id: "historia", luz: "rgba(140,10,10,0.55)", n: "03" },
];

export const Objetos: React.FC = () => {
  const abs = useAbs();
  const rel = useRel();
  const { px } = useLayout();
  const ci = Math.min(2, Math.max(0, Math.floor((abs - 6) / 2)));
  const c = CATEG[ci];
  const t = tg(c.id);
  const i = Math.max(0, PECAS.filter((p) => abs >= p.t).length - 1);
  const p = PECAS[i];
  const local = abs - p.t;
  // câmera contínua: avança 9% ao longo dos 6 s; cada peça ainda respira um pouco
  const dolly = 1 + 0.015 * (abs - 6) + 0.025 * Math.min(1, local / 0.5);
  const giro = p.gira ? (abs - 6) * 14 : 0; // o giro continua de uma peça para a outra
  const flut = Math.sin(abs * 2.1) * px(6);
  return (
    <AbsoluteFill style={{ background: COR.preto }}>
      <Janela de={6} ate={HIT.transcende}>
        {/* fundo: escuridão com a luz da categoria e um cone de luz de cima */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 55% 70% at 58% 50%, ${c.luz} 0%, transparent 70%)`,
          }}
        />
        <LightRays
          origin={[0.58, -0.25]}
          direction={180}
          spread={26}
          rays={9}
          reach={1.2}
          intensity={0.28}
          color={COR.luz}
          fadeIn={0.4}
          softness={20}
          seed="vitrine"
        />
        {/* bokeh desfocado em primeiro plano (profundidade de campo) */}
        <Particles
          count={14}
          size={[40, 110]}
          speed={10}
          angle={-15}
          wobble={20}
          opacity={[0.04, 0.12]}
          color={COR.luz}
          seed="bokeh"
          fadeIn={0.5}
        />
        <Particles
          count={50}
          area={[0.38, 0, 0.8, 1]}
          size={[1.5, 3.5]}
          speed={8}
          angle={-80}
          opacity={[0.15, 0.6]}
          color={COR.luz}
          seed="poeira-vitrine"
          fadeIn={0.5}
        />
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div
            style={{
              transform: `translate(${px(180)}px, ${flut}px) scale(${dolly})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: px(26),
            }}
          >
            <Shine
              key={p.nome}
              at={rel(p.t + 0.05)}
              duration={0.42}
              intensity={1.7}
              width={0.3}
            >
              <div style={{ transform: `rotate(${giro}deg)` }}>
                <Objeto
                  nome={p.nome}
                  altura={p.altura}
                  sombra={false}
                  style={{
                    filter: `drop-shadow(0 0 ${px(26)}px rgba(255,205,140,0.30)) drop-shadow(0 ${px(40)}px ${px(50)}px rgba(0,0,0,0.6))`,
                  }}
                />
              </div>
            </Shine>
            <div
              style={{
                fontFamily: FONTES.marca,
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: px(16),
                letterSpacing: "0.32em",
                color: COR.marfim,
                opacity: 0.75,
                whiteSpace: "nowrap",
              }}
            >
              {p.rotulo}
            </div>
          </div>
        </AbsoluteFill>
        {/* barras finas de "lente" e vinheta forte: leitura de cinema */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 55% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: px(130),
            bottom: px(130),
            display: "flex",
            flexDirection: "column",
            gap: px(14),
          }}
        >
          <div
            style={{
              fontFamily: FONTES.marca,
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: px(18),
              letterSpacing: "0.4em",
              color: COR.ouro,
            }}
          >
            {c.n} / 03
          </div>
          <TextoMarca
            key={c.id}
            texto={t.texto}
            de={t.inicio}
            ate={t.fim}
            size={96}
            tracking="0.06em"
            align="left"
            stagger={0.03}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: px(130),
            top: px(110),
            fontFamily: FONTES.marca,
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: px(16),
            letterSpacing: "0.4em",
            color: COR.marfim,
            opacity: 0.6,
          }}
        >
          UMADSAL · 2027 · ARREPENDEI-VOS
        </div>
        <Flash
          at={[HIT.ciencia, HIT.historia].map(rel)}
          peak={0.18}
          decay={0.2}
        />
      </Janela>
      <Janela de={HIT.transcende} ate={14.4}>
        <Campo cor={COR.creme} brilho="rgba(255,255,255,0.7)">
          <TipoGigante
            texto="O QUE NOS"
            de={HIT.transcende}
            ate={14.4}
            size={190}
            color={COR.preto}
            y={-150}
            x={-280}
            deriva={-20}
          />
          <TipoGigante
            texto="TRANSCENDE"
            de={HIT.transcende + 0.35}
            ate={14.4}
            size={265}
            color={COR.vermelho}
            y={100}
            x={60}
            deriva={-30}
          />
        </Campo>
      </Janela>
    </AbsoluteFill>
  );
};

/* ============================================================ MÃOS (14–24) */
// enquadramento da Criação: foco (0,38; 0,45), zoom 2,25 → posições das mãos em px de design
const Z = 2.25;
const caixa = (fx0: number, fy0: number, fx1: number, fy1: number) => {
  const [iw, ih] = IMG.adao.size;
  const s = Math.max(1920 / iw, 1080 / ih) * Z;
  const X = (fx: number) => 960 + (fx - 0.38) * iw * s;
  const Y = (fy: number) => 540 + (fy - 0.45) * ih * s;
  return { x: X(fx0), y: Y(fy0), w: X(fx1) - X(fx0), h: Y(fy1) - Y(fy0) };
};

const Fragmento: React.FC<{
  nome: ObjNome;
  de: number;
  x: number;
  altura: number;
  rotulo: string;
  n: string;
}> = ({ nome, de, x, altura, rotulo, n }) => {
  const abs = useAbs();
  const { px } = useLayout();
  const p = interpolate(abs, [de, de + 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - (1 - t) ** 3,
  });
  const flut = Math.sin((abs - de) * 2.2 + x) * px(5);
  return (
    <div
      style={{
        position: "absolute",
        left: px(x),
        top: px(640),
        transform: `translate(-50%, ${px(40) * (1 - p) + flut}px)`,
        opacity: p,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: px(16),
      }}
    >
      <div style={{ height: px(230), display: "flex", alignItems: "center" }}>
        <Objeto nome={nome} altura={altura} sombra={false} />
      </div>
      <div
        style={{
          fontFamily: FONTES.marca,
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: px(14),
          letterSpacing: "0.3em",
          color: COR.navy,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: COR.vermelho }}>{n}</span> · {rotulo}
      </div>
    </div>
  );
};

export const Maos: React.FC = () => {
  const abs = useAbs();
  const rel = useRel();
  const { px } = useLayout();
  const a = caixa(0.295, 0.39, 0.372, 0.5);
  const d = caixa(0.392, 0.405, 0.46, 0.505);
  const linhas = interpolate(abs, [HIT.diagrama, HIT.diagrama + 0.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const xs = [380, 760, 1160, 1540];
  const painel = interpolate(abs, [HIT.espelho, HIT.espelho + 0.3], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - (1 - t) ** 3,
  });
  return (
    <AbsoluteFill style={{ background: COR.creme }}>
      {/* 14–16: a Criação, com caixas técnicas */}
      <Janela de={14} ate={HIT.diagrama}>
        <CameraPlate
          src={IMG.adao.src}
          size={IMG.adao.size}
          filter="sepia(0.15) contrast(1.06)"
          keys={[
            { t: 0, x: 0.38, y: 0.45, zoom: Z },
            { t: 2, x: 0.38, y: 0.45, zoom: Z },
          ]}
        />
        <TechBox
          {...a}
          at={rel(HIT.caixas)}
          label="FIG. 01 · A CRIAÇÃO"
          color={COR.navy}
          font={FONTES.marca}
        />
        <TechBox
          {...d}
          at={rel(HIT.caixas + 0.25)}
          label="FIG. 02 · O CRIADOR"
          color={COR.vermelho}
          font={FONTES.marca}
        />
        <div
          style={{
            position: "absolute",
            left: px(130),
            bottom: px(90),
            fontFamily: FONTES.marca,
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: px(16),
            letterSpacing: "0.34em",
            color: COR.preto,
            opacity: 0.75,
          }}
        >
          MICHELANGELO · c. 1512
        </div>
      </Janela>
      {/* 16–19: diagrama "explodido" — pintura em cima, fragmentos embaixo (ref-004) */}
      <Janela de={HIT.diagrama} ate={HIT.espelho}>
        <div
          style={{
            position: "absolute",
            left: px(960 - 330),
            top: px(90),
            width: px(660),
            height: px(300),
            overflow: "hidden",
            outline: `${px(2)}px solid ${COR.navy}`,
          }}
        >
          <CameraPlate
            src={IMG.adao.src}
            size={IMG.adao.size}
            viewport={[660, 300]}
            keys={[
              { t: 0, x: 0.38, y: 0.45, zoom: 2.0 },
              { t: 3, x: 0.38, y: 0.45, zoom: 2.3 },
            ]}
          />
        </div>
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0 }}
          viewBox="0 0 1920 1080"
        >
          {xs.map((x, i) => (
            <line
              key={i}
              x1={960}
              y1={390}
              x2={x}
              y2={600}
              stroke={COR.navy}
              strokeWidth={2}
              strokeDasharray={400}
              strokeDashoffset={400 * (1 - Math.min(1, linhas * 1.3 - i * 0.1))}
            />
          ))}
        </svg>
        <Fragmento
          nome="mao-adao"
          de={HIT.diagrama + 0.2}
          x={xs[0]}
          altura={150}
          rotulo="MÃO · ADÃO"
          n="01"
        />
        <Fragmento
          nome="mao-criador"
          de={HIT.diagrama + 0.4}
          x={xs[1]}
          altura={140}
          rotulo="MÃO · CRIADOR"
          n="02"
        />
        <Fragmento
          nome="gravura-mao-humana"
          de={HIT.diagrama + 0.6}
          x={xs[2]}
          altura={230}
          rotulo="GRAVURA · 2027"
          n="03"
        />
        <Fragmento
          nome="gravura-mao-criador"
          de={HIT.diagrama + 0.8}
          x={xs[3]}
          altura={230}
          rotulo="GRAVURA · 2027"
          n="04"
        />
        <div
          style={{
            position: "absolute",
            left: px(130),
            top: px(110),
            fontFamily: FONTES.marca,
            fontStyle: "italic",
            fontWeight: 800,
            fontSize: px(22),
            letterSpacing: "0.3em",
            color: COR.navy,
          }}
        >
          ENTRE OS DEDOS
        </div>
      </Janela>
      {/* 19–21,25: espelho — a pintura de 1512 e a estampa de 2027, o mesmo gesto */}
      <Janela de={HIT.espelho} ate={HIT.deus}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "50%",
            height: "100%",
            overflow: "hidden",
            transform: `translateX(${-px(960) * painel}px)`,
          }}
        >
          <CameraPlate
            src={IMG.adao.src}
            size={IMG.adao.size}
            viewport={[960, 1080]}
            keys={[
              { t: 0, x: 0.385, y: 0.45, zoom: 3.2 },
              { t: 2.3, x: 0.385, y: 0.45, zoom: 3.5 },
            ]}
          />
        </div>
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "50%",
            height: "100%",
            overflow: "hidden",
            transform: `translateX(${px(960) * painel}px)`,
          }}
        >
          <CameraPlate
            src={IMG.camisas.src}
            size={IMG.camisas.size}
            viewport={[960, 1080]}
            keys={[
              { t: 0, x: 0.36, y: 0.535, zoom: 3.4 },
              { t: 2.3, x: 0.36, y: 0.535, zoom: 3.7 },
            ]}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: px(6),
            marginLeft: -px(3),
            background: COR.vermelho,
            opacity: 1 - painel,
          }}
        />
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: px(80),
          }}
        >
          <div
            style={{
              display: "flex",
              gap: px(140),
              fontFamily: FONTES.marca,
              fontStyle: "italic",
              fontWeight: 800,
              fontSize: px(40),
              letterSpacing: "0.2em",
              color: COR.marfim,
              textShadow: `0 0 ${px(20)}px rgba(0,0,0,0.6)`,
              opacity: 1 - painel,
            }}
          >
            <span>1512</span>
            <span>2027</span>
          </div>
        </AbsoluteFill>
      </Janela>
      <Janela de={HIT.deus} ate={HIT.humanidade}>
        <Campo cor={COR.navy}>
          <TipoGigante
            texto="DEUS"
            de={HIT.deus}
            ate={HIT.humanidade}
            size={460}
            color={COR.marfim}
            deriva={-25}
          />
        </Campo>
      </Janela>
      <Janela de={HIT.humanidade} ate={HIT.interrompida}>
        <Campo cor={COR.ouro}>
          <TipoGigante
            texto="HUMANIDADE"
            de={HIT.humanidade}
            ate={HIT.interrompida}
            size={250}
            color={COR.preto}
            deriva={-40}
            x={40}
          />
        </Campo>
      </Janela>
      <Flash at={[HIT.deus, HIT.humanidade].map(rel)} peak={0.3} decay={0.25} />
    </AbsoluteFill>
  );
};

/* ============================================================ INTERROMPIDA (24–28) */
export const Interrompida: React.FC = () => {
  const abs = useAbs();
  const { px } = useLayout();
  const abre = interpolate(abs, [24.0, 25.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - (1 - t) ** 3,
  });
  const d = px(160) * abre;
  const falha = [24.0, 24.35, 25.0, 25.25, 26.0, 26.5, 26.8].some(
    (t0) => abs >= t0 && abs < t0 + 0.15,
  );
  const janela = Math.floor(abs * 8);
  const t = tg("interrompida");
  const racha =
    abs >= HIT.rachadura
      ? interpolate(abs, [HIT.rachadura, HIT.rachadura + 0.6], [1, 0], {
          extrapolateRight: "clamp",
        })
      : 0;
  const keys = [
    { t: 0, x: 0.385, y: 0.45, zoom: 3.0 },
    { t: 3, x: 0.385, y: 0.45, zoom: 3.3 },
  ];
  const faixas = 8;
  const metade = (lado: "esq" | "dir") =>
    Array.from({ length: faixas }, (_, i) => {
      const off = falha
        ? (random(`g-${janela}-${lado}-${i}`) - 0.5) * px(140)
        : 0;
      const top = (i / faixas) * 100;
      const bot = 100 - ((i + 1) / faixas) * 100;
      const clip =
        lado === "esq"
          ? `inset(${top}% 50% ${bot}% 0)`
          : `inset(${top}% 0 ${bot}% 50%)`;
      return (
        <CameraPlate
          key={`${lado}-${i}`}
          src={IMG.adao.src}
          size={IMG.adao.size}
          filter={`grayscale(${0.3 + abre * 0.6}) contrast(1.2) brightness(${1 - abre * 0.35})`}
          keys={keys}
          style={{
            clipPath: clip,
            transform: `translateX(${(lado === "esq" ? -d : d) + off}px)`,
          }}
        />
      );
    });
  return (
    <AbsoluteFill style={{ background: COR.preto }}>
      <Janela de={24} ate={HIT.rachadura}>
        {metade("esq")}
        {metade("dir")}
        <AbsoluteFill
          style={{
            background: COR.navy,
            mixBlendMode: "multiply",
            opacity: 0.55 * abre,
          }}
        />
        {falha ? (
          <AbsoluteFill
            style={{
              background: COR.vermelho,
              mixBlendMode: "screen",
              opacity: 0.25,
            }}
          />
        ) : null}
        {/* a palavra só se parte nos instantes de falha */}
        <AbsoluteFill
          style={{
            clipPath: falha ? "inset(0 0 50% 0)" : undefined,
            transform: `translateX(${falha ? -px(60) : 0}px)`,
          }}
        >
          <TipoGigante
            texto={t.texto}
            de={t.inicio}
            ate={t.fim}
            size={210}
            color={COR.marfim}
            deriva={0}
          />
        </AbsoluteFill>
        {falha ? (
          <AbsoluteFill
            style={{
              clipPath: "inset(50% 0 0 0)",
              transform: `translateX(${px(60)}px)`,
            }}
          >
            <TipoGigante
              texto={t.texto}
              de={t.inicio}
              ate={t.fim}
              size={210}
              color={COR.vermelho}
              deriva={0}
            />
          </AbsoluteFill>
        ) : null}
      </Janela>
      {racha > 0 ? (
        <AbsoluteFill style={{ opacity: racha }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="none"
          >
            <polyline
              points="962,0 948,120 975,210 951,330 970,420 944,540 968,650 950,760 972,870 955,1080"
              fill="none"
              stroke={COR.vermelho}
              strokeWidth={4}
            />
          </svg>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

/* ============================================================ CHAMADO (28–34) */
type Rosto = {
  img: { src: string; size: readonly [number, number] };
  x: number;
  y: number;
  z: number;
};
const ROSTOS: Rosto[] = [
  { img: IMG.prodigo, x: 0.29, y: 0.36, z: 6 },
  { img: IMG.atenas, x: 0.5, y: 0.44, z: 5 },
  { img: IMG.adao, x: 0.125, y: 0.37, z: 6 },
  { img: IMG.prodigo, x: 0.82, y: 0.23, z: 6 },
  { img: IMG.vitruviano, x: 0.5, y: 0.5, z: 5 },
  { img: IMG.atenas, x: 0.74, y: 0.67, z: 5 },
  { img: IMG.prodigo, x: 0.25, y: 0.5, z: 6 },
  { img: IMG.masaccio, x: 0.36, y: 0.78, z: 2.6 },
  { img: IMG.atenas, x: 0.325, y: 0.585, z: 6 },
  { img: IMG.prodigo, x: 0.64, y: 0.42, z: 6 },
  { img: IMG.atenas, x: 0.885, y: 0.54, z: 6 },
  { img: IMG.atenas, x: 0.43, y: 0.62, z: 5 },
];

export const Chamado: React.FC = () => {
  const abs = useAbs();
  const rel = useRel();
  const { px } = useLayout();
  const g = tg("geracao");
  const vermelho = abs >= g.inicio;
  return (
    <AbsoluteFill style={{ background: COR.preto }}>
      {/* 28–29,4: a mão do Criador (pintura) surge do escuro num feixe de luz
          29,4: match cut — a mesma mão, agora gravada na estampa 2027, entre nuvens douradas */}
      <Janela de={HIT.chamado} ate={HIT.maoGravura}>
        <AbsoluteFill style={{ background: COR.preto }}>
          <AbsoluteFill
            style={{
              maskImage:
                "radial-gradient(ellipse 50% 55% at 50% 50%, black 0%, rgba(0,0,0,0.55) 30%, transparent 62%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 50% 55% at 50% 50%, black 0%, rgba(0,0,0,0.55) 30%, transparent 62%)",
            }}
          >
            <CameraPlate
              src={IMG.adao.src}
              size={IMG.adao.size}
              filter="sepia(0.4) contrast(1.55) saturate(0.85) brightness(0.72)"
              keys={[
                {
                  t: 0,
                  x: 0.445,
                  y: 0.44,
                  zoom: 3.6,
                  rotate: 0,
                  brightness: 0,
                },
                { t: 0.8, brightness: 1.05 },
                {
                  t: rel(HIT.maoGravura),
                  x: 0.44,
                  y: 0.44,
                  zoom: 3.95,
                  rotate: -6,
                  brightness: 1.1,
                },
              ]}
            />
          </AbsoluteFill>
          <LightRays
            origin={[0.72, -0.3]}
            direction={200}
            spread={22}
            rays={7}
            reach={1.4}
            intensity={0.45}
            color={COR.luz}
            fadeIn={0.8}
            softness={22}
            seed="feixe-mao"
          />
          <Particles
            count={60}
            area={[0.3, 0, 0.9, 1]}
            size={[1.5, 4]}
            speed={10}
            angle={110}
            opacity={[0.2, 0.7]}
            color={COR.luz}
            seed="poeira-mao"
            fadeIn={0.8}
          />
        </AbsoluteFill>
      </Janela>
      <Janela de={HIT.maoGravura} ate={HIT.mosaico}>
        <AbsoluteFill style={{ background: COR.ouro }}>
          <CameraPlate
            src={IMG.cartazCreme.src}
            size={IMG.cartazCreme.size}
            filter="sepia(0.5) saturate(1.3) brightness(1.02)"
            keys={[
              { t: 0, x: 0.18, y: 0.3, zoom: 2.4, blur: 3 },
              { t: 1.2, x: 0.2, y: 0.32, zoom: 2.6, blur: 3 },
            ]}
            style={{ opacity: 0.65, mixBlendMode: "multiply" }}
          />
          <AbsoluteFill
            style={{
              background: `radial-gradient(ellipse at 50% 45%, rgba(255,245,236,0.85) 0%, transparent 60%)`,
            }}
          />
          <LightRays
            origin={[0.72, -0.3]}
            direction={200}
            spread={30}
            rays={9}
            reach={1.4}
            intensity={0.5}
            color={COR.creme}
            fadeIn={0.1}
            softness={18}
            seed="feixe-gravura"
          />
          <AbsoluteFill
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <div
              style={{
                transform: `translate(${px(70)}px, ${px(-10)}px) rotate(${32 - 4 * Math.min(1, (abs - HIT.maoGravura) / 1.1)}deg) scale(${1 + 0.06 * Math.min(1, (abs - HIT.maoGravura) / 1.1)})`,
              }}
            >
              <Objeto
                nome="gravura-mao-criador"
                altura={640}
                sombra={false}
                style={{
                  filter: `drop-shadow(0 0 ${px(30)}px rgba(255,240,210,0.7))`,
                }}
              />
            </div>
          </AbsoluteFill>
          <Particles
            count={40}
            angle={110}
            speed={14}
            size={[2, 5]}
            opacity={[0.3, 0.8]}
            color={COR.creme}
            seed="chamado-p"
          />
        </AbsoluteFill>
      </Janela>
      <Janela de={HIT.mosaico} ate={HIT.par1a}>
        <AbsoluteFill
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: px(6),
            background: COR.preto,
          }}
        >
          {Array.from({ length: 6 }, (_, c) => {
            const ini = HIT.mosaico + c * 0.08;
            const k = Math.max(0, Math.floor((abs - ini) / 0.25 + c * 0.5));
            const r = ROSTOS[(c * 2 + k) % ROSTOS.length];
            return (
              <div
                key={c}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  opacity: abs >= ini ? 1 : 0,
                }}
              >
                <CameraPlate
                  src={r.img.src}
                  size={r.img.size}
                  viewport={[636, 537]}
                  filter="grayscale(1) contrast(1.3)"
                  keys={[
                    { t: 0, x: r.x, y: r.y, zoom: r.z },
                    { t: 6, x: r.x, y: r.y, zoom: r.z * 1.15 },
                  ]}
                />
                <AbsoluteFill
                  style={{
                    background: vermelho ? COR.vinho : COR.navy,
                    mixBlendMode: "screen",
                    opacity: 0.55,
                  }}
                />
              </div>
            );
          })}
        </AbsoluteFill>
        <AbsoluteFill
          style={{ background: "rgba(0,0,0,0.35)", opacity: vermelho ? 1 : 0 }}
        />
        <TipoGigante
          texto={g.texto}
          de={g.inicio}
          ate={HIT.par1a}
          size={190}
          color={COR.marfim}
          deriva={-30}
        />
      </Janela>
      <Flash at={[rel(HIT.chamado), rel(g.inicio)]} peak={0.35} decay={0.3} />
    </AbsoluteFill>
  );
};

/* ============================================================ PARES (34–41) — v3: match cut da palavra */
// Entre o risco e a resposta, a câmera mergulha numa página impressa (o texto do próprio roteiro,
// diagramado como uma Bíblia de estudo) até a palavra marcada — que vira o letreiro gigante.
export const Pares: React.FC = () => {
  const rel = useRel();
  const p1a = tg("par1a");
  const p1b = tg("par1b");
  const p2a = tg("par2a");
  const p2b = tg("par2b");
  return (
    <AbsoluteFill>
      <Janela de={p1a.inicio} ate={p1a.risco ?? p1b.inicio}>
        <Campo cor={COR.creme} brilho="rgba(255,255,255,0.6)">
          <TipoGigante
            texto={p1a.texto}
            de={p1a.inicio}
            ate={p1b.inicio + 0.1}
            size={250}
            color={COR.preto}
            voz="filme"
            risco={(p1a.risco ?? 35.7) - 0.35}
            deriva={-30}
          />
        </Campo>
      </Janela>
      <Janela de={p1a.risco ?? 35.7} ate={p1b.inicio}>
        <PaginaLivro
          palavra="entrega"
          de={p1a.risco ?? 35.7}
          ate={p1b.inicio}
        />
      </Janela>
      <Janela de={p1b.inicio} ate={p2a.inicio}>
        <Campo cor={COR.vinho} brilho="rgba(223,18,35,0.35)">
          <TipoGigante
            texto={p1b.texto}
            de={p1b.inicio - 0.2}
            ate={p1b.fim + 0.1}
            size={320}
            color={COR.creme}
            deriva={-45}
          />
        </Campo>
      </Janela>
      <Janela de={p2a.inicio} ate={p2a.risco ?? p2b.inicio}>
        <Campo cor={COR.creme} brilho="rgba(255,255,255,0.6)">
          <TipoGigante
            texto={p2a.texto}
            de={p2a.inicio}
            ate={p2b.inicio + 0.1}
            size={215}
            color={COR.preto}
            voz="filme"
            risco={(p2a.risco ?? 39.15) - 0.35}
            deriva={-30}
          />
        </Campo>
      </Janela>
      <Janela de={p2a.risco ?? 39.15} ate={p2b.inicio}>
        <PaginaLivro
          palavra="renúncia"
          de={p2a.risco ?? 39.15}
          ate={p2b.inicio}
        />
      </Janela>
      <Janela de={p2b.inicio} ate={HIT.tempo1}>
        <Campo cor={COR.navy} brilho="rgba(203,142,22,0.25)">
          <TipoGigante
            texto={p2b.texto}
            de={p2b.inicio - 0.2}
            ate={p2b.fim + 0.1}
            size={300}
            color={COR.ouro}
            deriva={-45}
          />
        </Campo>
      </Janela>
      <Flash at={[p1b.inicio, p2b.inicio].map(rel)} peak={0.4} decay={0.3} />
    </AbsoluteFill>
  );
};

/* ============================================================ É TEMPO (41–48) */
const TEMPO = [
  { id: "tempo1", cor: COR.navy, tinta: COR.marfim, size: 360 },
  { id: "tempo2", cor: COR.ouro, tinta: COR.preto, size: 270 },
  { id: "tempo3", cor: COR.vinho, tinta: COR.marfim, size: 270 },
];
const RAJADA: {
  t: number;
  cor: string;
  obj?: ObjNome;
  img?: "camisas" | "paleta" | "lettering";
  x?: number;
  y?: number;
  z?: number;
}[] = [
  { t: 46.5, cor: COR.creme, img: "camisas", x: 0.33, y: 0.27, z: 2.4 },
  { t: 46.75, cor: COR.navy, obj: "calice-1400" },
  { t: 47.0, cor: COR.ouro, img: "paleta", x: 0.5, y: 0.5, z: 1.3 },
  { t: 47.125, cor: COR.preto, obj: "astrolabio-1654" },
  { t: 47.25, cor: COR.creme, img: "lettering", x: 0.5, y: 0.5, z: 1.4 },
  { t: 47.375, cor: COR.vinho, obj: "gravura-mao-humana" },
];

export const Tempo: React.FC = () => {
  const abs = useAbs();
  const { px } = useLayout();
  const i = Math.min(2, Math.max(0, Math.floor((abs - HIT.tempo1) / 2)));
  const c = TEMPO[i];
  const t = tg(c.id);
  // a ampulheta vira a cada golpe (180°, com chegada decidida)
  const giro = [HIT.tempo1, HIT.tempo2, HIT.tempo3].reduce(
    (acc, h) =>
      acc +
      180 *
        interpolate(abs, [h - 0.05, h + 0.3], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: (x) => 1 - (1 - x) ** 3,
        }),
    -180,
  );
  const r = RAJADA.filter((x) => abs >= x.t).pop();
  return (
    <AbsoluteFill style={{ background: COR.preto }}>
      <Janela de={HIT.tempo1} ate={HIT.rajada}>
        <Campo cor={c.cor}>
          <TipoGigante
            key={c.id}
            texto={t.texto}
            de={t.inicio}
            ate={t.fim}
            size={c.size}
            color={c.tinta}
            deriva={-50}
          />
          <AbsoluteFill
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <div style={{ transform: `rotate(${giro}deg)` }}>
              <Objeto nome="ampulheta" altura={760} />
            </div>
          </AbsoluteFill>
          <div
            style={{
              position: "absolute",
              right: px(130),
              bottom: px(100),
              fontFamily: FONTES.marca,
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: px(16),
              letterSpacing: "0.34em",
              color: c.tinta,
              opacity: 0.75,
            }}
          >
            AMPULHETA · SÉC. XVIII
          </div>
        </Campo>
      </Janela>
      <Janela de={HIT.rajada} ate={HIT.corteClimax}>
        {r ? (
          <Campo cor={r.cor} forca={0.6}>
            {r.obj ? (
              <AbsoluteFill
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <Objeto
                  nome={r.obj}
                  altura={r.obj.startsWith("gravura") ? 700 : 760}
                />
              </AbsoluteFill>
            ) : (
              <CameraPlate
                src={IMG[r.img ?? "camisas"].src}
                size={IMG[r.img ?? "camisas"].size}
                clamp={r.img !== "lettering"}
                keys={[{ t: 0, x: r.x, y: r.y, zoom: r.z }]}
              />
            )}
          </Campo>
        ) : null}
      </Janela>
    </AbsoluteFill>
  );
};

/* ============================================================ REVELAÇÃO (48–60) — v3: mockups do novo PDF */
// lettering na luz → (transforma-se no telão) palco → crachás → camisa → símbolo e logotipo
// → cartaz com moldura → logotipo vermelho sobre o creme com a assinatura.
export const Revelacao: React.FC = () => {
  const abs = useAbs();
  const rel = useRel();
  const { px } = useLayout();
  const T = HIT.climax;
  const empurra = useProgress({
    start: rel(T),
    duration: 2.4,
    easing: "camera",
  });
  const tremor = useTremor(T, 20, 0.45);
  const P = HIT.palco;
  const vira = interpolate(abs, [P, P + 0.45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const L = HIT.logo;
  const simbolo = interpolate(abs, [L + 0.55, L + 0.8], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const abre = useProgress({
    start: rel(L + 0.8),
    duration: 0.8,
    easing: "camera",
  });
  const W = 1000;
  const [lw, lh] = IMG.logo.size;
  const frac = 1100 / lw;
  const desloca = (W / 2 - (W * frac) / 2) * (1 - abre);
  const v = tg("versiculo");
  const ano = tg("ano");
  const ass = tg("assinatura");
  const balanco = Math.sin((abs - HIT.crachas) * 2.2) * 1.2;
  return (
    <AbsoluteFill style={{ background: COR.preto }}>
      {/* 48 → palco: o lettering na luz vira o conteúdo do telão (a câmera recua) */}
      <Janela de={T} ate={HIT.crachas}>
        <AbsoluteFill style={{ opacity: 1 - vira }}>
          <Campo cor={COR.creme} brilho="rgba(255,255,255,0.9)">
            <LightRays
              origin={[0.5, 0.48]}
              spread={360}
              rays={24}
              reach={0.9}
              intensity={0.35}
              color={COR.ouro}
              blend="multiply"
              spin={4}
              delay={0}
              fadeIn={0.3}
              seed="rev"
            />
            <AbsoluteFill
              style={{
                justifyContent: "center",
                alignItems: "center",
                transform: tremor,
              }}
            >
              <div style={{ transform: `scale(${1.04 + 0.06 * empurra})` }}>
                <Shine at={rel(T + 0.9)} duration={1.0} intensity={1.6}>
                  <MaskReveal
                    at={0}
                    duration={0.55}
                    direction="down"
                    softness={0.3}
                    blurFrom={10}
                    easing="enterStrong"
                  >
                    <Lettering altura={800} />
                  </MaskReveal>
                </Shine>
              </div>
            </AbsoluteFill>
            <Particles
              count={44}
              angle={-90}
              speed={40}
              size={[2, 5]}
              opacity={[0.2, 0.6]}
              color={COR.ouro}
              blend="multiply"
              seed="rev-p"
            />
          </Campo>
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: vira }}>
          <CameraPlate
            src={IMG.palco.src}
            size={IMG.palco.size}
            keys={[
              { t: rel(P), x: 0.505, y: 0.38, zoom: 3.3 },
              { t: rel(P + 1.4), x: 0.5, y: 0.5, zoom: 1.0 },
              { t: rel(HIT.crachas), x: 0.5, y: 0.5, zoom: 1.03 },
            ]}
          />
        </AbsoluteFill>
      </Janela>
      {/* crachás: chicote de câmera e balanço do cordão */}
      <Janela de={HIT.crachas} ate={HIT.camisa}>
        <CameraPlate
          src={IMG.crachas.src}
          size={IMG.crachas.size}
          keys={[
            {
              t: rel(HIT.crachas),
              x: 0.42,
              y: 0.55,
              zoom: 2.4,
              blur: 9,
              rotate: balanco,
            },
            { t: rel(HIT.crachas + 0.2), blur: 0 },
            { t: rel(HIT.camisa), x: 0.5, y: 0.5, zoom: 1.06, rotate: balanco },
          ]}
        />
      </Janela>
      {/* camisa (nova, com o símbolo na gola) */}
      <Janela de={HIT.camisa} ate={L}>
        <CameraPlate
          src={IMG.camisas.src}
          size={IMG.camisas.size}
          keys={[
            { t: rel(HIT.camisa), x: 0.36, y: 0.5, zoom: 2.3, blur: 8 },
            { t: rel(HIT.camisa + 0.2), blur: 0 },
            { t: rel(HIT.camisa + 0.6), x: 0.37, y: 0.52, zoom: 2.1 },
            { t: rel(HIT.camisa + 1.0), x: 0.5, y: 0.5, zoom: 1.0 },
            { t: rel(L), x: 0.5, y: 0.5, zoom: 1.04 },
          ]}
        />
        <div style={{ position: "absolute", left: px(130), bottom: px(90) }}>
          <TextoMarca
            texto={v.texto}
            de={v.inicio}
            ate={v.fim}
            size={34}
            tracking="0.12em"
            align="left"
            color={COR.marfim}
          />
        </div>
      </Janela>
      {/* símbolo (pág. 4 do 1º PDF) → logotipo completo + 2027 */}
      <Janela de={L} ate={HIT.assinatura}>
        <CameraPlate
          src={IMG.papel.src}
          size={IMG.papel.size}
          keys={[{ t: 0, zoom: 1.6 }]}
        />
        <AbsoluteFill style={{ opacity: simbolo }}>
          <CameraPlate
            src={IMG.papelSimbolo.src}
            size={IMG.papelSimbolo.size}
            keys={[
              { t: rel(L), x: 0.5, y: 0.5, zoom: 1.1, brightness: 0 },
              { t: rel(L + 0.15), brightness: 1.3 },
              { t: rel(L + 0.5), brightness: 1.0 },
              { t: rel(L + 0.8), x: 0.5, y: 0.5, zoom: 2.25 },
            ]}
          />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: 1 - simbolo,
          }}
        >
          <div style={{ transform: `translateX(${px(desloca)}px)` }}>
            <Shine at={rel(L + 1.7)} duration={0.9} intensity={1.6}>
              <div
                style={{
                  clipPath: `inset(0 ${(1 - frac) * (1 - abre) * 100}% 0 0)`,
                }}
              >
                <Img
                  src={IMG.logo.src}
                  style={{
                    width: px(W),
                    height: px((W * lh) / lw),
                    display: "block",
                  }}
                />
              </div>
            </Shine>
          </div>
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            transform: `translateY(${px(250)}px)`,
          }}
        >
          <TextoMarca
            texto={ano.texto}
            de={ano.inicio}
            size={46}
            tracking="0.75em"
            stagger={0.06}
          />
        </AbsoluteFill>
        <Flash at={[rel(L)]} decay={0.5} peak={0.7} />
      </Janela>
      {/* cartaz com moldura barroca (pág. 2 do novo PDF) */}
      <Janela de={HIT.assinatura} ate={HIT.logoFinal}>
        <CameraPlate
          src={IMG.cartazVinho.src}
          size={IMG.cartazVinho.size}
          keys={[
            { t: rel(HIT.assinatura), zoom: 1.12 },
            { t: rel(HIT.logoFinal), zoom: 1.0 },
          ]}
        />
      </Janela>
      {/* logotipo vermelho sobre o creme (pág. 8) + assinatura */}
      <Janela de={HIT.logoFinal} ate={60}>
        <CameraPlate
          src={IMG.logoVermelho.src}
          size={IMG.logoVermelho.size}
          keys={[
            { t: rel(HIT.logoFinal), zoom: 1.06 },
            { t: rel(60), zoom: 1.0 },
          ]}
        />
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            transform: `translateY(${px(190)}px)`,
          }}
        >
          <TextoMarca
            texto={ass.texto}
            de={ass.inicio}
            size={24}
            tracking="0.38em"
            color={COR.vinho}
            weight={700}
            stagger={0.02}
          />
        </AbsoluteFill>
      </Janela>
      <Flash at={[rel(T)]} decay={0.5} />
    </AbsoluteFill>
  );
};
