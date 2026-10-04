import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "index-footer",
  "name": "Index Footer",
  "category": "footers",
  "description": "A footer set like the index at the back of a book: entries with dotted leaders running to their numbers, and pointing at one lets the rest of the page fall quiet.",
  "tags": [
    "footer",
    "editorial",
    "index",
    "links",
    "typography",
    "sitemap"
  ],
  "traits": [
    "hover",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "IndexFooter.tsx",
    "index-footer.css"
  ],
  "dependencies": [],
  "prompt": "Design a footer set like the index at the back of a book. A large italic Instrument Serif 'Index' heading with a small note, a hairline, then four columns grouped under accent serif letters (A, C, M, W). Each link is an index entry: the term, a dotted leader that stretches to fill the line (a repeating radial-gradient dot, 5px pitch), and a mono reference \u2014 a count, a year, a page, a timezone \u2014 something that means something for that link.\n\nHovering or focusing any entry dims every other entry to 32% (using :has on the grid) so the line you're reading stands alone; its reference turns accent. The colophon at the bottom states the year, owner and the typefaces it's set in. Columns go 4 \u2192 2 \u2192 1 with container queries.",
  "interaction": "Hover or tab through entries \u2014 the one you're on stays lit while the rest fall quiet.",
  "animation": "Opacity 320ms and colour 220ms transitions only.",
  "a11y": "A <footer> with labelled sections and real links; focus-visible gives the same isolation plus an accent underline. Reduced motion removes transitions.",
  "responsive": "Container queries: 4 columns, then 2 below 52rem, 1 below 26rem.",
  "preview": {
    "bg": "#0c0b0a",
    "mode": "fill"
  },
  "touchFallback": "Entries are ordinary links on touch; the dotted leaders keep them scannable."
};
