import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "star-trails",
  "name": "Star Trails",
  "category": "backgrounds",
  "description": "A long-exposure night sky: hundreds of stars smear into concentric arcs around a celestial pole, and the pole follows your pointer.",
  "tags": [
    "background",
    "canvas",
    "stars",
    "long-exposure",
    "night"
  ],
  "traits": [
    "canvas",
    "cursor",
    "ambient"
  ],
  "source": "original",
  "files": [
    "StarTrails.tsx"
  ],
  "dependencies": [],
  "prompt": "Simulate a long photographic exposure. Scatter ~420 stars in polar coordinates (radius with a power-law bias, random angle, size, and a hue within \u00b135\u00b0 of the palette). Every frame rotate the whole sky a fraction of a degree about a pole and stroke a short chord from each star's previous to new position, without clearing the canvas \u2014 only laying a 1.2% opacity night-colour veil so the oldest trails slowly fade. Pre-render ~160 steps at mount (700 for reduced motion) so arcs are already long on first paint. The pole eases toward the pointer within a small range. Cap DPR at 2 and pause offscreen.",
  "interaction": "Move the pointer and the celestial pole slides after it, bending the arcs.",
  "animation": "Cumulative canvas drawing with a faint fade veil; no clearing between frames.",
  "a11y": "Decorative canvas; motion is extremely slow with no flashing; reduced motion shows only a pre-rendered still.",
  "responsive": "Re-exposes on resize.",
  "variants": [
    {
      "id": "blue",
      "label": "Blue",
      "prompt": "hue={215}: star colours spread \u00b135\u00b0 around blue."
    },
    {
      "id": "amber",
      "label": "Amber",
      "prompt": "hue={35}: warm amber-gold stars."
    },
    {
      "id": "violet",
      "label": "Violet",
      "prompt": "hue={285}: violet-magenta stars."
    }
  ],
  "preview": {
    "bg": "#03050b",
    "mode": "fill"
  },
};
