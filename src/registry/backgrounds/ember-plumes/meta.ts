import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ember-plumes",
  name: "Ember Plumes",
  category: "backgrounds",
  description: "Feathery plumes of fire-coloured smoke curl in from the sides and leave a dark middle, like a long exposure of something burning slowly. Each plume is lit along one edge and fades into olive, out-of-focus light. A background only, with no text of its own.",
  tags: ["background", "smoke", "fire", "plumes", "long exposure", "warm", "dark", "webgl", "shader"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  isNew: true,
  files: ["EmberPlumes.tsx", "ember-plumes.css", "gl.ts"],
  dependencies: [],
  prompt:
    "Write a WebGL1 full-screen fragment shader background (no libraries): feathery plumes of fire-coloured smoke that curl in from the left and right edges and leave the middle dark, like a long exposure.\n\nWork in coordinates centred on the screen, measured in screen heights. A side mask keeps the plumes at the edges: the horizontal distance from the centre as a fraction of half the width, roughened by a slow noise and pushed a little further in at the top corners, through smoothstep(0.42, 1.0). Inside it, build a long exposure: domain-warp the position once with two fBm lookups, choose a smear direction from a slow low-frequency noise (turned by \u00b12 radians, and tilted outwards on each side), then take eight samples of fBm along a slightly curved line in that direction, each through smoothstep(0.36, 0.6), and average them; the result is clumps of smoke smeared into feathers. The same loop gives the slope across the smear (each sample weighted by its signed offset); use it to brighten one side of every petal and shade the other, and to lay the hottest colour on the lit crests. Add a fine fBm stretched about twelve times along the flow for hair-like filaments.\n\nColour the density through four tones \u2014 ground, a deep ember, the main flame colour, a pale hot crest \u2014 and drift soft olive blotches of out-of-focus light through the dark middle. Vignette the corners slightly. The pointer parts the plumes: pixels near it are pushed away along a Gaussian. Everything drifts slowly (time \u00d7 0.05).\n\nRender through a small WebGL1 harness: a full-screen triangle, the device pixel ratio capped at 2 and scaled down (and about 30fps) on touch, paused offscreen and in hidden tabs, one still frame under reduced motion, the pointer eased in with a slow lerp and released when it leaves, and a CSS gradient fallback without WebGL. Add a little per-pixel noise so the gradients never band. An optional fade prop softens the bottom edge into the ground colour: a gradient to the ground plus a backdrop blur masked to grow towards the edge. Children sit above the canvas.",
  interaction: "Move the pointer near a plume and it parts around it.",
  animation: "The smoke smears and drifts slowly; plumes billow in and out at the edges. Reduced motion draws one still frame.",
  a11y: "Decorative and hidden from assistive tech. The middle stays dark, so white text over the centre reads well; keep text off the bright edges.",
  responsive: "Fills its container at any aspect ratio; device pixel ratio capped at 2. The optional fade softens the bottom edge into the ground colour.",
  touchFallback: "No pointer response on touch; the plumes keep drifting at a lower frame rate.",
  variants: [
    { id: "coral", label: "Coral", prompt: "Coral fire on a black-olive ground: bg #0a0b06, deep #4d1006, mid #d4461d, hot #ffb07a, spot #30320f." },
    { id: "orchid", label: "Orchid", prompt: "Magenta-pink smoke on violet-black: bg #09060d, deep #3c0c3e, mid #c2409c, hot #ffb6e8, spot #1f1632." },
    { id: "citrine", label: "Citrine", prompt: "Golden yellow smoke on warm black: bg #0a0805, deep #4a2a05, mid #df931d, hot #ffe6a2, spot #2c2612." },
  ],
  preview: { bg: "#0a0b06", mode: "fill", height: 600 },
};
