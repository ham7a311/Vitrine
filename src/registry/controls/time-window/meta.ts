import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "time-window",
  name: "Time Window",
  category: "controls",
  description: "A range picker over one day where the chosen hours are the only clear thing on the timeline. The rest of the day stays visible but recedes, so busy blocks, night and the current time inform the choice without competing with it. It becomes a vertical day column on a phone.",
  tags: ["time", "range", "scheduler", "calendar", "slider", "booking", "timeline"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["TimeWindow.tsx", "time-window.css"],
  dependencies: [],
  prompt: `Build a 24-hour time-range selector in which the selected window is visually dominant and the day is context.

The track is the day, with hourly hairlines and labels (majors every six hours). Context layers sit on it:
- night shading before 06:00 and after 19:00
- busy blocks drawn as faint hatching with their labels (Standup, Design review, Lunch…)
- a current-time marker with a small 'Now 14:20' tag

Everything outside the window is covered by a translucent veil of the surface colour, so the context stays readable but recedes. Inside the window it is clear, like glass with a firm 1.5px ink edge.

Interaction:
- Drag the window body to move it and drag either edge handle to resize it. Clicking empty day moves the window there, centred on the click.
- Values snap to 15 minutes live.
- Duration is clamped to a minimum and maximum (30 min – 4h here). Hitting a limit shows a brief hint ('At least 30 min') in the status line rather than failing silently.
- Overlapping a busy block is allowed but marked invalid: the window edge and handles turn red, the clashing part of the window fills with red hatching, the busy block's label turns red, and the status line says 'Overlaps Design review (10:00–11:00)'.
- The header shows the range in large tabular type with the duration beside it.

Keyboard: the body and both handles are sliders. Arrows move by the step, Shift by an hour, PageUp/PageDown by an hour, and Home/End move the window to the ends of the day. aria-valuetext reads '13:30 to 15:00, 1h 30m', and the status is linked by aria-describedby.

Below 560px of container width it becomes a vertical day column (48px per hour) in a scroll area, dragged vertically like a phone calendar, with touch-action tuned so the page still scrolls outside the window. Paper and Night themes.`,
  interaction: "Drag the window or its edges, click the day to move it, or focus it and use the arrow keys (Shift for hours).",
  animation: "None beyond direct manipulation. The window follows the pointer with 15-minute snapping.",
  a11y: "The move body and the start and end handles are separate labelled sliders with time value text; conflicts set aria-invalid and are described in text; the range is a polite live region. Reduced motion needs nothing removed — there is no decorative motion.",
  responsive: "Container width decides the orientation: horizontal from 560px, a scrolling vertical day column below.",
  touchFallback: "In the vertical layout, drag the window or the edge grips with a finger; the page scrolls elsewhere.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
