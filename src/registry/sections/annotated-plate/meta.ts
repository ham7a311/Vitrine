import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "annotated-plate",
  name: "Annotated Plate",
  category: "sections",
  description: "A figure explained the way a field guide does it: numbered notes beside the plate. Point at a note and everything but its part dims, the part is outlined, and a leader line runs from the note to it.",
  tags: ["section", "figure", "annotation", "callout", "product", "screenshot", "explainer", "diagram", "leader line"],
  traits: ["hover", "click", "keyboard", "touch"],
  source: "original",
  files: ["AnnotatedPlate.tsx", "annotated-plate.css"],
  dependencies: [],
  prompt: `Build a "how it's made" section: a figure plate with numbered notes beside it, to explain one picture of a product (a screenshot, an SVG diagram) part by part.

Layout: a <figure>. Container-query layout at 46rem: notes on the left (0.8fr), plate on the right (1.2fr), 56px gap; below it, the notes stack under the plate. Notes are an ordered list of full-width buttons under hairlines: a mono number ("01"), a serif term (20px) and a muted sentence (14px). The plate is a rounded 10px frame with a 1px ring, holding the figure at a fixed aspect ratio. A mono caption sits under it: "Fig. 2" in capitals, then the caption.

Parts are boxes [x, y, w, h] in the figure's own coordinate space (for example 640 by 420). Each box has a small numbered marker (20px dot) at its top-left corner, always visible.

Interaction: hover (mouse only), focus or click on a note makes its part active. Click pins it (aria-pressed, Escape unpins). Active state: a veil the colour of the page, 70% opaque, covers the plate with a cut-out where the part is, so the rest of the picture recedes; a 1.5px accent outline marks the box; the cut-out and outline slide to the new box in 320ms cubic-bezier(.2,.8,.2,1) (animate a 1 by 1 rect with transform translate and scale, in an SVG whose viewBox is the figure's coordinate space). The note's number and its marker turn accent.

The leader line: an absolutely positioned SVG over the whole figure. Measure the note's right edge and the marker's centre with getBoundingClientRect and draw a path from the note, horizontally into the gutter, then straight to the marker, drawing itself with stroke-dashoffset in 320ms. Recompute on resize with a ResizeObserver. When the layout is stacked, skip the leader; the numbers carry it. A role=status line announces the active part. Paper and Night themes.`,
  interaction: "Hover or tab through the notes to see each part picked out; click a note to pin it and Escape to release.",
  animation: "Veil fades in 200ms; cut-out and outline slide 320ms; the leader line draws in 320ms.",
  a11y: "Notes are real buttons in an ordered list; focus activates a note and click pins it with aria-pressed. The figure keeps its own accessible name and a status line announces the highlighted part. The veil and leader are aria-hidden. Reduced motion removes the slide and the draw.",
  responsive: "Two columns above 46rem of container width; below it the notes stack under the plate and only the numbered markers point at parts.",
  touchFallback: "Tap a note to pin its part; tap again to release. Hover is never required.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f6f5f1", mode: "fill", height: 620, frame: [1100, 720] },
  isNew: true,
};
