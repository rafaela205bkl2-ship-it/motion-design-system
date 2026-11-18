# Master Style Guide — identidade audiovisual

Regras da identidade audiovisual deste sistema. Elas valem para toda produção feita com a biblioteca (`src/motion`).

- **Evidência:** cada regra vem das referências (`reference-library/`, `docs/referencias/analise-referencias.md`) ou do que foi testado na demonstração.
- **Implementação:** está em [docs/biblioteca-motion.md](docs/biblioteca-motion.md).
- **Processo:** está em [PRODUCTION_WORKFLOW.md](PRODUCTION_WORKFLOW.md).

> **Hierarquia:** este guia define *o que* fazer, os tokens e componentes definem *como*.
> Quando uma regra daqui conflitar com um valor no código, o código está desatualizado: corrija o código ou proponha mudar a regra com evidência nova.

---

## 1. Princípios

1. **Continuidade.** As cenas se ligam por transições ou pela transformação de um elemento. O corte seco é exceção: no máximo um por peça, e só com intenção.
2. **Revelar, não aparecer.** Texto e objetos entram com opacidade e desfoque, nunca "piscam" na tela.
3. **Pouco por quadro.** Uma ideia principal por cena, composição centralizada e espaço vazio generoso.
4. **Ritmo legível.** Cerca de um evento visual por segundo, pausas para leitura e um final parado.
5. **Peso físico contido.** Objetos têm peso (pousam, achatam), mas a sobra fica em no máximo 7%. Nada de molas elásticas exageradas.
6. **Padrões, não cópias.** Referências ensinam movimento e ritmo. Marcas, logotipos, produtos e trilhas de terceiros nunca são reproduzidos.

## 2. Tempo

Os valores estão em quadros a 30 fps. No código são definidos em segundos (`duration.*`) e funcionam em qualquer fps.

| Uso | Token | Valor | Regra |
| --- | --- | --- | --- |
| Saída de texto/objeto | `micro` | 3 q | saídas sempre mais curtas que entradas |
| Transição de tela rápida | `fast` | 5 q | radiais "decididos" |
| Troca de texto | `swap` | 6 q | o novo texto só nasce quando o antigo já se desfez |
| Transição de tela padrão | `base` | 7 q | radial suave |
| Dissolve entre cenas | `dissolve` | 9 q | com desfoque; "fade para branco" entre mudanças de tema |
| Revelação por unidade (letra/palavra) | `reveal` | 10 q | com escalonamento de 0,03 s (letra) ou 0,075 s (palavra) |
| Entrada de objeto | `enter` | 16 q | queda e crescimento |
| Pausa mínima de leitura | `hold` | 1 s | depois que o texto termina de entrar |
| Duração de cena | `scene` | 2,5 s (2–4 s) | calmo: 3–4 s; vibrante: 1,5–2,5 s |
| Encerramento parado | `outro` | 4 s (3–5 s) | sem novidades visuais |

**Tempo de leitura:** um texto precisa ficar totalmente visível por pelo menos `0,3 s + 0,06 s × número de palavras` antes de sair.

## 3. Curvas (easing)

| Movimento | Curva | Nome no código |
| --- | --- | --- |
| Entrada de texto e elementos | easeOutCubic | `enter` |
| Título grande, chegada decidida | easeOutExpo | `enterStrong` |
| Entrada suave (tema calmo) | easeOutQuad | `enterSoft` |
| Saída | easeInCubic | `exit` |
| Transição que cobre a tela (radial rápido) | easeInQuad — acelera até cobrir | `wipe` |
| Transição suave (radial suave, dissolve) | easeInOutSine | `wipeSmooth` |
| Queda | quase linear, desacelera no fim | `land` |
| Câmera e camadas | easeInOutCubic | `camera` |
| "Pop" | mola com sobra de 2–6,5% (pelo tema) | `overshootProgress` |

**Nunca:** `linear` em entradas visíveis, molas com sobra acima de 7% ou easing de entrada (`ease-in`) para algo que aparece.

## 4. Tipografia

| Papel | Tamanho mínimo (px de design, base 1080) | Peso | Regra |
| --- | --- | --- | --- |
| Título principal | 120 (9:16) · 104 (1:1) · 120 (16:9) | 800 | até 48 caracteres no 9:16; no máximo 2 linhas |
| Texto de apoio | 52–66 | 500–700 | uma frase |
| Rótulo (sobretítulo) | 30–34, caixa alta, espaçamento 0,22–0,3 em | 700 | até 4 palavras |
| Créditos/legendas | 36 | 500 | — |

- **Hierarquia:** título grande + linha secundária pequena. Frases curtas terminadas em ponto ("Comece hoje.").
- **Destaque:** palavras-chave entre `*asteriscos*` na cor `highlight` do tema (cobalto no base, petróleo no calmo, branco no vibrante). No máximo uma expressão por título.
- **Contraste:** texto sobre o fundo precisa de pelo menos 3:1. Acentos que não chegam a isso (coral, petróleo claro, açafrão sobre a labareda) ficam para formas, anéis e superfícies.
- **Fontes por tema:** Plus Jakarta Sans (base), Manrope (calmo) e Bricolage Grotesque (vibrante), com espaçamento negativo nos títulos (−0,03 a −0,04 em).

## 5. Composição

- **Área segura**, em px de design (`useLayout().safe`): 9:16 tem laterais de 80, topo de 200 e base de 280; 16:9 tem laterais de 140 e topo/base de 100; 1:1 tem 90 em todos os lados.
- **Centralizada** por padrão. No 16:9, com imagem ou objeto, use a divisão texto | visual lado a lado.
- **Camadas:** fundo (`Backdrop`) → padrão ou ciclo de cor → profundidade (`Layer depth 0.4–0.85`, desfocada) → foco (`depth 0`).
- **Texto atrás do objeto:** permitido (traço vibrante), desde que pelo menos ~60% de cada letra continue visível.
- **Fundo nunca liso:** use brilho radial suave + granulação leve (`grain 0.1–0.14`).
- **No máximo 3 objetos principais** por cena.

## 6. Estilos

| | **Base** | **Calmo** | **Vibrante** | **Misto** |
| --- | --- | --- | --- | --- |
| Quando usar | institucional, neutro, abertura e encerramento | produto digital, interface, explicação, tom sereno | produto físico, lançamento, energia, público jovem | peças que alternam explicação e impacto |
| Paleta | off-white, tinta escura, cobalto + coral | monocromático azul-petróleo | multicolor saturado | paleta do calmo com ritmo intermediário (`blendThemes`) |
| Ritmo | velocidade 1,0 | 0,82 (mais lento), pausas 1,3× | 1,15 (mais rápido), pausas 0,85× | 0,99 (interpolado) |
| Transições típicas | dissolve, radial-suave | dissolve, fade-branco | radial-rapido, `ColorBloom` | radial-suave entre blocos |
| Objetos | pop sutil (4%) | subida (`rise`), sobra 1,5% | queda com achatamento, pop 6,5% | conforme a cena |
| Fundo | brilho cobalto suave | brilho azul-claro, profundidade | cor chapada + `KineticType` | conforme a cena |

**Como escolher:**

- **Um estilo para a peça inteira:** no cabeçalho do roteiro, `estilo: calmo`.
- **Estilos diferentes por cena:** na cena, `estilo: vibrante`. Ao mudar de tema entre cenas, use `fade-branco` ou um `radial` com a cor de destaque da próxima cena.
- **Combinação real** (paleta de um, ritmo do outro): no roteiro, `estilo: misto`; no código, `blendThemes("calmo", "vibrante", { motion: 0.5, palette: 0 })`.
- **Marca própria:** `createTheme("calmo", { palette: { accent: "#..." }, fonts: { display: "..." } })`.

## 7. Transições: quando usar cada uma

| Situação | Transição |
| --- | --- |
| Mesmo tema, mudança de assunto | `dissolve` |
| Mudança de tema ou de bloco | `fade-branco` ou `radial-suave` |
| Acento, energia, troca de cor | `radial-rapido`, com a origem no objeto principal e anel na cor da próxima cena |
| Troca de cor dentro da mesma cena | `ColorBloom` (não troque de cena só para mudar a cor) |
| Corte seco | no máximo um por peça, com intenção |

## 8. Abertura e encerramento

- **Abertura:** o elemento principal entra nos primeiros 0,5 s e o título até 1 s.
- **Encerramento em duas etapas:** marca ou logotipo (com acento sonoro), depois um cartão em cor sólida com assinatura ou CTA, parado por 3–5 s.

## 9. Áudio

- **Loudness de entrega:** −14 LUFS integrado, pico abaixo de −1 dBTP.
- **Sincronia:** só nos pontos de acento (pouso de objeto, pop, ciclo de cor, entrada do logotipo), em cima da batida (±1 quadro). Não sincronize tudo, porque as referências não fazem isso.
- **Efeitos de transição:** whooshes centrados no meio da transição. Ficam fora da grade de propósito, por serem texturas.
- **Final:** a música termina depois que o cartão final se estabiliza, com fade de 1,5 s.

## 10. Formatos

- **Primário:** 9:16 (1080×1920). Também suportados: 16:9 (1920×1080) e 1:1 (1080×1080).
- **Medidas:** sempre em px de design via `px()`, com valores por formato via `pick()`. Nunca use pixels fixos.
- **Limitações atuais:** veja PRODUCTION_WORKFLOW.md §8.

## 11. Proibido

- Reproduzir marcas, logotipos, mascotes, produtos, textos ou trilhas das referências.
- Pixels fixos em vez de `px()`.
- CSS `transition` / `animation` (não renderiza corretamente no Remotion; use `interpolate`/`useProgress`).
- Dois textos legíveis ao mesmo tempo no mesmo lugar.
- Texto principal com mais de 2 linhas no 9:16.
- Recriar algo que já existe na biblioteca (consulte `npm run catalogo` antes).
