/**
 * Produção "13-anos-depois". Gerado por `npm run nova-producao`.
 *
 * - O conteúdo vem de timeline.json (gerado a partir de producoes/13-anos-depois/roteiro.md).
 *   Depois de editar o roteiro: npm run nova-producao -- --sincronizar 13-anos-depois
 * - Para trocar uma cena do animatic por uma cena própria, crie o componente
 *   (usando a biblioteca em src/motion) e passe em `cenas`, ex.: { "cena-2": MinhaCena }.
 */
import { ProducaoGenerica, duracaoProducao } from "../_runtime/ProducaoGenerica";
import type { TimelineProducao } from "../_runtime/types";
import timelineJson from "./timeline.json";

const timeline = timelineJson as TimelineProducao;

export const DURACAO = duracaoProducao(timeline);

export const Producao = () => <ProducaoGenerica timeline={timeline} cenas={{}} />;
