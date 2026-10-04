import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "dot-atlas",
  name: "Dot Atlas",
  category: "maps",
  description: "A flat world map made of dots, shaded by a value per region; point at a region or arrow through the legend and it lifts out of the map.",
  tags: ["map", "world", "choropleth", "dots", "analytics", "regions", "canvas", "data"],
  traits: ["canvas", "hover", "keyboard"],
  source: "original",
  files: ["DotAtlas.tsx", "dot-atlas.css", "../route-globe/land.ts"],
  dependencies: [],
  prompt: `Build a dotted world map for values by region, in Canvas 2D with no map library. Sample a lon/lat grid every 1.6° (equirectangular, 82°N to 56°S so Antarctica is cropped) against a 1° Natural Earth land mask that also says which continent each cell belongs to, and draw a round dot for every land cell.

Shade each region on a single-hue sequential ramp (six steps, light to dark on paper, re-stepped — not inverted — for the dark theme) by its value relative to the largest; regions without data stay a neutral grey. Above the map, a mono metric label and a one-sentence headline ("Asia leads with 39% of 12,320 bookings"); below it, a legend of region chips sorted by value, each with its swatch and tabular value, so colour is never the only key.

Pointing at the map finds the region under the pointer (checking a little around it so thin coasts are easy to hit): that region's dots grow 25% and the rest drop to 22% opacity, the headline switches to that region's value and share, and a small tooltip follows the pointer. The legend is a roving-tabindex group: arrow keys move between regions and focusing or hovering a chip highlights the same region on the map.`,
  interaction: "Hover a region on the map, or hover or arrow through the legend chips, to highlight it and read its value and share.",
  animation: "None beyond the highlight change; the map redraws only when the highlight or size changes.",
  a11y: "The canvas is role=\"img\" with every region's value in its label; the legend chips are real buttons with aria-pressed and arrow-key navigation; the headline updates in text. No motion to reduce.",
  responsive: "Keeps the map's aspect ratio and redraws at the new size; the legend wraps.",
  touchFallback: "Tap a legend chip to highlight its region; tapping the map highlights the region under your finger.",
  variants: [
    { id: "night", label: "Night" },
    { id: "paper", label: "Paper" },
  ],
  preview: { bg: "#0b0d12", mode: "fill", height: 600 },
};
