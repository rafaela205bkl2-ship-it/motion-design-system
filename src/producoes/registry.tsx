/**
 * Registro das produções no Remotion Studio.
 * Este arquivo é ATUALIZADO AUTOMATICAMENTE por `npm run nova-producao`.
 * Edite à mão apenas se souber o que está fazendo (mantenha os marcadores).
 */
import React from "react";
import { Composition, Folder } from "remotion";
// <importacoes-producoes>
import { DURACAO as D13AnosDepois, Producao as P13AnosDepois } from "./13-anos-depois/Producao";
// </importacoes-producoes>

export const Producoes: React.FC = () => {
  return (
    <Folder name="Producoes">
      {/* <composicoes-producoes> */}
      <Composition id="13-anos-depois-9x16" component={P13AnosDepois} durationInFrames={D13AnosDepois} fps={30} width={1080} height={1920} />
      {/* </composicoes-producoes> */}
    </Folder>
  );
};
