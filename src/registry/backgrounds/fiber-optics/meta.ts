import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "fiber-optics",
  "name": "Fiber Optics",
  "category": "backgrounds",
  "description": "A sheaf of optical fibres fanning up from one bundle, each carrying pulses of light that bloom at its tip; the pointer warms the fibres it passes.",
  "tags": [
    "background",
    "fiber",
    "light",
    "network",
    "webgl",
    "shader",
    "glow",
    "data"
  ],
  "traits": [
    "webgl",
    "ambient",
    "cursor"
  ],
  "source": "original",
  "files": [
    "FiberOptics.tsx",
    "fiber-optics.css"
  ],
  "dependencies": [],
  "prompt": "Write a WebGL1 full-screen fragment shader background (no libraries): a sheaf of optical fibres (40, about 22 on phones) fanning up from one bundle at the bottom centre. Each fibre is a curve x(y) that starts at the bundle and spreads to its own column as it rises (spread · y^0.8), with a slow sideways sway, and ends at its own height (62–92% of the frame).\n\nPer fibre: a hairline body glow (a very narrow Gaussian of the horizontal distance, about 16% brightness) in a colour between the deep and glow colours chosen by a hash; a pulse of light travelling up it at its own speed (a Gaussian in the fibre's progress, with a wider soft halo and a white-hot core); and a bloom at the tip (a tight bright dot and a wide faint halo) that breathes slowly. The pointer warms the fibres near it (their body glow rises within a soft radius). A dark collar sits at the bundle.\n\nLoop over the fibres in the shader (constant upper bound, early break). Render at 0.85× (0.6× and ~30fps on touch), pause offscreen and in hidden tabs, draw one still frame under reduced motion, and fall back to CSS gradients without WebGL. Children sit above the canvas.",
  "interaction": "The pointer warms the fibres it passes; pulses run up them on their own.",
  "animation": "Continuous slow drift in the shader; the pointer effect eases in at 0.06 and follows with a 0.12 lerp.",
  "a11y": "Decorative and aria-hidden. Reduced motion renders one still frame. Use a scrim for text; highlights can be bright.",
  "responsive": "Fills its container; the density drops to about half on screens under 640px; DPR capped at 2.",
  "touchFallback": "No pointer effect on touch; the light keeps moving on its own.",
  "variants": [
    {
      "id": "ice",
      "label": "Ice",
      "prompt": "Palette { glow #7fd8ff, deep #2a3f9a, ground #03050c }: cyan-to-indigo fibres on blue-black."
    },
    {
      "id": "violet",
      "label": "Violet",
      "prompt": "Palette { glow #e07bff, deep #5b2bd6, ground #05030c }: magenta-to-violet fibres on violet-black."
    },
    {
      "id": "ember",
      "label": "Ember",
      "prompt": "Palette { glow #ffc061, deep #c2410c, ground #080402 }: amber-to-orange fibres on warm black."
    }
  ],
  "preview": {
    "bg": "#07040e",
    "mode": "fill",
    "height": 600
  },
};
