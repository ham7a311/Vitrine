import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "constellation-name",
  "name": "Constellation Name",
  "category": "type",
  "description": "A name drawn as stars: its letter pixels are sampled into a field of twinkling points joined by hairlines, and the pointer pulls them like gravity.",
  "tags": [
    "name",
    "canvas",
    "particles",
    "constellation",
    "cursor"
  ],
  "traits": [
    "canvas",
    "cursor",
    "ambient",
    "touch"
  ],
  "source": "original",
  "files": [
    "ConstellationName.tsx"
  ],
  "dependencies": [],
  "prompt": "Draw the name in offscreen 2D canvas (italic Instrument Serif, fitted to 86% of the width), read back its alpha, and sample a grid of opaque pixels; shuffle and keep ~260 points as stars, each with a home position, a random start offset, a phase and a radius. Each frame every star is spring-pulled home (k=0.03, damping 0.86) and attracted to the pointer within 120px; draw hairline links between stars closer than w/16 with alpha falling off with distance, then draw stars twinkling on sin(t/700+phase). Cap DPR at 2, rebuild on resize, pause when offscreen. Reduced motion draws the settled constellation once.",
  "interaction": "Move the pointer or drag a finger across the name: nearby stars are pulled toward it, then spring back.",
  "animation": "rAF loop with spring physics and per-star twinkle; paused offscreen.",
  "a11y": "The canvas region has role=img with the name as its label; reduced motion renders one static frame.",
  "responsive": "Rebuilds on container resize; star density adapts to the area.",
  "variants": [
    {
      "id": "ice",
      "label": "Ice",
      "prompt": "color=\"#cfe0ff\" (ice-blue stars and links) on #05070d; text \"Hamza\"."
    },
    {
      "id": "ember",
      "label": "Ember",
      "prompt": "color=\"#ffc28a\" (ember stars) on #0e0906; text \"Hamza\"."
    },
    {
      "id": "mint",
      "label": "Mint",
      "prompt": "color=\"#a6f0cf\" (mint stars) on #050c09; text \"Hamza\"."
    }
  ],
  "preview": {
    "bg": "#05070d",
    "mode": "fill"
  },
};
