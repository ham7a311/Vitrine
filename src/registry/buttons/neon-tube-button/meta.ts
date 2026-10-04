import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "neon-tube-button",
  name: "Neon Tube Button",
  category: "buttons",
  description: "A border made from a bent glass tube with its electrodes meeting underneath: unlit at rest, it strikes, stutters twice and holds when you point at it.",
  tags: ["button", "border", "neon", "glow", "night", "svg", "nightlife"],
  traits: ["hover", "keyboard"],
  source: "original",
  files: ["NeonTubeButton.tsx", "neon-tube-button.css"],
  dependencies: [],
  prompt:
    "Build a pill button whose border is a neon tube, drawn in SVG from the button's measured size. The tube path starts just right of a 14px gap at the bottom centre, runs clockwise round the pill and ends just left of the gap; two small dark rounded caps sit either side of the gap as electrodes.\n\nUnlit, the tube is pale glass: a 4.5px translucent white stroke with a thin highlight just above it, and the label is dim. Lit, three strokes stack on the same path \u2014 a wide blurred bloom in the gas colour, the 4.5px gas stroke with a drop-shadow, and a 1.4px near-white core \u2014 and the label takes the gas colour with a two-layer text glow.\n\nHover or focus lights it with a single 700ms strike animation (on, drop to 15%, back, drop to 25%, then hold at full) applied to both the tube and the label; it never flickers once lit. Pressing whitens the core. Gas colour is a prop. Reduced motion lights it without the flicker.",
  interaction: "Hover or focus to light the tube; press to act.",
  animation: "One 700ms strike sequence on light-up; fades out over 320ms.",
  a11y: "A real button with a text label; the tube is decorative SVG. The lit label stays readable against the dark background. Reduced motion removes the flicker.",
  responsive: "The tube is rebuilt from the button's measured size, so any label fits.",
  variants: [
    { id: "pink", label: "Pink", prompt: "color=\"#ff4fa3\" (pink neon) on radial-gradient(70% 60% at 50% 45%, #1d1820, #0a080b 75%)." },
    { id: "cyan", label: "Cyan", prompt: "color=\"#4fd8ff\" (cyan neon) on the same dark radial backdrop." },
    { id: "amber", label: "Amber", prompt: "color=\"#ffb347\" (amber neon) on the same dark radial backdrop." },
  ],
  preview: { bg: "#0a080b", mode: "fill" },
};
