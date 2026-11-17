# Production Workflow — do roteiro ao vídeo

Como iniciar e conduzir uma nova produção com este sistema. A produção **consulta e reutiliza**
a biblioteca (`src/motion`): nenhum componente é reconstruído.

```
roteiro.md ──► nova-producao ──► timeline.json ──► animatic (ProducaoGenerica) ──► cenas próprias ──► render
   ▲                                   ▲
materiais (public/producoes/<slug>/)   referências (reference-library/)
```

---

## 0. Pré-requisitos

```bash
npm install
```

- Node 20.19+ ou 22.13+.
- Para analisar referências e gerar trilha: Python 3 com `numpy` (e `matplotlib`, opcional) e `ffmpeg`.
- Antes de qualquer produção, confira se a biblioteca está íntegra:
  ```bash
  npm run validar
  ```

## 1. O que você precisa fornecer

| Material | Formato | Onde colocar | Obrigatório? |
| --- | --- | --- | --- |
| **Roteiro** | Markdown no modelo `producoes/_modelo/roteiro.md` | qualquer caminho (o comando copia) | sim |
| **Briefing** | `producoes/<slug>/briefing.md` (criado pelo comando) | — | recomendado |
| **Imagens** | PNG (com transparência para objetos), JPG ou WebP, ≥ 1080 px no lado maior | `public/producoes/<slug>/imagens/` | não |
| **Vídeos** | MP4 (H.264), 30 fps de preferência, na resolução do formato final ou maior | `public/producoes/<slug>/videos/` | não |
| **Áudio** | MP3/WAV (trilha, locução) | `public/producoes/<slug>/audio/` | não |
| **Referências** | ids da `reference-library/` ou vídeos novos (veja a etapa 2) | `producoes/<slug>/referencias.md` | não |
| **Marca** | cores (hex), fontes, logotipo (SVG/PNG) | briefing + `imagens/` | não |

**Nomes de arquivo:** minúsculas, sem espaços nem acentos (`produto-frente.png`). No roteiro, use o caminho relativo à pasta da produção (`imagens/produto-frente.png`).

**Direitos:** só forneça materiais que você pode usar. O briefing tem uma caixa de confirmação para isso.

### Formato do roteiro

```markdown
---
titulo: Lançamento do App
estilo: calmo              # base | calmo | vibrante | misto
formatos: 9x16, 16x9       # 9x16 | 16x9 | 1x1
trilha: audio/trilha.mp3   # opcional
---

## Cena 1 — Abertura
duração: 3
transição: radial-rapido   # radial-rapido | radial-suave | dissolve | fade-branco | corte
rótulo: Novidade
texto: Seu dinheiro, *no ritmo certo*
apoio: Uma linha de apoio curta.
imagem: imagens/app.png
vídeo: videos/fundo.mp4
estilo: vibrante           # sobrescreve o estilo da produção nesta cena
visual: celular gira e pousa no centro   # nota de produção (não aparece no vídeo)
```

O modelo completo, com instruções, está em `producoes/_modelo/roteiro.md`.

## 1b. Fotos no Google Drive (grandes volumes)

Para muitas fotos, **não** suba os arquivos para o repositório. O fluxo lê a pasta do Drive e só baixa os originais escolhidos:

```bash
npm run fotos -- inventario <id-da-pasta> --slug <slug>   # só cabeçalhos (64 KB/arquivo): formato, dimensões, orientação, tamanho
npm run fotos -- miniaturas --slug <slug>                 # prévias do próprio Drive (~4% do tamanho dos originais)
npm run fotos -- folhas --slug <slug>                     # folhas de contato numeradas (F001…) para curadoria
# escreva producoes/<slug>/fotos/selecao.json (códigos + trecho + uso)
npm run fotos -- storyboard --slug <slug>                 # prévia da seleção agrupada por trecho
npm run fotos -- baixar --slug <slug> [--codigos F003,F031]  # originais byte a byte; confere tamanho e SHA-256
```

- **Acesso:** a pasta precisa estar como "qualquer pessoa com o link", e o ambiente precisa liberar `drive.google.com`, `drive.usercontent.google.com` e `lh3.googleusercontent.com`. O conector Google Drive, se estiver conectado, serve para consultar metadados pontuais. Downloads passam por HTTP direto para o disco, sem ocupar contexto.
- **Somente leitura:** o fluxo só faz GET e nunca altera nem exclui nada no Drive.
- **Fotos parecidas:** use uma por grupo. `producoes/<slug>/fotos/similaridade.json` agrupa as quase-duplicatas por hash perceptual; complete com a revisão visual.
- **Baixa resolução:** fotos com menos de 2 MP (comuns quando passaram pelo WhatsApp) entram só em molduras pequenas.
- **Versionamento:** `inventario.json` e `selecao.json` vão para o Git. Miniaturas, folhas e originais não vão (`.cache/` e `public/producoes/*/imagens/fotos/`).

## 1c. Música enviada como vídeo

1. **Extraia o áudio** e alinhe a letra ao áudio real:
   ```bash
   npm run alinhar-letra -- musica.mp4 letra.txt --modelo vosk-model-small-pt-0.3
   ```
   O comando devolve o tempo de cada palavra reconhecida.
2. **Escolha o recorte** em vales de energia e alinhado à grade de batidas. Registre tudo em `producoes/<slug>/musica/analise.json`.
3. **Não invente tempos:** frases não reconhecidas ficam marcadas como "não detectado" ou "inferido", com a regra usada.
4. **Trilhas de terceiros** ficam em `public/producoes/<slug>/audio/` e não são versionadas.

## 2. Referências (opcional)

- **Já cadastradas:** consulte `reference-library/CATALOGO.md` e cite os ids em `producoes/<slug>/referencias.md`.
- **Novas:** cadastre antes de produzir. A análise gera a ficha técnica, a folha de contato, as curvas e o espectrograma:
  ```bash
  npm run analisar-referencia -- caminho/video.mp4 --id ref-003-descricao-9x16 [--crop L:A:X:Y]
  ```
  Depois preencha a ficha, seguindo `reference-library/README.md`.
- **Padrão novo:** se a referência mostrar um padrão que não existe na biblioteca, ele vira candidato a componente (veja [docs/estendendo-a-biblioteca.md](docs/estendendo-a-biblioteca.md)). Não implemente dentro da produção.

## 3. Iniciar a produção

```bash
npm run nova-producao -- --nome "Lançamento do App" --roteiro ~/roteiros/lancamento.md --formatos 9x16,16x9 --estilo calmo
```

O comando:

1. Lê e **valida** o roteiro: estilos e transições válidos, duração, tamanho dos textos e arquivos citados existentes.
2. Cria `producoes/<slug>/` (roteiro, briefing, referências), `public/producoes/<slug>/{imagens,videos,audio}/` e `src/producoes/<slug>/` (timeline.json + Producao.tsx).
3. Registra uma composição por formato no Studio, na pasta **Producoes** (por exemplo, `lancamento-do-app-9x16`).
4. **Nunca sobrescreve** uma produção existente.

Para simular sem criar nada, acrescente `--dry-run`. Sem `--roteiro`, o comando usa o modelo e cria um roteiro de exemplo para editar.

## 4. Animatic: revisar estrutura e ritmo

```bash
npm run dev
```

No Studio, abra **Producoes › <slug>-9x16**. Cada cena aparece como animatic, usando só a biblioteca:

- `rótulo`, `texto` e `apoio` entram com `textPresets` (título ou impacto, conforme o estilo);
- `imagem` entra com `objectPresets.flutuante`;
- `vídeo` vira fundo desfocado;
- as transições usam `transitionPreset`, com o anel na cor de destaque da cena seguinte;
- a trilha, se houver, toca junto.

Depois de cada ajuste no roteiro, ressincronize a linha do tempo:

```bash
npm run nova-producao -- --sincronizar <slug>
```

## 5. Refinar cenas (sem reconstruir a biblioteca)

Quando o animatic aprovado precisa de uma cena mais elaborada:

1. **Consulte o que existe:**
   ```bash
   npm run catalogo
   ```
   Para filtrar, acrescente um termo, por exemplo `npm run catalogo -- transição` ou `npm run catalogo -- texto`.
2. **Crie a cena** em `src/producoes/<slug>/cenas/MinhaCena.tsx`, importando de `../../../motion`:
   ```tsx
   import { AbsoluteFill } from "remotion";
   import { Backdrop, Layer, MotionProvider, ObjectEnter, TextReveal, objectPresets, textPresets } from "../../../motion";
   import type { CenaProps } from "../../_runtime/ProducaoGenerica";

   export const MinhaCena = ({ cena, tema }: CenaProps) => (
     <MotionProvider theme={tema}>
       <AbsoluteFill>
         <Backdrop />
         <Layer depth={0} style={{ justifyContent: "center", alignItems: "center" }}>
           <ObjectEnter {...objectPresets.pop} delay={0.1}>
             <TextReveal {...textPresets.impacto} text={cena.texto ?? ""} delay={0.3} />
           </ObjectEnter>
         </Layer>
       </AbsoluteFill>
     </MotionProvider>
   );
   ```
3. **Registre a substituição** em `src/producoes/<slug>/Producao.tsx`:
   ```tsx
   <ProducaoGenerica timeline={timeline} cenas={{ "cena-2": MinhaCena }} />
   ```
   As outras cenas continuam como animatic.
4. **Mantenha os tempos no roteiro:** use `cena.duracao` e marcações em segundos. Se precisar de sincronia fina com o áudio, siga o padrão `timeline.json` + `cue()` da demonstração (`src/demo/`).

**Regra:** se a cena precisar de algo que não existe (um contador, partículas…), crie o componente **na biblioteca**, seguindo o guia de extensão, e não dentro da produção. Assim a próxima produção também ganha o recurso.

## 6. Áudio

- **Trilha fornecida:** `trilha: audio/arquivo.mp3` no cabeçalho do roteiro.
- **Acentos:** alinhe as marcações das cenas às batidas. Com BPM `b`, uma batida dura `60/b` s. Veja a seção 9 do MASTER_STYLE_GUIDE.
- **Trilha gerada:** `scripts/gerar-trilha.py` hoje é específico da demonstração (lê `src/demo/timeline.json`). Para usá-lo numa produção, seria preciso adaptá-lo (veja as pendências no checklist).
- **Loudness:** confira antes de entregar (alvo de −14 LUFS):
  ```bash
  ffmpeg -i out/video.mp4 -af ebur128 -f null -
  ```

## 7. Revisão e render

1. **Validar:**
   ```bash
   npm run validar
   ```
2. **Revisar quadros-chave** sem renderizar tudo:
   ```bash
   npx remotion still <slug>-9x16 out/quadro.png --frame=60
   ```
3. **Renderizar:**
   ```bash
   npx remotion render <slug>-9x16 out/<slug>-9x16.mp4
   ```
   Repita para cada formato registrado. Em máquinas sem GPU, use `--concurrency=4 --timeout=120000`.
4. **Checklist visual** (do MASTER_STYLE_GUIDE):
   - nada fora da área segura;
   - nunca dois textos legíveis no mesmo lugar;
   - título com no máximo 2 linhas no 9:16;
   - acentos na batida;
   - final parado de 3–5 s.

A pasta `out/` não é versionada.

## 8. Formatos: o que funciona hoje

| Parte | 9:16 | 16:9 | 1:1 | Observação |
| --- | --- | --- | --- | --- |
| Biblioteca (`src/motion`) | ✅ | ✅ | ✅ | tudo em px de design; `pick()` por formato |
| Animatic (`ProducaoGenerica`) | ✅ testado | ✅ testado | ✅ testado | no 16:9, imagem e texto ficam lado a lado; área segura de cada formato |
| Demonstração (`Demo-*`) | ✅ acabamento final | ⚠️ prévia | ⚠️ prévia | na cena "Energia", a cápsula cobre o título (distâncias em fração da altura) |
| Outras proporções (4:5, 21:9…) | — | — | — | tratadas como 9:16 (proporção < 0,9) ou 16:9 (> 1,1), sem ajuste próprio |
| Resoluções diferentes (720p, 4K) | ✅ | ✅ | ✅ | escalam por `px()`; o tempo de render cresce com a resolução |

**Limitações atuais:**

- Cenas feitas à mão precisam de `pick()` para cada formato. O animatic adapta sozinho, mas uma cena própria só fica boa nos formatos em que foi revisada.
- Distâncias verticais entre elementos definidas como fração da altura (`At y={0.4}`) mudam de proporção entre formatos. Prefira `px()` para espaçamentos entre elementos relacionados.
- Não há recorte automático de vídeos fornecidos para cada formato: o vídeo de fundo usa `objectFit: cover`, centralizado.
- O render é lento sem GPU (~16 s de render por segundo de vídeo em 1080×1920 com 4 CPUs).

## 9. Comando de exemplo para iniciar uma produção

### Pedindo ao Claude (recomendado)

Copie, ajuste e envie:

```text
Inicie uma nova produção no repositório motion-design-system (branch biblioteca-motion ou main, se já tiver merge).

- Nome: "Lançamento do App Aurora"
- Roteiro: está em producoes-entrada/aurora-roteiro.md (ou colado abaixo)
- Estilo: misto (abertura e encerramento calmos, meio vibrante)
- Formatos: 9x16 primeiro; depois 16x9 e 1x1
- Materiais: imagens em producoes-entrada/aurora/imagens/, trilha em producoes-entrada/aurora/audio/trilha.mp3 (120 BPM)
- Referências: ref-001 (trocas de texto) e ref-002 (queda do produto)

Siga o PRODUCTION_WORKFLOW.md e o MASTER_STYLE_GUIDE.md. Consulte a biblioteca com `npm run catalogo`
e não reconstrua componentes existentes. Gere o animatic, me mostre quadros-chave e só depois refine as cenas.
Não faça merge na main sem minha aprovação.
```

### Direto no terminal

```bash
npm run nova-producao -- --nome "Lançamento do App Aurora" --roteiro producoes-entrada/aurora-roteiro.md --formatos 9x16,16x9,1x1 --estilo misto
```

```bash
cp producoes-entrada/aurora/imagens/* public/producoes/lancamento-do-app-aurora/imagens/
```

```bash
npm run nova-producao -- --sincronizar lancamento-do-app-aurora
```

```bash
npm run dev
```
