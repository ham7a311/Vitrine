import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "loose-letters",
  name: "Loose Letters",
  category: "text",
  description: "A shop sign whose letter tiles hang from a rail on little strings. Brush past and they swing as damped pendulums, nudging their neighbours; a fast swipe spins one right round its pin. Click and they come off their hooks, fall, bounce and tumble — then climb back up and settle.",
  tags: ["physics", "pendulum", "sign", "letters", "playful", "gravity", "interactive type", "text animation"],
  traits: ["cursor", "click", "touch"],
  source: "original",
  files: ["LooseLetters.tsx", "loose-letters.css"],
  dependencies: [],
  prompt: `Build a hanging shop sign ("OPEN LATE") of letter tiles: each tile (0.86em × 1.06em, rounded, a subtle inset edge and two-step shadow, Newsreader 500) hangs 0.3em below a rail on a 1px string with a pin dot; transform-origin is the pin, so rotating a tile swings it on its string.

Hanging physics (one rAF loop that sleeps when everything is still): each tile is a damped pendulum, ω' = −38·sin θ − 2.4·ω + 6·(neighbour angles − θ), integrated in two substeps; angles wrap past ±π so a hard push spins a tile all the way round. Pointer moves within an ellipse around a tile add its horizontal pointer speed (px/s ÷ 120) to ω, scaled by how low on the tile the pointer is (more lever) and by proximity.

Click (or the Drop button): every tile leaves its hook with its current swing turned into velocity plus random scatter, falls under 2400px/s² gravity, bounces off the floor (restitution 0.32, friction 0.82), topples toward the nearest flat orientation, and is kept inside the walls; strings fade out. When everything is still for 1.3s (or on a second click), tiles climb back to their pins on staggered eased arcs (1.1s), unwinding whole turns the short way, then rehang with a small alternating swing. A Shake button gives keyboard users the push. Themes: paper (cream tiles, ink letters) and night (dark tiles, glowing amber). Reduced motion: a still sign with no controls. The h2 carries the text; tiles are aria-hidden.`,
  interaction: "Brush across the letters to swing them; click to drop them; click again to hang them back up. Shake and Drop buttons do the same from the keyboard.",
  animation: "Pendulum spring (ω² 38, damping 2.4, coupling 6); fall at 2400px/s², restitution 0.32; climb 1.1s staggered.",
  a11y: "The heading carries the words; the tiles are aria-hidden. Shake and Drop are real buttons. Reduced motion shows a still sign.",
  responsive: "Words wrap onto separate rows on narrow screens; pins are re-measured on resize.",
  touchFallback: "Dragging a finger across the letters swings them; tap drops them.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --accent #c2361b; --ink #1f1b16; --muted rgb(31 27 22 / 0.55); --rail #3a3128; --shadow rgb(60 40 20 / 0.22); --string #6b5a44; --tile #fbf6ea; --tile-edge #e3d8c2. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --accent #ffc76b; --ink #ffc76b; --muted rgb(255 240 220 / 0.5); --rail #6a5f52; --shadow rgb(0 0 0 / 0.55); --string #8a7b66; --tile #1a1917; --tile-edge #2b2926. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f3ead8", mode: "fill" },
};
