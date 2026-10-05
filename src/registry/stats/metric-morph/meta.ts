import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "metric-morph",
  name: "Metric Morph",
  category: "stats",
  description: "A live metric where only the place values that changed move. Unchanged digits hold still, changed digits turn over in the direction of the change and briefly carry its colour, and a rule under the changed range shows how far up the number the change reached.",
  tags: ["metric", "kpi", "stat", "live", "delta", "dashboard", "number"],
  traits: ["ambient", "click"],
  source: "original",
  files: ["MetricMorph.tsx", "metric-morph.css"],
  dependencies: [],
  prompt: `Build a live KPI whose transition explains the change instead of counting up.

The formatted value (Intl: number, percent or currency, tabular numerals) is split into columns aligned by place value from the right. When a new reading arrives, compare it with the previous string place by place:
- Unchanged places do not move at all.
- Changed digits turn over vertically: the old digit exits and the new one enters from below when the value rose, from above when it fell (420ms, a 45ms stagger from the largest changed place down). They take the trend colour — green for good, red for bad, with invert for metrics like latency — and ease back to ink after about 1.6s.
- A 2px rule in the trend colour draws under the whole changed range, from the leftmost changed digit to the end, and stays until the next reading. Its length is the order of magnitude of the change: a rule under the last two digits means a small wobble; a rule under the thousands means something happened.
- A new leading place opens its width (max-width 0 → 1em); a vanished one folds away.

Below the number sits a delta line: an arrow, then '+2,390 · +19.2%', then 'vs 5 min ago'. A neutral reading (bump revision with the same value) moves nothing and says 'No change'. Loading dims the value and shows 'Updating…'; a null value shows a placeholder bar.

The demo is a four-up KPI strip (active users, conversion %, revenue in OMR, p95 latency) with Live, Rise, Fall, No change and Refresh controls. Paper and Night themes.`,
  interaction: "Leave it live, or press Rise, Fall, No change or Refresh.",
  animation: "Changed digits turn over in 420ms with a 45ms stagger; the trend colour settles over 1.6s; the magnitude rule draws in over 360ms.",
  a11y: "The visual digits are aria-hidden and a single text alternative reads the label, value and delta. Colour is never the only signal: the arrow, sign and rule all carry the direction. Reduced motion swaps digits in place and keeps the colour and the rule.",
  responsive: "The value scales with clamp(2.25rem, 6vw, 3.25rem). The demo strip goes from 4 columns to 2 to 1.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --mm-down #b42318; --mm-faint rgb(23 22 15 / 0.08); --mm-flat #7a766d; --mm-ink #17160f; --mm-muted #7a766d; --mm-up #15803d. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --mm-down #f87171; --mm-faint rgb(255 255 255 / 0.08); --mm-flat #8e9096; --mm-ink #efeee9; --mm-muted #8e9096; --mm-up #4ade80. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f4f2ed", mode: "fill" },
};
