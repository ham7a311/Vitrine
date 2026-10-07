import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "spectrum-ring-button",
  name: "Spectrum Ring Button",
  category: "buttons",
  description: "A dark graphite pill whose icon sits in a well circled by broken, iridescent light under a fixed flare, as if a prism ring were catching a lamp overhead; the colours turn slowly and quicken on hover.",
  tags: ["button", "navigation", "iridescent", "rainbow", "ring", "glow", "dark", "pill", "icon"],
  traits: ["hover", "ambient"],
  source: "original",
  files: ["SpectrumRingButton.tsx", "ring.ts", "spectrum-ring-button.css"],
  dependencies: [],
  prompt: `Build a dark pill button (or link) with an iridescent ring round its icon (React + CSS, no libraries).

Pill: height 5.5em (16px base), padding 0 2.4em 0 0.62em, gap 1.35em, a 0.42em translucent white bezel (border-box gradient 10% → 3%) round a graphite body (#262628 → #19191b), an inner top highlight and a deep drop shadow. The label ("Home") is white Inter 500 at 1.7em.

Icon well (4.25em): a dark disc (3.55em, radial #3a3a3e → #1f1f22, hairline, soft inner light) holding a glossy silver house icon (2.5em) (a white-to-grey diagonal gradient fill, small drop shadow). Round it, the ring: a conic gradient through the ring colours (blue, white, amber, red, violet, sky, green, gold, pink), broken by short near-black gaps after every third colour, masked to a 0.33em band, saturated and lifted. A second conic, turning the other way at 0.45×, shades two arcs of the ring nearly black so the light pools in a few places; a blurred copy of the ring behind it makes a soft coloured glow. Over it, fine spectral striations: a repeating conic gradient of thin red, yellow, green and blue bands every 22°, screen-blended at 55%, turning the other way at 1.6×. On top, fixed at 12 o'clock, a flare: a white-hot ellipse fading to a warm colour with a soft warm halo bleeding outward.

Motion: the ring's start angle (an @property angle on the button) turns 360° every 14s and every 4.5s on hover; the flare brightens and swells 12% on hover; press scales to 0.97. Focus-visible draws a white outline. Reduced motion stops the turning. Renders an <a> when given href, otherwise a <button>. Props: label, icon, ring (colours), flare, size, plus native props.`,
  interaction: "Hover speeds the ring and brightens the flare; press scales the pill slightly. Works as a native link or button.",
  animation: "Ring turns once per 14s (4.5s on hover) with striations counter-turning; flare eases over 0.4s; press 0.3s.",
  a11y: "A native link or button named by its label; the ring, striations and flare are aria-hidden and the icon is decorative. White on graphite is above 15:1. Visible focus outline. Reduced motion stops the turning.",
  responsive: "Sized in em from one font-size; at 16px it is about 15em wide, so it fits a phone. Pass a smaller size for dense nav rails.",
  touchFallback: "No hover on touch; the ring keeps turning slowly and the press still scales.",
  isNew: true,
  variants: [
    { id: "spectrum", label: "Spectrum", prompt: "Ring colours blue #2f6bff, white, amber #ffb347, red #ff4d3d, violet #7a3cff, sky #2fb7ff, green #3dff9a, gold #ffe14d, pink #ff5f6d; flare #ffb066." },
    { id: "ice", label: "Ice", prompt: "Ring colours cyan #3ad7ff, white, periwinkle #8fa8ff, violet #b46bff, aqua #5ef0ff, ice #e8fbff, blue #6b8cff; flare #9fe7ff." },
    { id: "ember", label: "Ember", prompt: "Ring colours orange #ff7a1a, cream #fff1d6, gold #ffd23d, red #ff3d2e, amber #ff9f3d, white, flame #ff5a1f; flare #ff9a3d." },
  ],
  preview: { bg: "#050506", mode: "center", height: 300 },
};
