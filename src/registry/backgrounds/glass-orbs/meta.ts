import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "glass-orbs",
  "name": "Glass Orbs",
  "category": "backgrounds",
  "description": "A honeycomb of glass marbles with light moving behind them; each orb flips the beam it looks through into a bright curl and a hot rim.",
  "tags": [
    "background",
    "glass",
    "orbs",
    "webgl",
    "shader",
    "refraction",
    "neon",
    "marbles"
  ],
  "traits": [
    "webgl",
    "ambient",
    "cursor"
  ],
  "source": "original",
  "files": [
    "GlassOrbs.tsx",
    "glass-orbs.css"
  ],
  "dependencies": [],
  "prompt": "Write a WebGL1 full-screen fragment shader background (one triangle, no libraries): a honeycomb wall of glass marbles (9 across, about half that on phones) with light moving behind it.\n\nBehind the glass: three slow beams — Gaussian lines whose height is a sum of two sines across x, drifting at different speeds — three soft pools on slow Lissajous paths, and a lamp that follows the pointer (eased, fading in and out).\n\nLay the orbs on a hex grid (the nearer centre of two offset square lattices), radius 47% of the spacing, with dark gaps between. Each orb is a ball lens: with r the normalised distance from its centre and z = √(1 − r²), the light is looked up at centre − offset·(1.9 − 0.9z) — flipped and gathered, as through a real marble — so a beam passing behind becomes a bright curl inside the ball. Brighten that light strongly toward the rim (pow(1 − z, 2.2)), push the hottest values toward white, add a faint glow from the light directly behind the centre, a tight specular highlight from the upper left and a slight shade toward the bottom so each orb sits on the wall.\n\nRender at 0.85× (0.6× and ~30fps on touch), pause offscreen and in hidden tabs, draw one still frame under reduced motion, and fall back to CSS gradients without WebGL. Children sit above the canvas.",
  "interaction": "The pointer carries a lamp behind the wall; its light curls inside the nearest orbs.",
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
      "id": "ice",
      "label": "Ice",
      "prompt": "Palette { glow #7fd8ff, deep #12406b, ground #03070d }: icy cyan light through deep blue glass."
    },
    {
      "id": "amber",
      "label": "Amber",
      "prompt": "Palette { glow #ffb547, deep #6b3410, ground #0b0603 }: warm amber light through smoked glass."
    }
  ],
  "preview": {
    "bg": "#07040e",
    "mode": "fill",
    "height": 600
  },
};
