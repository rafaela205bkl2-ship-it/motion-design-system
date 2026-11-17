import { AbsoluteFill } from "remotion";
import {
  Backdrop,
  MotionProvider,
  TextReveal,
  baseTheme,
  useLayout,
  useProgress,
} from "../../motion";
import { OndulaMark } from "../shapes";
import { cue } from "../timeline";
import { At } from "./common";

const p = baseTheme.palette;
export const MARCA_FOCUS: [number, number] = [0.5, 0.4];

const Mark = () => {
  const { pick } = useLayout();
  const draw = useProgress({
    start: cue("marca", "mark"),
    duration: 0.7,
    easing: "camera",
  });
  const settle = useProgress({
    start: cue("marca", "mark"),
    duration: 0.9,
    easing: "enterStrong",
  });
  return (
    <div
      style={{
        scale: String(0.86 + 0.14 * settle),
        rotate: `${(1 - settle) * -10}deg`,
      }}
    >
      <OndulaMark
        size={pick({ vertical: 280, horizontal: 240, square: 220 })}
        color={p.accent}
        progress={draw}
      />
    </div>
  );
};

/** Marca (tema base): símbolo desenhado como traço + logotipo letra a letra + assinatura. */
export const Marca = () => {
  const { pick } = useLayout();
  return (
    <MotionProvider theme="base">
      <AbsoluteFill>
        <Backdrop
          glows={[
            {
              x: 0.5,
              y: MARCA_FOCUS[1],
              size: 1100,
              color: p.glow,
              opacity: 0.7,
            },
          ]}
        />
        <At y={MARCA_FOCUS[1]}>
          <Mark />
        </At>
        <At y={pick({ vertical: 0.58, horizontal: 0.72, square: 0.7 })}>
          <TextReveal
            text="ondula"
            by="char"
            delay={cue("marca", "word")}
            size={pick({ vertical: 190, horizontal: 160, square: 150 })}
            easing="enterStrong"
            from={{ y: 50, blur: 24, scale: 0.94 }}
          />
          <TextReveal
            text="ESTÚDIO DE MOVIMENTO"
            by="word"
            font="body"
            weight={700}
            delay={cue("marca", "tag")}
            size={32}
            tracking="0.3em"
            color={p.muted}
            style={{ marginTop: 26 }}
          />
        </At>
      </AbsoluteFill>
    </MotionProvider>
  );
};
