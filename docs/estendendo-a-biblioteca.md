# Estendendo a biblioteca

Como adicionar componentes, presets, animações, transições e temas a `src/motion`
sem quebrar o que já existe, e garantindo que a próxima produção encontre o recurso.

## Antes de criar: o recurso já existe?

```bash
npm run catalogo -- <termo>
```

Exemplos de termo: `texto`, `queda`, `radial`, `fundo`.

Muita coisa se resolve com o que já existe:

| Quero… | Use |
| --- | --- |
| uma entrada de texto diferente | `TextReveal` com outras props `from`, `direction`, `easing`, `by`, ou um **preset novo** |
| um objeto que entra de outro jeito | `ObjectEnter` com `motion`, `from`, `distance`, `rotateFrom`, `overshoot`, `impact` |
| uma transição com outra cara | `radialReveal` / `blurDissolve` com outras props, ou um **preset de transição** |
| outra paleta ou ritmo | `createTheme` / `blendThemes` |

Crie algo novo só quando o padrão **não puder** ser expresso com as props existentes.
Se possível, o padrão deve ter sido **observado numa referência** (`reference-library/`).

## Regras para qualquer código da biblioteca

1. **Tempo em segundos, espaço em px de design.** Use `useMotion()`: `m.dur()`, `m.stag()`, `m.blur()`, `m.dist()`, `m.px()`. Nunca use pixels fixos nem quadros fixos.
2. **Respeite o tema:** velocidade e intensidade vêm de `useMotion()`, e cores de `m.palette`.
3. **Valores padrão vêm dos tokens** (`tokens.ts`). Um número mágico novo vira token ou ganha um comentário dizendo de onde veio.
4. **Tudo configurável:** ofereça pelo menos `delay`, `duration`, `easing`, `intensity` e `speed`, e direção ou escala quando fizer sentido.
5. **Nada de CSS `transition`/`animation`.** Anime com `progressAt`/`useProgress`/`interpolate`.
6. **Nada de `background-image` com URL.** O lint do Remotion barra, porque a imagem pode não estar carregada na renderização. Use gradientes, SVG inline ou `<Img>`.
7. **Comentário de cabeçalho** explicando o quê, o porquê e a origem (referência/medição).
8. **Use `useCurrentFrame()` só onde precisa**, para evitar re-renderizar árvores grandes a cada quadro.

## Adicionar um componente

Exemplo: um contador com dígitos rolando, candidato observado em ref-001.

1. **Crie o arquivo** na pasta da categoria: `src/motion/text/`, `object/`, `layers/` ou `transitions/`. Se for uma categoria nova, crie a pasta.
   ```tsx
   // src/motion/text/RollingNumber.tsx
   /** Número que rola até o valor final (observado em ref-001, 23,0–25,3 s). */
   import React from "react";
   import { useCurrentFrame } from "remotion";
   import type { EasingInput } from "../easing";
   import { progressAt, useMotion, type TimeValue } from "../MotionProvider";

   export type RollingNumberProps = {
     readonly value: number;
     readonly delay?: number;
     readonly duration?: TimeValue;
     readonly easing?: EasingInput;
     readonly size?: number;
     readonly speed?: number;
   };

   export const RollingNumber: React.FC<RollingNumberProps> = ({ value, delay = 0, duration = 1.6, easing = "enter", size = 140, speed = 1 }) => {
     const frame = useCurrentFrame();
     const m = useMotion();
     const p = progressAt(frame, m.fps, delay, m.dur(duration, speed), easing);
     return <div style={{ fontFamily: m.theme.fonts.display, fontSize: m.px(size), color: m.palette.ink }}>{Math.round(value * p)}</div>;
   };
   ```
2. **Exporte** em `src/motion/index.ts`: o componente e o tipo das props.
3. **Registre no catálogo** (`src/motion/catalog.ts`), com nome, categoria, arquivo, descrição, props e exemplo.
4. **Valide:**
   ```bash
   npm run validar
   ```
   A validação falha se o export não estiver no catálogo, ou o contrário.
5. **Teste nos três formatos:** crie uma composição temporária, ou use a produção de teste, e renderize quadros:
   ```bash
   npx remotion still <id> out/q.png --frame=30
   ```
   Verifique em 9:16, 16:9 e 1:1.
6. **Documente** em `docs/biblioteca-motion.md`, na seção de componentes, e na ficha da referência de origem, mudando "candidato" para "implementado".

## Adicionar um preset

Presets são objetos de props com nome, em `src/motion/presets.ts`.

```ts
export const textPresets = {
  // …
  /** Revelação lenta palavra por palavra, para citações. */
  citacao: { by: "word", easing: "enterSoft", speed: 0.7, from: { y: 12, blur: 10 } },
} satisfies Record<string, TextPreset>;
```

- O `satisfies` garante que as props são válidas para o componente.
- Não é preciso mexer no catálogo: a entrada `textPresets` já lista os nomes. Atualize só a descrição dela.
- **Preset de transição:** acrescente o nome em `TRANSITION_PRESETS` e um `case` em `transitionPreset()`. Ele passa a ser aceito no roteiro (`transição: novo-nome`). Atualize também `TRANSICOES` em `scripts/nova-producao.mjs` e a tabela `FRAMES_TRANSICAO` em `src/producoes/_runtime/ProducaoGenerica.tsx`.

## Adicionar uma animação de entrada a `TextReveal` ou `ObjectEnter`

- **Variação de estado inicial** (deslocamento, escala, rotação, desfoque): não precisa de código, basta um preset com `from`.
- **Nova ordem de revelação:** acrescente o nome a `RevealDirection` e um `case` em `makeOrder()` (`TextReveal.tsx`).
- **Novo tipo de movimento de objeto:** acrescente-o a `ObjectMotion` e trate-o em `progress()` (`ObjectEnter.tsx`). Documente a curva usada.

## Adicionar uma transição

1. Crie `src/motion/transitions/minhaTransicao.tsx` no padrão de `radialReveal.tsx`: um componente `TransitionPresentationComponentProps<Props>` e uma função fábrica.
2. Trate as duas direções (`entering` e `exiting`) e use `useVideoConfig()` para converter px de design.
3. Exporte, registre no catálogo e, se quiser usá-la no roteiro, crie um preset de transição (veja acima).

## Adicionar ou ajustar um token

- Edite `src/motion/tokens.ts` e explique a origem no comentário.
- Mudar um valor existente afeta **todas** as produções. Registre o motivo no commit e atualize a tabela de tokens em `docs/biblioteca-motion.md` e no `MASTER_STYLE_GUIDE.md`.

## Adicionar um tema

```ts
// src/motion/themes.ts
export const meuTema: Theme = createTheme("base", {
  name: "base",
  palette: { accent: "#0FA3B1", glow: "#BDEFF3" },
  motion: { speed: 0.95 },
});
```

Para que o tema também seja aceito no roteiro (`estilo:`):

1. Acrescente o nome ao tipo `Theme["name"]` e ao mapa `themes`.
2. Atualize `ESTILOS` em `scripts/nova-producao.mjs` e `temaDoEstilo()` em `ProducaoGenerica.tsx`.
3. Documente no `MASTER_STYLE_GUIDE.md` §6.

## Antes do commit

```bash
npm run validar
```

O comando roda `eslint`, `tsc` e a validação do catálogo.

```bash
npx prettier --write src/motion
```
