import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "shackle-lock",
  name: "Shackle Lock",
  category: "micro",
  description: "A private/public switch that behaves like a padlock: the key turns, then the shackle springs up and swings open on its hinge; locking swings it back and it drops home with a click — the body dips and a ring snaps out — while the label rolls to the new word.",
  tags: ["lock", "privacy", "toggle", "switch", "padlock", "visibility", "micro-interaction", "svg", "icon"],
  traits: ["click", "keyboard"],
  source: "original",
  isNew: true,
  files: ["ShackleLock.tsx", "shackle-lock.css"],
  dependencies: [],
  prompt:
    "Build a privacy switch whose icon is a working padlock. Props: locked (controlled), defaultLocked (true), onChange, labels {locked, unlocked} (\"Private\", \"Public\"), name (the accessible name, e.g. \"Keep this board private\"), theme and className.\n\nA 44px pill button with role switch and aria-checked: a 22px padlock icon and a one-line window of words. The padlock is SVG: a shackle (a rounded arch stroke, 2.3px, round caps), a body (a 14.5 × 10.75 rounded rect) and a keyhole (a circle and a slot) cut out in the face colour. Locked, the pill is dark with gold metal; unlocked it turns pale green with green metal, the shackle raised 3px and swung −30° about its right leg (transform-box view-box, origin at the top of the right leg), and the keyhole turned 90°. Colours cross-fade over 320ms.\n\nOpening plays in order: the key turns 90° (200ms), then from 140ms the shackle springs up 4.6px, swings past to −36° and settles at −30° (560ms), while the body jolts (scaleY 0.93). Closing: the shackle swings back to upright and drops 0.8px past home (420ms), the body clicks — squashing to 0.9 and widening to 1.04 — at 250ms, the key turns back, and a thin ring snaps out from the icon and fades. Restart the animations on every press by keying the icon on a counter, and pick open or close keyframes from a data attribute.\n\nThe words roll: both labels are stacked in a column inside a 1.25em window, translated by one line with a springy cubic-bezier (420ms), so the pill keeps the longer word's width. Reduced motion jumps straight to each state.",
  interaction: "Click, tap, Space or Enter to lock and unlock.",
  animation: "Key 200ms; shackle 560ms opening, 420ms closing; click and ring at 250ms; words roll in 420ms. Reduced motion switches instantly.",
  a11y: "A real switch (role switch, aria-checked) with an explicit name; the icon and rolling words are decorative. Contrast holds in both states.",
  responsive: "A fixed 44px pill sized by its longer word.",
  touchFallback: "Tapping toggles it.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --sl-face #1d1b23; --sl-ink #f4f2f8; --sl-key #1d1b23; --sl-line rgba(255, 255, 255, 0.1); --sl-metal #f1c35a; --sl-open-face #133227; --sl-open-ink #b9f3d3; --sl-open-metal #57d39a; --sl-ring #f1c35a. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --sl-face #1d1b23; --sl-ink #f6f4fa; --sl-key #1d1b23; --sl-line rgba(20, 18, 28, 0.08); --sl-metal #f1c35a; --sl-open-face #dff5e9; --sl-open-ink #0e5a37; --sl-open-metal #13804a; --sl-ring #b8860b. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0e0d12", mode: "center", height: 260 },
};
