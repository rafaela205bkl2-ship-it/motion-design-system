/**
 * Consulta e valida o catálogo da biblioteca.
 *
 *   npm run catalogo                 lista tudo
 *   npm run catalogo -- texto        filtra por termo (nome, tipo ou descrição)
 *   npm run catalogo -- --validar    falha se o catálogo e o index.ts divergirem
 *
 * Lê src/motion/catalog.ts diretamente (sem carregar componentes/fontes).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { catalog } from "../src/motion/catalog";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

/** Nomes de valores exportados por src/motion/index.ts (ignora `export type`). */
const exportedNames = (): string[] => {
  const src = readFileSync(join(root, "src/motion/index.ts"), "utf8");
  const names = new Set<string>();
  for (const m of src.matchAll(/export\s+\{([^}]*)\}\s+from\s+"([^"]+)"/g)) {
    m[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((n) => names.add(n.split(/\s+as\s+/).pop()!));
  }
  for (const m of src.matchAll(/export\s+\*\s+from\s+"([^"]+)"/g)) {
    const file = join(root, "src/motion", `${m[1]}.ts`);
    const mod = readFileSync(file, "utf8");
    for (const d of mod.matchAll(/export\s+(?:const|function|class)\s+(\w+)/g))
      names.add(d[1]);
  }
  return [...names].sort();
};

if (args.includes("--validar")) {
  const exported = new Set(exportedNames());
  const documented = new Set(catalog.map((c) => c.name));
  const missing = [...exported].filter((n) => !documented.has(n));
  const stale = [...documented].filter((n) => !exported.has(n));
  if (missing.length || stale.length) {
    if (missing.length)
      console.error(
        "Exportado mas sem entrada no catálogo:",
        missing.join(", "),
      );
    if (stale.length)
      console.error("No catálogo mas não exportado:", stale.join(", "));
    process.exit(1);
  }
  console.log(
    `Catálogo válido: ${documented.size} entradas, todas exportadas por src/motion/index.ts.`,
  );
  process.exit(0);
}

const term = args.join(" ").toLowerCase();
const rows = catalog.filter(
  (c) =>
    !term ||
    [c.name, c.kind, c.description].join(" ").toLowerCase().includes(term),
);
const byKind = new Map<string, typeof rows>();
for (const r of rows) byKind.set(r.kind, [...(byKind.get(r.kind) ?? []), r]);
for (const [kind, items] of byKind) {
  console.log(`\n${kind.toUpperCase()}`);
  for (const c of items) {
    console.log(`  ${c.name.padEnd(22)} ${c.description}`);
    if (c.props) console.log(`  ${"".padEnd(22)} props: ${c.props.join(", ")}`);
    if (c.example) console.log(`  ${"".padEnd(22)} ex.: ${c.example}`);
  }
}
console.log(
  `\n${rows.length} itens · importe de "./motion" (ou caminho relativo até src/motion)`,
);
