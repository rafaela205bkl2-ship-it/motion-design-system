import { Interactive } from "remotion";
import {
  GlowBackground,
  Orb,
  Paragraph,
  Pill,
  SafeArea,
  Stack,
  Title,
  useLayout,
} from "../lib";

type Props = {
  readonly kicker: string;
  readonly title: string;
  readonly subtitle: string;
};

/**
 * 9:16 → orbe em cima, texto centralizado embaixo.
 * 16:9 → texto à esquerda, orbe à direita.
 * 1:1  → orbe menor em cima, texto centralizado.
 */
const IntroSceneInner = ({ kicker, title, subtitle }: Props) => {
  const { pick, isHorizontal } = useLayout();

  return (
    <>
      <GlowBackground />
      <SafeArea>
        <Stack
          direction={{
            vertical: "column",
            horizontal: "row-reverse",
            square: "column",
          }}
          gap={{ vertical: 90, horizontal: 120, square: 50 }}
          justify={{ vertical: "center", horizontal: "space-between" }}
        >
          <Orb size={pick({ vertical: 480, horizontal: 600, square: 300 })} />
          <Stack
            direction={{ vertical: "column", horizontal: "column" }}
            gap={{ vertical: 44, horizontal: 40, square: 30 }}
            align={isHorizontal ? "flex-start" : "center"}
            textAlign={isHorizontal ? "left" : "center"}
            style={{ flex: isHorizontal ? 1 : undefined }}
          >
            <Pill name="Etiqueta" delay={0.2}>
              {kicker}
            </Pill>
            <Title
              name="Título"
              delay={0.35}
              size={pick({ vertical: 120, horizontal: 118, square: 100 })}
            >
              {title}
            </Title>
            <Paragraph
              name="Subtítulo"
              delay={0.9}
              maxWidth={pick({ vertical: 880, horizontal: 900, square: 820 })}
            >
              {subtitle}
            </Paragraph>
          </Stack>
        </Stack>
      </SafeArea>
    </>
  );
};

export const IntroScene = Interactive.create({
  Component: IntroSceneInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
    kicker: { type: "string", default: "Novidade", description: "Etiqueta" },
    title: {
      type: "string",
      default: "Título",
      description: "Título (*destaque*)",
    },
    subtitle: {
      type: "string",
      default: "Subtítulo",
      description: "Subtítulo",
    },
  },
});
