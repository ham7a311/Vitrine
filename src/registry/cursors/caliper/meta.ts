import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "caliper",
  name: "Caliper",
  category: "cursors",
  description: "A measuring cursor for design specs. Full-bleed hairlines with live X/Y readouts; hover a layer for its size and red spacing lines to its frame, the way a design tool shows them. Drag to measure any distance and angle, click to drop a pin, and hold Shift to snap to the 8px grid.",
  tags: ["cursor", "crosshair", "measure", "redline", "design tool", "spec", "grid", "handoff"],
  traits: ["cursor", "click", "keyboard"],
  source: "original",
  files: ["Caliper.tsx", "caliper.css"],
  dependencies: [],
  prompt: `Build a measuring cursor as a wrapper component, for design-spec pages.

Overlay: an aria-hidden, pointer-events:none layer above the children (the host is relative, overflow hidden, user-select none). Under (hover: hover) and (pointer: fine) the system cursor is hidden inside the host except over real controls. Everything is host-local CSS pixels, corrected by rect.width / offsetWidth, and drawn directly in the event handlers with transforms — there is no animation loop.

Crosshair: a vertical and a horizontal 1px line across the whole host through the pointer, dashed (5 on, 3 off) at 60% opacity, with mono readout chips "x 412" riding the top edge and "y 236" the left edge.

Layers: any element marked data-measure is outlined (1px accent, 7% fill) with a "248 × 120" size chip below it. Its frame is the nearest ancestor with data-measure or data-measure-frame (else the host). For each side with a gap, draw a red 1px redline from the element's edge to the frame's edge, with 7px end ticks and the distance in a red chip at its middle — exactly the numbers from the layout, so 16px of padding reads 16.

Measuring: pointerdown on anything that isn't a real control starts a measure (with pointer capture and no text selection); dragging more than 3px draws a dimension line with square end ticks and a chip "214 px · 32°" (angle counter-clockwise from east), kept after release. A click without a drag drops a pin (ring plus its coordinates); from then on a dashed dimension line runs from the pin to the pointer, live. Clicking the pin again lifts it; Escape clears pins and measures. Holding Shift snaps every coordinate to the grid (prop, default 8), shows the grid faintly, makes the crosshair solid and shows a "Snap 8" badge. A polite live region announces pins and measurements. theme sets the overlay colours.`,
  interaction: "Hover the card's layers; drag to measure; click to pin and move to read distances; hold Shift to snap; Esc clears.",
  animation: "Readouts and chips fade 140–160ms; everything else tracks the pointer 1:1 with no easing.",
  a11y: "The overlay is aria-hidden; pins and measurements are announced in a polite live region, and the spec values are also listed as real text in the tokens panel. Real controls inside the host keep their cursor and their clicks. With reduced motion the fades are removed.",
  responsive: "The spec and tokens stack under 1024px. Measurements are host-local, so they stay correct at any width and inside scaled previews.",
  touchFallback: "Touch shows no overlay; the spec reads as a normal page with its token list.",
  variants: [
    { id: "blueprint", label: "Blueprint", prompt: "theme=\"blueprint\": deep navy page (#0a1a2e) with a 24px sky-blue grid at 7%, sky crosshair and outlines (#7cc4ff), red redlines, amber dimension lines; ink #dcecff." },
    { id: "paper", label: "Paper", prompt: "theme=\"paper\": off-white page (#f4f3ef) with a faint blue 24px grid, blue outlines, red redlines and dark ink (#1b2a44) on white artboards — like a printed spec sheet." },
  ],
  preview: { bg: "#0a1a2e", mode: "fill" },
};
