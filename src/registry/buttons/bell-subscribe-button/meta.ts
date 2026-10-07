import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "bell-subscribe-button",
  name: "Bell Subscribe Button",
  category: "buttons",
  description: "A chunky outlined pill on a hard black shadow with a bell in a coloured disc: hover lifts it and rings the bell, pressing sinks it into its shadow, and clicking toggles subscribed, rolling the label and inverting the disc.",
  tags: ["button", "subscribe", "bell", "toggle", "neubrutalism", "brutalist", "outline", "shadow", "notification"],
  traits: ["click", "hover"],
  source: "original",
  files: ["BellSubscribeButton.tsx", "subscribe.ts", "bell-subscribe-button.css"],
  dependencies: [],
  prompt: `Build a neo-brutalist subscribe toggle (React + CSS, no libraries): an off-white pill with a thick black outline sitting on a hard black shadow, with a bell inside a coloured disc at its right end.

Structure: the <button> itself is the shadow (a black pill, translated 0.3em right and 0.4em down); inside it a face span carries everything and is translated back by the same amount, so the face can travel exactly into its shadow. Geometry in em, default font-size 20px: face height 4.4em, padding 0 0.7em 0 1.45em, 0.14em black outline, background #f1efe9, gap 2em between label and disc.

Label "Subscribe" in Archivo at width 125 (font-stretch 125%, wdth 125), weight 700, 1.12em, letter-spacing 0.015em, black. It shares a clipped grid cell with "Subscribed": the off label slides up and out while the on label slides up into place (0.45s ease-out).

Disc: 2.95em circle, 0.14em black outline, filled with the accent colour, holding a solid black bell (1.75em) rotated 38°, with a knob, a clapper and four short ringing arcs around it.

Behaviour: hover lifts the face a little further from its shadow (1.25× and 1.2× the offset, springy) and rings the bell (rotate −16°, +14°, −9°, +5° about its top over 0.8s) while the arcs flicker. Press drops the face onto the shadow (translate 0) in 0.08s. Click toggles aria-pressed; when on, the disc fills black and the bell and arcs turn the accent colour. A polite live region announces "Subscribed…" or "Unsubscribed." only after a real toggle. Works controlled (subscribed + onChange) or uncontrolled (defaultSubscribed). Focus-visible draws a black outline offset 0.3em. Reduced motion removes the slides and the ring. Props: accent, subscribed, defaultSubscribed, onChange, labels {off, on}, size, plus native button props.`,
  interaction: "Hover lifts the pill and rings the bell; pressing sinks the face into its shadow; clicking toggles between Subscribe and Subscribed, inverting the disc. Keyboard: Space or Enter.",
  animation: "Lift 0.22s with a springy overshoot; press 0.08s; label roll 0.45s; bell ring 0.8s; disc inversion 0.3s.",
  a11y: "A native toggle button with aria-pressed; only the current label is exposed (the other is aria-hidden). A polite status line announces the change after a real toggle. Black on off-white is above 15:1. Visible focus outline. Reduced motion removes the roll and the ring.",
  responsive: "Sized in em from one font-size; at 20px it is about 320px wide. Pass a smaller size for compact layouts.",
  touchFallback: "No hover on touch; the press still sinks the face into its shadow and the toggle works the same.",
  isNew: true,
  variants: [
    { id: "peach", label: "Peach", prompt: "Disc #f4c1a8 on a periwinkle #7b6ff0 page." },
    { id: "mint", label: "Mint", prompt: "Disc #bfe9cf on a deep teal #2f6b5e page." },
    { id: "lemon", label: "Lemon", prompt: "Disc #f6e27a on a tangerine #ff7a59 page." },
  ],
  preview: { bg: "#7b6ff0", mode: "center", height: 260 },
};
