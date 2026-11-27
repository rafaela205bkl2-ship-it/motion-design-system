/**
 * Produção "aline-barbosa-apresentacao" — Reels de apresentação (62 s, 9:16).
 *
 * - Estrutura e tempos vêm de timeline.json (gerado a partir de producoes/aline-barbosa-apresentacao/roteiro.md).
 *   Cada cena começa exatamente no tempo da narração (a duração inclui a sobreposição da transição).
 * - Todas as cenas são próprias (cenas/), feitas só com a biblioteca src/motion.
 * - Depois de editar o roteiro: npm run nova-producao -- --sincronizar aline-barbosa-apresentacao
 */
import { ProducaoGenerica, duracaoProducao } from "../_runtime/ProducaoGenerica";
import type { TimelineProducao } from "../_runtime/types";
import { Cena1Abertura, Cena2Burocracia, Cena3Prazer, Cena4QuemSou } from "./cenas/Bloco1";
import { Cena5Trajetoria, Cena6Horas, Cena7ComoTrabalho, Cena8Servicos } from "./cenas/Bloco2";
import { Cena9Objetivo, Cena10SemFronteiras, Cena11Fecho, Cena12Assinatura } from "./cenas/Bloco3";
import { COR, temaMarinho } from "./marca/tema";
import timelineJson from "./timeline.json";

const timeline = timelineJson as TimelineProducao;

export const DURACAO = duracaoProducao(timeline);

const cenas = {
  "cena-1": Cena1Abertura,
  "cena-2": Cena2Burocracia,
  "cena-3": Cena3Prazer,
  "cena-4": Cena4QuemSou,
  "cena-5": Cena5Trajetoria,
  "cena-6": Cena6Horas,
  "cena-7": Cena7ComoTrabalho,
  "cena-8": Cena8Servicos,
  "cena-9": Cena9Objetivo,
  "cena-10": Cena10SemFronteiras,
  "cena-11": Cena11Fecho,
  "cena-12": Cena12Assinatura,
};

/** Cor do anel/faixa de cada transição (sai da cena indicada). */
const corDaTransicao = {
  "cena-1": COR.azul,
  "cena-2": COR.gelo,
  "cena-3": COR.gelo,
  "cena-4": COR.marinho,
  "cena-5": COR.azul,
  "cena-6": COR.azul,
  "cena-7": COR.marinho,
  "cena-8": COR.marinho,
  "cena-9": COR.azul,
  "cena-10": COR.azul,
  "cena-11": COR.gelo,
};

export const Producao = () => (
  <ProducaoGenerica timeline={timeline} cenas={cenas} tema={temaMarinho} corDaTransicao={corDaTransicao} />
);
