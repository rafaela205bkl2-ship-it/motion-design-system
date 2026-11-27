/**
 * Cenas 5–8 (0:17–0:40 da narração).
 * - cartão inclinado em perspectiva que pousa (Tilt3D) — ref-aline-01/03;
 * - troca de frases no mesmo lugar (TextSwap);
 * - barras que entram da esquerda com asterisco (ObjectEnter glide) — carrossel da cliente;
 * - celular 3D com cursor clicando (Tilt3D + TapCursor) — ref-aline-03, 6,0–9,5 s.
 */
import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  DrawPath,
  MotionProvider,
  ObjectEnter,
  TapCursor,
  TextReveal,
  TextSwap,
  Tilt3D,
  progressAt,
  tapPulse,
  useMotion,
} from "../../../motion";
import type { CenaProps } from "../../_runtime/ProducaoGenerica";
import { Cabecalho, Cena, EtiquetaTopo, Fundo, Pos } from "../marca/elementos";
import { LetrasAB } from "../marca/Logo";
import { COR, FONTE_SERIFADA, FONTE_TEXTO, temaClaro, temaMarinho } from "../marca/tema";
import { Icone } from "./Bloco1";

/* ------------------------------------------------------------------ Cena 5 */
const ETAPAS = [
  { t: "contábil,", d: 0.75 },
  { t: "fiscal", d: 1.6 },
  { t: "e societário", d: 2.45 },
];

/** "Passei pelo contábil, pelo fiscal e pelo societário." */
export const Cena5Trajetoria: React.FC<CenaProps> = () => {
  const frame = useCurrentFrame();
  const m = useMotion();
  return (
    <MotionProvider theme={temaMarinho}>
      <Cena>
        <Fundo tipo="marinho" />
        <EtiquetaTopo />
        <Pos x={540} y={1000} centro>
          <Tilt3D
            from={{ rotateX: 26, rotateY: -38, scale: 0.78, opacity: 0, y: 120 }}
            to={{ rotateX: 5, rotateY: -9 }}
            delay={0.05}
            duration={0.75}
            sway={1.6}
            swayPeriod={5}
          >
            <div
              style={{
                width: m.px(900),
                height: m.px(1060),
                borderRadius: m.px(44),
                background: `linear-gradient(160deg, ${COR.marinhoClaro}, ${COR.marinhoFundo})`,
                border: `${m.px(2)}px solid rgba(167,193,218,.35)`,
                boxShadow: `0 ${m.px(40)}px ${m.px(90)}px rgba(0,0,0,.45)`,
                position: "relative",
                padding: m.px(70),
              }}
            >
              <div style={{ position: "absolute", right: m.px(70), top: m.px(90) }}>
                <TextReveal
                  text="*Passei* pelo"
                  by="word"
                  delay={0.25}
                  size={70}
                  font="body"
                  weight={400}
                  align="right"
                  color={COR.gelo}
                  highlightColor={COR.gelo}
                  style={{ fontFamily: FONTE_TEXTO }}
                />
              </div>
              {/* linha do tempo: trilho + pontos que acendem */}
              <svg
                width={m.px(60)}
                height={m.px(760)}
                viewBox="0 0 60 760"
                style={{ position: "absolute", left: m.px(70), top: m.px(220), overflow: "visible" }}
              >
                <DrawPath d="M30 20 L30 740" delay={0.4} duration={2.3} stroke={COR.azul} strokeWidth={3} />
                {ETAPAS.map((e, i) => {
                  const p = progressAt(frame, m.fps, e.d, 0.3, "enterStrong");
                  return (
                    <circle
                      key={e.t}
                      cx={30}
                      cy={110 + i * 260}
                      r={16 * p}
                      fill={COR.azul}
                      stroke={COR.gelo}
                      strokeWidth={4 * p}
                    />
                  );
                })}
              </svg>
              {ETAPAS.map((e, i) => (
                <div key={e.t} style={{ position: "absolute", right: m.px(70), top: m.px(255 + i * 260) }}>
                  <TextReveal
                    text={e.t}
                    by="char"
                    delay={e.d}
                    stagger={0.025}
                    size={i === 2 ? 110 : 150}
                    align="right"
                    color={COR.azul}
                    lineHeight={1}
                    from={{ x: 30, y: 0, blur: 16 }}
                  />
                </div>
              ))}
            </div>
          </Tilt3D>
        </Pos>
      </Cena>
    </MotionProvider>
  );
};

/* ------------------------------------------------------------------ Cena 6 */
/** "E vi muita gente perdendo horas com burocracias que poderiam ser simples." */
export const Cena6Horas: React.FC<CenaProps> = () => (
  <MotionProvider theme={temaMarinho}>
    <Cena>
      <Fundo tipo="marinho" />
      <Pos x={540} y={680} centro>
        <Relogio para={3.2} />
      </Pos>
      <Pos x={540} y={1360} centro w={940}>
        <TextSwap
          items={[
            { text: "Muita gente\nperdendo *horas*", at: 0.25 },
            { text: "com\nburocracias", at: 2.05 },
            { text: "que poderiam\nser *simples.*", at: 3.2 },
          ]}
          size={128}
          lineHeight={1.02}
          color={COR.gelo}
          highlightColor={COR.azul}
        />
      </Pos>
    </Cena>
  </MotionProvider>
);

const Relogio: React.FC<{ readonly para: number }> = ({ para }) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const t = frame / m.fps;
  const entra = progressAt(frame, m.fps, 0, 0.5, "enterStrong");
  // ponteiro dispara (aceleração) e freia de vez em `para`
  const tt = Math.min(t, para);
  const freio = progressAt(frame, m.fps, para, 0.35, "enterStrong");
  const giro = 360 * (0.9 * tt * tt) + freio * 40;
  const fim = progressAt(frame, m.fps, para, 0.4, "enter");
  const r = 300;
  const tamanho = m.px(r * 2 + 80);
  return (
    <div style={{ transform: `scale(${interpolate(entra, [0, 1], [0.6, 1])})`, opacity: entra }}>
      <svg width={tamanho} height={tamanho} viewBox={`${-r - 40} ${-r - 40} ${2 * r + 80} ${2 * r + 80}`}>
        <circle r={r} fill="rgba(167,193,218,.06)" />
        <DrawPath
          d={`M0 ${-r} A${r} ${r} 0 1 1 -0.1 ${-r}`}
          delay={0.05}
          duration={0.6}
          stroke={COR.gelo}
          strokeWidth={8}
        />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const k = i % 3 === 0 ? 40 : 22;
          return (
            <line
              key={i}
              x1={Math.sin(a) * (r - 20)}
              y1={-Math.cos(a) * (r - 20)}
              x2={Math.sin(a) * (r - 20 - k)}
              y2={-Math.cos(a) * (r - 20 - k)}
              stroke={COR.azul}
              strokeWidth={i % 3 === 0 ? 7 : 4}
              strokeLinecap="round"
              opacity={progressAt(frame, m.fps, 0.15 + i * 0.02, 0.2)}
            />
          );
        })}
        <g opacity={1 - fim}>
          <line x1={0} y1={0} x2={0} y2={-r * 0.5} stroke={COR.gelo} strokeWidth={14} strokeLinecap="round" transform={`rotate(${giro / 12})`} />
          <line x1={0} y1={30} x2={0} y2={-r * 0.78} stroke={COR.azul} strokeWidth={8} strokeLinecap="round" transform={`rotate(${giro})`} />
          <circle r={18} fill={COR.gelo} />
        </g>
        {/* ao parar: o relógio vira um "ok" — simples */}
        <g opacity={fim}>
          <DrawPath d="M-120 10 L-35 95 L130 -80" delay={para + 0.05} duration={0.45} stroke={COR.azul} strokeWidth={26} />
        </g>
      </svg>
    </div>
  );
};

/* ------------------------------------------------------------------ Cena 7 */
const ACOES = [
  { t: "Descomplico processos", d: 0.85 },
  { t: "Organizo etapas", d: 2.0 },
  { t: "Resolvo pendências", d: 3.05 },
  { t: "Faço as coisas *andarem*", d: 4.05 },
];

/** "Por isso eu descomplico processos, organizo etapas, resolvo pendências e faço as coisas andarem." */
export const Cena7ComoTrabalho: React.FC<CenaProps> = ({ slug }) => (
  <MotionProvider theme={temaClaro}>
    <Cena>
      <Fundo tipo="claro" />
      <Cabecalho />
      <Pos x={40} y={1230} w={1000}>
        <ObjectEnter motion="rise" from="bottom" distance={240} delay={0.15} duration={0.7}>
          <Img src={staticFile(`producoes/${slug}/imagens/aline-retrato.png`)} style={{ width: "100%" }} />
        </ObjectEnter>
      </Pos>
      <Pos x={90} y={330}>
        <TextReveal text="Por *isso*, eu:" delay={0.05} size={140} align="left" color={COR.tinta} highlightColor="#2F5D86" />
      </Pos>
      {ACOES.map((a, i) => (
        <Pos key={a.t} x={60} y={560 + i * 160}>
          <ObjectEnter motion="glide" from="left" distance={700} delay={a.d} duration={0.5}>
            <Barra texto={a.t} forte={i === 3} delay={a.d} />
          </ObjectEnter>
        </Pos>
      ))}
    </Cena>
  </MotionProvider>
);

const Barra: React.FC<{ readonly texto: string; readonly forte: boolean; readonly delay: number }> = ({ texto, forte, delay }) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const giro = progressAt(frame, m.fps, delay + 0.2, 0.6, "enterStrong") * 180;
  const partes = texto.split("*");
  return (
    <div
      style={{
        width: m.px(960),
        height: m.px(128),
        borderRadius: m.px(26),
        background: COR.marinho,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `0 ${m.px(48)}px`,
        boxShadow: `0 ${m.px(16)}px ${m.px(36)}px rgba(15,36,54,.28)`,
      }}
    >
      <span style={{ fontFamily: FONTE_TEXTO, fontWeight: forte ? 700 : 400, fontSize: m.px(54), color: COR.gelo, letterSpacing: "-0.01em" }}>
        {partes.map((p, i) => (
          <span key={i} style={{ fontStyle: i === 1 ? "italic" : undefined }}>
            {p}
          </span>
        ))}
      </span>
      <svg width={m.px(54)} height={m.px(54)} viewBox="-10 -10 20 20" style={{ transform: `rotate(${giro}deg)` }}>
        {[0, 60, 120].map((a) => (
          <line key={a} x1={0} y1={-8.5} x2={0} y2={8.5} stroke={COR.gelo} strokeWidth={3.4} strokeLinecap="round" transform={`rotate(${a})`} />
        ))}
      </svg>
    </div>
  );
};

/* ------------------------------------------------------------------ Cena 8 */
const SERVICOS = [
  { t: "Legalização\nde empresas", icone: "predio", at: 0.35 },
  { t: "Alterações e\nregularizações", icone: "editar", at: 1.95 },
  { t: "Organização\nsocietária", icone: "organograma", at: 3.6 },
  { t: "Serviços\ncontábeis", icone: "calculadora", at: 5.1 },
] as const;

// geometria da tela do celular (px de design)
const TELA = { w: 520, h: 1000, linhaY: 300, linhaH: 150, gap: 22 };

/** "Legalização de empresas, alterações e regularizações, organização societária e serviços contábeis." */
export const Cena8Servicos: React.FC<CenaProps> = () => (
  <MotionProvider theme={temaMarinho}>
    <Cena>
      <Fundo tipo="marinho" />
      <EtiquetaTopo />
      <Pos x={540} y={420} centro w={980}>
        <TextSwap
          items={SERVICOS.map((s) => ({ text: s.t, at: s.at - 0.15 }))}
          size={104}
          lineHeight={1.0}
          color={COR.gelo}
        />
      </Pos>
      <Pos x={540} y={1180} centro>
        <Tilt3D
          from={{ rotateX: 24, rotateY: -42, scale: 0.75, opacity: 0, y: 200 }}
          to={{ rotateX: 8, rotateY: -12 }}
          delay={0.0}
          duration={0.7}
          sway={2.2}
          swayPeriod={4.5}
          perspective={1800}
        >
          <Celular />
        </Tilt3D>
      </Pos>
    </Cena>
  </MotionProvider>
);

const Celular: React.FC = () => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const t = frame / m.fps;
  const borda = 26;
  const centroLinha = (i: number) => TELA.linhaY + i * (TELA.linhaH + TELA.gap) + TELA.linhaH / 2;
  return (
    <div
      style={{
        width: m.px(TELA.w + borda * 2),
        height: m.px(TELA.h + borda * 2),
        borderRadius: m.px(90),
        background: "#08151F",
        padding: m.px(borda),
        boxShadow: `0 ${m.px(50)}px ${m.px(110)}px rgba(0,0,0,.55), inset 0 0 0 ${m.px(3)}px #2A4660`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: m.px(TELA.w),
          height: m.px(TELA.h),
          borderRadius: m.px(66),
          background: COR.gelo,
          overflow: "hidden",
        }}
      >
        {/* ilha */}
        <div style={{ position: "absolute", top: m.px(22), left: "50%", transform: "translateX(-50%)", width: m.px(150), height: m.px(40), borderRadius: m.px(20), background: "#08151F" }} />
        {/* topo do app */}
        <div style={{ position: "absolute", top: m.px(100), left: m.px(40), right: m.px(40), display: "flex", alignItems: "center", gap: m.px(18) }}>
          <div style={{ width: m.px(84), height: m.px(84), borderRadius: m.px(24), background: COR.marinho, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LetrasAB altura={52} cor={COR.gelo} />
          </div>
          <div>
            <div style={{ fontFamily: FONTE_SERIFADA, fontSize: m.px(38), color: COR.tinta, lineHeight: 1 }}>Aline Barbosa</div>
            <div style={{ fontFamily: FONTE_TEXTO, fontSize: m.px(22), color: "#4B6782", letterSpacing: "0.12em", marginTop: m.px(6) }}>CONTABILIDADE</div>
          </div>
        </div>
        <div style={{ position: "absolute", top: m.px(220), left: m.px(40), fontFamily: FONTE_TEXTO, fontWeight: 700, fontSize: m.px(40), color: COR.tinta }}>Serviços</div>
        {SERVICOS.map((s, i) => {
          const entra = progressAt(frame, m.fps, 0.3 + i * 0.08, 0.35, "enterStrong");
          const ativo = progressAt(frame, m.fps, s.at, 0.18, "enter");
          const pulso = tapPulse(t, s.at);
          const cheio = ativo > 0.5;
          return (
            <div
              key={s.t}
              style={{
                position: "absolute",
                left: m.px(30),
                right: m.px(30),
                top: m.px(TELA.linhaY + i * (TELA.linhaH + TELA.gap)),
                height: m.px(TELA.linhaH),
                borderRadius: m.px(30),
                background: cheio ? COR.marinho : "#FFFFFF",
                border: `${m.px(3)}px solid ${cheio ? COR.marinho : COR.azulCaixa}`,
                display: "flex",
                alignItems: "center",
                gap: m.px(22),
                padding: `0 ${m.px(24)}px`,
                opacity: entra,
                transform: `translateY(${m.px((1 - entra) * 40)}px) scale(${1 - pulso * 0.05})`,
              }}
            >
              <div style={{ width: m.px(92), height: m.px(92), borderRadius: m.px(24), background: cheio ? COR.azul : COR.marinho, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icone tipo={s.icone} cor={cheio ? COR.marinho : COR.gelo} tam={56} />
              </div>
              <div style={{ fontFamily: FONTE_TEXTO, fontWeight: 600, fontSize: m.px(31), lineHeight: 1.15, color: cheio ? COR.gelo : COR.tinta, whiteSpace: "pre", flex: 1 }}>
                {s.t}
              </div>
              <svg width={m.px(40)} height={m.px(40)} viewBox="0 0 40 40" style={{ opacity: ativo }}>
                <circle cx={20} cy={20} r={18} fill={COR.azul} />
                <path d="M11 20 l6 6 12-12" fill="none" stroke={COR.marinho} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          );
        })}
        <TapCursor
          points={SERVICOS.map((s, i) => ({ x: 300 + (i % 2) * 40, y: centroLinha(i) + 10, at: s.at }))}
          appearAt={0.05}
          travel={0.4}
          variant="dot"
          size={78}
          color={COR.azulProfundo}
          rippleColor={COR.azulProfundo}
        />
      </div>
    </div>
  );
};
