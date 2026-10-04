import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "glass-lens-switch",
  name: "Glass Lens Switch",
  category: "buttons",
  description: "A segmented control whose selection is a drop of liquid glass: it slides on a spring, stretching as it moves, and magnifies whatever passes under it. You can drag it, too.",
  tags: ["segmented control", "toggle", "glass", "liquid glass", "spring", "magnifier", "radio"],
  traits: ["click", "keyboard", "cursor", "touch"],
  source: "original",
  files: ["GlassLensSwitch.tsx", "glass-lens-switch.css"],
  dependencies: [],
  prompt:
    "Build a frosted segmented control (Day / Week / Month / Year) where the selection indicator is a glass lens. Measure each option's offsetLeft and width. Drive the lens's x and width with a spring (k 520, damping 30) in a requestAnimationFrame loop that stops when settled; while moving, stretch it by its speed (scaleX up to 1.24, scaleY down to 0.86), so it reads as liquid and wobbles slightly on arrival.\n\nThe lens is frosted (backdrop blur 6px, saturate, brightness) so the label under it goes soft, and it contains a second, sharp copy of the whole row of labels, translated by −x so it lines up with the track and scaled 1.14 about the lens's centre. The words under the lens are magnified and brightened, and they swell as the lens slides across. Inner highlights and a soft shadow make it glass.\n\nOptions are a radiogroup with roving tabindex; arrows, Home and End move and select. Press on the lens and drag past 4px to slide it by hand (pointer capture); on release it snaps to the nearest option and selects it.",
  interaction: "Click or use the arrow keys to move the lens; or grab it and drag, and it snaps to the nearest option.",
  animation: "Spring k 520 / c 30, with velocity-based squash and stretch; settles in about 400ms.",
  a11y: "A labelled radiogroup of real buttons with aria-checked and roving tabindex; the lens and its magnified copy are aria-hidden. Dragging is an extra; every option is reachable by click and keyboard. Reduced motion moves the lens instantly.",
  responsive: "Intrinsic width; re-measured on resize so the lens always sits on its option.",
  touchFallback: "Tap an option, or drag the lens with a finger; vertical scrolling still works.",
  variants: [
    { id: "night", label: "Night" },
    { id: "paper", label: "Paper" },
  ],
  preview: { bg: "#0b1220", mode: "fill" },
};
