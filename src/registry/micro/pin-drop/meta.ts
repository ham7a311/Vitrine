import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "pin-drop",
  name: "Pin Drop",
  category: "micro",
  description: "A save-this-place button whose pin really lands: it crouches, leaps, falls onto its spot, bounces twice and settles while two rings spread across the ground, and a little tag unfolds under it saying which list it went into. Unsaving plucks the pin back out.",
  tags: ["save", "map", "pin", "location", "bookmark", "travel", "button", "micro-interaction", "bounce"],
  traits: ["click", "keyboard"],
  source: "original",
  isNew: true,
  files: ["PinDrop.tsx", "pin-drop.css"],
  dependencies: [],
  prompt:
    "Build a save-a-place toggle whose map pin drops into place. Props: saved (controlled), defaultSaved, onChange, place (its name), list (where it's saved, default \"Saved places\"), theme and className.\n\nA 42px pill button with aria-pressed and a label naming the place (\"Save Café Ondina\" / \"Saved Café Ondina to Lisbon, May\"): a 24 × 28 spot holding the pin icon, and the words \"Save place\" or \"Saved\". Unsaved, the pin is an outline in the text colour; saved, it's filled red with a light centre dot, a small ground shadow sits under it, and the pill fills with the ink colour after a 180ms delay.\n\nSaving plays a 720ms keyframe sequence on the pin (origin at its tip): crouch (squash 1.1 × 0.86), leap 30px with a stretch, land squashed (1.14 × 0.82), bounce 8px, land again, a 2.5px hop, settle. The shadow shrinks while the pin is in the air and spreads as it lands. Two thin elliptical rings spread from the tip and fade, at 300ms and 430ms. Then a dark tag unfolds under the button from its top-left — a green tick and \"Added to Lisbon, May\" — overshoots slightly, holds and folds away after about 2.4s. Unsaving plucks the pin up and away and drops a fresh outline back in. Restart animations each press by keying the spot on a counter. A visually hidden status region announces \"Café Ondina saved to Lisbon, May\" or \"removed from\". Reduced motion skips the movement and simply fades the tag in and out.",
  interaction: "Click, tap, Space or Enter to save and unsave the place.",
  animation: "Drop 720ms with two bounces; rings at 300ms and 430ms; tag unfolds at 520ms and folds away by about 2.9s. Reduced motion only fades the tag.",
  a11y: "A toggle button with aria-pressed and a label naming the place and list; the result is announced in a status region; the pin and tag are decorative.",
  responsive: "A compact pill; the tag sits under it and never covers other controls.",
  touchFallback: "Tapping toggles it.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --pd-face #ffffff; --pd-ground rgba(23, 24, 28, 0.18); --pd-ink #17181c; --pd-line rgba(23, 24, 28, 0.12); --pd-ok #5fd39a; --pd-on-face #17181c; --pd-on-ink #ffffff; --pd-pin #e2462f; --pd-pin-dot #ffffff; --pd-tag #17181c; --pd-tag-ink #ffffff. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --pd-face #1b1c22; --pd-ground rgba(0, 0, 0, 0.5); --pd-ink #f2f2f5; --pd-line rgba(255, 255, 255, 0.12); --pd-ok #13804a; --pd-on-face #f2f2f5; --pd-on-ink #15161b; --pd-pin #ff6a52; --pd-pin-dot #1b1c22; --pd-tag #f2f2f5; --pd-tag-ink #15161b. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f1efe9", mode: "center", height: 380 },
};
