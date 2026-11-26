/**
 * Produção "umadsal-2027-arrependei-vos" — filme de lançamento da identidade UMADSAL 2027.
 * Versão 2: 60 s, 120 BPM, montagem dinâmica no estilo das referências ref-003 e ref-004.
 * Criada com `npm run nova-producao`; as cenas foram substituídas por cenas próprias (cenas/Blocos.tsx),
 * feitas com a biblioteca src/motion.
 *
 * Montagem em tempo absoluto: cues.json é a fonte única (vídeo + trilha).
 * A narração NÃO está aqui: as janelas para ela estão em cues.json → "narracao"
 * e em producoes/umadsal-2027-arrependei-vos/guia-de-narracao.md.
 */
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill } from "remotion";
import { FilmLook, MotionProvider, PaletteWipe } from "../../motion";
import {
  Abertura,
  Chamado,
  Interrompida,
  Maos,
  Objetos,
  Pares,
  Revelacao,
  Tempo,
} from "./cenas/Blocos";
import { COR, TRILHA, tema } from "./marca";
import { CUES, HIT, Plano } from "./tempo";

export const DURACAO = Math.round(CUES.duracao * CUES.fps);

const Filme: React.FC = () => (
  <AbsoluteFill style={{ background: COR.preto }}>
    <Plano de={0} ate={6.4} nome="abertura">
      <Abertura />
    </Plano>
    <Plano de={HIT.objetos} ate={14.4} nome="objetos">
      <Objetos />
    </Plano>
    <Plano de={HIT.maos} ate={HIT.interrompida} nome="maos">
      <Maos />
    </Plano>
    <Plano de={HIT.interrompida} ate={HIT.chamado} nome="interrompida">
      <Interrompida />
    </Plano>
    <Plano de={HIT.chamado} ate={HIT.par1a} nome="chamado">
      <Chamado />
    </Plano>
    <Plano de={HIT.par1a} ate={HIT.tempo1} nome="pares">
      <Pares />
    </Plano>
    <Plano de={HIT.tempo1} ate={HIT.climax} nome="tempo">
      <Tempo />
    </Plano>
    <Plano de={HIT.climax} ate={CUES.duracao} sai={0.6} nome="revelacao">
      <Revelacao />
    </Plano>
    {/* transições com as cores oficiais do PDF */}
    <PaletteWipe
      at={HIT.objetos}
      colors={[COR.ouro, COR.vinho, COR.navy]}
      duration={0.6}
    />
    <PaletteWipe
      at={HIT.maos}
      colors={[COR.navy, COR.ouro, COR.creme]}
      duration={0.6}
      direction="left"
    />
    <PaletteWipe
      at={HIT.par1a}
      colors={[COR.vinho, COR.ouro, COR.creme]}
      duration={0.5}
      direction="up"
    />
  </AbsoluteFill>
);

export const Producao = () => (
  <MotionProvider theme={tema}>
    <FilmLook grain={0.12} vignette={0.3} flicker={0.01} weave={0.4}>
      <Filme />
    </FilmLook>
    <Audio src={TRILHA} />
  </MotionProvider>
);
