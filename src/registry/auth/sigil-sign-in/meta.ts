import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "sigil-sign-in",
  name: "Sigil Sign-in",
  category: "auth",
  description: "A split sign-in whose left half grows a geometric mark from your email — the same address always draws the same sigil.",
  tags: ["authentication", "sign-in", "form", "page", "generative", "interactive"],
  traits: ["click", "keyboard", "canvas"],
  source: "original",
  files: ["SigilSignIn.tsx", "sigil-sign-in.css"],
  dependencies: [],
  prompt: `Design a sign-in page where typing is a small act of making. Split it in two: on the left a dark plum stage with a fading dot grid, on the right a calm form.

On the stage, draw an empty geometric mark: four dotted concentric guide rings (radii 34, 62, 92, 118 in a 320×320 viewBox) and a small core dot. Each character of the email adds one stroke — chosen deterministically by hashing the email prefix up to that character (FNV-1a into a seeded LCG): either an arc along one ring, a spoke from the core, or a chord between two rings. Each new stroke draws itself with stroke-dashoffset (520ms, ease-out-expo) and ends in a frost dot that fades in. Because it's hashed from the text, the same address always grows the same sigil; edit a character and the mark changes from that point onward. When the email becomes valid the core lights frost blue.

Around the mark, four quarter-arcs at radius 138 form a strength ring: as the password strengthens (length, mixed case, digits + symbols) the arcs light up one quarter at a time — rose for weak, frost for fair and good, lilac when strong — echoed by a four-segment bar under the field. The form: labelled email and password (48px, 16px text), a show/hide toggle, and a cream "Enter" button that stays disabled until the email is valid and the password has 8+ characters. Under reduced motion strokes appear fully drawn.`,
  interaction: "Every keystroke in the email field extends the sigil; the password field lights the strength ring; the button unlocks when both are valid.",
  animation: "Stroke draw 520ms + dot fade 300ms; strength arcs draw 600ms; field focus 220ms.",
  a11y: "Real labels, autocomplete tokens, a live-region strength label and a descriptive text alternative for the mark (role=img). The mark is redundant decoration — the form is complete without it. Reduced motion shows strokes already drawn.",
  responsive: "Container query: two columns from 52rem, otherwise the stage sits above the form at a smaller size.",
  touchFallback: "Fully input-driven; nothing depends on hover.",
  preview: { bg: "#09080b", mode: "page", height: 760 },
  featured: true,
};
