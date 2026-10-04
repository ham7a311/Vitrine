import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "bracket-checkbox",
  name: "Bracket Checkbox",
  category: "controls",
  description: "A square checkbox framed by offset crop-mark brackets; checking floods the box and draws a hand-made tick.",
  tags: ["checkbox", "form", "input", "svg", "draw-in", "consent"],
  traits: ["click", "keyboard", "hover"],
  source: "original",
  files: ["BracketCheckbox.tsx", "bracket-checkbox.css"],
  dependencies: [],
  prompt: `Build a native checkbox with an editorial, print-inspired look. The box is a 22px square with a 1.5px ink border, square corners and a transparent fill. Two 8px corner brackets sit 5px outside the box — one at the top-left, one at the bottom-right — like crop marks framing it (drawn with ::before/::after on a wrapper).

When checked, the box floods solid ink instantly and a hand-drawn tick draws itself on top: a single cubic-bezier path with a slightly wobbly, human stroke (1.7px, round caps, paper-coloured), animated with stroke-dashoffset over 480ms using cubic-bezier(0.65,0,0.35,1) after a 70ms beat, so the fill lands first and the pen follows. Unchecking reverses the draw.

Keep the real <input type="checkbox"> (appearance: none) so forms, keyboard and screen readers work untouched. Focus-visible shows a 2px outline 3px out. An invalid state turns the box and both brackets a muted brick red and shows an alert message below with a small diamond bullet. The row is at least 44px tall. Provide light and dark surfaces. On fine pointers, the brackets open 2px outward on hover.`,
  interaction: "Click or Space toggles. The tick draws in on check and un-draws on uncheck; brackets open 2px on hover (fine pointers only).",
  animation: "Tick: stroke-dashoffset 1 → 0 over 480ms, cubic-bezier(0.65,0,0.35,1), 70ms delay. Brackets: 220ms translate.",
  a11y: "Native checkbox wrapped in a <label>, so the whole row is clickable. aria-invalid and aria-describedby wire up the error message, which is announced with role=\"alert\". Decorative tick is aria-hidden.",
  responsive: "Fluid row; text wraps beside the fixed 22px box. 44px minimum row height for touch.",
  touchFallback: "Hover addition is gated to fine pointers; everything else is tap-driven.",
  variants: [
    { id: "light", label: "Light surface" },
    { id: "dark", label: "Dark surface" },
  ],
  preview: { bg: "#f6f4ef", mode: "fill" },
};
