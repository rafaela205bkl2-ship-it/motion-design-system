/**
 * Produção "despedida-universitaria". Gerado por `npm run nova-producao`.
 *
 * - O conteúdo vem de timeline.json (gerado a partir de producoes/despedida-universitaria/roteiro.md).
 *   Depois de editar o roteiro: npm run nova-producao -- --sincronizar despedida-universitaria
 * - Para trocar uma cena do animatic por uma cena própria, crie o componente
 *   (usando a biblioteca em src/motion) e passe em `cenas`, ex.: { "cena-2": MinhaCena }.
 */
import {
  ProducaoGenerica,
  duracaoProducao,
} from "../_runtime/ProducaoGenerica";
import type { TimelineProducao } from "../_runtime/types";
import { Cena1, Cena2, Cena3, Cena4, Cena5, temaDespedida } from "./cenas";
import timelineJson from "./timeline.json";

const timeline = timelineJson as TimelineProducao;

export const DURACAO = duracaoProducao(timeline);

export const Producao = () => (
  <ProducaoGenerica
    timeline={timeline}
    tema={temaDespedida}
    cenas={{
      "cena-1": Cena1,
      "cena-2": Cena2,
      "cena-3": Cena3,
      "cena-4": Cena4,
      "cena-5": Cena5,
    }}
  />
);
