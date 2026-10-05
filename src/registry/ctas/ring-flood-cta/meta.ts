import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ring-flood-cta",
  name: "Ring Flood CTA",
  category: "ctas",
  description: "A closing banner framed by a slowly turning gradient; point at the main action and the gradient floods out of the button across the whole banner, turning every word to ink as it arrives.",
  tags: ["cta", "section", "closing", "gradient", "conic", "border", "mask"],
  traits: ["hover", "keyboard", "ambient"],
  source: "original",
  files: ["RingFloodCta.tsx", "ring-flood-cta.css"],
  dependencies: [],
  prompt:
    "Build a closing CTA banner (max 64rem, 32px radius) whose own background is a conic gradient (frost, lilac, amber, mint on night; cobalt, violet, orange, green on paper) turning every 12s through an @property angle. A face in the surface colour sits inset 1.5px, so at rest the banner shows only a thin gradient ring. A heavily blurred copy of the gradient sits under the face, so when the face opens the colour is soft and has no pinch at the conic's centre.\n\nMask the face with radial-gradient(circle at X Y, transparent R, black R + 70px): a soft-edged hole. On hover or focus of the primary button, measure the button's centre relative to the banner and the distance to the farthest corner, then animate R (an @property length) from 0 to that distance over 1s, ease-in-out. The gradient floods out of the button to the corners with a soft tide line. Text crosses to ink as it arrives (colour transitions delayed 240ms); the primary button turns dark so it still stands out on the colour. On leave R closes back into the button on an ease-in curve.\n\nContent: a mono eyebrow, a large balanced headline (clamp 2–3.75rem, −0.04em), a muted paragraph, a pill button with an arrow that nudges right, a quiet underlined secondary link, and a small note.",
  interaction: "Hover or focus the main button to flood the banner with its frame's gradient; leave to drain it back in.",
  animation: "Gradient turns every 12s; flood opens in 1s ease-in-out and closes in 700ms ease-in; text colour follows 240ms later.",
  a11y: "A section with a real heading and real links. The flood is triggered by focus as well as hover, and text colour changes with the fill so contrast holds both ways. Reduced motion stops the loop and crossfades the flood.",
  responsive: "Fluid type and padding with clamp(); actions wrap and centre on phones.",
  touchFallback: "No flood on touch; the ring and a solid button carry the section.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --rf-btn #efe8dc; --rf-btn-ink #141216; --rf-face #121015; --rf-ink #efe8dc; --rf-muted #9c96a1; --rf-on #141216; --rf-on-btn #efe8dc; --rf-on-muted rgb(20 18 22 / 0.72); --rf-page #0b0a0d; --rf-ring conic-gradient(from var(--rf-a) at 50% 50%, #b9cce4, #c8b9ea, #f0b37a, #7fd1a8, #b9cce4); --rf-tone rgb(255 255 255 / 0.06). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --rf-btn #1b1a17; --rf-btn-ink #fffdf8; --rf-face #fffdf8; --rf-ink #1b1a17; --rf-muted #6f6a62; --rf-on #1b1a17; --rf-on-btn #fffdf8; --rf-on-muted rgb(27 26 23 / 0.74); --rf-page #f3f1ec; --rf-ring conic-gradient(from var(--rf-a) at 50% 50%, #2f5fd0, #7c5cc4, #d9733a, #1f7a4d, #2f5fd0); --rf-tone rgb(255 253 248 / 0.6). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
