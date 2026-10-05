import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "sunburst-drill",
  name: "Sunburst Drill",
  category: "analytics",
  description: "Where the money went, from category down to the shop: a zoomable sunburst where clicking an arc tweens every arc to its new angle and shifts the rings inward so you never lose your place, children take lighter steps of their parent's colour, and a breakdown list and breadcrumbs mirror it for keyboards.",
  tags: ["sunburst", "hierarchy", "drill down", "zoom", "spending", "budget", "radial", "breakdown", "analytics"],
  traits: ["hover", "click", "keyboard", "touch"],
  source: "original",
  files: ["SunburstDrill.tsx", "sunburst-drill.css"],
  dependencies: [],
  prompt: `Build a zoomable sunburst for a three-level hierarchy (category → subcategory → merchant) of trip spending.

Layout: a top-down partition into angular fractions (each child takes its share of its parent's span). Rings are 58px wide around a 66px hole; arcs are SVG paths with a small angular pad and a 2px surface stroke as the gap. The current view is {x0, x1, depth}: an arc's angle is its fraction mapped from [x0, x1] to a full turn, and its ring is its depth minus the view's depth — so zooming into an arc (click) tweens the view to that arc (720ms ease-in-out): it expands to the full circle while everything shifts one ring inward. The hole goes back up a level; so do the breadcrumbs.

Colour: top-level categories take categorical slots 1–5 in fixed order (validated reference palette, light/dark steps); rings are coloured by depth relative to the current level — the innermost visible ring at full strength (zoomed in, siblings stepped 100/84/68%), each ring outward a lighter mix with the surface (62–78%, then 40–54%) — so families stay together and the zoomed view stays vivid. Labels sit radially in arcs wide enough for them (ink with a soft surface halo).

Interaction: hovering an arc dims everything but it and its ancestors, and the centre reads its name, value and share of the total. Beside the wheel, a breakdown list of the current level's children (buttons: swatch, name, value, %, a bar) — click/Enter drills in, hover/focus highlights the arc — and a Back button. role="img" summary on the SVG; breadcrumbs are a nav with aria-current. Stacks under 720px. Reduced motion: zooms jump.`,
  interaction: "Click an arc (or a row in the list) to zoom in; click the centre, a breadcrumb or Back to go up; point at arcs to read them.",
  animation: "Zoom tween 720ms (angles and rings together); dimming 160ms; list bars 500ms.",
  a11y: "The breakdown list is the keyboard and screen-reader path (labelled buttons with values and shares), breadcrumbs mark the current level, and the SVG has a summary.",
  responsive: "The wheel scales to its column (max 420px); the list moves under it below 720px.",
  touchFallback: "Tap to drill in; tap the centre to go back.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --grid #e1e0d9; --ink #0b0b0b; --ink-2 #52514e; --ring rgba(11, 11, 11, 0.1); --s1 #2a78d6; --s2 #eb6834; --s3 #1baf7a; --s4 #eda100; --s5 #e87ba4; --surface #fcfcfb. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --grid #2c2c2a; --ink #ffffff; --ink-2 #c3c2b7; --ring rgba(255, 255, 255, 0.1); --s1 #3987e5; --s2 #d95926; --s3 #199e70; --s4 #c98500; --s5 #d55181; --surface #1a1a19. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f9f9f7", mode: "fill" },
};
