/**
 * Grafismos da reedição "Feira das Nações 2026", desenhados POR CIMA do vídeo
 * oficial. Cada componente roda dentro de uma <Sequence> (tempo local, em s).
 * Só usa a biblioteca (src/motion): TextReveal, StripeBand, Globe3D, CountUp,
 * WordCaption, ColorBloom, Backdrop, Layer.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Backdrop,
  ColorBloom,
  CountUp,
  Globe3D,
  StripeBand,
  TextReveal,
  WordCaption,
  progressAt,
  textPresets,
  useLayout,
  useMotion,
  type CaptionWord,
} from "../../../motion";
import { PAISES, TEXTOS, type PaisId } from "../dados";
import { Bandeira } from "./Bandeira";

const ROXO = "#1A0E4F";

/** Progresso de entrada/saída de um bloco com duração `dur` (s). */
const useEntradaSaida = (dur: number, entrada = 0.55, saida = 0.3) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const pin = progressAt(frame, m.fps, 0, m.dur(entrada), "enterStrong");
  const pout = progressAt(frame, m.fps, dur - saida, m.dur(saida), "exit");
  return { pin, pout, m };
};

/** Escurecimento suave num canto, para dar leitura ao texto sobre o vídeo. */
const Sombra: React.FC<{
  readonly lado: "baixo-esq" | "centro" | "baixo";
  readonly forca: number;
}> = ({ lado, forca }) => {
  const bg =
    lado === "baixo-esq"
      ? `radial-gradient(ellipse 75% 70% at 0% 100%, rgba(12,6,40,${0.78 * forca}) 0%, rgba(12,6,40,0) 70%)`
      : lado === "baixo"
        ? `linear-gradient(to top, rgba(12,6,40,${0.7 * forca}) 0%, rgba(12,6,40,0) 38%)`
        : `radial-gradient(ellipse 70% 65% at 50% 50%, rgba(12,6,40,${0.62 * forca}) 0%, rgba(12,6,40,${0.25 * forca}) 100%)`;
  return <AbsoluteFill style={{ background: bg }} />;
};

/* ------------------------------------------------------------------ */
/* Transição: faixas nas cores da bandeira cobrindo o corte original   */
/* ------------------------------------------------------------------ */

/** Sequência começa 1 s antes do corte; o corte acontece em t = 1. */
export const TransicaoBandeira: React.FC<{
  readonly pais: PaisId;
  readonly de: "left" | "right" | "top" | "bottom";
}> = ({ pais, de }) => {
  const p = PAISES[pais];
  return (
    <StripeBand
      stripes={[...p.faixas, { color: ROXO, weight: 0.6 }]}
      orientation={p.orientacao === "horizontal" ? "horizontal" : "vertical"}
      from={de}
      coverAt={1}
      hold={0.05}
      duration={0.34}
      stagger={0.045}
      skew={p.orientacao === "vertical" ? -10 : 0}
    />
  );
};

/* ------------------------------------------------------------------ */
/* Etiqueta de país (cartão 3D com a bandeira + nome)                  */
/* ------------------------------------------------------------------ */

export const EtiquetaPais: React.FC<{
  readonly pais: PaisId;
  readonly dur: number;
  readonly rotulo?: string;
}> = ({ pais, dur, rotulo }) => {
  const { px, safe } = useLayout();
  const { pin, pout, m } = useEntradaSaida(dur);
  const p = PAISES[pais];
  const frame = useCurrentFrame();
  const t = frame / m.fps;
  // cartão gira em Y (entrada), balança de leve (vida) e gira para fora (saída)
  const rotY = -88 * (1 - pin) + 80 * pout + Math.sin(t * 1.6) * 6;
  const rotX = 8 * (1 - pin) + Math.cos(t * 1.3) * 3;
  const sai = dur - 0.3;
  return (
    <AbsoluteFill>
      <div style={{ opacity: pin * (1 - pout) }}>
        <Sombra lado="baixo-esq" forca={1} />
      </div>
      <div
        style={{
          position: "absolute",
          left: safe.x,
          bottom: px(120),
          display: "flex",
          alignItems: "center",
          gap: px(34),
        }}
      >
        <div style={{ perspective: px(900) }}>
          <div
            style={{
              transform: `rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${0.7 + 0.3 * pin})`,
              opacity: Math.min(1, pin * 2) * (1 - pout),
              borderRadius: px(14),
              padding: px(5),
              background: m.palette.accent,
              boxShadow: `0 ${px(18)}px ${px(40)}px rgba(0,0,0,.45), ${px(6)}px ${px(6)}px 0 ${ROXO}`,
            }}
          >
            <Bandeira pais={pais} largura={px(168)} raio={px(10)} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: px(10) }}>
          {rotulo ? (
            <TextReveal
              {...textPresets.rotulo}
              text={rotulo}
              size={26}
              color={m.palette.accent}
              delay={0.15}
              exitAt={sai}
              align="left"
            />
          ) : null}
          <TextReveal
            {...textPresets.impacto}
            direction="start"
            text={p.nome}
            size={96}
            delay={0.2}
            exitAt={sai}
            align="left"
            style={{ textShadow: `0 ${px(4)}px ${px(24)}px rgba(0,0,0,.5)` }}
          />
          <div
            style={{
              position: "relative",
              width: px(380),
              height: px(12),
              borderRadius: px(6),
              overflow: "hidden",
            }}
          >
            <StripeBand
              stripes={p.faixas}
              orientation="vertical"
              from="left"
              delay={0.35}
              exitAt={sai}
              duration={0.3}
              stagger={0.06}
              easing="enter"
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Falas: lower third + legenda sincronizada                           */
/* ------------------------------------------------------------------ */

export const TercoInferior: React.FC<{
  readonly rotulo: string;
  readonly nome: string;
  readonly dur: number;
}> = ({ rotulo, nome, dur }) => {
  const { px, safe } = useLayout();
  const { pin, pout, m } = useEntradaSaida(dur, 0.6, 0.3);
  const sai = dur - 0.3;
  return (
    <div
      style={{
        position: "absolute",
        left: safe.x,
        top: px(110),
        display: "flex",
        alignItems: "stretch",
        gap: px(22),
        perspective: px(1000),
      }}
    >
      <div
        style={{
          width: px(10),
          borderRadius: px(5),
          background: m.palette.accent,
          transform: `scaleY(${pin * (1 - pout)})`,
          transformOrigin: "top",
        }}
      />
      <div
        style={{
          padding: `${px(18)}px ${px(34)}px ${px(20)}px`,
          borderRadius: px(18),
          background: "rgba(26,14,79,0.78)",
          clipPath: `inset(0 ${100 - 100 * pin}% 0 0 round ${px(18)}px)`,
          opacity: 1 - pout,
          display: "flex",
          flexDirection: "column",
          gap: px(8),
          transform: `rotateY(${(1 - pin) * -25}deg)`,
          transformOrigin: "left",
        }}
      >
        <TextReveal
          {...textPresets.rotulo}
          text={rotulo}
          size={24}
          color={m.palette.accent}
          delay={0.25}
          exitAt={sai}
          align="left"
        />
        <TextReveal
          {...textPresets.titulo}
          text={nome}
          size={58}
          delay={0.35}
          exitAt={sai}
          align="left"
        />
      </div>
    </div>
  );
};

export const Legenda: React.FC<{ readonly words: CaptionWord[] }> = ({
  words,
}) => {
  const { px } = useLayout();
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: px(78),
      }}
    >
      <WordCaption
        words={words}
        maxWords={6}
        size={50}
        background="rgba(20,10,60,0.6)"
        maxWidth={1400}
        activeColor="#FFFFFF"
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Abertura (0–1,9 s): cartão do evento que se abre em faixas          */
/* ------------------------------------------------------------------ */

export const Abertura: React.FC = () => {
  const { px, pick } = useLayout();
  const m = useMotion();
  const frame = useCurrentFrame();
  const t = frame / m.fps;
  const abre = 1.75;
  return (
    <AbsoluteFill>
      {t < abre ? (
        <AbsoluteFill>
          <Backdrop
            color={ROXO}
            glows={[
              { x: 0.3, y: 0.5, size: 1100, color: "#6B3DF2", opacity: 0.7 },
              { x: 0.8, y: 0.2, size: 800, color: "#F7BE3A", opacity: 0.18 },
            ]}
            grain={0.12}
          />
          <AbsoluteFill
            style={{
              flexDirection: pick({ vertical: "column", horizontal: "row" }),
              justifyContent: "center",
              alignItems: "center",
              gap: px(90),
            }}
          >
            <Globe3D
              size={520}
              spin={40}
              tilt={20}
              delay={0}
              duration={0.6}
              glow="#6B3DF2"
              strokeWidth={2.2}
            />
            <div
              style={{ display: "flex", flexDirection: "column", gap: px(14) }}
            >
              <TextReveal
                {...textPresets.rotulo}
                text="Assembleia de Deus"
                color={m.palette.accent}
                delay={0.1}
                align="left"
              />
              <TextReveal
                {...textPresets.impacto}
                text={"Feira das\n*Nações*"}
                size={150}
                delay={0.18}
                align="left"
                lineHeight={0.95}
              />
              <TextReveal
                {...textPresets.frase}
                text="2026"
                size={64}
                delay={0.6}
                color={m.palette.muted}
                align="left"
                font="display"
              />
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}
      <StripeBand
        stripes={[
          { color: "#F7BE3A" },
          { color: "#FFFFFF", weight: 0.5 },
          { color: "#6B3DF2" },
          { color: ROXO },
        ]}
        orientation="vertical"
        from="right"
        coverAt={abre}
        hold={0.04}
        duration={0.32}
        stagger={0.04}
        skew={-12}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* "Muitas nações. Um só povo." (6,77–10,17 s)                         */
/* ------------------------------------------------------------------ */

export const UmSoPovo: React.FC<{ readonly dur: number }> = ({ dur }) => {
  const { pin, pout } = useEntradaSaida(dur, 0.4, 0.25);
  return (
    <AbsoluteFill>
      <div
        style={{ position: "absolute", inset: 0, opacity: pin * (1 - pout) }}
      >
        <Sombra lado="centro" forca={1} />
      </div>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <TextReveal
          {...textPresets.impacto}
          text="Muitas nações."
          size={140}
          delay={0.15}
          exitAt={1.5}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <TextReveal
          {...textPresets.impacto}
          text="Um só *povo*."
          size={150}
          delay={1.7}
          exitAt={dur - 0.3}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Destaques das falas                                                 */
/* ------------------------------------------------------------------ */

/** "edição 2026": cartão no alto, à direita, com contador. */
export const CartaoEdicao: React.FC<{ readonly dur: number }> = ({ dur }) => {
  const { px, safe } = useLayout();
  const { pin, pout, m } = useEntradaSaida(dur, 0.5, 0.3);
  return (
    <div
      style={{
        position: "absolute",
        right: safe.x,
        top: px(110),
        display: "flex",
        alignItems: "center",
        gap: px(26),
        padding: `${px(22)}px ${px(36)}px`,
        borderRadius: px(26),
        background: "rgba(26,14,79,0.8)",
        border: `${px(3)}px solid ${m.palette.accent}`,
        transform: `perspective(${px(1000)}px) rotateY(${(1 - pin) * 70 - pout * 60}deg) scale(${0.85 + 0.15 * pin})`,
        transformOrigin: "right",
        opacity: Math.min(1, pin * 1.6) * (1 - pout),
      }}
    >
      <Globe3D size={150} spin={50} strokeWidth={2.4} step={30} delay={0.1} />
      <div style={{ display: "flex", flexDirection: "column", gap: px(4) }}>
        <TextReveal
          {...textPresets.rotulo}
          text="Edição"
          size={24}
          color={m.palette.muted}
          delay={0.2}
          align="left"
        />
        <CountUp
          value={2026}
          from={1990}
          delay={0.25}
          duration={1.2}
          size={110}
          color={m.palette.accent}
          grouping={false}
        />
      </div>
    </div>
  );
};

/** "outras nações": carrossel 3D de bandeiras girando. */
export const CarrosselBandeiras: React.FC<{
  readonly dur: number;
  readonly paises: PaisId[];
}> = ({ dur, paises }) => {
  const { px } = useLayout();
  const { width, height } = useVideoConfig();
  const { pin, pout, m } = useEntradaSaida(dur, 0.7, 0.35);
  const frame = useCurrentFrame();
  const t = frame / m.fps;
  const n = paises.length;
  const R = px(270);
  const ang = -t * 42 + (1 - pin) * 120;
  return (
    <div
      style={{
        position: "absolute",
        left: width * 0.82,
        top: height * 0.33,
        width: 0,
        height: 0,
        perspective: px(1400),
        opacity: pin * (1 - pout),
      }}
    >
      <div
        style={{
          position: "absolute",
          transformStyle: "preserve-3d",
          transform: `rotateX(-10deg) rotateY(${ang}deg) scale(${0.5 + 0.5 * pin})`,
        }}
      >
        {paises.map((pais, i) => (
          <div
            key={pais}
            style={{
              position: "absolute",
              left: -px(80),
              top: -px(54),
              transform: `rotateY(${(i * 360) / n}deg) translateZ(${R}px)`,
              backfaceVisibility: "hidden",
              borderRadius: px(10),
              padding: px(4),
              background: m.palette.accent,
              boxShadow: `0 ${px(10)}px ${px(26)}px rgba(0,0,0,.4)`,
            }}
          >
            <Bandeira pais={pais} largura={px(152)} raio={px(7)} />
          </div>
        ))}
      </div>
    </div>
  );
};

/** "países perseguidos" / "missionários": globo com os países da feira. */
export const GloboMissoes: React.FC<{
  readonly dur: number;
  readonly paises: PaisId[];
}> = ({ dur, paises }) => {
  const { px } = useLayout();
  const { width, height } = useVideoConfig();
  const { pin, pout, m } = useEntradaSaida(dur, 0.6, 0.3);
  const D = px(400);
  return (
    <div
      style={{
        position: "absolute",
        left: width * 0.8 - D / 2,
        top: height * 0.38 - D / 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: px(18),
        opacity: 1 - pout,
      }}
    >
      <div
        style={{
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(26,14,79,${0.75 * pin}) 0%, rgba(26,14,79,0) 70%)`,
        }}
      >
        <Globe3D
          size={400}
          spin={24}
          startLon={10}
          tilt={22}
          duration={0.6}
          strokeWidth={2.2}
          glow="#6B3DF2"
          markers={paises.map((p, i) => ({
            lat: PAISES[p].lat,
            lon: PAISES[p].lon,
            at: 0.4 + i * 0.12,
            size: 11,
            color: i % 2 === 0 ? m.palette.accent : "#FFFFFF",
          }))}
        />
      </div>
      <TextReveal
        {...textPresets.rotulo}
        text="Ore pelas nações"
        size={30}
        color={m.palette.accent}
        delay={2.6}
        exitAt={dur - 0.3}
        style={{ textShadow: "0 2px 14px rgba(0,0,0,.6)" }}
      />
    </div>
  );
};

/** "+17.000 ilhas" (Indonésia) — dado do painel do estande. */
export const IlhasIndonesia: React.FC<{ readonly dur: number }> = ({ dur }) => {
  const { px, safe } = useLayout();
  const { pin, pout, m } = useEntradaSaida(dur, 0.5, 0.3);
  return (
    <div
      style={{
        position: "absolute",
        right: safe.x,
        bottom: px(120),
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: px(4),
        opacity: 1 - pout,
        transform: `translateY(${(1 - pin) * px(40)}px)`,
      }}
    >
      <CountUp
        value={17000}
        prefix="+"
        delay={0.1}
        duration={1.4}
        size={120}
        color={m.palette.accent}
        style={{ textShadow: "0 4px 24px rgba(0,0,0,.55)" }}
      />
      <TextReveal
        {...textPresets.rotulo}
        text="ilhas"
        size={32}
        delay={0.4}
        exitAt={dur - 0.3}
        style={{ textShadow: "0 2px 14px rgba(0,0,0,.6)" }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Encerramento                                                        */
/* ------------------------------------------------------------------ */

export const Encerramento: React.FC<{ readonly paises: PaisId[] }> = ({
  paises,
}) => {
  const { px, pick } = useLayout();
  const m = useMotion();
  const frame = useCurrentFrame();
  const fundo = progressAt(frame, m.fps, 0.35, 0.4, "enter");
  return (
    <AbsoluteFill>
      <ColorBloom
        steps={[{ color: ROXO, at: 0 }]}
        origin={[0.5, 0.55]}
        duration={0.5}
      />
      <AbsoluteFill style={{ opacity: fundo }}>
        <Backdrop
          color={ROXO}
          glows={[
            { x: 0.3, y: 0.5, size: 1100, color: "#6B3DF2", opacity: 0.65 },
            { x: 0.75, y: 0.75, size: 900, color: "#F7BE3A", opacity: 0.14 },
          ]}
          grain={0.12}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          flexDirection: pick({ vertical: "column", horizontal: "row" }),
          justifyContent: "center",
          alignItems: "center",
          gap: px(100),
        }}
      >
        <Globe3D
          size={620}
          spin={16}
          startLon={-20}
          tilt={18}
          delay={0.35}
          duration={0.8}
          glow="#6B3DF2"
          strokeWidth={2.2}
          markers={paises.map((p, i) => ({
            lat: PAISES[p].lat,
            lon: PAISES[p].lon,
            at: 0.9 + i * 0.08,
            size: 12,
            color: m.palette.accent,
          }))}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: px(16),
            maxWidth: px(940),
          }}
        >
          <TextReveal
            {...textPresets.rotulo}
            text="Assembleia de Deus"
            color={m.palette.accent}
            delay={0.55}
            align="left"
          />
          <TextReveal
            {...textPresets.impacto}
            text={"Feira das\n*Nações* 2026"}
            size={150}
            delay={0.65}
            align="left"
            lineHeight={0.98}
          />
          <TextReveal
            {...textPresets.frase}
            text={TEXTOS.versiculo}
            size={46}
            delay={1.4}
            color={m.palette.ink}
            align="left"
            maxWidth={920}
          />
          <TextReveal
            {...textPresets.rotulo}
            text={TEXTOS.referencia}
            size={26}
            delay={1.9}
            color={m.palette.muted}
            align="left"
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
