import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "marbled-ink",
  "name": "Marbled Ink",
  "category": "backgrounds",
  "description": "Endpaper marbling in a fragment shader: drag the cursor and it combs through the ink, dragging the veins along its path before they slowly settle.",
  "tags": [
    "background",
    "webgl",
    "marbling",
    "shader",
    "cursor"
  ],
  "traits": [
    "webgl",
    "cursor",
    "ambient",
    "touch"
  ],
  "source": "original",
  "files": [
    "MarbledInk.tsx"
  ],
  "dependencies": [],
  "prompt": "Write a full-screen fragment shader (raw WebGL, one big triangle) that domain-warps 4-octave value-noise fbm twice (q, r) and reads marble veins from sin(f*22 + r.x*7), mixing four palette colours: base by f, a second colour by r.x, and thin veins in a fourth, then modulating with a fine paper-tooth noise. Add combing: keep a ring of 16 pointer samples (position + velocity) as a vec4 uniform array; for each, subtract its velocity \u00d7 gaussian falloff \u00d7 6 from the sample coordinates so ink is dragged along the pointer's path. Velocities decay \u00d70.985 per frame so the veins ease back. Render at 0.6\u00d7 DPR (cap 2), pause offscreen, use a static frame under reduced motion.",
  "interaction": "Drag the pointer (or a finger) across the ink to comb the veins; they slowly relax afterwards.",
  "animation": "Slow noise-time drift plus decaying pointer advection in the shader.",
  "a11y": "Decorative canvas (aria-hidden). Reduced motion freezes time (combing still works on demand). No flashing content.",
  "responsive": "Resizes with its container; renders at reduced resolution for performance.",
  "variants": [
    {
      "id": "endpaper",
      "label": "Endpaper",
      "prompt": "Endpaper palette [#0f2a3a, #e8dcc0, #b3392b, #f5efe0]: deep navy and cream marbling with thin red veins, like a bookbinder's endpaper."
    },
    {
      "id": "oxblood",
      "label": "Oxblood",
      "prompt": "Oxblood palette [#2a0d10, #e9d3b4, #c58a2e, #f2e6cf]: dark oxblood and parchment with ochre-gold veins."
    },
    {
      "id": "celadon",
      "label": "Celadon",
      "prompt": "Celadon palette [#123a34, #efe9d6, #4fa38f, #f8f3e4]: dark green and ivory with celadon-green veins."
    }
  ],
  "preview": {
    "bg": "#0f2a3a",
    "mode": "fill"
  },
};
