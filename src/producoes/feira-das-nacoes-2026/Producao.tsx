/**
 * Produção "feira-das-nacoes-2026" — REEDIÇÃO do vídeo oficial.
 *
 * Diferente do animatic padrão (ProducaoGenerica), aqui a base é o vídeo
 * original (videos/oficial.mp4, com o áudio, os cortes e a ordem preservados).
 * Os grafismos são camadas por cima, posicionadas pelos tempos do roteiro
 * (timeline.json: cada cena dura exatamente o trecho entre dois cortes) e
 * pelos tempos finos de dados.ts (falas, etiquetas, transições).
 *
 * O vídeo não é versionado (99 MB): veja producoes/feira-das-nacoes-2026/materiais.md.
 */
import { Audio, Video } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile } from "remotion";
import { MotionProvider } from "../../motion";
import { duracaoProducao } from "../_runtime/ProducaoGenerica";
import type { TimelineProducao } from "../_runtime/types";
import {
  DURACAO_VIDEO,
  ETIQUETAS,
  FALA_MISSOES,
  FALA_PASTOR,
  TEXTOS,
  TRANSICOES,
  temaFeira,
  type PaisId,
} from "./dados";
import {
  Abertura,
  CarrosselBandeiras,
  CartaoEdicao,
  Encerramento,
  EtiquetaPais,
  GloboMissoes,
  IlhasIndonesia,
  Legenda,
  TercoInferior,
  TransicaoBandeira,
  UmSoPovo,
} from "./cenas/Graficos";
import timelineJson from "./timeline.json";

const timeline = timelineJson as TimelineProducao;
const FPS = timeline.fps;

export const DURACAO = duracaoProducao(timeline);

/** Início (s) de cada cena do roteiro = tempo do corte no vídeo original. */
const inicio = (id: string) => {
  let acc = 0;
  for (const c of timeline.cenas) {
    if (c.id === id) return acc;
    acc += c.duracao;
  }
  throw new Error(`cena ${id} não existe no roteiro`);
};
const duracao = (id: string) =>
  timeline.cenas.find((c) => c.id === id)!.duracao;

const f = (s: number) => Math.round(s * FPS);

/** Janela em segundos → <Sequence>. */
const Em: React.FC<{
  readonly de: number;
  readonly ate: number;
  readonly nome: string;
  readonly children: React.ReactNode;
}> = ({ de, ate, nome, children }) => (
  <Sequence
    from={f(de)}
    durationInFrames={f(ate - de)}
    name={nome}
    layout="none"
  >
    <AbsoluteFill>{children}</AbsoluteFill>
  </Sequence>
);

const TODOS: PaisId[] = [
  "brasil",
  "caboVerde",
  "mexico",
  "israel",
  "croacia",
  "indonesia",
  "portugal",
  "cuba",
  "gambia",
  "turquia",
];

const video = staticFile(`producoes/${timeline.slug}/videos/oficial.mp4`);

export const Producao: React.FC = () => {
  const fimVideo = DURACAO_VIDEO;
  const encerra = inicio("cena-12") - 0.37; // a cor cobre os últimos quadros do vídeo
  const pastor = inicio("cena-4");
  const missoes = inicio("cena-7");
  return (
    <MotionProvider theme={temaFeira}>
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        {/* Base: vídeo oficial com áudio original */}
        <Sequence durationInFrames={f(fimVideo)} name="Vídeo oficial">
          <Video
            src={video}
            objectFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </Sequence>

        {/* Cena 1 — abertura que se abre em faixas sobre o painel do evento */}
        <Em de={0} ate={2.4} nome="Abertura">
          <Abertura />
        </Em>

        {/* Cena 3 — tipografia cinética */}
        <Em de={inicio("cena-3")} ate={inicio("cena-4")} nome="Um só povo">
          <UmSoPovo dur={duracao("cena-3")} />
        </Em>

        {/* Cena 4 — palavra pastoral */}
        <Em de={pastor + 0.3} ate={pastor + 5.6} nome="Lower third pastor">
          <TercoInferior
            rotulo={TEXTOS.pastor.rotulo}
            nome={TEXTOS.pastor.nome}
            dur={5.3}
          />
        </Em>
        <Em de={15.85} ate={19.9} nome="Edição 2026">
          <CartaoEdicao dur={4.05} />
        </Em>
        <Em de={24.9} ate={28.15} nome="Carrossel de bandeiras">
          <CarrosselBandeiras dur={3.25} paises={TODOS} />
        </Em>
        <Em de={pastor} ate={inicio("cena-5")} nome="Legenda pastor">
          <Legenda
            words={FALA_PASTOR.map((w) => ({
              ...w,
              start: w.start - pastor,
              end: w.end - pastor,
            }))}
          />
        </Em>

        {/* Cena 7 — missões */}
        <Em de={missoes + 0.25} ate={missoes + 4.2} nome="Lower third missões">
          <TercoInferior
            rotulo={TEXTOS.missoes.rotulo}
            nome={TEXTOS.missoes.nome}
            dur={3.95}
          />
        </Em>
        <Em de={44.9} ate={50.05} nome="Globo das nações">
          <GloboMissoes dur={5.15} paises={TODOS} />
        </Em>
        <Em de={missoes} ate={inicio("cena-8")} nome="Legenda missões">
          <Legenda
            words={FALA_MISSOES.map((w) => ({
              ...w,
              start: w.start - missoes,
              end: w.end - missoes,
            }))}
          />
        </Em>

        {/* Indonésia — dado do painel do estande */}
        <Em de={53.4} ate={56.05} nome="+17.000 ilhas">
          <IlhasIndonesia dur={2.65} />
        </Em>

        {/* Etiquetas de país */}
        {ETIQUETAS.map((e) => (
          <Em
            key={`${e.pais}-${e.de}`}
            de={e.de}
            ate={e.ate}
            nome={`Etiqueta ${e.pais}`}
          >
            <EtiquetaPais pais={e.pais} dur={e.ate - e.de} rotulo={e.rotulo} />
          </Em>
        ))}

        {/* Transições com as cores da bandeira, por cima dos cortes */}
        {TRANSICOES.map((tr) => (
          <Em
            key={tr.pais}
            de={tr.corte - 1}
            ate={tr.corte + 0.75}
            nome={`Transição ${tr.pais}`}
          >
            <TransicaoBandeira pais={tr.pais} de={tr.de} />
          </Em>
        ))}

        {/* Cena 12 — encerramento */}
        <Em de={encerra} ate={DURACAO / FPS} nome="Encerramento">
          <Encerramento paises={TODOS} />
        </Em>
        {/* ambiência da abertura reaproveitada sob o cartão final, com fade */}
        <Sequence from={f(fimVideo - 0.2)} name="Áudio do encerramento">
          <Audio
            src={video}
            trimBefore={f(0.5)}
            volume={(fr) =>
              interpolate(fr, [0, f(0.6), f(3.4), f(5.2)], [0, 0.55, 0.55, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            }
          />
        </Sequence>
      </AbsoluteFill>
    </MotionProvider>
  );
};
