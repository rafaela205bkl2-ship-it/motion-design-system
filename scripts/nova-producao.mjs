#!/usr/bin/env node
/**
 * Inicia (ou ressincroniza) uma produção a partir de um roteiro.
 *
 *   npm run nova-producao -- --nome "Lançamento App" --roteiro caminho/roteiro.md --formatos 9x16,16x9 --estilo calmo
 *   npm run nova-producao -- --nome "Teste" --dry-run           (só mostra o que faria)
 *   npm run nova-producao -- --sincronizar lancamento-app       (regera timeline.json após editar o roteiro)
 *
 * Cria:
 *   producoes/<slug>/roteiro.md, briefing.md, referencias.md   (entradas da produção)
 *   public/producoes/<slug>/{imagens,videos,audio}/             (materiais, servidos por staticFile)
 *   src/producoes/<slug>/timeline.json + Producao.tsx           (vídeo, usando só a biblioteca)
 *   e registra as composições em src/producoes/registry.tsx.
 *
 * Nunca sobrescreve uma produção existente (exceto timeline.json no modo --sincronizar).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FORMATOS = { "9x16": [1080, 1920], "16x9": [1920, 1080], "1x1": [1080, 1080] };
const ESTILOS = ["base", "calmo", "vibrante", "misto"];
const TRANSICOES = ["radial-rapido", "radial-suave", "dissolve", "fade-branco", "faixa-diagonal", "corte"];

// ------------------------------------------------------------------ argumentos
const argv = process.argv.slice(2);
const arg = (k, def) => {
  const i = argv.indexOf(`--${k}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : def;
};
const flag = (k) => argv.includes(`--${k}`);
const dry = flag("dry-run");
const avisos = [];
const erros = [];

const semAcento = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const slugify = (s) =>
  semAcento(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
const camel = (s) => s.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());

// ------------------------------------------------------------------ roteiro → timeline
export const parseRoteiro = (md) => {
  const fm = {};
  let body = md;
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(md);
  if (m) {
    body = md.slice(m[0].length);
    for (const line of m[1].split("\n")) {
      const kv = /^\s*([^:#]+?)\s*:\s*(.*)$/.exec(line);
      if (kv) fm[semAcento(kv[1]).toLowerCase()] = kv[2].trim();
    }
  }
  const cenas = [];
  const blocos = body.split(/^##\s+/m).slice(1);
  blocos.forEach((bloco, i) => {
    const [titulo, ...linhas] = bloco.split("\n");
    const c = { id: `cena-${i + 1}`, nome: titulo.replace(/^cena\s*\d+\s*[—–-]\s*/i, "").trim() || `Cena ${i + 1}` };
    for (const line of linhas) {
      const kv = /^\s*[-*]?\s*([A-Za-zÀ-ÿ ]+?)\s*:\s*(.+)$/.exec(line);
      if (!kv) continue;
      const k = semAcento(kv[1]).toLowerCase().trim();
      const v = kv[2].trim();
      if (k === "duracao") c.duracao = parseFloat(v.replace(",", ".").replace(/[^\d.]/g, ""));
      else if (["estilo", "transicao", "rotulo", "texto", "apoio", "imagem", "video", "visual"].includes(k))
        c[k] = k === "texto" || k === "apoio" ? v.replace(/\\n/g, "\n") : v;
    }
    cenas.push(c);
  });
  return { fm, cenas };
};

const validar = (tl, slug) => {
  if (!ESTILOS.includes(tl.estilo)) erros.push(`estilo da produção inválido: "${tl.estilo}" (use ${ESTILOS.join(", ")})`);
  if (!tl.cenas.length) erros.push("o roteiro não tem cenas (cada cena começa com '## ')");
  tl.cenas.forEach((c, i) => {
    const onde = `${c.id} (${c.nome})`;
    if (!(c.duracao > 0)) {
      avisos.push(`${onde}: sem "duração" válida — usando 3 s`);
      c.duracao = 3;
    }
    if (c.estilo && !ESTILOS.includes(c.estilo)) erros.push(`${onde}: estilo "${c.estilo}" inválido`);
    if (c.transicao && !TRANSICOES.includes(c.transicao)) erros.push(`${onde}: transição "${c.transicao}" inválida (use ${TRANSICOES.join(", ")})`);
    if (!c.texto && !c.imagem && !c.video) avisos.push(`${onde}: sem texto, imagem nem vídeo — cena ficará vazia no animatic`);
    if (c.texto && c.texto.replace(/\*/g, "").length > 48) avisos.push(`${onde}: texto com ${c.texto.length} caracteres — no 9:16 quebra em muitas linhas; prefira ≤ 48`);
    for (const k of ["imagem", "video"]) {
      if (c[k] && !existsSync(join(ROOT, "public/producoes", slug, c[k]))) avisos.push(`${onde}: ${k} "${c[k]}" ainda não está em public/producoes/${slug}/`);
    }
    if (i === tl.cenas.length - 1 && c.transicao) delete c.transicao;
  });
  if (tl.trilha && !existsSync(join(ROOT, "public/producoes", slug, tl.trilha))) avisos.push(`trilha "${tl.trilha}" ainda não está em public/producoes/${slug}/`);
};

const montarTimeline = (md, slug, estiloCli) => {
  const { fm, cenas } = parseRoteiro(md);
  return {
    tl: {
      titulo: fm.titulo ?? slug,
      slug,
      fps: 30,
      estilo: estiloCli ?? fm.estilo ?? "base",
      trilha: fm.trilha || null,
      cenas,
    },
    formatos: fm.formatos,
  };
};

// ------------------------------------------------------------------ escrita
const write = (rel, content) => {
  const p = join(ROOT, rel);
  if (dry) return console.log(`  [dry-run] escreveria ${rel}`);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  console.log(`  criado  ${rel}`);
};

const producaoTsx = (slug) => `/**
 * Produção "${slug}". Gerado por \`npm run nova-producao\`.
 *
 * - O conteúdo vem de timeline.json (gerado a partir de producoes/${slug}/roteiro.md).
 *   Depois de editar o roteiro: npm run nova-producao -- --sincronizar ${slug}
 * - Para trocar uma cena do animatic por uma cena própria, crie o componente
 *   (usando a biblioteca em src/motion) e passe em \`cenas\`, ex.: { "cena-2": MinhaCena }.
 */
import { ProducaoGenerica, duracaoProducao } from "../_runtime/ProducaoGenerica";
import type { TimelineProducao } from "../_runtime/types";
import timelineJson from "./timeline.json";

const timeline = timelineJson as TimelineProducao;

export const DURACAO = duracaoProducao(timeline);

export const Producao = () => <ProducaoGenerica timeline={timeline} cenas={{}} />;
`;

const registrar = (slug, formatos) => {
  const p = join(ROOT, "src/producoes/registry.tsx");
  let s = readFileSync(p, "utf8");
  const id = camel(slug);
  if (s.includes(`./${slug}/Producao`)) return console.log("  registry já contém a produção");
  if (!s.includes('import { Composition, Folder } from "remotion";'))
    s = s.replace('import { Folder } from "remotion";', 'import { Composition, Folder } from "remotion";');
  s = s.replace(
    "// </importacoes-producoes>",
    `import { DURACAO as D${id}, Producao as P${id} } from "./${slug}/Producao";\n// </importacoes-producoes>`,
  );
  const comps = formatos
    .map((f) => {
      const [w, h] = FORMATOS[f];
      return `      <Composition id="${slug}-${f}" component={P${id}} durationInFrames={D${id}} fps={30} width={${w}} height={${h}} />`;
    })
    .join("\n");
  s = s.replace("      {/* </composicoes-producoes> */}", `${comps}\n      {/* </composicoes-producoes> */}`);
  if (dry) return console.log("  [dry-run] registraria em src/producoes/registry.tsx:\n" + comps);
  writeFileSync(p, s);
  console.log("  atualizado src/producoes/registry.tsx");
};

const relatorio = (tl) => {
  const total = tl.cenas.reduce((a, c) => a + c.duracao, 0);
  console.log(`\nRoteiro: "${tl.titulo}" · estilo ${tl.estilo} · ${tl.cenas.length} cenas · ~${total.toFixed(1)} s (antes das sobreposições)`);
  tl.cenas.forEach((c) =>
    console.log(`  ${c.id.padEnd(8)} ${String(c.duracao).padStart(4)}s  ${(c.estilo ?? tl.estilo).padEnd(8)} ${(c.transicao ?? (c === tl.cenas.at(-1) ? "—" : "dissolve")).padEnd(13)} ${c.nome}`),
  );
  if (avisos.length) console.log("\nAvisos:\n" + avisos.map((a) => "  ! " + a).join("\n"));
  if (erros.length) {
    console.error("\nErros:\n" + erros.map((e) => "  ✗ " + e).join("\n"));
    process.exit(1);
  }
};

// ------------------------------------------------------------------ modos
const sinc = arg("sincronizar");
if (sinc) {
  const roteiro = join(ROOT, "producoes", sinc, "roteiro.md");
  if (!existsSync(roteiro)) {
    console.error(`Não encontrei producoes/${sinc}/roteiro.md`);
    process.exit(1);
  }
  const { tl } = montarTimeline(readFileSync(roteiro, "utf8"), sinc, arg("estilo"));
  validar(tl, sinc);
  relatorio(tl);
  write(`src/producoes/${sinc}/timeline.json`, JSON.stringify(tl, null, 2) + "\n");
  process.exit(0);
}

const nome = arg("nome");
if (!nome) {
  console.error('Uso: npm run nova-producao -- --nome "Nome da produção" [--roteiro arquivo.md] [--formatos 9x16,16x9,1x1] [--estilo base|calmo|vibrante|misto] [--dry-run]\n     npm run nova-producao -- --sincronizar <slug>');
  process.exit(1);
}
const slug = slugify(nome);
if (!slug) {
  console.error("Nome inválido.");
  process.exit(1);
}
for (const dir of [`producoes/${slug}`, `src/producoes/${slug}`]) {
  if (existsSync(join(ROOT, dir))) {
    console.error(`Já existe ${dir}. Escolha outro nome ou use --sincronizar ${slug}.`);
    process.exit(1);
  }
}

const roteiroArg = arg("roteiro");
const modelo = join(ROOT, "producoes/_modelo/roteiro.md");
const roteiroPath = roteiroArg ? resolve(process.cwd(), roteiroArg) : modelo;
if (!existsSync(roteiroPath)) {
  console.error(`Roteiro não encontrado: ${roteiroPath}`);
  process.exit(1);
}
let md = readFileSync(roteiroPath, "utf8");
if (!roteiroArg) md = md.replace(/^titulo:.*$/m, `titulo: ${nome}`);
const { tl, formatos: fmFormatos } = montarTimeline(md, slug, arg("estilo"));
if (!roteiroArg) tl.titulo = nome;
const formatos = (arg("formatos") ?? fmFormatos ?? "9x16").split(/[,\s]+/).filter(Boolean);
for (const f of formatos) if (!FORMATOS[f]) erros.push(`formato "${f}" inválido (use 9x16, 16x9, 1x1)`);
validar(tl, slug);
relatorio(tl);

console.log(`\nCriando produção "${slug}" (${formatos.join(", ")})${dry ? " — simulação" : ""}:`);
write(`producoes/${slug}/roteiro.md`, md);
for (const f of ["briefing.md", "referencias.md"]) {
  write(`producoes/${slug}/${f}`, readFileSync(join(ROOT, "producoes/_modelo", f), "utf8").replace(/\{\{titulo\}\}/g, tl.titulo));
}
for (const d of ["imagens", "videos", "audio"]) write(`public/producoes/${slug}/${d}/.gitkeep`, "");
write(`src/producoes/${slug}/timeline.json`, JSON.stringify(tl, null, 2) + "\n");
write(`src/producoes/${slug}/Producao.tsx`, producaoTsx(slug));
registrar(slug, formatos);

console.log(`
Próximos passos:
  1. Coloque imagens, vídeos e áudio em public/producoes/${slug}/ (imagens/, videos/, audio/)
  2. Edite producoes/${slug}/roteiro.md e rode: npm run nova-producao -- --sincronizar ${slug}
  3. Abra o Studio (npm run dev) → pasta Producoes → ${slug}-${formatos[0]}
  4. Refine cenas com componentes próprios (veja PRODUCTION_WORKFLOW.md, etapa 5)`);
if (roteiroArg && !dry) copyFileSync(roteiroPath, join(ROOT, `producoes/${slug}/roteiro.original.md`));
