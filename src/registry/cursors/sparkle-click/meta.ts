import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "sparkle-click",
  name: "Sparkle Click",
  category: "cursors",
  description: "The ordinary arrow, untouched — but every click leaves a little burst of four-pointed sparkles that fly out, spin, twinkle and wink out, with a faint ring where you clicked. Hold a moment before letting go and a ring fills round the pointer for a bigger burst.",
  tags: ["cursor", "click", "sparkle", "stars", "burst", "celebration", "canvas", "delight", "particles"],
  traits: ["cursor", "click", "canvas", "keyboard"],
  source: "original",
  isNew: true,
  files: ["SparkleClick.tsx", "sparkle-click.css", "burst.ts", "layer.ts"],
  dependencies: [],
  prompt:
    "Build a wrapper that turns clicks into sparkle bursts while leaving the normal cursor alone. Props: children, shine (one of three palettes), global (listen on the whole window with a fixed full-screen canvas), motion, className and style.\n\nThe layer (a small module): a canvas over the host with pointer-events none, sized to it by a ResizeObserver at DPR ≤ 2, in host-local coordinates corrected for a scaled host. pointerdown (main button, any pointer type) starts a hold; while held past 120ms a ring arc grows round the press point and fills over 650ms. pointerup releases a burst with a power from 1 (a click) to 2.2 (fully held). A click with detail 0 — Enter or Space on a button or link — bursts from the middle of that element. The animation loop runs only while something is moving.\n\nParticles (pure functions): seeded randomness; a spray of n velocities spread evenly round a direction with jitter; and one step — exponential drag, gravity and age.\n\nThe burst: 9 × power + 2 four-pointed sparkles (each four quadratic curves bowed in to the centre) thrown out evenly in every direction at 170–340px/s × power, slowing quickly under heavy drag (4.6/s), so they spread 35–75px with a little gravity, spinning, living 0.5–0.85s; each pops up and shrinks away along a sine curve and twinkles fast. A few tiny dots go with them, and a thin ring expands and fades from the click in 320ms. Bright palettes draw additively with an 8px glow; the ink palette draws plainly. Reduced motion replaces the burst with one soft ring that fades in 600ms.",
  interaction: "Click anywhere for a burst of sparkles; hold before releasing for a bigger one. Keyboard activation of a button or link sparkles from its centre.",
  animation: "Sparkles fly and wink out over 0.5–0.85s; the charge ring fills over 650ms. Reduced motion shows a single fading ring.",
  a11y: "The native cursor and every control are untouched; the canvas is aria-hidden and ignores the pointer. Keyboard clicks get the effect too.",
  responsive: "The canvas follows the host's size; with global it covers the window.",
  touchFallback: "Taps burst too; a long press charges a bigger one.",
  variants: [
    { id: "gold", label: "Gold", prompt: "Gold sparkles (#ffd56b, #ffe9a8, #ffb63d, #fff6da) glowing additively on a midnight #0d1226 page." },
    { id: "prism", label: "Prism", prompt: "A rainbow of sparkles (#ff6b9a, #ffb84d, #f2dc3a, #4fd896, #4fb8ff, #a98bff), glowing, on an almost-white #fbfaff page." },
    { id: "mono", label: "Mono", prompt: "Ink-black sparkles (#16161a, #3a3a42) with no glow, on a paper #f4f1ea page." },
  ],
  preview: { bg: "#0d1226", mode: "fill" },
};
