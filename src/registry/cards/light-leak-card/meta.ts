import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "light-leak-card",
  name: "Light Leak Card",
  category: "cards",
  description: "A dark glass card with light pouring in through its top edge, a white-hot smoky burst spilling colour down the top half, a glowing mark, a frosted name chip and an outline button; the leak drifts and leans toward the pointer.",
  tags: ["card", "glow", "light", "leak", "glass", "dark", "product", "cta"],
  traits: ["cursor", "ambient", "hover"],
  source: "original",
  files: ["LightLeakCard.tsx", "leak.ts", "light-leak-card.css"],
  dependencies: [],
  prompt: `Build a product card lit by a light leak from its top edge (React + CSS, no libraries).

Card: 19.5em × at least 23.8em (16px base), radius 1.6em, clipped, background a vertical gradient from a dim mix of the light colour into a deep base by 62%. A hairline rim in the rim colour at 30%, a slightly brighter inner line along the bottom, and a soft dark drop shadow.

Leak (behind the content, centred on a point at the top edge, x 50% y 0): a broad radial wash of the light colour (150% × 120%, blurred 1em, drifting ±3% over 9s); a white-hot elliptical burst (70% × 34%, white to a pale tint, blurred 0.9em, flaring ±6% over 5s); and a smoke layer, an SVG fractal-noise texture in overlay blend masked to a soft ellipse, drifting the other way, so the burst looks cloudy instead of smooth. A fine pointer moves the leak's centre up to 8% sideways and 4% down, eased over 1s. Two small four-point sparkles in a tint of the light colour twinkle at the left and right of the mark.

Content, centred, padding 3.5em 1.6em 1.9em: an original glowing mark (6.2em; a broken ring with a small moon on its edge and a spark in the middle, white with two drop-shadow glows), the product name (2.45em, 600, white-to-grey gradient text) on a faint frosted chip, a three-line description (0.8em, #a8acc8, line-height 1.55) and an outline button (2.35em tall, 4px-ish radius, hairline in the rim colour, dark fill) that fills with the light colour and glows on hover. Reduced motion stops the drift, flare and twinkle. Props: name, children (description), action, href, mark, tone {light, deep, rim, page}.`,
  interaction: "A fine pointer pulls the light leak toward it; the button fills and glows on hover.",
  animation: "Wash drift 9s and smoke drift 13s (alternating), burst flare 5s, sparkle twinkle 3s, pointer follow 1s.",
  a11y: "An article with a real heading, paragraph and link; the leak, mark and sparkles are aria-hidden. Light text on the dark lower half is above 7:1. Visible focus ring on the button. Reduced motion stops every loop.",
  responsive: "Fixed 19.5em width that shrinks to the container; the content stays centred.",
  touchFallback: "No pointer follow on touch; the leak drifts on its own.",
  isNew: true,
  variants: [
    { id: "indigo", label: "Indigo", prompt: "Light #3b4dff, deep #0d0f2c, rim #9aa6ff, on a #09092a to black page." },
    { id: "teal", label: "Teal", prompt: "Light #14b8a6, deep #06181a, rim #8ff0e2, on a #041416 to black page." },
    { id: "amber", label: "Amber", prompt: "Light #ff8a1f, deep #1a0f06, rim #ffc88f, on a #140b04 to black page." },
  ],
  preview: { bg: "#09092a", mode: "fill", height: 560 },
};
