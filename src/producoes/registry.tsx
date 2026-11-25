/**
 * Registro das produções no Remotion Studio.
 * Este arquivo é ATUALIZADO AUTOMATICAMENTE por `npm run nova-producao`.
 * Edite à mão apenas se souber o que está fazendo (mantenha os marcadores).
 */
import React from "react";
import { Composition, Folder } from "remotion";
// <importacoes-producoes>
import { DURACAO as DUmadsal2027ArrependeiVos, Producao as PUmadsal2027ArrependeiVos } from "./umadsal-2027-arrependei-vos/Producao";
// </importacoes-producoes>

export const Producoes: React.FC = () => {
  return (
    <Folder name="Producoes">
      {/* <composicoes-producoes> */}
      <Composition id="umadsal-2027-arrependei-vos-16x9" component={PUmadsal2027ArrependeiVos} durationInFrames={DUmadsal2027ArrependeiVos} fps={30} width={1920} height={1080} />
      {/* </composicoes-producoes> */}
    </Folder>
  );
};
