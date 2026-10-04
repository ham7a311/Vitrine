// Prompt guard: every non-theme variant set must describe only the selected option.
// Run: node --experimental-strip-types scripts/check-prompts.mts (part of `npm run registry`).
import { readFileSync } from "node:fs";
import path from "node:path";
import { isThemeOnly, type ComponentMeta } from "../src/registry/types.ts";

const root = path.resolve(import.meta.dirname, "../src/registry");
const order = readFileSync(path.join(root, "order.txt"), "utf8").split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const mentions = (text: string, term: string) => new RegExp(`(^|[^a-z0-9])${esc(term.toLowerCase())}($|[^a-z0-9])`).test(text.toLowerCase());
// Option names that are also ordinary words the base prompt may need ("a cycle", "on paper").
const terms = (v: { id: string; label: string }) => [...new Set([v.label.toLowerCase(), v.id.replace(/-/g, " ").toLowerCase()])].filter((t) => t.length > 2);

const errors: string[] = [];
let audited = 0, states = 0;
for (const p of order) {
  const { meta } = (await import(path.join(root, p, "meta.ts"))) as { meta: ComponentMeta };
  const vs = meta.variants;
  if (!vs || vs.length < 2 || isThemeOnly(vs)) continue;
  audited++;
  if (process.argv.includes("--list")) console.log(`${p} | ${vs.map((v) => `${v.id}=${v.label}`).join(", ")}`);
  const allow = new Set((meta.promptAllow ?? []).map((t) => t.toLowerCase()));
  for (const v of vs) {
    states++;
    if (!v.prompt?.trim()) errors.push(`${meta.slug}: variant "${v.id}" has no prompt`);
    for (const t of terms(v)) if (!allow.has(t.toLowerCase()) && mentions(meta.prompt, t)) errors.push(`${meta.slug}: base prompt names option "${t}"`);
    for (const o of vs) if (o !== v && v.prompt) for (const t of terms(o)) if (!allow.has(t.toLowerCase()) && !terms(v).some((x) => mentions(x, t)) && mentions(v.prompt, t)) errors.push(`${meta.slug}: "${v.id}" prompt names sibling "${t}"`);
  }
}
console.log(`prompt guard: ${audited} configurable components, ${states} variant states`);
if (errors.length) {
  console.error([...new Set(errors)].join("\n"));
  console.error(`${new Set(errors).size} prompt problems`);
  process.exit(1);
}
