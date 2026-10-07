import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "folio-pager",
  name: "Folio Pager",
  category: "navigation",
  description: "Pagination set like a book's leaves: the range you're looking at (“101–120 of 212”) is the headline and its numerals roll in the direction you moved, beside a compressed run of folios and a field to go straight to a page.",
  tags: ["pagination", "pager", "pages", "next previous", "range", "list", "table", "navigation"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["FolioPager.tsx", "folio-pager.css"],
  dependencies: [],
  prompt: `Build a pager for any paginated list or table. It says where you are in words first and in page numbers second.

Headline: the visible range as "101–120 of 212 places", with the two range numbers in a 24px serif with tabular numerals and the rest in mono caps. When the page changes, each number rolls: the old value leaves and the new one arrives from the opposite side, up when moving forward and down when moving back (translateY 100% and opacity over 320ms cubic-bezier(.2,.8,.2,1), the box clipped to one line). The old value is aria-hidden and removed after the animation.

Controls: previous and next buttons (44px tall, chevron icons, disabled with 35% opacity at the ends) around a run of page buttons in mono. The run always contains the first page, the last page, the current page and one neighbour each side; a gap of exactly one page is shown as that page, longer gaps as an ellipsis. The current page has aria-current="page" and a 1.5px underline that draws in (scaleX, 280ms). Every page button has aria-label "Page N".

Go to: a labelled mono field, digits only (inputMode numeric), placeholder the last page, with an arrow button. Submitting goes to that page, clamping out-of-range numbers and saying so ("There are 36 pages; went to the last").

Layout by container query: above 44rem one row of range, controls and go-to; below it they stack; below 36rem the run is replaced by a compact "6 of 27" between the previous and next buttons. A visually hidden role=status line reads "Showing 31 to 36 of 212 places, page 6 of 36" after every change. Controlled (page, onPage) or uncontrolled. Paper and Night themes.`,
  interaction: "Step with the arrows, press a folio, or type a page number into Go to. Try one past the end.",
  animation: "Range numerals roll over 320ms; the current page's underline draws in 280ms.",
  a11y: "A labelled nav; page buttons carry aria-current and a named label, ends are disabled buttons, and a status region announces the new range after every move. The go-to field is labelled and clamps rather than rejecting. Reduced motion removes the roll and the underline draw.",
  responsive: "Container queries at 44rem and 36rem: one row, then stacked, then a compact 'N of M' with arrows.",
  touchFallback: "All controls are 44px tall; no hover is needed.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --fp-ink #1b1a17; --fp-line rgb(27 26 23 / 0.14); --fp-muted #6b6861; --fp-wash rgb(27 26 23 / 0.05). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --fp-ink #ececea; --fp-line rgb(255 255 255 / 0.14); --fp-muted #8d8f95; --fp-wash rgb(255 255 255 / 0.07). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f6f5f1", mode: "scroll", height: 600, frame: [860, 560] },
};
