import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { sourceBundle } from "../src/lib/source-bundle.ts";
import { composePrompt, componentBrief, type ComponentMeta, CATEGORIES } from "../src/registry/types.ts";

const root = path.resolve(import.meta.dirname, "../src/registry");
const order = readFileSync(path.join(root, "order.txt"), "utf8").split("\n").map(s => s.trim()).filter(s => s && !s.startsWith("#"));
assert.equal(new Set(order).size, order.length, "Duplicate registry entries");
const slugs = new Set<string>();
const classes = new Map<string, Set<string>>();
let variants = 0, exported = 0, fresh = 0;
// The "New" label is kept to the newest components only; scripts/limit-new.py re-applies the rule.
const NEW_LIMIT = 50;
const errors: string[] = [];
for (const entry of order) {
  const { meta } = await import(path.join(root, entry, "meta.ts")) as { meta: ComponentMeta };
  assert.equal(`${meta.category}/${meta.slug}`, entry, `Registry identity: ${entry}`);
  if (meta.isNew) fresh++;
  assert(!slugs.has(meta.slug), `Duplicate slug: ${meta.slug}`); slugs.add(meta.slug);
  assert(CATEGORIES.some(c => c.id === meta.category), `Unknown category: ${entry}`);
  for (const key of ["name", "description", "prompt", "interaction", "animation", "a11y", "responsive"] as const) assert(meta[key]?.trim(), `${entry}: empty ${key}`);
  assert(meta.prompt.length >= 120, `${entry}: design prompt lacks detail`);
  const ids = meta.variants?.map(v => v.id) ?? [];
  assert.equal(new Set(ids).size, ids.length, `${entry}: duplicate variant ids`);
  for (const v of meta.variants ?? []) {
    assert(v.id && v.label, `${entry}: empty variant`);
    const text = componentBrief(meta, v.id);
    assert(text.includes(meta.a11y) && text.includes(meta.responsive), `${entry}: missing behavior contract`);
    assert(text.includes(`Selected variant — ${v.label} (${v.id}):`), `${entry}: prompt selection lost`);
    assert(!/\bundefined\b|\[object Object\]/.test(text), `${entry}: malformed prompt`);
    variants++;
  }
  const fallback = composePrompt(meta.prompt, meta.variants, "not-a-real-variant");
  assert.equal(fallback, composePrompt(meta.prompt, meta.variants, ids[0]), `${entry}: invalid variant fallback`);
  const bundle = await sourceBundle(meta, root);
  assert(bundle.some(f => f.name === "usage.tsx"), `${entry}: missing usage`);
  exported += bundle.length;
  const source = bundle.map(f => f.code).join("\n");
  for (const v of meta.variants ?? []) assert(source.includes(v.id), `${entry}: variant ${v.id} has no source representation`);
  for (const name of readdirSync(path.join(root, entry)).filter(f => f.endsWith(".css"))) {
    const css = readFileSync(path.join(root, entry, name), "utf8");
    // Every local selector is owned by one component; state modifiers may be shared.
    for (const m of css.matchAll(/(?<![\w-])\.([a-z][\w-]*)/g)) {
      if (/^(is-|has-)/.test(m[1])) continue;
      const owners = classes.get(m[1]) ?? new Set<string>(); owners.add(entry); classes.set(m[1], owners);
    }
  }
}
if (fresh > NEW_LIMIT) errors.push(`${fresh} components are marked New; keep it to the newest ${NEW_LIMIT} (run python3 scripts/limit-new.py)`);
for (const [name, owners] of classes) if (owners.size > 1) errors.push(`CSS .${name} shared by ${[...owners].join(", ")}`);
for (const file of ["index.ts", "demos.tsx"]) {
  const code = readFileSync(path.join(root, file), "utf8");
  for (const entry of order) assert(code.includes(`./${entry}/${file === "index.ts" ? "meta" : "demo"}`), `${file}: missing ${entry}`);
}
if (errors.length) throw new Error(errors.join("\n"));
console.log(`registry: ${order.length} components (${fresh} new), ${variants} variants, ${exported} portable files; no CSS collisions`);
