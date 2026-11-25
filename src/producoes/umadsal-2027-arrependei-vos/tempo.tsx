/**
 * Montagem em tempo absoluto (segundos do filme), sincronizada com a trilha.
 *
 * <Plano de={37.5} ate={53.5} entra={0.8}> … </Plano>
 *   - aparece em `de`, com fade de entrada de `entra` s (dissolve sobre o plano anterior);
 *   - some em `ate`, com fade de saída de `sai` s terminando em `ate`.
 * Dentro do plano, useRel() converte um instante absoluto em tempo local,
 * para que todas as marcações venham de cues.json.
 */
import React, { createContext, useContext } from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import cuesJson from "./cues.json";

export type Texto = {
  id: string;
  texto: string;
  inicio: number;
  fim: number;
  risco?: number;
};
export const CUES = cuesJson as unknown as {
  fps: number;
  duracao: number;
  impactos: Record<string, number>;
  textos: Texto[];
  narracao: { id: string; inicio: number; fim: number; texto: string }[];
};
export const HIT = CUES.impactos;
export const txt = (id: string): Texto => {
  const t = CUES.textos.find((x) => x.id === id);
  if (!t) throw new Error(`Texto inexistente em cues.json: ${id}`);
  return t;
};

const T0 = createContext(0);
/** Converte segundos absolutos do filme em segundos locais do plano atual. */
export const useRel = () => {
  const t0 = useContext(T0);
  return (abs: number) => abs - t0;
};
/** Tempo absoluto atual (s). */
export const useAbs = () => {
  const t0 = useContext(T0);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return t0 + frame / fps;
};

export const Plano: React.FC<{
  de: number;
  ate: number;
  entra?: number;
  sai?: number;
  nome?: string;
  children: React.ReactNode;
}> = ({ de, ate, entra = 0, sai = 0, nome, children }) => {
  const { fps } = useVideoConfig();
  const pai = useContext(T0);
  const absFrom = Math.round(de * fps);
  const dur = Math.max(1, Math.round(ate * fps) - absFrom);
  // a Sequence é relativa ao plano pai; o contexto guarda o início absoluto
  return (
    <Sequence
      from={absFrom - Math.round(pai * fps)}
      durationInFrames={dur}
      name={nome}
      premountFor={Math.round(fps * 1.5)}
    >
      <T0.Provider value={absFrom / fps}>
        <Envelope entra={entra} sai={sai} dur={dur / fps}>
          {children}
        </Envelope>
      </T0.Provider>
    </Sequence>
  );
};

const Envelope: React.FC<{
  entra: number;
  sai: number;
  dur: number;
  children: React.ReactNode;
}> = ({ entra, sai, dur, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const a =
    entra > 0
      ? interpolate(t, [0, entra], [0, 1], { extrapolateRight: "clamp" })
      : 1;
  const b =
    sai > 0
      ? interpolate(t, [dur - sai, dur], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
  return (
    <AbsoluteFill style={{ opacity: Math.min(a, b) }}>{children}</AbsoluteFill>
  );
};

/** Envelope 0→1→0 por instantes absolutos (para camadas dentro de um plano). */
export const envelope = (
  t: number,
  a: number,
  b: number,
  c: number,
  d: number,
) =>
  interpolate(t, [a, b, c, d], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
