import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "fit-compare",
  name: "Fit Compare",
  category: "commerce",
  description: "A product drawn at true scale against something the shopper already knows the size of: a bank card, a phone, a hand, an A4 sheet, a 13-inch laptop. Real units, a scale bar and a plain answer to “will it fit?”, turning the object if that helps.",
  tags: ["product", "size", "scale", "dimensions", "commerce", "comparison"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["FitCompare.tsx", "fit-compare.css", "scale.ts"],
  dependencies: [],
  prompt:
    "Build a size comparison for a product page (a fictional 'Muttrah tech pouch' in Small 120×190, Medium 180×250 and Large 260×340 mm). Everything is in millimetres; the SVG viewBox is in millimetres too, so both shapes are at true relative scale.\n\nLayout: a warm 14px-radius panel in Archivo. Header: 'How big is the Muttrah tech pouch?' and two segmented controls, cm/in and Overlay/Side by side. Body (two columns from 46rem): a stage card with the reference drawn as a flat warm-grey silhouette with a little detail (phone with screen and speaker slot, card with chip, A4 with a folded corner and text lines, laptop lid with webcam, a simple hand), standing on a hairline floor with the item from the same corner as a dashed terracotta outline over a light wash. The item is dimensioned in mono: width under the floor with end ticks, height up the right side. A round scale bar near a quarter of the stage ('10 cm', '2 in') sits top left. A legend under it. Side column: size chips with their dimensions, reference chips, and a live read-out: the fit answer in bold green or red ('13″ laptop doesn't fit: 4.4 cm too wide', 'Phone fits inside, with 10.3 cm to spare', turning it if that is the only way) and '1.6× as tall and 2.5× as wide as the phone'.",
  interaction:
    "Size and reference chips are native radio groups (arrow keys move within each). Unit and layout toggles are pressed buttons. Changing either redraws at once with a short fade on the shapes.",
  animation: "Shapes fade in over 0.3s when the size or reference changes, so the swap reads as a swap; nothing moves. Off with reduced motion.",
  a11y: "The drawing is an img whose label states both sizes and the fit answer; the same answer is in a polite live region. Chips are real radios inside fieldsets with legends.",
  responsive: "Below 46rem the controls stack under the stage; the drawing scales with its viewBox.",
  touchFallback: "Every control is a tap target; nothing depends on hover.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#e7e2d9", mode: "fill", frame: [1200, 680] },
  isNew: true,
};
