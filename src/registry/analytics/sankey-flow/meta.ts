import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "sankey-flow",
  name: "Sankey Flow",
  category: "analytics",
  description: "Where visitors come from, where they go and how it ends, as flows whose width is the number of people; point at a band to follow just those people.",
  tags: ["sankey", "flow", "funnel", "journey", "chart", "analytics", "conversion", "svg"],
  traits: ["hover", "click"],
  source: "original",
  files: ["SankeyFlow.tsx", "sankey-flow.css"],
  dependencies: [],
  prompt: `Build a three-column Sankey diagram in SVG with no chart library: sources (Search, Social, Direct, Email) → pages (Destinations, Deals, Guides) → outcomes (Booked, Saved, Left). Scale every node and band to the number of people (all columns share one scale; 14px gaps between nodes; columns vertically centred). Stack each node's bands in the order of the nodes at their other end, so bands don't cross needlessly; each band is a filled shape between two cubic curves (control points at the horizontal midpoint).

Colour carries meaning only where it's true: first-stage bands take their source's colour (a fixed series order from a colour-blind-checked palette); later bands are neutral grey, and bands into the goal (Booked) are drawn darker. Bands are translucent (32%, 50% into the goal). The headline is the takeaway — "28% of 19,600 visitors booked". Nodes are thin rounded bars with the name and value beside them (inside the frame, right-aligned for the last column).

Pointing at a band shows "Search → Deals: 2,400 visitors (26% of Search)" and dims everything else; pointing at a node keeps only its bands. The first time it scrolls into view the bands draw in from the left, column by column (clip-path, 900ms, 220ms per column). A Table button swaps in a from/to/visitors table.`,
  interaction: "Point at a band or a node to isolate those visitors; use Table for exact numbers.",
  animation: "Bands draw in from the left on first view (900ms, staggered by column); highlights fade in 220ms.",
  a11y: "The SVG has a summary label, the hint line is a polite live region, and a full table view is available. Colour is never the only key: every node is labelled. Reduced motion shows the bands immediately.",
  responsive: "The diagram scales with its width; labels sit inside the frame at every size.",
  touchFallback: "Tap a band or node to isolate it; the table covers precise reading.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#f2f1ed", mode: "fill", height: 600 },
};
