import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "confetti-click",
  name: "Confetti Click",
  category: "cursors",
  description: "The ordinary arrow, untouched — every click pops a handful of paper confetti: strips, squares, curls and dots thrown up from the click, tumbling over and fluttering sideways as they fall away. Hold a moment before letting go for a bigger pop.",
  tags: ["cursor", "click", "confetti", "celebration", "party", "burst", "canvas", "delight", "particles"],
  traits: ["cursor", "click", "canvas", "keyboard"],
  source: "original",
  isNew: true,
  files: ["ConfettiClick.tsx", "confetti-click.css", "burst.ts", "layer.ts"],
  dependencies: [],
  prompt:
    "Build a wrapper that turns clicks into little confetti bursts while leaving the normal cursor alone. Props: children, mix (one of two palettes), global (listen on the whole window with a fixed full-screen canvas), motion, className and style.\n\nThe layer (a small module): a canvas over the host with pointer-events none, sized by a ResizeObserver at DPR ≤ 2, in host-local coordinates corrected for a scaled host. pointerdown on the main button starts a hold; past 120ms a ring arc grows round the press point and fills over 650ms; pointerup releases a burst with a power from 1 to 2.2. A click with detail 0 (keyboard activation) bursts from the middle of that element. The loop runs only while something moves.\n\nParticles (pure functions): seeded randomness, a spray of velocities spread evenly across an arc with jitter, and one step with exponential drag, gravity and an optional sideways sway.\n\nThe burst: 22 × power pieces thrown upwards across an arc of about 140–180° at 260–520px/s × √power, each a strip, a square, a curl (an open arc stroke) or a dot, 5–9px, in the palette. Steady gravity (620px/s²) with strong drag (2.6/s) makes them hang and drift down like paper, with a sideways flutter of 26px/s. Each spins, and tumbles — scaled on one axis by the cosine of a fast phase, with a darker face when it's turned away. They live 1.3–2.2s and fade over the last quarter. Reduced motion replaces the pop with one soft ring that fades in 600ms.",
  interaction: "Click anywhere for a pop of confetti; hold before releasing for a bigger one. Keyboard activation of a button or link pops from its centre.",
  animation: "Pieces fly up and flutter down over 1.3–2.2s; the charge ring fills over 650ms. Reduced motion shows a single fading ring.",
  a11y: "The native cursor and every control are untouched; the canvas is aria-hidden and ignores the pointer. Keyboard clicks get the effect too.",
  responsive: "The canvas follows the host's size; with global it covers the window.",
  touchFallback: "Taps pop too; a long press charges a bigger one.",
  variants: [
    { id: "party", label: "Party", prompt: "Bright party confetti (#ff3d6e, #ffb000, #2bc48a, #2f7bff, #a35bff, #ff7a2f) on a warm cream #fff8ee page." },
    { id: "pastel", label: "Pastel", prompt: "Soft pastel confetti (#ffb3c7, #ffd89a, #b6ecd2, #a9d1ff, #d6c2ff, #ffc9a8) on a deep plum #2a2440 page." },
  ],
  preview: { bg: "#fff8ee", mode: "fill" },
};
