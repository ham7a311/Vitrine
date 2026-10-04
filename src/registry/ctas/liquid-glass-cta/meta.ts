import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "liquid-glass-cta",
  name: "Liquid Glass CTA",
  category: "ctas",
  description: "A newsletter sign-up held in a capsule of glass over slow drifting colour; the rim bends the colour behind it and catches the light at your pointer, and signing up squashes it like a drop.",
  tags: ["cta", "section", "newsletter", "form", "glass", "liquid glass", "refraction", "aurora"],
  traits: ["cursor", "click", "keyboard", "ambient"],
  source: "original",
  files: ["LiquidGlassCta.tsx", "liquid-glass-cta.css"],
  dependencies: [],
  prompt:
    "Build a closing newsletter section over a slow aurora: four big blurred blobs (blur 60px) drifting on unrelated 17–27s loops, plus faint vertical hairlines so refraction is visible. Centre a mono eyebrow, a balanced headline and a short line, then a capsule form (30rem, fully rounded) made of glass: a faint white gradient, backdrop blur and saturation, an inner top highlight, an inner ring and a soft lower glow.\n\nIn Chromium, add edge refraction: measure the capsule and build an SVG displacement map at its exact size (red left→right and blue top→bottom gradients blended with difference, and a neutral grey pill inset 16px and blurred), then apply backdrop-filter: url(#lens) blur(2px) saturate(1.6) via feImage + feDisplacementMap (scale −48). A 1.25px rim, made with a content-box mask, carries a radial highlight positioned at the pointer.\n\nInside: a transparent email input and a solid white pill button. Validate on submit with plain sentences ('That doesn't look like an email address…'). On success, the capsule squashes like a drop (1.05 × 0.86, springing back over 700ms) while the fields fade up and out and a single confirmation line fades in: 'You're in. The first letter reaches you@… on Sunday.'",
  interaction: "Move over the capsule and its rim catches the light where you are. Type an email and subscribe; errors are explained in a sentence.",
  animation: "Aurora drifts on 17–27s loops; success squish 700ms spring; fields and confirmation crossfade 420ms.",
  a11y: "A labelled email field with autocomplete, aria-invalid and a polite message line that carries hints, errors and the confirmation. The submitted fields become inert. Reduced motion stops the aurora and the squish.",
  responsive: "The capsule shrinks to the column; the lens map is rebuilt for every size; the button tightens on small phones.",
  touchFallback: "The rim highlight rests at the top-left; everything else works by tap.",
  variants: [
    { id: "dusk", label: "Dusk", prompt: "palette=\"dusk\": aurora blobs of coral #ff7a59, violet #8b5cf6, gold #f5c26b and pink #e0457b over #120b1c." },
    { id: "lagoon", label: "Lagoon", prompt: "palette=\"lagoon\": aurora blobs of teal #14b8a6, blue #3b82f6, lime #a3e635 and cyan #22d3ee over #06141c." },
  ],
  preview: { bg: "#120b1c", mode: "fill" },
};
