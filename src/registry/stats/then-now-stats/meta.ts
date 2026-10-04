import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "then-now-stats",
  "name": "Then / Now Stats",
  "category": "stats",
  "description": "Stats that show the change, not just the value: each number carries a ghost of where it was, and a small bracket draws from then to now with the difference on it.",
  "tags": [
    "stats",
    "metrics",
    "delta",
    "numbers",
    "saas",
    "section"
  ],
  "traits": [
    "scroll",
    "ambient"
  ],
  "source": "original",
  "files": [
    "ThenNowStats.tsx",
    "then-now-stats.css"
  ],
  "dependencies": [],
  "prompt": "Build a stats row that shows change rather than just values. Four cells in one rounded container with 1px gaps as dividers. Each cell: a mono uppercase label; the current value in large serif tabular figures (with a small unit); beneath it a 'rail' \u2014 the previous value in mono with a strike-through on the left, a thin bracket drawn across the middle (an SVG path, pathLength 1, stroke-dashoffset 1 \u2192 0 over 1.2s), and a delta pill on the right ('\u25b2 42.0%'); and a muted sentence saying what the comparison is.\n\nWhen the row scrolls 40% into view, each value counts from its old value to its new one (1.4s, ease-out quart), the bracket draws (staggered 120ms per cell), and the delta pill fades up after it. Whether a change is good depends on the metric (`better: 'up' | 'down'`): good deltas use the accent, bad ones rose. Each cell has hidden text reading the whole comparison.",
  "interaction": "Scroll it into view \u2014 the numbers travel from then to now.",
  "animation": "1.4s count with ease-out quart; bracket draw 1.2s; delta pill 500\u2013600ms, staggered 120ms per cell.",
  "a11y": "A <dl> of term/definition pairs with a full sentence per stat for screen readers; decorative rails are aria-hidden. Reduced motion shows final values immediately.",
  "responsive": "auto-fit grid, minimum 13rem per cell.",
  "preview": {
    "bg": "#0b080d",
    "mode": "fill"
  },
  "touchFallback": "No interaction required."
};
