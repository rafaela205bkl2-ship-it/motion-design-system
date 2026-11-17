import { AbsoluteFill } from "remotion";
import {
  Backdrop,
  MotionProvider,
  TextReveal,
  baseTheme,
  useLayout,
} from "../../motion";
import { OndulaMark } from "../shapes";
import { cue } from "../timeline";
import { At } from "./common";

const p = baseTheme.palette;

/** Créditos (tema base sobre a cor de destaque): encerramento parado, como nas referências. */
export const Creditos = () => {
  const { pick } = useLayout();
  return (
    <MotionProvider theme="base">
      <AbsoluteFill>
        <Backdrop
          color={p.accent}
          glows={[
            { x: 0.5, y: 0.45, size: 1200, color: "#6F86FF", opacity: 0.8 },
            { x: 0.85, y: 0.95, size: 900, color: "#8C6BFF", opacity: 0.3 },
          ]}
          vignette={0.2}
          grain={0.12}
        />
        <At y={0.43}>
          <TextReveal
            text="FEITO COM"
            by="char"
            stagger={0.02}
            font="body"
            weight={700}
            size={30}
            tracking="0.3em"
            color="rgba(255,255,255,0.72)"
            delay={cue("creditos", "label")}
          />
          <TextReveal
            text={"motion design\nlibrary"}
            by="char"
            stagger={0.022}
            delay={cue("creditos", "lib")}
            size={pick({ vertical: 132, horizontal: 120, square: 112 })}
            color="#FFFFFF"
            lineHeight={1}
            easing="enterStrong"
            style={{ marginTop: 30 }}
          />
          <TextReveal
            text="tokens · texto · transições · objetos · camadas · temas"
            by="word"
            font="body"
            delay={cue("creditos", "chips")}
            stagger={0.06}
            size={36}
            color="rgba(255,255,255,0.8)"
            maxWidth={940}
            lineHeight={1.45}
            style={{ marginTop: 48 }}
          />
        </At>
        <At y={0.86}>
          <div style={{ opacity: 0.85 }}>
            <OndulaMark size={86} color="#FFFFFF" progress={1} />
          </div>
        </At>
      </AbsoluteFill>
    </MotionProvider>
  );
};
