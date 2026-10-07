import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "pulse-button",
  name: "Live Button",
  category: "buttons",
  description: "An on-air button: a red tag whose dot sends out beating rings, the action, and a ticking count of people watching. Joining turns the play icon into a small bouncing equaliser.",
  tags: ["button", "live", "pulse", "on air", "streaming", "viewers", "broadcast", "recording"],
  traits: ["click", "keyboard", "ambient"],
  source: "original",
  files: ["PulseButton.tsx", "pulse-button.css", "pulse.ts"],
  dependencies: [],
  prompt:
    "Build an on-air 'Watch live' pill button (46px tall, fully rounded, 1px hairline, Inter 500 at 15px).\n\nStructure, left to right: a red 34px 'LIVE' tag (white, 12px, 700, 0.08em tracking, uppercase) holding a white 8px dot with two rings that expand to 3.2× and fade over 2s, the second 1s behind; a play icon and 'Watch live'; then, after a hairline divider, the viewer count in muted tabular figures, compacted (2.4k, 12k, 1.4M) and ticking every couple of seconds. Pressing toggles aria-pressed: the label reads 'Watching' and the play icon becomes three small red equaliser bars bouncing at different speeds (0.7s, 0.9s, 1.1s). Hover tints the edge red and adds a soft red shadow; press scales to 0.97. The count is also in the accessible name ('2.4k watching').\n\nPalette: ink #111111 / #ededed, muted #6b6b6b / #a0a0a0, face #ffffff / #161616, hairline #e2e2e2 / #2c2c2c, red #e11d2e / #ff3b4b, focus ring #2563eb / #6ea8fe (2px, 3px out). Show it centred on a #f6f6f5 / #0a0a0a page.",
  interaction: "A toggle button: Enter or Space joins or leaves; the count keeps ticking either way.",
  animation: "Two rings every 2s from the dot, an equaliser while joined, a 0.2s hover shadow. Reduced motion stops the rings and holds the equaliser still.",
  a11y: "A native button with aria-pressed; the count is spelled out for screen readers; the motion is decorative.",
  responsive: "One fixed-height pill that never wraps its text.",
  touchFallback: "Nothing depends on hover.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --pulb-edge #e2e2e2; --pulb-face #ffffff; --pulb-focus #2563eb; --pulb-ink #111111; --pulb-red #e11d2e; --pulb-soft #6b6b6b. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --pulb-edge #2c2c2c; --pulb-face #161616; --pulb-focus #6ea8fe; --pulb-ink #ededed; --pulb-red #ff3b4b; --pulb-soft #a0a0a0. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f6f6f5", mode: "fill", frame: [900, 400] },
};
