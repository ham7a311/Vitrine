import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "dither-logo",
  name: "Dither Logo",
  category: "type",
  description: "A mark rebuilt from square dots by error diffusion; the pointer pushes the dots aside and a click sends a ripple through them.",
  tags: ["dither", "dithered", "logo", "particles", "canvas", "pixel", "brand", "interactive"],
  traits: ["canvas", "cursor", "click", "touch"],
  source: "original",
  files: ["DitherLogo.tsx", "dither-logo.css", "../../media/dither-portrait/dither.ts"],
  dependencies: [],
  prompt: `Build a logo component that turns a mark into a field of square dots and lets you disturb them. The source is an image/SVG URL, or a piece of text set in Instrument Serif italic on an offscreen canvas and trimmed to its own bounds. Blur it slightly (3.75px, padded so edges don't clip), sample it down to a grid of at most 200 cells on the long side, apply optional contrast and gamma, and run Floyd–Steinberg error diffusion (serpentine, adjustable strength) only inside the mark's alpha. With invert on (default), the dots fill a rounded tile (corner radius 20% of the short side) everywhere except the mark, so the logo reads as a cut-out; with invert off, the dots draw the mark itself.

Each dot is a fillRect square at 72% of the cell (so the grid shows), centred in the canvas, in the element's text colour by default. The pointer pushes dots within 100px away with strength (1 − d/100)³ × 40; a release sends a ripple ring outward at 225px/s, 37px wide, for 675ms (stacked ripples add up); every dot's offset chases its target force with a 0.12 lerp and snaps to zero below 0.01, so the loop stops by itself once the field is still. It re-dithers (debounced) when the canvas width changes, and uses slightly smaller dots on phones.`,
  interaction: "Move across the mark to push dots aside; click or tap to send a ripple through the field.",
  animation: "Offsets ease at 0.12 per frame toward the cursor and ripple forces; ripples travel 225px/s for 675ms. The loop sleeps when everything settles.",
  a11y: "The canvas is role=\"img\" with the brand name as its label, so the identity is never only in dots. Reduced motion draws the still mark with no pushing or ripples.",
  responsive: "Fills its box, re-dithers on resize (debounced) and scales the mark to a fraction of the smaller side; dots shrink 20% under 640px.",
  touchFallback: "Dragging a finger pushes the dots like the cursor; lifting it sends a ripple.",
  variants: [
    { id: "ink", label: "Ink", prompt: "Off-white dots (#f2efe9) on near-black (#0b0b0c)." },
    { id: "paper", label: "Paper", prompt: "Near-black dots (#111111) on warm paper (#f2efe9)." },
    { id: "signal", label: "Signal", prompt: "Signal-orange dots (#ff6a1a) on near-black (#0b0b0c)." },
  ],
  preview: { bg: "#0b0b0c", mode: "fill", height: 560 },
};
