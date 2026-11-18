# Etapa 1 — Diagnóstico

Produção de fã **não oficial**. Este documento registra o que foi verificado antes de qualquer produção.
Data da análise: 18/11/2026.

## 1. Nosso motion-design-system

**O que já existe e será reaproveitado (sem reconstruir):**

| Recurso | Uso nesta produção |
| --- | --- |
| `TextReveal`, `TextSwap` | frases da narração entrando por desfoque, palavra a palavra |
| `ObjectEnter` | entrada de cartões e números com peso contido (sobra ≤ 7%) |
| `Layer` (profundidade por desfoque) | separar placa do jogo, objetos gráficos e texto em planos |
| `Backdrop`, `KineticType` | momentos minimalistas e padrão tipográfico de fundo |
| `radialReveal`, `blurDissolve`, `ColorBloom` | transições entre cenas e troca de mundo |
| `createTheme`, `blendThemes` | tema próprio da produção sem mexer nos três temas atuais |
| `useLayout().px`, `pick()`, área segura | 9:16 como formato primário |
| `ProducaoGenerica` + `timeline.json` | animatic já gerado; cenas são substituídas uma a uma |

As seis cenas da demonstração e as composições antigas não são tocadas. A produção vive em
`src/producoes/13-anos-depois/` e aparece no Studio em **Producoes › 13-anos-depois-9x16**.

**O que falta na biblioteca** (será criado em `src/motion`, seguindo `docs/estendendo-a-biblioteca.md`):

| Componente | Para quê | Já era candidato? |
| --- | --- | --- |
| `Stage3D` | palco com perspectiva e câmera (avanço, órbita, inclinação) em CSS 3D | não |
| `DepthType` | tipografia com volume (camadas extrudadas), luz e sombra | não |
| `RollingNumber` | odômetro 2013 → 2018 → 2022 → 2026 | **sim** (ref-001, 23 s) |
| `FootageCard` | cartão 3D com vídeo do jogo dentro, inclinação e brilho | parcial (cards da ref-001) |
| `PlateMotion` | movimento de câmera sobre a placa (push-in, deriva, parallax) e trilha de rastreio | não |
| `Particles` | partículas determinísticas (semente fixa) para a troca de mundo | não |
| `FilmLook` | TV de tubo ligando, grão, aberração cromática leve para 2013 | não |
| `LightSweep` | brilho que atravessa texto e cartões | não |

## 2. Referência visual: ref-001 (vídeo da Nubank)

Já está cadastrada e analisada em `reference-library/ref-001-app-financeiro-16x9/` (ficha, folha de contato,
curvas e espectrograma) e em `docs/referencias/analise-referencias.md`. O que se aproveita, com o tempo observado:

| Linguagem | Observado (tempo) | Tradução para o projeto |
| --- | --- | --- |
| Texto construído palavra a palavra com desfoque | "Agora", 5,87–6,13 s, 8 q | frases da narração (já é `TextReveal`) |
| Troca de frase por dissolve com desfoque | 4,17–4,37 s, ~6 q | sequência de anos e frases curtas |
| **Elemento vira transição** | zoom através da caixa 3D, 12,1–12,3 s | o número "2026" vira o sol de Vice City; cartões abrem cenas |
| Objetos 3D com sombra suave sobre fundo limpo | moedas, caixa, escudo, 8–22 s | números e cartões como objetos físicos |
| Cartões e interfaces flutuando em profundidade | lista com card, 12,3–16 s; chips desfocados, 26–28 s | cartões de "memória" com cenas do jogo; comentários de fãs |
| Contador odômetro + barras | 23,0–25,3 s, sobra ~7% | `RollingNumber` para os anos |
| Câmera: composição parada, elementos se movem | toda a peça | idem nos momentos gráficos; nas placas do jogo, câmera lenta |
| Encerramento: marca → cartão sólido parado | 30,4–35,5 s | título em tipografia própria → data parada |
| Sem sincronia sistemática com a batida | 16% dos eventos na batida | acentos só nos pontos-chave |

**Não aproveitar:** roxo da marca, logotipo "nu", textos e interface bancária.

## 3. Repositórios do GitHub

Os três existem e são públicos (verificado em 18/11/2026).

| Repositório | Licença | Tecnologia | O que estudar | Pode reutilizar código? |
| --- | --- | --- | --- | --- |
| [bridge-mind/leonida](https://github.com/bridge-mind/leonida) | MIT | TypeScript, Three.js, Rapier, Vite | ciclo dia/noite com neon, câmera de terceira pessoa, geração procedural de cidade | sim, com atribuição (MIT); não traz assets da Rockstar |
| [sairamsrujan/gta6-leonida](https://github.com/sairamsrujan/gta6-leonida) | **sem licença** | HTML/JS, GSAP + ScrollTrigger, Lenis, Three.js | céu synthwave em GLSL, partículas que se transformam (esfera → forma → skyline), parallax | **não**: sem licença, só como estudo de técnica; traz um vídeo de origem não declarada |
| [KGN15/GTAVI](https://github.com/KGN15/GTAVI) | **sem licença** | React 19, Vite, Tailwind, GSAP | parallax em várias camadas | **não**: sem licença; inclui a fonte Pricedown e imagens de terceiros |

**Conclusões técnicas:**
- **GSAP não entra.** Ele anima pelo relógio do navegador; o Remotion renderiza quadro a quadro com `interpolate`.
  Tudo que esses projetos fazem com GSAP (parallax, pin, split-text) se faz com o que já temos, de forma determinística.
- **Partículas que se transformam** (técnica do gta6-leonida) e **céu de pôr do sol** são as ideias mais úteis.
  Serão reimplementadas do zero no nosso padrão, sem copiar código.
- **Fonte Pricedown e logotipos não entram** (marca registrada).

## 4. Materiais oficiais de GTA VI

- **Data de lançamento:** 19 de novembro de 2026 (PS5 e Xbox Series X|S), confirmada pela Rockstar
  ([newswire](https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026)).
  Hoje é 18/11/2026: **"amanhã" só vale se o vídeo sair hoje.** O encerramento terá duas versões (ver `conceito.md`).
- **Página de mídia** (rockstargames.com/VI/media): o domínio está bloqueado na rede deste ambiente. Não foi possível
  ler a página nem baixar nada daqui. Os arquivos precisam ser fornecidos manualmente (lista em `assets.md`).
- **Política de uso** (resumo via busca; o texto integral não pôde ser lido daqui, confira em
  [support.rockstargames.com](https://support.rockstargames.com/articles/200153756/Policy-on-posting-copyrighted-Rockstar-Games-material)):
  - uso **não comercial** por fãs é tolerado;
  - **"não comercial" exclui ganhar dinheiro com o material** ou usá-lo para promover produto ou serviço;
  - a Rockstar pode pedir a remoção a qualquer momento;
  - material vazado ou de cópias antes do lançamento é removido;
  - vídeos com revelações da história, finais ou só cutscenes podem ser removidos;
  - casos duvidosos: copyright@take2games.com.

**Consequência:** monetizar este vídeo (Programa de Criadores do TikTok, Reels bônus, YouTube Partner)
**não está coberto** pela permissão geral. Para monetizar, é preciso autorização da Take-Two/Rockstar.

## 5. Possibilidades técnicas e riscos

| Tema | Avaliação |
| --- | --- |
| **3D** | Fase A: CSS 3D (perspectiva, `translateZ`, rotações) dirigido por `interpolate`. Sem dependência nova, render rápido e confiável. Fase B (só se o protótipo mostrar necessidade): `@remotion/three` + `three` + React Three Fiber para números extrudados com luz real. Risco: sem GPU, o WebGL roda em software e o render fica bem mais lento. |
| **Texto preso ao movimento da câmera** | Sem matchmove profissional aqui. Solução: escolher planos com movimento simples (avanço, panorâmica) e gerar uma trilha de rastreio semiautomática (script com OpenCV → JSON de pontos por quadro) que o `PlateMotion` lê. Ajuste manual quando falhar. |
| **Vertical a partir de material 16:9** | Trailers e screenshots são horizontais. Cortar as laterais perde o assunto. Solução por plano: janela de recorte animada que segue o assunto, placas dentro de cartões, ou duas placas empilhadas. |
| **Locução** | Não há serviço de voz configurado neste ambiente. Com uma chave de um serviço de voz de qualidade (ex.: ElevenLabs), dá para gerar; senão, você grava ou fica sem voz. Padrão: versão sem voz, com o tempo já reservado para a locução. |
| **Trilha** | O gerador do repositório (`gerar-trilha.py`) serve para trilha temporária. Para a versão publicada: trilha original de qualidade ou licenciada. O áudio dos trailers **não** pode ser usado (músicas licenciadas, Content ID). |
| **Render** | ~16 s de render por segundo de vídeo em 1080×1920 sem GPU: ~18 min para 68 s, sem 3D WebGL. |
