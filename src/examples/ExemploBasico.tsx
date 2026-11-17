import { AbsoluteFill } from "remotion";
import {
  GlowBackground,
  Paragraph,
  Pill,
  SafeArea,
  Stack,
  Title,
  theme,
} from "../lib";

/**
 * Exemplo mínimo: uma tela com etiqueta, título e texto.
 * Registrado em 9:16, 16:9, 1:1 e 4:5 no Root para mostrar que o
 * mesmo componente se adapta sem nenhuma condição de formato.
 */
export const ExemploBasico = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.background }}>
      <GlowBackground />
      <SafeArea>
        <Stack
          direction={{ vertical: "column", horizontal: "column" }}
          gap={40}
        >
          <Pill name="Etiqueta">Exemplo</Pill>
          <Title name="Título" delay={0.2}>
            Uma tela, *quatro formatos*
          </Title>
          <Paragraph name="Texto" delay={0.8}>
            Tamanhos em pixels de design e layout por formato.
          </Paragraph>
        </Stack>
      </SafeArea>
    </AbsoluteFill>
  );
};
