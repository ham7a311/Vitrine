import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "marginalia",
  name: "Marginalia",
  category: "data",
  description: "A collection that recomposes around what you open. The chosen note takes the page and the rest move to the margin as an index of titles and dates, so what you left is still one glance and one press away.",
  tags: ["master detail", "grid", "list", "notes", "reader", "recompose", "collection", "index"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["Marginalia.tsx", "marginalia.css"],
  dependencies: [],
  prompt: `Build a collection view whose layout changes composition when you open an item, instead of opening a modal or navigating away.

<Marginalia notes={[{ id, title, author, date, abstract, body }]} theme motion initialId />. Render every note as an <article> inside one grid container, in a stable DOM order and with stable keys, so React never remounts them.

Grid mode: three columns (two below 860px of container width, a compact list below 560px) of cards: date in small caps, title in a serif, author, and a three-line abstract, each a button in a 1px-ringed card.

Page mode (a note is open): the container becomes two columns, a 13.5rem margin and the rest. The open note is grid-column 2 and spans every row plus a final 1fr track (grid-template-rows: repeat(N, min-content) 1fr), so the tall page doesn't stretch the margin rows. Every other note stays in column 1 and is restyled by CSS to a margin entry: date and title only, a 1px left rule that darkens on hover. The open note's contents become the page: author and date, a large serif title (focused), a lede (the abstract), a hairline, then the body. When the component is narrower than 560px (measured with a ResizeObserver, not a media query), cards become a compact list, and in page mode the margin turns on its side into a horizontally scrolling strip of date-and-title chips above the page, with the open note's chip marked; opening a note scrolls its top into view.

Transitions are FLIP on the items themselves. Before state changes, record every item's bounding rect. After layout, animate each from its old top-left with translate, and any item that grew (the opened note) also from an inset() clip-path the size of its old box, so it opens out of the card you pressed while the cards shrink into the margin. 460ms, cubic-bezier(0.2, 0.8, 0.2, 1); page contents fade in over 240ms.

Focus moves to the page title on open and back to the note's card on close. Escape or 'All notes' returns to the grid. Arrow keys roam the cards (by columns in grid mode, one at a time in the margin). Paper and Night themes; reduced motion removes the FLIP and the fade.`,
  interaction: "Press a note to open it. The others slide into the margin. Press another from the margin to switch, and Escape or All notes to get the grid back.",
  animation: "FLIP recomposition, 460ms: the opened card grows into the page while the rest travel into the margin; page text fades in over 240ms.",
  a11y: "Notes are a list of buttons; opening moves focus to the note's heading and closing returns it to the card. A status region announces what is open and that the rest are in the margin. Arrow keys roam the list and Escape goes back. Reduced motion recomposes instantly.",
  responsive: "Columns follow the component's own width (three, two, or a compact list). In page mode the margin sits left, or becomes a scrolling strip above the note when narrow; opening a note brings it into view.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --ma-accent #7a3b22; --ma-card #ffffff; --ma-hover rgb(27 26 23 / 0.03); --ma-ink #1b1a17; --ma-line rgb(27 26 23 / 0.1); --ma-muted #77736b. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --ma-accent #e8b48f; --ma-card #16171a; --ma-hover rgb(255 255 255 / 0.04); --ma-ink #ececea; --ma-line rgb(255 255 255 / 0.09); --ma-muted #8b8d93. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f3f1ec", mode: "scroll" },
};
