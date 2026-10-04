import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "cyanotype",
  name: "Cyanotype",
  category: "backgrounds",
  description: "A sun print: ferns, grasses and umbels develop out of Prussian blue as the page loads, and your pointer holds a ginkgo leaf whose soft shadow prints wherever it rests.",
  tags: ["background", "botanical", "print", "blue", "paper", "canvas", "photography", "craft"],
  traits: ["canvas", "cursor", "ambient"],
  source: "original",
  files: ["Cyanotype.tsx"],
  dependencies: [],
  prompt:
    "Simulate a cyanotype on a low-resolution exposure grid (2px cells) drawn to a canvas and scaled up smoothly. Draw specimens procedurally onto an occlusion canvas: fern fronds (a curved rachis with paired pinnae of tapering rounded leaflets), grass stems with seed heads, and umbels (spokes ending in clusters of dots). Compose them from the lower corners and one upper corner so the centre stays open for type, and read the occlusion back once.\n\nEach cell has an exposure value that moves toward 1 − occlusion. On load every cell starts at 0 (white paper) and exposes toward Prussian blue over about five seconds, with per-cell grain in the exposure rate so the blue is mottled like real paper; colour is paper → blue → deep blue by 1 − e^(−2.4·exposure). Specimens stay white with soft edges.\n\nThe pointer holds a ginkgo leaf above the paper: its silhouette, blurred because it isn't touching the sheet and turning slightly with the direction of travel, is added to the occlusion. Where it rests the paper lightens (the shadow develops); when it moves on, that area exposes back to blue. A 'print' variant leaves a cream border where the brushed-on emulsion stops in a ragged edge. The loop sleeps once everything has settled and the pointer is away; pause offscreen; reduced motion shows the finished print.",
  interaction: "Move the pointer over the print: a held ginkgo leaf casts a soft shadow that prints where it rests and fades back to blue as you move on.",
  animation: "Development on load over ~5s; the leaf's print lightens at 0.55/s and re-exposes at the development rate. The loop stops when nothing changes.",
  a11y: "Decorative canvas (aria-hidden); text placed on it is real text. Light text on the developed blue passes contrast; the white specimens are kept to the edges. Reduced motion shows the finished print with no development or leaf.",
  responsive: "Rebuilds the composition and grid for its size; specimens scale with the shorter side.",
  touchFallback: "On touch the print develops on load; the leaf appears where you drag.",
  promptAllow: ["sheet", "print"],
  variants: [
    { id: "sheet", label: "Full sheet", prompt: "edge=\"sheet\": the Prussian-blue exposure fills the whole box edge to edge." },
    { id: "print", label: "Brushed print", prompt: "edge=\"print\": the emulsion is brush-coated, stopping short of the sheet in a ragged hand-brushed border on cream paper, like a print made by hand; extra vertical padding for the type." },
  ],
  preview: { bg: "#103468", mode: "fill" },
};
