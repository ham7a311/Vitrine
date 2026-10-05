import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { site } from "../src/site.config.ts";
const root = path.resolve(import.meta.dirname, "../src");
const components = new Map<string, any>();
for (const entry of readFileSync(path.join(root, "registry/order.txt"), "utf8").split("\n").filter(s => s && !s.startsWith("#"))) {
  const { meta } = await import(path.join(root, "registry", entry, "meta.ts")); components.set(meta.slug, meta);
}
const { outputText } = ts.transpileModule(readFileSync(path.join(root, "workshop/recipes.ts"), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
const mod = { exports: {} as any };
new Function("require", "module", "exports", outputText)((id: string) => {
  if (id === "@/registry") return { getComponent: (slug: string) => components.get(slug) };
  if (id === "@/site.config") return { site };
  throw new Error(`Unexpected recipe dependency: ${id}`);
}, mod, mod.exports);
for (const recipe of mod.exports.RECIPES) {
  const brief = mod.exports.buildBrief(recipe);
  assert(brief.includes(recipe.name) && brief.includes("## Before you ship"), recipe.slug);
  for (const section of recipe.sections) assert(brief.includes(`${site.url}/components/${section.component}`), `${recipe.slug}: missing component source`);
  assert(!brief.includes("undefined") && !brief.includes("[object Object]"), `${recipe.slug}: malformed brief`);
}
const { SKILLS } = await import("../src/workshop/skills.ts");
const folders = readdirSync(path.join(root, "workshop/skills"));
assert.equal(folders.length, SKILLS.length, "Unregistered skill folders");
for (const skill of SKILLS) {
  const raw = readFileSync(path.join(root, "workshop/skills", skill.slug, "SKILL.md"), "utf8");
  assert(raw.startsWith(`---\nname: ${skill.slug}\n`), `${skill.slug}: frontmatter name`);
  assert(/^description: .+/m.test(raw), `${skill.slug}: description`);
  assert(raw.includes(`# /${skill.slug}`), `${skill.slug}: command heading`);
  assert.equal((raw.match(/^```/gm) ?? []).length % 2, 0, `${skill.slug}: unclosed code fence`);
}
console.log(`workshop: ${mod.exports.RECIPES.length} recipe briefs and ${SKILLS.length} skill prompts validated`);
