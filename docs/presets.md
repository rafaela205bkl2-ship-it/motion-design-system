# Presets

## Presets de entrada (`useEntrance`)

Definidos em `src/lib/animations.ts`. Todos usam segundos (funcionam em qualquer fps) e distâncias em pixels de design (o movimento tem o mesmo peso em qualquer formato).

| Preset | Efeito |
| --- | --- |
| `fade` | Só opacidade |
| `fade-up` | Sobe 60 px enquanto aparece (padrão) |
| `fade-down` | Desce 60 px enquanto aparece |
| `slide-left` | Entra pela direita (120 px) |
| `slide-right` | Entra pela esquerda (120 px) |
| `scale` | Cresce de 85% para 100% |
| `pop` | Mola com leve exagero (`spring`, damping 11) |
| `blur` | Desfoque de 24 px para nítido, com leve zoom |

Curva padrão: `Easing.bezier(0.16, 1, 0.3, 1)` (ease-out expo). Duração padrão: 0,8 s.

```tsx
const style = useEntrance({preset: 'blur', delay: 0.4, duration: 1, distance: 80});
return <div style={style}>Olá</div>;
```

Para ver todos lado a lado, abra a composição **Exemplos › Presets-9x16** no Studio.

### Adicionar um preset

1. Inclua o nome no tipo `EntrancePreset` e na lista `ENTRANCE_PRESETS`.
2. Adicione um `case` em `useEntrance`. Use `px()` para qualquer distância.

O preset aparece sozinho no seletor do Studio e no catálogo de exemplos.

## Presets de formato (`FORMATS`)

| Nome | Resolução | Uso |
| --- | --- | --- |
| `vertical` | 1080×1920 (9:16) | Reels, TikTok, Shorts — **formato principal** |
| `horizontal` | 1920×1080 (16:9) | YouTube, apresentações |
| `square` | 1080×1080 (1:1) | Feed |

Detecção por proporção (`largura / altura`): abaixo de 0,9 é `vertical`, acima de 1,1 é `horizontal`, entre os dois é `square`.

## Áreas seguras (pixels de design)

| Formato | Laterais | Topo | Base |
| --- | --- | --- | --- |
| vertical | 80 | 200 | 280 |
| horizontal | 140 | 100 | 100 |
| square | 90 | 90 | 90 |

No 9:16, topo e base maiores evitam a interface dos apps (nome do perfil, legenda, botões).

## Tema (`src/lib/theme.ts`)

| Token | Valor |
| --- | --- |
| `background` | `#0B0B1A` |
| `accent` | `#7C5CFF` |
| `accent2` | `#22D3EE` |
| `text` | `#FFFFFF` |
| `muted` | `#A9ACC9` |
| Fonte | Inter (400, 600, 800) via `@remotion/google-fonts` |
