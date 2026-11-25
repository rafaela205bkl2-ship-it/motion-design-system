/**
 * ATO 2 — A MENSAGEM (19,8–103,5 s). Narração N01–N09.
 * As obras renascentistas são o "arquivo histórico" do filme (padrão de ref-003):
 * movimento contínuo de câmera, gradação monocromática, substituições no tempo da música.
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import {
  CameraPlate,
  Flash,
  LightRays,
  Particles,
  TextReveal,
  TextStrike,
  useLayout,
} from "../../../motion";
import { COR, IMG } from "../marca";
import { HIT, Plano, envelope, txt, useAbs, useRel } from "../tempo";
import { Grade, Rotulo, TextoMarca } from "../ui";

type Img = { src: string; size: readonly [number, number] };
type Tomada = {
  img: Img;
  de: number;
  ate: number;
  x: number;
  y: number;
  z: number;
  z2?: number;
  x2?: number;
  y2?: number;
  rot?: number;
};

/** Sequência de tomadas com corte seco entre elas (cada uma com um leve push-in). */
const Tomadas: React.FC<{
  lista: Tomada[];
  filtro: string;
  children?: React.ReactNode;
}> = ({ lista, filtro, children }) => (
  <>
    {lista.map((s, i) => (
      <Plano key={i} de={s.de} ate={s.ate} nome={`tomada-${i}`}>
        <TomadaPlate s={s} filtro={filtro} />
        {children}
      </Plano>
    ))}
  </>
);

const TomadaPlate: React.FC<{ s: Tomada; filtro: string }> = ({
  s,
  filtro,
}) => {
  const rel = useRel();
  return (
    <CameraPlate
      src={s.img.src}
      size={s.img.size}
      filter={filtro}
      easing="linear"
      keys={[
        { t: 0, x: s.x, y: s.y, zoom: s.z, rotate: 0 },
        {
          t: rel(s.ate),
          x: s.x2 ?? s.x,
          y: s.y2 ?? s.y,
          zoom: s.z2 ?? s.z * 1.06,
          rotate: s.rot ?? 0,
        },
      ]}
    />
  );
};

const ARQUIVO = "grayscale(0.55) sepia(0.28) contrast(1.18) brightness(0.84)";

export const Imperios: React.FC = () => {
  const rel = useRel();
  const abs = useAbs();
  const vaz = interpolate(abs, [20, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <CameraPlate
        src={IMG.atenas.src}
        size={IMG.atenas.size}
        filter={ARQUIVO}
        keys={[
          { t: 0, x: 0.5, y: 0.16, zoom: 1.95 },
          { t: rel(30.6), x: 0.5, y: 0.5, zoom: 1.12 },
        ]}
      />
      <Grade cor={COR.navy} forca={0.55} />
      {/* vazamento de luz quente que atravessa o quadro */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at ${10 + vaz * 80}% 30%, rgba(255,190,120,0.35) 0%, transparent 45%)`,
          mixBlendMode: "screen",
        }}
      />
      <Rotulo
        texto="RAFAEL · A ESCOLA DE ATENAS · 1509–1511"
        de={22}
        ate={27.6}
      />
    </AbsoluteFill>
  );
};

export const ArteCiencia: React.FC = () => (
  <AbsoluteFill style={{ background: COR.preto }}>
    <Tomadas
      filtro={ARQUIVO}
      lista={[
        { img: IMG.vitruviano, de: 30.0, ate: 31.0, x: 0.5, y: 0.52, z: 2.5 },
        {
          img: IMG.vitruviano,
          de: 31.0,
          ate: 32.0,
          x: 0.36,
          y: 0.12,
          z: 2.5,
          x2: 0.46,
        },
        { img: IMG.atenas, de: 32.0, ate: 33.0, x: 0.505, y: 0.48, z: 3.2 },
        {
          img: IMG.atenas,
          de: 33.0,
          ate: 34.0,
          x: 0.76,
          y: 0.72,
          z: 3.0,
          rot: -0.8,
        },
        {
          img: IMG.atenas,
          de: 34.0,
          ate: 35.0,
          x: 0.27,
          y: 0.68,
          z: 3.0,
          rot: 0.8,
        },
        { img: IMG.vitruviano, de: 35.0, ate: 36.0, x: 0.5, y: 0.62, z: 1.35 },
        {
          img: IMG.atenas,
          de: 36.0,
          ate: 38.4,
          x: 0.5,
          y: 0.4,
          z: 1.3,
          z2: 1.18,
        },
      ]}
    >
      <Grade cor={COR.navy} forca={0.6} />
    </Tomadas>
  </AbsoluteFill>
);

export const Michelangelo: React.FC = () => {
  const rel = useRel();
  const abs = useAbs();
  const { px } = useLayout();
  const brilho =
    envelope(abs, 48.6, 50.2, 52.6, 53.6) * (0.75 + 0.25 * Math.sin(abs * 4));
  return (
    <AbsoluteFill>
      <CameraPlate
        src={IMG.adao.src}
        size={IMG.adao.size}
        filter="sepia(0.2) saturate(0.85) contrast(1.08) brightness(0.96)"
        keys={[
          { t: 0, x: 0.17, y: 0.4, zoom: 2.3 },
          { t: rel(46), x: 0.38, y: 0.44, zoom: 2.3 },
          { t: rel(53.6), x: 0.38, y: 0.45, zoom: 3.3 },
        ]}
      />
      <Grade cor={COR.navy} forca={0.25} quente={0.08} />
      <Particles
        count={40}
        area={[0.25, 0.1, 0.75, 0.9]}
        angle={-60}
        speed={6}
        size={[1.5, 3.5]}
        opacity={[0.1, 0.5]}
        color={COR.luz}
        seed="poeira-adao"
        delay={rel(44)}
        fadeIn={3}
      />
      {/* a luz no vão entre os dedos */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: brilho,
        }}
      >
        <div
          style={{
            width: px(420),
            height: px(260),
            background:
              "radial-gradient(ellipse at center, rgba(255,240,205,0.9) 0%, rgba(255,214,150,0.35) 30%, transparent 70%)",
            mixBlendMode: "screen",
          }}
        />
      </AbsoluteFill>
      <Rotulo
        texto="MICHELANGELO · A CRIAÇÃO DE ADÃO · c. 1512"
        de={39.4}
        ate={45.2}
      />
    </AbsoluteFill>
  );
};

/** A imagem se parte no vão entre os dedos: "uma relação que foi interrompida". */
export const Interrompida: React.FC = () => {
  const abs = useAbs();
  const { px } = useLayout();
  const abre = interpolate(abs, [53.9, 56.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t * t * (3 - 2 * t),
  });
  const d = px(85) * abre;
  const frio = abre;
  const some = interpolate(abs, [HIT.rachadura, HIT.rachadura + 0.7], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const racha =
    abs >= HIT.rachadura
      ? interpolate(abs, [HIT.rachadura, HIT.rachadura + 1.2], [1, 0], {
          extrapolateRight: "clamp",
        })
      : 0;
  const tremor =
    abs >= HIT.rachadura && abs < HIT.rachadura + 0.3
      ? px(Math.sin(abs * 120) * 6)
      : 0;
  const filtro = `sepia(${0.2 * (1 - frio)}) grayscale(${frio * 0.85}) contrast(${1.08 + frio * 0.2}) brightness(${0.96 - frio * 0.5})`;
  const keys = [
    { t: 0, x: 0.38, y: 0.45, zoom: 3.3 },
    { t: 5, x: 0.38, y: 0.45, zoom: 3.4 },
  ];
  return (
    <AbsoluteFill
      style={{ background: COR.preto, transform: `translateX(${tremor}px)` }}
    >
      <AbsoluteFill style={{ opacity: some }}>
        <CameraPlate
          src={IMG.adao.src}
          size={IMG.adao.size}
          filter={filtro}
          keys={keys}
          style={{
            clipPath: "inset(0 50% 0 0)",
            transform: `translateX(${-d}px)`,
          }}
        />
        <CameraPlate
          src={IMG.adao.src}
          size={IMG.adao.size}
          filter={filtro}
          keys={keys}
          style={{
            clipPath: "inset(0 0 0 50%)",
            transform: `translateX(${d}px)`,
          }}
        />
        <Grade cor={COR.navy} forca={0.6 * frio} />
      </AbsoluteFill>
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
              strokeWidth={3}
              style={{ filter: `drop-shadow(0 0 8px ${COR.vermelho})` }}
            />
          </svg>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

export const Eden: React.FC = () => {
  const rel = useRel();
  const abs = useAbs();
  const pulso = [58, 60, 62, 64].reduce((acc, b) => {
    const d = abs - b;
    return d >= 0 && d < 0.6 ? Math.max(acc, Math.exp(-d * 6)) : acc;
  }, 0);
  const FILTRO = "grayscale(0.55) contrast(1.28) brightness(0.62)";
  return (
    <AbsoluteFill style={{ background: COR.preto }}>
      <Plano de={58} ate={61.8} nome="expulsao-michelangelo">
        <CameraPlate
          src={IMG.expulsao.src}
          size={IMG.expulsao.size}
          filter={FILTRO}
          keys={[
            { t: 0, x: 0.66, y: 0.2, zoom: 2.3 },
            { t: rel(61.8) - rel(58), x: 0.8, y: 0.2, zoom: 2.15 },
          ]}
        />
      </Plano>
      <Plano de={61.2} ate={66.4} entra={0.6} nome="expulsao-masaccio">
        <CameraPlate
          src={IMG.masaccio.src}
          size={IMG.masaccio.size}
          filter={FILTRO}
          keys={[
            { t: 0, x: 0.5, y: 0.74, zoom: 1.0 },
            { t: 5.2, x: 0.5, y: 0.77, zoom: 1.16 },
          ]}
        />
      </Plano>
      <Grade cor={COR.navy} forca={0.65} />
      <AbsoluteFill
        style={{
          background: "#fff",
          mixBlendMode: "overlay",
          opacity: pulso * 0.16,
        }}
      />
      <Rotulo
        texto="MICHELANGELO · O PECADO ORIGINAL E A EXPULSÃO DO PARAÍSO"
        de={58.7}
        ate={61.0}
      />
      <Rotulo
        texto="MASACCIO · A EXPULSÃO DO ÉDEN · c. 1425"
        de={62.4}
        ate={65.4}
      />
    </AbsoluteFill>
  );
};

/** "Mas Deus nunca deixou de chamar": a mão do Criador volta em luz dourada. */
export const Chamar: React.FC = () => {
  const rel = useRel();
  return (
    <AbsoluteFill style={{ background: COR.preto }}>
      <CameraPlate
        src={IMG.adao.src}
        size={IMG.adao.size}
        filter="sepia(0.32) saturate(0.95) contrast(1.1)"
        keys={[
          { t: 0, x: 0.47, y: 0.4, zoom: 2.6, brightness: 0.2 },
          { t: rel(67.8), brightness: 1.05 },
          { t: rel(72.6), x: 0.45, y: 0.41, zoom: 2.9, brightness: 1.05 },
        ]}
      />
      <Grade forca={0} quente={0.12} />
      <LightRays
        origin={[0.95, -0.3]}
        direction={215}
        spread={42}
        rays={10}
        reach={1.3}
        intensity={0.5}
        color={COR.luz}
        delay={rel(66.2)}
        fadeIn={1.6}
        softness={16}
        seed="chamar"
      />
      <Particles
        count={50}
        area={[0.3, 0, 1, 1]}
        angle={-120}
        speed={9}
        size={[1.5, 4]}
        opacity={[0.15, 0.7]}
        color={COR.luz}
        delay={rel(66.4)}
        fadeIn={1.6}
        seed="ouro-chamar"
      />
    </AbsoluteFill>
  );
};

/** Montagem rítmica de rostos (ostinato): cortes a cada 2 s, gradação azul de arquivo. */
export const Geracao: React.FC = () => {
  const rel = useRel();
  return (
    <AbsoluteFill style={{ background: COR.preto }}>
      <Tomadas
        filtro="grayscale(0.85) contrast(1.32) brightness(0.8)"
        lista={[
          {
            img: IMG.atenas,
            de: 72,
            ate: 74,
            x: 0.325,
            y: 0.585,
            z: 3.5,
            rot: 0.6,
          },
          {
            img: IMG.prodigo,
            de: 74,
            ate: 76,
            x: 0.25,
            y: 0.5,
            z: 3.1,
            rot: -0.6,
          },
          {
            img: IMG.adao,
            de: 76,
            ate: 78,
            x: 0.125,
            y: 0.37,
            z: 3.3,
            rot: 0.5,
          },
          {
            img: IMG.atenas,
            de: 78,
            ate: 80,
            x: 0.885,
            y: 0.54,
            z: 3.8,
            rot: -0.5,
          },
          {
            img: IMG.vitruviano,
            de: 80,
            ate: 82,
            x: 0.5,
            y: 0.5,
            z: 3.4,
            rot: 0.6,
          },
          {
            img: IMG.prodigo,
            de: 82,
            ate: 84.6,
            x: 0.29,
            y: 0.36,
            z: 2.9,
            rot: -0.5,
          },
        ]}
      >
        <Grade cor={COR.navy} forca={0.75} />
      </Tomadas>
      <Flash
        at={[74, 76, 78, 80, 82].map(rel)}
        color={COR.vermelho}
        peak={0.22}
        decay={0.16}
        blend="screen"
      />
    </AbsoluteFill>
  );
};

/** Um par "não é sobre X, mas sobre Y": X em serifa é riscado; Y nasce em vermelho, na voz da marca. */
const Par: React.FC<{ a: string; b: string }> = ({ a, b }) => {
  const rel = useRel();
  const abs = useAbs();
  const A = txt(a);
  const B = txt(b);
  const visA = envelope(abs, A.inicio - 0.01, A.inicio, A.fim - 0.3, A.fim);
  return (
    <>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: visA,
        }}
      >
        <TextStrike
          at={rel(A.risco ?? A.fim - 0.5)}
          color={COR.vermelho}
          thickness={7}
          y={0.55}
          dimTo={0.4}
        >
          <TextReveal
            text={A.texto}
            by="char"
            direction="center"
            delay={rel(A.inicio)}
            duration={0.7}
            stagger={0.03}
            size={A.texto.length > 12 ? 92 : 112}
            weight={500}
            tracking="0.12em"
            color={COR.marfim}
            from={{ y: 0, blur: 20, scale: 1.04 }}
          />
        </TextStrike>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <TextoMarca
          texto={B.texto}
          de={B.inicio}
          ate={B.fim}
          size={B.texto.length > 12 ? 92 : 118}
          color={COR.vermelho}
          tracking="0.14em"
          stagger={0.025}
        />
      </AbsoluteFill>
      <Flash at={[rel(B.inicio)]} peak={0.16} decay={0.35} />
    </>
  );
};

export const NaoESobre: React.FC = () => {
  const rel = useRel();
  return (
    <AbsoluteFill style={{ background: COR.preto }}>
      <CameraPlate
        src={IMG.atenas.src}
        size={IMG.atenas.size}
        filter="grayscale(0.8) contrast(1.2)"
        keys={[
          { t: 0, x: 0.5, y: 0.45, zoom: 1.6, blur: 7, brightness: 0.4 },
          { t: rel(88), brightness: 0.3 },
          {
            t: rel(103.5),
            x: 0.56,
            y: 0.5,
            zoom: 1.95,
            blur: 9,
            brightness: 0.3,
          },
        ]}
      />
      <Grade cor={COR.navy} forca={0.75} />
      <LightRays
        origin={[0.5, -0.35]}
        direction={180}
        spread={34}
        rays={8}
        reach={1.2}
        intensity={0.22}
        color={COR.luz}
        fadeIn={2}
        seed="nao-e-sobre"
      />
      <Par a="par1a" b="par1b" />
      <Par a="par2a" b="par2b" />
      <Par a="par3a" b="par3b" />
    </AbsoluteFill>
  );
};

export const TituloGeracao: React.FC = () => {
  const t = txt("geracao");
  const rel = useRel();
  const { px } = useLayout();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <TextReveal
        text={t.texto}
        by="char"
        direction="center"
        delay={rel(t.inicio)}
        duration={0.9}
        stagger={0.04}
        exitAt={rel(t.fim) - 0.5}
        exitDuration={0.5}
        size={104}
        weight={500}
        tracking="0.2em"
        color={COR.marfim}
        from={{ y: 0, blur: 24, scale: 1.05 }}
        style={{ textShadow: `0 0 ${px(30)}px rgba(0,0,0,0.6)` }}
      />
    </AbsoluteFill>
  );
};
