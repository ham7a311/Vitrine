import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "eclipse-toggle",
  name: "Eclipse Toggle",
  category: "controls",
  description: "A day/night switch drawn as a tiny sky: the sun sinks behind the hills as the moon rises, clouds drift out and the stars come on.",
  tags: ["toggle", "switch", "dark mode", "theme", "day night", "css", "sun", "moon"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["EclipseToggle.tsx", "eclipse-toggle.css"],
  dependencies: [],
  prompt: `Build a dark-mode switch (a <button role="switch" aria-checked>, 96×44px, or 132×60 large) drawn as a small landscape, in CSS only. The track is a sky: a blue gradient (#5fb2ff → #bfe3ff) with an inset shadow, with a night gradient (#070d24 → #22305c) layered over it whose opacity crossfades over 700ms. A curved hill sits along the bottom and darkens at night.

The sun is a 34px disc (warm radial gradient, a soft glow ring) at the left. Switching to night it moves right and down behind the hills — a translate of 42% of the width across and 90% of the height down on one cubic-bezier(0.65,0,0.35,1), so it reads as setting along an arc — and fades. At the same time the moon (a pale disc with two crater spots and a shaded edge) rises from behind the hills on the right along the mirrored path. Two clouds (pill shapes with a puff) drift out to the right and fade; seven 2px stars fade in and twinkle on staggered 2.4s loops. Switching back reverses everything. Pressing dips the sky to 97%. Focus shows a ring in sun or moon colour. Controlled or uncontrolled; reduced motion makes every change instant.`,
  interaction: "Click, tap, Space or Enter flips between day and night.",
  animation: "Sun and moon travel 700ms cubic-bezier(0.65,0,0.35,1); sky crossfade 700ms; stars fade in after 200ms and twinkle every 2.4s.",
  a11y: "A real switch: role=\"switch\", aria-checked and a label (\"Dark mode\"); everything inside is decorative and aria-hidden. Reduced motion removes the travel and twinkle.",
  responsive: "Two sizes; everything inside is sized from CSS variables, so it scales cleanly.",
  touchFallback: "Works the same on touch; the press dip gives tap feedback.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f4f1ea", mode: "fill", height: 420 },
};
