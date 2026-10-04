import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "lever-switch",
  name: "Lever Switch",
  category: "controls",
  description: "A toggle built like a mechanical lever: the arm swings on a brass pivot, overshoots into its detent, and lights a lamp.",
  tags: ["switch", "toggle", "form", "input", "mechanical", "settings"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["LeverSwitch.tsx", "lever-switch.css"],
  dependencies: [],
  prompt: `Design a settings toggle that feels like a piece of equipment. A 68×40px recessed plum housing with a hairline border and inner shadow holds a slim black slot with a small detent tick at each end. A metal arm (3px, brushed-steel gradient, round chrome knob at its tip) is pinned to a brass pivot at the left end of the slot. Off: the arm points up-left at −38°. On: it swings to horizontal (0°) along the slot.

The swing takes 420ms with an overshooting curve (cubic-bezier(0.34,1.7,0.5,1)) so the arm snaps past its stop and settles into the detent like a real switch. A tiny indicator lamp in the housing's top-right corner is dim when off and glows frost blue when on, and the housing border warms to frost. Use a real <button role="switch"> with aria-checked, tied to a visible <label> and optional description; disabled state dims to 45% with a not-allowed cursor. Reduced motion makes the swing instant.`,
  interaction: "Click, tap, Space or Enter toggles. Clicking the label also toggles.",
  animation: "Arm swing 420ms with overshoot; lamp fade 300ms; border 300ms.",
  a11y: "role=switch with aria-checked, label association via htmlFor, description via aria-describedby, visible focus ring, disabled state.",
  responsive: "Fixed-size control, fluid text beside it.",
  preview: { bg: "#0b080d", mode: "fill" },
};
