import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "phosphor-glass-button",
  name: "Phosphor Glass Button",
  category: "buttons",
  description: "A liquid-glass pill that senses you coming: its rim light turns to face the cursor and the pill leans in to meet it.",
  tags: ["button", "glass", "cursor", "magnetic", "ripple", "cta"],
  traits: ["cursor", "hover", "click"],
  source: "original",
  files: ["PhosphorGlassButton.tsx", "phosphor-glass-button.css"],
  dependencies: [],
  prompt: `Create a pill-shaped main button (48px tall, 26px padding) made of luminous phosphor-green glass on a warm near-black page. The fill is layered: a bright mint highlight bleeding in from the top-left, a deep teal pooling at the bottom-right, over a 115° gradient from pale lime to sea green that is twice the button's width. A soft white gloss sits along the top third, inset from the edges.

Make it aware of the cursor at three distances:
1. Near (within 180px of the edge): a 1.5px rim light — a conic gradient masked to the border — rotates so its bright arc always faces the pointer, and brightens from 18% to 100% as the cursor approaches. The whole pill leans up to 4px toward the pointer (label leans 60% as much, for parallax), easing over 380ms.
2. Over: the wide gradient slides so its hue follows the cursor's x-position (600ms), a 90px overlay-blended light pool tracks the pointer, and the pill saturates slightly.
3. Press: it scales to 0.97 and a thin ring ripples outward from the exact press point (scale 0 → 3.2, fading, 560ms).
Use one shared, rAF-throttled window pointermove listener for all instances; skip it entirely on touch devices. All easing is cubic-bezier(0.16,1,0.3,1).

There is also a quiet text style (variant="text") whose underline draws from left to right on hover. Keyboard focus lights the full rim. Reduced motion removes the lean and ripple.`,
  interaction: "Rim light and lean react to the cursor from 180px away; surface light follows the pointer over the button; press spawns a ripple at the contact point.",
  animation: "Lean 380ms, gradient slide 600ms, light pool/rim 220ms, press scale 120ms, ripple 560ms — all cubic-bezier(0.16,1,0.3,1).",
  a11y: "A <button> (or <a> with href). Focus-visible forces full proximity so keyboard users see the complete rim plus a phosphor outline. Decorative layers are aria-hidden.",
  responsive: "Intrinsic width; works at any size. The proximity listener only runs while the button is on screen.",
  touchFallback: "Proximity tracking is disabled on coarse pointers; the button still shows its glass fill, gloss and press ripple.",
  promptAllow: ["text"],
  variants: [
    { id: "primary", label: "Primary + text", prompt: "Primary + text: the glass pill \"See the work →\" beside a text-style link \"Download résumé ↗\", on #0e0d0b." },
    { id: "text", label: "Text links", prompt: "Text links only: two quiet text-style buttons (\"Read the case study →\", \"View changelog\") whose underlines draw left to right on hover — no glass pill." },
  ],
  preview: { bg: "#0e0d0b", mode: "fill" },
  featured: true,
};
