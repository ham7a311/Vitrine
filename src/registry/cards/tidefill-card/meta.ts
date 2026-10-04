import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "tidefill-card",
  name: "Tidefill Card",
  category: "cards",
  description: "A savings-goal card that fills with water to the share you've saved; everything printed on it inverts exactly along the rolling wave, and adding money raises the tide.",
  tags: ["card", "progress", "goal", "savings", "fintech", "mask", "wave"],
  traits: ["hover", "click", "ambient", "keyboard"],
  source: "original",
  files: ["TidefillCard.tsx", "tidefill-card.css"],
  dependencies: [],
  prompt:
    "Build a savings-goal card (23rem, 24px radius) that is its own progress bar. Register --p (number), --x and --wave-height (lengths) with @property. Measure the card's height with a ResizeObserver into --h; the water's surface sits at --top = (1 − p) × h.\n\nRender the content twice in identical layouts: once on the card and once in a full-size 'water' layer (deep teal on paper, frost on night) whose colour variables are inverted. Mask the water layer with two images: a seamless wave (an SVG data URL, 160px period, repeat-x) sized 160px × --wave-height and positioned at (--x, --top − wave-height), plus a solid gradient sized 100% × (h − top) pinned to the bottom. Animate --x from 0 to 160px every 3.2s so the surface rolls; because the inverted print is inside the masked layer, the words invert exactly along the wave. A paler second swell sits just behind, moving the other way.\n\nHover raises the swell (12 → 20px). 'Add OMR 50' raises --p with a slight overshoot (1.2s, cubic-bezier(0.34,1.32,0.64,1)) while the amount rolls digit by digit (reels keyed from the right, staggered 40ms). At 100% the wave settles flat and the note reads 'Goal reached. Mabrook!'.",
  interaction: "Hover to raise the swell; press Add to put money in and watch the tide rise.",
  animation: "Surface rolls every 3.2s; level change 1.2s with overshoot; digits roll 900ms staggered; swell height 700ms.",
  a11y: "The real content is read once; the water copy is aria-hidden and inert. A progressbar exposes saved / goal as '78% saved', and the remaining amount is announced politely after each addition. The add button disables at the goal. Reduced motion stops the roll and jumps levels.",
  responsive: "Up to 23rem wide; the mask is recomputed from the measured height, so it works at any size.",
  touchFallback: "The swell stays at its resting height; tap Add to raise the tide.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
