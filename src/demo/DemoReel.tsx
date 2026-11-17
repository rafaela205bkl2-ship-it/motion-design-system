import { Audio } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import React from "react";
import { staticFile } from "remotion";
import { blurDissolve, motionTiming, radialReveal } from "../motion";
import { Abertura } from "./scenes/Abertura";
import { Camadas } from "./scenes/Camadas";
import { Creditos } from "./scenes/Creditos";
import { ENERGIA_FOCUS, Energia } from "./scenes/Energia";
import { Formas } from "./scenes/Formas";
import { MARCA_FOCUS, Marca } from "./scenes/Marca";
import { sceneFrames, timeline, tokenFrames } from "./timeline";

const fps = timeline.fps;
const t = (token: string, easing: "wipe" | "wipeSmooth" | "enter") =>
  motionTiming({ fps, duration: tokenFrames(token) / fps, easing });

/**
 * Demonstração da biblioteca. Tempos de cena e transições vêm de
 * timeline.json — a mesma fonte que gera a trilha sonora.
 */
export const DemoReel: React.FC = () => {
  const out = (i: number) => timeline.scenes[i].out!.token;
  return (
    <>
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="Abertura"
          durationInFrames={sceneFrames("abertura")}
        >
          <Abertura />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={blurDissolve({ blur: 30, scale: 0.05 })}
          timing={t(out(0), "wipeSmooth")}
        />

        <TransitionSeries.Sequence
          name="Camadas"
          durationInFrames={sceneFrames("camadas")}
        >
          <Camadas />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={radialReveal({
            origin: [0.5, 0.62],
            ringColor: "#FFC531",
            ringWidth: 34,
            softness: 4,
          })}
          timing={t(out(1), "wipe")}
        />

        <TransitionSeries.Sequence
          name="Energia"
          durationInFrames={sceneFrames("energia")}
        >
          <Energia />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={radialReveal({
            origin: ENERGIA_FOCUS,
            ringColor: "#FFF3E4",
            ringWidth: 30,
            softness: 4,
          })}
          timing={t(out(2), "wipe")}
        />

        <TransitionSeries.Sequence
          name="Formas"
          durationInFrames={sceneFrames("formas")}
        >
          <Formas />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={blurDissolve({
            blur: 34,
            through: "#FFFFFF",
            throughStrength: 0.95,
          })}
          timing={t(out(3), "wipeSmooth")}
        />

        <TransitionSeries.Sequence
          name="Marca"
          durationInFrames={sceneFrames("marca")}
        >
          <Marca />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={radialReveal({
            origin: MARCA_FOCUS,
            ringColor: "#FF6A47",
            ringWidth: 28,
            softness: 5,
            zoom: 0.08,
          })}
          timing={t(out(4), "wipeSmooth")}
        />

        <TransitionSeries.Sequence
          name="Créditos"
          durationInFrames={sceneFrames("creditos")}
        >
          <Creditos />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Audio name="Trilha" src={staticFile("audio/trilha-demo.mp3")} />
    </>
  );
};
