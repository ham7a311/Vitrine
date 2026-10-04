import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ruler-index",
  name: "Ruler Index",
  category: "navigation",
  description: "A vertical table of contents drawn as a ruler: long ticks for sections, short ticks between, the current section lit.",
  tags: ["navigation", "toc", "scrollspy", "index", "sticky", "ruler"],
  traits: ["scroll", "hover", "keyboard"],
  source: "original",
  files: ["RulerIndex.tsx", "ruler-index.css"],
  dependencies: [],
  prompt: `Design an "on this page" index that looks like the edge of a ruler. Right-align a column of ticks: for each section a 28px major tick with a mono uppercase label to its left, and four short 12px minor ticks between consecutive sections at even spacing, so the whole thing reads as a graduated scale.

Scrollspy: an IntersectionObserver (rootMargin −30% / −55%) picks the section in view. The active major tick lengthens 1.5×, turns frost blue with a soft glow, and its label is shown in cream; inactive labels are hidden (opacity 0, shifted 6px). Hovering the ruler reveals every label; hovering a single tick lengthens it. Clicking or pressing Enter on a tick scrolls to its section. Labels stay visible on devices without hover. All movement uses cubic-bezier(0.16,1,0.3,1) at 220–300ms. It's a real <nav aria-label="On this page"> with links and aria-current="location" on the active one.`,
  interaction: "Scroll updates the lit tick; hover reveals labels; click/Enter jumps to the section.",
  animation: "Tick and label transitions 220–300ms ease-out-expo.",
  a11y: "A labelled <nav> of real anchor links with aria-current=location; focus-visible ring on each tick; labels always visible without hover. Reduced motion shortens transitions.",
  responsive: "Fixed 10rem column; place it in a sticky sidebar.",
  touchFallback: "All labels are shown when hover isn't available.",
  preview: { bg: "#0b080d", mode: "fill", height: 560 },
};
