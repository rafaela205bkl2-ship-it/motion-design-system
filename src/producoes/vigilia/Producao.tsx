/**
 * Produção "vigilia": cartaz animado em 9:16, gerado por `npm run nova-producao`
 * e refinado com uma cena própria (CartazAnimado.tsx) na linguagem da ref-003.
 *
 * - Camadas da arte: python3 scripts/separar-camadas.py producoes/vigilia/arte/camadas.json
 * - Trilha: python3 scripts/gerar-trilha-vigilia.py
 * - Render: npm run render:vigilia
 */
import { ProducaoGenerica, duracaoProducao } from "../_runtime/ProducaoGenerica";
import type { TimelineProducao } from "../_runtime/types";
import { CartazAnimado } from "./CartazAnimado";
import timelineJson from "./timeline.json";

const timeline = timelineJson as TimelineProducao;

export const DURACAO = duracaoProducao(timeline);

export const Producao = () => <ProducaoGenerica timeline={timeline} cenas={{ "cena-1": CartazAnimado }} />;
