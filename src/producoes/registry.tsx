/**
 * Registro das produções no Remotion Studio.
 * Este arquivo é ATUALIZADO AUTOMATICAMENTE por `npm run nova-producao`.
 * Edite à mão apenas se souber o que está fazendo (mantenha os marcadores).
 */
import React from "react";
import { Composition, Folder } from "remotion";
// <importacoes-producoes>
import {
  DURACAO as DDespedidaUniversitaria,
  Producao as PDespedidaUniversitaria,
} from "./despedida-universitaria/Producao";
// </importacoes-producoes>

export const Producoes: React.FC = () => {
  return (
    <Folder name="Producoes">
      {/* <composicoes-producoes> */}
      <Composition
        id="despedida-universitaria-9x16"
        component={PDespedidaUniversitaria}
        durationInFrames={DDespedidaUniversitaria}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="despedida-universitaria-16x9"
        component={PDespedidaUniversitaria}
        durationInFrames={DDespedidaUniversitaria}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* </composicoes-producoes> */}
    </Folder>
  );
};
