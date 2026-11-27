/**
 * Cenas 9–12 (0:40–1:02 da narração).
 * - palavra riscada por traço que se desenha (DrawPath) e destaque em caixa — ref-aline-02;
 * - gráfico que cresce e linha de tendência (ObjectEnter + DrawPath);
 * - globo de linhas com pinos e arcos (DrawPath);
 * - encerramento: logo se desenha e o nome entra letra a letra; final parado (guia §8).
 */
import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { DrawPath, MotionProvider, TextReveal, TextSwap, ObjectEnter, progressAt, useMotion } from "../../../motion";
import type { CenaProps } from "../../_runtime/ProducaoGenerica";
import { Cabecalho, Cantoneira, Cena, Fundo, Pos } from "../marca/elementos";
import { LogoCompleta } from "../marca/Logo";
import { COR, FONTE_TEXTO, temaClaro, temaMarinho } from "../marca/tema";

/* ------------------------------------------------------------------ Cena 9 */
/** "Tudo com um objetivo simples: menos burocracia, mais crescimento." */
export const Cena9Objetivo: React.FC<CenaProps> = () => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const apaga = progressAt(frame, m.fps, 2.75, 0.4, "enter");
  const caixa = progressAt(frame, m.fps, 3.05, 0.4, "enterStrong");
  return (
    <MotionProvider theme={temaClaro}>
      <Cena>
        <Fundo tipo="claro" />
        <Cabecalho />
        <Pos x={90} y={320} w={900}>
          <TextReveal
            text="Tudo com um objetivo *simples:*"
            by="word"
            delay={0.1}
            size={60}
            font="body"
            weight={500}
            align="left"
            color={COR.tinta}
            highlightColor={COR.tinta}
            style={{ fontFamily: FONTE_TEXTO }}
          />
        </Pos>
        <Pos x={90} y={470}>
          <div style={{ position: "relative", opacity: 1 - apaga * 0.55 }}>
            <TextReveal text="menos burocracia," delay={1.75} size={104} align="left" color={COR.tinta} lineHeight={1.05} style={{ whiteSpace: "nowrap" }} />
            <svg
              width={m.px(960)}
              height={m.px(140)}
              viewBox="0 0 960 140"
              style={{ position: "absolute", left: m.px(-20), top: m.px(0), overflow: "visible" }}
            >
              <DrawPath d="M0 72 C 280 62, 560 80, 880 52" delay={2.55} duration={0.35} stroke={COR.marinho} strokeWidth={10} />
            </svg>
          </div>
        </Pos>
        {/* destaque em caixa, como o rótulo da ref-aline-02 */}
        <Pos x={66} y={630}>
          <div
            style={{
              background: COR.marinho,
              borderRadius: m.px(28),
              padding: `${m.px(14)}px ${m.px(34)}px ${m.px(26)}px`,
              transform: `scaleX(${caixa})`,
              transformOrigin: "0 50%",
            }}
          >
            <TextReveal text="mais crescimento." delay={3.2} size={108} align="left" color={COR.gelo} lineHeight={1.05} style={{ whiteSpace: "nowrap" }} />
          </div>
        </Pos>
        <Grafico inicio={3.35} />
      </Cena>
    </MotionProvider>
  );
};

const Grafico: React.FC<{ readonly inicio: number }> = ({ inicio }) => {
  const m = useMotion();
  const alturas = [150, 230, 320, 430, 560];
  const base = 1620;
  return (
    <>
      {alturas.map((h, i) => (
        <Pos key={i} x={130 + i * 170} y={base - h}>
          <ObjectEnter motion="rise" from="bottom" distance={60} delay={inicio + i * 0.11} duration={0.5}>
            <div
              style={{
                width: m.px(120),
                height: m.px(h),
                borderRadius: `${m.px(22)}px ${m.px(22)}px ${m.px(6)}px ${m.px(6)}px`,
                background: i === alturas.length - 1 ? COR.marinho : i % 2 ? COR.azulProfundo : "#8FAECD",
              }}
            />
          </ObjectEnter>
        </Pos>
      ))}
      <svg
        width={m.px(1080)}
        height={m.px(1920)}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      >
        <DrawPath d="M150 1400 C 380 1360, 560 1290, 700 1170 S 900 1000, 960 940" delay={inicio + 0.35} duration={0.8} stroke={COR.tinta} strokeWidth={8} />
        <DrawPath d="M905 935 L962 938 L950 993" delay={inicio + 1.1} duration={0.25} stroke={COR.tinta} strokeWidth={8} />
        <DrawPath d="M90 1622 L1000 1622" delay={inicio - 0.1} duration={0.5} stroke={COR.tinta} strokeWidth={4} />
      </svg>
    </>
  );
};

/* ------------------------------------------------------------------ Cena 10 */
const PINOS = [
  { x: -150, y: -120, d: 1.0 },
  { x: 140, y: -40, d: 1.25 },
  { x: -40, y: 150, d: 1.5 },
  { x: 210, y: 170, d: 1.75 },
  { x: -230, y: 80, d: 2.0 },
];

/** "Com atendimento sem fronteiras: eu te atendo onde você estiver." */
export const Cena10SemFronteiras: React.FC<CenaProps> = () => (
  <MotionProvider theme={temaMarinho}>
    <Cena>
      <Fundo tipo="marinho" />
      <Pos x={90} y={260} w={900}>
        <TextReveal text="Atendimento" delay={0.1} size={140} align="left" color={COR.gelo} lineHeight={1} />
        <TextReveal text="sem *fronteiras*" delay={0.45} size={140} align="left" color={COR.gelo} highlightColor={COR.azul} lineHeight={1.05} />
      </Pos>
      <Pos x={540} y={1060} centro>
        <Globo />
      </Pos>
      <Pos x={540} y={1560} centro w={960}>
        <TextReveal
          text="Te atendo onde *você estiver.*"
          by="word"
          delay={2.15}
          size={60}
          font="body"
          weight={500}
          color={COR.gelo}
          highlightColor={COR.azul}
          style={{ fontFamily: FONTE_TEXTO }}
        />
      </Pos>
    </Cena>
  </MotionProvider>
);

const Globo: React.FC = () => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const t = frame / m.fps;
  const r = 330;
  const entra = progressAt(frame, m.fps, 0.1, 0.6, "enterStrong");
  const s = m.px(r * 2 + 120);
  const giro = t * 0.6;
  return (
    <svg width={s} height={s} viewBox={`${-r - 60} ${-r - 60} ${2 * r + 120} ${2 * r + 120}`} style={{ overflow: "visible", opacity: entra, transform: `scale(${interpolate(entra, [0, 1], [0.8, 1])})` }}>
      <defs>
        <radialGradient id="globoLuz" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#2B557A" />
          <stop offset="100%" stopColor={COR.marinhoFundo} />
        </radialGradient>
      </defs>
      <circle r={r} fill="url(#globoLuz)" />
      {/* meridianos girando */}
      {Array.from({ length: 6 }, (_, i) => {
        const ph = giro + (i / 6) * Math.PI;
        const rx = Math.abs(Math.cos(ph)) * r;
        return <ellipse key={`m${i}`} rx={rx} ry={r} fill="none" stroke={COR.azul} strokeOpacity={0.35} strokeWidth={2.5} />;
      })}
      {/* paralelos */}
      {[-0.66, -0.33, 0, 0.33, 0.66].map((k) => {
        const y = k * r;
        const w = Math.sqrt(r * r - y * y);
        return <ellipse key={`p${k}`} cx={0} cy={y} rx={w} ry={w * 0.12} fill="none" stroke={COR.azul} strokeOpacity={0.3} strokeWidth={2.5} />;
      })}
      <DrawPath d={`M0 ${-r} A${r} ${r} 0 1 1 -0.1 ${-r}`} delay={0.1} duration={0.7} stroke={COR.azul} strokeWidth={5} />
      {/* arcos entre os pinos */}
      {PINOS.slice(1).map((p, i) => {
        const a = PINOS[i];
        const mx = (a.x + p.x) / 2;
        const my = (a.y + p.y) / 2 - 120;
        return <DrawPath key={`a${i}`} d={`M${a.x} ${a.y} Q${mx} ${my} ${p.x} ${p.y}`} delay={p.d - 0.15} duration={0.4} stroke={COR.gelo} strokeWidth={4} />;
      })}
      {PINOS.map((p, i) => {
        const pop = progressAt(frame, m.fps, p.d, 0.35, "enterStrong");
        const onda = (t - p.d) % 1.4;
        return (
          <g key={`pin${i}`} transform={`translate(${p.x} ${p.y})`}>
            {t > p.d ? <circle r={14 + onda * 50} fill="none" stroke={COR.azul} strokeWidth={3} opacity={Math.max(0, 1 - onda / 1.4)} /> : null}
            <g transform={`scale(${pop})`}>
              <path d="M0 0 C -6 -14, -22 -22, -22 -40 A22 22 0 1 1 22 -40 C 22 -22, 6 -14, 0 0 Z" fill={COR.gelo} />
              <circle cy={-40} r={8} fill={COR.marinho} />
            </g>
          </g>
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ Cena 11 */
/** "Enquanto eu cuido da burocracia, você foca no crescimento do seu negócio." */
export const Cena11Fecho: React.FC<CenaProps> = ({ slug }) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const zoom = interpolate(frame / m.fps, [0, 5.3], [1.02, 1.08]);
  return (
    <MotionProvider theme={temaClaro}>
      <Cena>
        <Fundo tipo="claro" />
        <Cabecalho />
        <Pos x={230} y={700} w={780}>
          <ObjectEnter motion="rise" from="bottom" distance={200} delay={0.05} duration={0.7}>
            <Img
              src={staticFile(`producoes/${slug}/imagens/aline-tablet.png`)}
              style={{ width: "100%", transform: `scale(${zoom})`, transformOrigin: "50% 100%" }}
            />
          </ObjectEnter>
        </Pos>
        <Pos x={90} y={300} w={920}>
          <TextSwap
            items={[
              { text: "Eu cuido da\n*burocracia.*", at: 0.15 },
              { text: "Você foca no\n*seu negócio.*", at: 2.2 },
            ]}
            align="left"
            size={128}
            lineHeight={1.02}
            color={COR.tinta}
            highlightColor="#2F5D86"
          />
        </Pos>
        <Cantoneira x={95} y={620} w={130} h={330} delay={0.6} />
      </Cena>
    </MotionProvider>
  );
};

/* ------------------------------------------------------------------ Cena 12 */
/** "Aline Barbosa: contabilidade e legalização de empresas." — logo se desenha e fica parada. */
export const Cena12Assinatura: React.FC<CenaProps> = () => {
  const frame = useCurrentFrame();
  const m = useMotion();
  // brilho que atravessa a logo depois de pronta
  const brilho = progressAt(frame, m.fps, 2.4, 0.9, "camera");
  return (
    <MotionProvider theme={temaMarinho}>
      <Cena>
        <Fundo tipo="marinho" />
        <Pos x={540} y={930} centro>
          <LogoCompleta altura={440} desenharEm={0.15} />
        </Pos>
        {brilho > 0 && brilho < 1 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(110deg, transparent ${brilho * 140 - 30}%, rgba(255,255,255,.10) ${brilho * 140 - 15}%, transparent ${brilho * 140}%)`,
            }}
          />
        ) : null}
      </Cena>
    </MotionProvider>
  );
};
