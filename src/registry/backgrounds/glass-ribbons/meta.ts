import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "glass-ribbons",
  "name": "Glass Ribbons",
  "category": "backgrounds",
  "description": "Wide ribbons of glass swaying in front of moving light; each ribbon is a long lens that breaks the beams into bright lines on its shoulders.",
  "tags": [
    "background",
    "glass",
    "ribbons",
    "fluted",
    "webgl",
    "shader",
    "refraction",
    "neon"
  ],
  "traits": [
    "webgl",
    "ambient",
    "cursor"
  ],
  "source": "original",
  "files": [
    "GlassRibbons.tsx",
    "glass-ribbons.css"
  ],
  "dependencies": [],
  "prompt": "Write a WebGL1 full-screen fragment shader background (no libraries): wide vertical ribbons of glass (7 across, fewer on phones) swaying slowly in front of moving light.\n\nBehind the glass: three slow beams (Gaussian lines following a sum of sines across x), three wandering soft pools and a lamp that follows the pointer.\n\nEach ribbon's centre line bends with height and time (two sines in y, drifting), so the whole set sways like hanging glass. Within a ribbon let s run from −0.5 to 0.5: it is a cylinder lens, so the light is looked up at a mirrored, squeezed slice — x = centre − s·width·1.9 — and brightened toward the edges (|2s|^1.6), so a beam behind breaks into bright lines along both shoulders of each ribbon; the face shows a soft, dim view of what's directly behind. Shade with cos(πs), add a faint shoulder highlight, push the hottest values toward white, and darken a thin gap between ribbons.\n\nRender at 0.85× (0.6× and ~30fps on touch), pause offscreen and in hidden tabs, draw one still frame under reduced motion, and fall back to CSS gradients without WebGL. Children sit above the canvas.",
  "interaction": "The pointer carries a lamp behind the ribbons; its light catches on their shoulders.",
  "animation": "Continuous slow drift in the shader; the pointer effect eases in at 0.06 and follows with a 0.12 lerp.",
  "a11y": "Decorative and aria-hidden. Reduced motion renders one still frame. Use a scrim for text; highlights can be bright.",
  "responsive": "Fills its container; the density drops to about half on screens under 640px; DPR capped at 2.",
  "touchFallback": "No pointer effect on touch; the light keeps moving on its own.",
  "variants": [
    {
      "id": "violet",
      "label": "Violet",
      "prompt": "Palette { glow #c25cff, deep #3a1a8a, ground #07040e }: neon violet light through dark violet glass."
    },
    {
      "id": "teal",
      "label": "Teal",
      "prompt": "Palette { glow #4ff0c9, deep #0f4a52, ground #020a0b }: sea-green light through dark teal glass."
    },
    {
      "id": "rose",
      "label": "Rose",
      "prompt": "Palette { glow #ff7aa8, deep #5a1630, ground #0c0306 }: rose light through wine-dark glass."
    }
  ],
  "preview": {
    "bg": "#07040e",
    "mode": "fill",
    "height": 600
  },
};
