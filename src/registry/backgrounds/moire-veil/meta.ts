import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "moire-veil",
  "name": "Moir\u00e9 Veil",
  "category": "backgrounds",
  "description": "Two fine line grids drifting against each other: the interference bands swim and re-tune themselves as your pointer tilts one grid.",
  "tags": [
    "background",
    "moire",
    "css",
    "lines",
    "cursor"
  ],
  "traits": [
    "cursor",
    "ambient",
    "touch"
  ],
  "source": "original",
  "files": [
    "MoireVeil.tsx",
    "moire-veil.css"
  ],
  "dependencies": [],
  "prompt": "Layer two oversized (inset -40%) grids of 1px vertical hairlines at a shared pitch, plus a concentric-ring layer in screen blend. Grid A rotates a full turn over 60s; grid B sits ~2.4\u00b0 off and slowly rocks between 1\u00b0 and 5\u00b0 over 90s while breathing scale 1\u21921.04. The interference of the two fine patterns produces large drifting moir\u00e9 bands. Pointer x adds up to \u00b12.5\u00b0 of extra tilt to grid B and pointer y translates it by up to three pitches, eased over 0.4s, retuning the bands live. Content can sit above.",
  "interaction": "Move the pointer to tilt and slide one grid and watch the bands re-form.",
  "animation": "Three long CSS keyframe loops (60s rotate, 90s rock, 40s ring drift) plus eased pointer offsets.",
  "a11y": "Purely decorative layers (aria-hidden); no flashing \u2014 all motion is slow. Reduced motion freezes the layers.",
  "responsive": "Fills its container; grids oversize so edges never show.",
  "variants": [
    {
      "id": "bone",
      "label": "Bone",
      "prompt": "Bone: ink #e8e4d8 hairlines on paper #0c0d10, pitch 7px."
    },
    {
      "id": "cyan",
      "label": "Cyan",
      "prompt": "Cyan: ink #7fe0ff hairlines on deep teal-black #04111a, pitch 6px (tighter bands)."
    },
    {
      "id": "rose",
      "label": "Rose",
      "prompt": "Rose: ink #ffb3cf hairlines on wine-black #160810, pitch 8px (broader bands)."
    }
  ],
  "preview": {
    "bg": "#0c0b0a",
    "mode": "fill"
  },
};
