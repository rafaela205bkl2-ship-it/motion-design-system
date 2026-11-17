import { Interactive } from "remotion";
import {
  CtaButton,
  GlowBackground,
  Paragraph,
  SafeArea,
  Stack,
  Title,
  useLayout,
} from "../lib";

type Props = {
  readonly title: string;
  readonly cta: string;
  readonly handle: string;
};

const OutroSceneInner = ({ title, cta, handle }: Props) => {
  const { pick } = useLayout();

  return (
    <>
      <GlowBackground />
      <SafeArea>
        <Stack
          direction={{ vertical: "column", horizontal: "column" }}
          gap={{ vertical: 70, horizontal: 60, square: 50 }}
        >
          <Title
            name="Título final"
            preset="blur"
            size={pick({ vertical: 124, horizontal: 124, square: 104 })}
          >
            {title}
          </Title>
          <CtaButton name="Botão" delay={0.8}>
            {cta}
          </CtaButton>
          <Paragraph name="Perfil" delay={1.2} size={40}>
            {handle}
          </Paragraph>
        </Stack>
      </SafeArea>
    </>
  );
};

export const OutroScene = Interactive.create({
  Component: OutroSceneInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
    title: {
      type: "string",
      default: "Título",
      description: "Título (*destaque*)",
    },
    cta: { type: "string", default: "Saiba mais", description: "Botão" },
    handle: {
      type: "string",
      default: "@perfil",
      description: "Perfil / site",
    },
  },
});
