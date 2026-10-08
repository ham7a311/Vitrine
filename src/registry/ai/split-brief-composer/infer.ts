/* Reading suggestions out of a prompt. Deterministic keyword rules, and every guess says why it was made. */
import { FILES, MODES, type ModeId, type ModelId } from "./brief";

export type Guess<T> = { value: T; why: string };
export type Inferred = { task: string; mode: Guess<ModeId>; model: Guess<ModelId>; effort: Guess<number>; files: Guess<string[]> };

const FILE_WORDS: Record<string, string[]> = {
  "exporter/invoice-export.ts": ["invoice", "exporter", "export"],
  "exporter/csv-writer.ts": ["csv"],
  "exporter/retry.ts": ["retry", "retries", "backoff", "back off"],
  "queue/worker.ts": ["worker", "queue", "job"],
  "ledger/schema.sql": ["schema", "database", "table", "migration"],
  "README.md": ["readme", "docs", "documentation"],
  "logs/export-friday.log": ["friday", "fridays", "timeout", "time out", "times out", "timed out", "log"],
};

const has = (text: string, words: string[]) => words.find((w) => new RegExp(`\\b${w.replace(/ /g, "\\s+")}\\b`, "i").test(text));
const quote = (w: string) => `“${w}”`;

export function infer(prompt: string): Inferred {
  const text = prompt.trim();
  const lines = text.split("\n").filter((l) => l.trim());
  const first = (text.split(/(?<=[.!?])\s|\n/)[0] ?? "").trim();
  const task = first.length > 64 ? first.slice(0, 62).trimEnd() + "…" : first;

  /* files the prompt mentions */
  const files: string[] = [];
  const hits: string[] = [];
  for (const f of FILES) {
    const w = has(text, FILE_WORDS[f.path] ?? []);
    if (w) { files.push(f.path); if (!hits.includes(w)) hits.push(w); }
  }
  const filesWhy = files.length ? `you mentioned ${hits.slice(0, 2).map(quote).join(" and ")}` : "nothing in the repo was named";

  /* mode */
  let mode: Guess<ModeId>;
  const dbg = has(text, ["bug", "broken", "fails", "failing", "error", "crash", "crashes", "timeout", "time out", "times out", "timed out", "flaky", "investigate", "find out why", "why does"]);
  const pln = has(text, ["plan", "design", "approach", "migrate", "propose", "strategy", "how should"]);
  // A question is one that ends in a question mark or opens with a question word, not any "why".
  const opener = /^(why|what|how|where|when|which|explain|does|is|are|can)\b/i.exec(text)?.[1];
  const ask = /\?\s*$/.test(text) || opener;
  if (lines.length >= 2) mode = { value: "multitask", why: `${lines.length} lines, one task each` };
  else if (dbg) mode = { value: "debug", why: `you wrote ${quote(dbg)}` };
  else if (pln) mode = { value: "plan", why: `you wrote ${quote(pln)}` };
  else if (ask) mode = { value: "ask", why: opener ? `it's a question (${quote(opener.toLowerCase())}…)` : "it ends in a question mark" };
  else mode = { value: "agent", why: "it asks for a change" };

  /* effort */
  const base: Record<ModeId, number> = { ask: 1, plan: 2, debug: 2, agent: 2, multitask: 1 };
  let effort = base[mode.value];
  let effortWhy = `usual for ${MODES.find((m) => m.id === mode.value)!.name}`;
  const careful = has(text, ["carefully", "safely", "without downtime", "production", "byte-identical", "don't break", "thorough"]);
  const maxed = has(text, ["critical", "as thorough as possible", "max"]);
  const light = has(text, ["quick", "quickly", "just", "small", "tiny", "typo", "rename", "simple"]);
  if (maxed) { effort = 4; effortWhy = `you wrote ${quote(maxed)}`; }
  else if (careful) { effort += 1; effortWhy = `you wrote ${quote(careful)}`; }
  else if (light) { effort -= 1; effortWhy = `you wrote ${quote(light)}`; }
  effort = Math.max(0, Math.min(4, effort));

  /* model */
  const tokens = files.reduce((a, p) => a + (FILES.find((f) => f.path === p)?.tokens ?? 0), 0);
  let model: Guess<ModelId>;
  if (effort >= 3 || mode.value === "plan" || tokens > 20_000) model = { value: "opus", why: tokens > 20_000 ? "a lot to read" : "long, careful work" };
  else if (effort <= 0 || (mode.value === "ask" && !files.length)) model = { value: "grok", why: "a quick answer" };
  else model = { value: "astra", why: "a fast first draft" };

  return { task, mode, model, effort: { value: effort, why: effortWhy }, files: { value: files, why: filesWhy } };
}
