import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "plan-pill-button",
  name: "Plan Pill Button",
  category: "buttons",
  description: "The quiet pill that closes a pricing card: a short, solid capsule with a medium-weight label. On hover a soft halo of its own colour opens round it, and a press sinks it slightly. In white, ink, frosted glass and lit teal.",
  tags: ["button", "pill", "pricing", "cta", "minimal", "capsule", "glass", "css"],
  traits: ["hover", "click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["PlanPillButton.tsx", "plan-pill-button.css"],
  dependencies: [],
  prompt: `Build a quiet pill button of the kind that closes a pricing card: short, solid, one medium-weight label, no icon by default. Pure CSS.

Shape. A native button 36px tall by default (small 30px, large 44px). Everything follows the height: horizontal padding 62% of it, a minimum width of 4.3 times it, the label at 36% of it in a medium (500) grotesk with −0.005em tracking, and a fully round end. The default label is "Choose Plan".

States. Hover: a halo opens round the pill, a ring 12% of the height wide in the pill's own halo colour, over 200ms. Pressed: scale 0.97. Focus-visible: a 2px pale cyan (#a8dcee) outline, 3px out. Disabled: 45% opacity, no halo.

Production behaviour: it is a plain button with real text; reduced motion removes the transitions; forced-colours mode gives it a border.`,
  interaction: "Hover opens a soft halo round the pill; press sinks it. Tab reaches it.",
  animation: "Halo 200ms; press 160ms.",
  a11y: "A native button with real text and a visible focus outline. Each look keeps its label above 4.5:1 on its own fill.",
  responsive: "Three heights, 30, 36 and 44px; every proportion follows the height.",
  touchFallback: "A press sinks it; nothing depends on hover.",
  variants: [
    { id: "white", label: "White", prompt: "A white pill (#ffffff) with near-black text (#111111), for dark cards on black; the hover halo is the pill colour at 18%. Select it with the look option set to \"white\"." },
    { id: "ink", label: "Ink", prompt: "A near-black pill (#111214) with #ffffff text, for light pages; the hover halo is the ink at 12% and the focus outline is the ink. Select it with the look option set to \"ink\"." },
    { id: "glass", label: "Glass", prompt: "A frosted, translucent pill: #ffffff at 10% with backdrop-filter blur(10px) saturate(1.3), a 1px inner hairline of #ffffff at 28%, and pale text (#f4f4f4), for dark grounds with light or colour behind them. On hover the fill rises to 16%, the hairline to 40%, and a halo of #ffffff at 10% opens. Select it with the look option set to \"glass\"." },
    { id: "glow", label: "Glow", prompt: "A pale teal pill (#e9f8fb) with deep teal text (#0b2f37), lit from inside: an outer glow of 32% of the height in rgb(122 188 200 / 0.6) and an inner glow of 18% in rgb(132 196 208 / 0.65), for the plan to choose. On hover both glows grow and a teal halo at 30% opens. Select it with the look option set to \"glow\"." },
  ],
  preview: { bg: "#000000", mode: "center", height: 460 },
};
