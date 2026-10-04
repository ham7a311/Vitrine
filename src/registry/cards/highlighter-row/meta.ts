import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "highlighter-row",
  name: "Highlighter Row",
  category: "cards",
  description: "Editorial list rows where a marker stroke swipes the title and a hand-sketched arrow loops from icon to index.",
  tags: ["list", "card", "hover", "highlighter", "sketch", "editorial"],
  traits: ["hover", "keyboard"],
  source: "original",
  files: ["HighlighterRow.tsx", "highlighter-row.css"],
  dependencies: [],
  prompt: `Create an editorial, notebook-feeling list of offerings. Each row: a 44px icon tile (hairline border, 6px radius), then a small mono amber index number ("01"), a title, a muted description (58ch) and pill tags. Rows are separated by hairlines.

When a row is hovered with a fine pointer or focused with the keyboard, three annotations appear as if someone marked up the page by hand:
1. A translucent ochre highlighter swipe reveals behind the title, left to right, using clip-path: inset(0 100% 0 0) → inset(0) over 360ms (ease-out-expo) after a 180ms beat; it retracts faster (200ms ease-in). The stroke overshoots the text slightly and every row uses one of four irregular border-radius + tiny rotation (±0.7–1.25°) combinations so no two swipes look machine-made.
2. A 1px amber underline grows across the row from the left (scaleX, 500ms).
3. A hand-sketched arrow draws itself from the right edge of the icon to just before the index number: a bowed cubic bézier with a little random jitter (so it's never the same twice) and a two-stroke arrowhead that pops in at the end (380ms draw, head fades in at 320ms).
The icon tile also tints amber. Touch taps don't trigger it (hover-only), Escape dismisses it, and the whole row is focusable.`,
  interaction: "Hover (fine pointers) or keyboard focus annotates the row; leaving, blurring or pressing Escape clears it.",
  animation: "Marker: clip-path 360ms (+180ms delay), 200ms out. Underline: scaleX 500ms. Arrow: stroke draw 380ms, head fade 160ms at 320ms.",
  a11y: "Rows are focusable articles with a real <h3>. All annotations are aria-hidden; focus shows the same annotations plus an inset ring.",
  responsive: "Container query: stacked on narrow widths, icon beside content from 44rem. The arrow re-measures on resize and hides if there's no room.",
  touchFallback: "Deliberately hover-only — on touch the row reads as a clean, static list.",
  preview: { bg: "#0c0b0a", mode: "fill", frame: [860, 645], height: 580 },
};
