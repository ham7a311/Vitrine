import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createSourceHighlighter } from "../src/lib/highlight.ts";
import { sourceBundle } from "../src/lib/source-bundle.ts";

/**
 * Writes each component's portable source, highlighted, to public/source/<slug>.<hash>.json, and the
 * slug → file map to source-manifest.json for the component pages. Runs before every build, and on
 * every registry change while the dev server runs (scripts/dev.mts), so the pages never carry the
 * source themselves and a changed file always gets a new URL.
 */
const project = path.resolve(import.meta.dirname, "..");
const root = path.join(project, "src/registry");
const out = path.join(project, "public/source");
const manifestFile = path.join(project, "source-manifest.json");
const sha = (s: string) => createHash("sha256").update(s).digest("hex");

type Highlight = (name: string, code: string) => string;
let previous = new Map<string, string>();

export async function writeSource(highlight?: Highlight) {
  highlight ??= await createSourceHighlighter();
  // Only files whose code changed since the last run are highlighted again.
  const highlighted = new Map<string, string>();
  const cached: Highlight = (name, code) => {
    const key = sha(`${name}\0${code}`);
    const html = previous.get(key) ?? highlight(name, code);
    highlighted.set(key, html);
    return html;
  };
  mkdirSync(out, { recursive: true });
  const entries = readFileSync(path.join(root, "order.txt"), "utf8").split("\n").filter((s) => s && !s.startsWith("#"));
  const manifest: Record<string, string> = {};
  const written = new Set<string>();
  let bytes = 0;
  for (const entry of entries) {
    // A fresh query each run, so a long-running watcher sees edits to meta.ts too.
    const { meta } = await import(`${pathToFileURL(path.join(root, entry, "meta.ts")).href}?t=${Date.now()}`);
    if (!/^[a-z0-9-]+$/.test(meta.slug)) throw new Error(`Unexpected slug: ${meta.slug}`);
    const files = (await sourceBundle(meta, root)).map((f) => ({ ...f, html: cached(f.name, f.code) }));
    const json = JSON.stringify({ files });
    const file = `${meta.slug}.${sha(json).slice(0, 12)}.json`;
    if (!existsSync(path.join(out, file))) writeFileSync(path.join(out, file), json);
    manifest[meta.slug] = `/source/${file}`;
    written.add(file);
    bytes += Buffer.byteLength(json);
  }
  previous = highlighted;
  // The new manifest goes in whole before any old file is removed.
  writeFileSync(`${manifestFile}.tmp`, JSON.stringify(manifest, null, 2) + "\n");
  renameSync(`${manifestFile}.tmp`, manifestFile);
  for (const file of readdirSync(out)) if (!written.has(file)) rmSync(path.join(out, file));
  return { components: entries.length, bytes };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { components, bytes } = await writeSource();
  console.log(`source: ${components} components written to public/source (${(bytes / 1e6).toFixed(1)} MB)`);
}
