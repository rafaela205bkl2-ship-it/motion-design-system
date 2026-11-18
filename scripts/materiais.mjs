#!/usr/bin/env node
/**
 * Integra materiais (imagens e vídeos) de uma produção sem editar código.
 *
 * Cada produção que aceita materiais tem `src/producoes/<slug>/materiais.config.json`,
 * que diz qual pasta de `public/producoes/<slug>/materiais/` alimenta cada espaço do vídeo.
 * Este comando:
 *   1. lê as pastas;
 *   2. renomeia arquivos para nomes seguros (minúsculas, sem espaços nem acentos);
 *   3. converte vídeos que o navegador do render não lê (ex.: .mov HEVC do iPhone) para MP4 H.264
 *      (o original vai para `_originais/`, fora do vídeo);
 *   4. escreve `src/producoes/<slug>/materiais.gerado.json`, que as cenas leem.
 *
 * Uso:
 *   npm run materiais                    # todas as produções com materiais.config.json
 *   npm run materiais -- 13-anos-depois  # uma produção
 *   npm run materiais -- --watch         # fica observando e integra a cada arquivo novo
 *
 * Enquadramento sem código: termine o nome do arquivo de imagem com @XXxYY
 * (ex.: foto@72x35.jpg = recorte centrado em 72% da largura e 35% da altura).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.dirname(path.dirname(new URL(import.meta.url).pathname));
const IMAGEM = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const VIDEO = new Set([".mp4", ".mov", ".m4v", ".webm"]);
const IGNORAR = new Set([".gitkeep", "LEIA-ME.md", ".DS_Store", "Thumbs.db"]);

const args = process.argv.slice(2);
const watch = args.includes("--watch");
const slugsPedidos = args.filter((a) => !a.startsWith("--"));

const temFfmpeg = (() => {
  try {
    execFileSync("ffprobe", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();

const nomeSeguro = (nome) => {
  const ext = path.extname(nome).toLowerCase();
  const base = path
    .basename(nome, path.extname(nome))
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9@._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return (base || "arquivo") + ext;
};

const codecDoVideo = (arq) => {
  try {
    return execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=codec_name", "-of", "csv=p=0", arq])
      .toString()
      .trim();
  } catch {
    return "";
  }
};

/** Converte para MP4 H.264 30 fps, sem áudio, lado maior até 2160 px. Retorna o novo caminho. */
const converter = (arq, avisos) => {
  const dir = path.dirname(arq);
  const destino = path.join(dir, path.basename(arq, path.extname(arq)) + ".mp4");
  const origDir = path.join(dir, "_originais");
  fs.mkdirSync(origDir, { recursive: true });
  const original = path.join(origDir, path.basename(arq));
  fs.renameSync(arq, original);
  try {
    execFileSync(
      "ffmpeg",
      ["-loglevel", "error", "-y", "-i", original, "-an", "-r", "30", "-vf", "scale='if(gt(iw,ih),min(2160,iw),-2)':'if(gt(iw,ih),-2,min(2160,ih))'", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", destino],
      { stdio: "inherit" },
    );
    avisos.push(`convertido para MP4 H.264: ${path.relative(ROOT, destino)} (original em _originais/)`);
    return destino;
  } catch {
    fs.renameSync(original, arq);
    avisos.push(`não foi possível converter ${path.relative(ROOT, arq)}; exporte como MP4 H.264`);
    return null;
  }
};

const enquadramentoDoNome = (nome) => {
  const m = /@(\d{1,3})x(\d{1,3})(?=\.[a-z0-9]+$)/.exec(nome);
  return m ? `${Math.min(100, +m[1])}% ${Math.min(100, +m[2])}%` : undefined;
};

/** Lista arquivos de mídia de uma pasta (não recursivo), já saneados e convertidos. */
const lerPasta = (dir, tipos, avisos) => {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const nome of fs.readdirSync(dir).sort()) {
    if (IGNORAR.has(nome) || nome.startsWith(".") || nome.startsWith("_")) continue;
    let arq = path.join(dir, nome);
    if (fs.statSync(arq).isDirectory()) continue;
    const seguro = nomeSeguro(nome);
    if (seguro !== nome) {
      const novo = path.join(dir, seguro);
      if (!fs.existsSync(novo)) {
        fs.renameSync(arq, novo);
        avisos.push(`renomeado: "${nome}" → "${seguro}"`);
        arq = novo;
      }
    }
    const ext = path.extname(arq).toLowerCase();
    const ehImagem = IMAGEM.has(ext);
    const ehVideo = VIDEO.has(ext);
    if (!ehImagem && !ehVideo) {
      avisos.push(`ignorado (formato não aceito): ${path.relative(ROOT, arq)}`);
      continue;
    }
    if (tipos === "imagem" && !ehImagem) {
      avisos.push(`ignorado (esta pasta aceita só imagens): ${path.relative(ROOT, arq)}`);
      continue;
    }
    if (tipos === "video" && !ehVideo) {
      avisos.push(`ignorado (esta pasta aceita só vídeos): ${path.relative(ROOT, arq)}`);
      continue;
    }
    if (ehVideo && temFfmpeg) {
      const codec = codecDoVideo(arq);
      if (ext !== ".mp4" || (codec && codec !== "h264")) {
        const conv = converter(arq, avisos);
        if (!conv) continue;
        arq = conv;
      }
    }
    out.push({ arquivo: arq, tipo: ehImagem ? "imagem" : "video" });
  }
  return out;
};

const integrar = (slug) => {
  const cfgPath = path.join(ROOT, "src/producoes", slug, "materiais.config.json");
  const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  const base = path.join(ROOT, "public/producoes", slug, "materiais");
  const rel = (arq) => path.relative(path.join(ROOT, "public/producoes", slug), arq).split(path.sep).join("/");
  const avisos = [];
  const slots = {};
  const listas = {};

  for (const [pasta, def] of Object.entries(cfg.espacos ?? {})) {
    const arquivos = lerPasta(path.join(base, pasta), def.tipos, avisos);
    if (!arquivos.length) continue;
    const a = arquivos[0];
    if (arquivos.length > 1) avisos.push(`${pasta}: ${arquivos.length} arquivos; usando o primeiro em ordem alfabética (${path.basename(a.arquivo)})`);
    slots[def.espaco] = { arquivo: rel(a.arquivo), tipo: a.tipo, enquadramento: enquadramentoDoNome(path.basename(a.arquivo)) ?? def.enquadramento };
  }
  for (const [pasta, def] of Object.entries(cfg.listas ?? {})) {
    const arquivos = lerPasta(path.join(base, pasta), def.tipos, avisos);
    listas[def.lista] = arquivos.map((a) => ({ arquivo: rel(a.arquivo), tipo: a.tipo, enquadramento: enquadramentoDoNome(path.basename(a.arquivo)) }));
    if (def.maximo && arquivos.length > def.maximo) avisos.push(`${pasta}: ${arquivos.length} arquivos; a cena usa os ${def.maximo} primeiros`);
  }

  const gerado = { slug, gerado: "npm run materiais", espacos: slots, listas, avisos };
  const outPath = path.join(ROOT, "src/producoes", slug, "materiais.gerado.json");
  const novo = JSON.stringify(gerado, null, 2) + "\n";
  const antigo = fs.existsSync(outPath) ? fs.readFileSync(outPath, "utf8") : "";
  if (novo !== antigo) fs.writeFileSync(outPath, novo);

  const usados = Object.keys(slots).length;
  const total = Object.keys(cfg.espacos ?? {}).length;
  const lista = Object.entries(listas).map(([k, v]) => `${k}: ${v.length}`).join(", ");
  console.log(`[materiais] ${slug}: ${usados}/${total} espaços preenchidos${lista ? ` · ${lista}` : ""}`);
  for (const a of avisos) console.log(`  · ${a}`);
  if (!temFfmpeg) console.log("  · ffmpeg não encontrado: vídeos que não forem MP4 H.264 não serão convertidos");
};

const todas = () =>
  fs
    .readdirSync(path.join(ROOT, "src/producoes"))
    .filter((d) => fs.existsSync(path.join(ROOT, "src/producoes", d, "materiais.config.json")));

const slugs = slugsPedidos.length ? slugsPedidos : todas();
if (!slugs.length) {
  console.log("[materiais] nenhuma produção com materiais.config.json");
  process.exit(0);
}
for (const s of slugs) integrar(s);

if (watch) {
  console.log("[materiais] observando as pastas (Ctrl+C para sair)…");
  for (const s of slugs) {
    const dir = path.join(ROOT, "public/producoes", s, "materiais");
    let timer = null;
    fs.watch(dir, { recursive: true }, (_e, nome) => {
      if (nome && (nome.includes("_originais") || nome.endsWith(".tmp"))) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          integrar(s);
        } catch (e) {
          console.error(`[materiais] erro: ${e.message}`);
        }
      }, 800);
    });
  }
}
