/**
 * Cartão de missão/objetivo de jogo: barra de acento, rótulo pequeno, título e uma barra de
 * progresso que se preenche. Entra deslizando com máscara e sai com desfoque.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { progressAt, useMotion } from "../MotionProvider";

export type MissionCardProps = {
  readonly label: string;
  readonly title: string;
  readonly delay?: number;
  readonly speed?: number;
  /** Instante de saída (s); ausente = não sai. */
  readonly exitAt?: number;
  readonly accent?: string;
  readonly color?: string;
  /** Largura em px de design. */
  readonly width?: number;
  /** De onde entra. */
  readonly from?: "left" | "right";
  /** Progresso final da barra (0–1). */
  readonly progress?: number;
};

export const MissionCard: React.FC<MissionCardProps> = ({
  label,
  title,
  delay = 0,
  speed = 1,
  exitAt,
  accent = "#FF5C8A",
  color = "#F4E9DA",
  width = 640,
  from = "left",
  progress = 0.65,
}) => {
  const frame = useCurrentFrame();
  const m = useMotion();
  const s = delay / speed;
  const open = progressAt(frame, m.fps, s, m.dur(0.55, speed), "enterStrong");
  const text = progressAt(frame, m.fps, s + 0.18, m.dur(0.5, speed), "enter");
  const bar = progressAt(frame, m.fps, s + 0.45, m.dur(1.2, speed), "camera");
  const out = exitAt !== undefined ? progressAt(frame, m.fps, exitAt / speed, m.dur(0.3, speed), "exit") : 0;
  const clip = from === "left" ? `inset(0 ${100 - open * 100}% 0 0)` : `inset(0 0 0 ${100 - open * 100}%)`;
  return (
    <div
      style={{
        width: m.px(width),
        clipPath: clip,
        opacity: 1 - out,
        filter: out > 0 ? `blur(${m.px(14) * out}px)` : undefined,
        display: "flex",
        background: "linear-gradient(90deg, rgba(12,9,22,0.82), rgba(12,9,22,0.55))",
        borderRadius: m.px(10),
        overflow: "hidden",
        fontFamily: m.theme.fonts.display,
      }}
    >
      <div style={{ width: m.px(10), background: accent }} />
      <div style={{ padding: `${m.px(24)}px ${m.px(30)}px`, flex: 1, transform: `translateX(${(1 - text) * m.px(from === "left" ? -30 : 30)}px)`, opacity: text }}>
        <div style={{ fontSize: m.px(24), fontWeight: 700, letterSpacing: "0.24em", color: accent }}>{label.toUpperCase()}</div>
        <div style={{ fontSize: m.px(46), fontWeight: 800, letterSpacing: "-0.02em", color, marginTop: m.px(6), lineHeight: 1.05 }}>{title}</div>
        <div style={{ marginTop: m.px(18), height: m.px(6), background: "rgba(244,233,218,0.18)", borderRadius: m.px(6) }}>
          <div style={{ width: `${bar * progress * 100}%`, height: "100%", background: accent, borderRadius: m.px(6) }} />
        </div>
      </div>
    </div>
  );
};
