import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "sweep-cards",
  name: "Sweep Cards",
  category: "cards",
  description: "Three pastel question cards. As they come into view, a demo cursor in each card's colour sweeps the phrase that answers the question, one card after another, and leaves it highlighted. It plays once and stays still.",
  tags: ["cards", "faq", "highlight", "cursor", "animation", "pastel", "features", "marketing"],
  traits: ["ambient"],
  source: "original",
  files: ["SweepCards.tsx", "sweep-cards.css", "../../cursors/highlight-sweep/HighlightSweep.tsx", "../../cursors/highlight-sweep/highlight-sweep.css"],
  dependencies: [],
  prompt:
    "Build a row of three question-and-answer cards on black (a fictional 'Masar' explaining how sites get read by AI assistants).\n\nCards: equal columns with about 26px gaps (one column below 56rem), a 24px radius, about 46px padding. Each has a 500-weight heading at about 40px (line-height 1.14, -0.022em, balanced) and a body at about 22px with a very open line-height of 2.25. Colours per card: sky #b9e4fa with a navy heading #0b2a45 and body #164a6e; mint #bdf5d3 with #0d3a22 and #17603a; butter #fff7c2 with #3d2a00 and #5c4300.\n\nSweep: in each body one phrase is marked [[…]]. A demo cursor in that card's darker accent (#0284c7, #15a34a, #d97706: a 19px arrow with rounded corners and a soft shadow) glides in from below-right, presses and drags across the phrase; a solid box (3px wider than the words either side) in the saturated accent (#38bdf8, #22d36b, #fcd34d) with a 1.5px darker edge (#0ea5e9, #16b65b, #eab308) and a 5px radius grows behind the words line by line, while the text keeps its own dark colour. It lets go, the arrow drifts to rest just past the end and stays. The cards go in turn about 1.15s apart, starting half a second after they come into view. It plays once: no loop, no controls.",
  interaction: "Nothing to operate: the cards play their sweep once when they come into view, then stay as they are.",
  animation: "Per card: glide 900ms, press 160ms, drag about 340px/s line by line, rest 520ms; cards staggered by 1.15s. After the third, nothing moves again. Reduced motion shows all three highlights and arrows at rest from the start.",
  a11y: "Cards are articles labelled by their headings; the text is real text, and the boxes and cursors are aria-hidden.",
  responsive: "Three columns stack to one below 56rem; type and padding scale with the container, and wrapped phrases are swept line by line at any width.",
  touchFallback: "Identical on touch; it never depended on the pointer.",
  variants: [
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --swpc-edge transparent; --swpc-page #000000. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --swpc-edge rgb(0 0 0 / 0.06); --swpc-page #f4f4f2. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#000000", mode: "fill", frame: [1400, 560] },
  isNew: true,
};
