import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ribbed-dusk",
  name: "Ribbed Dusk",
  category: "backgrounds",
  description: "A soft field of colour seen through ribbed glass. Broad diagonal bands of light drift behind it, and each vertical rib shows its own slanted, darkening slice of them, so the bands break into a row of tapered blades under a fine film grain.",
  tags: ["background", "hero", "ribbed glass", "reeded glass", "fluted", "gradient", "grain", "webgl", "blue"],
  traits: ["webgl", "ambient"],
  source: "original",
  isNew: true,
  files: ["RibbedDusk.tsx", "ribbed-dusk.css"],
  dependencies: [],
  prompt: `Build a full-bleed background that looks like a soft gradient photographed through ribbed (reeded) glass: vertical ribs, each showing a slanted, darkening slice of the light behind it. One WebGL fragment shader on a canvas; no images.

The light behind the glass. Work in coordinates q = (x × aspect, y), y down, each 0 to 1. Let across = qx − 0.7·qy (it counts the bands) and along = 0.7·qx + qy (it runs down a band). A band wave: w = 0.5 + 0.5·sin(8.2·across + 0.9·sin(2.2·along + 0.2t) + 0.15t − 3.1), with t in seconds. The light is v = 0.46 + 0.54·w^1.35: a mid colour everywhere, rising to the pale light along the crest of each band, with bands running from upper left to lower right and bending slowly. Then two pools of shadow: soft Gaussian blobs centred near (1.26, 0.16) and (0.58, 0.88) in q, each wandering about 0.15 around its centre on slow sines (periods of 50 to 60 seconds), with falloffs exp(−r² / 0.2) and exp(−r² / 0.17). Multiply v by a factor that falls from 1 to 0.06 as the summed pools rise from 0.25 to 0.95. So the picture is mostly colour, crossed by pale bands, with two large dark areas: one toward the upper right and one toward the lower middle.

The ribs. Divide the width into a whole number of ribs about 26px wide (round(width / 26), at least 6). For a pixel, let f be how far across its rib it is, 0 at the left edge to 1 at the right. Sample the light not at the pixel but at the rib's horizontal middle, and at a height of y − 0.2·f. So within one rib a band appears as a blade slanting down to the right, and at the next rib it starts again higher up: a sawtooth. Then dim it across the rib: v −= f × (0.2 + 0.34·v). The left edge of each rib is therefore bright and crisp and its right side falls toward shadow, most where the light is strong.

Colour. Map v through four stops with soft steps: shadow to deep over 0.16–0.44, deep to bright over 0.4–0.66, bright to the pale light over 0.7–0.86. Add 5% of the bright colour on the first 6% of each rib where v is above 0.2, as a hair of edge light.

Grain. Add (hash(pixel + time) − 0.5) × 0.055 to every channel: fine film grain that changes each frame.

Production behaviour: a children slot above the canvas. Cap the device pixel ratio at 2. Advance time by elapsed seconds (capped at 50ms a frame) times a speed option. Pause off screen and in hidden tabs. Under reduced motion, or with motion set to "still", draw one frame. Without WebGL, show a CSS fallback: the four colours as a 118-degree linear gradient under repeating vertical dark ramps 26px wide.`,
  interaction: "None: it is ambient.",
  animation: "The bands of light drift and bend slowly behind the glass; the ribs stay still. Grain flickers every frame.",
  a11y: "Decorative canvas, hidden from assistive technology. Contrast varies across the field, so set text on it large or over a scrim. Reduced motion shows one still frame.",
  responsive: "Always a whole number of ribs about 26px wide, so phones get fewer ribs, not thinner ones.",
  touchFallback: "Nothing to touch.",
  variants: [
    { id: "dusk", label: "Dusk", prompt: "Colours: shadow #020818, deep blue #0a3f86, bright blue #1c86d6, and a pale peach light #f8c9ad: the reference palette, blue hour with the last warm light. Select it with the palette option set to \"dusk\"." },
    { id: "ember", label: "Ember", prompt: "Colours: shadow #120406, deep wine #6e1420, bright vermilion #d2452a, and a pale cream light #ffe2b8. Select it with the palette option set to \"ember\"." },
    { id: "moss", label: "Moss", prompt: "Colours: shadow #04100c, deep green #0f4a3c, bright jade #2f9a78, and a pale straw light #eef0c2. Select it with the palette option set to \"moss\"." },
  ],
  preview: { bg: "#020818", mode: "fill", height: 600 },
};
