import { Interactive } from "remotion";
import {
  Counter,
  GlowBackground,
  SafeArea,
  Stack,
  Title,
  useLayout,
} from "../lib";

type Props = {
  readonly heading: string;
  readonly s1Value: number;
  readonly s1Suffix: string;
  readonly s1Label: string;
  readonly s2Value: number;
  readonly s2Suffix: string;
  readonly s2Label: string;
  readonly s3Value: number;
  readonly s3Suffix: string;
  readonly s3Label: string;
};

/**
 * 9:16 → números empilhados.  16:9 e 1:1 → números lado a lado.
 */
const StatsSceneInner = (p: Props) => {
  const { pick } = useLayout();
  const size = pick({ vertical: 170, horizontal: 170, square: 120 });

  return (
    <>
      <GlowBackground />
      <SafeArea>
        <Stack
          direction={{ vertical: "column", horizontal: "column" }}
          gap={{ vertical: 110, horizontal: 110, square: 90 }}
        >
          <Title
            name="Título da seção"
            size={pick({ vertical: 96, horizontal: 96, square: 80 })}
          >
            {p.heading}
          </Title>
          <Stack
            direction={{ vertical: "column", horizontal: "row", square: "row" }}
            gap={{ vertical: 90, horizontal: 60, square: 30 }}
            justify={{
              vertical: "center",
              horizontal: "space-between",
              square: "space-between",
            }}
          >
            <Counter
              name="Número 1"
              delay={0.4}
              size={size}
              value={p.s1Value}
              suffix={p.s1Suffix}
              label={p.s1Label}
            />
            <Counter
              name="Número 2"
              delay={0.6}
              size={size}
              value={p.s2Value}
              suffix={p.s2Suffix}
              label={p.s2Label}
            />
            <Counter
              name="Número 3"
              delay={0.8}
              size={size}
              value={p.s3Value}
              suffix={p.s3Suffix}
              label={p.s3Label}
            />
          </Stack>
        </Stack>
      </SafeArea>
    </>
  );
};

export const StatsScene = Interactive.create({
  Component: StatsSceneInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
    heading: { type: "string", default: "Resultados", description: "Título" },
    s1Value: {
      type: "number",
      default: 98,
      description: "Número 1 · valor",
      hiddenFromList: false,
      keyframable: false,
    },
    s1Suffix: {
      type: "string",
      default: "%",
      description: "Número 1 · sufixo",
    },
    s1Label: { type: "string", default: "", description: "Número 1 · legenda" },
    s2Value: {
      type: "number",
      default: 3,
      description: "Número 2 · valor",
      hiddenFromList: false,
      keyframable: false,
    },
    s2Suffix: {
      type: "string",
      default: "x",
      description: "Número 2 · sufixo",
    },
    s2Label: { type: "string", default: "", description: "Número 2 · legenda" },
    s3Value: {
      type: "number",
      default: 24,
      description: "Número 3 · valor",
      hiddenFromList: false,
      keyframable: false,
    },
    s3Suffix: {
      type: "string",
      default: "h",
      description: "Número 3 · sufixo",
    },
    s3Label: { type: "string", default: "", description: "Número 3 · legenda" },
  },
});
