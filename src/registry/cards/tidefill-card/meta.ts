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
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --tfc-accent #a8432f; --tfc-back #4fa39b; --tfc-card #fffdf8; --tfc-focus #2f5fd0; --tfc-ink #1b1a17; --tfc-line rgb(27 26 23 / 0.12); --tfc-muted #6f6a62; --tfc-water #1f6f6b; --tfc-water-accent #ffd9a0; --tfc-water-ink #f3efe4; --tfc-water-line rgb(243 239 228 / 0.28); --tfc-water-muted rgb(243 239 228 / 0.74). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --tfc-accent #f0b37a; --tfc-back #5f7795; --tfc-card #141217; --tfc-focus #b9cce4; --tfc-ink #efe8dc; --tfc-line rgb(239 232 220 / 0.12); --tfc-muted #9c96a1; --tfc-water #b9cce4; --tfc-water-accent #2f4f86; --tfc-water-ink #0e1420; --tfc-water-line rgb(14 20 32 / 0.22); --tfc-water-muted rgb(14 20 32 / 0.7). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
