import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "unfold-bento",
  name: "Unfold Bento",
  category: "cards",
  description: "A bento of bright colour tiles that open in place. Choose one and it unfolds to fill the whole grid with its story — detail, steps and a link — while the others fold down into a row of chips you can jump between. The morph uses view transitions, so every tile travels to its new home.",
  tags: ["bento", "grid", "features", "expand", "disclosure", "view transitions", "colourful", "interactive", "tabs"],
  traits: ["click", "keyboard", "hover"],
  source: "original",
  isNew: true,
  files: ["UnfoldBento.tsx", "unfold-bento.css", "layout.ts", "unfold.ts"],
  dependencies: [],
  prompt:
    "Build a feature bento whose tiles unfold. Props: tiles [{id, title, kicker, color, teaser (a small illustration), detail, steps, cta {label, href}, span {lg, md, sm} as [columns, rows]}], eyebrow, title, lede, theme, rowHeight (210) and onNavigate.\n\nFolded: a 4-column grid at 900px and over, 2 from 560px, 1 below (measured with a ResizeObserver), 12px gaps. Each tile is a real button filled with its own bright colour and dark ink, 26px corners, a soft white sheen in its top-right corner, the teaser filling the upper part, the title and kicker at the bottom, and a round '+' in the bottom-right corner that turns 90° on hover while the tile lifts 3px with a shadow in its own colour.\n\nUnfolded: choosing a tile replaces the grid with two parts while keeping the grid's height, so the page doesn't jump. The chosen tile becomes a large panel (30px corners, two columns: kicker, a big title, the detail, numbered steps on white dots and a dark pill link; the teaser large on the right), with previous, next and a dark close button in its top-right corner. Below it, every other tile becomes a pill chip with a dot of its colour; choosing a chip unfolds that tile instead. The change runs inside document.startViewTransition (with flushSync), and every tile has its own view-transition-name in both forms, so each one travels and reshapes into its new place over 520ms. Without view transitions, or under reduced motion, it changes instantly.\n\nKeep a small reducer for the state ({open, from}: open, close, step through with wrap-around). Focus moves to the panel's heading when it opens and back to the tile it came from when it folds. Escape folds it. The panel is a region labelled by its heading, and tiles say aria-expanded and point at it.\n\nBelow 720px the panel stacks with the illustration on top.",
  interaction: "Click or press Enter on a tile to unfold it; use the arrows to move between features, the chips to jump, and the close button or Escape to fold it back.",
  animation: "Tiles lift 3px on hover and the plus turns; unfolding morphs every tile into its new place over 520ms with view transitions. Reduced motion changes instantly.",
  a11y: "Tiles are buttons with aria-expanded and aria-controls. The open panel is a labelled region; focus goes to its heading on open and back to the tile on close. Escape closes. Chips are buttons in a labelled group. Dark ink on every tile colour keeps text above 4.5:1.",
  responsive: "Four, two or one columns from the stage's width; the open panel stacks below 720px and the chips wrap.",
  touchFallback: "Nothing depends on hover; tap to unfold and tap a chip to switch.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --ub-ground #0e0e12; --ub-ink #f4f2ee; --ub-line rgba(255, 255, 255, 0.1); --ub-muted #a6a4ad. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --ub-ground #f3f0e8; --ub-ink #17151a; --ub-line rgba(23, 21, 26, 0.1); --ub-muted #5e5a63. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0e0e12", mode: "fill", frame: [1440, 1000] },
};
