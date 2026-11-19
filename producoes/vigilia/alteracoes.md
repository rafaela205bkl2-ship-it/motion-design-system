# Alterações — versão 1 (19/11/2026)

## O que foi feito

**Separação da arte em camadas** (`scripts/separar-camadas.py`, genérico, lê `producoes/vigilia/arte/camadas.json`):
- **Pessoas:** os contornos das duas fileiras foram traçados à mão, porque não havia modelo de recorte disponível. Viraram duas camadas: atrás e frente. Na camada de trás, a área da fileira da frente vira sombra, o que cria profundidade quando os planos se deslocam.
- **Título:** os traços foram extraídos por cor e separados letra por letra (7 PNGs). As partes cobertas pelas cabeças foram reconstruídas prolongando as hastes.
- **Informações:** cinco faixas (nomes, data, local, entrada e logos), com alfa por luminância.
- **Fundo:** pessoas, título e textos foram removidos por preenchimento. A arte de 4:5 foi estendida para 9:16, com reflexo desfocado acima e degradê abaixo.

**Biblioteca** (registrados no catálogo, reutilizáveis):

| Componente | Arquivo | Origem |
| --- | --- | --- |
| `LightLeak` | `layers/LightLeak.tsx` | ref-003: estouro de luz em 0–0,4 s e a cada ~14 s |
| `LightStreak` | `layers/LightStreak.tsx` | ref-003: riscos de luz em 0,4–1,3 s, 4,5 s, 9,0 s… |
| `Embers` | `layers/Embers.tsx` | ref-003: faíscas subindo durante a peça inteira |

**Cena** (`src/producoes/vigilia/CartazAnimado.tsx`): palco 3D com escala compensada, em que a composição fica idêntica à arte em repouso e a câmera gera paralaxe real.
- O estouro de luz abre a peça e tudo sai do desfoque.
- As letras do título caem e viram em 3D, em arco, com extrusão de 9 camadas.
- As fileiras sobem com luz queimada e as informações nascem em sequência.
- Cinco riscos de luz aparecem ao longo da peça: três na frente e dois entre as fileiras.
- Também entram faíscas, brilho quente na base, raios de luz atrás do título e duas faixas de brilho.
- Em 12,55 s há um acento de cor vermelho-laranja.
- No fim, a câmera mergulha na luz e o estouro fecha o loop.

**Instagram:**
- **Área de conteúdo:** de y ≈ 270 (título) a y ≈ 1450 (logos), fora das faixas superior (~250 px) e inferior (~380 px) da interface.
- **Margens laterais:** as informações foram reduzidas a 94 % para se afastarem dos botões laterais.

## Como refazer

```bash
npm run camadas -- producoes/vigilia/arte/camadas.json
```

```bash
python3 scripts/gerar-trilha-vigilia.py
```

```bash
npm run render:vigilia
```
