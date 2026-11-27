# Locução — Aline Barbosa (Reels, 62 s)

Texto corrido para gravar no app de áudio. Cada cena do vídeo começa exatamente no tempo indicado
(as transições começam junto com a frase nova).

| Início | Fim | Narração |
| --- | --- | --- |
| 0:00 | 0:04 | Sua empresa travada por causa de papel? |
| 0:04 | 0:08 | Alvará, CNPJ, contrato social… pendência atrás de pendência. |
| 0:08 | 0:12 | Prazer, eu sou a Aline Barbosa. |
| 0:12 | 0:17 | Contadora, paulista de nascimento e baiana de coração. |
| 0:17 | 0:22 | Passei pelo contábil, pelo fiscal e pelo societário. |
| 0:22 | 0:27 | E vi muita gente perdendo horas com burocracias que poderiam ser simples. |
| 0:27 | 0:33 | Por isso eu descomplico processos, organizo etapas, resolvo pendências e faço as coisas andarem. |
| 0:33 | 0:40 | Legalização de empresas, alterações e regularizações, organização societária e serviços contábeis. |
| 0:40 | 0:46 | Tudo com um objetivo simples: menos burocracia, mais crescimento. |
| 0:46 | 0:51 | Com atendimento sem fronteiras: eu te atendo onde você estiver. |
| 0:51 | 0:56 | Enquanto eu cuido da burocracia, você foca no crescimento do seu negócio. |
| 0:56 | 1:02 | Aline Barbosa: contabilidade e legalização de empresas. |

## Texto corrido

Sua empresa travada por causa de papel? Alvará, CNPJ, contrato social… pendência atrás de pendência. Prazer, eu sou a Aline Barbosa. Contadora, paulista de nascimento e baiana de coração. Passei pelo contábil, pelo fiscal e pelo societário. E vi muita gente perdendo horas com burocracias que poderiam ser simples. Por isso eu descomplico processos, organizo etapas, resolvo pendências e faço as coisas andarem. Legalização de empresas, alterações e regularizações, organização societária e serviços contábeis. Tudo com um objetivo simples: menos burocracia, mais crescimento. Com atendimento sem fronteiras: eu te atendo onde você estiver. Enquanto eu cuido da burocracia, você foca no crescimento do seu negócio. Aline Barbosa: contabilidade e legalização de empresas.

## Locução gravada (v3)

`public/producoes/aline-barbosa-apresentacao/audio/narracao.mp3` (52,2 s, ElevenLabs). Tempos medidos por palavra
(transcrição local com marcação de tempo); cada cena começa 0,05 s antes da primeira palavra da frase:

| Cena | Início no vídeo | Primeira palavra |
| --- | --- | --- |
| 1 | 0,00 | Sua (0,00) |
| 2 | 2,41 | Alvará (2,46) |
| 3 | 7,53 | Prazer (7,58) |
| 4 | 9,79 | contadora (9,84) |
| 5 | 13,49 | Passei (13,54) |
| 6 | 16,73 | E vi (16,78) |
| 7 | 21,29 | Por isso (21,34) |
| 8 | 27,45 | Legalização (27,50) |
| 9 | 34,27 | Tudo (34,32) |
| 10 | 39,13 | Com atendimento (39,18) |
| 11 | 43,35 | Enquanto (43,40) |
| 12 | 48,09 | Aline Barbosa (48,14) — logo parada até 54,5 |

Dentro das cenas, os eventos (palavras, cliques, pousos) também seguem as palavras.

## Áudio final

1. Trilha cinematográfica: `npm run trilha-producao -- aline-barbosa-apresentacao` → `audio/trilha.mp3` (−16 LUFS).
2. Mix (voz + trilha com ducking automático, −14 LUFS) → `audio/mix-final.mp3`, que é a `trilha:` do roteiro:

```bash
D=public/producoes/aline-barbosa-apresentacao/audio
ffmpeg -y -i $D/trilha.mp3 -i $D/narracao.mp3 -filter_complex "[1:a]aresample=48000,pan=stereo|c0=c0|c1=c0,loudnorm=I=-15:TP=-2:LRA=7,apad=whole_dur=54.6,asplit=2[v1][v2];[0:a]aresample=48000,volume=-5dB[m];[m][v1]sidechaincompress=threshold=0.02:ratio=5:attack=15:release=400:makeup=1[md];[md][v2]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1:LRA=9[out]" -map "[out]" -ar 48000 -c:a libmp3lame -b:a 224k $D/mix-final.mp3
```
