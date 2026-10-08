import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "thought-dots",
  name: "Thought Dots",
  category: "ai",
  description: "The small mark beside an assistant that's thinking, in six designs that each move their own way: dots orbiting a tilted ring with depth, a chase that bunches and spreads, a wave that squashes as it lands, a ring that gathers in with a twist, two dots swinging past each other, and a spiral that unwinds. Pure CSS, sized by the text around it, paused off screen.",
  tags: ["ai", "thinking", "loading", "typing indicator", "dots", "status", "assistant", "chat", "spinner", "indicator"],
  traits: ["ambient"],
  source: "original",
  isNew: true,
  files: ["ThoughtDots.tsx", "thought-dots.css"],
  dependencies: [],
  prompt:
    "Build a thinking indicator for an AI assistant: a small glyph of dots beside a label ('Thinking', or what it's thinking about), sized in em so it follows the surrounding text and coloured by the text colour (or a `color` prop). Six designs, chosen with a `design` prop, all in CSS with no JavaScript animation:\n\n- Orbit: three dots of falling size on a ring tilted −14°, traced by two ease-in-out swings a quarter-turn apart (x ±0.62em, y ±0.22em). As each dot comes to the front it grows (0.62 → 1.12) and brightens (45% → 100%), so the ring has depth.\n- Chase: eight dots rotating round a 0.5em ring on cubic-bezier(.55,.1,.3,1), each 55ms behind the last and a little smaller and fainter, so the easing bunches them up and lets them spread.\n- Wave: three dots in a row hop in turn (140ms apart), stretching as they rise and squashing (1.28 × 0.7) as they land.\n- Gather: a ring of six draws in to 0.1em while turning 120°, shrinking to 55%, then lets go — one 1.7s breath.\n- Pendulum: two dots hang from one point 0.7em above them and swing ±50° in opposite directions, passing each other at the bottom; the second is smaller and fainter.\n- Spiral: seven dots are born at the centre and unwind outward — each turns 540° while moving out to 0.64em, fading in and out — staggered evenly so the spiral is always full.\n\nAn optional elapsed counter ('· 4s') follows the label. It's a status region labelled by its text. It pauses its animations off screen (IntersectionObserver) and in hidden tabs, and under reduced motion each design holds one recognisable still pose (the orbit's three dots on their ring, the chase's dots in an arc, the wave's middle dot raised, and so on).",
  interaction: "Nothing to operate: it shows that the assistant is working. Choose a design with the `design` prop.",
  animation: "Orbit 1.8s, chase 1.5s, wave 1.25s, gather 1.7s, pendulum 2.2s (±50°), spiral 2.4s, all looping; paused off screen and in hidden tabs. Reduced motion: a still pose per design.",
  a11y: "A status region labelled with its text ('Thinking' by default); the dots are hidden from assistive technology.",
  responsive: "Sized in em: it scales with whatever text it sits in, from a 13px chat line to a 24px heading.",
  touchFallback: "No interaction.",
  variants: [
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --thdt-ink #ececec; --thdt-muted #8c8c8c. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --thdt-ink #1a1a1a; --thdt-muted #6b6b6b. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0b0b0b", mode: "fill", frame: [1200, 800] },
};
