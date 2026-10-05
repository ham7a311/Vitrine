import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "entry-point-cta",
  name: "Entry Point CTA",
  category: "ctas",
  description: "A closing banner that is one big link: colour blooms from the exact point your cursor came in and drains toward where you leave, and the huge headline inverts precisely along the circle.",
  tags: ["cta", "section", "closing", "footer", "agency", "direction-aware", "clip-path"],
  traits: ["hover", "cursor", "keyboard", "touch"],
  source: "original",
  files: ["EntryPointCta.tsx", "entry-point-cta.css"],
  dependencies: [],
  prompt:
    "Build an agency-style closing banner (max 72rem, 32px radius, hairline ring) that is a single link: a mono eyebrow, a large round arrow in the top-right, an oversized headline ('Have a project? Let's talk.', clamp 2.75–8rem, line-height 0.95, −0.05em) and a ruled row of contact details.\n\nRender the content twice in identical boxes: once on the banner, once in a full-size fill layer (lilac on night, terracotta on paper) whose colour variables are inverted. Clip the fill with clip-path: circle(0% at var(--ex) var(--ey)). On pointerenter, write the entry point to --ex/--ey and open to 150% over 1s on an expo-out curve; on pointerleave, move the point to the exit and close on an ease-in curve (640ms). Because both copies line up, the giant letters invert exactly along the sweeping edge. The arrow turns 45° while open. Focus blooms from the centre; touch from the finger.",
  interaction: "Move onto the banner from any side and colour blooms from there; leave and it drains to the exit. The whole banner is the link.",
  animation: "Bloom 1s expo-out; drain 640ms ease-in; arrow turns over 700ms.",
  a11y: "One real link containing the headline and details, read once (the inverted copy is aria-hidden). Focus shows the filled state and an outline. Reduced motion makes the bloom instant.",
  responsive: "Type and padding scale with clamp(); details wrap onto separate lines on phones.",
  touchFallback: "Colour blooms from your finger on press.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --ep-card #141217; --ep-fill #c8b9ea; --ep-fill-ink #150f1d; --ep-fill-line rgb(21 15 29 / 0.2); --ep-fill-muted rgb(21 15 29 / 0.7); --ep-focus #c8b9ea; --ep-ink #efe8dc; --ep-line rgb(239 232 220 / 0.14); --ep-muted #9c96a1; --ep-page #0b0a0d. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --ep-card #fffdf8; --ep-fill #a8432f; --ep-fill-ink #fdf3ea; --ep-fill-line rgb(253 243 234 / 0.28); --ep-fill-muted rgb(253 243 234 / 0.78); --ep-focus #2f5fd0; --ep-ink #1b1a17; --ep-line rgb(27 26 23 / 0.12); --ep-muted #6f6a62; --ep-page #f3f1ec. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
