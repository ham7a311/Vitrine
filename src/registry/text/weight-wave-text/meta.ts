import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "weight-wave-text",
  name: "Weight Wave",
  category: "text",
  description: "A headline in a variable font where weight moves: left alone, a slow wave of weight breathes along the line; bring the pointer close and it becomes a lens, swelling the nearest letters to their heaviest and easing them back to hairline as you pass.",
  tags: ["variable font", "font weight", "lens", "wave", "kinetic type", "hover", "headline", "text animation"],
  traits: ["cursor", "ambient", "touch"],
  source: "original",
  files: ["WeightWaveText.tsx", "weight-wave-text.css"],
  dependencies: [],
  prompt: `Build a headline ("Feel every letter", Hanken Grotesk variable, clamp(3rem, 11vw, 9rem), centred, words kept whole) whose per-letter weight is animated between 220 and 900.

Each letter is a span. Measure every letter's centre once at the resting weight (host-local, corrected for scaled hosts) and cache it, re-measuring on resize and fonts.ready — so the reflow caused by changing weights never moves the lens itself.

One rAF loop (paused offscreen via IntersectionObserver and when the tab is hidden): an idle wave weight = min + 0.62·(max − min)·((0.5 + 0.5·sin(1.85t − 0.42i))^2.2), a crest travelling along the line; and a pointer lens weight = min + (max − min)·exp(−(dx² + dy²)/2) with dx, dy scaled by 1.05em and 0.9em. A "near" factor eases between the two (rate 5/s) as the pointer arrives or leaves, and each letter's weight eases to its target (rate 14/s). Each letter also gets --w (0–1) so heavier letters carry more ink (opacity from 62% to 100%). Touch: pointer events with touch-action: pan-y, so dragging a finger sideways works and a lift lets go.

Reduced motion: a fixed middle weight, no loop. The h2 carries the text; letter spans are aria-hidden.`,
  interaction: "Move the pointer (or drag a finger) across the words.",
  animation: "Idle travelling wave (~3.4s); lens with a Gaussian falloff; weights ease at 14/s.",
  a11y: "The heading carries the text; the letters are aria-hidden spans. Reduced motion holds a fixed weight. Opacity never drops below 50%.",
  responsive: "Type is fluid (11vw) and wraps between words, never inside one.",
  touchFallback: "Drag a finger sideways across the words to move the lens.",
  variants: [
    { id: "night", label: "Night", prompt: "theme=\"night\": ivory letters (#f2eee6) on #0b0b0d; light letters at 62% opacity." },
    { id: "paper", label: "Paper", prompt: "theme=\"paper\": ink letters (#17161a) on paper #f3efe7; light letters at 70%." },
    { id: "gradient", label: "Gradient", prompt: "theme=\"gradient\": each letter coloured along a sky → orchid gradient across the line, with a glow that grows with its weight, on radial-gradient(90% 80% at 50% 45%, #1a1635, #07060c 70%); light letters at 50%." },
  ],
  preview: { bg: "#0b0b0d", mode: "fill" },
};
