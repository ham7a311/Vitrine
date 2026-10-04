import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "gamut-picker",
  name: "Gamut Picker",
  category: "controls",
  description: "An OKLCH colour picker that shows where colours actually exist: lightness × chroma on a plane with a hairline where sRGB runs out, a dashed line where Display P3 does, and hatching over colours most screens can't show — plus oklch() and hex readouts and live WCAG contrast grades against white and black.",
  tags: ["color picker", "oklch", "gamut", "p3", "srgb", "contrast", "wcag", "design tools", "accessibility"],
  traits: ["click", "keyboard", "touch", "canvas"],
  source: "original",
  files: ["GamutPicker.tsx", "gamut-picker.css"],
  dependencies: [],
  prompt: `Build an OKLCH colour picker with honest gamut boundaries.

Maths (no libraries): OKLCH → OKLab → LMS (cubed) → linear sRGB with Björn Ottosson's matrices; linear sRGB → linear Display P3 with the standard 3×3 matrix; a colour is in a gamut when every channel is within [0, 1]; gamma-encode for display; hex from the clipped sRGB; WCAG contrast from relative luminance against white and black, graded AAA ≥ 7, AA ≥ 4.5, AA Large ≥ 3, else Fail.

Plane (a 320×240 canvas painted per pixel for the current hue, re-painted in a rAF when the hue changes): x is chroma 0 → 0.37, y is lightness 1 → 0. In-sRGB pixels are the colour itself; out-of-sRGB pixels are the clipped colour dimmed (more past P3) with a fine diagonal hatch. Over it, an SVG (non-scaling strokes) draws the sRGB edge as a white hairline and the P3 edge dashed — each the max chroma per lightness found by bisection at 61 rows. A ringed dot marks the colour. The plane is one role="slider" (aria-valuetext "Lightness 72%, chroma 0.160, outside sRGB"): drag anywhere with pointer capture, ←/→ chroma ±0.004, ↑/↓ lightness ±0.01, Shift ×5.

Hue: a ring (conic-gradient in oklch, masked to a band) around a round swatch, role="slider" in degrees, dragged by angle (the swatch centre doesn't count), arrows ±1° (Shift ±10°). When the colour is outside sRGB the swatch splits: nearest sRGB on the left, the colour as specified (oklch(), vivid on a P3 screen) on the right, labelled.

Readouts: oklch(L C H) with a Copy button, hex with a "nearest sRGB · P3 only / beyond P3" chip, and contrast chips (Aa on the colour in white and black) with ratios and grade badges. Legend under the plane. Two columns, stacking under 680px. Themes: night and paper.`,
  interaction: "Drag on the plane for lightness and chroma, round the ring for hue; or Tab to either and use the arrow keys (Shift for bigger steps). Copy copies the oklch() value.",
  animation: "None beyond instant feedback; the plane repaints in a frame when the hue changes.",
  a11y: "Both the plane and the ring are sliders with spoken values (including whether the colour is outside sRGB); contrast grades are text, not just colour.",
  responsive: "Two columns on wide screens, stacked under 680px; the plane keeps a 4:3 ratio.",
  touchFallback: "Drag on the plane and ring with a finger (touch-action none on both).",
  variants: [
    { id: "night", label: "Night" },
    { id: "paper", label: "Paper" },
  ],
  preview: { bg: "#08090b", mode: "fill" },
};
