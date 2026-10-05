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
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --hc-amber-bright #f3b45f; --hc-badge-bg rgba(255, 255, 255, 0.03); --hc-badge-border rgba(255, 255, 255, 0.15); --hc-blend screen; --hc-border #33312e; --hc-dot rgba(255, 255, 255, 0.11); --hc-ink #f4f3f1; --hc-muted #c2c0b8; --hc-scrim radial-gradient(ellipse 72% 68% at 50% 48%, rgba(10, 9, 8, 0.62) 0%, rgba(10, 9, 8, 0.22) 58%, transparent 80%); --hc-surface #0a0908. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --hc-amber-bright #d08920; --hc-badge-bg color-mix(in srgb, #16150f 4%, transparent); --hc-badge-border color-mix(in srgb, #16150f 12%, transparent); --hc-blend multiply; --hc-border #ddd7cc; --hc-dot rgba(0, 0, 0, 0.08); --hc-ink #16150f; --hc-muted #3f3c36; --hc-scrim radial-gradient(ellipse 68% 62% at 50% 48%, color-mix(in srgb, #ebe7df 52%, transparent) 0%, color-mix(in srgb, #ebe7df 16%, transparent) 55%, transparent 78%); --hc-surface #ebe7df. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0c0b0a", mode: "fill", frame: [1040, 780], height: 640 },
  featured: true,
};
