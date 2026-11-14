import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "paper-strata",
  name: "Paper Strata",
  category: "backgrounds",
  description: "Layers of cut paper stacked like hills, each casting a soft shadow on the one behind. They drift sideways at different speeds and lean with the pointer, and the flat top of the section is an obvious place for a headline.",
  tags: ["background", "hero", "paper", "layers", "cut paper", "hills", "parallax", "svg", "calm"],
  traits: ["ambient", "hover"],
  source: "original",
  isNew: true,
  files: ["PaperStrata.tsx", "paper-strata.css"],
  dependencies: [],
  prompt: `Build a background of layered cut paper: six sheets stacked like a range of hills, each casting a soft shadow on the sheet behind it. No canvas; SVG and CSS only.

Layout. The section is filled with a flat backdrop colour. The sheets occupy the lower part: the farthest sheet's edge sits 46% down the section and the nearest 90% down, the others evenly between. Everything above the hills is flat colour, kept for a headline. The number of sheets (3 to 7) and the horizon are options.

A sheet. An SVG with viewBox 0 0 2000 600 and preserveAspectRatio none, 200% of the section's width. Its path runs along a top edge and closes along the bottom. The edge is three sines that repeat every 1,000 units: base + amplitude × (0.56·sin(a + p1) + 0.29·sin(2a + p2) + 0.15·sin(3a + p3)), where a = x / 1000 × 2π and the phases are fixed per sheet, sampled every 20 units. Amplitude falls from 62 units on the farthest sheet to 32 on the nearest. Because the edge repeats exactly once across half the SVG, sliding it left by 50% loops with no seam.

Depth. Each SVG carries filter: drop-shadow(0 −7px 9px shadow), so every sheet shadows the one behind. Colours step from the lightest at the back to the darkest at the front.

Motion. Each SVG animates transform: translateX(0 → −50%), linear, infinite. The farthest takes 190s and the nearest 100s; alternate sheets run in reverse; each starts 23s further into its cycle than the one before. The sheets also lean with the pointer: each wrapper translates by (−16px × depth × x, −9px × depth × y), with x and y the pointer's position from −1 to 1 and depth 0 at the back to 1 at the front, eased over 700ms; it returns to rest when the pointer leaves.

Production behaviour: a children slot above the sheets; the sheets are aria-hidden. Under reduced motion, or with motion set to "still", stop the drift with every sheet offset by 18%, and ignore the pointer.`,
  interaction: "Move the pointer: the nearest sheets lean the most.",
  animation: "Each sheet drifts one full width in 100 to 190 seconds, alternating direction.",
  a11y: "Decorative and aria-hidden. The upper part of the section is flat colour, so text contrast does not change. Reduced motion holds the sheets still.",
  responsive: "Stretches to any size; shadows and stroke widths do not scale with it.",
  touchFallback: "The drift needs no input.",
  variants: [
    { id: "clay", label: "Clay", prompt: "Colours: backdrop #f4e9db; sheets from back to front #efd3b6, #e6b48c, #d98f63, #c56c41, #a34d2c, #7a321d, #55200f; shadow rgb(70 30 10 / 0.3); text #3a1d10. Select it with the palette option set to \"clay\"." },
    { id: "tide", label: "Tide", prompt: "Colours: backdrop #eaf2f1; sheets from back to front #cfe3e2, #a9cdd0, #7fb1ba, #5592a2, #357285, #1f5367, #123848; shadow rgb(8 40 56 / 0.3); text #0f2f3d. Select it with the palette option set to \"tide\"." },
    { id: "ink", label: "Ink", prompt: "Colours: backdrop #1d1e22; sheets from back to front #2a2b31, #24252a, #1e1f24, #18191d, #131417, #0e0f11, #09090b; shadow rgb(0 0 0 / 0.6); text #ececef. In the dark the shadow alone would vanish, so each sheet also has a 1.5px stroke of white at 9% along its cut edge (non-scaling). Select it with the palette option set to \"ink\"." },
  ],
  preview: { bg: "#f4e9db", mode: "fill", height: 560 },
};
