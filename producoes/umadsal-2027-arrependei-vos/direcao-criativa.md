# Direção criativa — UMADSAL 2027 | ARREPENDEI-VOS

> **Versão atual: v3 (60 s, com a narração gravada).** Ajustes pedidos sobre a v2, mantendo o filme e a trilha.

## v3 — o que mudou

| Pedido | Resposta |
| --- | --- |
| colocar a narração do Drive | gravação original (`audio/narracao-original.m4a`) recortada nas frases do guia de 1 minuto, com cada frase alinhada aos impactos (`scripts/narracao-umadsal-2027.py`, tempos em `cues.json → narracao[].origem`); a frase N4 ficou como gravada: "Mas Deus nunca deixou de nos convidar ao retorno." |
| mixagem | `filme-final.mp3`: voz na frente, música −10 dB e efeitos −9 dB sob a voz (ducking pelo envelope da voz), −14 LUFS, pico −1,5 dBTP; inteligibilidade conferida por transcrição automática; o golpe de RENÚNCIA passou para logo depois da palavra |
| usar o novo PDF | paleta com os HEX novos (#4e0000, #142840, #c89236, #0e0e0e); camisa nova (símbolo na gola); no final o lettering vira o **telão do palco**, depois **crachás**, camisa, logotipo, **cartaz com moldura** e **logo vermelho** com a assinatura |
| objetos mais cinematográficos | match cuts por forma (perfil → perfil → perfil; círculo → círculo → esfera; cúpula → cúpula), giro contínuo através dos cortes, uma câmera que avança sem parar, cone de luz, poeira, bokeh, brilho de recorte e vinheta |
| match cut de palavras | ENTREGA e RENÚNCIA nascem de uma página diagramada como Bíblia de estudo: a câmera mergulha na palavra marcada em dourado e ela vira o letreiro gigante (o texto da página é o próprio roteiro — nenhum versículo inventado) |
| mão mais cinematográfica | a mão do Criador surge do escuro num feixe de luz e, por match cut, vira a mão gravada da estampa entre nuvens douradas |

---


> **Versão atual: v2 (60 s, 120 BPM).** Ela foi refeita a partir do retorno da cliente: mais curta, muito mais dinâmica,
> com a pegada das duas referências, mais uso do PDF e das cores, e nenhuma nudez. A v1 (170 s) está registrada no
> fim deste documento e no histórico do git.

## v2 — o que mudou e por quê

| Pedido | Resposta na v2 |
| --- | --- |
| 1 minuto | 60 s exatos, em 8 blocos; narração com frases literais do roteiro selecionadas (`guia-de-narracao.md`) |
| dinamismo, pegada das referências | ~1 evento a cada 0,5 s (120 BPM); cortes secos no tempo da música; montagem que acelera até o clímax |
| objetos como no vídeo de referência | 12 objetos históricos recortados (The Met, CC0) entram pela direita a cada batida, com rótulo fixo de categoria (ARTE · CIÊNCIA · HISTÓRIA) e etiqueta técnica, como os objetos sobre fundo azul da ref-003 |
| letterings dinâmicos | tipografia gigante cortada pelas bordas (DEUS, HUMANIDADE, ENTREGA., RENÚNCIA., VOLTAR. …), riscos que corrigem a frase, strobe com fragmentos do lettering oficial |
| trabalhar mais o PDF e as cores | campos de cor chapada com a paleta oficial (Mystic Navy, Red Inferno, Golden Yellow, Black C, creme do lettering) mudando a cada bloco; transições `PaletteWipe` com faixas dessas cores; mãos da estampa 2027 recortadas como objetos; Atos 3:19, camisa, símbolo e logotipo |
| sem nudez | só mãos, rostos, figuras vestidas e objetos; enquadramentos conferidos quadro a quadro; a *Expulsão* de Michelangelo e o corpo do *Homem Vitruviano* saíram |

## Estrutura v2 (fonte: `cues.json`)

| Bloco | Tempo | O que acontece |
| --- | --- | --- |
| Abertura | 0–6 s | UMADSAL 2027 → strobe de fragmentos do lettering sobre as cores do PDF → silêncio → impacto ARREPENDEI-VOS |
| Objetos | 6–14 s | cabeça de mármore, lira, cálices · astrolábios, relógio, globo · elmos, espada, moeda; "O QUE NOS TRANSCENDE" |
| Mãos | 14–24 s | Criação de Adão com caixas técnicas (ref-004) → diagrama dos fragmentos (pintura × gravura 2027) → espelho 1512 / 2027 → DEUS / HUMANIDADE |
| Interrompida | 24–28 s | as mãos se separam com falhas digitais; rachadura; silêncio |
| Chamado | 28–34 s | a mão gravada da estampa desce sobre o dourado → mosaico de rostos → UMA GERAÇÃO. |
| Pares | 34–41 s | APARÊNCIAS riscada → ENTREGA. · CONVENIÊNCIA riscada → RENÚNCIA. |
| É tempo | 41–48 s | ampulheta que vira a cada golpe: VOLTAR. RECONHECER. ARREPENDER. → rajada → silêncio |
| Revelação | 48–60 s | lettering na luz → camisa → símbolo e logotipo → assinatura |

## Créditos dos objetos (The Met Open Access, CC0)

Lista completa com títulos, datas e números de objeto em `public/producoes/umadsal-2027-arrependei-vos/objetos/creditos.json`.
Recorte de fundo automático (rembg, modelo isnet-general-use).

---

# Registro da v1 (170 s)


## Conceito: "o vão entre os dedos"

O filme parte da imagem que a própria identidade 2027 escolheu: a estampa da camisa traz **duas mãos que quase
se tocam**, ecoando a *Criação de Adão*. O roteiro fala dessa mesma imagem ("entre os dedos que quase se tocam…").
A espinha do filme é esse vão:

1. a humanidade busca representar o que a transcende (o Renascimento como "arquivo histórico");
2. Michelangelo pinta o encontro → **o vão se abre e a imagem se parte** (a relação interrompida);
3. o Éden perdido, em azul-noite;
4. **a mão do Criador volta em luz** (Deus nunca deixou de chamar);
5. a mão pintada **se transforma na mão gravada da camisa 2027**: o chamado ecoa hoje, nesta geração;
6. o Filho Pródigo, as mãos do pai: *voltar*;
7. a tela se abre, da escuridão para a luz creme da identidade: **ARREPENDEI-VOS**.

A jornada visual vai da **escuridão (distância)** à **luz (retorno)**. O letterbox 2,39:1 dos atos 1–3 se abre no
clímax: a tela inteira só aparece quando a identidade é revelada.

## Estrutura (170 s)

| Ato | Tempo | Função | Música |
| --- | --- | --- | --- |
| 1 · O Chamado | 0–19,8 s | mistério → UMADSAL 2027 → silêncio → impacto ARREPENDEI-VOS | drone de contrabaixo e celli, violino solo, crescendo de trêmulos, corte seco, golpe de tímpano/gongo |
| 2 · A Mensagem | 19,8–103,5 s | arte e história → Michelangelo → ruptura → Éden → a luz volta → "uma geração" → manifesto | coral de cordas + harpa como alaúde; o tema "O Chamado" no violino; silêncio da rachadura; ostinato de spiccato que cresce |
| 3 · A Identidade | 103,5–128,5 s | match cut para a camisa → Filho Pródigo → VOLTAR · RECONHECER · ARREPENDER → montagem acelerada | tema com eco; três impactos; crescendo e silêncio de 1 s |
| 4 · A Revelação | 128,5–170 s | lettering na luz → Atos 3:19 → camisa → logotipo → assinatura | tutti com o tema uma oitava acima; respiro no versículo; Si♭ maior no logotipo; **Ré maior** no fim |

Decupagem completa: `roteiro.md` (20 planos) e `src/producoes/umadsal-2027-arrependei-vos/cues.json`.

## Textos na tela (só onde ampliam a narração)

`UMADSAL 2027` · `ARREPENDEI-VOS` (lettering oficial) · `UMA GERAÇÃO.` · `APARÊNCIAS → ENTREGA.` ·
`CONVENIÊNCIA → RENÚNCIA.` · `DIANTE DOS HOMENS → DIANTE DE DEUS.` · `VOLTAR.` `RECONHECER.` `ARREPENDER.` ·
**Atos 3:19** (texto exatamente como na camisa) · `2027` · `O CHAMADO PARA VOLTAR AO PRINCÍPIO.`

Todas as frases vêm do roteiro ou da camisa. A única referência bíblica é **Atos 3:19**, a que está na identidade.

**Duas vozes tipográficas:** o mundo/"arquivo" fala em serifa renascentista (Cormorant Garamond) e é riscado;
a resposta nasce **na voz da identidade** (grotesca bold itálica com espaçamento largo, como na camisa) e em vermelho.

## Fidelidade à marca

| Elemento | Origem | Tratamento |
| --- | --- | --- |
| Lettering ARREPENDEI-VOS | PDF pág. 1 | fundo creme removido por desmistura de cor; ampliado 8× com reconstrução da borda; **gradiente e formas originais** |
| Logotipo e símbolo | `umadsal-logo-white.png` | ampliado 4× com reconstrução da borda; sempre branco sobre escuro, como o arquivo |
| Página do símbolo | PDF pág. 4 | usada como está; uma cópia com o símbolo retocado para o logotipo completo entrar na mesma textura |
| Camisas | PDF pág. 2 | mockup original, ampliado 2× para os movimentos de câmera; sem recorte nem recoloração |
| Paleta | PDF pág. 3 | cartões Pantone originais; o fundo de nuvens gravadas da página vira a textura da "luz" |
| Estrelas (asterisco e brilho 4 pontas) | estampa | redesenhadas em vetor na cor Mystic Navy, só como apoio no versículo |

**Não usado de propósito:** o pincel vermelho "2027" que aparece cortado no canto do mockup. Sem o arquivo inteiro,
desenhá-lo seria inventar.

## Trilha original

- **Arquivo:** `scripts/trilha-umadsal-2027.py`. A partitura está escrita em código, com tempos lidos do `cues.json`.
  Um sampler próprio toca **amostras reais** de orquestra (Versilian Community Sample Library, VSCO-2-CE, CC0).
- **Instrumentação:** violinos (naipe + solo, protagonistas), violas, violoncelos, contrabaixo, harpa, tímpanos,
  bumbo sinfônico, gongo e pratos. Desenho de som sintetizado: sub-graves nos impactos, risers, rachadura, whooshes.
- **Linguagem:** Ré menor modal, condução de vozes em estilo coral renascentista (suspensões, cadências modais),
  harpa em arpejos como alaúde, tema "O Chamado" (lá–ré–mi–fá).
- **Silêncios estratégicos:** 10,75–11,0 s (antes do primeiro impacto), 56,5–58 s (só a rachadura) e
  127,5–128,5 s (antes do clímax). Neles a cauda da reverberação também é cortada: silêncio de verdade.
- **Final:** terça de Picardia, o único acorde maior de repouso do filme (Ré maior). Musicalmente, é o "voltar ao princípio".
- **Stems:** `trilha-musica.flac` (música), `trilha-sfx.flac` (desenho de som), `filme-mix.mp3` (os dois, usado no render).
  Música e efeitos ficam separados para ajustes depois da narração.
- **Sincronia conferida:** impactos em 11,0 · 66,0 · 90,25 · 94,75 · 99,5 · 117 · 120 · 123 · 128,5 · 152,5 · 160,5 s.

## Fontes das obras (domínio público)

Reproduções fiéis de obras bidimensionais em domínio público (Wikimedia Commons):

| Obra | Arquivo no Commons |
| --- | --- |
| Michelangelo, *A Criação de Adão* (c. 1512) | Michelangelo_-_Creation_of_Adam_(cropped).jpg (a mesma obra da foto enviada, em resolução maior) |
| Rafael, *A Escola de Atenas* (1509–1511) | "The_School_of_Athens"_by_Raffaello_Sanzio_da_Urbino.jpg |
| Leonardo da Vinci, *Homem Vitruviano* (c. 1490) | Vitruvian_Man_by_Leonardo_da_Vinci.jpg (só a metade superior) |
| Michelangelo, *O Pecado Original e a Expulsão do Paraíso* (1509–1510) | Michelangelo,_Fall_and_Expulsion_from_Garden_of_Eden_00.jpg |
| Masaccio, *A Expulsão do Éden* (c. 1425) | Masaccio-TheExpulsionOfAdamAndEveFromEden-Restoration.jpg (versão restaurada, metade superior) |
| Rembrandt, *O Retorno do Filho Pródigo* (c. 1669) | Rembrandt_Harmensz_van_Rijn_-_Return_of_the_Prodigal_Son_-_Google_Art_Project.jpg |

Os enquadramentos evitam nudez em destaque, pensando no público da igreja.

## Como regerar

```bash
python3 producoes/umadsal-2027-arrependei-vos/preparar-assets.py --origem <pasta com drive/ e art/>
```

```bash
python3 scripts/trilha-umadsal-2027.py --amostras ~/vsco
```

```bash
npx remotion render umadsal-2027-arrependei-vos-16x9 out/umadsal-2027-filme.mp4 --concurrency=4
```

Para mudar um tempo, edite `cues.json` e rode os dois últimos comandos de novo: vídeo e música continuam sincronizados.

## Limitações honestas

- Não há filmagem nova: as imagens são pinturas, o mockup e as peças da identidade, animados por câmera virtual.
- Algumas fontes têm resolução limitada (a *Expulsão* de Michelangelo tem 1758 px de largura; o lettering original,
  ~260 px). Por isso usei ampliação com reconstrução de borda, grão e enquadramentos que não exigem zoom extremo.
- A trilha é tocada por amostras com articulações fixas (sustain, trêmulo, spiccato). Ela é fiel ao espírito,
  mas não substitui uma orquestra gravada. Os stems separados permitem trocar ou reforçar a música depois.
