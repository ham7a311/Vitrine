import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "thread-stepper",
  name: "Thread Stepper",
  category: "navigation",
  description: "A step indicator drawn as a thread through beads: finishing a step pulls the thread taut to the next, and the current bead pulses.",
  tags: ["stepper", "progress", "navigation", "wizard", "steps", "onboarding"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["ThreadStepper.tsx", "thread-stepper.css"],
  dependencies: [],
  prompt: `Design a horizontal stepper as a thread passing through beads. Steps sit in equal columns; a dotted rail runs from the centre of the first bead to the centre of the last. On top of it a 2px frost-to-lilac thread with a soft glow is revealed by a clip-path whose right inset is driven by a CSS variable for progress (current step ÷ last step), transitioning over 700ms with a symmetric ease — so advancing a step pulls the thread taut to the next bead.

Each bead is a 38px circle button. Todo: hairline border, muted mono number. Current: frost border, cream number, and a slow pulse ring (box-shadow 0 → 10px fade, 2.4s). Done: filled frost with a check that draws itself (stroke-dashoffset) after the thread arrives (500ms delay). Fill/border changes are delayed 200ms so the thread reaches the bead first. Titles and optional hints sit below each bead (hints hide on narrow screens). Completed and current beads are clickable to go back; future ones are disabled. Use an <ol> with aria-current="step" and descriptive aria-labels including state.`,
  interaction: "Advance via your own controls (or click a completed bead to go back); the thread eases to the new position.",
  animation: "Thread 700ms symmetric ease; bead fill 400ms after 200ms; check draw 380ms after 500ms; pulse 2.4s loop.",
  a11y: "Ordered list with aria-current=step on the current bead; each bead's label includes its number, title and state; future steps are disabled. Reduced motion removes delays and the pulse.",
  responsive: "Equal columns; hints hide below 30rem.",
  preview: { bg: "#0b080d", mode: "fill" },
};
