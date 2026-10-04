import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "slide-tabs",
  name: "Slide Tabs",
  category: "navigation",
  description: "Tabs with one shared indicator that stretches like elastic between them — the leading edge moves first, the trailing edge follows.",
  tags: ["tabs", "navigation", "indicator", "elastic", "keyboard", "aria"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["SlideTabs.tsx", "slide-tabs.css"],
  dependencies: [],
  prompt: `Design a pill-shaped tab bar with a single shared indicator. The bar is a near-black plum capsule with a hairline border; tabs are 40px-tall pills with muted labels. Behind the active tab sits a frost-tinted capsule (soft gradient, 1px frost inner ring, small glow).

The indicator is positioned with left and right offsets measured from the active tab, and those two properties are transitioned separately: when moving forward the right (leading) edge moves immediately while the left (trailing) edge waits 90ms, and the delays swap when moving backward. Both use cubic-bezier(0.16,1,0.3,1) over 420ms, so the capsule visibly stretches across the gap like elastic and then snaps to the new size. Panels crossfade and rise 8px.

Implement the ARIA tabs pattern exactly: role=tablist/tab/tabpanel, aria-selected, aria-controls and aria-labelledby, roving tabindex, ←/→ wrap-around, Home/End, and focusable panels. Recompute the indicator on resize. The list scrolls horizontally without a scrollbar if it overflows on small screens.`,
  interaction: "Click or use ←/→/Home/End; the indicator stretches from the old tab to the new one.",
  animation: "Indicator left/right 420ms ease-out-expo with a 90ms edge offset; panel fade 420ms.",
  a11y: "Full ARIA tabs pattern with roving tabindex and keyboard navigation. Reduced motion removes the stretch delay and panel animation.",
  responsive: "Horizontal scroll (no scrollbar) when tabs exceed the container.",
  preview: { bg: "#0b080d", mode: "fill" },
};
