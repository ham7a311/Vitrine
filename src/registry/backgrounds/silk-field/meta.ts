import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "silk-field",
  name: "Silk Field",
  category: "backgrounds",
  description: "Domain-warped light that pours like liquid silk, with an optional glass lens that refracts the flow under your cursor.",
  tags: ["background", "webgl", "shader", "animated", "gradient", "cursor"],
  traits: ["webgl", "cursor", "ambient"],
  source: "original",
  files: ["SilkField.tsx"],
  dependencies: [],
  prompt: `Write a full-bleed animated background in raw WebGL1 — one full-screen triangle and one fragment shader, no libraries. The image is domain-warped fractal noise (three-octave fBm, warped twice: q from p, r from p + 1.8q, final f from p + 2r), all drifting very slowly with time (0.025–0.035 per axis). Map f through a four-stop palette ramp (base → deep → accent → highlight, with smoothstep bands at 0–0.42, 0.42–0.74 and 0.8–1.0), then add a silky sheen: a sharpened sine of f and r (pow 5) that adds a little accent and a touch of highlight, so the flow reads like light moving across folds of satin. Finish with a faint dithered grain to kill banding.

Optionally render a glass lens: inside a circle of radius ~0.3 of the height, magnify the flow (×0.7 toward the centre), bend it by a hemisphere normal, and split the green and blue channels slightly for chromatic aberration; add a rim light that is brighter on the upper-left and a soft shadow on the opposite side, and gently darken a thin band just outside the lens. The lens can follow the cursor (lerp 0.18), or drift on a slow Lissajous path around (0.62, 0.52) when there's no pointer.

Performance: render at 0.6× resolution (0.4× on touch), cap to 30fps on coarse pointers, pause when offscreen or the tab is hidden, and render a single still frame under reduced motion or on weak devices. Pass the palette as four colours (base, deep, accent, highlight); if it changes, crossfade the uniforms over ~900ms with smoothstep instead of recreating the context. Ship a CSS radial-gradient fallback built from the same four colours for when WebGL is unavailable.`,
  interaction: "With lens=\"cursor\", a refracting glass lens follows the pointer across the whole page; otherwise it drifts slowly or is off.",
  animation: "Continuous shader time at `speed`; lens lerp 0.18 (cursor) / 0.04 (drift); palette crossfade 900ms smoothstep.",
  a11y: "Canvas is aria-hidden and purely decorative. Reduced motion renders one still frame. Place text over it with a scrim if contrast drops below 4.5:1.",
  responsive: "Fills its container. Render scale 0.6 (0.4 on touch), DPR capped at 1, 60fps (30 on touch).",
  touchFallback: "On touch devices a cursor lens becomes a slow drifting lens.",
  variants: [
    { id: "tide", label: "Tide", prompt: "Palette SILK_PALETTES.tide = [#060b14, #0b2a5c, #1b6fd4, #9cc8ff]: navy-black base, deep blue, bright azure accent, pale sky highlight. Glass lens follows the cursor (lens=\"cursor\", lensRadius 0.28, intensity 0.75)." },
    { id: "violet", label: "Violet", prompt: "Palette SILK_PALETTES.violet = [#0c0816, #3b1a78, #7c3aed, #d9c8ff]: violet-black base, deep purple, vivid violet accent, pale lavender highlight. Glass lens follows the cursor (lens=\"cursor\", lensRadius 0.28, intensity 0.75)." },
    { id: "ember", label: "Ember", prompt: "Palette SILK_PALETTES.ember = [#120a06, #7a2408, #ff6b00, #f2c49b]: brown-black base, oxblood, hot orange accent, peach highlight. Glass lens follows the cursor (lens=\"cursor\", lensRadius 0.28, intensity 0.75)." },
    { id: "phosphor", label: "Phosphor", prompt: "Palette SILK_PALETTES.phosphor = [#07100a, #0f3a24, #3fae6a, #b9f5b0]: green-black base, forest green, terminal green accent, pale mint highlight. Glass lens follows the cursor (lens=\"cursor\", lensRadius 0.28, intensity 0.75)." },
    { id: "verdigris", label: "Verdigris", prompt: "Palette SILK_PALETTES.verdigris = [#0f0c09, #2f5550, #d97843, #f0dcc2]: warm black base, patina teal, copper-orange accent, cream highlight. Glass lens follows the cursor (lens=\"cursor\", lensRadius 0.28, intensity 0.75)." },
    { id: "graphite", label: "Graphite", prompt: "Palette SILK_PALETTES.graphite = [#0b0b0c, #2a2b2e, #8e9096, #eef0f3]: near-monochrome charcoal to silver. Glass lens follows the cursor (lens=\"cursor\", lensRadius 0.28, intensity 0.75)." },
    { id: "dusk", label: "Dusk (no lens)", prompt: "Palette SILK_PALETTES.dusk = [#15130f, #1d1914, #3a2d1f, #7a5c3c]: very low-contrast warm browns rising to a muted bronze highlight. No glass lens (lens=\"none\"); the flow alone at intensity 0.9." },
    { id: "cycle", label: "Crossfade cycle", prompt: "Step through the palettes in a fixed order every 3.2 seconds, letting the built-in 900ms uniform crossfade carry each change, so one WebGL context re-dyes itself instead of being recreated. The lens follows the cursor except while a lens-less palette is active." },
  ],
  preview: { bg: "#060b14", mode: "fill", height: 600 },
  featured: true,
};
