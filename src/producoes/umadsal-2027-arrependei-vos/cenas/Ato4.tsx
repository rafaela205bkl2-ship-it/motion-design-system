/**
 * ATO 4 — A REVELAÇÃO (128,5–170 s). Narração N13–N16.
 * Da escuridão para a luz: a tela se abre (fim do letterbox) e o lettering oficial é
 * construído sobre o creme da identidade → Atos 3:19 → a camisa → o logotipo → a assinatura.
 */
import React from "react";
import { AbsoluteFill, Img, interpolate } from "remotion";
import {
  CameraPlate,
  Flash,
  LightRays,
  MaskReveal,
  Particles,
  Shine,
  useLayout,
  useProgress,
} from "../../../motion";
import { COR, IMG } from "../marca";
import { HIT, txt, useAbs, useRel } from "../tempo";
import { Asterisco, Brilho, Grade, Lettering, TextoMarca } from "../ui";

/** Fundo "luz": creme oficial + gravura de nuvens/raios da própria identidade (pág. 3 do PDF). */
const FundoLuz: React.FC<{ forca?: number }> = ({ forca = 0.55 }) => {
  const rel = useRel();
  return (
    <AbsoluteFill style={{ background: COR.creme }}>
      <AbsoluteFill style={{ opacity: forca, mixBlendMode: "multiply" }}>
        <CameraPlate
          src={IMG.paleta.src}
          size={IMG.paleta.size}
          keys={[
            { t: 0, x: 0.12, y: 0.15, zoom: 3.4 },
            { t: rel(170), x: 0.14, y: 0.17, zoom: 3.6 },
          ]}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 42%, ${COR.creme} 0%, rgba(255,245,236,0.6) 45%, transparent 80%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const Revelacao: React.FC = () => {
  const rel = useRel();
  const abs = useAbs();
  const { px } = useLayout();
  const T = rel(HIT.climax);
  const empurra = useProgress({ start: T, duration: 8, easing: "camera" });
  // em 136,5 o lettering abre espaço para o versículo (layout que ecoa a camisa)
  const lado = useProgress({
    start: rel(136.5),
    duration: 1.2,
    easing: "camera",
  });
  const v = txt("versiculo");
  const r = txt("referencia");
  const estrelas = interpolate(abs, [137.0, 137.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const saida = interpolate(abs, [144.05, 144.5], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: saida }}>
      <FundoLuz />
      <Particles
        count={40}
        angle={-80}
        speed={10}
        size={[2, 5]}
        opacity={[0.15, 0.55]}
        color={COR.ouro}
        blend="multiply"
        delay={T}
        fadeIn={1.5}
        seed="ouro-luz"
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            transform: `translateX(${px(-380 * lado)}px) scale(${(1 + 0.05 * empurra) * (1 - 0.24 * lado)})`,
            position: "relative",
          }}
        >
          <Shine at={T + 1.9} duration={1.8} intensity={1.7} width={0.25}>
            <MaskReveal
              at={T + 0.1}
              duration={1.5}
              direction="down"
              softness={0.35}
              blurFrom={10}
              easing="enterSoft"
            >
              <Lettering altura={660} />
            </MaskReveal>
          </Shine>
          <div
            style={{
              position: "absolute",
              left: px(-70),
              top: px(-20),
              opacity: estrelas,
              transform: `rotate(${abs * 6}deg)`,
            }}
          >
            <Asterisco size={px(110)} stroke={0.05} />
          </div>
        </div>
      </AbsoluteFill>
      {/* Atos 3:19 — texto oficial da camisa */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-start",
          paddingLeft: "52%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: px(34),
            maxWidth: px(640),
          }}
        >
          <TextoMarca
            texto={v.texto}
            de={v.inicio}
            by="word"
            align="left"
            size={27}
            tracking="0.3em"
            lineHeight={1.75}
            color={COR.preto}
            weight={700}
            stagger={0.105}
            maxWidth={640}
          />
          <div style={{ display: "flex", alignItems: "center", gap: px(22) }}>
            <div
              style={{
                opacity: interpolate(abs, [r.inicio, r.inicio + 0.5], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <Brilho size={px(64)} />
            </div>
            <TextoMarca
              texto={r.texto}
              de={r.inicio}
              align="left"
              size={34}
              tracking="0.08em"
              color={COR.preto}
            />
          </div>
        </div>
      </AbsoluteFill>
      <Flash at={[T]} decay={1.1} />
    </AbsoluteFill>
  );
};

export const Camisa: React.FC = () => {
  const rel = useRel();
  const abs = useAbs();
  const varre = interpolate(abs, [150.8, 152.3], [-0.3, 1.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: COR.preto }}>
      <CameraPlate
        src={IMG.camisas.src}
        size={IMG.camisas.size}
        keys={[
          { t: 0, x: 0.33, y: 0.27, zoom: 2.6 },
          { t: rel(147.0), x: 0.37, y: 0.47, zoom: 2.35 },
          { t: rel(149.3), x: 0.385, y: 0.55, zoom: 1.55 },
          { t: rel(151.2), x: 0.5, y: 0.5, zoom: 1.0 },
          { t: rel(152.5), x: 0.5, y: 0.5, zoom: 1.0 },
        ]}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(105deg, transparent ${varre * 100 - 14}%, rgba(255,235,200,0.32) ${varre * 100}%, transparent ${varre * 100 + 14}%)`,
          mixBlendMode: "screen",
        }}
      />
      <Particles
        count={36}
        angle={-90}
        speed={12}
        size={[1.5, 4]}
        opacity={[0.1, 0.5]}
        color={COR.luz}
        seed="camisa"
      />
      <Grade forca={0} escurecer={0.04} />
    </AbsoluteFill>
  );
};

export const Umadsal: React.FC = () => {
  const rel = useRel();
  const abs = useAbs();
  const { px } = useLayout();
  const T = rel(HIT.logo);
  const simbolo = interpolate(abs, [153.9, 154.4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const abre = useProgress({
    start: rel(154.7),
    duration: 1.3,
    easing: "camera",
  });
  const W = 1000; // largura do logotipo, px de design
  const [lw, lh] = IMG.logo.size;
  const fracSimbolo = 1100 / lw; // o símbolo ocupa os primeiros 1100 px do arquivo oficial
  const desloca = (W / 2 - (W * fracSimbolo) / 2) * (1 - abre);
  const ano = txt("ano");
  return (
    <AbsoluteFill style={{ background: COR.preto }}>
      <CameraPlate
        src={IMG.papel.src}
        size={IMG.papel.size}
        keys={[
          { t: 0, zoom: 1.6 },
          { t: 7, zoom: 1.7 },
        ]}
      />
      {/* a página oficial do símbolo (pág. 4) acende e a câmera se aproxima */}
      <AbsoluteFill style={{ opacity: simbolo }}>
        <CameraPlate
          src={IMG.papelSimbolo.src}
          size={IMG.papelSimbolo.size}
          keys={[
            { t: T, x: 0.5, y: 0.5, zoom: 1.05, brightness: 0 },
            { t: T + 0.25, brightness: 1.25 },
            { t: T + 0.9, brightness: 1.0 },
            { t: rel(154.3), x: 0.5, y: 0.5, zoom: 2.25 },
          ]}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: 1 - simbolo,
        }}
      >
        <div style={{ transform: `translateX(${px(desloca)}px)` }}>
          <Shine at={rel(156.1)} duration={1.5} intensity={1.6}>
            <div
              style={{
                clipPath: `inset(0 ${(1 - fracSimbolo) * (1 - abre) * 100}% 0 0)`,
              }}
            >
              <Img
                src={IMG.logo.src}
                style={{
                  width: px(W),
                  height: px((W * lh) / lw),
                  display: "block",
                }}
              />
            </div>
          </Shine>
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `translateY(${px(250)}px)`,
        }}
      >
        <TextoMarca
          texto={ano.texto}
          de={ano.inicio}
          size={46}
          tracking="0.75em"
          stagger={0.09}
        />
      </AbsoluteFill>
      <LightRays
        origin={[0.5, 0.5]}
        spread={360}
        rays={20}
        reach={0.55}
        intensity={0.16}
        color={COR.luz}
        delay={T}
        fadeIn={0.4}
        spin={2}
        seed="logo"
      />
      <Flash at={[T]} decay={0.7} peak={0.8} />
    </AbsoluteFill>
  );
};

export const Assinatura: React.FC = () => {
  const rel = useRel();
  const { px } = useLayout();
  const t = txt("assinatura");
  return (
    <AbsoluteFill>
      <FundoLuz forca={0.45} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ transform: `translateY(${px(-60)}px)` }}>
          <MaskReveal
            at={rel(159.0)}
            duration={1.4}
            direction="down"
            softness={0.35}
            blurFrom={8}
            easing="enterSoft"
          >
            <Lettering altura={470} />
          </MaskReveal>
        </div>
        <div style={{ marginTop: px(40) }}>
          <TextoMarca
            texto={t.texto}
            de={t.inicio}
            size={26}
            tracking="0.38em"
            color={COR.preto}
            weight={700}
            stagger={0.025}
          />
        </div>
        <div style={{ marginTop: px(26) }}>
          <TextoMarca
            texto="UMADSAL · 2027"
            de={163.0}
            size={18}
            tracking="0.6em"
            color={COR.vinho}
            weight={700}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
