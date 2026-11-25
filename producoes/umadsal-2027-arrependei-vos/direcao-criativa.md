# Direção criativa — UMADSAL 2027 | ARREPENDEI-VOS

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
