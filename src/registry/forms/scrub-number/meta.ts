import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "scrub-number",
  name: "Scrub Number",
  category: "forms",
  description: "The number field from design tools. Drag the label sideways to scrub (Shift for ten times, Alt for a tenth), nudge with the arrow keys, or type arithmetic straight into the box: 12*4, (100-8)/2, +=8. Values clamp with a flash at the edge they hit.",
  tags: ["number input", "inspector", "design tool", "slider", "keyboard", "expression", "form"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["ScrubNumber.tsx", "scrub-number.css", "expr.ts"],
  dependencies: [],
  prompt:
    "Build a compact number field of the kind used in design-tool inspectors, plus a ScrubGroup that lays several out as a panel ('Frame': X, Y, W, H, rotation, corner radius, opacity), driving a live preview.\n\nEach field is a 30px-tall, 6px-radius well on a slightly darker grey than the panel, in Inter 12px with tabular numbers: a short handle on the left ('X', 'W', '↻'), the value, and a muted unit on the right ('°', '%'). Hover adds a hairline ring; focus or scrubbing turns it accent blue. The panel is white with a 10px radius, a hairline border, a soft shadow and a small uppercase muted title.\n\nThe handle is a scrub control: press and drag sideways and the value changes by one step every 3px of movement, ten steps with Shift and a tenth with Alt, using movementX with pointer lock where the browser allows it so a scrub can continue past the screen edge. While scrubbing the handle turns blue and a 3px row of tick marks along the field's bottom edge slides with the value. Hitting min or max clamps the value and briefly flashes a 3px accent bar on that side.\n\nThe box accepts arithmetic, read by a small recursive-descent parser (never eval): numbers, + − × ÷ (and x between numbers), parentheses, units typed at the end, and relative forms '+=8', '-=8', '*=2', '/=2' applied to the current value. Enter commits and reselects, Escape reverts, blur commits; anything unreadable shakes the field with a red ring and leaves the value unchanged.",
  interaction:
    "Drag the handle to scrub; ↑/↓ change by one step (Shift ×10, Alt ×0.1); type a number or expression and press Enter. onChange receives the clamped, rounded value. Precision and step are per field.",
  animation:
    "Focus and hover rings fade over 140ms; the edge flash runs 320ms; an unreadable entry shakes 3px each way over 300ms. All of it is removed with reduced motion or motion={false}; the values still change.",
  a11y:
    "The handle is the input's label, so each field has a full spoken name ('Rotation') even when the handle shows a symbol. A description explains the keys, the arithmetic and the allowed range; a rejected entry sets aria-invalid and says the value is unchanged. Scrubbing is optional: everything it does is available from the keyboard.",
  responsive: "Fields fill their grid cell; the group's column count is a prop and the preview demo stacks the panel under the canvas on narrow screens.",
  touchFallback: "Drag the handle with a finger to scrub; tap the value to type with the decimal keypad.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --scrubn-accent #2f6fe4; --scrubn-bad #c4321c; --scrubn-field #f3f3f1; --scrubn-ink #1c1c1a; --scrubn-line rgb(28 28 26 / 0.12); --scrubn-muted #77756f; --scrubn-panel #ffffff. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --scrubn-accent #6aa0ff; --scrubn-bad #ff8a73; --scrubn-field #2a2a2d; --scrubn-ink #ececec; --scrubn-line rgb(255 255 255 / 0.1); --scrubn-muted #9a9a9f; --scrubn-panel #1e1e20. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#e9e9e6", mode: "center", frame: [1000, 560] },
};
