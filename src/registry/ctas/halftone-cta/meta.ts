import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "halftone-cta",
  name: "Halftone CTA",
  category: "ctas",
  description: "A tall CTA banner where slow gold paint drifts beneath a fixed halftone grid, visible only through the dots.",
  tags: ["cta", "section", "halftone", "gold", "ambient", "banner"],
  traits: ["ambient", "hover"],
  source: "original",
  files: ["HalftoneCta.tsx", "halftone-cta.css"],
  dependencies: [],
  prompt: `Build a tall, centred call-to-action banner (min 480px, 20px radius, hairline border, near-black #0a0908). Cover it with a faint halftone dot grid: a radial-gradient dot (1.15px solid, soft to 1.45px) tiled every 6px at 11% white.

Behind the grid, paint four large blurred gold blobs (#e0a352, #c9791f, #8a6d1f, #b8863f; filter: blur(18px)) on an oversized layer (inset −35%) that drifts on a 20s loop — translating ±8%, rotating ±6° and scaling up to 1.1. The trick: that paint is only visible *through the dots*. Put the same dot pattern as a mask-image (mask-size 6px) on a non-moving wrapper around the paint, with mix-blend-mode: screen, so the grid itself stays perfectly still while gold light swims through it like a halftone print coming alive.

A radial scrim darkens the centre so the stack stays legible: a soft pill badge, a large 600-weight heading (clamp 2.25–4rem, −0.03em tracking, 1.1 line height), a muted 30rem paragraph, and a gold pill button whose 120° gradient (#b8863f → amber → #f6c98a → amber → #b8863f, 200% wide) shimmers back and forth every 7s — twice as fast on hover, where it also lifts 1px and gains a warm glow. Provide a light theme (ink dots on paper, multiply blend). Under reduced motion the paint and shimmer stop.`,
  interaction: "Hover or focus on the button doubles the shimmer speed, lifts it 1px and adds a gold glow.",
  animation: "Paint drift 20s ease-in-out; button shimmer 7s (3.5s on hover); hover transitions 200–300ms.",
  a11y: "Semantic <h2> and a real link. All decorative layers are aria-hidden. The scrim keeps text contrast high over the moving paint. Reduced motion freezes both loops.",
  responsive: "Heading scales with container width (cqi units); padding and min-height step down below 640px.",
  variants: [
    { id: "dark", label: "Dark" },
    { id: "light", label: "Light" },
  ],
  preview: { bg: "#0c0b0a", mode: "fill", frame: [1040, 780], height: 640 },
  featured: true,
};
