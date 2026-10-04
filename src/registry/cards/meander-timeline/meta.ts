import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "meander-timeline",
  name: "Meander Timeline",
  category: "cards",
  description: "Collapsible event cards strung on a hand-drawn wavy rail, each pinned by a glowing amber node.",
  tags: ["timeline", "accordion", "card", "events", "disclosure", "list"],
  traits: ["click", "keyboard", "hover"],
  source: "original",
  files: ["MeanderTimeline.tsx", "meander-timeline.css"],
  dependencies: [],
  prompt: `Build a vertical timeline of past events as collapsible cards. To the left, draw the rail as a gently meandering SVG line (a single cubic path wobbling left and right, stretched to the list height with preserveAspectRatio="none" and vector-effect: non-scaling-stroke so the 1.5px stroke never distorts). Each card has a 9px amber node sitting on the rail, with a 3px ring in the page colour to "cut" the rail and a soft amber glow.

Each row is a full-width button (10px radius, hairline border, near-black surface): a mono date block (day in tabular numerals, month in small uppercase amber), a single-line truncated title, a pill tag, and a chevron. On hover or focus the border turns amber and the surface lifts slightly (200ms). Clicking expands a detail panel with a grid-template-rows 0fr → 1fr transition (350ms, cubic-bezier(0.4,0,0.2,1)), so the height animates without measuring; the chevron rotates 180° in 250ms. Only one card is open at a time. The panel holds a muted description and a small definition list of metadata above a hairline.

In narrow containers, hide the year and move the tag into the panel.`,
  interaction: "Click or Enter/Space toggles a row; opening one closes the others.",
  animation: "Panel: grid-template-rows 0fr → 1fr in 350ms. Chevron: 180° in 250ms. Row: 200ms border/background.",
  a11y: "Rows are <button>s with aria-expanded and aria-controls pointing at a labelled region. Decorative rail, nodes and chevron are aria-hidden.",
  responsive: "Container queries: under 36rem the year hides and the tag moves into the expanded panel (media-query fallback for older browsers).",
  preview: { bg: "#0c0b0a", mode: "fill", frame: [760, 570], height: 560 },
};
