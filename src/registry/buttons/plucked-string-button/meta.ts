import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "plucked-string-button",
  name: "Plucked String",
  category: "buttons",
  description: "A taut hairline string that bends toward your cursor and rings out on a damped spring when you let go or press.",
  tags: ["button", "physics", "spring", "cursor", "svg", "tactile"],
  traits: ["cursor", "click", "touch"],
  source: "original",
  files: ["PluckedStringButton.tsx", "plucked-string-button.css"],
  dependencies: [],
  prompt: `Design a dark, quiet button (56px tall, 14px radius, near-black plum surface, faint cream hairline border) with a single physical detail: a taut hairline string stretched across its lower edge between two tiny pins, 18px in from each side.

The string is simulated, not animated. It is a quadratic SVG curve whose control point follows the cursor's x, and whose displacement is a mass-spring value (stiffness 0.16, damping 0.9 per frame). While the pointer is over the button, the spring's target is pulled toward the cursor — up to 11px up when the cursor is above the string, half that when below — so the string leans into your hand. When the pointer leaves, the target snaps to zero and the spring rings out from wherever it was held. Pressing (mouse, touch, Enter or Space) plucks it: an impulse at the press point that makes it vibrate and settle over ~700ms.

As the string's energy rises it warms from frost blue toward lilac, brightens, and gains a soft blurred glow; a faint radial light swells from the bottom of the button; and the label trembles vertically in sympathy (12% of the displacement). The rAF loop runs only while the string is moving and stops itself at rest. Under reduced motion the string stays straight.`,
  interaction: "Hover bends the string toward the cursor; leaving releases it; press/Enter/Space plucks it at the contact point.",
  animation: "Per-frame spring (k 0.16, damping 0.9), self-terminating. Border 300ms; press scale 0.985 over 160ms.",
  a11y: "A real <button>; the string is aria-hidden. Keyboard activation plucks from the centre. Visible frost focus ring. Reduced motion disables the simulation.",
  responsive: "Intrinsic width with an 11rem minimum; the string re-measures on resize.",
  touchFallback: "Bending needs a mouse, but a tap plucks the string just the same.",
  preview: { bg: "#0b080d", mode: "fill" },
};
