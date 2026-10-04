import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "odometer-stats",
  name: "Odometer Stats",
  category: "stats",
  description: "Big serif numbers built from mechanical reels — each digit spins to its value on scroll-in, the last digits arriving last.",
  tags: ["stats", "numbers", "counter", "scroll", "section", "reveal"],
  traits: ["scroll"],
  source: "original",
  files: ["OdometerStats.tsx", "odometer-stats.css"],
  dependencies: [],
  prompt: `Design a stats band where the numbers behave like an old mechanical counter. Three cells share hairline seams (1px gaps over a hairline background inside one 14px-rounded frame). Each cell has a huge serif value (clamp 2.75–4.5rem, tabular lining numerals) above a small mono uppercase label.

Build each digit as a "reel": a 0.62em-wide, 1em-tall window with overflow hidden and a soft top/bottom mask, containing a vertical strip of the digits 0–9. When the band is 40% visible (IntersectionObserver, once), each strip translates to −(digit × 10%) of its height: duration 900ms plus 90ms per digit value (so bigger digits spin longer), with cubic-bezier(0.19,1,0.22,1), and a stagger of 90ms per position and 140ms per cell so the rightmost reels land last. Non-digit characters (K, M, +, %, .) are static frost-coloured symbols. Provide the whole value to screen readers as visually hidden text and hide the reels with aria-hidden. Under reduced motion show the final values immediately.`,
  interaction: "Plays once when scrolled into view.",
  animation: "Reel spin 900–1700ms ease-out-expo, staggered 90ms per digit and 140ms per stat.",
  a11y: "The real value is visually-hidden text in each <dd>; reels are aria-hidden. Uses a <dl> for label/value semantics. Reduced motion shows final numbers.",
  responsive: "auto-fit grid (min 12rem); numerals scale with container width.",
  preview: { bg: "#0b080d", mode: "fill" },
};
