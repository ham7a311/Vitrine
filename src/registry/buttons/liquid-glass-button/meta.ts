import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "liquid-glass-button",
  name: "Liquid Glass",
  category: "buttons",
  description: "A capsule of glass that bends what's behind it, carries a specular highlight around its rim toward your pointer, and squashes like a drop of liquid when pressed.",
  tags: ["button", "glass", "liquid-glass", "backdrop-filter", "refraction", "apple"],
  traits: ["hover", "cursor", "click", "touch"],
  source: "original",
  files: ["LiquidGlassButton.tsx", "liquid-glass-button.css"],
  dependencies: [],
  prompt: `Make a glass button meant to sit over imagery. The capsule has a 10% white body and a backdrop filter of blur(10px) saturate(1.8) brightness(1.08); where SVG backdrop filters are supported, a second declaration prepends url(#lens) — an feTurbulence (0.008/0.012) → feDisplacementMap (scale 16) — so the scene behind bends softly like liquid glass (browsers that don't understand it keep the plain blur). Depth comes from stacked inset shadows: a bright 1px top edge, a faint lower edge, a hairline ring, a low inner glow, and a soft drop shadow.

A specular highlight rides the rim: a pseudo layer with 1.25px padding, masked to just the ring (content-box xor), filled with a radial gradient centred on the pointer's --mx/--my, so the brightest point of the edge travels toward your finger. A faint internal caustic follows the same point. Pressing plays a 620ms jelly squash — scale(1.06, 0.9) → (0.97, 1.04) → (1.015, 0.99) → 1 — on a springy curve. Place it over a slowly drifting colourful scene (blurred radial blobs, 14s alternate drift, still under reduced motion) so there is something for the glass to bend.`,
  interaction: "Move over it to steer the rim highlight; press to squash it.",
  animation: "Specular follows the pointer via CSS variables; 620ms spring squash on press; 300ms hover tint.",
  a11y: "Real buttons with labels (icon buttons have aria-label, play toggles aria-pressed); text has a subtle shadow for contrast on busy backgrounds. Reduced motion removes the squash.",
  responsive: "Intrinsic width; round buttons are 52px square.",
  touchFallback: "Press squash works on touch; the rim rests at the top edge.",
  variants: [
    { id: "pill", label: "Pills", prompt: "Pills: two capsule buttons, \"Get started\" and a frost-tinted \"Watch the film ↗\" (tint \"185 204 228\"), over a blue/green/magenta scene on #0b1220." },
    { id: "controls", label: "Media controls", prompt: "Media controls: three round icon buttons (shape=\"round\") — previous, a play/pause toggle with aria-pressed, next — over a warm dusk scene (coral, violet, gold on #120b1c)." },
  ],
  preview: { bg: "#0b1220", mode: "fill" },
  featured: true,
};
