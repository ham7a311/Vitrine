import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "tuck-banner",
  name: "Tuck Banner",
  category: "feedback",
  description: "An announcement strip that is put away, not thrown away: dismissing it folds the message into a thin rail along the top with a tab that names it, and the tab brings it back. The choice is remembered per announcement.",
  tags: ["banner", "announcement", "notice", "dismiss", "bar", "release", "alert", "top bar"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["TuckBanner.tsx", "tuck-banner.css"],
  dependencies: [],
  prompt: `Build an announcement banner for the top of a page that treats dismissal as a reversible choice.

Open state: a full-width strip on a slightly tinted ground with a 1px bottom rule, at least 48px tall. Inside: a mono caps tag in the accent colour naming the announcement ("Relay 4.2"), one sentence of text, a medium-weight underlined action link, and a "Tuck away" button with a small chevron (mono caps, muted, 44px tall). On narrow containers (under 34rem, container query) the button moves to its own line at the right.

Tucking: the strip folds closed while a 28px rail folds open below it, as two grids sharing the space (grid-template-rows 1fr to 0fr and 0fr to 1fr, 320ms cubic-bezier(.2,.8,.2,1)). The rail holds one tab at the right edge: an accent dot, the same label and a chevron pointing up, which reopens the strip. Whichever fold is closed is visibility: hidden, switched after the animation, so it is out of the tab order. Focus moves to the tab after tucking and to the action link after reopening, so keyboard focus is never lost.

Memory: pass a storageKey and the tucked state is saved in localStorage (inside try/catch) and read after mount, never during the first render, so server and client agree; nothing animates until it has been read, and the banner is hidden until then to avoid a flash. Changing the key announces something new and opens the banner again. Without a key, nothing is stored. The root is an aside labelled "Announcement"; the tab has aria-expanded and aria-controls. Paper and Night themes.`,
  interaction: "Press Tuck away and the message folds into the rail; press the tab to read it again.",
  animation: "Both folds move over 320ms; chevrons nudge 2px on hover over 240ms.",
  a11y: "A labelled aside; the tab reports aria-expanded and controls the strip; the folded-away side is hidden from assistive tech and the tab order; focus moves to the control that has just appeared. Reduced motion makes the fold instant.",
  responsive: "Container query at 34rem wraps the strip and pushes the Tuck away button to the right; the rail is always one line.",
  touchFallback: "Both controls are real buttons with 44px or larger hit areas; no hover is required.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --tb-accent #2f6bff; --tb-bg #ece9df; --tb-ink #1b1a17; --tb-line rgb(27 26 23 / 0.12); --tb-muted #6b6861. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --tb-accent #7aa2ff; --tb-bg #1a1b1e; --tb-ink #ececea; --tb-line rgb(255 255 255 / 0.1); --tb-muted #8d8f95. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f6f5f1", mode: "fill", height: 440 },
};
