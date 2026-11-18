/**
 * Produção "13-anos-depois". Gerado por `npm run nova-producao` e refinado com cenas próprias.
 *
 * - Tempos e textos vêm de timeline.json (producoes/13-anos-depois/roteiro.md).
 *   Depois de editar o roteiro: npm run nova-producao -- --sincronizar 13-anos-depois
 * - Cada cena própria está em cenas/Ato1–5.tsx, montada com a biblioteca (src/motion).
 * - Temas "Hora Dourada" em tema.ts; cenários procedurais e placas reais em cenarios.tsx.
 * - Versão pós-lançamento: renderize com --props='{"posLancamento":true}'.
 */
import { ProducaoGenerica, duracaoProducao } from "../_runtime/ProducaoGenerica";
import type { TimelineProducao } from "../_runtime/types";
import { C1TvLiga, C2Ano2013, C3Diferente, C4OutrosPlanos } from "./cenas/Ato1";
import { C5Ano2018, C6Ano2022, C7Quando, C8Ano2026 } from "./cenas/Ato2";
import { C9Silencio, C10Renasce, C11NovasHistorias, C12JasonLucia, C13Alem } from "./cenas/Ato3";
import { C14Talvez, C15ViceCity, C16Perceber } from "./cenas/Ato4";
import { C17QuantoTempo, C18UltimaVez, C19TrezeAnos, C20Continua, C21Encerramento } from "./cenas/Ato5";
import { TEMAS } from "./tema";
import timelineJson from "./timeline.json";

const timeline = timelineJson as TimelineProducao;

export const DURACAO = duracaoProducao(timeline);

const CENAS = {
  "cena-1": C1TvLiga,
  "cena-2": C2Ano2013,
  "cena-3": C3Diferente,
  "cena-4": C4OutrosPlanos,
  "cena-5": C5Ano2018,
  "cena-6": C6Ano2022,
  "cena-7": C7Quando,
  "cena-8": C8Ano2026,
  "cena-9": C9Silencio,
  "cena-10": C10Renasce,
  "cena-11": C11NovasHistorias,
  "cena-12": C12JasonLucia,
  "cena-13": C13Alem,
  "cena-14": C14Talvez,
  "cena-15": C15ViceCity,
  "cena-16": C16Perceber,
  "cena-17": C17QuantoTempo,
  "cena-18": C18UltimaVez,
  "cena-19": C19TrezeAnos,
  "cena-20": C20Continua,
  "cena-21": C21Encerramento,
};

export const Producao = () => <ProducaoGenerica timeline={timeline} cenas={CENAS} temas={TEMAS} />;
