import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "mercury-glass",
  name: "Mercury Glass",
  category: "backgrounds",
  description: "Drops of clear glass drifting over a fine printed pattern and bending it like lenses, with a bright rim where the glass is thinnest. The pointer is one more drop: bring it near the others and they neck and merge.",
  tags: ["background", "webgl", "shader", "glass", "metaballs", "refraction", "liquid"],
  traits: ["webgl", "cursor", "ambient"],
  source: "original",
  files: ["MercuryGlass.tsx"],
  dependencies: [],
  prompt: `Write a WebGL1 fragment-shader background of clear glass metaballs over a printed pattern.

The print: a paper colour with two soft colour bands that wander in y, fine diagonal hairlines (smoothstep on sin((x+y)·150)) and a dot grid — detail fine enough that refraction is obvious.

The drops: six balls passed as a uniform vec3 array (xy in aspect space, z radius): five drift on slow, unrelated sine orbits computed in JS, and the sixth follows the pointer (eased) and grows from radius 0 when the pointer enters. The field is Σ r²/|p − c|², inside where it exceeds 1 (smoothstep 0.96–1.04 for an anti-aliased edge), and its analytic gradient is summed in the same loop. Let e = 1/f; its slope (−∇f/f²) is the lens: offset the print lookup by −slope × 0.035, sampling red, green and blue at slightly different strengths for dispersion, and tint the glass more where it is steep. Add a Fresnel rim (steepness³) and a directional highlight, and a faint contact shadow on the print outside the drops (the field sampled at a small down-right offset). Because the field is additive, drops neck and merge as they approach each other, the pointer included.

Render at device resolution capped at 1× (0.8× on touch), stop frames offscreen or in hidden tabs, and draw one still frame under reduced motion. Colours are a prop: [paper, ink, band 1, band 2, glass tint].`,
  interaction: "Your pointer becomes a glass drop; push it into the others and they merge, then pull it away to watch them neck and part.",
  animation: "Drops orbit on 10–20s sines; the pointer drop eases at 12% per frame and grows in over about a third of a second.",
  a11y: "The canvas is aria-hidden and decorative. Reduced motion draws one still frame.",
  responsive: "Drops are sized in height units and grow slightly on portrait screens so a few stay in view.",
  touchFallback: "No pointer drop on touch; the five drops keep drifting and merging.",
  promptAllow: ["clear"],
  variants: [
    { id: "clear", label: "Clear", prompt: "Colours [#f3efe6 paper, #1b1a17 ink, #7c5cc4 band, #d9733a band, #dfe9f2 tint]: light paper print, violet and orange bands; overlay text dark (#1b1a17)." },
    { id: "smoke", label: "Smoke", prompt: "Colours [#121114 paper, #efe8dc ink, #46628a band, #8a5a3a band, #9aa4b2 tint]: a dark print with cream hairlines, slate-blue and bronze bands, smoky glass; overlay text white." },
    { id: "rose", label: "Rose", prompt: "Colours [#f7ece8 paper, #3a1f24 ink, #d96a7f band, #e8a35a band, #f6d6dc tint]: blush paper, rose and apricot bands, pink-tinted glass; overlay text dark." },
  ],
  preview: { bg: "#f3efe6", mode: "fill" },
};
