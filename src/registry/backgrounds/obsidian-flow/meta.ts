import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "obsidian-flow",
  name: "Obsidian Flow",
  category: "backgrounds",
  description: "A pool of black liquid that slowly folds and catches cold light under a faint square grid, with a soft ripple under the cursor. A background only, with no text of its own.",
  tags: ["background", "dark", "liquid", "webgl", "shader", "grid", "glossy", "ambient"],
  traits: ["webgl", "cursor", "ambient"],
  source: "original",
  files: ["ObsidianFlow.tsx", "obsidian-flow.css"],
  dependencies: [],
  prompt:
    "Build a full-bleed animated background: glossy black liquid under a faint grid, with no text, nav or buttons of its own, and an optional slot for content laid over it.\n\nShader (one WebGL full-screen triangle): domain-warped fbm (four octaves, two levels of warp, drifting at 0.06 of time) read as a height field. Take the normal from finite differences (scaled 0.32), light it with one cold key from the upper right (0.35, 0.55, 0.75): a tight specular (power 22) in a pale steel #9fb4cc at 0.7, a broad sheen (power 4) and a strong Fresnel rim (×1.25) in #2b3a4c over a near-black #07090c base, so the surface reads as small, many swirls of wet obsidian. A gloss prop (0.4 to 1.6) scales both reflections. The liquid darkens toward the bottom of the frame. A fine mouse pointer adds a small circular ripple (sin of distance × 26, fading with distance) that eases in and out.\n\nOver it: a square grid of 1px lines at 5.5% white, cells about 7% of the width (56 to 136px), and a floor gradient over the bottom 22% fading to black.\n\nPerformance: render at 0.6 of the device pixels (0.45 on touch, about 30fps there), pause offscreen and in hidden tabs. Reduced motion or motion={false} renders one still frame. Without WebGL a radial gradient (#1b2430 to #07090c) stands in.",
  interaction: "A fine pointer leaves a soft ripple in the liquid; nothing else responds. Content placed inside works as normal.",
  animation: "Continuous slow folding; the ripple eases in over about half a second and out when the pointer leaves. Paused offscreen and in hidden tabs; still under reduced motion.",
  a11y: "Decorative: the canvas and grid are aria-hidden and it has no text. Anything placed over it needs its own contrast check (white text on the dark version passes easily).",
  responsive: "Fills its container at any size; the grid cells scale with the width.",
  touchFallback: "No ripple on touch; the liquid keeps folding at a lower frame rate.",
  variants: [
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --obsf-fallback radial-gradient(80% 70% at 60% 40%, #1b2430, #07090c 70%); --obsf-floor #000000; --obsf-grid rgb(255 255 255 / 0.055). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --obsf-fallback radial-gradient(80% 70% at 60% 40%, #f4f7fa, #c9cfd6 70%); --obsf-floor #e9edf1; --obsf-grid rgb(10 14 20 / 0.07). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#07090c", mode: "fill", height: 620 },
};
