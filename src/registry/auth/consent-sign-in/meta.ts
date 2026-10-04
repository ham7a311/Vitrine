import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "consent-sign-in",
  name: "Consent Sign-in",
  category: "auth",
  description: "A split OAuth sign-in with a drifting constellation, hand-drawn dividers, and providers that unlock only after consent.",
  tags: ["authentication", "sign-in", "oauth", "page", "form", "canvas"],
  traits: ["click", "canvas", "ambient"],
  source: "original",
  files: ["ConsentSignIn.tsx", "consent-sign-in.css"],
  dependencies: [],
  prompt: `Design a two-panel sign-in page on a warm near-black canvas. The left 45% is an atmospheric panel: a deep night backdrop (a dark veil over a warm city-glow gradient — swap in a photograph if you have one), a canvas constellation of 20 amber nodes drifting slowly (speed 0.12, gentle damping, bouncing off the edges) connected by lines whose opacity fades with distance (link radius ~12% of the width), rendered at ~30fps and paused offscreen. Over it: a mono "back to home" link, a large headline whose last phrase is an italic serif, a muted lead, and a mono uppercase brand line at the bottom.

Between the panels, instead of a straight border, draw a tall hand-drawn squiggle (an SVG path with preserveAspectRatio="none") that sketches itself in on mount. The right side centres a 26rem form, bracketed top and bottom by short hand-drawn wavy rules that also draw in (380ms, ease-out-expo): a mono "Sign in" eyebrow, a 600-weight title, a muted subtitle, three full-width OAuth provider buttons (brand marks + label, hairline border, 6px radius), and a consent checkbox with an amber inline link.

The providers stay disabled at 45% opacity with a not-allowed cursor until the consent box is ticked; once enabled they gain an amber border on hover and focus. The checkbox is a real input with a custom 20px box that fills amber and fades in a check. On narrow containers the left panel disappears and the back link moves above the form.`,
  interaction: "Tick consent to enable the provider buttons; hover/focus an enabled provider for the amber border. The constellation drifts on its own.",
  animation: "Sketch rules draw on mount (380ms; the tall divider 900ms). Canvas at ~30fps, paused offscreen and in hidden tabs. Buttons/checkbox 200ms.",
  a11y: "Page <h1>, a labelled form, real <button>s that are truly disabled until consent (with a visually hidden hint linked via aria-describedby), and a native checkbox. Decorative canvas and rules are aria-hidden. Reduced motion skips the canvas and shows rules drawn.",
  responsive: "Container queries: split layout from 48rem; below that a single centred column with the back link on top.",
  touchFallback: "Nothing is hover-dependent.",
  preview: { bg: "#0c0b0a", mode: "page", height: 800 },
};
