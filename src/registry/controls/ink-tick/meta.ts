import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ink-tick",
  name: "Ink Tick",
  category: "controls",
  description: "A checkbox ticked with a pen: one stroke that bleeds a little into the paper, then the label struck through by the same hand.",
  tags: ["checkbox", "check", "tick", "todo", "svg", "handwritten", "form", "list"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["InkTick.tsx", "ink-tick.css"],
  dependencies: [],
  prompt: `Build a checkbox that is ticked with a pen, keeping a real (visually hidden) <input type="checkbox"> inside a <label> so forms, keyboard and screen readers work untouched. Draw the box as a hand-made SVG path that is not quite square and overlaps where the pen closes it (1.5px, currentColor at 70%, full on hover).

The tick is one curved stroke (3.2 wide, round caps, in the ink colour) that runs from the left, dips, and flicks up past the top-right of the box. It draws in with stroke-dasharray/offset on pathLength=1 over 420ms, starting fast and slowing as the pen lifts, through an feTurbulence + feDisplacementMap filter (scale 1.6) so its edges bleed slightly like ink on paper. 300ms later, the label is struck through by a slightly wavy hand line (drawn the same way) and dims to 55%. Unticking erases both faster in the reverse direction (220–260ms, ease-in), like a quick scrub. The row is at least 44px tall; keyboard focus shows a ring round the box in the ink colour. Demo: a weekend to-do list.`,
  interaction: "Click the row, tap it, or press Space when focused to tick and untick.",
  animation: "Tick 420ms draw; strike 380ms after a 300ms delay; untick scrubs out in 220–260ms.",
  a11y: "A native checkbox in a label, so the whole row is clickable and announced normally; the drawings are aria-hidden. Reduced motion shows the tick and strike instantly.",
  responsive: "The label wraps naturally beside the fixed 30px box; the strike scales to the text width.",
  touchFallback: "Tap anywhere on the row; the hover emphasis is mouse-only.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f3eee3", mode: "fill", height: 440 },
};
