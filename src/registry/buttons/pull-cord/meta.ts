import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "pull-cord",
  name: "Pull Cord",
  category: "buttons",
  description: "A theme switch that works like a light cord: pull the handle down until it clicks and the lights change, then it springs back up and sways until it settles.",
  tags: ["toggle", "switch", "theme", "dark mode", "drag", "spring", "physics"],
  traits: ["click", "touch", "keyboard"],
  source: "original",
  files: ["PullCord.tsx", "pull-cord.css"],
  dependencies: [],
  prompt:
    "Build a dark-mode switch as a pull cord in SVG: a small ceiling mount, a cord drawn as a quadratic path from the mount to a brass teardrop handle, and a faint dashed highlight along the cord for twist. The handle is the switch (role=switch, aria-checked, focusable, with a focus ring).\n\nDragging the handle down stretches the cord 1:1 up to 64px, then with 20% resistance; sideways movement sways the handle (half the pointer offset, ±26px), bowing the cord toward it and tilting the handle. At 34px of pull the switch clicks — the theme flips immediately, mid-pull, and a ring pulses off the handle — exactly once per pull. Releasing hands the stretch and sway to two damped springs in requestAnimationFrame (stretch stiff, sway loose), so the handle snaps up, bounces and keeps swinging gently before it comes to rest.\n\nA click without dragging, Space or Enter performs a full pull by itself (180ms down, then the springs). Reduced motion flips without the pull or the bounce. Controlled (checked/onChange) or uncontrolled.",
  interaction: "Drag the handle down until it clicks, or click it. Space and Enter pull it too.",
  animation: "Drag follows the pointer; release runs two damped springs (stretch k=320, sway k=60); the click pulse is 520ms.",
  a11y: "A real switch: role=switch with aria-checked and a label ('Lights off'), focusable with a visible ring, operable with Space and Enter. The theme changes on the click, not the release, so it never depends on the animation finishing. Reduced motion flips instantly.",
  responsive: "Fixed 64px wide; its length is a prop. Touch-action is disabled on the handle so dragging doesn't scroll.",
  touchFallback: "Drag with a finger, or tap to pull it once.",
  variants: [
    { id: "paper", label: "Lights on", prompt: "Starts with the lights on: a warm paper reading room (#f3efe6, ink #1b1a17) under a soft lamp pool; pulling switches to dark." },
    { id: "night", label: "Lights off", prompt: "Starts with the lights off: a dark room (#0e0d10, cream text #efe8dc) with no lamp pool; pulling switches to light." },
  ],
  preview: { bg: "#f3efe6", mode: "fill" },
};
