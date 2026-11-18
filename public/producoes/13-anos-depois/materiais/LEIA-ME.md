# Materiais da produção "13 Anos Depois"

Arraste os arquivos para as pastas abaixo e rode `npm run materiais` (ou só `npm run dev`, que integra sozinho).
Nenhum código precisa ser editado. Sem arquivo numa pasta, o vídeo usa o cenário próprio.

| Pasta | O que colocar | Formatos | Onde aparece |
| --- | --- | --- | --- |
| `personagens/jason/` | 1 foto de Jason | JPG, PNG, WebP | cena 12, cartão 01 |
| `personagens/lucia/` | 1 foto de Lucia | JPG, PNG, WebP | cena 12, cartão 02 |
| `cenarios/01-cidade-2013/` | cidade de GTA V ao entardecer | imagem ou vídeo | cenas 1, 2, 6, 17 |
| `cenarios/02-colinas-2013/` | colinas/rua de GTA V de dia | imagem ou vídeo | cenas 3, 6 |
| `cenarios/03-praia-2013/` | praia de GTA V | imagem ou vídeo | cenas 4, 6 |
| `cenarios/04-por-do-sol/` | Vice City ao pôr do sol (plano aberto) | imagem ou vídeo | cenas 10, 11, 16, 17 |
| `cenarios/05-praia-nova/` | praia de Vice City | imagem ou vídeo | cenas 11, 16 |
| `cenarios/06-cidade-noite/` | cidade à noite | imagem ou vídeo | cenas 13, 16 |
| `cenarios/07-estrada/` | carro/perseguição | imagem ou vídeo | cenas 14, 16 |
| `cenarios/08-helicoptero/` | helicóptero | imagem ou vídeo | cenas 15, 16 |
| `gameplay/` | até 5 trechos curtos (~1–2 s úteis cada) | imagem ou vídeo | cena 16, em ordem alfabética |
| `referencias/` | referências visuais para estudo | qualquer | não entra no vídeo |

**Formatos**
- Imagens: JPG, JPEG, PNG, WebP. Ideal: 2160 px ou mais no lado maior.
- Vídeos: MP4 H.264 (ideal), MOV, M4V, WebM. Vídeos que não forem MP4 H.264 (ex.: .mov HEVC do iPhone)
  são convertidos automaticamente; o original vai para `_originais/`.
- Vídeos curtos: 4–8 s, sem áudio (o áudio é descartado). Arquivos acima de 100 MB não sobem para o GitHub.

**Regras automáticas**
- Uma pasta de espaço usa o **primeiro arquivo em ordem alfabética**.
- Nomes com espaço ou acento são renomeados para um nome seguro.
- **Enquadramento sem código:** termine o nome da imagem com `@XXxYY`, em % da largura e da altura.
  Ex.: `jason@70x30.jpg` centraliza o recorte em 70% da largura e 30% da altura.
  Com uma única foto dos dois, coloque cópias nas duas pastas com recortes diferentes
  (`jason@72x35.jpg` e `lucia@25x40.jpg`).

**Comandos**
- `npm run materiais`: integra o que estiver nas pastas.
- `npm run materiais -- --watch`: fica observando e integra a cada arquivo novo (use junto com o Studio).
- `npm run render:13-anos-depois`: integra e renderiza o MP4 em `out/`.
- `npm run render:13-anos-depois-pos`: versão para depois de 19/11/2026.

Use só materiais que você tem direito de usar.
