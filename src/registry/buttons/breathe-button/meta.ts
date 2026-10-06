import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "breathe-button",
  name: "Breathe Button",
  category: "buttons",
  description: "A gradient call to action with a halo that slowly swells and fades, as if the button were breathing. Hover brightens the halo and quickens the breath, and the arrow slides forward.",
  tags: ["button", "breathe", "glow", "halo", "gradient", "cta", "call to action", "pulse"],
  traits: ["click", "keyboard", "hover", "ambient"],
  source: "original",
  files: ["BreatheButton.tsx", "breathe-button.css"],
  dependencies: [],
  prompt:
    "Build a 'Start building' call-to-action pill (52px tall, fully rounded, a 135° gradient, white Inter 600 at 16px, a light 1px top edge and a small shadow) with a trailing arrow.\n\nGradient: indigo #4f46e5 to violet #9333ea (on dark, #6366f1 to #a855f7). Behind the button, a copy of the same gradient, blurred by 14px and extending 2px past it, forms a halo that breathes: scale 0.96 ↔ 1.06 and opacity 0.35 ↔ 0.7 over 3.2s (ease in-out, infinite). On hover the halo brightens to 85% opacity and breathes twice as fast (1.6s) and the arrow slides 3px right; press scales to 0.97. Focus: a 2px ring #2563eb / #6ea8fe, 4px out.\n\nShow it centred on a #f6f6f5 / #0a0a0a page.",
  interaction: "A normal button: Enter or Space activates it; hover only strengthens the halo.",
  animation: "A 3.2s breathing halo (1.6s on hover) and a 0.2s arrow slide. Reduced motion holds the halo still at its resting glow.",
  a11y: "Native button; white text keeps 4.5:1 on both gradient ends; the halo is decorative.",
  responsive: "One fixed-height pill.",
  touchFallback: "The halo keeps breathing without hover.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --brth-a #4f46e5; --brth-b #9333ea; --brth-focus #2563eb. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --brth-a #6366f1; --brth-b #a855f7; --brth-focus #6ea8fe. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f6f6f5", mode: "fill", frame: [900, 400] },
  isNew: true,
};
