import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "stitch-button",
  name: "Stitch Button",
  category: "buttons",
  description: "A button sewn from leather or denim with a running stitch inside its edge; hover pulls the thread tight and lifts the panel, and pressing puckers the seam.",
  tags: ["button", "border", "stitch", "leather", "denim", "craft", "shop"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  files: ["StitchButton.tsx", "stitch-button.css"],
  dependencies: [],
  prompt:
    "Build a shop button cut from fabric: a textured face with a tiny dotted grain, a light top edge and a darker bottom lip. 5px inside the edge, a running stitch drawn as an SVG rounded rect sized from the measured button: a thread stroke (dasharray 6 4, round caps) over a dark copy offset 1px down, so each stitch sits in a groove.\n\nOn hover or focus the dasharray animates to 6.5 2.5 \u2014 the thread pulls tight \u2014 while the panel lifts 1px and its shadow deepens (420ms expo-out). Pressing squashes it slightly (scale 0.985 \u00d7 0.97) and shifts the dash offset, so the seam puckers.",
  interaction: "Hover or focus to pull the stitches tight; press to pucker the seam.",
  animation: "Stitch spacing, lift and shadow over 420ms expo-out; press is instant.",
  a11y: "A real button with a text label; the seam is decorative. Thread-coloured focus outline. Reduced motion makes changes instant.",
  responsive: "The seam is rebuilt from the measured size, so any label fits.",
  variants: [
    { id: "leather", label: "Leather", prompt: "Leather: a warm brown radial-gradient face (130% 120% at 30% 0%, #8a5532 → #5a321c), cream thread #ecd9ae, label #f6ead0." },
    { id: "denim", label: "Denim", prompt: "Denim: an indigo twill face (linear-gradient(160deg, #36598f, #233e69)), orange thread #e89a3c, label #f3f0e8." },
  ],
  preview: { bg: "#efe6d8", mode: "fill" },
};
