import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "slope-chart",
  "name": "Slope Chart",
  "category": "analytics",
  "description": "How a ranking changed between two periods, one line per item from old rank to new; climbers and fallers take opposite colours, and lines swing when you switch measure.",
  "tags": [
    "slope",
    "rank",
    "change",
    "chart",
    "analytics",
    "comparison",
    "before after",
    "svg"
  ],
  "traits": [
    "hover",
    "click"
  ],
  "source": "original",
  "files": [
    "SlopeChart.tsx",
    "slope-chart.css"
  ],
  "dependencies": [],
  "prompt": "Build a slope chart of rank changes between two periods in SVG with no chart library. Each item (eight destinations) is a line from its rank in the first period (left column) to its rank in the second (right), with dots at both ends and labels outside each end: name and value on the left, value, name and a ▲3 / ▼2 change on the right. Lines that climbed take one pole of a diverging pair (blue), those that fell the other (red), unchanged ones neutral grey — never status colours — with a small legend. The headline names the biggest climber (\"Salalah climbs 4 places\").\n\nA Bookings / Revenue switch re-ranks both columns and every line swings to its new positions (700ms, cubic out, interpolating ranks). Hovering an item dims the others (each item's hit area spans its whole line). A Table button shows the values and rank changes.",
  "interaction": "Switch the measure to re-rank; hover a line to isolate it; use Table for the numbers.",
  "animation": "Re-ranking tweens over 700ms (cubic out); highlight fades 200ms.",
  "a11y": "The SVG has a summary label; climbers and fallers are marked with ▲/▼ and numbers as well as colour; the table view lists every value and change. Reduced motion jumps to new ranks.",
  "responsive": "The SVG scales with its width; labels stay outside the line ends.",
  "touchFallback": "Tap to highlight; the table view covers precise reading.",
  "variants": [
    {
      "id": "light",
      "label": "Light"
    },
    {
      "id": "dark",
      "label": "Dark"
    }
  ],
  "preview": {
    "bg": "#f2f1ed",
    "mode": "fill",
    "height": 560
  },
};
