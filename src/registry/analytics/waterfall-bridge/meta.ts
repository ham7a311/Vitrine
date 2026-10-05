import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "waterfall-bridge",
  name: "Waterfall Bridge",
  category: "analytics",
  description: "How a quarter's revenue became its profit: each cost hangs down from where the last step left off and each gain stacks up, joined by connectors, building in order the first time you see it; switch quarter and every bar slides to its new height so you can watch which step moved.",
  tags: ["waterfall", "bridge", "profit and loss", "finance", "bar chart", "variance", "quarterly", "analytics"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  files: ["WaterfallBridge.tsx", "waterfall-bridge.css"],
  dependencies: [],
  prompt: `Build a profit waterfall (bridge) chart in SVG for two quarters.

Data: steps from Revenue (a total) through costs (negative) and other income (positive) to Net profit (a total computed from the rest). Each non-total step runs from the running total to running total + value; totals stand on zero. Bars are 4px-rounded, at most 64px wide; a dashed hairline connector joins each bar's end level to the next bar. Colour by polarity on the diverging pair — gains in the blue pole, losses in the red pole — and totals in a neutral ink tone, never status colours; every bar also carries a signed value label (+18.5k / −131k), so the sign is never colour alone. Labels sit above gains and totals, below losses. A shared nice y-axis across both quarters so switching doesn't rescale.

Motion: on first view each step fades and rises into place 140ms after the last (a build). Switching quarter (a Q2/Q3 radiogroup) tweens every bar's start and end to its new place (640ms ease-in-out) so the steps that moved are visible. Hover dims the other steps and shows a tooltip (value, share of revenue, the other quarter's value).

Header: net profit as the hero, its change vs the other quarter with ▲/▼ and success/critical text tokens, the margin, and the biggest swing between quarters computed from the data. Legend (Total / Adds to profit / Takes away). Chart ⇄ Table (both quarters and the change per step). Under 600px the step names are angled −40° and value labels shrink so nothing collides. Light and dark themes. Reduced motion: no build or tween.`,
  interaction: "Switch quarter to watch the bars move; point at a step for its share of revenue and last quarter's value; Table for the numbers.",
  animation: "Build: 140ms per step; quarter switch: 640ms tween of every bar.",
  a11y: "Signed value labels on every bar, a legend, a sentence summary on the SVG and a full table; the quarter switch is a radiogroup.",
  responsive: "Width follows the container; step names angle under 600px.",
  touchFallback: "Tap a step for its tooltip.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --axis #c3c2b7; --down #e34948; --grid #e1e0d9; --ink #0b0b0b; --ink-2 #52514e; --neg-text #d03b3b; --pos-text #006300; --ring rgba(11, 11, 11, 0.1); --surface #fcfcfb; --total #52514e; --up #2a78d6. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --axis #383835; --down #e66767; --grid #2c2c2a; --ink #ffffff; --ink-2 #c3c2b7; --neg-text #e66767; --pos-text #0ca30c; --ring rgba(255, 255, 255, 0.1); --surface #1a1a19; --total #9a998f; --up #3987e5. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f9f9f7", mode: "fill" },
};
