/**
 * Cenários procedurais originais (SVG, 1080×1920) e espaço para placas reais.
 *
 * Nenhum cenário reproduz um lugar, marco, personagem ou logotipo existente: são cidades,
 * praias e estradas genéricas na luz de cada ato. Quando houver material oficial
 * utilizável, basta apontar o arquivo em PLACAS: a placa real substitui o cenário.
 */
import { Video } from "@remotion/media";
import React, { useMemo } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { seeded } from "../../motion";

/* ------------------------------------------------------------------ */
/* Placas reais (opcional)                                             */
/* ------------------------------------------------------------------ */

/** Arquivo em public/producoes/13-anos-depois/ para cada placa, ou null para o cenário procedural. */
export const PLACAS: Record<string, string | null> = {
  "cidade-2013": null,
  "colinas-2013": null,
  "praia-2013": null,
  "por-do-sol": null,
  "praia-nova": null,
  "cidade-noite": null,
  estrada: null,
  helicoptero: null,
  // cartões da cena 12 (imagem; sem arquivo, o cartão mostra só o nome)
  "cartao-jason": null,
  "cartao-lucia": null,
};

/** Enquadramento (object-position) de cada placa de imagem, ex.: "70% 35%". */
export const ENQUADRAMENTO: Record<string, string> = {
  "cartao-jason": "50% 40%",
  "cartao-lucia": "50% 40%",
};

export const Placa: React.FC<{ readonly slot: string; readonly children: React.ReactNode }> = ({ slot, children }) => {
  const f = PLACAS[slot];
  if (!f) return <>{children}</>;
  const src = staticFile(`producoes/13-anos-depois/${f}`);
  return (
    <AbsoluteFill>
      {f.endsWith(".mp4") ? (
        <Video src={src} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />
      ) : (
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: ENQUADRAMENTO[slot] ?? "50% 50%" }} />
      )}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Peças                                                               */
/* ------------------------------------------------------------------ */

const W = 1080;
const H = 1920;

const Svg: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      {children}
    </svg>
  </AbsoluteFill>
);

type Predio = { x: number; w: number; h: number; janelas: { x: number; y: number; c: string }[] };

/** Gera uma linha de prédios genéricos. */
const usePredios = (seed: number, base: number, hMin: number, hMax: number, janelaProb: number, cores: string[]) =>
  useMemo(() => {
    const r = seeded(seed);
    const out: Predio[] = [];
    let x = -40;
    while (x < W + 40) {
      const w = 46 + r() * 90;
      const h = hMin + Math.pow(r(), 1.6) * (hMax - hMin);
      const janelas: Predio["janelas"] = [];
      if (janelaProb > 0) {
        for (let jy = base - h + 16; jy < base - 14; jy += 22) {
          for (let jx = x + 8; jx < x + w - 10; jx += 16) {
            if (r() < janelaProb) janelas.push({ x: jx, y: jy, c: cores[Math.floor(r() * cores.length)] });
          }
        }
      }
      out.push({ x, w, h, janelas });
      x += w + 2 + r() * 8;
    }
    return out;
  }, [seed, base, hMin, hMax, janelaProb, cores]);

const Skyline: React.FC<{
  readonly seed: number;
  readonly base: number;
  readonly hMin: number;
  readonly hMax: number;
  readonly cor: string;
  readonly janelas?: number;
  readonly coresJanela?: string[];
  readonly opacidade?: number;
}> = ({ seed, base, hMin, hMax, cor, janelas = 0, coresJanela = ["#FFD9A0"], opacidade = 1 }) => {
  const predios = usePredios(seed, base, hMin, hMax, janelas, coresJanela);
  return (
    <g opacity={opacidade}>
      {predios.map((p, i) => (
        <rect key={i} x={p.x} y={base - p.h} width={p.w} height={p.h + 400} fill={cor} />
      ))}
      {predios.flatMap((p, i) => p.janelas.map((j, k) => <rect key={`${i}-${k}`} x={j.x} y={j.y} width={7} height={10} fill={j.c} opacity={0.9} />))}
    </g>
  );
};

/** Palmeira genérica em silhueta. */
const Palmeira: React.FC<{ readonly x: number; readonly base: number; readonly altura: number; readonly inclina?: number; readonly cor: string; readonly balanco?: number }> = ({
  x,
  base,
  altura,
  inclina = 0.15,
  cor,
  balanco = 0,
}) => {
  const topoX = x + altura * inclina + balanco;
  const topoY = base - altura;
  const folhas = [-150, -115, -80, -45, -10, 20, 200, 170, 140];
  return (
    <g fill={cor} stroke={cor}>
      <path d={`M ${x - 14} ${base} Q ${x + altura * inclina * 0.3} ${base - altura * 0.5} ${topoX - 5} ${topoY} L ${topoX + 5} ${topoY} Q ${x + altura * inclina * 0.3 + 18} ${base - altura * 0.5} ${x + 14} ${base} Z`} />
      {folhas.map((a, i) => {
        const rad = ((a + balanco * 0.6) * Math.PI) / 180;
        const len = altura * (0.36 + (i % 3) * 0.05);
        const ex = topoX + Math.cos(rad) * len;
        const ey = topoY + Math.sin(rad) * len * 0.55 + len * 0.25;
        const cx = topoX + Math.cos(rad) * len * 0.5;
        const cy = topoY + Math.sin(rad) * len * 0.5 - len * 0.18;
        return <path key={i} d={`M ${topoX} ${topoY} Q ${cx} ${cy} ${ex} ${ey} Q ${cx + 6} ${cy + 22} ${topoX} ${topoY + 6} Z`} strokeWidth={2} />;
      })}
    </g>
  );
};

/** Faixas de luz de carros numa via horizontal. */
const Trafego: React.FC<{ readonly y: number; readonly frame: number; readonly n?: number; readonly cor: string; readonly sentido?: 1 | -1; readonly vel?: number; readonly seed?: number }> = ({
  y,
  frame,
  n = 6,
  cor,
  sentido = 1,
  vel = 9,
  seed = 11,
}) => {
  const r = seeded(seed);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const off = r() * 1600;
        const len = 60 + r() * 90;
        const v = vel * (0.8 + r() * 0.5);
        const pos = ((off + frame * v) % 1600) - 260;
        const x = sentido === 1 ? pos : W - pos;
        return <rect key={i} x={x} y={y + (r() - 0.5) * 10} width={len} height={5} rx={2.5} fill={cor} opacity={0.9} />;
      })}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Cenários                                                            */
/* ------------------------------------------------------------------ */

/** 2013: cidade ao entardecer, cores quentes e lavadas, avenida com tráfego. */
export const CidadeAntiga: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Placa slot="cidade-2013">
      <Svg>
        <defs>
          <linearGradient id="ca-ceu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2E2440" />
            <stop offset="0.38" stopColor="#7A4A5E" />
            <stop offset="0.55" stopColor="#C77B5A" />
            <stop offset="0.62" stopColor="#F2C28B" />
          </linearGradient>
          <radialGradient id="ca-sol">
            <stop offset="0" stopColor="#FFE6B8" />
            <stop offset="0.25" stopColor="#FFD39A" stopOpacity="0.9" />
            <stop offset="1" stopColor="#F2C28B" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#ca-ceu)" />
        <circle cx={620} cy={1060} r={420} fill="url(#ca-sol)" />
        <circle cx={620} cy={1060} r={95} fill="#FFE2B0" />
        <Skyline seed={5} base={1160} hMin={120} hMax={420} cor="#9A6A68" opacidade={0.55} />
        <Skyline seed={9} base={1170} hMin={160} hMax={640} cor="#4A3038" janelas={0.06} coresJanela={["#FFD9A0", "#F5B97A"]} />
        <rect x={0} y={1165} width={W} height={120} fill="#2B1E24" />
        <rect x={0} y={1222} width={W} height={3} fill="#5A4048" />
        <Trafego y={1190} frame={frame} cor="#FFF1D6" sentido={1} />
        <Trafego y={1250} frame={frame} cor="#FF5A4A" sentido={-1} seed={23} />
        <rect x={0} y={1285} width={W} height={H - 1285} fill="#1C1418" />
      </Svg>
    </Placa>
  );
};

/** 2013: colinas de dia com casas ao longe, luz lavada. */
export const Colinas: React.FC = () => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 40) * 4;
  const r = seeded(31);
  const casas = Array.from({ length: 26 }, () => ({ x: r() * W, y: 1040 + r() * 160, s: 10 + r() * 12 }));
  return (
    <Placa slot="colinas-2013">
      <Svg>
        <defs>
          <linearGradient id="co-ceu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7FA9C4" />
            <stop offset="0.5" stopColor="#CFDDE0" />
            <stop offset="0.6" stopColor="#F3E2C7" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#co-ceu)" />
        <circle cx={260} cy={560} r={220} fill="#FFF6E0" opacity={0.35} />
        <path d={`M0 1050 Q 270 ${930 + sway} 540 1010 T 1080 980 V 1920 H 0 Z`} fill="#A8A27E" />
        <path d={`M0 1130 Q 300 1040 620 1110 T 1080 1080 V 1920 H 0 Z`} fill="#7F8A62" />
        {casas.map((c, i) => (
          <rect key={i} x={c.x} y={c.y} width={c.s} height={c.s * 0.7} fill="#EFE3CC" opacity={0.8} />
        ))}
        <path d="M0 1230 Q 360 1150 700 1220 T 1080 1200 V 1920 H 0 Z" fill="#5E6A4A" />
        <path d="M0 1340 Q 400 1280 760 1330 T 1080 1320 V 1920 H 0 Z" fill="#46503A" />
      </Svg>
    </Placa>
  );
};

/** Praia: "memoria" (2013, dia lavado) ou "nova" (pôr do sol rosa e laranja). */
export const Praia: React.FC<{ readonly clima?: "memoria" | "nova" }> = ({ clima = "memoria" }) => {
  const frame = useCurrentFrame();
  const nova = clima === "nova";
  const ceu = nova ? ["#3A1B52", "#B0407A", "#FF7A5C", "#FFB067"] : ["#86B6CF", "#BFD9E2", "#EDE3CC", "#F6E3C5"];
  const mar = nova ? ["#2C5C8A", "#1D2C56"] : ["#4F8FAE", "#2F6A88"];
  const areia = nova ? "#C98A6A" : "#E9CFA4";
  const sway = Math.sin(frame / 30) * 6;
  return (
    <Placa slot={nova ? "praia-nova" : "praia-2013"}>
      <Svg>
        <defs>
          <linearGradient id={`pr-ceu-${clima}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={ceu[0]} />
            <stop offset="0.35" stopColor={ceu[1]} />
            <stop offset="0.5" stopColor={ceu[2]} />
            <stop offset="0.56" stopColor={ceu[3]} />
          </linearGradient>
          <linearGradient id={`pr-mar-${clima}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={mar[0]} />
            <stop offset="1" stopColor={mar[1]} />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={`url(#pr-ceu-${clima})`} />
        {nova ? <circle cx={540} cy={1040} r={150} fill="#FFC27A" opacity={0.95} /> : <circle cx={820} cy={520} r={70} fill="#FFF8E8" opacity={0.8} />}
        <rect x={0} y={1080} width={W} height={260} fill={`url(#pr-mar-${clima})`} />
        {Array.from({ length: 14 }, (_, i) => {
          const y = 1100 + i * 17;
          const x = ((i * 137 + frame * (1.2 + (i % 3) * 0.4)) % 1300) - 200;
          return <rect key={i} x={x} y={y} width={120 + (i % 4) * 60} height={2.5} fill={nova ? "#FFC27A" : "#FFFFFF"} opacity={0.35} />;
        })}
        <path d={`M0 ${1330 + sway * 0.3} Q 540 ${1300 - sway} 1080 ${1335 + sway * 0.3} V 1920 H 0 Z`} fill="#FFFFFF" opacity={0.35} />
        <path d="M0 1350 Q 540 1320 1080 1355 V 1920 H 0 Z" fill={areia} />
        <Palmeira x={130} base={1400} altura={560} inclina={0.25} cor={nova ? "#1B0F22" : "#3E4A33"} balanco={sway} />
        <Palmeira x={980} base={1420} altura={470} inclina={-0.2} cor={nova ? "#1B0F22" : "#3E4A33"} balanco={-sway} />
      </Svg>
    </Placa>
  );
};

/** Nova cidade ao pôr do sol: céu rosa e laranja, sol grande, mar com reflexo e palmeiras. */
export const PorDoSol: React.FC<{ readonly sol?: number }> = ({ sol = 1 }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 34) * 5;
  return (
    <Placa slot="por-do-sol">
      <Svg>
        <defs>
          <linearGradient id="ps-ceu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#140C28" />
            <stop offset="0.3" stopColor="#3D1E5E" />
            <stop offset="0.48" stopColor="#B33C7A" />
            <stop offset="0.6" stopColor="#FF6F6A" />
            <stop offset="0.63" stopColor="#FF9A4D" />
          </linearGradient>
          <linearGradient id="ps-sol" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFE08A" />
            <stop offset="1" stopColor="#FF5C8A" />
          </linearGradient>
          <linearGradient id="ps-mar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3A1F4F" />
            <stop offset="1" stopColor="#0B0A10" />
          </linearGradient>
          <radialGradient id="ps-halo">
            <stop offset="0" stopColor="#FF8A3D" stopOpacity="0.6" />
            <stop offset="1" stopColor="#FF8A3D" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#ps-ceu)" />
        <circle cx={540} cy={1000} r={560 * sol} fill="url(#ps-halo)" />
        <g opacity={sol}>
          <circle cx={540} cy={1000} r={260} fill="url(#ps-sol)" />
        </g>
        <Skyline seed={41} base={1200} hMin={30} hMax={170} cor="#2A1238" janelas={0.12} coresJanela={["#FF8FB1", "#FFC27A"]} />
        <rect x={0} y={1200} width={W} height={H - 1200} fill="url(#ps-mar)" />
        {Array.from({ length: 22 }, (_, i) => {
          const y = 1210 + i * 16;
          const wv = (260 - i * 9) * sol + Math.sin(frame / 9 + i) * 14;
          return <rect key={i} x={540 - wv / 2} y={y} width={Math.max(10, wv)} height={4} rx={2} fill="#FFB07A" opacity={0.55 - i * 0.02} />;
        })}
        <Palmeira x={90} base={1720} altura={820} inclina={0.28} cor="#0E0814" balanco={sway} />
        <Palmeira x={1010} base={1760} altura={700} inclina={-0.24} cor="#0E0814" balanco={-sway} />
      </Svg>
    </Placa>
  );
};

/** Cidade à noite com reflexo na água; opcional: helicóptero com holofote. */
export const CidadeNoite: React.FC<{ readonly helicoptero?: boolean }> = ({ helicoptero = false }) => {
  const frame = useCurrentFrame();
  const hx = 160 + frame * 3.2;
  const hy = 520 + Math.sin(frame / 25) * 18;
  const ang = Math.sin(frame / 30) * 12;
  return (
    <Placa slot={helicoptero ? "helicoptero" : "cidade-noite"}>
      <Svg>
        <defs>
          <linearGradient id="cn-ceu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#07060C" />
            <stop offset="0.45" stopColor="#1B1436" />
            <stop offset="0.62" stopColor="#4A2257" />
          </linearGradient>
          <linearGradient id="cn-agua" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1A1230" />
            <stop offset="1" stopColor="#05040A" />
          </linearGradient>
          <linearGradient id="cn-luz" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFF1D6" stopOpacity="0.55" />
            <stop offset="1" stopColor="#FFF1D6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#cn-ceu)" />
        <Skyline seed={61} base={1190} hMin={140} hMax={520} cor="#1E1430" opacidade={0.8} janelas={0.08} coresJanela={["#7B4BD6", "#FF8FB1"]} />
        <Skyline seed={73} base={1200} hMin={220} hMax={860} cor="#0F0A1A" janelas={0.16} coresJanela={["#FFC27A", "#FF8FB1", "#8FD8FF", "#FFF1D6"]} />
        <rect x={0} y={1200} width={W} height={H - 1200} fill="url(#cn-agua)" />
        {Array.from({ length: 30 }, (_, i) => {
          const r = seeded(100 + i);
          const x = r() * W;
          const c = ["#FFC27A", "#FF8FB1", "#8FD8FF"][i % 3];
          const len = 80 + r() * 260;
          return <rect key={i} x={x} y={1210} width={3 + r() * 5} height={len} fill={c} opacity={0.18 + 0.12 * Math.sin(frame / 8 + i)} />;
        })}
        {helicoptero ? (
          <g>
            <polygon points={`${hx},${hy} ${hx - 160 + ang * 8},1200 ${hx + 160 + ang * 8},1200`} fill="url(#cn-luz)" />
            <rect x={hx - 24} y={hy - 8} width={48} height={14} rx={7} fill="#05040A" />
            <circle cx={hx + 26} cy={hy} r={5} fill="#FF3B3B" opacity={frame % 20 < 8 ? 1 : 0.15} />
          </g>
        ) : null}
      </Svg>
    </Placa>
  );
};

/** Estrada à noite em perspectiva, faixas e luzes passando rápido. */
export const Estrada: React.FC = () => {
  const frame = useCurrentFrame();
  const vx = 540;
  const vy = 880;
  return (
    <Placa slot="estrada">
      <Svg>
        <defs>
          <linearGradient id="es-ceu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0B0A10" />
            <stop offset="0.42" stopColor="#3A1F4F" />
            <stop offset="0.46" stopColor="#FF6F6A" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#es-ceu)" />
        <Skyline seed={81} base={vy} hMin={20} hMax={150} cor="#1A0F26" janelas={0.15} coresJanela={["#FFC27A", "#FF8FB1"]} />
        <rect x={0} y={vy} width={W} height={H - vy} fill="#0A0810" />
        <polygon points={`${vx - 6},${vy} ${vx + 6},${vy} ${W + 500},${H} ${-500},${H}`} fill="#15111C" />
        {Array.from({ length: 10 }, (_, i) => {
          const z = ((i / 10 + frame * 0.035) % 1) ** 2.2;
          const y = vy + z * (H - vy);
          const h = 8 + z * 140;
          const w = 3 + z * 26;
          return <rect key={i} x={vx - w / 2} y={y} width={w} height={h} fill="#F4E9DA" opacity={0.7} />;
        })}
        {Array.from({ length: 16 }, (_, i) => {
          const r = seeded(200 + i);
          const lado = i % 2 === 0 ? -1 : 1;
          const z = ((r() + frame * (0.02 + r() * 0.02)) % 1) ** 2.4;
          const x = vx + lado * (40 + z * 900);
          const y = vy + z * (H - vy) * 0.85;
          const len = 10 + z * 420;
          return <rect key={i} x={x - (lado > 0 ? 0 : len)} y={y} width={len} height={3 + z * 10} rx={4} fill={lado > 0 ? "#FF3B4A" : "#FFF1D6"} opacity={0.85} />;
        })}
      </Svg>
    </Placa>
  );
};
