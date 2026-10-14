import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "contour-plasma",
  name: "Contour Plasma",
  category: "backgrounds",
  description: "A slow plasma field stepped into soft contour bands, like a topographic heat map: flat terraces of a four-colour ramp with hairlines at their edges, sliding calmly past each other. The pointer lifts the field around it.",
  tags: ["background", "plasma", "contour", "topographic", "bands", "gradient", "calm", "webgl", "shader"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  isNew: true,
  files: ["ContourPlasma.tsx", "contour-plasma.css", "gl.ts"],
  dependencies: [],
  prompt:
    "Write a WebGL1 full-screen fragment shader background (no libraries): the classic plasma — the sum of four sine waves (one along x, one along y, one diagonal and one radial from a centre that drifts in a slow loop), running at about a third of the usual speed — normalised to 0–1 and cut into terraces. Multiply by the band count (default 9), take the integer part as the terrace and colour it flat from a four-stop ramp at the terrace's midpoint. Shade each terrace very slightly from its low edge to its high edge so the steps read as relief, and draw a hairline in the line colour at every band edge. WebGL1 has no fwidth without an extension, so estimate the band's change over one pixel with two extra samples and use it to anti-alias the hairline at any zoom. Vignette lightly.\n\nThe pointer adds a soft Gaussian lift to the field, so the terraces swell around it, easing in and out.\n\nRender at 0.9× device pixels (lower and about 30fps on touch), pause offscreen and in hidden tabs, draw one still frame under reduced motion, and fall back to stepped CSS radial gradients without WebGL. Children sit above the canvas.",
  interaction: "Move the pointer to swell the terraces around it.",
  animation: "The field drifts slowly and continuously; the pointer's lift eases in and out and follows with a 0.06 lerp. Reduced motion draws one still frame.",
  a11y: "Decorative and hidden from assistive tech. The brightest band can be light; use a scrim behind light text.",
  responsive: "Fills its container at any aspect ratio; device pixel ratio capped at 2; hairlines stay one pixel wide.",
  touchFallback: "No pointer effect on touch; the field keeps drifting.",
  variants: [
    { id: "dusk", label: "Dusk", prompt: "Ramp #14112b → #4b2a6b → #c4577a → #f6c39a with hairlines in #0b0918: night into a peach horizon." },
    { id: "mint", label: "Mint", prompt: "Ramp #082220 → #145a52 → #4fb59a → #d9f2df with hairlines in #041412: deep teal to pale mint." },
    { id: "mono", label: "Mono", prompt: "Ramp #0d0d0e → #2e2e31 → #7b7b80 → #e7e7e4 with hairlines in #060607: greyscale terraces." },
  ],
  preview: { bg: "#14112b", mode: "fill", height: 600 },
};
