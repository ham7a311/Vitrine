import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "colophon-footer",
  name: "Colophon Footer",
  category: "footers",
  description: "The small print kept like a book's colophon: what the site was set in, where it was made and when it was last revised, as ruled rows, with the legal line and a way back to the top. True facts instead of a sitemap.",
  tags: ["footer", "legal", "colophon", "copyright", "minimal", "back to top", "typography", "links"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["ColophonFooter.tsx", "colophon-footer.css"],
  dependencies: [],
  prompt: `Build a quiet page footer that does the job of the last page of a book. No sitemap, no social icons, no newsletter.

A small mono caption "Colophon" (11px, 0.16em, capitals, muted), then a description list under a 1px rule. Each row is a term and a value separated by a hairline: the term in mono capitals (what it was Set in, Made in, Last revised, Source), the value in a display serif at 18px with tabular numerals, so dates and versions align. The value may contain a link or a <time> element. Rows use a two-column grid (terms 7 to 11rem), and collapse to stacked term-over-value below 30rem, using a container query.

Beneath the rows, a base line in 13px: the legal text in muted ink, a short list of links, and a "Back to top" button with a 14px arrow, pushed to the right (left on narrow widths). Links draw a 1px underline from the left on hover and focus (background-size 0 to 100%, 280ms cubic-bezier(.2,.8,.2,1)); the arrow lifts 2px. Everything has at least a 44px hit area.

Back to top scrolls the given scroller (or window) to 0, smoothly unless reduced motion is on. The rows are real facts the site owner would keep up to date, never filler. Paper and Night themes.`,
  interaction: "Hover or focus a link to draw its underline; Back to top returns to the start of the page.",
  animation: "Underline draws in 280ms; the arrow lifts 2px over 240ms; scroll to top is smooth unless reduced motion is on.",
  a11y: "A footer landmark with a Colophon heading and a real description list; the link group is a labelled nav and the arrow is decorative. Focus rings are visible. Reduced motion removes smooth scrolling and the transitions.",
  responsive: "Container query at 30rem stacks terms over values; links wrap.",
  touchFallback: "Every control is a plain link or button with a 44px target.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f6f5f1", mode: "fill", height: 560 },
  isNew: true,
};
