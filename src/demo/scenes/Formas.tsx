import { AbsoluteFill } from "remotion";
import {
  Backdrop,
  Layer,
  MotionProvider,
  ObjectEnter,
  TextReveal,
  useLayout,
  vibrantTheme,
} from "../../motion";
import { Capsule, Orb, Ring } from "../shapes";
import { cue } from "../timeline";
import { At } from "./common";

const p = vibrantTheme.palette;
const COBALT = p.accent2;

/** Formas (tema vibrante): três entradas diferentes — deslize, pop e queda — com flutuação em repouso. */
export const Formas = () => {
  const { pick } = useLayout();
  return (
    <MotionProvider theme="vibrante">
      <AbsoluteFill>
        <Backdrop
          color={COBALT}
          glows={[
            { x: 0.3, y: 0.3, size: 1000, color: "#5A6BFF", opacity: 0.7 },
            { x: 0.8, y: 0.75, size: 900, color: "#F45BA6", opacity: 0.35 },
          ]}
          vignette={0.25}
          grain={0.14}
        />
        <Layer depth={0}>
          <At
            x={pick({ vertical: 0.3, horizontal: 0.25, square: 0.26 })}
            y={pick({ vertical: 0.24, horizontal: 0.34, square: 0.3 })}
          >
            <ObjectEnter
              motion="glide"
              from="left"
              distance={900}
              delay={cue("formas", "orb")}
              float={16}
              floatPeriod={3.6}
            >
              <Orb
                size={pick({ vertical: 300, horizontal: 260, square: 230 })}
                color={p.accent}
              />
            </ObjectEnter>
          </At>
          <At
            x={pick({ vertical: 0.68, horizontal: 0.52, square: 0.66 })}
            y={pick({ vertical: 0.42, horizontal: 0.42, square: 0.42 })}
          >
            <ObjectEnter
              motion="pop"
              delay={cue("formas", "ring")}
              rotateFrom={-40}
              rotate={0}
              float={12}
              floatPeriod={2.9}
            >
              <Ring
                size={pick({ vertical: 330, horizontal: 300, square: 260 })}
                color={p.spectrum[4]}
              />
            </ObjectEnter>
          </At>
          <At
            x={pick({ vertical: 0.42, horizontal: 0.76, square: 0.4 })}
            y={pick({ vertical: 0.58, horizontal: 0.36, square: 0.6 })}
          >
            <ObjectEnter
              motion="fall"
              from="top"
              distance={1200}
              delay={cue("formas", "capsule")}
              rotateFrom={60}
              rotate={24}
              float={10}
              floatPeriod={3.3}
            >
              <Capsule
                width={pick({ vertical: 440, horizontal: 400, square: 360 })}
                color={p.background}
              />
            </ObjectEnter>
          </At>
          <At y={pick({ vertical: 0.79, horizontal: 0.8, square: 0.86 })}>
            <TextReveal
              text={"Formas que *entram*\ncom peso."}
              by="word"
              delay={cue("formas", "text")}
              size={pick({ vertical: 104, horizontal: 96, square: 84 })}
              color={p.surface}
              highlightColor={p.accent}
              lineHeight={1.02}
            />
          </At>
        </Layer>
      </AbsoluteFill>
    </MotionProvider>
  );
};
