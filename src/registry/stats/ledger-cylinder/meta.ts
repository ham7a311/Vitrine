import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ledger-cylinder",
  name: "Ledger Cylinder",
  category: "stats",
  description: "Stats painted in giant condensed type on the inside of a cylinder that turns as you scroll — the walls loom as they pass.",
  tags: ["stats", "section", "scroll", "webgl", "typography", "numbers"],
  traits: ["scroll", "webgl"],
  source: "original",
  files: ["LedgerCylinder.tsx", "ledger-cylinder.css"],
  dependencies: ["Anton font (Google Fonts) — or change FONT"],
  prompt: `Build a scroll-driven stats section where the numbers are architecture. Paint every stat once into a single wide 2D canvas strip in Anton: each block is a huge headline (the value, 62% of the strip height) over its label, with the label horizontally stretched to exactly the headline's width so each block is a solid rectangle of type; each block gets its own colour from the stats data. Two final blocks carry a "Currently" list and a terminal-style status line in smaller headline scales. Long labels are squeezed rather than allowed to dominate.

Wrap that strip once around the inside wall of a cylinder in a fragment shader (one full-screen triangle, WebGL1): cast a ray from a camera set 0.3 behind the axis, take the far intersection with x² + z² = 1, convert its angle to the strip's u and its height to v. Because the camera is behind the axis, the side walls loom larger than the far wall. Soften the strip's ends and let walls behind the viewer's shoulders fade into black. Fit the band height so it never overflows the viewport at any column.

Make the section 320vh tall with a sticky full-height stage; scroll progress rotates the ring from the first block's centre to the last over the first 88% of the travel, then holds. Render only on scroll and resize — no idle rAF loop — skipping frames whose offset hasn't changed. Keep the real stats as a visually hidden list for screen readers. Under reduced motion or without WebGL, show a static three-column layout where the outer columns are rotated ±24° in perspective, echoing the cylinder.`,
  interaction: "Scrolling turns the ring; it holds on the final block for the last 12% of the section.",
  animation: "No autonomous animation — frames are rendered on scroll/resize only, capped at DPR 1.5.",
  a11y: "Stats are real text in a role=list, visually hidden while the canvas is live and fully visible in the static fallback. Canvas is aria-hidden. Reduced motion uses the static layout.",
  responsive: "Container query below 640px: shorter scroll track (260vh), a taller 512px strip with a 1.45× vertical stretch, and a single-column static fallback.",
  touchFallback: "Scroll-driven, so identical on touch.",
  variants: [
    { id: "phosphor", label: "Phosphor", prompt: "Stat colours #8fe388 (phosphor green), #ede8df (bone), #ff6b00 (safety orange); notes #ffe3b8, status line #8fe388; background #0e0d0b." },
    { id: "frost", label: "Frost", prompt: "Stat colours #b9cce4 (frost blue), #efe8dc (cream), #c8b9ea (lilac); notes #e8d5b5, status line #9fd4c8; background #09080b." },
  ],
  preview: { bg: "#0e0d0b", mode: "fill", frame: [1040, 780], height: 640 },
};
