import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "halo-frame",
  name: "Halo Frame",
  category: "cards",
  description: "A hairline frame with a comet of light endlessly orbiting its edge — pure CSS, driven by an animated @property angle.",
  tags: ["card", "border", "glow", "ambient", "css-only", "quote"],
  traits: ["ambient"],
  source: "original",
  files: ["HaloFrame.tsx", "halo-frame.css"],
  dependencies: [],
  prompt: `Wrap content in a 1px frame (10px radius) whose border carries a slow orbiting light. Build it with a padding: 1px wrapper whose background is a dark hairline colour, and two pseudo-elements behind the content, each a conic-gradient rotated by a registered @property --angle that animates 0 → 360deg linearly and infinitely (speed prop, default 7s).

The first gradient is the comet: transparent for most of the circle, then a short run through three colours (colors prop: [a, b, c], dim → bright → pale) and back — a head roughly 20% of the circumference wide. The second gradient starts 180° ahead and is a much thinner, 55%-strength sliver at 70% opacity, so a faint counter-light chases the comet from the opposite side. Because the frame is only 1px, the light reads as travelling along the border rather than glowing.

Under reduced motion the light rests at the top-right corner.`,
  interaction: "None — it's ambient. The light orbits continuously.",
  animation: "One @property angle animated 0 → 360° over 7s linear; both conic layers share it, offset by 180°.",
  a11y: "Purely decorative pseudo-elements; content stays a semantic <blockquote>. Reduced motion stops the orbit.",
  responsive: "Fluid width; the quote text scales with clamp(). Speed and colours are props.",
  variants: [
    { id: "quote", label: "Amber quote", prompt: "Amber quote (HaloQuote): comet colours #e8a24a → #f3b45f → #f6c98a at the default 7s; inside, a quote card on the page colour with a mono uppercase amber kicker (\"Our intent\") and a large italic serif line (clamp 1.5–2.06rem, 1.22 line height, 30ch max)." },
    { id: "panel", label: "Frost status panel", prompt: "Frost status panel: HaloFrame with speed 9 and colors [#7e93ae, #b9cce4, #eef3fa] around a #0d0f14 panel — mono uppercase kicker \"Build status\" in #9fb3cc, a 2xl medium title \"Deploying to production\" and a muted step line." },
  ],
  preview: { bg: "#0c0b0a", mode: "fill" },
};
