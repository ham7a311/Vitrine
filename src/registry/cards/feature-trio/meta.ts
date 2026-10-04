import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "feature-trio",
  "name": "Feature Trio",
  "category": "cards",
  "description": "Three cards that explain a product by doing it: each card holds a tiny working piece of the UI \u2014 a build log, a live latency line, a firewall counter \u2014 that wakes up when you point at it.",
  "tags": [
    "cards",
    "features",
    "saas",
    "landing",
    "micro-demo",
    "grid"
  ],
  "traits": [
    "hover",
    "keyboard",
    "touch",
    "ambient"
  ],
  "source": "original",
  "files": [
    "FeatureTrio.tsx",
    "feature-trio.css"
  ],
  "dependencies": [],
  "prompt": "Build a three-card feature section for a developer platform where each card demonstrates its feature with a miniature piece of working UI instead of an icon. The cards share one rounded container and are separated by 1px gaps over a hairline background (the gaps are the dividers).\n\nEach card: a 152px dark 'screen' at the top, then a mono index, an Instrument Serif title and a short muted paragraph.\n- Ship from a push: a build log whose lines complete in sequence \u2014 waiting lines faint, the running line bright with a blinking accent dot, finished lines with green dots, ending on 'Ready \u00b7 41s'.\n- See it as it runs: a live latency sparkline (40 points, random walk with occasional spikes) with its area tint and the current p95 in tabular mono.\n- Safe by default: small red requests fall onto an accent 'edge' line and burst there, while a 'Blocked today' counter climbs.\nAt rest every demo idles at a quarter speed. Pointing at (or focusing) a card makes its demo run at full speed and raises its accent ring and glow, while the other two demos dim to 50%. One column below 44rem.",
  "interaction": "Hover or focus a card to run its demo at full speed; the others quieten.",
  "animation": "Demos tick on intervals (full speed when active, 4\u00d7 slower at rest); card background and demo ring transition 400ms.",
  "a11y": "Cards are links with real headings text; demos are decorative (aria-hidden). Focus behaves like hover. Reduced motion freezes the demos in a representative state.",
  "responsive": "Container query stacks the cards below 44rem.",
  "variants": [
    {
      "id": "frost",
      "label": "Frost",
      "prompt": "accent=\"#b9cce4\" (frost blue) for running dots, the sparkline, the edge line and the active ring."
    },
    {
      "id": "amber",
      "label": "Amber",
      "prompt": "accent=\"#e8a24a\" (amber) for running dots, the sparkline, the edge line and the active ring."
    },
    {
      "id": "phosphor",
      "label": "Phosphor",
      "prompt": "accent=\"#8fe388\" (phosphor green) for running dots, the sparkline, the edge line and the active ring."
    }
  ],
  "preview": {
    "bg": "#0b080d",
    "mode": "fill"
  },
  "touchFallback": "Tapping a card activates it; demos idle otherwise."
};
