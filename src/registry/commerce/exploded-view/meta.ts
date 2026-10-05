import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "exploded-view",
  name: "Exploded View",
  category: "commerce",
  description: "A product drawing whose parts separate along their own axes, like an assembly sheet. Numbered balloons and a parts list are linked to the drawing both ways: point at a part in either place and it comes out on its own. A scrub sets how far everything spreads.",
  tags: ["product", "diagram", "parts", "exploded", "technical", "commerce", "svg"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  files: ["ExplodedView.tsx", "exploded-view.css", "explode.ts"],
  dependencies: [],
  prompt:
    "Build an exploded product drawing (here an original drawing of a small desk lamp, 'Qalam desk lamp, model DL-2', 7 parts). Each part is { id, name, detail, shape (SVG in a shared 480×520 viewBox), dir (where it travels at full explosion), anchor (where its callout attaches) }.\n\nLayout: a drafting sheet card in IBM Plex Sans with a faint 20-unit blue grid, the title and a mono stamp 'Exploded view · 7 parts'. Parts are line drawings: white fills with 1.5px ink outlines, tubes drawn as a 10px ink stroke with a 7px paper stroke inside. Each part translates by dir × amount; a dash-dot blue axis line runs from its resting anchor to where it is now. Numbered balloons sit in the left and right margins (by which half the part is in), spread so they never overlap and never cross within a column, each with a thin leader that runs out horizontally and then straight to the part. Under the drawing: 'Explode 35%' and a range slider with an Explode/Assemble button. Beside it (from 50rem) a parts card: numbered rows with the name and a muted spec line.\n\nLinking: hovering or focusing a part in the list, or hovering it in the drawing, draws that part all the way out (whatever the slider says), tints it pale blue (the bulb glows warm), fades the others to 45%, and turns its balloon and leader blue. Clicking pins it.",
  interaction:
    "The parts list is the keyboard layer: Tab through the rows; focus draws a part out; Enter or Space pins it (aria-pressed). The slider and button set the explosion for all parts. In the drawing, hover draws out and click pins.",
  animation: "Parts ease toward their positions in JavaScript so the leaders and axes move with them, not ahead of them. Reduced motion or motion={false} snaps instead.",
  a11y: "The drawing is a labelled img that states the explosion amount and the part drawn out; the parts list is real buttons in an ordered list carrying the same numbers as the balloons.",
  responsive: "Below 50rem the parts list moves under the sheet; the drawing scales with its viewBox.",
  touchFallback: "Tap a row or a part to pin it out; tap again to put it back.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#e4e8ec", mode: "fill", frame: [1200, 760] },
  isNew: true,
};
