import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "slipstream-menu",
  name: "Slipstream Menu",
  category: "navigation",
  description: "Big full-width menu rows. Point at one and a band slides in through the edge you came from — top or bottom — carrying a marquee of the item's name and rounded pictures; leave and it slides out through the edge you left by.",
  tags: ["menu", "navigation", "marquee", "hover", "full screen menu", "links", "editorial"],
  traits: ["hover", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["SlipstreamMenu.tsx", "slipstream-menu.css", "edge.ts"],
  dependencies: [],
  prompt:
    "Build a full-width menu of large rows. Props: items [{label, href, pictures}], label, theme, speed (seconds per marquee copy, default 14) and onNavigate.\n\nEach row is a link 72–120px tall (about 10% of the width) with its label centred in heavy uppercase type (up to 3rem), separated by 1px lines. Each row holds a hidden band: a solid inverse-colour layer the size of the row containing a marquee — the label and a rounded pill picture, repeated, in two copies — translated off the row.\n\nOn pointer enter, work out which edge the pointer crossed (the nearer of top and bottom) and slide the band in from that edge (translateY ±101% → 0, 480ms, cubic-bezier(0.2, 0, 0, 1), with the Web Animations API so a fast re-entry cancels cleanly), and start the marquee scrolling left (translateX 0 → −50%, linear, looping). On pointer leave, slide it out through the edge the pointer left by, and pause the marquee. Keyboard focus slides it in from the top and blur sends it out through the bottom. The band copy is decorative; the row's own label names the link. Reduced motion shows and hides the band without sliding and without scrolling.",
  interaction: "Point at a row and its band slides in from the side you came from; move to the next row and it slides out the way you left. Tab through the links to see the same.",
  animation: "Bands slide in and out over 480ms; the marquee scrolls one copy every 14 seconds while a row is active. Reduced motion: instant bands, no scroll.",
  a11y: "A labelled nav with a list of real links named by their labels; the band's repeated text and pictures are hidden from assistive tech; focus shows the same band as hover plus an inset focus ring.",
  responsive: "Row height, type and picture size follow the container's width.",
  touchFallback: "Tap a row to follow its link; the band is a hover and focus effect.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --slip-band #f3f3f0; --slip-band-ink #0a0a0a; --slip-ground #060606; --slip-ink #f3f3f0; --slip-line rgba(255, 255, 255, 0.22). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --slip-band #141412; --slip-band-ink #f2f1ec; --slip-ground #f2f1ec; --slip-ink #141412; --slip-line rgba(20, 20, 18, 0.22). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#060606", mode: "fill", frame: [1200, 640] },
};
