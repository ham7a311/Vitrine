import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "bokeh-city",
  name: "Bokeh City",
  category: "backgrounds",
  description: "A city at night through a fast lens wide open: every light a soft disc with the slightly brighter rim real bokeh has, in three depths that drift past each other with the pointer, twinkling — and along the bottom, traffic passing as long defocused streaks.",
  tags: ["background", "canvas", "bokeh", "city", "night", "lights", "parallax", "depth", "blur"],
  traits: ["canvas", "cursor", "ambient"],
  source: "original",
  files: ["BokehCity.tsx"],
  dependencies: [],
  prompt: `Build a canvas 2D background of out-of-focus city lights.

Discs: pre-render one sprite per palette colour: a radial gradient with an even fill (alpha .5 → .56), a brighter rim (.74–.82 at 82–90% radius) and a soft falloff to zero by the edge — the look of real bokeh, without a hard edge. Scatter ~1 per 8,000px² (50–170) over the lower 60% of the frame (biased toward the middle, like a skyline) in three depths: far (7–16px radius, alpha ~.78, each over a wide edgeless glow three times its size), mid (18–38px, ~.46), near (40–86px, ~.24). Colours are drawn by weight from the theme's palette. Each disc twinkles (alpha × 0.75–1 on its own slow sine) and drifts sideways slowly, faster when nearer. All discs are drawn with additive ("lighter") compositing.

Parallax: the pointer offsets each depth by a different amount (1.2%, 3.5%, 8% of the frame), eased at 2.5/s, so the layers slide past each other.

Traffic: along the bottom, long soft capsule sprites (horizontal and vertical gradient masks) — red tail lights travelling right in the lower lane and white headlights travelling left in the upper, respawning off-screen. A radial vignette finishes the lens. One rAF loop while visible; ~33fps on touch; reduced motion draws one frame.`,
  interaction: "Move the pointer to slide the depths past each other.",
  animation: "Discs twinkle and drift; traffic streaks at 90–210px/s; parallax eases at 2.5/s.",
  a11y: "The canvas is aria-hidden and decorative; overlay text sits above it. Reduced motion draws one still frame.",
  responsive: "Disc count and traffic scale with the canvas; everything is rebuilt on resize.",
  touchFallback: "No parallax on touch; the city still twinkles and traffic passes, at ~33fps.",
  variants: [
    { id: "muscat", label: "Muscat night", prompt: "theme=\"muscat\": a warm city palette — mostly amber, warm white, cream and orange, with a little teal and blue; clear weather." },
    { id: "rain", label: "Rain", prompt: "theme=\"rain\": blue-cyan lights and faint diagonal rain streaks over the scene, like a wet night through a windscreen." },
  ],
  preview: { bg: "#04050b", mode: "fill" },
};
