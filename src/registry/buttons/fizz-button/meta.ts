import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "fizz-button",
  name: "Fizz Button",
  category: "buttons",
  description: "A glass of soda for a button. Point at it and it starts to fizz: bubbles rise from the bottom, thickest under your pointer, swaying as they climb, and now and then one escapes over the rim, hops and pops. A press sends up a burst and the label bobs.",
  tags: ["button", "hover", "bubbles", "soda", "drink", "fizz", "playful", "liquid", "edge"],
  traits: ["hover", "click", "cursor", "keyboard"],
  source: "original",
  files: ["FizzButton.tsx", "fizz-button.css", "fizz.ts"],
  dependencies: [],
  prompt:
    "Build a soda-glass pill button that fizzes. Props: children, drink {top, bottom, bubble, label}, onClick and type.\n\nThe button: a 54px pill filled with a vertical gradient from top to bottom colour, a cold highlight down its left side and a pale band of foam along the top (an overlay gradient), an inset rim, a darker inner shadow at the bottom, and a soft drop shadow in the drink's colour. The label sits above everything with a faint text shadow.\n\nFizz: while hovered, spawn a bubble every 38ms (eight at once on entry). Each bubble's x is drawn from a bell curve centred on the pointer's x (spread three-tenths of the width, or most of it with no pointer) and follows the pointer as it moves; its radius is 1.6–6px (small ones commoner); it rises the full height in a time that shortens as it grows, swaying left and right a few pixels on the way, scaling from 0.4 up and fading in. A bubble is a ring in the bubble colour with a tiny white highlight. Bubbles live in a layer inside the pill, clipped to it. About one in five escapes: when it reaches the rim a twin appears in a layer above the button, hops 10–24px up and pops — a quick scale to 2.2× and fade. Leaving stops the fizz; bubbles already rising finish.\n\nPressing sends a burst of 26 bubbles in quick succession across the whole width, and the label bobs up 3px and settles. Keyboard focus starts the fizz; on touch, a press fizzes for 1.8s. Everything is appended imperatively and animated with the Web Animations API. Reduced motion: no bubbles at all, just the glass.",
  interaction: "Point at the button and it fizzes, thickest under the pointer; press for a burst. Keyboard focus fizzes too.",
  animation: "Bubbles rise in 0.6–1.6s, swaying; escapees hop and pop in about 0.5s; the label bobs over 520ms on press. Reduced motion shows the still glass.",
  a11y: "A real button with its text label; the bubbles are decorative and live in aria-hidden layers with pointer-events none. Every drink keeps the label above 4.5:1 against its liquid.",
  responsive: "The button keeps its size; leave about 36px of room above it for escaping bubbles.",
  touchFallback: "A press bursts and fizzes for 1.8s.",
  variants: [
    { id: "cola", label: "Cola", prompt: "Cola: liquid from #6a321c to #24100a, cream bubbles rgba(255,228,196,0.8), label #fff3e3, on a #f6ece1 ground." },
    { id: "lime", label: "Lime", prompt: "Lime soda: liquid from #c9ef6b to #86b937, white bubbles, a dark green label #1c3306, on a #eef6e2 ground." },
    { id: "berry", label: "Berry", prompt: "Berry soda: liquid from #c93a70 to #861543, pale pink bubbles, a white label, on a #fbe9f0 ground." },
  ],
  preview: { bg: "#f6ece1", mode: "center", height: 360 },
};
