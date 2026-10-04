import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "dither-portrait",
  name: "Dither Portrait",
  category: "media",
  description: "A picture printed in two inks by error diffusion; a lens follows the pointer and shows the full-colour original, its edge breaking into dots.",
  tags: ["dither", "dithered", "image", "lens", "pixel", "1-bit", "canvas", "hover"],
  traits: ["canvas", "cursor", "click", "touch"],
  source: "original",
  files: ["DitherPortrait.tsx", "dither.ts", "dither-portrait.css", "../art-gallery/studies.ts"],
  dependencies: [],
  prompt: `Build an image component that prints a picture in exactly two inks and lets a lens reveal the original. Draw the source (an image URL, or by default a generated horizon study painted on canvas) cover-fitted into the frame; sample it at one cell per 2 CSS px, convert to luma with a slight gamma lift, and dither it: Floyd–Steinberg error diffusion by default (serpentine scan, 7/16 · 3/16 · 5/16 · 1/16), with Atkinson (six neighbours at 1/8 each, so highlights stay open) and an 8×8 Bayer ordered matrix as alternatives. Write the 0/1 mask into a small canvas in the ink and paper colours and draw it up with image smoothing off, so every cell stays a crisp square.

A round lens (radius 110px, or 30% of the frame on small screens) follows the pointer on a 0.22 lerp and grows in on enter and shrinks away on leave. Inside it the full-colour original shows through; across a 52px feathered edge each cell shows colour only where the radial falloff beats that cell's Bayer threshold, so the boundary breaks into the same kind of dots instead of a hard circle. The edge mask is rebuilt only for the cells around the lens. A pill button in the corner cycles the dither pattern and re-prints the picture.`,
  interaction: "Move over the picture to reveal colour under the lens; click the pill to switch between Floyd–Steinberg, Atkinson and Bayer.",
  animation: "Lens position lerp 0.22 and radius lerp 0.18; the loop stops once the lens settles.",
  a11y: "The canvas has role=\"img\" and a written description. The pattern button is a real button whose label names the current pattern. Reduced motion moves the lens directly.",
  responsive: "Re-prints at the new size on resize; the lens caps at 30% of the smaller side.",
  touchFallback: "Tap or drag to place the lens; vertical swipes still scroll.",
  promptAllow: ["ink"],
  variants: [
    { id: "ink", label: "Ink on paper", prompt: "Ink #1b1a17 on paper #efe9dc, like a risograph print." },
    { id: "phosphor", label: "Phosphor", prompt: "Phosphor green ink #8fe388 on a green-black ground #07100a, like an old monochrome monitor." },
    { id: "violet", label: "Violet", prompt: "Lavender ink #c9b6ff on deep violet #140c2b." },
  ],
  preview: { bg: "#efe9dc", mode: "fill", height: 600 },
};
