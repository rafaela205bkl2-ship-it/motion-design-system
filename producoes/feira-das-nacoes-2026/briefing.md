# Briefing — Feira das Nações 2026

## Objetivo
- **Comunicar:** a Feira das Nações 2026 da Assembleia de Deus como celebração missionária: muitas nações, um só povo, oração pelos países perseguidos e pelos missionários.
- **CTA:** "Ore pelas nações" e o versículo de Marcos 16:15 no encerramento.

## Tipo de trabalho
**Reedição** (não é edição do zero). A base é o vídeo oficial já editado (`VIDEO OFICIAL/1122(2).mov`, 65,27 s, 1920×1080, 30 fps).
Ordem, cortes e áudio originais foram **preservados**; a nova direção de arte entra como camadas por cima.
A pasta do Drive não continha projeto editável (Premiere/AE/DaVinci/CapCut) nem takes brutos — só o vídeo final.

## Público e canal
- Público: membros e congregações da Assembleia de Deus.
- Formato: **16:9** (o formato original, pedido da dona do projeto).

## Estilo
- Estilo: vibrante, com a paleta do painel do evento: roxo profundo `#1A0E4F`, violeta `#6B3DF2` e dourado `#F7BE3A` (tema `temaFeira` em `src/producoes/feira-das-nacoes-2026/dados.ts`).
- Motion "3D": globo em linhas girando (`Globe3D`), cartões de bandeira que giram em perspectiva, carrossel 3D de bandeiras.
- Bandeiras: só as que aparecem no quadro, com o tempo (Turquia, Brasil, Cabo Verde, México, Israel, Croácia, Indonésia, Portugal e Nigéria). A pedido da produção, a Cuba virou Portugal e a Gâmbia virou Nigéria.

## Áudio
- Áudio original do vídeo (falas + ambiente). Sob o cartão final, a ambiência da abertura é reaproveitada com fade.

## Materiais
| Arquivo | Onde está | Uso |
| --- | --- | --- |
| `oficial.mp4` (remux sem perda do `.mov`) | `public/producoes/feira-das-nacoes-2026/videos/` (não versionado; veja `materiais.md`) | base da reedição |

## Textos confirmados
- Lower thirds: **Pastor — Gerson Soares** e **Repórter — César Maju** (`TEXTOS` em `dados.ts`).
- Encerramento: logo da Igreja Evangélica Assembleia de Deus em Salvador (arquivo enviado pela produção), separada em camadas
  em `public/producoes/feira-das-nacoes-2026/imagens/logo-*.png`: livro e textos recoloridos (branco/dourado) para o fundo roxo,
  chama-pomba com o degradê original; a pomba entra voando e bate a asa (`LogoAssembleia` em `cenas/Graficos.tsx`).

## A confirmar
- Transcrição do trecho "Assembleia de Deus, Sede Paralela" (o áudio soa como "Igreja de Deus, sede paralela").

## Direitos
- [x] Material do próprio evento, fornecido pela dona do projeto.
- [x] Nenhuma marca de terceiros reproduzida (referências usadas só como padrão de movimento).
