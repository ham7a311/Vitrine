import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "agent-run",
  name: "Agent Run",
  category: "ai",
  description: "A coding agent's work as a checklist that fills in while it happens — search, read, edit with a diff stat, run tests — where any finished step opens to show its output.",
  tags: ["ai", "agent", "tool-calls", "developer-tools", "steps", "log"],
  traits: ["click", "keyboard", "ambient"],
  source: "original",
  files: ["AgentRun.tsx", "agent-run.css"],
  dependencies: [],
  prompt: `Present an AI agent's run as a compact dark panel (#111, 14px radius, hairline ring). The header has a small agent mark, the task in one line, and a mono status ('Step 3 of 6' → green 'Done · 7.2s').

Each tool call is a row: a verb glyph (think / search / read / edit / run, 16px line icons), a muted verb ('Searched for', 'Read', 'Edited', 'Ran'), the target in a mono pill ('src/lib/pricing.ts', 'npm test -- pricing') and a small meta ('+6 −1' with a green first character, '12 passed'), and a status slot on the right. Queued rows sit at 35% opacity; the active row brightens, its glyph turns accent and a spinner turns; completed rows get a tick that draws itself. Rows with output (a diff, a test log) become buttons once complete and fold open (grid rows 0fr → 1fr, 420ms) to a small mono block with coloured +/− lines. When the last step lands, a one-paragraph summary folds open beneath with 'Run again'.`,
  interaction: "Watch the run progress; click a finished Edit or Run row to see its diff or output; 'Run again' replays.",
  animation: "Active row rises in 420ms; spinner → tick (360ms draw); details and summary fold open 420–520ms.",
  a11y: "Semantic section with an ordered list; expandable rows are buttons with aria-expanded; completion is announced politely. Reduced motion shows the finished run immediately.",
  responsive: "Fluid up to 36rem; long targets truncate with an ellipsis.",
  touchFallback: "Tap targets are full-width rows.",
  preview: { bg: "#0a0a0a", mode: "fill" },
};
