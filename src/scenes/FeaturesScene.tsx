import { Interactive } from "remotion";
import {
  FeatureCard,
  GlowBackground,
  Grid,
  SafeArea,
  Stack,
  Title,
  useLayout,
} from "../lib";

type Props = {
  readonly heading: string;
  readonly f1Icon: string;
  readonly f1Title: string;
  readonly f1Text: string;
  readonly f2Icon: string;
  readonly f2Title: string;
  readonly f2Text: string;
  readonly f3Icon: string;
  readonly f3Title: string;
  readonly f3Text: string;
};

/**
 * 9:16 → cartões empilhados.  16:9 → três colunas.  1:1 → empilhados e compactos.
 */
const FeaturesSceneInner = (p: Props) => {
  const { pick } = useLayout();
  const cardSize = pick({ vertical: 1, horizontal: 1, square: 0.72 });

  return (
    <>
      <GlowBackground />
      <SafeArea>
        <Stack
          direction={{ vertical: "column", horizontal: "column" }}
          gap={{ vertical: 80, horizontal: 80, square: 44 }}
        >
          <Title
            name="Título da seção"
            size={pick({ vertical: 96, horizontal: 96, square: 78 })}
          >
            {p.heading}
          </Title>
          <Grid
            columns={{ vertical: 1, horizontal: 3, square: 1 }}
            gap={pick({ vertical: 36, horizontal: 40, square: 24 })}
          >
            <FeatureCard
              name="Recurso 1"
              delay={0.4}
              size={cardSize}
              icon={p.f1Icon}
              title={p.f1Title}
              description={p.f1Text}
            />
            <FeatureCard
              name="Recurso 2"
              delay={0.6}
              size={cardSize}
              icon={p.f2Icon}
              title={p.f2Title}
              description={p.f2Text}
            />
            <FeatureCard
              name="Recurso 3"
              delay={0.8}
              size={cardSize}
              icon={p.f3Icon}
              title={p.f3Title}
              description={p.f3Text}
            />
          </Grid>
        </Stack>
      </SafeArea>
    </>
  );
};

export const FeaturesScene = Interactive.create({
  Component: FeaturesSceneInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
    heading: { type: "string", default: "Recursos", description: "Título" },
    f1Icon: { type: "string", default: "⚡", description: "Recurso 1 · ícone" },
    f1Title: {
      type: "string",
      default: "Rápido",
      description: "Recurso 1 · título",
    },
    f1Text: { type: "string", default: "", description: "Recurso 1 · texto" },
    f2Icon: { type: "string", default: "🎯", description: "Recurso 2 · ícone" },
    f2Title: {
      type: "string",
      default: "Preciso",
      description: "Recurso 2 · título",
    },
    f2Text: { type: "string", default: "", description: "Recurso 2 · texto" },
    f3Icon: { type: "string", default: "🔒", description: "Recurso 3 · ícone" },
    f3Title: {
      type: "string",
      default: "Seguro",
      description: "Recurso 3 · título",
    },
    f3Text: { type: "string", default: "", description: "Recurso 3 · texto" },
  },
});
