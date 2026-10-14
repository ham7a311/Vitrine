import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "pigment-shore",
  name: "Pigment Shore",
  category: "backgrounds",
  description: "A grainy bank of pigment lies along the bottom edge, one colour bleeding into another across it, mottled into tiny flakes like watercolour drying on rough paper. The sky above stays deep and empty for a headline. A background only, with no text of its own.",
  tags: ["background", "watercolour", "pigment", "grain", "nebula", "gradient", "dark", "webgl", "shader"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  isNew: true,
  files: ["PigmentShore.tsx", "pigment-shore.css", "gl.ts"],
  dependencies: [],
  prompt:
    "Write a WebGL1 full-screen fragment shader background (no libraries): a grainy bank of coloured pigment along the bottom edge under a deep, empty sky.\n\nThe bank's height along x is about 0.2 of the screen, rising to 0.6 at the far left and a little at the far right, roughened by slow noise; the pointer raises a soft bump in it under its x. Body = smoothstep(h + 0.1, h \u2212 0.22, y), with a fine noise on y so the top edge is ragged. Inside, a cloud fBm sets brightness, squared after smoothstep(0.22, 0.74) so there are dark holes as well as bright billows. Crystallise it: compute Voronoi cells at 52 per screen height and blend the cloud value 70% towards the value at each cell's centre, so the pigment breaks into tiny flat flakes; lighten slightly towards cell centres and darken their borders a touch. Colour runs left to right through three pigments, the boundaries wobbled by noise; add two hot hearts, one low on the left and one at the bottom right, and a whitened highlight on the brightest parts. Sky colour above, a little lighter near the bank. Finish with animated film grain, stronger inside the pigment.\n\nRender through a small WebGL1 harness: a full-screen triangle, the device pixel ratio capped at 2 and scaled down (and about 30fps) on touch, paused offscreen and in hidden tabs, one still frame under reduced motion, the pointer eased in with a slow lerp and released when it leaves, and a CSS gradient fallback without WebGL. Add a little per-pixel noise so the gradients never band. An optional fade prop softens the bottom edge into the ground colour: a gradient to the ground plus a backdrop blur masked to grow towards the edge. Children sit above the canvas.",
  interaction: "Move the pointer along the bottom and the bank swells under it.",
  animation: "The pigment drifts and billows slowly; the grain crawls. Reduced motion draws one still frame.",
  a11y: "Decorative and hidden from assistive tech. Put text in the dark upper part, in white.",
  responsive: "Fills its container at any aspect ratio; device pixel ratio capped at 2. The optional fade softens the bottom edge into the ground colour.",
  touchFallback: "No swell on touch; the pigment keeps drifting.",
  variants: [
    { id: "tide", label: "Tide", prompt: "Cyan bleeding through indigo into red: top #03060f, left #2aa4e4, mid #3c2f8a, right #f2333a." },
    { id: "lagoon", label: "Lagoon", prompt: "Teal through slate into gold: top #020a0c, left #1fc2ae, mid #2f5c78, right #f0b13a." },
    { id: "dusk", label: "Dusk", prompt: "Purple through magenta into salmon: top #07040d, left #7a4cf0, mid #b0399a, right #ff7a86." },
  ],
  preview: { bg: "#03060f", mode: "fill", height: 600 },
};
