/**
 * Vigília — cartaz animado em 9:16 (15 s, em loop), na linguagem da ref-003.
 *
 * A arte estática foi separada em camadas por `scripts/separar-camadas.py`
 * (contornos em producoes/vigilia/arte/camadas.json). Aqui cada camada vive num
 * plano de profundidade com escala compensada: em repouso a composição é idêntica
 * à arte; quando a câmera anda, os planos se deslocam em paralaxe real.
 *
 * Linha do tempo (s) — tempos da ref-003 entre parênteses:
 *   0,00–0,45  estouro de luz abre a peça (0,00–0,40)
 *   0,15–1,60  tudo sai do desfoque (0,40–2,30)
 *   0,55–1,50  letras do título caem e viram em 3D, em arco (0,67–1,10)
 *   0,35–1,25  risco de luz em zigue-zague na frente (0,40–1,30)
 *   0,70–2,00  fileira de trás e depois a da frente sobem com luz queimada
 *   1,50–2,60  informações nascem em sequência, com máscara e desfoque
 *   3,4 / 6,2 / 8,8 / 11,2  novos riscos de luz, entre e sobre as camadas (4,5; 9,0; 11,5)
 *   12,55–13,05 acento de cor vermelho-laranja (13,30–13,60)
 *   13,6–15,0  câmera mergulha na luz e o estouro fecha o loop (14,0–14,8)
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import {
  backOut,
  Embers,
  FilmLook,
  Grade,
  LightLeak,
  LightStreak,
  LightSweep,
  MotionProvider,
  progressAt,
  useLayout,
  VolumetricLight,
} from "../../motion";
import type { CenaProps } from "../_runtime/ProducaoGenerica";
import camadas from "../../../public/producoes/vigilia/imagens/camadas.json";

const PASTA = "producoes/vigilia/imagens";
const img = (f: string) => staticFile(`${PASTA}/${f}`);

/** Distância focal do palco (px de design). */
const FOCAL = 1400;
export const DURACAO_S = 15;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerp = (t: number, a: number[], b: number[]) => interpolate(t, a, b, clamp);

type Cam = { x: number; y: number; z: number; ry: number; rx: number };

/** Câmera: avanço lento contínuo, deriva lateral e mergulho final na luz. */
const camera = (t: number): Cam => {
  const slow = lerp(t, [0, 13.6], [0, 85]);
  const dive = progressAt(t * 30, 30, 13.6, 1.35, "enterStrong") * 300;
  return {
    z: slow + dive,
    x: Math.sin(t * 0.42) * 18,
    y: Math.sin(t * 0.31 + 1) * 8 - lerp(t, [13.6, 15], [0, 40]),
    ry: Math.sin(t * 0.37 + 0.6) * 1.6,
    rx: Math.sin(t * 0.29) * 0.6,
  };
};

/** Plano de profundidade: posição absoluta na lona, escala compensada para alinhar em repouso. */
const Plano: React.FC<{
  z: number;
  children: React.ReactNode;
  blur?: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ z, children, blur = 0, opacity = 1, style }) => {
  const { px } = useLayout();
  const { width, height } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width,
        height,
        transform: `translateZ(${px(z)}px) scale(${(FOCAL - z) / FOCAL})`,
        filter: blur > 0.05 ? `blur(${px(blur)}px)` : undefined,
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Letra do título com volume: cópias empilhadas em Z, cada uma mais escura (extrusão real). */
const Letra: React.FC<{
  l: (typeof camadas.titulo)[number];
  i: number;
  t: number;
}> = ({ l, i, t }) => {
  const { px } = useLayout();
  const start = 0.55 + i * 0.065;
  const p = progressAt(t * 30, 30, start, 0.78, "linear");
  if (p <= 0) return null;
  const e = backOut(Math.min(p, 1), 0.05);
  const n = camadas.titulo.length;
  const arc = Math.abs(i - (n - 1) / 2); // arco: as letras das pontas vêm de mais longe
  const rx = (1 - e) * -96;
  const y = (1 - e) * -(150 + arc * 26);
  const z = (1 - e) * 260;
  const rz = (1 - e) * (i - (n - 1) / 2) * 5;
  const op = Math.min(1, p * 3.2);
  const blur = (1 - Math.min(1, p * 1.6)) * 10;
  const DEPTH = 9;
  return (
    <div
      style={{
        position: "absolute",
        left: px(l.x),
        top: px(l.y),
        width: px(l.w),
        height: px(l.h),
        transformStyle: "preserve-3d",
        transformOrigin: "50% 100%",
        transform: `translate3d(0, ${px(y)}px, ${px(z)}px) rotateX(${rx}deg) rotateZ(${rz}deg)`,
        opacity: op,
      }}
    >
      {Array.from({ length: DEPTH }, (_, k) => {
        const d = DEPTH - 1 - k; // de trás para frente
        const front = d === 0;
        return (
          <Img
            key={k}
            src={img(l.arquivo)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              transform: `translateZ(${px(-d * 2.4)}px)`,
              filter: `${front ? "brightness(1.08) saturate(1.1)" : `brightness(${0.42 + 0.03 * k})`}${blur > 0.1 ? ` blur(${px(blur)}px)` : ""}`,
            }}
          />
        );
      })}
    </div>
  );
};

/** Faixa de informação: nasce com máscara da esquerda para a direita, desfoque e subida curta. */
const Faixa: React.FC<{ f: { arquivo: string; x: number; y: number; w: number; h: number }; at: number; t: number }> = ({
  f,
  at,
  t,
}) => {
  const { px } = useLayout();
  const p = progressAt(t * 30, 30, at, 0.7, "enter");
  if (p <= 0) return null;
  const wipe = progressAt(t * 30, 30, at, 0.55, "wipe");
  return (
    <Img
      src={img(f.arquivo)}
      style={{
        position: "absolute",
        left: px(f.x),
        top: px(f.y),
        width: px(f.w),
        height: px(f.h),
        opacity: Math.min(1, p * 1.8),
        transform: `translateY(${px((1 - p) * 26)}px)`,
        filter: p < 0.98 ? `blur(${px((1 - p) * 9)}px) brightness(${1 + (1 - p) * 0.8})` : undefined,
        clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`,
      }}
    />
  );
};

/** Fileira de pessoas: sobe da luz, ainda queimada e desfocada. */
const Fileira: React.FC<{ arquivo: string; y: number; w: number; h: number; at: number; t: number; dist: number }> = ({
  arquivo,
  y,
  w,
  h,
  at,
  t,
  dist,
}) => {
  const { px } = useLayout();
  const p = progressAt(t * 30, 30, at, 1.15, "enterSoft");
  return (
    <Img
      src={img(arquivo)}
      style={{
        position: "absolute",
        left: 0,
        top: px(y),
        width: px(w),
        height: px(h),
        opacity: Math.min(1, p * 1.6),
        transform: `translateY(${px((1 - p) * dist)}px) scale(${1 + (1 - p) * 0.04})`,
        transformOrigin: "50% 100%",
        filter: p < 0.99 ? `blur(${px((1 - p) * 16)}px) brightness(${1 + (1 - p) * 0.9}) sepia(${(1 - p) * 0.6})` : undefined,
      }}
    />
  );
};

const STREAKS: { at: number; pts: [number, number][]; z: number; dur: number; color?: string }[] = [
  // ref-003 0,40–1,30 s: zigue-zague que sobe da esquerda, na frente de tudo
  { at: 0.35, dur: 0.8, z: 60, pts: [[-0.08, 0.86], [0.3, 0.72], [0.12, 0.6], [0.55, 0.5], [0.4, 0.4], [1.1, 0.3]] },
  // 3,4 s: arco que contorna a fileira de trás e passa ATRÁS da fileira da frente
  { at: 3.4, dur: 0.75, z: -30, pts: [[1.08, 0.62], [0.78, 0.4], [0.5, 0.33], [0.2, 0.42], [-0.08, 0.58]] },
  // 6,2 s: diagonal baixa cruzando as informações
  { at: 6.2, dur: 0.6, z: 60, pts: [[-0.1, 0.92], [0.35, 0.8], [0.62, 0.74], [1.1, 0.6]] },
  // 8,8 s: laço sobre o título
  { at: 8.8, dur: 0.85, z: 60, pts: [[-0.08, 0.3], [0.3, 0.17], [0.55, 0.22], [0.5, 0.29], [0.42, 0.22], [0.7, 0.15], [1.1, 0.24]] },
  // 11,2 s: zigue-zague à direita, atrás da fileira da frente
  { at: 11.2, dur: 0.7, z: -30, pts: [[0.95, 1.05], [0.72, 0.8], [0.9, 0.66], [0.6, 0.5], [0.82, 0.36], [0.5, 0.18]] },
];

export const CartazAnimado: React.FC<Partial<CenaProps>> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { px } = useLayout();
  const t = frame / fps;
  const cam = camera(t);

  // Desfoque de abertura (sai do desfoque depois do estouro) e queima de luz.
  const openBlur = lerp(t, [0.15, 1.6], [24, 0]);
  const burn = lerp(t, [0.1, 1.1], [0.45, 0]);
  // Acento de cor (ref-003 13,30–13,60 s).
  const accent = lerp(t, [12.55, 12.68, 12.9, 13.05], [0, 0.72, 0.6, 0]);
  // Pulsação lenta do sol atrás do título.
  const sun = 0.75 + 0.25 * Math.sin(t * 1.1) + lerp(t, [0.9, 1.6], [0, 0.35]) - lerp(t, [1.6, 3], [0, 0.35]);
  const tras = camadas.pessoas.tras;
  const frente = camadas.pessoas.frente;
  const f = camadas.faixas;

  return (
    <MotionProvider theme="calmo">
      <AbsoluteFill style={{ backgroundColor: "#160B07", overflow: "hidden" }}>
        {/* Palco 3D */}
        <AbsoluteFill style={{ perspective: px(FOCAL), perspectiveOrigin: "50% 42%" }}>
          <AbsoluteFill
            style={{
              transformStyle: "preserve-3d",
              transform: `translate3d(${px(-cam.x)}px, ${px(-cam.y)}px, ${px(cam.z)}px) rotateX(${cam.rx}deg) rotateY(${cam.ry}deg)`,
            }}
          >
            <Plano z={-600} blur={openBlur * 1.2}>
              <Img src={img(camadas.fundo.arquivo)} style={{ width: "100%", height: "100%" }} />
            </Plano>
            <Plano z={-420} opacity={Math.min(1, sun)}>
              <VolumetricLight x={540} y={300} direction={180} spread={110} rays={10} color="#FFE6A8" intensity={0.5} reach={1300} />
            </Plano>
            <Plano z={-200} style={{ transformStyle: "preserve-3d" }}>
              {camadas.titulo.map((l, i) => (
                <Letra key={l.arquivo} l={l} i={i} t={t} />
              ))}
              <LightSweep delay={4.4} duration={1.1} angle={105} width={14} color="rgba(255,236,190,0.4)" />
              <LightSweep delay={10.1} duration={1.1} angle={75} width={12} color="rgba(255,226,170,0.32)" direction="reverse" />
            </Plano>
            <Plano z={-70} blur={openBlur * 0.6}>
              <Fileira arquivo="pessoas-tras.png" y={tras.y} w={tras.w} h={tras.h} at={0.7} t={t} dist={90} />
            </Plano>
            {STREAKS.filter((s) => s.z < 0).map((s) => (
              <Plano key={s.at} z={s.z}>
                <LightStreak points={s.pts} delay={s.at} duration={s.dur} strands={6} gap={9} width={3.6} glow={16} core="#FFF4E0" />
              </Plano>
            ))}
            <Plano z={0} blur={openBlur * 0.5}>
              <Fileira arquivo="pessoas-frente.png" y={frente.y} w={frente.w} h={frente.h} at={0.9} t={t} dist={130} />
            </Plano>
            {/* Informações: levemente à frente e um pouco menores, longe dos botões laterais do Reels */}
            <Plano z={40} style={{ transform: `translateZ(${px(40)}px) scale(${((FOCAL - 40) / FOCAL) * 0.94})`, transformOrigin: "50% 66%" }}>
              <Faixa f={f.nomes} at={1.5} t={t} />
              <Faixa f={f.data} at={1.68} t={t} />
              <Faixa f={f.local} at={1.86} t={t} />
              <Faixa f={f.entrada} at={2.04} t={t} />
              <Faixa f={f.logos} at={2.25} t={t} />
            </Plano>
          </AbsoluteFill>
        </AbsoluteFill>

        {/* Riscos de luz na frente de tudo */}
        {STREAKS.filter((s) => s.z >= 0).map((s) => (
          <LightStreak key={s.at} points={s.pts} delay={s.at} duration={s.dur} strands={6} gap={9} width={3.6} glow={16} core="#FFF4E0" />
        ))}

        {/* Brilho quente na base e faíscas subindo */}
        <AbsoluteFill
          style={{
            background: "radial-gradient(ellipse 70% 22% at 50% 100%, rgba(255,120,40,0.55) 0%, rgba(255,90,30,0.18) 45%, transparent 75%)",
            mixBlendMode: "screen",
            opacity: 0.75 + 0.25 * Math.sin(t * 2.3) * Math.sin(t * 0.9),
          }}
        />
        <Embers count={120} from={1.03} top={0.15} rise={0.075} size={3.4} bokeh={0.22} />

        {/* Queima de luz da abertura */}
        <AbsoluteFill style={{ backgroundColor: "#FFE7B8", mixBlendMode: "screen", opacity: burn }} />

        {/* Acento de cor */}
        <AbsoluteFill style={{ backgroundColor: "#E2552B", mixBlendMode: "color", opacity: accent }} />
        <AbsoluteFill
          style={{
            background: "radial-gradient(ellipse 80% 30% at 30% 92%, #FF3B2A 0%, transparent 70%)",
            mixBlendMode: "screen",
            opacity: accent * 0.9,
          }}
        />

        <Grade highlights="#FFD9A0" shadows="#2A1208" amount={0.22} vignette={0.45} bloom={0.18} bloomY={0.2} />
        <FilmLook intensity={0.55} scanlines={0} grain={0.5} vignette={0.25} flicker={0.25} tint="#FFB46A" />

        {/* Estouros de luz: abertura e fechamento (o fim encontra o começo: loop) */}
        <LightLeak at={0.06} rise={0.06} fall={0.42} />
        <LightLeak at={DURACAO_S - 1 / fps} rise={0.55} fall={0.4} angle={-35} />
      </AbsoluteFill>
    </MotionProvider>
  );
};
