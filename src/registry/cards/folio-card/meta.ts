import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "folio-card",
  name: "Folio Card",
  category: "cards",
  description: "An article card as thick as the article: page edges stack out from its corner, one sheet per 300 words, and a ribbon marks your place if you've started reading.",
  tags: ["card", "article", "blog", "reading time", "editorial", "progress", "bookmark"],
  traits: ["hover", "keyboard"],
  source: "original",
  files: ["FolioCard.tsx", "folio-card.css"],
  dependencies: [],
  prompt:
    "Build an article card (a single link) whose depth shows the article's length. The card is a sheet of paper — mono kicker in the accent, serif title, short dek, author and date, and a mono line '11 min · 2,600 words'. Behind it, the pages: one box-shadow per sheet (words ÷ 300, between 2 and 30), each offset diagonally by i × a 'fan' amount and alternating between two paper tones so every edge reads as a line, plus one soft shadow under the whole stack. The card reserves margin for its own thickness so a grid of cards stays aligned.\n\nThe fan amount is a registered @property number (1.25px per sheet at rest), so hovering or focusing the card animates it to 2.1 and the pages fan out smoothly (520ms expo-out) while the sheet lifts 2px toward the corner.\n\nIf the reader has started the article (progress 0–1), a swallowtail ribbon hangs out from between the pages at that depth and the meta line adds '6 min left' in the accent; the ribbon swings a few degrees on hover. A note, a guide and an essay side by side should look different before you read a word.",
  interaction: "Hover or focus to fan the pages. The whole card is one link.",
  animation: "Fan and lift 520ms expo-out via a registered custom property; the ribbon swings 6° on hover.",
  a11y: "One link with the title, meta and reading time as its text; the page edges and ribbon are decoration. Focus fans the pages like hover and shows a ring. Reduced motion keeps the pages still.",
  responsive: "Fluid width; the right and bottom margin equal the stack's depth so cards align in any grid.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --fc-accent #a8432f; --fc-focus #2f5fd0; --fc-ink #1d1b17; --fc-muted #706a60; --fc-page-a #f2eee4; --fc-page-b #d9d3c6; --fc-ribbon-c #a8432f; --fc-shadow rgb(40 32 20 / 0.28); --fc-sheet #fffdf8. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --fc-accent #e7a07f; --fc-focus #b9cce4; --fc-ink #efe8dc; --fc-muted #9c96a1; --fc-page-a #2a2830; --fc-page-b #121115; --fc-ribbon-c #c9573f; --fc-shadow rgb(0 0 0 / 0.6); --fc-sheet #1d1c21. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ece8df", mode: "fill" },
};
