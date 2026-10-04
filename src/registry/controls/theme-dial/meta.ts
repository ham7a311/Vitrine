import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "theme-dial",
  name: "Theme Dial",
  category: "controls",
  description: "A theme picker built as an instrument: five themes along the light of a day (Daylight, Paper, Dusk, Ink, Midnight) on a half-dial. Drag the sun and every colour token is mixed continuously in OKLab between neighbours; let go and it settles into the nearest detent.",
  tags: ["theme", "dark mode", "appearance", "slider", "dial", "settings", "color"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["ThemeDial.tsx", "theme-dial.css"],
  dependencies: [],
  prompt: `Build a theme selector that feels like a designed instrument rather than a dropdown or a hue wheel. The themes lie on one meaningful axis, the light of a day:
- Daylight: cool white, blue accent.
- Paper: warm ivory, terracotta.
- Dusk: plum-clay mid-tone, apricot.
- Ink: deep blue-grey, periwinkle.
- Midnight: near-black, moon gold.
Each theme defines the same tokens: bg, surface, ink, muted, accent and line.

The control is a 150° half-dial in SVG. The arc track is stroked with a gradient of each stop's own background, so the day reads as a sequence of materials. It has major ticks at the stops, three minor ticks between each pair, a needle from a hub, and a 'sun' thumb on the arc filled with the current accent. Dragging anywhere on the dial maps the pointer angle to a continuous position t (0–4), and every token is interpolated in OKLab between the two neighbouring stops. The whole instrument and a live preview (a small app card with a stat, a chart line, a list and buttons) recolour as you scrub, and so does the page behind them via onPreview.

On release, t eases into the nearest stop over 280ms (cubic out) and onChange fires with the stop's id and tokens. The readout under the arc shows the stop name in a serif, its note, and the live text contrast ratio of ink against the background.

The thumb is role=slider with aria-valuetext ('Dusk: Low light, clay and plum'). Arrows, Page keys and Home/End step between detents, the wheel steps too, and a row of named stop buttons (each with a swatch) gives direct access. Side by side from 44rem of container width, stacked below it.`,
  interaction: "Drag the sun along the arc, click a stop, or focus the dial and use ← → / Home / End.",
  animation: "Continuous OKLab interpolation while scrubbing; a 280ms ease-out settle into the detent.",
  a11y: "The slider has aria-valuenow, aria-valuetext naming the theme and aria-orientation. Named stop buttons use aria-pressed, the chosen theme is announced politely, and the contrast ratio is shown for every stop. Reduced motion makes the settle instant; scrubbing still interpolates, because it follows your hand.",
  responsive: "The SVG scales with its container, and the preview stacks under the dial on narrow screens. Dragging uses touch-action: none on the dial only.",
  touchFallback: "Drag the sun with a finger or tap a named stop.",
  preview: { bg: "#f3eee3", mode: "fill" },
};
