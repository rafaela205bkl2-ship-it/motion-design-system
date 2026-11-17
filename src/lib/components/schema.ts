import { ENTRANCE_PRESETS } from "../animations";

/** Campos de animação compartilhados, editáveis no Remotion Studio. */
export const entranceSchema = (defaultPreset: string = "fade-up") =>
  ({
    delay: {
      type: "number",
      default: 0,
      min: 0,
      step: 0.05,
      description: "Atraso (s)",
      hiddenFromList: false,
      keyframable: false,
    },
    preset: {
      type: "enum",
      default: defaultPreset,
      description: "Animação de entrada",
      variants: Object.fromEntries(ENTRANCE_PRESETS.map((p) => [p, {}])),
    },
  }) as const;

export const sizeField = (
  defaultSize: number,
  description = "Tamanho (base 1080)",
) =>
  ({
    type: "number",
    default: defaultSize,
    min: 8,
    step: 1,
    description,
    hiddenFromList: false,
  }) as const;
