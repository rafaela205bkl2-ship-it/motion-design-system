import { Composition, Folder } from "remotion";
import { DemoVideo } from "./DemoVideo";
import { DemoReel } from "./demo/DemoReel";
import { totalFrames } from "./demo/timeline";
import { Producoes } from "./producoes/registry";
import { ExemploBasico } from "./examples/ExemploBasico";
import { ExemploPresets } from "./examples/ExemploPresets";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { IntroScene } from "./scenes/IntroScene";
import { OutroScene } from "./scenes/OutroScene";
import { StatsScene } from "./scenes/StatsScene";

// Duração total: 4 + 4,5 + 4 + 3,5 s = 480 quadros, menos as transições (18 + 18 + 15) = 429.

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Producoes />
      <Folder name="Biblioteca-Motion">
        {/* Demonstração principal — 9:16 */}
        <Composition
          id="Demo-9x16"
          component={DemoReel}
          durationInFrames={totalFrames}
          fps={30}
          width={1080}
          height={1920}
        />
        {/* Prévias: a arquitetura é responsiva, o acabamento foi feito para 9:16 */}
        <Composition
          id="Demo-16x9-previa"
          component={DemoReel}
          durationInFrames={totalFrames}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Demo-1x1-previa"
          component={DemoReel}
          durationInFrames={totalFrames}
          fps={30}
          width={1080}
          height={1080}
        />
      </Folder>
      <Folder name="Video">
        {/* Formato principal */}
        <Composition
          id="Vertical-9x16"
          component={DemoVideo}
          durationInFrames={429}
          fps={30}
          width={1080}
          height={1920}
        />
        {/* Mesmo vídeo, sem nenhuma mudança de código */}
        <Composition
          id="Horizontal-16x9"
          component={DemoVideo}
          durationInFrames={429}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Quadrado-1x1"
          component={DemoVideo}
          durationInFrames={429}
          fps={30}
          width={1080}
          height={1080}
        />
      </Folder>
      <Folder name="Cenas">
        <Composition
          id="Abertura"
          component={IntroScene}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            kicker: "Lançamento",
            title: "Seu produto, *em movimento*",
            subtitle:
              "Uma biblioteca de animações que se adapta a qualquer formato.",
            style: { backgroundColor: "#0B0B1A" },
          }}
        />
        <Composition
          id="Recursos"
          component={FeaturesScene}
          durationInFrames={135}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            heading: "Feito para *criar rápido*",
            f1Icon: "⚡",
            f1Title: "Responsivo",
            f1Text: "9:16, 16:9 e 1:1 com o mesmo código",
            f2Icon: "🎬",
            f2Title: "Animado",
            f2Text: "Presets de entrada prontos para usar",
            f3Icon: "🎨",
            f3Title: "Editável",
            f3Text: "Ajuste textos e cores no Studio",
            style: { backgroundColor: "#0B0B1A" },
          }}
        />
        <Composition
          id="Numeros"
          component={StatsScene}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            heading: "Resultados que *aparecem*",
            s1Value: 98,
            s1Suffix: "%",
            s1Label: "satisfação",
            s2Value: 3,
            s2Suffix: "x",
            s2Label: "mais alcance",
            s3Value: 24,
            s3Suffix: "h",
            s3Label: "para publicar",
            style: { backgroundColor: "#0B0B1A" },
          }}
        />
        <Composition
          id="Encerramento"
          component={OutroScene}
          durationInFrames={105}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            title: "Comece *hoje*",
            cta: "Saiba mais",
            handle: "@seuperfil",
            style: { backgroundColor: "#0B0B1A" },
          }}
        />
      </Folder>
      <Folder name="Exemplos">
        <Composition
          id="Basico-9x16"
          component={ExemploBasico}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Basico-16x9"
          component={ExemploBasico}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Basico-1x1"
          component={ExemploBasico}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1080}
        />
        {/* 4:5 não tem configuração própria: proporção 0,8 é tratada como vertical */}
        <Composition
          id="Basico-4x5"
          component={ExemploBasico}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1350}
        />
        <Composition
          id="Presets-9x16"
          component={ExemploPresets}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Presets-16x9"
          component={ExemploPresets}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
