import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "eye-tracker",
  name: "Watchful Ball",
  category: "cursors",
  description: "Round characters whose eyes sit on the sphere: they follow the pointer with real foreshortening, blink, squint up close and get dizzy if you circle them.",
  tags: ["eyes", "follow", "cursor", "character", "mascot", "svg", "playful", "tracking"],
  traits: ["cursor", "touch"],
  source: "original",
  files: ["EyeTracker.tsx", "eye-tracker.css"],
  dependencies: [],
  prompt: `Build an SVG character whose eyes follow the pointer as if they were painted on a ball. The ball is a circle with a soft radial shade, a highlight and a contact shadow; each eye is a point on the unit sphere (x0 = ±0.3, y0 = −0.16, z0 = √(1 − x0² − y0²)). The pointer's offset from the ball sets a target yaw (up to ±0.95 rad) and pitch (±0.75), eased with a 0.12 lerp; every frame rotate each eye point — x1 = x0·cos(yaw) + z0·sin(yaw), z1 = −x0·sin(yaw) + z0·cos(yaw), y2 = y0·cos(pitch) − z1·sin(pitch), z2 = y0·sin(pitch) + z1·cos(pitch) — and place it at translate(50 + x1·R, 50 + y2·R) scale(0.35 + 0.65·z2, …). An eye heading for the rim moves less and narrows: foreshortening is what makes the flat circle read as round. Pupils lean a little further the same way, and the highlight slides opposite the turn so the ball seems to roll.

Life: each ball blinks every 2.6–6.4s (close 70ms, open 120ms); eyes squint to 55% when the pointer comes within 1.4 radii; and if you circle a ball more than two full turns within about 1.6s its pupils turn into spinning spirals for 2.2s. Three balls of different sizes share one scene, all watching the same pointer (tracked on window, so they look at you even outside the frame). The loop sleeps between blinks when nothing moves.`,
  interaction: "Move anywhere and the balls look at your pointer; come close and they squint; circle one quickly and it gets dizzy.",
  animation: "Yaw/pitch lerp 0.12, squint lerp 0.2, blink 190ms every 2.6–6.4s, dizzy spin for 2.2s.",
  a11y: "The scene is one role=\"img\" with a description; the balls are aria-hidden. Reduced motion follows the pointer directly and stops blinking.",
  responsive: "Ball sizes are in vmin/container units, so the trio keeps its composition at any size.",
  touchFallback: "Touch drags steer the gaze; lifting the finger sends the eyes back to centre.",
  variants: [
    { id: "tangerine", label: "Tangerine", prompt: "Tangerine balls (#ff7a2f shading to #c2410c) with white eyes and near-black pupils on a warm cream page (#f6efe3)." },
    { id: "mint", label: "Mint", prompt: "Mint balls (#6ee7b7 shading to #0f9f6e) with white eyes and deep green pupils on a dark green page (#0f2a22)." },
    { id: "ink", label: "Ink", prompt: "Near-black balls (#26262a shading to #050506) with off-white eyes on a pale grey page (#eceae4)." },
  ],
  preview: { bg: "#f6efe3", mode: "fill", height: 560 },
};
