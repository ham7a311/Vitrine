/* Shared vocabulary for briefing an agent: modes, models, effort, files and context arithmetic. */

export type ModeId = "agent" | "plan" | "debug" | "multitask" | "ask";
export type Mode = { id: ModeId; name: string; does: string; can: string };

export const MODES: Mode[] = [
  { id: "agent", name: "Agent", does: "Edits files and runs commands until the task is done.", can: "edits · runs commands" },
  { id: "plan", name: "Plan", does: "Proposes steps for you to approve before any edit.", can: "reads · writes a plan" },
  { id: "debug", name: "Debug", does: "Reproduces the problem, adds logging, narrows the cause.", can: "reads · runs commands" },
  { id: "multitask", name: "Multitask", does: "Each line becomes its own task, run side by side.", can: "edits · one branch per line" },
  { id: "ask", name: "Ask", does: "Answers from what it can see. Changes nothing.", can: "reads" },
];

export type ModelId = "astra" | "opus" | "grok";
export type Maker = "openai" | "claude" | "xai";
export type Model = { id: ModelId; name: string; short: string; maker: Maker; window: number };

export const MODELS: Model[] = [
  { id: "astra", name: "GPT-6 Astra", short: "Astra", maker: "openai", window: 400_000 },
  { id: "opus", name: "Claude Opus 5.5", short: "Opus 5.5", maker: "claude", window: 1_000_000 },
  { id: "grok", name: "Grok 4.7", short: "Grok 4.7", maker: "xai", window: 256_000 },
];

export const EFFORTS = ["Low", "Medium", "High", "XHigh", "Max"] as const;
export const EFFORT_LABEL = ["Low", "Medium", "High", "Extra High", "Max"];
export const EFFORT_HINT = [
  "Answers straight away. Best for small, clear asks.",
  "Thinks briefly before acting.",
  "Thinks through the task before each step.",
  "Checks its own work as it goes. Slower.",
  "Slowest. Reserves the most room for thinking.",
];
const RESERVE = [0.01, 0.03, 0.06, 0.1, 0.16];

export type File = { path: string; tokens: number };
export const FILES: File[] = [
  { path: "exporter/invoice-export.ts", tokens: 6200 },
  { path: "exporter/csv-writer.ts", tokens: 2900 },
  { path: "exporter/retry.ts", tokens: 1400 },
  { path: "queue/worker.ts", tokens: 5100 },
  { path: "ledger/schema.sql", tokens: 8800 },
  { path: "README.md", tokens: 2300 },
  { path: "logs/export-friday.log", tokens: 21400 },
];
export const fileName = (p: string) => p.slice(p.lastIndexOf("/") + 1);

const BASE = 121_600; // instructions + conversation so far

export function usage(files: string[], effort: number, model: Model) {
  const f = files.reduce((a, p) => a + (FILES.find((x) => x.path === p)?.tokens ?? 0), 0);
  const used = BASE + f + Math.round(model.window * RESERVE[effort]);
  return { files: f, used, window: model.window, pct: Math.min(1, used / model.window) };
}

export const fmt = (n: number) => (n >= 1_000_000 ? `${+(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${+(n / 1000).toFixed(n >= 100_000 ? 0 : 1)}k` : String(n));
