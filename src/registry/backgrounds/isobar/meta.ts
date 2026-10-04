import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "isobar",
  name: "Isobar",
  category: "backgrounds",
  description: "A living weather map — contour lines traced over a drifting pressure field, with your cursor as a system of its own.",
  tags: ["background", "canvas", "contour", "generative", "cursor", "map"],
  traits: ["canvas", "cursor", "ambient"],
  source: "original",
  files: ["Isobar.tsx"],
  dependencies: [],
  prompt: `Create a background that looks like a surface-analysis weather chart come to life. On a near-black ground, sample a smooth pressure field on a 12px grid: three octaves of value noise, each drifting in a different direction at a slow rate, so the pattern evolves like weather rather than scrolling.

Trace 16 evenly spaced contour levels between the field's current minimum and maximum with marching squares (linear-interpolated edge crossings, both saddle cases handled), drawing every segment of a level in one path. Minor isobars are hairlines at 16% opacity; every fifth line is a heavier "index" isobar at 42%, exactly as cartographers do. Mark the current global high and low with small mono "H" and "L" labels.

Make the cursor a pressure system: add a soft Gaussian bump centred on the pointer whose strength eases in when the pointer enters and out when it leaves, so the isobars visibly bend and gather around it and the H often migrates to follow your hand. Redraw at ~20fps (weather doesn't need 60), pause when offscreen or the tab is hidden, cap DPR at 2, and draw one still frame under reduced motion. Take the line colour and ground colour as props so the chart can be re-inked.`,
  interaction: "The pointer adds a local high-pressure bump that bends nearby isobars; it fades in and out smoothly.",
  animation: "Field drifts continuously; canvas redraws at ~20fps; cursor influence eases at 8% per frame.",
  a11y: "Canvas is aria-hidden. Reduced motion renders a single still chart with no cursor tracking.",
  responsive: "Grid scales with the container; cell size and level count are props for tuning density vs. cost.",
  touchFallback: "No cursor bump on touch; the map still drifts.",
  variants: [
    { id: "frost", label: "Frost", prompt: "Frost: pale frost-blue isobars (#b9cce4) on near-black (#07080c); labels in the same frost at 60% opacity." },
    { id: "lilac", label: "Lilac", prompt: "Lilac: soft lilac isobars (#c8b9ea) on a violet-black ground (#0c0910)." },
    { id: "paper", label: "Paper", prompt: "Inverted ink-on-paper: dark plum ink isobars (#2a1830) on warm paper (#ece4d6), like a printed chart; the minor/index opacities stay the same." },
  ],
  preview: { bg: "#07080c", mode: "fill" },
  featured: true,
};
