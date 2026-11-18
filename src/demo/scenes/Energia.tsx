import { AbsoluteFill } from "remotion";
import {
  Backdrop,
  ColorBloom,
  KineticType,
  Layer,
  MotionProvider,
  ObjectEnter,
  TextReveal,
  useLayout,
  vibrantTheme,
} from "../../motion";
import { Capsule, ContactShadow } from "../shapes";
import { cue } from "../timeline";
import { At } from "./common";

const p = vibrantTheme.palette;
export const ENERGIA_FOCUS: [number, number] = [0.5, 0.56];

/** Energia (tema vibrante): padrão tipográfico, título ATRÁS do objeto, queda com peso e ciclo de cores. */
export const Energia = () => {
  const { pick } = useLayout();
  const y = ENERGIA_FOCUS[1];
  return (
    <MotionProvider theme="vibrante">
      <AbsoluteFill>
        <Backdrop
          color={p.background}
          glows={[{ x: 0.5, y, size: 1100, color: p.glow, opacity: 0.55 }]}
          vignette={0.22}
          grain={0.14}
        >
          <ColorBloom
            origin={ENERGIA_FOCUS}
            steps={[
              { color: p.accent, at: cue("energia", "bloom1") },
              { color: p.spectrum[2], at: cue("energia", "bloom2") },
              { color: p.spectrum[4], at: cue("energia", "bloom3") },
            ]}
          />
        </Backdrop>
        <Layer depth={0.3} blur={6}>
          <KineticType
            text="RITMO •"
            delay={cue("energia", "pattern")}
            opacity={0.14}
            size={190}
            speed={110}
          />
        </Layer>
        {/* título atrás do objeto */}
        <Layer depth={0}>
          <At y={y - 0.085}>
            <TextReveal
              text="Energia"
              by="char"
              direction="center"
              delay={cue("energia", "title")}
              size={pick({ vertical: 250, horizontal: 230, square: 210 })}
              color={p.surface}
              from={{ y: 60, scale: 0.9, blur: 22 }}
              easing="enterStrong"
            />
          </At>
        </Layer>
        <Layer depth={0}>
          <At y={y + 0.1}>
            <ObjectEnter
              motion="fall"
              delay={cue("energia", "capsule") + 0.12}
              from="none"
              stretch={0}
              duration={0.4}
            >
              <ContactShadow width={520} opacity={0.32} />
            </ObjectEnter>
          </At>
          <At y={y}>
            <ObjectEnter
              motion="fall"
              from="top"
              distance={1300}
              delay={cue("energia", "capsule")}
              rotateFrom={-38}
              rotate={-12}
              float={12}
            >
              <Capsule
                width={pick({ vertical: 560, horizontal: 500, square: 440 })}
                color={p.accent2}
              />
            </ObjectEnter>
          </At>
          <At y={pick({ vertical: 0.78, horizontal: 0.86, square: 0.86 })}>
            <TextReveal
              text="em cada *quadro*."
              by="word"
              font="body"
              delay={cue("energia", "sub")}
              size={72}
              color={p.ink}
              highlightColor={p.highlight}
            />
          </At>
        </Layer>
      </AbsoluteFill>
    </MotionProvider>
  );
};
