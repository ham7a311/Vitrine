import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "punch-check",
  name: "Punch Check",
  category: "controls",
  description: "Checkboxes on a ticket: checking one punches it — the paper squashes, a clean hole opens and the chad drops out and tumbles away.",
  tags: ["checkbox", "check", "ticket", "punch", "form", "add-ons", "css", "playful"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["PunchCheck.tsx", "punch-check.css"],
  dependencies: [],
  prompt: `Build checkboxes that are punched like a paper ticket, with a real (visually hidden) <input type="checkbox"> inside each row's <label>. The ticket is a cream card (12px radius, soft shadow) with a dashed-perforation stub on the left carrying a vertical mono code, an Instrument Serif title, and rows separated by hairlines: an option name, a small mono price hint, and at the right a 26px punch spot drawn as a dashed circle.

Checking: the spot squashes (scale 0.86 → 1, 220ms) as if under the punch, the dashed guide fades, a dark hole with an inset shadow and a light lower lip pops open (scale 0 → 1 on a springy curve) — the page colour shows through it — and a paper chad (a small disc in the ticket colour) drops out: translate down 150px with its own sideways drift, spinning 280–540deg and flattening (scaleY → 0.35, as if tumbling edge-on) while it fades, over 900ms with a gravity-like ease. Drift and spin come from a seed per row, so no two fall alike. Unchecking flies the chad back up into the hole (420ms, ease-out) and the hole closes under it. The chad element is re-keyed per change so its animation replays. Focus shows a ring round the spot.`,
  interaction: "Click or tap a row, or press Space when it's focused, to punch it; again to put the chad back.",
  animation: "Squash 220ms; hole 120ms springy; chad fall 900ms with drift and spin; return 420ms.",
  a11y: "Native checkboxes inside a fieldset with a legend (the ticket title); every row is its label. Decorative parts are aria-hidden. Reduced motion shows the hole without the falling chad.",
  responsive: "The ticket is min(100%, 30rem); labels wrap beside the fixed punch spot.",
  touchFallback: "Tap anywhere on a row to punch it.",
  variants: [
    { id: "night", label: "Night" },
    { id: "paper", label: "Paper" },
  ],
  preview: { bg: "#1c1a17", mode: "fill", height: 480 },
};
