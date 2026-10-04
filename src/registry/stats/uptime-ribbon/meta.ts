import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "uptime-ribbon",
  "name": "Uptime Ribbon",
  "category": "stats",
  "description": "A status-page ribbon of ninety thin days: scrub along it and a tooltip rides your pointer with that day's uptime and incidents, while the bars under your hand lift like keys.",
  "tags": [
    "stats",
    "status-page",
    "uptime",
    "monitoring",
    "saas",
    "tooltip"
  ],
  "traits": [
    "hover",
    "cursor",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "UptimeRibbon.tsx",
    "uptime-ribbon.css"
  ],
  "dependencies": [],
  "prompt": "Build a status-page component: one row per service with a status dot, its name and the 90-day average uptime, then a ribbon of 90 thin bars (2px gaps) coloured by day \u2014 green \u2265 99.95%, amber \u2265 99%, red below \u2014 and an axis ('90 days ago' / 'Today').\n\nScrubbing the ribbon (pointer move, press or \u2190/\u2192 when focused) selects a day: bars near the pointer lift like keys under a finger \u2014 height 70% \u2192 100% and opacity up with a smooth quadratic falloff over four neighbours (260ms expo-out) \u2014 the exact day gets a white outline, and a tooltip rides above it (position eased 120ms) with the date, uptime in mono (colour-coded) and any incident note. Each ribbon is a single focusable group with an aria-label summarising it.",
  "interaction": "Move across a ribbon (or use \u2190/\u2192/Home/End when focused) to inspect any day.",
  "animation": "Neighbour lift 260ms expo-out; tooltip tracks with a 120ms linear ease.",
  "a11y": "Each ribbon is a labelled focusable group with keyboard scrubbing; the tooltip is a status region. Colour is backed by text (percentages and notes). Reduced motion removes transitions.",
  "responsive": "Bars are grid columns so the ribbon fits any width; the tooltip is centred on the day.",
  "preview": {
    "bg": "#0b0a0c",
    "mode": "fill"
  },
  "touchFallback": "Press and drag along the ribbon to scrub (vertical scroll still works)."
};
