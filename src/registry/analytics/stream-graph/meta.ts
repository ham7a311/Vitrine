import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "stream-graph",
  name: "Stream Graph",
  category: "analytics",
  description: "A year of visits as one river of channels: streams stacked symmetrically around a centre line so it reads as flow, a stream lighting up (others falling back) when you point at it with its name laid along it, a crosshair listing every channel, and a legend that hides channels while colours stay put.",
  tags: ["streamgraph", "stacked area", "time series", "traffic", "channels", "marketing", "legend filter", "analytics"],
  traits: ["hover", "click", "keyboard", "touch"],
  source: "original",
  files: ["StreamGraph.tsx", "stream-graph.css"],
  dependencies: [],
  prompt: `Build a streamgraph of weekly sessions by channel (5 channels, 52 weeks) in SVG.

Layout: stack the series around a centre line (the silhouette offset: each week starts at −Σv/2), fit ± the full (all-visible) stack's extent to the plot so hiding never rescales, and draw each band as Catmull–Rom curves (top forward, bottom back). Each channel keeps its categorical slot in fixed order (validated reference palette, light and dark steps) and a 2px surface-coloured stroke separates bands. Draw-in: the river scales up from its centre line (900ms).

Labels: each channel's name sits at its thickest week, centred in the band, in ink with a surface halo — only where the band is ≥18px.

Interaction: hovering a band (or its legend chip) dims the others to 22%. The crosshair snaps to the nearest week and a tooltip lists each visible channel's value with a swatch (text in ink, the focused one emphasised). Keyboard: the plot is focusable, ←/→ move the week, Esc clears. The legend is a group of toggle buttons (aria-pressed): hiding a channel tweens its values to zero (560ms) so the river re-forms around the rest, colours never move, and at least one channel always stays visible.

Header: an insight sentence ("Search is still the biggest source — but social is catching up fast") and a Chart ⇄ Table toggle; the table lists every week × channel. role="img" summary on the SVG. Reduced motion: no tweening or draw-in.`,
  interaction: "Point at a stream to isolate it; move along the chart to read a week; press legend chips to hide channels; Table for the numbers.",
  animation: "Draw-in 900ms from the centre line; channel hide/show tweens 560ms; dimming 200ms.",
  a11y: "Summary on the SVG, keyboard crosshair, legend toggles with aria-pressed, a full table view; direct labels mean identity is never colour alone.",
  responsive: "Width follows the container; month ticks thin out under 560px.",
  touchFallback: "Drag along the chart for the crosshair; tap legend chips to filter.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#f9f9f7", mode: "fill" },
};
