import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "cascade-pitch-cta",
  name: "Cascade Pitch CTA",
  category: "ctas",
  description: "A closing pitch that fits whoever is reading: pick 'designer', 'founder' or 'engineer' and the headline, the line under it and the button turn over letter by letter to new copy.",
  tags: ["cta", "section", "closing", "personalised", "typography", "letter cascade", "segmented"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["CascadePitchCta.tsx", "cascade-pitch-cta.css"],
  dependencies: [],
  prompt:
    "Build a closing CTA with a small segmented choice above it — 'I'm a  designer | founder | engineer' in a pill — and three versions of the pitch (headline, one line, button label). Choosing a role rewrites all three in place, letter by letter, like a departures board.\n\nRender each string as reels: one inline-block per character, exactly one line tall with overflow hidden, holding a two-row strip — the previous text's character at that index on top and the new character beneath. On change, every reel whose character differs plays a 620ms expo-out roll from translateY(0) to −50%, delayed by its index (11ms per letter in the headline, 4ms in the paragraph, 18ms on the button) so the change sweeps left to right. Unchanged letters stay still. Group the reels into the new text's words (nowrap) so lines only break at spaces; extra letters from a longer old string roll away out of flow.\n\nThe roles are a radiogroup with roving tabindex and arrow keys. Each animated string is aria-hidden with the real text beside it in a visually hidden span, and a polite live region announces the new headline.",
  interaction: "Choose a role with a click or the arrow keys; the pitch turns over to match.",
  animation: "Each changed letter rolls in 620ms, staggered by position; the whole headline lands within about a second.",
  a11y: "Real heading, paragraph and link carry the current text for screen readers; the reels are aria-hidden. The role picker is a labelled radiogroup, and the new headline is announced politely. Reduced motion swaps the text instantly.",
  responsive: "Fluid type with clamp(); words wrap only at spaces, so mid-word breaks can't happen during a roll.",
  touchFallback: "Tap a role; everything else is the same.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --cpc-accent #c8b9ea; --cpc-chip #1a181e; --cpc-ink #efe8dc; --cpc-line rgb(239 232 220 / 0.14); --cpc-muted #9c96a1; --cpc-on #efe8dc; --cpc-on-ink #141216; --cpc-page #0b0a0d. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --cpc-accent #7c5cc4; --cpc-chip #fffdf8; --cpc-ink #1b1a17; --cpc-line rgb(27 26 23 / 0.14); --cpc-muted #6f6a62; --cpc-on #1b1a17; --cpc-on-ink #fffdf8; --cpc-page #f3f1ec. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
