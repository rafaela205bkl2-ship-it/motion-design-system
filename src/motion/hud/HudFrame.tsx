/**
 * Moldura de câmera/visor por cima da cena: cantos, indicador de gravação piscando,
 * contador de tempo e um rótulo de local. Dá linguagem de "imagem capturada" ao plano.
 * Respeita a área segura do formato.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useLayout } from "../../lib/layout";
import { progressAt, useMotion } from "../MotionProvider";

export type HudFrameProps = {
  readonly label?: string;
  readonly sublabel?: string;
  readonly delay?: number;
  readonly color?: string;
  readonly accent?: string;
  /** Tempo inicial exibido no contador (s). */
  readonly clockFrom?: number;
  /** Mostra o indicador de gravação. */
  readonly rec?: boolean;
};

const fmt = (s: number) => {
  const h = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = Math.floor(s % 60);
  return [h, mm, ss].map((v) => String(v).padStart(2, "0")).join(":");
};

export const HudFrame: React.FC<HudFrameProps> = ({
  label,
  sublabel,
  delay = 0,
  color = "rgba(244,233,218,0.85)",
  accent = "#FF3B4A",
  clockFrom = 0,
  rec = true,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const { safe } = useLayout();
  const t = frame / m.fps;
  const k = progressAt(frame, m.fps, delay, m.dur(0.5), "enterStrong");
  const L = m.px(70);
  const W = m.px(4);
  const corner = (pos: React.CSSProperties, rot: number) => (
    <div style={{ position: "absolute", width: L, height: L, ...pos, transform: `rotate(${rot}deg) scale(${0.6 + 0.4 * k})`, opacity: k }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: L, height: W, background: color }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: L, background: color }} />
    </div>
  );
  const txt: React.CSSProperties = { fontFamily: m.theme.fonts.display, fontSize: m.px(26), fontWeight: 700, letterSpacing: "0.18em", color, opacity: k };
  return (
    <AbsoluteFill style={{ pointerEvents: "none", padding: `${safe.top}px ${safe.x}px ${safe.bottom}px` }}>
      <div style={{ position: "relative", flex: 1 }}>
        {corner({ left: 0, top: 0 }, 0)}
        {corner({ right: 0, top: 0 }, 90)}
        {corner({ right: 0, bottom: 0 }, 180)}
        {corner({ left: 0, bottom: 0 }, 270)}
        <div style={{ position: "absolute", left: m.px(34), top: m.px(30), display: "flex", alignItems: "center", gap: m.px(12), ...txt }}>
          {rec ? <div style={{ width: m.px(18), height: m.px(18), borderRadius: "50%", background: accent, opacity: Math.floor(t * 2) % 2 ? 0.25 : 1 }} /> : null}
          {rec ? "REC" : null}
        </div>
        <div style={{ position: "absolute", right: m.px(34), top: m.px(30), ...txt }}>{fmt(clockFrom + t)}</div>
        {label ? (
          <div style={{ position: "absolute", left: m.px(34), bottom: m.px(30), ...txt }}>
            {label}
            {sublabel ? <div style={{ fontSize: m.px(20), opacity: 0.7, marginTop: m.px(6) }}>{sublabel}</div> : null}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
