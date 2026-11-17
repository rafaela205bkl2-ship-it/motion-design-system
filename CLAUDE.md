# Instruções para sessões de IA neste repositório

Este repositório é um sistema de motion design em Remotion com uma **biblioteca pronta** (`src/motion`).
Ao trabalhar aqui:

## Consulte antes de criar

1. **Liste o que existe** antes de escrever qualquer animação, transição, tema ou cena:
   ```bash
   npm run catalogo
   ```
   Para filtrar, acrescente um termo, como `npm run catalogo -- transição`. A fonte é `src/motion/catalog.ts`.
2. **Importe de `src/motion`** (ponto único: `src/motion/index.ts`). **Não reconstrua** componentes que já existem: `TextReveal`, `TextSwap`, `ObjectEnter`, `radialReveal`, `blurDissolve`, `Layer`, `Backdrop`, `KineticType`, `ColorBloom`, presets e temas.
3. **Siga o `MASTER_STYLE_GUIDE.md`** (regras da identidade) e o **`PRODUCTION_WORKFLOW.md`** (processo).
4. **Para uma produção nova**, use `npm run nova-producao`. Não monte uma estrutura nova à mão.
5. **Se faltar um recurso**, crie-o NA BIBLIOTECA, seguindo `docs/estendendo-a-biblioteca.md`, e não dentro da produção.

## Regras do código

- Tempo em segundos, espaço em px de design (`useMotion()`, `useLayout().px`, `pick()`). Nunca use pixels ou quadros fixos.
- Sem CSS `transition`/`animation` e sem `background-image` com URL.
- Antes de concluir:
  ```bash
  npm run validar
  ```
  O comando roda eslint, tsc e a validação do catálogo.
- Ao exportar algo novo em `src/motion/index.ts`, registre em `src/motion/catalog.ts`.

## Referências

- Referências ficam em `reference-library/` (cadastro em `reference-library/README.md`).
- Extraia padrões de movimento. **Nunca reproduza marcas, logotipos, produtos, textos ou trilhas das referências.**
- Só registre como padrão o que foi observado nos quadros, sempre com o tempo.

## Repositório

- Repositório privado.
- **Não faça merge na `main`** nem altere a visibilidade sem aprovação explícita da dona do projeto.
- Trabalhe em branches. Renders finais não são versionados (`out/`), exceto demonstrações em `docs/demo/`.
