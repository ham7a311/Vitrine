import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "inverse-sweep",
  name: "Inverse Sweep",
  category: "highlights",
  description: "A solid bar sweeps across a phrase and the letters invert exactly where it covers them, along a slanted edge. Point at it and the bar slides away to the right; move off and it sweeps back.",
  tags: ["highlight", "invert", "sweep", "reveal", "headline", "clip-path", "manifesto"],
  traits: ["hover", "scroll"],
  source: "original",
  files: ["InverseSweep.tsx", "inverse-sweep.css"],
  dependencies: [],
  prompt: `Build an inverting highlight for a bold three-line headline — "Write [less.] / Ship [more.] / Sleep [better.]" in Geist 700 — where a solid bar sweeps across each marked word in turn and the letters invert exactly under it.

Construction: an inline-block, nowrap wrapper holds the text twice in identical boxes (padding .02em .14em .06em): a plain copy in the page's colour, and on top an absolutely positioned copy (inset 0, aria-hidden) on the bar colour in the reversed text colour. The top copy is clipped by a four-point polygon whose two vertical edges are slanted by .32em, like a squeegee: top-left at tail + slant, top-right at lead + slant, bottom-right at lead, bottom-left at tail. Because both copies share the same edges, the inversion follows the bar's edge exactly, letter by letter.

Motion: lead and tail are registered custom properties (@property, <length-percentage>, initial −100%) so the clip animates smoothly; they are set on the wrapper and transitioned there. When the word is fully in view, lead runs to 100% (720ms, cubic-bezier(.7,0,.2,1)) after a per-word delay, so the three words sweep in reading order. Pointing at a word moves tail to 100% (480ms) — the bar slides off to the right and the plain word returns; moving away sweeps it back in from the right. Reduced motion shows the bars in place without transitions.`,
  interaction: "Point at a word to slide its bar away; move off to sweep it back.",
  animation: "Sweep in 720ms per word, in order; out and back 480ms.",
  a11y: "The reversed copy is aria-hidden, so the word is read once; both colour pairs keep 4.5:1 or better (cream bar with near-black text, near-black bar with cream text).",
  responsive: "Each marked word is an inline-block sized in em, so it scales with the headline; the slant is .32em at every size.",
  touchFallback: "Bars sweep in on view; tapping does not toggle them.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --bar #f3efe6; --on-bar #121113. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --bar #151417; --on-bar #f7f4ee. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0f0f11", mode: "fill" },
  isNew: true,
};
