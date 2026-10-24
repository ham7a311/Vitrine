import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "focus-lock",
  name: "Focus Lock",
  category: "highlights",
  description: "A word found the way a camera finds focus: four viewfinder brackets hunt in from wide while the word is soft, then lock onto it with a small overshoot and a flash of colour as the word snaps sharp. Point at it and they hunt and lock again.",
  tags: ["highlight", "focus", "viewfinder", "brackets", "camera", "blur", "headline"],
  traits: ["hover", "scroll"],
  source: "original",
  files: ["FocusLock.tsx", "focus-lock.css"],
  dependencies: [],
  prompt: `Build a camera-focus highlight for one phrase in a semibold Geist headline: "Out of every interview, find the [one thing] that matters." — viewfinder brackets lock onto "one thing" in autofocus green on a near-black page.

Construction: an inline-block, nowrap wrapper (.2em inline margin) around the word, with four corner brackets absolutely positioned on a frame just outside it (inset .02em −.16em −.04em). Each bracket is an empty element .24em square with two borders (top + left for the top-left corner, and so on) at max(2px, .034em), so they read as viewfinder corners. A custom property --o pushes every bracket out along its own diagonal (translate(±o, ±o)).

Phases, set by a data attribute:
- Idle (before it is in view): --o .75em, brackets transparent, the word blurred .07em at 35% opacity.
- Hunting (when 80% in view, after a delay): --o .2em, brackets visible in a neutral grey (white at 55%), the word at .035em blur and 80% opacity.
- Locked (460ms later): --o 0 with a springy overshoot (440ms, cubic-bezier(.2,1.55,.35,1)), brackets turn the accent colour with one 560ms flash (drop-shadow glow and a brightness lift that fades), and the word is sharp and fully opaque (380ms).
Pointing at a locked word sends it back to hunting for 320ms and locks again, with the flash.

Reduced motion: it is shown locked, with no transitions or flash.`,
  interaction: "Point at the word to make the brackets hunt and lock again.",
  animation: "Hunt 460ms, lock 440ms with overshoot, flash 560ms; the word sharpens over 380ms.",
  a11y: "The brackets are aria-hidden; the word is real text and is fully sharp and opaque once in view (and immediately with reduced motion).",
  responsive: "Brackets and offsets are in em, so they track the headline's size; the phrase stays on one line.",
  touchFallback: "It locks once when scrolled into view; tapping does not refocus.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --hunting rgb(255 255 255 / 0.55); --lock #8cf25a. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --hunting rgb(0 0 0 / 0.4); --lock #e0491f. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0b0c0e", mode: "fill" },
  isNew: true,
};
