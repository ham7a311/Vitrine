import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "chromatic-button",
  "name": "Chromatic Button",
  "category": "buttons",
  "description": "A terminal-style button that glitches on purpose: the label splits into red and cyan, slices jump sideways, a scanline sweeps down — then it settles.",
  "tags": [
    "button",
    "glitch",
    "chromatic",
    "terminal",
    "retro",
    "rgb split",
    "hover",
    "cyberpunk"
  ],
  "traits": [
    "hover",
    "click",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "ChromaticButton.tsx",
    "chromatic-button.css"
  ],
  "dependencies": [],
  "prompt": "Build a terminal-style button that glitches once on hover. A black face with a faint green border, mono uppercase label with wide tracking, and a permanent fine scanline texture (repeating 1px lines at 3.5%). The label has two pseudo-element copies (content: attr(data-text)) in red (#ff2a6d) and cyan (#05d9e8), screen-blended: on hover or focus they appear 1.5px either side of the label, a steady chromatic split. On entering, the label plays a 420ms stepped glitch — horizontal slices of it (clip-path inset bands) jump left and right a few pixels for a few frames — while the red copy slips further and settles, and a soft green scanline band sweeps down the face once. The border brightens and a green glow appears while you stay; the glitch replays on each entry (two identical keyframes alternate).",
  "interaction": "Hover or focus to trigger the glitch; press to click.",
  "animation": "Glitch 420ms stepped; split settles over 420ms; scanline sweep 700ms; border glow 200ms.",
  "a11y": "The button's accessible name is its label (the visual copies are aria-hidden pseudo-elements). Reduced motion keeps the colour split but removes the glitch and sweep.",
  "responsive": "Sized by its label; works at any width.",
  "touchFallback": "Taps work normally; pointer-only effects are skipped on touch.",
  "preview": {
    "bg": "#0d0d0f",
    "mode": "center"
  },
};
