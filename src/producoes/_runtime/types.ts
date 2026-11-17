import type { TransitionPresetName } from "../../motion";

/** Estilo de uma cena (ou da produção inteira). */
export type Estilo = "base" | "calmo" | "vibrante" | "misto";
export type Transicao = TransitionPresetName | "corte";

/** Uma cena do roteiro, já convertida para a linha do tempo. */
export type CenaRoteiro = {
  id: string;
  nome: string;
  /** Duração em segundos (sem contar a transição de saída). */
  duracao: number;
  estilo?: Estilo;
  /** Transição para a PRÓXIMA cena. */
  transicao?: Transicao;
  /** Texto principal (aceita *destaque* e \n). */
  texto?: string;
  /** Linha secundária. */
  apoio?: string;
  /** Rótulo pequeno acima do texto. */
  rotulo?: string;
  /** Imagem em public/producoes/<slug>/ (ex.: "imagens/produto.png"). */
  imagem?: string;
  /** Vídeo de fundo em public/producoes/<slug>/ (ex.: "videos/praia.mp4"). */
  video?: string;
  /** Descrição livre do visual (nota para quem vai produzir; não aparece no vídeo). */
  visual?: string;
};

export type TimelineProducao = {
  titulo: string;
  slug: string;
  fps: number;
  /** Estilo padrão das cenas. */
  estilo: Estilo;
  /** Trilha em public/producoes/<slug>/ (ex.: "audio/trilha.mp3"). */
  trilha?: string | null;
  cenas: CenaRoteiro[];
};
