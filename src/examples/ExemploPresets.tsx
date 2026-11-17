import type React from "react";
import { AbsoluteFill } from "remotion";
import {
  ENTRANCE_PRESETS,
  Grid,
  SafeArea,
  theme,
  useEntrance,
  useLayout,
  type EntrancePreset,
} from "../lib";

const PresetTile: React.FC<{
  readonly preset: EntrancePreset;
  readonly delay: number;
}> = ({ preset, delay }) => {
  const { px } = useLayout();
  const entrance = useEntrance({ preset, delay });

  return (
    <div
      style={{
        ...entrance,
        padding: px(36),
        borderRadius: px(28),
        background: theme.surface,
        border: `${px(2)}px solid ${theme.border}`,
        fontFamily: theme.fontFamily,
        fontSize: px(44),
        fontWeight: 800,
        color: theme.text,
        textAlign: "center",
      }}
    >
      {preset}
    </div>
  );
};

/**
 * Catálogo visual de todos os presets de entrada (`useEntrance`).
 * Gerado a partir da lista ENTRANCE_PRESETS, então novos presets aparecem aqui sozinhos.
 */
export const ExemploPresets = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.background }}>
      <SafeArea>
        <Grid columns={{ vertical: 2, horizontal: 4, square: 2 }} gap={32}>
          {ENTRANCE_PRESETS.map((preset, i) => (
            <PresetTile key={preset} preset={preset} delay={0.3 + i * 0.25} />
          ))}
        </Grid>
      </SafeArea>
    </AbsoluteFill>
  );
};
