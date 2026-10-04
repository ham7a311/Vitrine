import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "liquid-chrome",
  "name": "Liquid Chrome",
  "category": "backgrounds",
  "description": "A pool of molten metal that folds over itself and mirrors a studio of soft coloured light; the pointer drops a ripple into it.",
  "tags": [
    "background",
    "chrome",
    "metal",
    "liquid",
    "webgl",
    "shader",
    "reflection",
    "3d"
  ],
  "traits": [
    "webgl",
    "ambient",
    "cursor"
  ],
  "source": "original",
  "files": [
    "LiquidChrome.tsx",
    "liquid-chrome.css"
  ],
  "dependencies": [],
  "prompt": "Write a WebGL1 full-screen fragment shader background (no libraries): molten chrome that slowly folds over itself. The surface is a height field — four-octave value-noise fBm, domain-warped once and drifting slowly in time. Take finite differences for a normal, reflect the view ray off it, and look the reflection up in a soft studio: a dark floor below, a wall that fades from the deep colour into the glow colour across one side, a bright horizontal strip light overhead and a thinner vertical strip at the left. Because every point reflects the room, the colour bands slide, pinch and stretch as the metal flows. Add a little Fresnel whitening at grazing angles and darken the low parts of the folds.\n\nThe pointer drops a ripple: a decaying sine ring (30–35 per unit, travelling outward over time, falling off with distance) added to the height, eased in and out as the pointer enters and leaves, so the reflections shiver around it.\n\nRender at 0.85× (0.6× and ~30fps on touch), pause offscreen and in hidden tabs, draw one still frame under reduced motion, and fall back to CSS gradients without WebGL. Children sit above the canvas.",
  "interaction": "The pointer drops a ripple into the metal; the reflections shiver around it.",
  "animation": "Continuous slow drift in the shader; the pointer effect eases in at 0.06 and follows with a 0.12 lerp.",
  "a11y": "Decorative and aria-hidden. Reduced motion renders one still frame. Use a scrim for text; highlights can be bright.",
  "responsive": "Fills its container; the density drops to about half on screens under 640px; DPR capped at 2.",
  "touchFallback": "No pointer effect on touch; the light keeps moving on its own.",
  "variants": [
    {
      "id": "lilac",
      "label": "Lilac",
      "prompt": "Palette { glow #b9a6ff, deep #2b2f45, ground #0b0c10 }: silver chrome reflecting a lilac-lit studio."
    },
    {
      "id": "gold",
      "label": "Gold",
      "prompt": "Palette { glow #ffcf7a, deep #4a3410, ground #0c0904 }: molten gold in warm light."
    },
    {
      "id": "mercury",
      "label": "Mercury",
      "prompt": "Palette { glow #dfe6ee, deep #3a3f46, ground #08090b }: neutral mercury, pure silver and graphite."
    }
  ],
  "preview": {
    "bg": "#07040e",
    "mode": "fill",
    "height": 600
  },
};
