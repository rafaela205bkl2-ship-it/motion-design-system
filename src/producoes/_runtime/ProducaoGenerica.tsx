/**
 * Runtime de produção: transforma a linha do tempo de um roteiro em vídeo
 * usando SOMENTE a biblioteca (src/motion). Nada é reconstruído aqui.
 *
 * - Cada cena vira um animatic com os textos, imagem e vídeo do roteiro.
 * - Qualquer cena pode ser substituída por um componente próprio (prop `cenas`).
 */
import { Audio, Video } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import {
  Backdrop,
  Layer,
  MotionProvider,
  ObjectEnter,
  TextReveal,
  blendThemes,
  objectPresets,
  textPresets,
  themes,
  transitionPreset,
  transitionFrames,
  useLayout,
  type Theme,
} from "../../motion";
import type { CenaRoteiro, Estilo, TimelineProducao } from "./types";

/** Tema de cada estilo. "misto" = ritmo intermediário com paleta do calmo. */
export const temaDoEstilo = (estilo: Estilo): Theme =>
  estilo === "misto"
    ? blendThemes("calmo", "vibrante", { motion: 0.5, palette: 0.0 })
    : themes[estilo];

const FRAMES_TRANSICAO: Record<string, string> = {
  "radial-rapido": "fast",
  "radial-suave": "base",
  dissolve: "dissolve",
  "fade-branco": "dissolve",
};

/** Duração total em quadros (cenas − sobreposição das transições). */
export const duracaoProducao = (tl: TimelineProducao) =>
  tl.cenas.reduce((acc, c, i) => {
    const frames = Math.round(c.duracao * tl.fps);
    const last = i === tl.cenas.length - 1;
    const t = c.transicao ?? "dissolve";
    const overlap =
      last || t === "corte"
        ? 0
        : transitionFrames(tl.fps, FRAMES_TRANSICAO[t] as "fast");
    return acc + frames - overlap;
  }, 0);

export type CenaProps = { cena: CenaRoteiro; slug: string; tema: Theme };

/** Cena genérica (animatic): rótulo, texto, apoio, imagem e/ou vídeo de fundo. */
export const CenaGenerica: React.FC<CenaProps> = ({ cena, slug, tema }) => {
  const { pick, px, safe } = useLayout();
  const p = tema.palette;
  const vibrante = tema.name === "vibrante";
  const asset = (f: string) => staticFile(`producoes/${slug}/${f}`);
  const temImagem = Boolean(cena.imagem);
  return (
    <MotionProvider theme={tema}>
      <AbsoluteFill>
        <Backdrop
          glows={[
            {
              x: 0.5,
              y: 0.5,
              size: 1300,
              color: p.glow,
              opacity: vibrante ? 0.5 : 0.75,
            },
          ]}
          grain={0.1}
        />
        {cena.video ? (
          <Layer depth={0.15} blur={8}>
            <Video
              src={asset(cena.video)}
              muted
              objectFit="cover"
              style={{ width: "100%", height: "100%" }}
            />
            <AbsoluteFill style={{ background: p.background, opacity: 0.35 }} />
          </Layer>
        ) : null}
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: pick({
              vertical: "column",
              horizontal: temImagem ? "row" : "column",
              square: "column",
            }),
            gap: px(pick({ vertical: 70, horizontal: 110, square: 50 })),
            // área segura do formato (topo/base maiores no 9:16)
            padding: `${safe.top}px ${safe.x}px ${safe.bottom}px`,
          }}
        >
          {temImagem ? (
            <ObjectEnter {...objectPresets.flutuante} delay={0.15}>
              <Img
                src={asset(cena.imagem!)}
                style={{
                  maxWidth: px(
                    pick({ vertical: 760, horizontal: 720, square: 520 }),
                  ),
                  maxHeight: px(
                    pick({ vertical: 760, horizontal: 640, square: 440 }),
                  ),
                  objectFit: "contain",
                  borderRadius: px(32),
                }}
              />
            </ObjectEnter>
          ) : null}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: px(24),
            }}
          >
            {cena.rotulo ? (
              <TextReveal
                {...textPresets.rotulo}
                text={cena.rotulo}
                color={p.muted}
                delay={0.1}
              />
            ) : null}
            {cena.texto ? (
              <TextReveal
                {...(vibrante ? textPresets.impacto : textPresets.titulo)}
                text={cena.texto}
                delay={0.3}
                size={pick({ vertical: 132, horizontal: 120, square: 104 })}
                maxWidth={pick({
                  vertical: 920,
                  horizontal: temImagem ? 820 : 1500,
                  square: 900,
                })}
              />
            ) : null}
            {cena.apoio ? (
              <TextReveal
                {...textPresets.frase}
                text={cena.apoio}
                delay={0.9}
                size={56}
                color={p.muted}
                maxWidth={pick({
                  vertical: 900,
                  horizontal: 1200,
                  square: 860,
                })}
              />
            ) : null}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </MotionProvider>
  );
};

/**
 * Produção completa a partir da linha do tempo.
 *
 * <ProducaoGenerica timeline={tl} cenas={{ "cena-2": MinhaCena }} />
 */
export const ProducaoGenerica: React.FC<{
  readonly timeline: TimelineProducao;
  /** Substituições: id da cena → componente próprio. */
  readonly cenas?: Record<string, React.FC<CenaProps>>;
  /** Tema próprio da produção (ex.: createTheme). Sobrescreve o estilo do roteiro em cenas e transições. */
  readonly tema?: Theme;
}> = ({ timeline: tl, cenas = {}, tema: temaProducao }) => {
  const items: React.ReactNode[] = [];
  tl.cenas.forEach((cena, i) => {
    const tema = temaProducao ?? temaDoEstilo(cena.estilo ?? tl.estilo);
    const Comp = cenas[cena.id] ?? CenaGenerica;
    items.push(
      <TransitionSeries.Sequence
        key={cena.id}
        name={cena.nome}
        durationInFrames={Math.round(cena.duracao * tl.fps)}
      >
        <Comp cena={cena} slug={tl.slug} tema={tema} />
      </TransitionSeries.Sequence>,
    );
    const t = cena.transicao ?? "dissolve";
    if (i < tl.cenas.length - 1 && t !== "corte") {
      const next =
        temaProducao ?? temaDoEstilo(tl.cenas[i + 1].estilo ?? tl.estilo);
      const tr = transitionPreset(t, {
        fps: tl.fps,
        ringColor: next.palette.accent,
      });
      items.push(
        <TransitionSeries.Transition
          key={`${cena.id}-t`}
          presentation={tr.presentation}
          timing={tr.timing}
        />,
      );
    }
  });
  return (
    <>
      <TransitionSeries>{items}</TransitionSeries>
      {tl.trilha ? (
        <Audio src={staticFile(`producoes/${tl.slug}/${tl.trilha}`)} />
      ) : null}
    </>
  );
};
