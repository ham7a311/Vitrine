import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "wind-map",
  name: "Wind Map",
  category: "backgrounds",
  description: "A weather chart drawn by the wind: thousands of particles ride a slowly turning flow field and leave fading hairline trails, coloured by speed, and the pointer is a small low-pressure system they spiral round.",
  tags: ["background", "canvas", "particles", "flow field", "wind", "weather", "trails"],
  traits: ["canvas", "cursor", "ambient"],
  source: "original",
  files: ["WindMap.tsx"],
  dependencies: [],
  prompt: `Build a canvas 2D background in the style of a live wind map.

The field: the wind direction at (x, y) is a smooth 2D value noise sampled at a large scale (0.0016/px) and drifting slowly through time, times 2.2π, plus a finer octave for texture; its strength comes from a third, broader noise. Scatter particles at ~11 per 10,000 px² (fewer on touch), each with a random life of 40–200 frames, respawning at a random point when it dies or leaves the canvas.

Each frame, fade the canvas toward the background with a low-alpha fill (6%) so earlier movement leaves trails, then advance every particle by its wind vector and draw the segment it travelled. Bucket segments into four Path2D objects by speed and stroke each once with a colour from a slow → fast ramp (colours prop: background, slow, mid, fast), so a frame is four stroke calls rather than thousands.

The pointer is a small low-pressure system: within ~210px a Gaussian-weighted vortex adds a tangential push plus a slight inward one, so the wind bends round it and spirals in; it fades in and out as the pointer enters and leaves. Stop requesting frames offscreen or in hidden tabs. Under reduced motion, run 90 frames up front with a slower fade and leave the still chart.`,
  interaction: "The wind bends round the pointer and spirals in toward it.",
  animation: "Particles advance every frame; the field drifts over minutes; trails fade at 6% per frame; the pointer vortex eases in at 4% per frame.",
  a11y: "The canvas is aria-hidden and decorative. Reduced motion draws a still chart of built-up trails.",
  responsive: "Particle count scales with area; the canvas is redrawn at the new size on resize.",
  touchFallback: "No vortex on touch, 60% of the particles, ~33fps.",
  variants: [
    { id: "night", label: "Night", prompt: "Colours [#070a10 background, #2b3d5c slow, #7d9cc8 mid, #f0d9b5 fast]: dark blue → frost → pale tan streaks on a near-black chart; labels white at 40–55%." },
    { id: "sand", label: "Sand", prompt: "Colours [#f1eadc background, #d2c3a6 slow, #a77b4f mid, #5b3a22 fast]: a light parchment chart where faster wind is darker brown; labels black at 40–50%." },
  ],
  preview: { bg: "#070a10", mode: "fill" },
};
