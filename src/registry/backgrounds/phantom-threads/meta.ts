import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "phantom-threads",
  name: "Phantom Threads",
  category: "backgrounds",
  description: "Long strands of light swaying across a dark field like a long-exposure light painting: hot white cores, wide soft halos, a faint colour fringe, and pulses travelling along each thread. The pointer warms the strands it passes.",
  tags: ["background", "light", "fibers", "strands", "glow", "aurora", "webgl", "shader"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  isNew: true,
  files: ["PhantomThreads.tsx", "phantom-threads.css", "gl.ts"],
  dependencies: [],
  prompt:
    "Write a WebGL1 full-screen fragment shader background (no libraries): about 26 strands of light (60% as many under 640px) running from bottom to top across the whole width, leaning about 18° and each swaying on two slow sine waves of different frequency and phase, so neighbours drift in and out of each other. Each strand gets fixed random traits from its index: position jitter, lean, brightness and a depth: near strands are sharp (a core about 0.16% of the height wide), far ones are out of focus — up to ten times wider and half as bright — so the field has depth of field.\n\nFor every pixel, sum the strands: a Gaussian core in the core colour, sampled three times with a sub-pixel horizontal offset per channel so the edges carry a faint red/blue fringe; an exponential halo ten times wider in the glow colour; and a very wide faint haze. Modulate each strand by a pulse of light travelling up its length at its own speed, and fade them gently towards the top and bottom. Tone-map the sum with 1 − exp(−x) so overlaps bloom instead of clipping, and add it over a vertical gradient from the ground to the haze colour, with a soft vignette.\n\nThe pointer warms the strands near it (up to 2.6× brighter in a soft circle), easing in and out.\n\nRender at 0.8× device pixels (lower and about 30fps on touch), pause offscreen and in hidden tabs, draw one still frame under reduced motion, and fall back to CSS stripes without WebGL. Children sit above the canvas.",
  interaction: "Move the pointer across the threads to warm the ones near it.",
  animation: "Strands sway and pulse continuously; the pointer's warmth eases in and out (0.06 per frame). Reduced motion draws one still frame.",
  a11y: "Decorative and hidden from assistive tech. Cores can be bright where strands cross; keep a scrim behind text.",
  responsive: "Fills its container; fewer strands under 640px; device pixel ratio capped at 2.",
  touchFallback: "No pointer effect on touch; the threads keep moving on their own.",
  variants: [
    { id: "violet", label: "Violet", prompt: "Palette { ground #06041a, haze #130b36, glow #7d5cff, core #efe8ff }: violet threads on deep indigo." },
    { id: "ice", label: "Ice", prompt: "Palette { ground #03070d, haze #0a1a2c, glow #4aa8ff, core #e6f5ff }: cold blue threads on midnight." },
    { id: "ember", label: "Ember", prompt: "Palette { ground #0a0402, haze #220c05, glow #ff6a2e, core #ffeedd }: orange threads like embers on near-black." },
  ],
  preview: { bg: "#06041a", mode: "fill", height: 600 },
};
