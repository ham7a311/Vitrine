import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "second-draft-text",
  name: "Second Draft",
  category: "text",
  description: "A sentence written by someone who cares which word comes last. It types with human timing, selects “fast” backwards and deletes it, tries “calm” and strikes it through in pen, then writes “yours” in italics with a flourish beneath.",
  tags: ["typewriter", "typing", "revision", "strikethrough", "caret", "headline", "storytelling", "serif", "text animation"],
  traits: ["ambient", "click"],
  source: "original",
  files: ["SecondDraftText.tsx", "second-draft-text.css"],
  dependencies: [],
  prompt: `Build a typed headline that revises itself: "We build software that feels fast" → (select "fast" backwards, delete) → "calm" → (strike "calm" through in pen, keep it) → "yours." in italic accent with a flourish underline.

Model: the line is a list of segments {text, kind: plain | struck | final} plus a count of characters selected at the end. A cancellable async script (setTimeout promises checked against a stop flag) drives it once the block is 40% in view: type the lead at a human pace (55–110ms per character, +40–100ms after a space, +220ms after punctuation, spaces quicker), type "fast", wait 900ms, grow a system-style selection backwards one letter every 70ms, wait 380ms, delete; a "Draft n of 3" chip advances with each revision. Type "calm", wait 1s, mark it struck: it dims to 42% and a hand-drawn SVG line (non-scaling stroke) is revealed across it left to right with clip-path in 440ms. Then type " yours" 1.7× slower as the final italic accent segment, then ".", and draw a swash under "yours" (900ms).

Caret: a thin bar after the last character that is solid while typing and blinks (steps, 1.05s) while it pauses, blinking four times after the end. Newsreader, clamp(2.1rem, 6vw, 4.6rem), min-height so the block never jumps. Replay restarts the script (disabled until it finishes). The animated line is aria-hidden; a visually hidden copy reads "We build software that feels yours." Reduced motion shows the finished line with marks already drawn. Themes: paper (rust pen) and night (amber).`,
  interaction: "Plays when scrolled into view; Replay writes it again.",
  animation: "Human-paced typing (55–110ms/char with pauses), 70ms/char backwards selection, 440ms pen strike, 900ms flourish.",
  a11y: "Screen readers get only the finished sentence; the typing is aria-hidden. It plays once (no loop) and reduced motion shows the final state.",
  responsive: "The line wraps normally, so typing only ever pushes words forward, and it reserves its height, so revisions never shift the layout below.",
  touchFallback: "Not pointer-driven; identical on touch.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --accent #c2361b; --caret #1d1a16; --ink #1d1a16; --muted rgb(29 26 22 / 0.5); --pen #c2361b; --sel #b9d4fb. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --accent #ffb86b; --caret #f1ece2; --ink #f1ece2; --muted rgb(241 236 226 / 0.5); --pen #ff7a59; --sel #2c4a7a. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f5f0e7", mode: "fill" },
};
