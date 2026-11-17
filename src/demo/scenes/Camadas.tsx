import { AbsoluteFill } from "remotion";
import {
  Backdrop,
  Layer,
  MotionProvider,
  ObjectEnter,
  TextReveal,
  TextSwap,
  calmTheme,
  useLayout,
} from "../../motion";
import { GlassCard } from "../shapes";
import { cue } from "../timeline";
import { At } from "./common";

const p = calmTheme.palette;

/** Camadas (tema calmo): composição em três profundidades + troca de textos com saída em desfoque. */
export const Camadas = () => {
  const { pick } = useLayout();
  const back = cue("camadas", "back");
  return (
    <MotionProvider theme="calmo">
      <AbsoluteFill style={{ fontFamily: calmTheme.fonts.body }}>
        <Backdrop
          glows={[
            { x: 0.5, y: 0.62, size: 1300, color: p.glow, opacity: 0.85 },
            { x: 0.9, y: 0.12, size: 800, color: "#D9E9F0", opacity: 0.7 },
          ]}
          grain={0.1}
        />
        {/* profundidade 0.85: cartões distantes */}
        <Layer depth={0.85} drift={34} driftAngle={-80}>
          <At x={0.2} y={0.2}>
            <ObjectEnter
              motion="rise"
              from="bottom"
              distance={140}
              delay={back}
              rotate={-8}
            >
              <GlassCard
                width={420}
                height={260}
                accent={p.accent2}
                ink={p.ink}
                lines={2}
              />
            </ObjectEnter>
          </At>
          <At x={0.84} y={0.36}>
            <ObjectEnter
              motion="rise"
              from="bottom"
              distance={140}
              delay={back + 0.1}
              rotate={7}
            >
              <GlassCard
                width={380}
                height={240}
                accent={p.accent}
                ink={p.ink}
                lines={2}
              />
            </ObjectEnter>
          </At>
        </Layer>
        {/* profundidade 0.4: cartões intermediários */}
        <Layer depth={0.4} drift={26} driftAngle={-100}>
          <At x={0.16} y={0.8}>
            <ObjectEnter
              motion="rise"
              from="bottom"
              distance={200}
              delay={back + 0.15}
              rotate={6}
            >
              <GlassCard
                width={400}
                height={250}
                accent={p.accent}
                ink={p.ink}
                lines={2}
              />
            </ObjectEnter>
          </At>
        </Layer>
        {/* foco */}
        <Layer depth={0} drift={10}>
          <At y={pick({ vertical: 0.13, horizontal: 0.12, square: 0.1 })}>
            <TextReveal
              text="CAMADAS COM PROFUNDIDADE"
              by="char"
              stagger={0.012}
              font="body"
              weight={700}
              size={34}
              tracking="0.22em"
              color={p.muted}
              delay={cue("camadas", "caption")}
            />
          </At>
          <At y={pick({ vertical: 0.34, horizontal: 0.36, square: 0.34 })}>
            <TextSwap
              items={[
                { text: "Revele.", at: cue("camadas", "swap1") },
                { text: "Troque.", at: cue("camadas", "swap2") },
                { text: "Transforme.", at: cue("camadas", "swap3") },
              ]}
              by="char"
              size={pick({ vertical: 150, horizontal: 140, square: 120 })}
              highlightColor={p.accent}
            />
          </At>
          <At y={pick({ vertical: 0.62, horizontal: 0.7, square: 0.7 })}>
            <ObjectEnter
              motion="rise"
              from="bottom"
              distance={260}
              delay={cue("camadas", "card")}
            >
              <GlassCard
                width={pick({ vertical: 780, horizontal: 720, square: 620 })}
                height={pick({ vertical: 470, horizontal: 300, square: 330 })}
                accent={p.accent}
                ink={p.ink}
                label="Plano em foco"
                value="profundidade 0"
                lines={3}
              />
            </ObjectEnter>
          </At>
        </Layer>
      </AbsoluteFill>
    </MotionProvider>
  );
};
