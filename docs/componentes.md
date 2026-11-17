# Componentes

Todos os componentes vêm de `src/lib` e são importados por um único ponto:

```tsx
import {Title, Paragraph, Pill, Counter, FeatureCard, CtaButton, SafeArea, Stack, Grid} from './lib';
```

Tamanhos são sempre **pixels de design** (tela com lado menor de 1080px). O componente converte para o tamanho real com `px()`.

## Layout (não aparecem na timeline do Studio)

### `SafeArea`
Preenche a tela respeitando a área segura do formato.

| Prop | Tipo | Padrão |
| --- | --- | --- |
| `align` | `Align` ou `PerFormat<Align>` | `'center'` |
| `justify` | `Align` ou `PerFormat<Align>` | `'center'` |

### `Stack`
Flexbox que muda de direção por formato.

| Prop | Tipo | Padrão |
| --- | --- | --- |
| `direction` | `PerFormat<'row' \| 'column' \| 'row-reverse' \| 'column-reverse'>` | coluna no 9:16 e 1:1, linha no 16:9 |
| `gap` | `number` ou `PerFormat<number>` | `40` |
| `align`, `justify` | valor único ou `PerFormat` | `'center'` |
| `textAlign` | `'left' \| 'center'` ou `PerFormat` | `'center'` |

### `Grid`
| Prop | Tipo | Padrão |
| --- | --- | --- |
| `columns` | `PerFormat<number>` | `{vertical: 1, horizontal: 3, square: 1}` |
| `gap` | `number` | `32` |

## Texto

Todos aceitam `delay` (segundos), `preset` (veja [presets.md](presets.md)) e `style`. São editáveis no Studio.

### `Title`
Entrada palavra por palavra. Palavras entre `*asteriscos*` ganham a cor de destaque, inclusive em sequência (`*em movimento*`).

| Prop | Padrão |
| --- | --- |
| `children` (texto) | — |
| `size` | `110` |
| `color` / `highlight` | `theme.text` / `theme.accent2` |
| `stagger` (s entre palavras) | `0.07` |
| `preset` | `'fade-up'` |

### `Paragraph`
| Prop | Padrão |
| --- | --- |
| `size` | `46` |
| `maxWidth` | `900` |
| `color` | `theme.muted` |

### `Pill`
Etiqueta curta acima do título. `size` padrão `30`, `preset` padrão `'pop'`.

## Dados e ação

### `Counter`
Conta de 0 até `value` em 1,6 s, com formatação pt-BR.

| Prop | Padrão |
| --- | --- |
| `value` | — |
| `decimals` | `0` |
| `prefix` / `suffix` | `''` |
| `label` | — |
| `size` | `150` |

### `FeatureCard`
Ícone em cima no 16:9 (cartões lado a lado) e à esquerda no 9:16 e 1:1 (cartões empilhados).

| Prop | Padrão |
| --- | --- |
| `icon` (emoji) | — |
| `title` / `description` | — |
| `size` (escala) | `1` |
| `accent` | `theme.accent` |

### `CtaButton`
Botão com pulso suave depois da entrada. `size` padrão `52`, `pulse` padrão `true`, `preset` padrão `'pop'`.

## Decoração

- `GlowBackground` — manchas de luz em movimento, posicionadas em porcentagem.
- `Orb` — anéis concêntricos girando; `size` (padrão `520`) e `delay`.

## Cenas (`src/scenes`)

Cenas prontas, criadas com `Interactive.create({layout: 'absolute-fill'})`, cada uma registrada também sozinha na pasta **Cenas** do Studio.

| Cena | 9:16 | 16:9 | 1:1 |
| --- | --- | --- | --- |
| `IntroScene` | orbe em cima, texto centralizado | texto à esquerda, orbe à direita | orbe menor em cima |
| `FeaturesScene` | cartões empilhados | 3 colunas | empilhados e compactos |
| `StatsScene` | números empilhados | números lado a lado | lado a lado, menores |
| `OutroScene` | título, botão e perfil centralizados | igual | igual |
