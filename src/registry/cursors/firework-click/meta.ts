import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "firework-click",
  name: "Firework Click",
  category: "cursors",
  description: "The ordinary arrow, untouched — every click launches a tiny firework: a shell climbs from the click on a fading trail, bursts into a ring of sparks that arc and fall with trails of their own, and crackles out. Hold before letting go and it climbs higher and bursts bigger, with a second ring inside.",
  tags: ["cursor", "click", "fireworks", "celebration", "night", "burst", "canvas", "delight", "particles"],
  traits: ["cursor", "click", "canvas", "keyboard"],
  source: "original",
  isNew: true,
  promptAllow: ["night"],
  files: ["FireworkClick.tsx", "firework-click.css", "burst.ts", "layer.ts"],
  dependencies: [],
  prompt:
    "Build a wrapper that turns clicks into tiny fireworks while leaving the normal cursor alone. Props: children, sky (one of two palettes), global (listen on the whole window with a fixed full-screen canvas), motion, className and style.\n\nThe layer (a small module): a canvas over the host with pointer-events none, sized by a ResizeObserver at DPR ≤ 2, in host-local coordinates corrected for a scaled host. pointerdown on the main button starts a hold; past 120ms a ring arc grows round the press point and fills over 650ms; pointerup releases with a power from 1 to 2.2. A click with detail 0 (keyboard activation) launches from the middle of that element. The loop runs only while something moves.\n\nParticles (pure functions): seeded randomness, a spray of velocities spread evenly round a circle with jitter, and one step with exponential drag, gravity and age.\n\nThe launch: a small ring puffs at the click and a shell rises at 330 × √power px/s against gravity (520px/s², light drag), keeping a 10-point trail. Near its apex (rising slower than 50px/s, or after 0.5–0.76s) it bursts: a ring of 28 × power sparks at 160–240 × √power px/s plus a tighter inner ring in a second colour (14 sparks when held, 9 otherwise) and a flash ring. Sparks fall under light gravity (150px/s²) and drag, each drawing a 7-point fading trail, and in the last 40% of their life they crackle — flickering at random — and fade. Each shell takes the next pair of colours in the palette. On a dark sky everything draws additively with a 6px glow; on a light sky it draws plainly in deeper colours. Reduced motion replaces the firework with one soft ring that fades in 600ms.",
  interaction: "Click anywhere to launch a firework from that point; hold before releasing for a higher, bigger one. Keyboard activation launches from the element's centre.",
  animation: "The shell climbs for about half a second; sparks fall and crackle out over 0.9–1.25s. Reduced motion shows a single fading ring.",
  a11y: "The native cursor and every control are untouched; the canvas is aria-hidden and ignores the pointer. Keyboard clicks get the effect too.",
  responsive: "The canvas follows the host's size; with global it covers the window. Leave room above where people click for the climb.",
  touchFallback: "Taps launch too; a long press charges a bigger one.",
  variants: [
    { id: "night", label: "Night", prompt: "A night sky gradient (#060914 to #121a33) with glowing additive shells in gold, rose, sky blue, violet and mint, each with a pale second colour." },
    { id: "daylight", label: "Daylight", prompt: "A pale day sky #eef3f8 with fireworks in deep red, blue, green and violet paired with orange or pink, drawn plainly with dark trails." },
  ],
  preview: { bg: "#0b1022", mode: "fill" },
};
