import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "glassbreak-button",
  name: "Glassbreak Button",
  category: "buttons",
  description: "A solid plate that fractures from one impact point, cracks racing outward as the shards drift apart.",
  tags: ["button", "glass", "hover", "shatter", "css-only", "cta"],
  traits: ["hover", "keyboard"],
  source: "original",
  files: ["GlassbreakButton.tsx", "glassbreak-button.css"],
  dependencies: [],
  prompt: `Create a rectangular, square-cornered CTA button (56px tall, 28px horizontal padding, 600-weight label followed by a thin square-capped arrow) that looks like a solid pane of dark glass. On hover or keyboard focus it shatters from a single impact point just below centre (50%, 52%):

1. The whole plate dips to 98.5% scale and back over 280ms — the moment of impact.
2. Six hairline cracks draw outward from the impact point using stroke-dashoffset on an SVG stretched to the button (preserveAspectRatio="none"), each 420ms, staggered 40ms + 45ms per crack.
3. A solid cover layer that hides the shard seams fades out over 400ms after an 80ms delay.
4. Six shards — fixed clip-path polygons that tile the button and all meet at the impact point — drift 4–8px away from the centre and rotate ±0.8–2.2° over 550ms (cubic-bezier(0.2,0.7,0.1,1)), with staggered delays between 160ms and 320ms. Three of the shards are a slightly different shade so the break reads as faceted glass.
5. Beneath the shards, a diagonal gradient plate (night → deep ocean blue) shows through the gaps.
6. The arrow slides 4px forward.

No randomness, no JavaScript animation — the break is choreographed so it looks identical every time. Provide a "light" surface (dark glass, bone text) and a "dark" surface (bone glass, amber cracks). Disabled buttons never break. On touch devices and narrow screens show the button already shattered so the idea survives without hover; full-width buttons stay whole. Under reduced motion it becomes a plain solid button.`,
  interaction: "Shatters on hover and on :focus-visible, reassembles on leave. The staggered delays apply both ways, so the shards settle back in a different order than they left.",
  animation: "Impact dip 280ms → cracks draw 420ms (staggered 40–265ms) → cover fades 400ms → shards drift 550ms (160–320ms delays). All CSS transitions/keyframes.",
  a11y: "Renders a real <button> (or <a> when href is set). Focus-visible triggers the same shatter plus a 2px outline. Decorative layers are aria-hidden; the label stays on top at z-index 2 for contrast in every state.",
  responsive: "Fixed height, intrinsic width; `fullWidth` stretches it. Compact size (44px) for navbars.",
  touchFallback: "At ≤767px or on coarse pointers the button renders pre-shattered — the cracked glass becomes the resting look.",
  variants: [
    { id: "light", label: "Light surface" },
    { id: "dark", label: "Dark surface" },
  ],
  preview: { bg: "#f6f4ef", mode: "fill" },
  featured: true,
};
