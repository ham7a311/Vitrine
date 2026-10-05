import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "hinge-split-button",
  name: "Hinge Split Button",
  category: "buttons",
  description: "A split button whose alternatives hang from a hinge on its bottom edge: the leaf swings down like a drop-leaf table, and whatever you choose becomes the main action.",
  tags: ["button", "split button", "menu", "dropdown", "deploy", "actions"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["HingeSplitButton.tsx", "hinge-split-button.css"],
  dependencies: [],
  prompt:
    "Build a split button: a main action ('Deploy to production') and a caret, sharing one rounded bar with a hairline seam. The caret opens a menu that hangs from a hinge 6px below the bar: a leaf as wide as the bar or wider, whose transform-origin sits on the bar's bottom edge. Closed, it's rotated −88° on X (edge-on, invisible); opening swings it down to flat with a slight overshoot (620ms, back-out curve) in a 900px perspective, while a dark gradient over the leaf fades out — light falling on it as it levels. Closing folds it back up quickly with an ease-in. Items fade and drop 4px in, staggered 40ms after the swing starts; each has a bold label, a one-line detail ('staging.tryvitrine.dev · no approval needed') and a check on the current choice.\n\nChoosing an item makes it the main action, like GitHub's merge button: the main label rolls in from below and the leaf folds away, so the button always says exactly what it will do. ARIA menu button: aria-haspopup, aria-expanded, role=menu with menuitemradio + aria-checked; ↓/↑ on the caret open with focus on the current choice, arrows/Home/End move, Enter chooses, Escape closes and returns focus, Tab and outside clicks close.",
  interaction: "Press the main part to run the current action. Press the caret (or ↓) to see alternatives; choose one to make it the main action.",
  animation: "Leaf swing 620ms back-out with shading; fold 240ms ease-in; items stagger 40ms; label roll 520ms.",
  a11y: "Two real buttons; the caret is a menu button with a descriptive label. The menu is a radio group of menu items so screen readers hear which action is current. Focus is managed in and out of the menu; the closed leaf is inert. Reduced motion removes the swing.",
  responsive: "Intrinsic width; the leaf caps at 22rem or the viewport width minus 2rem.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --hsb-accent #b9cce4; --hsb-face #efe8dc; --hsb-hover rgb(239 232 220 / 0.06); --hsb-ink #141216; --hsb-leaf #1a181d; --hsb-leaf-ink #efe8dc; --hsb-line rgb(239 232 220 / 0.1); --hsb-muted #9c96a1; --hsb-seam rgb(20 18 22 / 0.16). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --hsb-accent #2f5fd0; --hsb-face #1b1a17; --hsb-hover rgb(27 26 23 / 0.05); --hsb-ink #f6f3ec; --hsb-leaf #ffffff; --hsb-leaf-ink #1b1a17; --hsb-line rgb(27 26 23 / 0.1); --hsb-muted #6f6a62; --hsb-seam rgb(246 243 236 / 0.2). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
