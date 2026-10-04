import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "halo-pointer",
  name: "Halo Pointer",
  category: "cursors",
  description: "A crisp arrow with a soft light behind it. The arrow never lags your hand; the halo follows on a spring, stretches along the direction you move, takes the colour of whatever you point at, and throws one faint ring when you click.",
  tags: ["cursor", "pointer", "glow", "halo", "custom cursor", "spring", "light"],
  traits: ["cursor", "click"],
  source: "original",
  files: ["HaloPointer.tsx", "halo-pointer.css"],
  dependencies: [],
  prompt: `Build a scoped custom cursor: a wrapper component whose children get a drawn arrow with a soft coloured halo, without touching the cursor anywhere else on the page.

Scope: the host is position:relative; an aria-hidden, pointer-events:none layer (absolute, inset 0, overflow hidden, contain strict) sits above the children. Only when (hover: hover) and (pointer: fine) matches does the host get data-live, which sets cursor:none on it and every descendant (with !important, so buttons don't bring the hand back). Text fields (input, textarea, select, contenteditable) get cursor:auto back, and the drawn cursor fades out while over them. Pointer coordinates are converted to host-local CSS pixels using the ratio rect.width / offsetWidth, so the cursor stays exactly under the pointer when the host is drawn scaled.

Arrow: a 24px SVG, a short arrowhead (M3 3 L20.4 9.6 L12.5 12.4 L9.6 20.4 Z) with round joins, black fill and a 1.75px white keyline drawn under the fill (paint-order: stroke), a small drop shadow; a light variant swaps them. The svg is offset so its tip is the hotspot. Its translate is written in the pointermove handler itself, never waiting for a frame. It leans up to 8° into horizontal velocity and rights itself, and shrinks to 0.86 while pressed.

Halo: two radial-gradient discs centred on one origin — a 64px bright core (62% → 30% → 9% → transparent of the halo colour, mixed in oklab) and a 148px veil at 4–9% with a faint rim, like light falling off a lamp. No blur filters. It follows on a critically damped spring (k = 300, c = 2√k) in a single rAF loop that sleeps once everything settles and wakes on movement. It stretches along the direction of travel: scaleX = 1 + min(0.85, speed / 2200) with scaleY = 1/√scaleX, rotated to a heading that only updates above 40px/s so it never spins at rest.

Colour: register --hp-c as a <color> with @property and transition it 260ms. Over an element with data-halo="#hex" the halo takes that colour and grows to 1.35× on a spring; pressing tightens it to 0.78× with a brighter, smaller core; release throws one ring (scale 0.25 → 1.25, fading, 620ms) at the release point, restarted by alternating data-pulse a/b between two identical keyframes. On entering the host the halo appears at the entry point instead of sweeping in. Props: color, arrow ("dark" | "light"), motion.`,
  interaction: "Move over the page; point at a route card to tint the light; click to throw a ring. The system caret returns in the email field.",
  animation: "Arrow 1:1 with the pointer. Halo on a critically damped spring with velocity stretch; colour 260ms; grow on a spring; release ring 620ms.",
  a11y: "The drawn cursor is aria-hidden and pointer-events:none; it never takes focus or changes focus styles. Text fields get the system cursor back. Reduced motion (the media query or motion=\"reduced\") keeps the halo locked under the arrow with no stretch, lean or ring.",
  responsive: "Works at any host size; coordinates are corrected for scaled hosts, so it also behaves inside gallery thumbnails.",
  touchFallback: "On touch or coarse pointers nothing is drawn and the system cursor is untouched; the content works as normal.",
  variants: [
    { id: "azure", label: "Azure", prompt: "color=\"#3b82f6\" (azure), arrow=\"dark\", on a white page (#ffffff, ink #111113, muted #6b6b73). Route cards override the halo with their own data-halo colours (#f59e0b, #14b8a6, #8b5cf6)." },
    { id: "ember", label: "Ember", prompt: "color=\"#f97316\" (ember orange), arrow=\"light\" (white fill, dark keyline), on a near-black page (#0d0c0b, ink #f2ede6, muted #9a938a). Route cards override the halo with their own data-halo colours." },
    { id: "paper", label: "Sage", prompt: "color=\"#5b8c6a\" (sage green), arrow=\"dark\", on warm paper (#f4f1ea, ink #1c1b17, muted #76716a). Route cards override the halo with their own data-halo colours." },
  ],
  preview: { bg: "#ffffff", mode: "fill" },
};
