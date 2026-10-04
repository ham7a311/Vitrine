import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "dune-field",
  "name": "Dune Field",
  "category": "backgrounds",
  "description": "Layered sand ridges seen at low sun: crests glow on one side and fall into shadow on the other while wind drifts each layer at its own speed.",
  "tags": [
    "background",
    "canvas",
    "dunes",
    "parallax",
    "desert"
  ],
  "traits": [
    "canvas",
    "ambient",
    "cursor"
  ],
  "source": "original",
  "files": [
    "DuneField.tsx"
  ],
  "dependencies": [],
  "prompt": "Paint seven layered ridge lines in Canvas 2D, back to front. Each ridge is a sum of three sines whose frequency, phase and drift speed depend on its layer, so each layer moves at its own pace. Fill each with a vertical gradient from the sand colour toward a deep shadow colour with depth, and add a lit rim line. Where the ridge descends steeply to the right, overlay a translucent dark strip so slip faces read as shadow. A radial sun glow sits above the horizon. Pointer x parallax-shifts layers by depth. Cap DPR at 2, pause offscreen, static under reduced motion.",
  "interaction": "Move the pointer horizontally to parallax the dunes.",
  "animation": "rAF-driven slow sine drift per layer, with pointer parallax.",
  "a11y": "Decorative canvas (aria-hidden); very slow motion; reduced motion draws one still frame.",
  "responsive": "Redraws to its container size via ResizeObserver.",
  "variants": [
    {
      "id": "golden",
      "label": "Golden hour",
      "prompt": "Golden hour (the defaults): sky gradient #f6c48a \u2192 #f7e7c6, sand #e8a35d deepening to shadow #5a2b19."
    },
    {
      "id": "dusk",
      "label": "Dusk",
      "prompt": "Dusk: violet-to-peach sky (#3a2a5c \u2192 #f2a68a), terracotta sand #c9704f deepening to plum shadow #1c1027."
    },
    {
      "id": "bone",
      "label": "Bone",
      "prompt": "Bone: pale overcast sky (#dfe6ea \u2192 #f6f1e6), bone sand #e7dcc4 with soft taupe shadows #8a7f6a \u2014 low contrast and calm."
    }
  ],
  "preview": {
    "bg": "#f6c48a",
    "mode": "fill"
  },
};
