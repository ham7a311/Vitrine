import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "slosh-button",
  name: "Slosh Button",
  category: "buttons",
  description: "A glass capsule partly full of liquid that sloshes the other way when you move across it, rocking back and forth before it settles; press it and it fills to the brim, the label inverting at the waterline.",
  tags: ["button", "toggle", "liquid", "physics", "spring", "glass", "svg", "clip-path"],
  traits: ["hover", "cursor", "click", "keyboard"],
  source: "original",
  files: ["SloshButton.tsx", "slosh-button.css"],
  dependencies: [],
  prompt:
    "Build a toggle button (56px pill) made of glass: faint fill, hairline ring, inner top highlight and a soft glass sheen above everything. Inside, an SVG liquid body drawn every frame: a surface line sampled at 25 points, y = base + tilt × (x − w/2) + a small sine wave, closed down to the bottom. A thin white meniscus strokes the surface.\n\nSimulate two springs in one requestAnimationFrame loop that stops when settled: the level (resting 30%, 50% while hovered, 112% when pressed on) and the tilt, an underdamped spring (k 70, damping 3.2) so it rocks several times. Pointer movement feeds the tilt's velocity in proportion to the pointer's horizontal speed, so the liquid piles up on the side you came from and then rocks back; the wave's amplitude grows with how fast it's rocking. Toggling on pours it to the brim with a little jolt.\n\nRender the label twice in the same box: cream on the glass and ink above it, the ink copy clipped each frame with clip-path: path() using the same liquid outline, so the label inverts exactly along the moving surface. It's a toggle: aria-pressed, 'Save for later' → '✓ Saved'.",
  interaction: "Move across it to make the liquid slosh; hover tops it up; click to fill it and save, click again to empty.",
  animation: "Level spring (k 40, c 9); tilt spring (k 70, c 3.2), clamped to ±0.32; surface ripple speeds up while hovered.",
  a11y: "A real toggle button with aria-pressed and a label that changes to 'Saved'; the liquid and the ink copy are aria-hidden. Works fully from the keyboard; focus shows an outline. Reduced motion jumps to the level without sloshing.",
  responsive: "Measured with a ResizeObserver, so the liquid fits any label.",
  touchFallback: "Tapping fills or empties it with a slosh.",
  variants: [
    { id: "night", label: "Night" },
    { id: "paper", label: "Paper" },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
