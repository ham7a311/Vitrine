import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "light-curtain",
  "name": "Light Curtain",
  "category": "backgrounds",
  "description": "A curtain of soft vertical light that drifts, swells and fades like an aurora seen edge-on; the pointer brightens the streaks it passes and pulls them in.",
  "tags": [
    "background",
    "aurora",
    "light",
    "streaks",
    "webgl",
    "shader",
    "interactive",
    "music"
  ],
  "traits": [
    "webgl",
    "ambient",
    "cursor"
  ],
  "source": "original",
  "files": [
    "LightCurtain.tsx",
    "light-curtain.css"
  ],
  "dependencies": [],
  "prompt": "Write a WebGL1 full-screen fragment shader background (no libraries): a curtain of soft vertical light. Brightness across x is four layers of 1-D value noise at rising frequencies (0.55, 1.7, 5.3 and 13 per streak unit, about 16 units across), each drifting at its own speed and direction, summed and raised to the power 2.5 so the curtain breaks into distinct streaks with fine filaments, each breathing slowly (a sine whose phase comes from the noise). A vertical envelope — a wide Gaussian around a gently waving middle line — fades every streak to darkness at the top and bottom. Colour each streak between the deep and glow colours by a slow noise, leaning toward the glow colour, and push the brightest values toward white.\n\nInteractive: the pointer pulls nearby streaks sideways toward it (a Gaussian displacement of x) and brightens the streaks within a soft horizontal radius, eased in and out as the pointer enters and leaves.\n\nRender at 0.85× (0.6× and ~30fps on touch), pause offscreen and in hidden tabs, draw one still frame under reduced motion, and fall back to CSS gradients without WebGL. Children sit above the canvas.",
  "interaction": "The pointer brightens the streaks it passes and gathers them toward it.",
  "animation": "Continuous slow drift in the shader; the pointer effect eases in at 0.06 and follows with a 0.12 lerp.",
  "a11y": "Decorative and aria-hidden. Reduced motion renders one still frame. Use a scrim for text; highlights can be bright.",
  "responsive": "Fills its container; the density drops to about half on screens under 640px; DPR capped at 2.",
  "touchFallback": "No pointer effect on touch; the light keeps moving on its own.",
  "variants": [
    {
      "id": "magenta",
      "label": "Magenta",
      "prompt": "Palette { glow #ff5fc8, deep #7a2bff, ground #06030a }: pink-to-violet streaks on near-black."
    },
    {
      "id": "aurora",
      "label": "Aurora",
      "prompt": "Palette { glow #5cffb0, deep #1f6bff, ground #02060a }: green-to-blue aurora streaks."
    },
    {
      "id": "ember",
      "label": "Ember",
      "prompt": "Palette { glow #ffb547, deep #e0312b, ground #080302 }: amber-to-red streaks on warm black."
    }
  ],
  "preview": {
    "bg": "#05030a",
    "mode": "fill",
    "height": 600
  },
};
