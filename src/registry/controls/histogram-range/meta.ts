import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "histogram-range",
  "name": "Histogram Range",
  "category": "controls",
  "description": "A price range slider that shows you the data you're filtering: bars of the distribution sit behind the track, light up inside your range, and the result count updates as you drag.",
  "tags": [
    "range",
    "slider",
    "filter",
    "histogram",
    "e-commerce",
    "control"
  ],
  "traits": [
    "click",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "HistogramRange.tsx",
    "histogram-range.css"
  ],
  "dependencies": [],
  "prompt": "Build a two-thumb range filter drawn over the data it filters. A 72px histogram (36 bins, heights normalised to the tallest) sits directly above the track; bars whose centre falls inside the selected range turn accent, the rest stay dim \u2014 so you can see where the items are before you move a thumb. A mono 'N results' count updates live (aria-live).\n\nThe track has a rail, an accent fill between the thumbs, and two round thumbs with soft accent halos that grow on hover/focus. Pressing anywhere on the track grabs the nearer thumb and drags it (pointer capture); thumbs can't cross (10-unit minimum gap). Each thumb is its own role=slider with arrows (Shift \u00d75) and descriptive aria-valuetext. The min/max values show below as mono chips joined by a hairline, with '+' when the max is at the top of the scale.",
  "interaction": "Drag either thumb (or press on the track to jump the nearer one); arrows adjust the focused thumb.",
  "animation": "Bar colour 240ms as the range changes; thumb halo 200ms.",
  "a11y": "Two role=slider thumbs with labels, bounds and value text; the result count is announced; the histogram is decorative. Reduced motion removes transitions.",
  "responsive": "Fluid to 26rem; bars flex to fit.",
  "preview": {
    "bg": "#0b080d",
    "mode": "fill"
  },
  "touchFallback": "Press-and-drag anywhere on the track."
};
