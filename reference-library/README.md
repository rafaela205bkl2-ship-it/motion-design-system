# reference-library

Biblioteca de referências audiovisuais: vídeos que inspiram padrões de movimento,
com análise técnica e ficha de observação. É a **fonte de evidência** da identidade:
um padrão só entra na biblioteca de motion (`src/motion`) depois de ser observado aqui.

## Estrutura

```
reference-library/
  README.md                  este guia
  CATALOGO.md                índice de todas as referências + padrões recorrentes consolidados
  _modelo/ficha.md           modelo de ficha
  ref-NNN-descricao/
    original/<arquivo>       vídeo original (cópia exata; ver "Direitos")
    analise/
      tecnico.json           ffprobe: codecs, resolução, fps, áudio, decodificação ok?
      resumo.json            métricas automáticas: eventos, ritmo, BPM, loudness, sincronia
      folha-contato.png      quadros a 2 fps
      curvas.png             mudança visual, brilho/saturação, áudio
      espectrograma.png      espectro do áudio
    ficha.md                 observações humanas, com tempo, e mapeamento para a biblioteca
```

A análise aprofundada das duas primeiras referências (sequências quadro a quadro,
medição de easing, sincronia) continua em [`docs/referencias/`](../docs/referencias/analise-referencias.md),
preservada como foi produzida.

## Adicionar uma referência

1. **Escolha o id:** `ref-NNN-descricao-curta-proporcao`, com o próximo número livre e sem nome de marca. Exemplo: `ref-003-tutorial-calmo-9x16`.
2. **Descubra se é preciso recortar.** Se o vídeo for uma gravação de tela, ou tiver bordas ou sobreposições, gere um quadro e localize a área da peça:
   ```bash
   ffmpeg -ss 5 -i caminho/video.mp4 -frames:v 1 quadro.png
   ```
3. **Rode a análise:**
   ```bash
   npm run analisar-referencia -- caminho/video.mp4 --id ref-003-tutorial-calmo-9x16 --crop 720:410:0:392
   ```
   Requer `ffmpeg` e Python 3 com `numpy`. O `matplotlib` é opcional e só serve para gerar `curvas.png`.
4. **Olhe os quadros.** Use `analise/folha-contato.png` e, para trechos rápidos, gere sequências a 15 fps:
   ```bash
   ffmpeg -ss 3.5 -t 1.2 -i video.mp4 -vf "fps=15,scale=240:-1,tile=9x2" trecho.png
   ```
5. **Preencha `ficha.md`.** Só registre o que viu, sempre com o tempo. Marque o que é recorrente (citando os ids) e o que é particular.
6. **Atualize `CATALOGO.md`:** inclua a linha da referência e, se ela repetir um traço, mova esse traço para "Padrões recorrentes consolidados".
7. **Mapeie para a biblioteca.** Na ficha, indique o que já existe (consulte `npm run catalogo`) e o que é candidato a componente novo (veja [docs/estendendo-a-biblioteca.md](../docs/estendendo-a-biblioteca.md)).

## Regras

- **Evidência antes de padrão.** Nada entra na identidade sem ter sido observado e anotado com tempo.
- **As métricas automáticas são ponto de partida.** `mudancas_bruscas` inclui transições muito rápidas, não só cortes. O BPM tem um campo de confiança. A sincronia é comparada com instantes aleatórios.
- **Extraia padrões, nunca marcas.** Logotipos, mascotes, produtos, textos e trilhas das referências não são reproduzidos.
- **Distinga as camadas.** Em gravações de tela, separe a peça da captura (câmera, sobreposições do autor).

## Direitos

Os vídeos em `original/` são de terceiros e servem **apenas como referência interna** num repositório privado.
Se preferir não versionar os originais, use `--sem-copia`: a análise é gerada do mesmo jeito, e a ficha
registra o nome e o SHA-256 do arquivo para identificá-lo depois.
