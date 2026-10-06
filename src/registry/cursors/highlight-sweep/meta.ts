import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "highlight-sweep",
  name: "Highlight Sweep",
  category: "cursors",
  description: "A second cursor — not yours — that glides in and drags a highlight across the line that matters, left to right: the box grows behind the words and they turn the accent colour with a crisp edge that travels with it. It lets go and moves on to the next phrase, and every highlight stays: it plays once, then the arrow rests past the last box and nothing moves again.",
  tags: ["cursor", "highlight", "animation", "selection", "demo cursor", "hero", "headline", "text", "accent"],
  traits: ["ambient"],
  source: "original",
  files: ["HighlightSweep.tsx", "highlight-sweep.css"],
  dependencies: [],
  prompt: `Build a scripted "demo cursor" that highlights text the way a person drags a selection — an animation, not a pointer effect. The visitor's own cursor is never hidden or changed.

Markup: <SweepText text="…" order={n} as="span|p|h2" /> renders one span per word (spaces between, "\\n" as <br>) and marks the element data-hs-text with its order. [[…]] inside the text marks the phrase to sweep (otherwise every word is swept). Targets are swept once, in ascending order.

Layers inside an isolated, position:relative host: selection boxes behind the content (z 0), the content (z 1), the cursor above (z 2), all aria-hidden except the content.

Measuring: for the current target, take its marked word spans' getBoundingClientRects in host-local px (corrected by rect.width / offsetWidth) and group them into visual lines by top edge, so a phrase that wraps is swept line by line.

The box, one per visual line: border-radius 7px; background the accent at 16%; a 1px inset ring of the accent at 48%; 6px padding either side and 2px above and below the words' boxes. Its left edge is fixed at the line start and its right edge is tied to the cursor's x. The words get background-image: linear-gradient(90deg, accent 0 var(--f), currentColor var(--f)) clipped to the text (-webkit-text-fill-color: transparent), and --f is set per word to (cursor x − word left) every frame, so the accent edge is crisp and moves exactly with the cursor. Clearing transitions a registered --hs-mix number from 1 to 0 so the accent fades back to the ink.

The cursor: a 26px arrow with every corner rounded (32-unit SVG: M5.77 3.24 L28.12 10.61 A3 3 0 0 1 28.07 16.33 L20.61 18.63 A3 3 0 0 0 18.63 20.61 L16.33 28.07 A3 3 0 0 1 10.61 28.12 L3.24 5.77 A2 2 0 0 1 5.77 3.24 Z), filled with the accent, no keyline, soft dark drop shadow, rounded tip as the hotspot.

Timeline (one rAF loop, sleeping offscreen via IntersectionObserver or while document.hidden): wait 500ms; glide in along a quadratic curve from below-right to just left of the first line's start (900ms, cubic in-out, fading in); press (scale 0.9, 160ms) and the box appears; drag right at about 380px/s (≥900ms for a single line, cubic in-out; across wrapped lines ease in on the first, steady in the middle, ease out on the last, with a 280ms hop down-left to each next line start); release; drift to rest just below-right of the box's end (520ms ease-out). The highlight stays. Hold 900ms, then glide on along a curve from where the arrow is to the next target and sweep it the same way. After the last target the arrow rests past its box and the loop ends for good: no controls, no replay. A width change redraws the finished highlights at the new measurements and restarts the one in progress.

Reduced motion: no animation, the finished state: every target highlighted and the arrow resting past the last. One accent colour prop drives the boxes, ring, swept words and arrow; fill, ring, ink and arrow props override each one. On a near-black page (#050505) with a big white Geist heading.`,
  interaction: "Watch: the demo cursor sweeps “you'll actually be there.”, then glides down and sweeps the paragraph's first phrase. Both highlights stay and the cursor comes to rest. It plays once; Infinite Highlight Sweep is the looping version.",
  animation: "Glide 900ms, press 160ms, drag ≈380px/s, rest 520ms, hold 900ms, glide on to the next phrase. It runs once and then stops for good; the rAF loop sleeps offscreen or in a hidden tab.",
  a11y: "The text stays real text and reads normally; boxes and the demo cursor are aria-hidden. It plays once and stops, so nothing keeps moving; reduced motion shows the finished, highlighted state without animating. Forced colours drop the gradient text fill.",
  responsive: "Lines are measured from the text as it wraps at that width, and a wrapped phrase is swept line by line; a resize restarts the current sweep.",
  touchFallback: "Identical on touch — it never depended on the pointer.",
  variants: [
    { id: "teal", label: "Teal", prompt: "Accent #5fd4bf (teal)." },
    { id: "violet", label: "Violet", prompt: "Accent #a78bfa (violet)." },
    { id: "amber", label: "Amber", prompt: "Accent #fbbf24 (amber)." },
    { id: "rose", label: "Rose", prompt: "Accent #fb7185 (rose)." },
    { id: "sky", label: "Sky", prompt: "Accent #60a5fa (sky blue)." },
    { id: "lime", label: "Lime", prompt: "Accent #a3e635 (lime)." },
  ],
  preview: { bg: "#050505", mode: "fill" },
};
