import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "usage-ruler",
  "name": "Usage Ruler",
  "category": "pricing",
  "description": "Pricing as an instrument: drag a marker along a ruler of seats, the tiers shade in beneath it, the price rolls, and the plan name changes the moment you cross a boundary.",
  "tags": [
    "pricing",
    "slider",
    "saas",
    "usage",
    "seats",
    "calculator"
  ],
  "traits": [
    "click",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "UsageRuler.tsx",
    "usage-ruler.css"
  ],
  "dependencies": [],
  "prompt": "Replace plan cards with a single pricing instrument. A dark panel shows the current plan name (serif, rolls vertically when it changes), its one-line note, and on the right the monthly price in large serif tabular figures with 'seats \u00d7 $ per seat' underneath.\n\nBelow, a ruler from 1 to 500 seats on a logarithmic scale (so small teams get most of the room): shaded tier bands with dashed boundaries and tiny mono tier labels (the active band tints in the accent), 61 ticks with majors every tenth, an accent fill up to the marker, and the marker itself \u2014 a thin ink line with a round foot and a pill showing the seat count. The whole ruler is a role=slider: drag anywhere (pointer capture), click to jump, or use arrows (Shift for \u00d710), Page Up/Down, Home/End. aria-valuetext reads '18 seats, Team plan, $180 per month'. Crossing a tier boundary changes the per-seat price and rolls the plan name.",
  "interaction": "Drag or click along the ruler, or use the arrow keys; the plan and price follow.",
  "animation": "Plan name rolls 520ms; active band tint 420ms; the marker follows the pointer directly.",
  "a11y": "A single role=slider with full keyboard support and descriptive aria-valuetext; the price is announced politely. Reduced motion removes the roll.",
  "responsive": "Fluid to 44rem; the header wraps on small screens.",
  "variants": [
    {
      "id": "frost",
      "label": "Frost",
      "prompt": "accent=\"#b9cce4\" (frost blue) for the active band, fill and marker pill."
    },
    {
      "id": "amber",
      "label": "Amber",
      "prompt": "accent=\"#e8a24a\" (amber) for the active band, fill and marker pill."
    }
  ],
  "preview": {
    "bg": "#0b080d",
    "mode": "fill"
  },
  "touchFallback": "Drag with a finger anywhere on the ruler (touch-action none)."
};
