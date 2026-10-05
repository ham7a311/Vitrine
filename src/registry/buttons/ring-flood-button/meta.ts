import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ring-flood-button",
  name: "Ring Flood Button",
  category: "buttons",
  description: "A gradient loops slowly around the border; on hover the dark face draws in from every side and the gradient floods the whole button.",
  tags: ["button", "border", "gradient", "conic", "cta", "primary"],
  traits: ["hover", "keyboard", "ambient"],
  source: "original",
  files: ["RingFloodButton.tsx", "ring-flood-button.css"],
  dependencies: [],
  prompt:
    "Build a primary pill button whose border is a conic gradient (frost, lilac, amber, mint) turning slowly around it: register --angle with @property and animate it 0 → 360deg over 8s, linear, forever. The button's own background is the gradient; a ::before 'face' in the page colour sits inset by 1.5px, so only a ring shows. A blurred copy of the gradient under the button (::after, blur 14px, 35% opacity) gives a soft halo.\n\nOn hover or focus the face's inset animates from 1.5px to 50% on every side (520ms ease-in-out) and fades at the end, so the face draws in toward the centre and the gradient floods the whole button; the label crosses from cream to ink as the gradient arrives, and the halo brightens. Leaving reverses it. Press scales to 0.97. Reduced motion stops the turning and replaces the flood with a crossfade.",
  interaction: "Hover or focus to flood the button with its border's gradient.",
  animation: "Border gradient turns once every 8s; the flood is 520ms ease-in-out; label colour follows 160ms later.",
  a11y: "A real button whose label is its text; the label colour changes with the fill so contrast holds in both states. Focus does exactly what hover does and adds an outline. Reduced motion stops the loop.",
  responsive: "Intrinsic width from its label.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --rfb-face #121015; --rfb-ink #efe8dc; --rfb-ink-on #141216; --rfb-ring conic-gradient(from var(--rfb-a), #b9cce4, #c8b9ea, #f0b37a, #7fd1a8, #b9cce4). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --rfb-face #fbfaf6; --rfb-ink #1b1a17; --rfb-ink-on #ffffff; --rfb-ring conic-gradient(from var(--rfb-a), #2f5fd0, #7c5cc4, #d9733a, #1f7a4d, #2f5fd0). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
