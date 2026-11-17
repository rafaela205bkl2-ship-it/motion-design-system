# Biblioteca de motion (`src/motion`)

Biblioteca de motion design construída a partir dos padrões **recorrentes** das duas referências
([análise](referencias/analise-referencias.md)). Tudo é importado de um único ponto:

```tsx
import {MotionProvider, TextReveal, TextSwap, ObjectEnter, radialReveal, blurDissolve, motionTiming, Layer, Backdrop} from './motion';
```

![Demonstração](demo/demo-9x16-folha.png)

Demonstração renderizada: [`docs/demo/demo-9x16.mp4`](demo/demo-9x16.mp4) (1080×1920, 30 fps, 20,6 s, com trilha).
No Studio: **Biblioteca-Motion › Demo-9x16**.

## Princípios

1. **Tempo em segundos, espaço em pixels de design.** Durações viram quadros no uso (funcionam em qualquer fps). Distâncias e desfoques usam a base de 1080 px no lado menor, convertida por `px()`, então a mesma animação tem o mesmo peso em 9:16, 16:9 e 1:1.
2. **Tokens com origem medida.** Cada valor padrão vem de uma medição das referências (tabela abaixo).
3. **Tudo configurável por instância.** Duração, intensidade, direção, escala e velocidade podem ser trocadas em cada componente sem mexer nos tokens.
4. **Temas trocam valores, não comportamento.** Base, calmo e vibrante usam as mesmas peças.

## Arquitetura

```
src/motion/
  tokens.ts            durações, escalonamento, desfoque, distâncias, sobra
  easing.ts            curvas nomeadas + mola com sobra controlada
  themes.ts            base, calmo, vibrante (paleta, fontes, perfil de movimento)
  MotionProvider.tsx   contexto de tema + useMotion() + useProgress()
  text/                TextReveal, TextSwap
  object/              ObjectEnter
  transitions/         radialReveal, blurDissolve, motionTiming
  layers/              Layer, Backdrop, KineticType, ColorBloom
  index.ts             ponto único de importação
src/demo/              demonstração (objetos originais, cenas, timeline.json)
scripts/gerar-trilha.py  trilha sintetizada a partir da timeline
```

## Tokens

| Token | Valor (30 fps) | Origem na análise |
| --- | --- | --- |
| `duration.micro` | 3 q (0,10 s) | saídas em desfoque de 2–4 q |
| `duration.fast` | 5 q (0,17 s) | radial final de B (5 q) |
| `duration.swap` | 6 q (0,20 s) | trocas de texto (~6 q) |
| `duration.base` | 7 q (0,23 s) | radial de A (7 q) |
| `duration.dissolve` | 9 q (0,30 s) | dissolves com desfoque |
| `duration.reveal` | 10 q (0,33 s) | revelação de texto (8–12 q) |
| `duration.enter` | 16 q (0,53 s) | queda e barras (16 q) |
| `duration.hold` / `scene` / `outro` | 1 s / 2,5 s / 4 s | ~1 evento/s; cenas de 2–4 s; finais de 3,4–4,7 s |
| `overshoot.*` | 0 / 2% / 4% / 6,5% | sobra ≤ 7% medida |

### Curvas (`easings`)

| Nome | Curva | Uso |
| --- | --- | --- |
| `enter` | easeOutCubic | entradas |
| `enterSoft` | easeOutQuad | entradas suaves (revelação de "Agora" em A) |
| `enterStrong` | easeOutExpo | títulos grandes |
| `exit` | easeInCubic | saídas |
| `wipe` | easeInQuad | transição que acelera até cobrir (radial de B) |
| `wipeSmooth` | easeInOutSine | transição que acelera e desacelera (radial de A) |
| `land` | quase linear + desaceleração final | queda (produto em B) |
| `camera` | easeInOutCubic | camadas e câmera |

A **mola com sobra controlada** (`overshootProgress`) encontra por busca binária o amortecimento que produz exatamente a sobra pedida. Por exemplo, 5,6% corresponde a damping 14, stiffness 180 e mass 0,6.

## Temas

| | Base | Calmo | Vibrante |
| --- | --- | --- | --- |
| Origem | traços recorrentes | particularidades de A | particularidades de B |
| Paleta | off-white, tinta escura, cobalto + coral | monocromático azul-petróleo | multicolor saturado (tomate, amarelo, verde-água, cobalto, rosa) |
| Fonte de título | Plus Jakarta Sans 800 | Manrope 800 | Bricolage Grotesque 800 |
| Velocidade | 1,0 | 0,82 (mais lento) | 1,15 (mais rápido) |
| Intensidade (desfoque/distância) | 1,0 | 0,8 | 1,2 |
| Sobra padrão | 4% | 1,5% | 6,5% |
| Pausas | 1,0× | 1,3× | 0,85× |

```tsx
<MotionProvider theme="vibrante" speed={1.1} intensity={0.9}>…</MotionProvider>
```

Os provedores podem ser aninhados: cada cena pode ter o próprio tema.

## Componentes

### `TextReveal`

Revelação por letra ou palavra, com opacidade, desfoque, deslocamento e escala, mais saída opcional em desfoque.

```tsx
<TextReveal
  text="Seu *título* aqui"   // *palavras* em destaque, \n quebra linha
  by="char"                  // 'char' | 'word'
  direction="start"          // 'start' | 'end' | 'center' | 'edges' | 'random'
  delay={0.4}                // s
  duration="reveal"          // token ou segundos, por unidade
  stagger="char"             // token ou segundos
  easing="enterStrong"
  from={{y: 38, blur: 18, scale: 1, x: 0, rotate: 0}}  // px de design
  intensity={1.2} speed={0.9}
  exitAt={2.5} exitBy="unit" exitDirection="end" exitTo={{y: -18, blur: 16}}
  size={140} font="display" color="#111" highlightColor="#36f" align="center" maxWidth={900}
/>
```

`getRevealDuration(unidades, duraçãoUnidade, escalonamento)` calcula o tempo total, útil para encadear eventos.

### `TextSwap`

Troca de textos no mesmo lugar. O texto atual sai em desfoque e o próximo só nasce quando a saída termina, para que nunca haja dois textos legíveis ao mesmo tempo. Todos ocupam a mesma célula de grade, então o bloco não "pula" de tamanho.

```tsx
<TextSwap items={[{text: 'Revele.', at: 0.4}, {text: 'Troque.', at: 1.45}]} by="char" size={150} overlap={0.15} />
```

Aceita todas as props de `TextReveal`, exceto `text`, `delay` e `exitAt`.

### `ObjectEnter`

Entrada de objeto com peso.

| `motion` | Comportamento |
| --- | --- |
| `fall` | velocidade quase constante, pouso desacelerado e **achatamento amortecido** no impacto (`impact`) |
| `pop` | cresce do centro com sobra controlada (`overshoot`) |
| `glide` | desliza com desaceleração forte |
| `rise` | sobe suave, sem sobra |

Props: `from` (`top`, `bottom`, `left`, `right`, `none`), `distance`, `delay`, `duration`, `easing`, `scaleFrom`, `rotateFrom`/`rotate`, `stretch` (esticamento proporcional à velocidade, que simula desfoque de movimento no eixo da tela), `blurFrom`, `float`/`floatPeriod` (flutuação em repouso), `exitAt`/`exitTo`, `intensity` e `speed`.

### Transições

```tsx
<TransitionSeries.Transition
  presentation={radialReveal({origin: [0.5, 0.6], ringColor: '#FFC531', ringWidth: 30, softness: 4, zoom: 0.05})}
  timing={motionTiming({fps, duration: 'fast', easing: 'wipe'})}
/>
<TransitionSeries.Transition
  presentation={blurDissolve({blur: 30, scale: 0.05, through: '#FFFFFF'})}
  timing={motionTiming({fps, duration: 'dissolve', easing: 'wipeSmooth'})}
/>
```

- `radialReveal`: círculo a partir de um ponto, com borda suave, anel opcional correndo à frente, zoom de entrada e leve recuo da cena que sai.
- `blurDissolve`: a cena que sai desfoca e cresce, a que entra nasce desfocada. Com `through`, passa por uma cor (o fade para branco das referências).
- `transitionFrames(fps, token)`: quadros da transição, para calcular a duração total.

### Camadas

| Componente | Função |
| --- | --- |
| `Layer` | plano de profundidade: `depth` 0 (foco) a 1 (fundo) controla desfoque, deriva com paralaxe e empilhamento |
| `Backdrop` | fundo: cor, brilhos radiais em movimento lento, vinheta e granulação procedural |
| `KineticType` | padrão tipográfico em fileiras alternadas (vazado nas ímpares) |
| `ColorBloom` | ciclo de cores dentro da cena, por expansões radiais |

```tsx
<AbsoluteFill>
  <Backdrop glows={[{x: 0.5, y: 0.6, size: 1300, color: '#BFDCE8'}]} grain={0.1} />
  <Layer depth={0.85} drift={34}>…fundo…</Layer>
  <Layer depth={0.4} drift={26}>…meio…</Layer>
  <Layer depth={0}>…foco…</Layer>
</AbsoluteFill>
```

## Demonstração e trilha

- **Linha do tempo única:** `src/demo/timeline.json` define cenas, transições e marcações. As cenas leem os tempos por `cue('energia', 'capsule')`, e `scripts/gerar-trilha.py` lê o mesmo arquivo para posicionar os efeitos sonoros.
- **Sincronia nos pontos de acento:** a grade musical (120 BPM) é ancorada no pouso da cápsula. Pops, pousos, ciclos de cor e o impacto da marca caem a ±4 ms das batidas, enquanto whooshes e brilhos ficam fora da grade de propósito. As referências não mostraram sincronia sistemática, então a sincronia ficou restrita aos acentos.
- **Trilha original:** tudo sintetizado no script (pad, baixo, bateria e efeitos), sem amostras de terceiros, normalizado para cerca de −14 LUFS.
- **Elementos originais:** a marca "ondula", as formas (esfera, cápsula, anel, cartão) e os textos são criados aqui. Nada das marcas das referências é reproduzido.

Para regenerar a trilha depois de mudar a linha do tempo:

```bash
python3 scripts/gerar-trilha.py
```

## Verificação feita

- `tsc` e `eslint` sem erros.
- Três renders completos, avaliados em folhas de contato e quadros de transição. Problemas corrigidos:
  - textos quebrando linha por falta de largura;
  - troca de texto com dois textos legíveis ao mesmo tempo;
  - objeto escondendo o título;
  - queda curta demais (a mola chegava ao alvo em 7 quadros);
  - efeito sonoro de pouso 100 ms fora do bumbo.
- Sincronia confirmada no arquivo final, por detecção de ataques no áudio.

## Limitações conhecidas

- **Formatos:** 16:9 e 1:1 funcionam como prévia (*Demo-16x9-previa*, *Demo-1x1-previa*). Em "Energia", o espaço entre título e cápsula é uma fração da altura, então nos formatos baixos a cápsula cobre mais o título. O ajuste fino desses formatos é o próximo passo.
- **Tempo de render:** ~330 s para 20 s de vídeo neste ambiente (4 CPUs, sem GPU), por causa dos filtros de desfoque e da granulação. Use `--concurrency` adequado à máquina e, se precisar, `grain={0}`.
- **Edição no Studio:** os componentes são React tipado, com props editáveis no código. Ainda não estão registrados como `Interactive` para edição visual no Studio.
