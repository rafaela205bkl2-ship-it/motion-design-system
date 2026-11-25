/**
 * Produção "umadsal-2027-arrependei-vos" — filme de lançamento da identidade UMADSAL 2027.
 * Criada com `npm run nova-producao`; as cenas do animatic foram substituídas por cenas próprias
 * (cenas/Ato1–4.tsx), feitas com a biblioteca src/motion.
 *
 * Montagem em tempo absoluto: cues.json é a fonte única (vídeo + trilha).
 * A narração NÃO está aqui: as janelas para ela estão em cues.json → "narracao"
 * e em producoes/umadsal-2027-arrependei-vos/guia-de-narracao.md.
 */
import { Audio } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FilmLook, MotionProvider } from "../../motion";
import { Abertura, Arrependei } from "./cenas/Ato1";
import {
  ArteCiencia,
  Chamar,
  Eden,
  Geracao,
  Imperios,
  Interrompida,
  Michelangelo,
  NaoESobre,
  TituloGeracao,
} from "./cenas/Ato2";
import { ETempo, Ecoa, Voltar } from "./cenas/Ato3";
import { Assinatura, Camisa, Revelacao, Umadsal } from "./cenas/Ato4";
import { COR, TRILHA, tema } from "./marca";
import { CUES, HIT, Plano } from "./tempo";

export const DURACAO = Math.round(CUES.duracao * CUES.fps);

const Filme: React.FC = () => (
  <AbsoluteFill style={{ background: COR.preto }}>
    {/* ATO 1 — O CHAMADO */}
    <Plano de={0} ate={11} nome="abertura">
      <Abertura />
    </Plano>
    <Plano de={HIT.arrependei} ate={19.9} sai={1.1} nome="arrependei">
      <Arrependei />
    </Plano>
    {/* ATO 2 — A MENSAGEM */}
    <Plano de={19.8} ate={30.6} entra={1.2} nome="imperios">
      <Imperios />
    </Plano>
    <Plano de={30} ate={38.4} nome="arte-ciencia">
      <ArteCiencia />
    </Plano>
    <Plano de={37.5} ate={53.7} entra={0.9} nome="michelangelo">
      <Michelangelo />
    </Plano>
    <Plano de={53.5} ate={58} entra={0.15} nome="interrompida">
      <Interrompida />
    </Plano>
    <Plano de={58} ate={66.4} entra={0.6} nome="eden">
      <Eden />
    </Plano>
    <Plano de={66} ate={72.6} entra={0.4} nome="chamar">
      <Chamar />
    </Plano>
    <Plano de={72} ate={84.6} nome="geracao">
      <Geracao />
    </Plano>
    <Plano de={84} ate={103.8} entra={0.8} nome="nao-e-sobre">
      <NaoESobre />
    </Plano>
    <Plano de={70.4} ate={74.6} nome="titulo-geracao">
      <TituloGeracao />
    </Plano>
    {/* ATO 3 — A IDENTIDADE */}
    <Plano de={103.5} ate={108.6} entra={0.6} nome="ecoa">
      <Ecoa />
    </Plano>
    <Plano de={108} ate={116.4} entra={1.0} nome="voltar">
      <Voltar />
    </Plano>
    <Plano de={116} ate={HIT.corteClimax} nome="e-tempo">
      <ETempo />
    </Plano>
    {/* ATO 4 — A REVELAÇÃO */}
    <Plano de={HIT.climax} ate={144.5} nome="revelacao">
      <Revelacao />
    </Plano>
    <Plano de={HIT.camisa} ate={152.6} nome="camisa">
      <Camisa />
    </Plano>
    <Plano de={HIT.logo} ate={158.9} sai={0.7} nome="umadsal">
      <Umadsal />
    </Plano>
    <Plano de={158.7} ate={170} entra={0.8} sai={1.4} nome="assinatura">
      <Assinatura />
    </Plano>
  </AbsoluteFill>
);

const Master: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // a tela se abre no clímax: fim do letterbox 2,39:1
  const lb = interpolate(t, [HIT.climax, HIT.climax + 0.9], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const luz = 1 - lb; // ato 4: menos grão e vinheta (marca limpa)
  return (
    <FilmLook
      letterbox={lb}
      grain={0.15 - 0.08 * luz}
      vignette={0.48 - 0.24 * luz}
      flicker={0.022 * (1 - luz)}
      weave={0.7 - 0.4 * luz}
    >
      <Filme />
    </FilmLook>
  );
};

export const Producao = () => (
  <MotionProvider theme={tema}>
    <Master />
    <Audio src={TRILHA} />
  </MotionProvider>
);
