---
titulo: Nome da produção
estilo: calmo
formatos: 9x16
trilha:
---

<!--
COMO PREENCHER
- Cabeçalho (entre os ---):
    titulo:   nome da produção
    estilo:   base | calmo | vibrante | misto   (padrão de todas as cenas)
    formatos: 9x16, 16x9, 1x1                   (separados por vírgula)
    trilha:   audio/arquivo.mp3                 (opcional; arquivo em public/producoes/<slug>/)
- Cada cena começa com "## Cena N — Nome" e tem linhas "campo: valor".
- Campos da cena (todos opcionais, exceto duração recomendada):
    duração:   segundos (ex.: 3 ou 2,5)
    estilo:    base | calmo | vibrante | misto  (sobrescreve o da produção)
    transição: radial-rapido | radial-suave | dissolve | fade-branco | corte   (para a PRÓXIMA cena)
    rótulo:    texto pequeno em caixa alta acima do título
    texto:     texto principal — *palavras* entre asteriscos ficam em destaque; \n quebra linha
    apoio:     linha secundária
    imagem:    imagens/arquivo.png   (em public/producoes/<slug>/)
    vídeo:     videos/arquivo.mp4    (fundo da cena)
    visual:    descrição livre do que deve aparecer (nota de produção; não entra no vídeo)
- Boas práticas (MASTER_STYLE_GUIDE.md): texto principal ≤ 48 caracteres no 9:16,
  ~1 evento visual por segundo, cenas de 2–4 s, encerramento de 3–5 s.
-->

## Cena 1 — Abertura
duração: 3
transição: radial-rapido
rótulo: Apresentando
texto: Uma ideia *em movimento*
apoio: Linha de apoio curta e direta.
visual: objeto principal surge com pop no centro

## Cena 2 — Desenvolvimento
duração: 3,5
estilo: vibrante
transição: fade-branco
texto: O que muda\n*para você*
apoio: Benefício principal em uma frase.
visual: três formas entram com peso

## Cena 3 — Encerramento
duração: 4
texto: Comece *hoje*
apoio: seusite.com
visual: assinatura parada sobre a cor de destaque
