/**
 * Cenas 1–4 (0:00–0:17 da narração).
 * Padrões das referências usados aqui (todos vindos da biblioteca):
 * - logo girando em 3D com letras em órbita (OrbitText) — ref-aline-01;
 * - frase digitada com cursor (TypeOn) — ref-aline-03;
 * - objetos que caem e empilham com peso (ObjectEnter fall) — ref-aline-02;
 * - revelação de texto com desfoque (TextReveal) e cantoneiras (DrawPath).
 */
import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  MotionProvider,
  ObjectEnter,
  OrbitText,
  TextReveal,
  Tilt3D,
  TypeOn,
  progressAt,
  useMotion,
} from "../../../motion";
import type { CenaProps } from "../../_runtime/ProducaoGenerica";
import { Cabecalho, Cantoneira, Cena, EtiquetaTopo, Fundo, Pos } from "../marca/elementos";
import { Monograma } from "../marca/Logo";
import { COR, FONTE_SERIFADA, FONTE_TEXTO, temaClaro, temaMarinho } from "../marca/tema";

const img = (slug: string, f: string) => staticFile(`producoes/${slug}/imagens/${f}`);

/* ------------------------------------------------------------------ Cena 1 */
/** "Sua empresa travada por causa de papel?" — logo gira, frase digitada, papéis caem. */
export const Cena1Abertura: React.FC<CenaProps> = () => (
  <MotionProvider theme={temaMarinho}>
    <Cena>
      <Fundo tipo="marinho" />
      <LogoGirando />
      <Pos x={90} y={820} w={900}>
        <TypeOn
          text={"Sua empresa travada\npor causa de *papel?*"}
          delay={1.0}
          cps={30}
          size={96}
          font="body"
          weight={600}
          lineHeight={1.12}
          tracking="-0.02em"
          color={COR.gelo}
          highlightColor={COR.azul}
          cursorColor={COR.azul}
        />
      </Pos>
      {/* papéis que caem e "travam" a tela */}
      {[
        { x: 640, y: 1250, r: 9, d: 2.35 },
        { x: 170, y: 1330, r: -12, d: 2.55 },
        { x: 470, y: 1420, r: 4, d: 2.75 },
      ].map((p, i) => (
        <Pos key={i} x={p.x} y={p.y}>
          <ObjectEnter motion="fall" delay={p.d} distance={900} rotateFrom={p.r * 3} rotate={p.r} impact={0.06}>
            <Folha />
          </ObjectEnter>
        </Pos>
      ))}
    </Cena>
  </MotionProvider>
);

const LogoGirando: React.FC = () => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const t = frame / m.fps;
  // gira 1,5 volta desacelerando até parar de frente (1,1 s)
  const giro = progressAt(frame, m.fps, 0, 1.1, "enterStrong");
  const rotY = -540 * (1 - giro);
  const entra = progressAt(frame, m.fps, 0, 0.45, "enterStrong");
  // depois sobe e encolhe para dar lugar à frase
  const sobe = progressAt(frame, m.fps, 1.0, 0.45, "camera");
  const y = interpolate(sobe, [0, 1], [900, 470]);
  const s = interpolate(entra, [0, 1], [0.35, 1]) * interpolate(sobe, [0, 1], [1, 0.62]);
  return (
    <Pos x={540} y={y}>
      <OrbitText
        text="ALINE BARBOSA · CONTABILIDADE · "
        radius={420}
        tilt={0.5}
        turns={0.55}
        hideAt={1.15}
        size={42}
        fontFamily={FONTE_TEXTO}
        weight={500}
        color={COR.azul}
      >
        <div
          style={{
            perspective: m.px(1400),
            transform: `scale(${s})`,
            opacity: entra,
          }}
        >
          <div style={{ transform: `rotateY(${rotY}deg)`, filter: t < 0.9 ? `drop-shadow(0 0 ${m.px(30)}px rgba(167,193,218,.35))` : undefined }}>
            <Monograma altura={430} />
          </div>
        </div>
      </OrbitText>
    </Pos>
  );
};

const Folha: React.FC = () => {
  const m = useMotion();
  return (
    <div
      style={{
        width: m.px(270),
        height: m.px(350),
        background: COR.gelo,
        borderRadius: m.px(14),
        boxShadow: `0 ${m.px(18)}px ${m.px(40)}px rgba(0,0,0,.35)`,
        padding: m.px(34),
        display: "flex",
        flexDirection: "column",
        gap: m.px(18),
      }}
    >
      <div style={{ height: m.px(18), width: "55%", background: COR.marinho, borderRadius: m.px(9) }} />
      {[1, 0.9, 1, 0.7, 0.95, 0.6].map((w, i) => (
        <div key={i} style={{ height: m.px(11), width: `${w * 100}%`, background: COR.azul, borderRadius: m.px(6) }} />
      ))}
      <div style={{ marginTop: "auto", alignSelf: "flex-end", width: m.px(70), height: m.px(70), borderRadius: "50%", border: `${m.px(5)}px solid ${COR.azulProfundo}` }} />
    </div>
  );
};

/* ------------------------------------------------------------------ Cena 2 */
const DOCS = [
  { t: "ALVARÁ", y: 470, r: -4, d: 0.12, icone: "predio" },
  { t: "CNPJ", y: 690, r: 3, d: 0.72, icone: "id" },
  { t: "CONTRATO SOCIAL", y: 910, r: -2, d: 1.3, icone: "doc" },
] as const;

const PENDENCIAS = [
  { x: 120, y: 1170, d: 2.05 },
  { x: 610, y: 1120, d: 2.15 },
  { x: 360, y: 1230, d: 2.25 },
  { x: 700, y: 1290, d: 2.35 },
  { x: 90, y: 1320, d: 2.45 },
  { x: 430, y: 1360, d: 2.55 },
];

/** "Alvará, CNPJ, contrato social… pendência atrás de pendência." */
export const Cena2Burocracia: React.FC<CenaProps> = () => (
  <MotionProvider theme={temaMarinho}>
    <Cena>
      <Fundo tipo="marinho" />
      <EtiquetaTopo />
      {DOCS.map((doc) => (
        <Pos key={doc.t} x={540} y={doc.y} style={{ transform: "translateX(-50%)" }}>
          <ObjectEnter motion="fall" delay={doc.d} distance={1100} rotateFrom={doc.r * 4} rotate={doc.r} impact={0.07}>
            {/* gira em X enquanto cai: chega "de pé" com leve inclinação em perspectiva */}
            <Tilt3D
              from={{ rotateX: -75, rotateY: -30, opacity: 1 }}
              to={{ rotateX: 10, rotateY: doc.r > 0 ? 12 : -12 }}
              delay={doc.d}
              duration={0.6}
              sway={1.5}
              swayPeriod={3.5}
              perspective={1200}
            >
              <CartaoDoc titulo={doc.t} icone={doc.icone} />
            </Tilt3D>
          </ObjectEnter>
        </Pos>
      ))}
      {PENDENCIAS.map((p, i) => (
        <Pos key={i} x={p.x} y={p.y}>
          <ObjectEnter motion="pop" delay={p.d} rotate={i % 2 ? 4 : -5}>
            <ChipPendencia />
          </ObjectEnter>
        </Pos>
      ))}
      <Pos x={90} y={1480} w={900}>
        <TextReveal
          text={"Pendência atrás\nde *pendência.*"}
          by="word"
          delay={2.2}
          size={104}
          align="left"
          lineHeight={1.02}
          color={COR.gelo}
          highlightColor={COR.azul}
        />
      </Pos>
    </Cena>
  </MotionProvider>
);

const Icone: React.FC<{ readonly tipo: string; readonly cor: string; readonly tam: number }> = ({ tipo, cor, tam }) => {
  const m = useMotion();
  const s = m.px(tam);
  const comum = { fill: "none", stroke: cor, strokeWidth: 3.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={s} height={s} viewBox="0 0 48 48">
      {tipo === "predio" ? (
        <g {...comum}>
          <path d="M8 42 V14 L24 6 L40 14 V42 Z" />
          <path d="M16 20 h4 M28 20 h4 M16 28 h4 M28 28 h4 M21 42 v-8 h6 v8" />
        </g>
      ) : tipo === "id" ? (
        <g {...comum}>
          <rect x="5" y="10" width="38" height="28" rx="5" />
          <circle cx="17" cy="22" r="4.5" />
          <path d="M10 33 c2-5 12-5 14 0 M28 19 h9 M28 26 h7" />
        </g>
      ) : tipo === "doc" ? (
        <g {...comum}>
          <path d="M12 5 h17 l9 9 v29 H12 Z M29 5 v9 h9" />
          <path d="M18 23 h14 M18 30 h14 M18 37 h8" />
        </g>
      ) : tipo === "editar" ? (
        <g {...comum}>
          <path d="M10 6 h18 l8 8 v12 M10 6 v36 h14" />
          <path d="M26 40 l2-7 12-12 5 5-12 12 Z" />
        </g>
      ) : tipo === "organograma" ? (
        <g {...comum}>
          <rect x="18" y="5" width="12" height="9" rx="2" />
          <rect x="5" y="34" width="12" height="9" rx="2" />
          <rect x="31" y="34" width="12" height="9" rx="2" />
          <path d="M24 14 v10 M11 34 v-6 h26 v6" />
        </g>
      ) : tipo === "calculadora" ? (
        <g {...comum}>
          <rect x="10" y="4" width="28" height="40" rx="5" />
          <rect x="15" y="9" width="18" height="8" rx="1.5" />
          <path d="M17 25 h0.1 M24 25 h0.1 M31 25 h0.1 M17 32 h0.1 M24 32 h0.1 M31 32 h0.1 M17 39 h0.1 M24 39 h7" strokeWidth={4.5} />
        </g>
      ) : (
        <g {...comum}>
          <path d="M24 6 L44 40 H4 Z M24 19 v10" />
          <path d="M24 34.5 h0.1" strokeWidth={5} />
        </g>
      )}
    </svg>
  );
};
export { Icone };

const CartaoDoc: React.FC<{ readonly titulo: string; readonly icone: string }> = ({ titulo, icone }) => {
  const m = useMotion();
  return (
    <div
      style={{
        width: m.px(760),
        height: m.px(170),
        background: COR.gelo,
        borderRadius: m.px(30),
        display: "flex",
        alignItems: "center",
        gap: m.px(34),
        padding: `0 ${m.px(40)}px`,
        boxShadow: `0 ${m.px(22)}px ${m.px(50)}px rgba(0,0,0,.35)`,
      }}
    >
      <div
        style={{
          width: m.px(100),
          height: m.px(100),
          borderRadius: m.px(24),
          background: COR.marinho,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icone tipo={icone} cor={COR.gelo} tam={60} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: m.px(10), flex: 1 }}>
        <div style={{ fontFamily: FONTE_TEXTO, fontWeight: 700, fontSize: m.px(52), color: COR.tinta, letterSpacing: "-0.01em", lineHeight: 1 }}>
          {titulo}
        </div>
        <div style={{ display: "flex", gap: m.px(10) }}>
          <div style={{ height: m.px(10), width: m.px(180), background: COR.azul, borderRadius: m.px(5) }} />
          <div style={{ height: m.px(10), width: m.px(90), background: COR.azul, borderRadius: m.px(5) }} />
        </div>
      </div>
    </div>
  );
};

const ChipPendencia: React.FC = () => {
  const m = useMotion();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: m.px(12),
        padding: `${m.px(14)}px ${m.px(26)}px`,
        background: COR.azul,
        borderRadius: m.px(60),
        boxShadow: `0 ${m.px(10)}px ${m.px(26)}px rgba(0,0,0,.3)`,
      }}
    >
      <Icone tipo="alerta" cor={COR.marinho} tam={36} />
      <span style={{ fontFamily: FONTE_TEXTO, fontWeight: 600, fontSize: m.px(34), color: COR.marinho }}>pendência</span>
    </div>
  );
};

/* ------------------------------------------------------------------ Cena 3 */
/** "Prazer, eu sou a Aline Barbosa." */
export const Cena3Prazer: React.FC<CenaProps> = ({ slug }) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const zoom = interpolate(frame / m.fps, [0, 4.3], [1, 1.05]);
  return (
    <MotionProvider theme={temaClaro}>
      <Cena>
        <Fundo tipo="claro" />
        <PalavraFantasma texto="Aline" y={700} />
        <Cabecalho />
        <Pos x={-60} y={1040} w={1200}>
          <ObjectEnter motion="rise" from="bottom" distance={260} delay={0.05} duration={0.7}>
            <Img
              src={img(slug, "aline-retrato.png")}
              style={{ width: "100%", transform: `scale(${zoom})`, transformOrigin: "50% 100%" }}
            />
          </ObjectEnter>
        </Pos>
        <Pos x={95} y={330}>
          <TextReveal text="Prazer," delay={0.2} size={168} align="left" color={COR.tinta} lineHeight={1} />
          <TextReveal
            text="eu sou,"
            delay={0.55}
            size={168}
            align="left"
            color={COR.tinta}
            lineHeight={1}
            style={{ fontStyle: "italic" }}
          />
          <TextReveal text="Aline." delay={0.9} size={168} align="left" color={COR.tinta} lineHeight={1} />
        </Pos>
        <Cantoneira x={130} y={860} w={190} h={130} delay={1.2} />
      </Cena>
    </MotionProvider>
  );
};

/** Palavra gigante e clara ao fundo (como a escrita fantasma do carrossel). */
const PalavraFantasma: React.FC<{ readonly texto: string; readonly y: number }> = ({ texto, y }) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const t = frame / m.fps;
  const p = progressAt(frame, m.fps, 0, 1.2, "enter");
  return (
    <div
      style={{
        position: "absolute",
        top: m.px(y),
        left: m.px(-40 - t * 30),
        fontFamily: FONTE_SERIFADA,
        fontSize: m.px(560),
        fontStyle: "italic",
        color: "#FFFFFF",
        opacity: 0.22 * p,
        whiteSpace: "nowrap",
        lineHeight: 1,
      }}
    >
      {texto}
    </div>
  );
};

/* ------------------------------------------------------------------ Cena 4 */
const TAGS = [
  { t: "Contadora", y: 560, d: 0.15, estilo: "cheio" },
  { t: "Paulista de\nnascimento", y: 760, d: 1.0, estilo: "claro" },
  { t: "Baiana de\ncoração ♥", y: 1030, d: 2.1, estilo: "contorno" },
] as const;

/** "Contadora, paulista de nascimento e baiana de coração." */
export const Cena4QuemSou: React.FC<CenaProps> = ({ slug }) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const pB = progressAt(frame, m.fps, 0, 0.8, "enterStrong");
  return (
    <MotionProvider theme={temaClaro}>
      <Cena>
        <Fundo tipo="claro" />
        <Cabecalho />
        {/* "B" gigante atrás da foto, como na tela de boas-vindas do carrossel */}
        <div
          style={{
            position: "absolute",
            top: m.px(330),
            left: m.px(420 + (1 - pB) * 260),
            fontFamily: FONTE_SERIFADA,
            fontSize: m.px(1150),
            lineHeight: 1,
            color: COR.marinho,
            opacity: pB,
            filter: pB < 1 ? `blur(${m.px((1 - pB) * 20)}px)` : undefined,
          }}
        >
          B
        </div>
        <Pos x={400} y={600} w={740}>
          <ObjectEnter motion="glide" from="right" distance={500} delay={0.05} duration={0.6}>
            <Img src={img(slug, "aline-tablet.png")} style={{ width: "100%" }} />
          </ObjectEnter>
        </Pos>
        {TAGS.map((tag) => (
          <Pos key={tag.t} x={80} y={tag.y}>
            <ObjectEnter motion="pop" delay={tag.d} from="left" distance={120}>
              <Etiqueta texto={tag.t} estilo={tag.estilo} />
            </ObjectEnter>
          </Pos>
        ))}
        <Cantoneira x={95} y={1300} w={160} h={200} delay={2.6} />
      </Cena>
    </MotionProvider>
  );
};

const Etiqueta: React.FC<{ readonly texto: string; readonly estilo: "cheio" | "claro" | "contorno" }> = ({ texto, estilo }) => {
  const m = useMotion();
  const bg = estilo === "cheio" ? COR.marinho : estilo === "claro" ? COR.gelo : "transparent";
  const fg = estilo === "cheio" ? COR.gelo : COR.tinta;
  return (
    <div
      style={{
        background: bg,
        border: estilo === "contorno" ? `${m.px(4)}px solid ${COR.marinho}` : undefined,
        borderRadius: m.px(30),
        padding: `${m.px(22)}px ${m.px(38)}px`,
        fontFamily: FONTE_TEXTO,
        fontWeight: estilo === "cheio" ? 700 : 600,
        fontSize: m.px(estilo === "cheio" ? 64 : 52),
        lineHeight: 1.1,
        color: fg,
        whiteSpace: "pre",
        boxShadow: estilo === "contorno" ? undefined : `0 ${m.px(14)}px ${m.px(34)}px rgba(15,36,54,.22)`,
      }}
    >
      {texto}
    </div>
  );
};
