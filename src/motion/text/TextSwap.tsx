import React from "react";
import { useMotion, type TimeValue } from "../MotionProvider";
import { TextReveal, type TextRevealProps } from "./TextReveal";

export type TextSwapItem = {
  readonly text: string;
  /** Início da entrada deste texto, em segundos. */
  readonly at: number;
};

export type TextSwapProps = Omit<
  TextRevealProps,
  "text" | "delay" | "exitAt"
> & {
  readonly items: TextSwapItem[];
  /**
   * Quanto (s) a saída do texto atual começa ANTES da entrada do próximo.
   * Padrão: a saída inteira — o novo texto só começa quando o antigo já se desfez,
   * evitando dois textos legíveis ao mesmo tempo (as letras novas nascem desfocadas).
   */
  readonly overlap?: TimeValue;
  /** Saída do último texto, em segundos. Omitido = o último fica. */
  readonly lastExitAt?: number;
};

/**
 * Troca de textos no mesmo lugar: o atual sai em desfoque enquanto o
 * próximo é revelado. Todos ocupam a mesma célula de grade, então o
 * bloco não "pula" de tamanho entre trocas.
 */
export const TextSwap: React.FC<TextSwapProps> = ({
  items,
  overlap,
  lastExitAt,
  align = "center",
  style,
  ...reveal
}) => {
  const m = useMotion();
  const exitDur = m.dur(reveal.exitDuration ?? "swap", reveal.speed);
  const lead = overlap === undefined ? exitDur : m.dur(overlap, reveal.speed);

  return (
    <div
      style={{
        display: "grid",
        justifyItems:
          align === "center" ? "center" : align === "right" ? "end" : "start",
        ...style,
      }}
    >
      {items.map((item, i) => {
        const next = items[i + 1];
        const exitAt = next ? Math.max(item.at, next.at - lead) : lastExitAt;
        return (
          <div key={`${i}-${item.text}`} style={{ gridArea: "1 / 1" }}>
            <TextReveal
              {...reveal}
              align={align}
              text={item.text}
              delay={item.at}
              exitAt={exitAt}
            />
          </div>
        );
      })}
    </div>
  );
};
