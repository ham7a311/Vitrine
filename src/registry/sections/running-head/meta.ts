import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "running-head",
  name: "Running Head",
  category: "sections",
  description: "A section header set like a chapter opening, with a running head: when it scrolls away, a slim version of it stays pinned for as long as you are inside the section, then hands over to the next section's.",
  tags: ["section", "heading", "header", "sticky", "scroll", "eyebrow", "index", "orientation"],
  traits: ["scroll"],
  source: "original",
  files: ["RunningHead.tsx", "running-head.css"],
  dependencies: [],
  prompt: `Build the heading block that opens every section of a long page, plus the small pinned version that tells you where you are after it has scrolled away, like the running head at the top of a book page.

The block: a row with a mono index ("02", 11px, 0.14em capitals, tabular numerals), a 1px rule that fills the remaining width, and an optional right-aligned fact in the same mono style ("Four of twenty-one"). Below it the heading in a display serif, clamp(2rem, 7cqi, 3.5rem), line-height 1.02, tracking -0.02em, max 20ch, balanced; then an optional lede in muted sans at 15px, 46ch. The rule draws once, scaleX from the left over 700ms (cubic-bezier(.16,1,.3,1)), the first time the block enters view. Nothing else moves.

The running head: render a zero-height position: sticky element as the first child of the section, at top: stickyTop. A 38px bar hangs from it: index in ink, the short label in the serif at 17px, the fact on the right, with a hairline under it. It is invisible until the full block has left the top of the scroller (IntersectionObserver with rootMargin -stickyTop, true only when the block's bottom edge is above the pin line), then fades in and settles from 6px above (240ms). Because a sticky element can't leave its parent, it goes away with the section and the next section's own running head takes over, with no JavaScript handover. The bar is aria-hidden (the real heading is still in the document); the heading is a real h1/h2/h3. The scroller is passed as scrollRef; stickyTop leaves room for a sticky navbar. Container query at 30rem hides the right-aligned fact. Paper and Night themes.`,
  interaction: "Scroll through a section and its slim running head appears at the top; keep going and the next section's head replaces it.",
  animation: "Rule draws once in 700ms; running head fades in and settles over 240ms.",
  a11y: "The block is a real heading; the pinned bar is aria-hidden because it only repeats it. Nothing depends on motion; reduced motion shows the rule drawn and the bar appears without travel.",
  responsive: "Type scales with the container width (cqi); the right-hand fact is dropped below 30rem and the bar truncates its label.",
  touchFallback: "Scroll-driven only, so touch behaves identically.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f6f5f1", mode: "scroll", height: 640 },
  isNew: true,
};
