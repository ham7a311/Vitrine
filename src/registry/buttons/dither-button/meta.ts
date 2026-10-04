import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "dither-button",
  name: "Dither Button",
  category: "buttons",
  description: "A button printed in ordered-dither pixels: hover sweeps the fill across cell by cell, and a press knocks the pixels loose before they settle.",
  tags: ["button", "dither", "dithered", "pixel", "bayer", "canvas", "hover", "retro"],
  traits: ["hover", "click", "keyboard", "canvas"],
  source: "original",
  files: ["DitherButton.tsx", "dither-button.css", "../../media/dither-portrait/dither.ts"],
  dependencies: [],
  prompt: `Build a button whose fill is drawn in pixels with an 8×8 Bayer ordered-dither matrix, on a small canvas behind a crisp HTML label. The button is 56px tall, a 1px border in the pixel colour, 4px radius, monospace uppercase label with 0.14em tracking; the canvas fills it at one pixel per 3 CSS px (prop), drawn with fillRect and image-rendering: pixelated.

For each pixel at column u (0–1 across the face) the fill level is max(rest, front): rest = 0.34·(1 − u)^1.6 gives a dotted gradient leaning in from the left at rest; front = clamp((p·1.5 − u)·2.4) is a sweep that crosses the face as the hover progress p eases 0 → 1 (lerp 0.11 per frame, also on keyboard focus). A pixel is drawn when its level beats its Bayer threshold, so the face fills in an ordered dissolve rather than a fade, and solidly once the sweep passes. The label colour mixes toward the "ink on fill" colour by p, so it stays readable on the solid face.

Pressing (pointer or Enter/Space) gives every pixel within 120px an outward kick from the press point; each pixel then springs home (v = (v − offset·0.16)·0.8), so the grid shatters for a moment and settles. The rAF loop runs only while the sweep or any pixel is still moving.`,
  interaction: "Hover or focus to sweep the dithered fill across the face; press to knock the pixels loose.",
  animation: "Hover progress lerp 0.11; press impulse up to 7px with a spring (stiffness 0.16, damping 0.8); press scale 0.98 for 160ms.",
  a11y: "A real <button> with its text label; the canvas is aria-hidden. Keyboard focus fills the face like hover, and the focus ring uses the pixel colour. Reduced motion jumps the fill and skips the scatter.",
  responsive: "The pixel grid is rebuilt from the button's measured size, so it works at any label length.",
  touchFallback: "On touch the press scatter plays on tap; the hover sweep is skipped.",
  variants: [
    { id: "violet", label: "Violet", prompt: "Pixels in #7c5cff on a violet-black page (#0d0b14); label #e9e4ff turning white on the filled face." },
    { id: "mono", label: "Mono", prompt: "Off-white pixels (#f2efe9) on near-black (#0b0b0c); the label turns near-black on the filled face." },
    { id: "signal", label: "Signal", prompt: "Signal-orange pixels (#ff6a1a) on near-black; label #ffd2b8 turning near-black on the filled face." },
  ],
  preview: { bg: "#0d0b14", mode: "center" },
};
