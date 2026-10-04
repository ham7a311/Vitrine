import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "glass-blinds",
  "name": "Glass Blinds",
  "category": "backgrounds",
  "description": "Horizontal slats of glass with light behind them: each slat squeezes the glow into a bright band along its middle; the pointer moves a lamp behind them.",
  "tags": [
    "background",
    "glass",
    "blinds",
    "slats",
    "webgl",
    "shader",
    "interactive",
    "refraction"
  ],
  "traits": [
    "webgl",
    "ambient",
    "cursor"
  ],
  "source": "original",
  "files": [
    "GlassBlinds.tsx",
    "glass-blinds.css"
  ],
  "dependencies": [],
  "prompt": "Write a WebGL1 full-screen fragment shader background (no libraries): horizontal glass slats (8 rows, 4 on phones) with light behind them. Behind the glass: two broad, horizontally stretched glows drifting slowly across on unrelated sines, plus a lamp under the pointer (eased in and out).\n\nWithin each slat let s run from −0.5 to 0.5 top to bottom: the slat is a long cylindrical lens, so the light is looked up at a squeezed, mirrored slice (y = centre − s·height·1.7). Shade each slat by cos(πs)^0.7, so it is brightest along its middle and falls into shadow toward the seams, mix the deep colour into the body and the glow colour where the light is strongest (less toward the edges), push the hottest values toward white, and darken a thin seam between slats. Moving the pointer slides a bright patch along the slats it is behind.\n\nRender at 0.85× (0.6× and ~30fps on touch), pause offscreen and in hidden tabs, draw one still frame under reduced motion, and fall back to CSS gradients without WebGL. Children sit above the canvas.",
  "interaction": "The pointer moves a lamp behind the slats; its light spreads along the slats it's behind.",
  "animation": "Continuous slow drift in the shader; the pointer effect eases in at 0.06 and follows with a 0.12 lerp.",
  "a11y": "Decorative and aria-hidden. Reduced motion renders one still frame. Use a scrim for text; highlights can be bright.",
  "responsive": "Fills its container; the density drops to about half on screens under 640px; DPR capped at 2.",
  "touchFallback": "No pointer effect on touch; the light keeps moving on its own.",
  "variants": [
    {
      "id": "indigo",
      "label": "Indigo",
      "prompt": "Palette { glow #8f9bff, deep #3a3fd6, ground #020208 }: electric indigo light through dark glass."
    },
    {
      "id": "rose",
      "label": "Rose",
      "prompt": "Palette { glow #ff8fbf, deep #c2185b, ground #080206 }: rose light through wine-dark glass."
    },
    {
      "id": "sea",
      "label": "Sea",
      "prompt": "Palette { glow #7ff0dc, deep #0f7a8a, ground #010607 }: sea-green light through teal glass."
    }
  ],
  "preview": {
    "bg": "#05030a",
    "mode": "fill",
    "height": 600
  },
};
