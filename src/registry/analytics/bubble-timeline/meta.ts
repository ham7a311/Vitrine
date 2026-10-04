import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "bubble-timeline",
  name: "Bubble Timeline",
  category: "analytics",
  description: "Seven years of where people went, played like a film: each destination a bubble — across by trip cost, up by rating, sized by trips — moving through the years with the year watermarked behind, faint trails showing each path, and one you pick followed year by year.",
  tags: ["bubble chart", "scatter", "animated", "gapminder", "timeline", "play", "scrubber", "trails", "analytics"],
  traits: ["hover", "click", "keyboard", "touch"],
  source: "original",
  files: ["BubbleTimeline.tsx", "bubble-timeline.css"],
  dependencies: [],
  prompt: `Build an animated bubble chart (Gapminder-style) of 12 destinations over 2019–2025.

Encoding: x = average trip cost on a log scale (ticks 50/100/200/400/800), y = guest rating (3.5–5), bubble area ∝ trips (radius = 4 + √(trips/max)·38, smaller on phones), colour = region with only three regions — the reference palette's first three slots are the ones validated for all-pairs use (scatter) in both modes. Bubbles have a 1.5px surface ring and 82% fill; bigger ones draw behind. A huge, 5% ink year watermark sits behind the plot.

Time: t runs continuously from 0 to the last year; every value is interpolated between years, so play (≈1.4s per year in a rAF loop that stops at the end; pressing again replays) moves bubbles smoothly. A range scrubber (step 0.01, snapping to the nearest year on release; arrow keys jump whole years) with the years labelled beneath. Trails: each bubble's path so far as a faint polyline in its colour; the hovered or picked bubble's trail is solid with a dot and year label at each year.

Hover picks the smallest bubble under the pointer (so small ones stay reachable): the others dim to 22%, and a tooltip gives name, region, year, trips, cost and rating. Click pins it. The four biggest bubbles are labelled directly (ink with a surface halo), placed biggest-first: a label that would collide moves below its bubble or is dropped. Header insight ("Trips abroad collapsed in 2020 — and close-to-home Oman never gave the ground back."), a region legend plus "Bubble area = trips", and a Chart ⇄ Table toggle (the current year, sorted by trips). Axis titles state the scale. Light and dark themes. Reduced motion: play jumps to the last year.`,
  interaction: "Press play, or drag the scrubber (arrow keys step whole years); point at a bubble to read it, click to follow its trail; Table for the current year.",
  animation: "≈1.4s per year with continuous interpolation; dimming 160ms.",
  a11y: "Summary on the SVG; the scrubber is a labelled range with the year as value text; the table gives every value for the selected year; regions are legended and the largest bubbles labelled.",
  responsive: "Width follows the container; bubble sizes and year labels scale down under 560px.",
  touchFallback: "Tap play or drag the scrubber; tap a bubble to follow it.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#f9f9f7", mode: "fill" },
};
