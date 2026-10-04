import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "bayer-horizon",
  "name": "Bayer Horizon",
  "category": "backgrounds",
  "description": "A dusk horizon drawn in three tones with an 8\u00d78 ordered dither \u2014 crisp, quiet and printed-looking, with an optional sun that takes minutes to set.",
  "tags": [
    "background",
    "webgl",
    "dither",
    "bayer",
    "horizon",
    "pixel"
  ],
  "traits": [
    "webgl",
    "ambient"
  ],
  "source": "original",
  "files": [
    "BayerHorizon.tsx"
  ],
  "dependencies": [],
  "prompt": "Render a horizon in exactly three colours with ordered dithering, in raw WebGL (one full-screen triangle). Quantise gl_FragCoord to a cell grid of `pixel` CSS pixels (\u00d7DPR) and evaluate a continuous brightness field at each cell centre:\n- Sky above a ridge line (horizon at 34% height plus two octaves of 1-D value noise): 0.72\u00b7e^(\u22123.2\u00b7up) + 0.1, plus a sun halo 0.55\u00b7e^(\u22127r) + 0.35\u00b7e^(\u22122.6r) and a crisp disc at r < 0.05 (aspect-corrected), all dimmed as the sun drops.\n- Ground below: a faint haze 0.22\u00b7e^(\u22124\u00b7down) and the sun's reflection as a narrow vertical streak with fine horizontal ripples (sin(y\u00b7240)); the ridge edge is held dark.\nMap brightness to three tones with an 8\u00d78 Bayer threshold built from the recursive bayer2 trick (fract(x/2 + y\u00b2\u00b70.75)), q = floor(v\u00b72 + threshold), and pick ground / mid / light. The canvas uses image-rendering: pixelated.\n\nIt's static by default: render once, and again on resize. Optionally the sun sets and rises on a 3-minute cosine, redrawing only when it has moved enough to change pixels. Pause offscreen; reduced motion keeps it still.",
  "interaction": "None \u2014 it's a quiet backdrop for type. The 'setting' variant moves imperceptibly over minutes.",
  "animation": "Static by default. With setting=true the sun follows a 180s cosine and only re-renders when it moves by a dither step.",
  "a11y": "Decorative canvas (aria-hidden). No flashing; the optional motion is far below perceptible speed and is disabled under reduced motion.",
  "responsive": "Re-renders at the new size on resize; the dither cell stays a fixed CSS size so the texture never blurs.",
  "variants": [
    {
      "id": "lilac",
      "label": "Lilac dusk",
      "prompt": "Three tones [#0b080d ground, #3a2748 mid, #e6d6f2 light] \u2014 a violet dusk; static (setting off). Type ink #f3ecf7, muted #b9a9c7."
    },
    {
      "id": "frost",
      "label": "Frost",
      "prompt": "Three tones [#070a0e, #1f3146, #d3e3f5] \u2014 a cold blue horizon; static (setting off). Type ink #eef4fb, muted #9fb2c7."
    },
    {
      "id": "ember",
      "label": "Ember (setting sun)",
      "prompt": "Three tones [#0c0807, #5b2c1a, #f3c592] \u2014 a burnt-orange sunset, with setting on: the sun sinks and rises on the 3-minute cosine, redrawing only when pixels change. Type ink #fbefe2, muted #caa283."
    }
  ],
  "preview": {
    "bg": "#0b080d",
    "mode": "fill"
  },
  "touchFallback": "Nothing to do on touch \u2014 it renders identically."
};
