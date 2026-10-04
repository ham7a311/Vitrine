import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

const DIR = path.join(process.cwd(), "src", "workshop", "skills");

/** The raw SKILL.md, plus its frontmatter. Throws if the frontmatter is missing a name or description. */
export async function loadSkill(slug: string) {
  const raw = await readFile(path.join(DIR, slug, "SKILL.md"), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
  const front = Object.fromEntries((m?.[1] ?? "").split("\n").map((l) => [l.slice(0, l.indexOf(":")).trim(), l.slice(l.indexOf(":") + 1).trim()]));
  if (!front.name || !front.description) throw new Error(`SKILL.md for "${slug}" needs a name and a description`);
  return { raw, body: raw.slice(m?.[0].length ?? 0), name: front.name as string, description: front.description as string };
}
