import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "firefly-sync",
  name: "Firefly Sync",
  category: "backgrounds",
  description: "A meadow at dusk where fireflies flash on their own clocks and nudge them toward the flashes they can see, so over half a minute scattered blinks become waves of light rolling through the grass. The pointer is a lantern: fireflies near it lose the beat and drift to its glow.",
  tags: ["background", "canvas", "fireflies", "synchrony", "kuramoto", "night", "nature", "glow", "ambient"],
  traits: ["canvas", "cursor", "ambient"],
  source: "original",
  files: ["FireflySync.tsx"],
  dependencies: [],
  prompt: `Build a canvas 2D dusk meadow with fireflies that synchronise like real ones.

Scene: sky gradient, a few stars and two noise-shaped ridges are drawn once per size into an offscreen canvas; every frame draws that, then the far fireflies, then a field of grass blades (one filled path of quadratic blades, ~1 per 3px, swaying with a sine plus noise), a lantern glow if active, then the near fireflies — so some sit behind the grass and some in front.

Fireflies (~0.9 per 10,000 px², 36–130): each wanders on a slow noise field over the lower half, has a depth z (size and brightness) and a phase oscillator with its own frequency (period 1.3–1.6s). Brightness is a brief Gaussian flash around phase 0 (σ 0.32 rad) over a faint ember, drawn additively with a pre-tinted Gaussian glow sprite (stops e^(−4.4r²)(1 − r⁴), so no edges) plus a tiny bright core during the flash.

Synchrony (Kuramoto): dθᵢ/dt = ωᵢ + K · Σⱼ wᵢⱼ sin(θⱼ − θᵢ) / Σⱼ wᵢⱼ over neighbours within R = max(160px, 28% of the width), with wᵢⱼ = 1 − d²/R². K ramps from 0 to 2.4 over the first 25s, so you watch scattered blinking turn into rolling waves and then a field that pulses together. Expose the order parameter r = |Σ e^{iθ}| / N via an onSync callback twice a second (the demo shows "In step · 74%").

The pointer is a lantern: a warm soft light (and a small bright core) that fades in; fireflies within ~150px (Gaussian) get jitter added to their clocks, so they fall out of step, and drift toward the light; they resynchronise after it leaves. One rAF loop, paused offscreen and in hidden tabs; ~33fps and 70% of the fireflies on touch. Reduced motion: simulate 12s up front and draw one still, synchronised frame.`,
  interaction: "Move over the meadow: your lantern scatters the rhythm nearby and draws fireflies in.",
  animation: "Continuous while visible; synchrony builds over ~25s; flashes ~1.5s apart.",
  a11y: "The canvas is aria-hidden and decorative; overlay text sits above it. Reduced motion draws one still frame.",
  responsive: "Firefly count, grass and ridges are rebuilt for the new size on resize.",
  touchFallback: "Touch drag carries the lantern; it fades when the finger lifts. 70% of the fireflies at ~33fps.",
  promptAllow: ["dusk"],
  variants: [
    { id: "dusk", label: "Dusk", prompt: "theme=\"dusk\": a violet sky warming to a low amber horizon, a few stars." },
    { id: "midnight", label: "Midnight", prompt: "theme=\"midnight\": a deep navy sky with more stars and no warm horizon." },
  ],
  preview: { bg: "#0b1030", mode: "fill" },
};
