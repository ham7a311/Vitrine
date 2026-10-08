/* Data and token arithmetic for the Agent Composer. Everything here is plain and deterministic. */

export type ModeId = "ask" | "plan" | "debug" | "multitask" | "agent";
export type Mode = { id: ModeId; name: string; verb: string; does: string; can: string; placeholder: string };

export const MODES: Mode[] = [
  { id: "ask", name: "Ask", verb: "Ask", does: "Answers from what it can see. Changes nothing.", can: "reads", placeholder: "Why does the invoice export sometimes write the same row twice?" },
  { id: "plan", name: "Plan", verb: "Draft plan", does: "Proposes steps for you to approve before any edit.", can: "reads · writes a plan", placeholder: "Plan how we move invoice exports onto the job queue without downtime." },
  { id: "debug", name: "Debug", verb: "Investigate", does: "Reproduces the problem, adds logging, narrows the cause.", can: "reads · runs commands", placeholder: "Exports over 10,000 rows time out on Fridays. Find out why." },
  { id: "multitask", name: "Multitask", verb: "Dispatch", does: "Each line becomes its own task, run side by side.", can: "edits · one branch per line", placeholder: "Rename InvoiceRow to LineItem across the exporter\nAdd a test for the empty-ledger case\nUpdate the export section of the README" },
  { id: "agent", name: "Agent", verb: "Run", does: "Edits files and runs commands until the task is done.", can: "edits · runs commands", placeholder: "Make the invoice exporter retry with backoff, and keep the CSV byte-identical." },
];

export type ModelId = "astra" | "opus" | "grok";
export type Maker = "openai" | "claude" | "xai";
export type Model = { id: ModelId; name: string; maker: Maker; makerName: string; window: number; note: string };

export const MODELS: Model[] = [
  { id: "astra", name: "GPT-6 Astra", maker: "openai", makerName: "OpenAI", window: 400_000, note: "Fast first drafts" },
  { id: "opus", name: "Claude Opus 5.5", maker: "claude", makerName: "Anthropic", window: 1_000_000, note: "Careful with long tasks" },
  { id: "grok", name: "Grok 4.7", maker: "xai", makerName: "xAI", window: 256_000, note: "Quick, terse answers" },
];

export const EFFORTS = ["Low", "Medium", "High", "XHigh", "Max"] as const;
/** How each level reads on screen. */
export const EFFORT_LABEL = ["Low", "Medium", "High", "Extra High", "Max"];
export const EFFORT_HINT = [
  "Answers straight away. Best for small, clear asks.",
  "Thinks briefly before acting.",
  "Thinks through the task before each step.",
  "Checks its own work as it goes. Slower.",
  "Slowest. Reserves the most room for thinking.",
];
/** Share of the window kept back for thinking at each effort level. */
const RESERVE = [0.01, 0.03, 0.06, 0.1, 0.16];

export type Node = { path: string; name: string; tokens: number; children?: Node[] };

const f = (dir: string, name: string, tokens: number): Node => ({ path: `${dir}/${name}`, name, tokens });

export const TREE: Node[] = [
  {
    path: "exporter", name: "exporter", tokens: 0, children: [
      f("exporter", "invoice-export.ts", 6200),
      f("exporter", "csv-writer.ts", 2900),
      f("exporter", "retry.ts", 1400),
      f("exporter", "invoice-export.test.ts", 4800),
    ],
  },
  {
    path: "queue", name: "queue", tokens: 0, children: [
      f("queue", "jobs.ts", 3600),
      f("queue", "worker.ts", 5100),
    ],
  },
  {
    path: "ledger", name: "ledger", tokens: 0, children: [
      f("ledger", "accounts.ts", 7400),
      f("ledger", "rounding.ts", 1900),
      f("ledger", "schema.sql", 8800),
    ],
  },
  { path: "README.md", name: "README.md", tokens: 2300 },
  { path: "logs/export-friday.log", name: "logs/export-friday.log", tokens: 21400 },
];

for (const n of TREE) if (n.children) n.tokens = n.children.reduce((a, c) => a + c.tokens, 0);

export function flat(nodes: Node[] = TREE): Node[] {
  return nodes.flatMap((n) => [n, ...(n.children ? flat(n.children) : [])]);
}

export const byPath = (p: string) => flat().find((n) => n.path === p);

/** A folder's own entry covers its children; don't count them twice. */
export function attachedTokens(paths: string[]) {
  const set = new Set(paths);
  return paths.reduce((sum, p) => {
    const parent = p.includes("/") ? p.slice(0, p.lastIndexOf("/")) : "";
    return parent && set.has(parent) ? sum : sum + (byPath(p)?.tokens ?? 0);
  }, 0);
}

export const INSTRUCTIONS = 3200;
export const CONVERSATION = 118400;

export type Usage = { parts: { id: string; label: string; tokens: number }[]; used: number; window: number; pct: number };

export function usage(paths: string[], effort: number, model: Model): Usage {
  const parts = [
    { id: "instructions", label: "Instructions", tokens: INSTRUCTIONS },
    { id: "files", label: "Files", tokens: attachedTokens(paths) },
    { id: "conversation", label: "Conversation", tokens: CONVERSATION },
    { id: "thinking", label: "Kept for thinking", tokens: Math.round(model.window * RESERVE[effort]) },
  ];
  const used = parts.reduce((a, p) => a + p.tokens, 0);
  return { parts, used, window: model.window, pct: Math.min(1, used / model.window) };
}

export const fmt = (n: number) => (n >= 1_000_000 ? `${+(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${+(n / 1000).toFixed(n >= 100_000 ? 0 : 1)}k` : String(n));

/** Non-empty lines; each one is a task in Multitask mode. */
export const lanes = (text: string) => text.split("\n").filter((l) => l.trim()).length;
