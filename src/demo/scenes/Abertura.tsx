import { AbsoluteFill } from "remotion";
import {
  Backdrop,
  Layer,
  MotionProvider,
  ObjectEnter,
  TextReveal,
  baseTheme,
  useLayout,
} from "../../motion";
import { ContactShadow, Orb } from "../shapes";
import { cue } from "../timeline";
import { At } from "./common";

const p = baseTheme.palette;

/** Abertura (tema base): esfera em "pop", título letra a letra, subtítulo palavra a palavra. */
export const Abertura = () => {
  const { pick } = useLayout();
  return (
    <MotionProvider theme="base">
      <AbsoluteFill>
        <Backdrop
          glows={[
            { x: 0.5, y: 0.46, size: 1250, color: p.glow, opacity: 0.75 },
            { x: 0.12, y: 0.1, size: 700, color: "#FFD6C9", opacity: 0.5 },
          ]}
        />
        {/* fundo distante: esferas pequenas desfocadas */}
        <Layer depth={0.75} drift={26}>
          <At x={0.16} y={0.22}>
            <Orb size={150} color={p.accent2} />
          </At>
          <At x={0.86} y={0.8}>
            <Orb size={230} color={p.accent} />
          </At>
          <At x={0.12} y={0.9}>
            <Orb size={110} color={p.ink} />
          </At>
        </Layer>
        <Layer depth={0}>
          <At y={pick({ vertical: 0.38, horizontal: 0.36, square: 0.36 })}>
            <ObjectEnter motion="pop" delay={cue("abertura", "orb")} float={14}>
              <Orb
                size={pick({ vertical: 380, horizontal: 300, square: 260 })}
                color={p.accent}
              />
            </ObjectEnter>
            <ObjectEnter
              motion="pop"
              delay={cue("abertura", "orb") + 0.05}
              stretch={0}
              style={{ marginTop: 18 }}
            >
              <ContactShadow width={300} opacity={0.22} />
            </ObjectEnter>
          </At>
          <At y={pick({ vertical: 0.62, horizontal: 0.72, square: 0.72 })}>
            <TextReveal
              text="Movimento"
              by="char"
              delay={cue("abertura", "title")}
              size={pick({ vertical: 168, horizontal: 150, square: 140 })}
              easing="enterStrong"
            />
            <TextReveal
              text="com *intenção*."
              by="word"
              font="body"
              delay={cue("abertura", "sub")}
              size={66}
              color={p.muted}
              highlightColor={p.accent}
              style={{ marginTop: 24 }}
            />
          </At>
        </Layer>
      </AbsoluteFill>
    </MotionProvider>
  );
};
