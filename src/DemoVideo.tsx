import {
  linearTiming,
  springTiming,
  TransitionSeries,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { useVideoConfig } from "remotion";
import { useLayout } from "./lib";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { IntroScene } from "./scenes/IntroScene";
import { OutroScene } from "./scenes/OutroScene";
import { StatsScene } from "./scenes/StatsScene";

/**
 * Vídeo de demonstração. O MESMO componente é registrado em 9:16, 16:9 e 1:1
 * no Root — nada aqui é específico de um formato.
 */
export const DemoVideo = () => {
  const { fps } = useVideoConfig();
  const { pick } = useLayout();
  // Direção do slide acompanha o formato: de baixo no vertical, da direita no horizontal.
  const slideDirection = pick({
    vertical: "from-bottom",
    horizontal: "from-right",
    square: "from-right",
  } as const);

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Abertura" durationInFrames={4 * fps}>
        <IntroScene
          kicker="Lançamento"
          title="Seu produto, *em movimento*"
          subtitle="Uma biblioteca de animações que se adapta a qualquer formato."
          style={{ backgroundColor: "#0B0B1A" }}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: slideDirection })}
        timing={springTiming({
          config: { damping: 200 },
          durationInFrames: 18,
        })}
      />
      <TransitionSeries.Sequence name="Recursos" durationInFrames={4.5 * fps}>
        <FeaturesScene
          heading="Feito para *criar rápido*"
          f1Icon="⚡"
          f1Title="Responsivo"
          f1Text="9:16, 16:9 e 1:1 com o mesmo código"
          f2Icon="🎬"
          f2Title="Animado"
          f2Text="Presets de entrada prontos para usar"
          f3Icon="🎨"
          f3Title="Editável"
          f3Text="Ajuste textos e cores no Studio"
          style={{ backgroundColor: "#0B0B1A" }}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: slideDirection })}
        timing={springTiming({
          config: { damping: 200 },
          durationInFrames: 18,
        })}
      />
      <TransitionSeries.Sequence name="Números" durationInFrames={4 * fps}>
        <StatsScene
          heading="Resultados que *aparecem*"
          s1Value={98}
          s1Suffix="%"
          s1Label="satisfação"
          s2Value={3}
          s2Suffix="x"
          s2Label="mais alcance"
          s3Value={24}
          s3Suffix="h"
          s3Label="para publicar"
          style={{ backgroundColor: "#0B0B1A" }}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence
        name="Encerramento"
        durationInFrames={3.5 * fps}
      >
        <OutroScene
          title="Comece *hoje*"
          cta="Saiba mais"
          handle="@seuperfil"
          style={{ backgroundColor: "#0B0B1A" }}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
