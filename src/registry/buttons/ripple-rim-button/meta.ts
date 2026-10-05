import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ripple-rim-button",
  name: "Ripple Rim Button",
  category: "buttons",
  description: "A nudge you can see go out: pressing sends a wave from the spot you touched running both ways round the button's rim, fading as it travels.",
  tags: ["button", "border", "ripple", "wave", "svg", "notification", "ping"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["RippleRimButton.tsx", "ripple-rim-button.css"],
  dependencies: [],
  prompt:
    "Build a 'Nudge Hamza' button whose outline is an SVG path of a pill, sampled every ~3px from the measured size, with an outward normal at each sample. At rest it's a face with a 1.5px frost rim.\n\nOn press, find the rim sample nearest the pointer (from the keyboard, use the top centre) and run a wave from it both ways round the rim: each frame, displace every sample along its normal by amp · gaussian((distance round the rim − front) / width) · cos(phase), where the front moves at the rim's length per 0.9s and amp decays from 5.5px with a 0.42s time constant. After 1.4s it settles back to the plain outline. At the same time the label becomes '✓ Nudged' in green and the rim turns green for 2.4s, announced politely. Reduced motion skips the wave but keeps the confirmation.",
  interaction: "Press to nudge; a wave runs round the rim from where you pressed.",
  animation: "Wave travels round the rim in 0.9s with exponential decay; done state holds 2.4s.",
  a11y: "A real button; the label change is in an aria-live region. Keyboard presses start the wave from the top. Reduced motion removes the wave.",
  responsive: "The rim is resampled from the measured size, so any label fits.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --rrb-done #7fd1a8; --rrb-face #17151b; --rrb-ink #efe8dc; --rrb-rim #b9cce4. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --rrb-done #1f7a4d; --rrb-face #ffffff; --rrb-ink #1b1a17; --rrb-rim #2f5fd0. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
