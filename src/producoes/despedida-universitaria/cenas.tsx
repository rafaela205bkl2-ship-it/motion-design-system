/**
 * Cenas da despedida universitária ("Dias Melhores").
 *
 * Todos os tempos vêm de producoes/despedida-universitaria/musica/analise.json
 * (palavras alinhadas no áudio real). Única exceção, marcada: "melhores em tudo"
 * (não reconhecida) em 45,12 s, inferida pelo espaçamento regular das frases anteriores.
 * Batida: 0,58 s; o recorte começa numa batida, então batidas = múltiplos de 0,58 s.
 */
import React from "react";
import {
  AbsoluteFill,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Backdrop,
  ColorBloom,
  KenBurns,
  KineticType,
  MotionProvider,
  ObjectEnter,
  PhotoFrame,
  TextReveal,
  TextSwap,
  createTheme,
  progressAt,
  vibrantTheme,
} from "../../motion";
import inventario from "../../../producoes/despedida-universitaria/fotos/inventario.json";
import type { CenaProps } from "../_runtime/ProducaoGenerica";

const SLUG = "despedida-universitaria";
/** Início de cada cena no tempo do vídeo (limites do roteiro). */
const INICIO = [0, 12.7, 29.0, 55.9, 68.0];
const BATIDA = 0.58;

type Meta = { codigo: string; exibicao?: { largura: number; altura: number } };
const meta = Object.fromEntries(
  (inventario.imagens as Meta[]).map((d) => [d.codigo, d]),
);
const foto = (c: string) =>
  staticFile(`producoes/${SLUG}/imagens/fotos/${c}.jpg`);
const ratio = (c: string) => {
  const e = meta[c]?.exibicao;
  return e ? e.largura / e.altura : 0.75;
};
/** Tempo da música (s) → tempo local da cena. */
const L = (cena: number, abs: number) => abs - INICIO[cena];
/** Próxima batida a partir de um tempo absoluto, convertida para o tempo local. */
const batida = (cena: number, n: number) => n * BATIDA - INICIO[cena];

/** Tema da peça: papel quente, tinta escura, laranja de destaque (referências de colagem). */
export const temaDespedida = createTheme("base", {
  palette: {
    background: "#ECE4D6",
    surface: "#FBF7F0",
    ink: "#1C1915",
    muted: "#6E6459",
    accent: "#E2552B",
    accent2: "#2F4B7C",
    glow: "#F4D7B5",
    spectrum: ["#E2552B", "#2F4B7C", "#F2B33D", "#1C1915"],
  },
  fonts: { display: vibrantTheme.fonts.display },
  displayTracking: "-0.035em",
  motion: { speed: 0.95, overshoot: 0.04 },
});
const P = temaDespedida.palette;

/** Posiciona o filho centralizado num ponto (fração da tela), com a largura toda disponível. */
const Pos: React.FC<{
  x?: number;
  y: number;
  z?: number;
  children: React.ReactNode;
}> = ({ x = 0.5, y, z, children }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      width: "100%",
      top: `${y * 100}%`,
      translate: `${(x - 0.5) * 100}% -50%`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      zIndex: z,
    }}
  >
    {children}
  </div>
);

/** Mostra o filho só dentro de [de, ate) — economiza render das fotos fora de cena. */
const Janela: React.FC<{
  de: number;
  ate: number;
  children: React.ReactNode;
}> = ({ de, ate, children }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return t >= de && t < ate ? <>{children}</> : null;
};

/** Opacidade animada entre dois tempos. */
const Fade: React.FC<{
  de: number;
  dur: number;
  inverso?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ de, dur, inverso, children, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = progressAt(f, fps, de, dur, "camera");
  return (
    <AbsoluteFill style={{ opacity: inverso ? 1 - p : p, ...style }}>
      {children}
    </AbsoluteFill>
  );
};

const Papel: React.FC<{ glowY?: number }> = ({ glowY = 0.45 }) => (
  <Backdrop
    color={P.background}
    glows={[
      { x: 0.5, y: glowY, size: 1400, color: P.glow, opacity: 0.8 },
      { x: 0.1, y: 0.95, size: 800, color: "#D9C7AE", opacity: 0.5 },
    ]}
    vignette={0.16}
    grain={0.16}
  />
);

const sombraTexto = "0 6px 30px rgba(0,0,0,0.45)";

/* ------------------------------------------------------------------ */
/* CENA 1 — "Vivemos esperando / Dias melhores" (0 – 12,7 s)           */
/* ------------------------------------------------------------------ */
export const Cena1: React.FC<CenaProps> = () => (
  <MotionProvider theme={temaDespedida}>
    <AbsoluteFill style={{ background: "#0c0a08" }}>
      <KenBurns
        src={foto("F003")}
        from={{ scale: 1.0 }}
        to={{ scale: 1.16, y: -2 }}
        duration={8}
        blurFrom={24}
        focusDuration={2.6}
      />
      <Fade de={5.4} dur={1.6}>
        <KenBurns
          src={foto("F031")}
          start={5.4}
          from={{ scale: 1.16, x: 4 }}
          to={{ scale: 1.02, x: -4 }}
          duration={7.6}
          focus="50% 45%"
        />
      </Fade>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(12,10,8,.35) 0%, rgba(12,10,8,.05) 40%, rgba(12,10,8,.82) 100%)",
        }}
      />
      {/* abertura do preto */}
      <Fade de={0} dur={2} inverso style={{ background: "#0c0a08" }}>
        {null}
      </Fade>
      <Pos y={0.74}>
        {/* "dias" 6,00 s · "melhores" 6,66 s */}
        <TextReveal
          text="Dias *melhores*"
          by="word"
          delay={6.0}
          stagger={0.66}
          duration={0.6}
          easing="enterStrong"
          from={{ y: 50, blur: 30, scale: 0.94 }}
          size={186}
          color="#FBF7F0"
          highlightColor="#F2B33D"
          lineHeight={0.95}
          style={{ textShadow: sombraTexto }}
        />
      </Pos>
    </AbsoluteFill>
  </MotionProvider>
);

/* ------------------------------------------------------------------ */
/* CENA 2 — "Dias de paz, dias a mais / … não deixaremos para trás"    */
/* ------------------------------------------------------------------ */
const MOLDURAS_2 = [
  { c: "F001", x: 0.28, y: 0.42, w: 360, r: -6 },
  { c: "F012", x: 0.72, y: 0.4, w: 360, r: 5 },
  { c: "F011", x: 0.3, y: 0.67, w: 350, r: 4 },
  { c: "F007", x: 0.7, y: 0.64, w: 470, r: -4 },
  { c: "F034", x: 0.5, y: 0.85, w: 500, r: 2 },
];
const DESTAQUE_2 = [
  { c: "F040", x: 0.31, y: 0.47, w: 470, r: -4, t: L(1, 18.66) },
  { c: "F047", x: 0.69, y: 0.52, w: 470, r: 4, t: batida(1, 34) },
  { c: "F015", x: 0.5, y: 0.71, w: 520, r: -1.5, t: L(1, 21.42) },
];

export const Cena2: React.FC<CenaProps> = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recua = progressAt(f, fps, L(1, 18.66) - 0.4, 0.8, "camera");
  return (
    <MotionProvider theme={temaDespedida}>
      <AbsoluteFill>
        <Papel />
        {/* molduras entram uma a cada 2 batidas a partir de 13,34 s */}
        <AbsoluteFill
          style={{
            filter: `blur(${recua * 10}px)`,
            opacity: 1 - recua * 0.55,
            scale: String(1 - recua * 0.05),
          }}
        >
          {MOLDURAS_2.map((m, i) => (
            <Pos key={m.c} x={m.x} y={m.y}>
              <ObjectEnter
                motion="pop"
                delay={batida(1, 23 + i * 2)}
                rotateFrom={m.r * 3}
                rotate={m.r}
                float={6}
              >
                <PhotoFrame
                  src={foto(m.c)}
                  width={m.w}
                  ratio={ratio(m.c)}
                  start={batida(1, 23 + i * 2)}
                />
              </ObjectEnter>
            </Pos>
          ))}
        </AbsoluteFill>
        {/* "não deixaremos para trás": fotos de maior valor afetivo, em destaque */}
        {DESTAQUE_2.map((m) => (
          <Pos key={m.c} x={m.x} y={m.y}>
            <ObjectEnter
              motion="fall"
              from="top"
              distance={900}
              delay={m.t}
              rotateFrom={m.r * 4}
              rotate={m.r}
              float={5}
            >
              <PhotoFrame
                src={foto(m.c)}
                width={m.w}
                ratio={ratio(m.c)}
                shadow={0.45}
                start={m.t}
              />
            </ObjectEnter>
          </Pos>
        ))}
        <Pos y={0.135} z={5}>
          <TextSwap
            items={[
              { text: "Dias de *paz*,", at: L(1, 13.26) },
              { text: "dias *a mais*", at: L(1, 15.21) },
            ]}
            lastExitAt={L(1, 18.66) - 0.35}
            by="word"
            size={128}
            color={P.ink}
          />
        </Pos>
        <Pos y={0.12} z={5}>
          <TextReveal
            text="Dias que não deixaremos"
            by="word"
            delay={L(1, 18.66)}
            stagger={0.29}
            size={84}
            color={P.ink}
          />
          <TextReveal
            text="*para trás*"
            by="word"
            delay={L(1, 21.42)}
            stagger={0.3}
            size={150}
            color={P.ink}
            easing="enterStrong"
            from={{ y: 40, blur: 24, scale: 0.92 }}
            style={{ marginTop: 6 }}
          />
        </Pos>
      </AbsoluteFill>
    </MotionProvider>
  );
};

/* ------------------------------------------------------------------ */
/* CENA 3 — "O dia em que seremos melhores / no amor / na dor / em tudo" */
/* ------------------------------------------------------------------ */
const COMPASSO = BATIDA * 4;
const SEQ_3 = ["F020", "F042", "F039", "F069", "F049", "F052", "F066"]; // individual / coletiva alternadas
const EM_TUDO = 45.12; // inferido (ver cabeçalho)

const Corte: React.FC<{ c: string; de: number; ate: number; i: number }> = ({
  c,
  de,
  ate,
  i,
}) => (
  <Janela de={de} ate={ate}>
    <KenBurns
      src={foto(c)}
      start={de}
      from={{ scale: 1.14, x: i % 2 ? 3 : -3, y: 0 }}
      to={{ scale: 1.02, x: 0, y: -1 }}
      duration={ate - de + 0.4}
      easing="enter"
    />
  </Janela>
);

export const Cena3: React.FC<CenaProps> = () => {
  const tudo = L(2, EM_TUDO);
  return (
    <MotionProvider theme={temaDespedida}>
      <AbsoluteFill style={{ background: "#0c0a08" }}>
        {/* cortes por compasso (2,32 s) */}
        {SEQ_3.map((c, i) => (
          <Corte
            key={c}
            c={c}
            i={i}
            de={i * COMPASSO}
            ate={Math.min((i + 1) * COMPASSO, tudo)}
          />
        ))}
        <Janela de={0} ate={tudo}>
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(180deg, rgba(12,10,8,0) 45%, rgba(12,10,8,.8) 100%)",
            }}
          />
        </Janela>
        <Pos y={0.78} z={5}>
          <TextSwap
            items={[
              { text: "Vivemos esperando", at: L(2, 31.29) },
              { text: "o dia em que seremos", at: L(2, 33.6) },
              { text: "*melhores*", at: L(2, 35.52) },
              { text: "Melhores *no amor*", at: L(2, 40.32) },
              { text: "Melhores *na dor*", at: L(2, 42.72) },
            ]}
            lastExitAt={tudo - 0.25}
            by="word"
            size={118}
            color="#FBF7F0"
            highlightColor="#F2B33D"
            style={{ textShadow: sombraTexto }}
          />
        </Pos>
        {/* "Melhores em tudo": momento de impacto — colagem + lettering dominante */}
        <Janela de={tudo - 0.2} ate={tudo + 4.64}>
          <AbsoluteFill>
            <Papel glowY={0.5} />
            {[
              { c: "F067", x: 0.26, y: 0.26, w: 380, r: -7 },
              { c: "F036", x: 0.72, y: 0.24, w: 460, r: 5 },
              { c: "F042", x: 0.3, y: 0.76, w: 460, r: 4 },
              { c: "F069", x: 0.73, y: 0.78, w: 440, r: -5 },
            ].map((m, k) => (
              <Pos key={m.c} x={m.x} y={m.y}>
                <ObjectEnter
                  motion="pop"
                  delay={tudo + k * BATIDA * 0.5}
                  rotateFrom={m.r * 3}
                  rotate={m.r}
                  float={8}
                >
                  <PhotoFrame
                    src={foto(m.c)}
                    width={m.w}
                    ratio={ratio(m.c)}
                    start={tudo}
                  />
                </ObjectEnter>
              </Pos>
            ))}
            <Pos y={0.5} z={5}>
              <TextReveal
                text={"MELHORES\n*EM TUDO*"}
                by="char"
                direction="center"
                delay={tudo}
                stagger={0.025}
                size={168}
                color={P.ink}
                highlightColor={P.accent}
                lineHeight={0.9}
                easing="enterStrong"
                from={{ y: 70, blur: 30, scale: 0.86 }}
                style={{ textShadow: "0 8px 40px rgba(251,247,240,0.9)" }}
              />
            </Pos>
          </AbsoluteFill>
        </Janela>
        {/* crescimento (energia sobe a partir de 55,9 s): duas fotos coletivas em tela cheia */}
        <Corte c="F067" i={1} de={tudo + 4.64} ate={tudo + 4.64 + COMPASSO} />
        <Corte c="F036" i={2} de={tudo + 4.64 + COMPASSO} ate={30} />
      </AbsoluteFill>
    </MotionProvider>
  );
};

/* ------------------------------------------------------------------ */
/* CENA 4 — "O dia em que seremos / Para sempre" (55,9 – 68,0 s)        */
/* ------------------------------------------------------------------ */
export const Cena4: React.FC<CenaProps> = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pausa = progressAt(f, fps, L(3, 65.7) - 1.2, 1.0, "camera");
  return (
    <MotionProvider theme={temaDespedida}>
      <AbsoluteFill>
        <Papel glowY={0.4} />
        <AbsoluteFill
          style={{
            filter: `saturate(${1 - pausa * 0.35})`,
            scale: String(1 + pausa * 0.03),
          }}
        >
          <Pos y={0.36}>
            <ObjectEnter
              motion="rise"
              from="bottom"
              distance={240}
              delay={0.3}
              duration={1.2}
            >
              <PhotoFrame
                src={foto("F009")}
                width={880}
                ratio={ratio("F009")}
                rotate={-1.5}
                border={18}
                shadow={0.4}
                start={0.3}
              />
            </ObjectEnter>
          </Pos>
          {[
            { c: "F054", x: 0.29, y: 0.64, w: 450, r: -5, n: 99 },
            { c: "F021", x: 0.72, y: 0.66, w: 450, r: 4, n: 101 },
            { c: "F055", x: 0.83, y: 0.17, w: 260, r: 7, n: 103 },
          ].map((m) => (
            <Pos key={m.c} x={m.x} y={m.y}>
              <ObjectEnter
                motion="pop"
                delay={batida(3, m.n)}
                rotateFrom={m.r * 3}
                rotate={m.r}
                float={6}
                floatPeriod={4}
              >
                <PhotoFrame
                  src={foto(m.c)}
                  width={m.w}
                  ratio={ratio(m.c)}
                  start={batida(3, m.n)}
                />
              </ObjectEnter>
            </Pos>
          ))}
        </AbsoluteFill>
        {/* "para" 65,70 s · "sempre" 66,09 s */}
        <Pos y={0.84} z={5}>
          <TextReveal
            text="Para *sempre*"
            by="char"
            delay={L(3, 65.7)}
            stagger={0.05}
            duration={0.8}
            size={176}
            color={P.ink}
            highlightColor={P.accent}
            easing="enterSoft"
            from={{ y: 30, blur: 22 }}
          />
        </Pos>
      </AbsoluteFill>
    </MotionProvider>
  );
};

/* ------------------------------------------------------------------ */
/* CENA 5 — "Dias melhores pra sempre" + retorno (68,0 – 99,76 s)       */
/* ------------------------------------------------------------------ */
const CASCATA = [
  { c: "F027", x: 0.3, y: 0.3, w: 430, r: -6 },
  { c: "F023", x: 0.74, y: 0.26, w: 330, r: 5 },
  { c: "F001", x: 0.72, y: 0.52, w: 300, r: -4 },
  { c: "F041", x: 0.26, y: 0.56, w: 330, r: 6 },
  { c: "F058", x: 0.52, y: 0.42, w: 330, r: -2 },
  { c: "F040", x: 0.3, y: 0.8, w: 300, r: 4 },
  { c: "F014", x: 0.75, y: 0.79, w: 330, r: -5 },
  { c: "F008", x: 0.52, y: 0.66, w: 330, r: 3 },
  { c: "F012", x: 0.5, y: 0.18, w: 280, r: -3 },
];
const PAREDE = [
  "F040",
  "F047",
  "F015",
  "F055",
  "F020",
  "F052",
  "F011",
  "F049",
  "F034",
  "F066",
];

/** Faixa de molduras que desliza continuamente (parede de memórias). */
const Faixa: React.FC<{
  fotos: string[];
  y: number;
  dir: 1 | -1;
  de: number;
  altura: number;
}> = ({ fotos, y, dir, de, altura }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps - de;
  return (
    <div
      style={{
        position: "absolute",
        top: `${y * 100}%`,
        left: "50%",
        display: "flex",
        gap: 34,
        translate: `calc(-50% + ${dir * (160 - t * 70)}px) -50%`,
      }}
    >
      {fotos.map((c, i) => (
        <PhotoFrame
          key={c + i}
          src={foto(c)}
          width={altura * ratio(c)}
          ratio={ratio(c)}
          rotate={(i % 2 ? 1 : -1) * 2}
          drift={false}
        />
      ))}
    </div>
  );
};

export const Cena5: React.FC<CenaProps> = () => {
  const b1 = 4 * COMPASSO; // 9,28 s
  const b2 = 8 * COMPASSO; // 18,56 s
  const b3 = 12 * COMPASSO; // 27,84 s
  return (
    <MotionProvider theme={temaDespedida}>
      <AbsoluteFill>
        <Papel />
        <Janela de={0} ate={b1 + 0.6}>
          <AbsoluteFill>
            <KineticType
              text="DIAS MELHORES •"
              rows={10}
              size={150}
              speed={80}
              opacity={0.1}
              color={P.accent}
            />
            {CASCATA.map((m, k) => (
              <Pos key={m.c} x={m.x} y={m.y}>
                <ObjectEnter
                  motion="pop"
                  delay={0.19 + k * BATIDA}
                  rotateFrom={m.r * 3}
                  rotate={m.r}
                  float={7}
                >
                  <PhotoFrame
                    src={foto(m.c)}
                    width={m.w}
                    ratio={ratio(m.c)}
                    start={0.19 + k * BATIDA}
                  />
                </ObjectEnter>
              </Pos>
            ))}
            <Pos y={0.5} z={5}>
              {/* tarja de papel: legibilidade sobre a cascata de fotos */}
              <ObjectEnter
                motion="pop"
                delay={L(4, 68.19) - 0.1}
                exitAt={b1 - 0.45}
                exitTo="none"
                stretch={0}
              >
                <div
                  style={{
                    background: P.surface,
                    padding: "26px 46px 34px",
                    borderRadius: 18,
                    boxShadow: "0 24px 60px rgba(20,14,8,.35)",
                    rotate: "-2deg",
                  }}
                >
                  <TextReveal
                    text="Vivemos esperando"
                    by="word"
                    delay={L(4, 68.19)}
                    stagger={0.6}
                    size={104}
                    color={P.ink}
                  />
                </div>
              </ObjectEnter>
            </Pos>
          </AbsoluteFill>
        </Janela>
        {/* retorno: fotos já apresentadas em duas faixas deslizantes */}
        <Janela de={b1} ate={b2 + 0.6}>
          <AbsoluteFill>
            <ColorBloom
              origin={[0.5, 0.5]}
              steps={[{ color: P.ink, at: b1 }]}
            />
            <Faixa
              fotos={PAREDE.slice(0, 5)}
              y={0.3}
              dir={1}
              de={b1}
              altura={430}
            />
            <Faixa
              fotos={PAREDE.slice(5)}
              y={0.72}
              dir={-1}
              de={b1}
              altura={430}
            />
            <Pos y={0.51} z={5}>
              <TextReveal
                text="Dias *melhores*"
                by="char"
                direction="center"
                delay={b1 + 0.3}
                size={170}
                color="#FBF7F0"
                highlightColor="#F2B33D"
                style={{ textShadow: sombraTexto }}
              />
            </Pos>
          </AbsoluteFill>
        </Janela>
        {/* a turma toda em tela cheia */}
        <Janela de={b2} ate={b3 + 0.6}>
          <AbsoluteFill>
            {/* foto horizontal inteira (sem cortar a turma) sobre um fundo desfocado dela mesma */}
            <AbsoluteFill
              style={{ filter: "blur(38px) saturate(1.2)", scale: "1.15" }}
            >
              <KenBurns
                src={foto("F016")}
                start={b2}
                from={{ scale: 1.3 }}
                to={{ scale: 1.1 }}
                duration={b3 - b2 + 1}
              />
            </AbsoluteFill>
            <AbsoluteFill style={{ background: "rgba(12,10,8,.35)" }} />
            <Pos y={0.53}>
              <ObjectEnter
                motion="rise"
                from="bottom"
                distance={200}
                delay={b2}
                duration={1}
              >
                <PhotoFrame
                  src={foto("F016")}
                  width={960}
                  ratio={ratio("F016")}
                  border={16}
                  shadow={0.55}
                  start={b2}
                />
              </ObjectEnter>
            </Pos>
            {[
              {
                c: "F009",
                x: 0.24,
                y: 0.2,
                w: 400,
                r: -6,
                d: b2 + 2 * COMPASSO,
              },
              {
                c: "F054",
                x: 0.76,
                y: 0.22,
                w: 400,
                r: 5,
                d: b2 + 2 * COMPASSO + BATIDA,
              },
            ].map((m) => (
              <Pos key={m.c} x={m.x} y={m.y}>
                <ObjectEnter
                  motion="fall"
                  from="top"
                  distance={700}
                  delay={m.d}
                  rotateFrom={m.r * 3}
                  rotate={m.r}
                >
                  <PhotoFrame
                    src={foto(m.c)}
                    width={m.w}
                    ratio={ratio(m.c)}
                    start={m.d}
                  />
                </ObjectEnter>
              </Pos>
            ))}
          </AbsoluteFill>
        </Janela>
        {/* encerramento: lettering central; "pra sempre" em 98,85 s */}
        <Janela de={b3} ate={40}>
          <AbsoluteFill>
            <ColorBloom
              origin={[0.5, 0.55]}
              steps={[{ color: P.background, at: b3 }]}
              duration="base"
            />
            <Pos y={0.5} z={5}>
              <TextReveal
                text="Dias melhores"
                by="char"
                delay={b3 + 0.1}
                stagger={0.035}
                size={150}
                color={P.ink}
                easing="enterStrong"
              />
              <TextReveal
                text="*pra sempre*"
                by="char"
                direction="center"
                delay={L(4, 98.85)}
                stagger={0.03}
                duration={0.45}
                size={190}
                color={P.ink}
                highlightColor={P.accent}
                easing="enterStrong"
                from={{ y: 50, blur: 28, scale: 0.85 }}
                style={{ marginTop: 10 }}
              />
            </Pos>
          </AbsoluteFill>
        </Janela>
      </AbsoluteFill>
    </MotionProvider>
  );
};
