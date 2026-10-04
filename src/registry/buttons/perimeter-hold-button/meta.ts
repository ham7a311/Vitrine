import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "perimeter-hold-button",
  name: "Perimeter Hold",
  category: "buttons",
  description: "Hold to confirm: a line traces the outline while you press, unwinds if you let go, and fires when the lap completes.",
  tags: ["button", "hold", "confirm", "destructive", "progress", "svg"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["PerimeterHoldButton.tsx", "perimeter-hold-button.css"],
  dependencies: [],
  prompt: `Design a hold-to-confirm button for destructive actions, where time is the input. It's a dark plum rounded rectangle (56px, 14px radius) with a faint hairline outline and the label "Hold to delete".

Generate an SVG path that traces the button's actual outline — starting at the top centre and running clockwise around the rounded corners — from its measured size (ResizeObserver), and use it twice: once as the faint track, once as the progress line with pathLength=1. While the pointer (or Space/Enter) is held, a rAF loop advances progress over 1.2s and sets stroke-dashoffset = 1 − progress, so a warm rose line with a soft glow runs around the edge; the surface blushes faintly with the same colour and the button compresses up to 2%. Release early and the line unwinds at twice the speed.

When the lap completes: the action fires, the device gives a 12ms haptic tick where supported, the outline flashes frost blue, the button springs back from 98% with a little overshoot, and the label crossfades to a confirmed state with a check that draws itself. After ~2s it resets. Capture the pointer so sliding off doesn't cancel, block the long-press context menu, and ignore key repeat.`,
  interaction: "Press-and-hold (pointer, Space or Enter) fills the outline; releasing early unwinds it; completing fires onConfirm.",
  animation: "Progress 1.2s linear fill / 0.6s unwind via rAF; settle spring 500ms; check draw 420ms; label crossfade 260–380ms.",
  a11y: "A real <button> described by a hidden 'Press and hold to confirm' hint; completion is announced assertively. Works with Space/Enter held down. Reduced motion keeps the progress line (it's information) but removes the scale and spring.",
  responsive: "The outline path rebuilds whenever the button resizes, so any width works.",
  touchFallback: "Pointer capture and touch-action: manipulation make press-and-hold reliable on touch; the context menu is suppressed.",
  preview: { bg: "#0b080d", mode: "fill" },
};
