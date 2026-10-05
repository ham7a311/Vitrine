import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "flow-funnel-stats",
  name: "Flow Funnel Stats",
  category: "stats",
  description: "A funnel you can follow: each source keeps its colour from first visit to booking, so the bands narrowing between stages are the people who carried on — and how sharply each narrows is where they left. Point at a source to light its whole path with its conversion.",
  tags: ["stats", "sankey", "funnel", "conversion", "flow", "marketing", "chart"],
  traits: ["scroll", "hover", "click", "keyboard"],
  source: "original",
  files: ["FlowFunnelStats.tsx", "flow-funnel-stats.css"],
  dependencies: [],
  prompt: `Build a source-coloured funnel (a simple Sankey) in SVG (viewBox 760 × 360).

Props: stages (e.g. Visits, Started booking, Chose dates, Booked) and sources ({ name, values: number per stage }) — at most four, using categorical slots 1–4 in fixed order (blue, orange, aqua, yellow), stepped for the dark surface in Night.

Geometry: one linear scale for every stage — px per person = (plot height − gaps) / total visits — so a band is always the same number of people. Stage columns are evenly spaced with 120px margins for labels. At each stage the sources' segments are stacked (3px gaps, a little more in the first column) and the stack is centred on the chart's horizontal axis, so the funnel narrows toward it. Each stage draws a 14px node rect per source. Between stages, each source is a band: a closed path whose top and bottom edges are cubic Béziers (control points at the horizontal midpoint) from its segment in one stage to its segment in the next, so the taper is exactly the drop-off. Bands are its colour at 32% opacity; nodes are solid. Direct labels: source name and visits left of the first column; bookings right of the last; each stage's name and total above it — all in text colours, never the series colour.

Interaction: a legend of buttons (aria-pressed, with each source's end-to-end conversion) pins a source; hovering or focusing one previews it. The focused source's bands rise to 62% and everything else dims (bands to 7%, nodes and labels to 18–30%), and a polite live line reads "Search: 3,100 visits → 330 booked · 10.6% convert". Hovering a stage column reads the step into it ("Chose dates → Booked: 59% carry on"). With nothing focused it reads the overall conversion.

Motion: when 30% is in view, the bands are revealed left to right by a clip rect scaling from 0 (1.4s ease, transform-box view-box); dimming fades 240ms. The SVG has a <title> summary and a hidden table holds every value. On phones the chart keeps a 560px minimum width inside its own horizontal scroller, so the page never scrolls sideways. Paper and Night.`,
  interaction: "Hover or focus a source in the legend to follow it; click to pin it. Point at a stage to read the step into it.",
  animation: "Bands reveal left to right over 1.4s; focus and dimming 240ms.",
  a11y: "The legend is a group of toggle buttons with each source's conversion in text; a polite live region speaks what's highlighted; the SVG has a title summary and a hidden table carries every number. Identity is never colour alone — every source is labelled directly. Reduced motion shows the bands at once.",
  responsive: "The chart scales to its column and keeps a 560px minimum inside its own scroller on phones.",
  touchFallback: "Tap a legend button to pin a source; tap again to clear.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --ff-bg #fcfbf8; --ff-focus #2a78d6; --ff-ink #1b1a17; --ff-muted #6f6a62; --ff-rim rgb(27 26 23 / 0.1); --ff-s0 #2a78d6; --ff-s1 #eb6834; --ff-s2 #1baf7a; --ff-s3 #eda100. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --ff-bg #1a1a19; --ff-focus #8fb8ff; --ff-ink #ffffff; --ff-muted #c3c2b7; --ff-rim rgb(239 232 220 / 0.1); --ff-s0 #3987e5; --ff-s1 #d95926; --ff-s2 #199e70; --ff-s3 #c98500. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f1eee7", mode: "fill" },
};
