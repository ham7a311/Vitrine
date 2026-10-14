import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "petal-click",
  name: "Petal Click",
  category: "cursors",
  description: "The ordinary arrow, untouched — every click shakes loose a few petals that pop out from the click and then drift down, swaying, rocking and turning over as they fall. Cherry blossom with pale hearts, or autumn leaves with a vein down the middle. Hold before letting go for a bigger flurry.",
  tags: ["cursor", "click", "petals", "blossom", "leaves", "seasonal", "nature", "canvas", "calm", "particles"],
  traits: ["cursor", "click", "canvas", "keyboard"],
  source: "original",
  isNew: true,
  files: ["PetalClick.tsx", "petal-click.css", "burst.ts", "layer.ts"],
  dependencies: [],
  prompt:
    "Build a wrapper that turns clicks into falling petals while leaving the normal cursor alone. Props: children, season (blossom or leaves), global (listen on the whole window with a fixed full-screen canvas), motion, className and style.\n\nThe layer (a small module): a canvas over the host with pointer-events none, sized by a ResizeObserver at DPR ≤ 2, in host-local coordinates corrected for a scaled host. pointerdown on the main button starts a hold; past 120ms a ring arc grows round the press point and fills over 650ms; pointerup releases with a power from 1 to 2.2. A click with detail 0 (keyboard activation) releases from the middle of that element. The loop runs only while something moves.\n\nParticles (pure functions): seeded randomness, a spray of velocities spread evenly across an arc with jitter, and one step with exponential drag, gravity and a sideways sway.\n\nThe flurry: 8 × power + 2 petals popped upwards across a 200° arc at 110–230 × √power px/s. Strong drag (1.9/s) and light gravity (95px/s²) make them settle to a slow fall of about 50px/s, swaying 34px/s side to side and rocking (their spin follows a cosine of their phase). Each turns over as it falls — scaled horizontally by the cosine of a phase, showing its pale back when turned away. Cherry petals are a notched teardrop (two bezier curves meeting at a small notch) with a pale heart near the base; leaves are a pointed oval with a thin dark vein. They live 1.8–2.7s, fading in quickly and out over the last quarter. Reduced motion replaces the flurry with one soft ring that fades in 600ms.",
  interaction: "Click anywhere for a few petals; hold before releasing for a bigger flurry. Keyboard activation releases them from the element's centre.",
  animation: "Petals pop out, then sway down at about 50px/s for 1.8–2.7s. Reduced motion shows a single fading ring.",
  a11y: "The native cursor and every control are untouched; the canvas is aria-hidden and ignores the pointer. Keyboard clicks get the effect too.",
  responsive: "The canvas follows the host's size; with global it covers the window.",
  touchFallback: "Taps release petals too; a long press charges a bigger flurry.",
  variants: [
    { id: "sakura", label: "Sakura", prompt: "Cherry blossom petals in soft pinks (#f9a8c0, #f48fb0, #ec7aa0, #fbb6ca), 7–10.5px, with pale backs and hearts, on a blush #fdf4f6 page with a serif headline." },
    { id: "autumn", label: "Autumn", prompt: "Autumn leaves in burnt orange, brick red, ochre and brown (#d9541e, #b8321f, #e2a02a, #8f4a1f) with lighter backs and a dark vein, on a parchment #f6efe4 page." },
  ],
  preview: { bg: "#fdf4f6", mode: "fill" },
};
