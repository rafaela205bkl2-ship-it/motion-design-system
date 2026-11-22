/**
 * Registro das produções no Remotion Studio.
 * Este arquivo é ATUALIZADO AUTOMATICAMENTE por `npm run nova-producao`.
 * Edite à mão apenas se souber o que está fazendo (mantenha os marcadores).
 */
import React from "react";
import { Composition, Folder } from "remotion";
// <importacoes-producoes>
import { DURACAO as DFeiraDasNacoes2026, Producao as PFeiraDasNacoes2026 } from "./feira-das-nacoes-2026/Producao";
// </importacoes-producoes>

export const Producoes: React.FC = () => {
  return (
    <Folder name="Producoes">
      {/* <composicoes-producoes> */}
      <Composition id="feira-das-nacoes-2026-16x9" component={PFeiraDasNacoes2026} durationInFrames={DFeiraDasNacoes2026} fps={30} width={1920} height={1080} />
      {/* </composicoes-producoes> */}
    </Folder>
  );
};
