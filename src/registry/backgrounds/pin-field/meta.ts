import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "pin-field",
  name: "Pin Field",
  category: "backgrounds",
  description: "A pin-art board in motion: diagonal swells push rows of pins up out of a dark board, and each raised pin catches light from the upper left and throws a short shadow, so the waves read as relief. The pointer presses a hollow into the pins.",
  tags: ["background", "dots", "halftone", "waves", "pin art", "relief", "webgl", "shader"],
  traits: ["webgl", "ambient", "cursor"],
  source: "original",
  isNew: true,
  files: ["PinField.tsx", "pin-field.css", "gl.ts"],
  dependencies: [],
  prompt:
    "Write a WebGL1 full-screen fragment shader background (no libraries) that looks like a pin-art board. Divide the canvas into square cells, 76 across the longer side (about 60% as many under 640px). For each cell compute a lift from 0 to 1 at its centre: two sharpened diagonal sine ridges (pow of a 0–1 sine, powers 6 and 9, at slightly different angles, spacings and slow speeds) combined with max, then modulated by slow value noise so the swells come and go.\n\nDraw each pin as a disc whose radius grows from 11% to 38% of the cell with its lift. Light comes from the upper left: raised pins get a soft highlight towards that corner, a darker rim on the far side, and a shadow disc offset down-right by up to 30% of a cell, also scaled by the lift, darkening the board under it. Pins at rest are small, dim dots, so the whole board is visible as texture. Colour the pin from the low colour at rest to the high colour fully raised, and vignette the corners.\n\nThe pointer presses into the board: lift drops to nearly nothing in a soft circle under it, with a raised ring just outside, easing in as it enters and out as it leaves.\n\nRender at full device pixels up to 2× (70% and about 30fps on touch), pause offscreen and in hidden tabs, draw one still frame under reduced motion, and fall back to a CSS dot pattern without WebGL. Children sit above the canvas.",
  interaction: "Move the pointer to press a hollow into the board; the pins around it rise into a rim.",
  animation: "Two diagonal swells drift across the board continuously; the pointer's hollow eases in and out (0.06 per frame) and follows with a 0.14 lerp. Reduced motion draws one still frame.",
  a11y: "Decorative and hidden from assistive tech. Raised pins can be bright, so put a scrim behind text.",
  responsive: "Fills its container; pins get bigger (fewer across) on narrow screens; device pixel ratio capped at 2.",
  touchFallback: "No pointer effect on touch; the swells keep moving on their own.",
  variants: [
    { id: "graphite", label: "Graphite", prompt: "Palette { ground #0b0b0d, low #2b2b30, high #f4f4f2 }: white pins on a charcoal board." },
    { id: "brass", label: "Brass", prompt: "Palette { ground #0d0a06, low #3b2d19, high #ffd890 }: brass pins on a dark walnut board." },
    { id: "ice", label: "Ice", prompt: "Palette { ground #060a11, low #1a2a3e, high #d6ebff }: pale blue pins on a midnight board." },
  ],
  preview: { bg: "#0b0b0d", mode: "fill", height: 600 },
};
