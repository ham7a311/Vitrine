import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "account-chooser",
  name: "Account Chooser",
  category: "auth",
  description: "“Choose an account”, where the account you pick stays the same object: its avatar, name and email lift out of the list and travel up into the password step's header while the other accounts step away, and Back runs it in reverse. Accounts can be removed from the device, with an undo.",
  tags: ["auth", "account switcher", "sign in", "profiles", "flip", "shared element", "saved accounts"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["AccountChooser.tsx", "account-chooser.css"],
  dependencies: [],
  prompt: `Build an account chooser whose chosen account animates as a shared element into the password step.

Views: list → password → done, plus "Use another account" (an email step that adds the account and continues to password). The list shows saved accounts as full-width row buttons: a gradient initials avatar (hue per account), name, email (ellipsised) and "last used", with ArrowUp/ArrowDown/Home/End moving focus between rows and an accessible name like "Maryam Al-Harthy, maryam@gutech.edu.om, last used 3 days ago". Rows fade up in sequence (45ms apart).

Shared element (FLIP): the identity block (avatar + name + email) is the same component in both views. On choose, the other rows fade and slide 10px away (170ms); then record the chosen block's getBoundingClientRect, switch view, and in a layout effect measure the new header block and animate it with the Web Animations API from translate(dx, dy) scale(oldHeight / newHeight) (transform-origin top left) to none over 460ms with a slight overshoot. The header avatar is larger, so it visibly grows on the way. Back ("Not you?" or "← All accounts") captures the header block and plays the same move back into its row, and returns focus to that row.

Password step: "Welcome back", the identity, a password field with a Show/Hide toggle (aria-pressed) and text errors, Sign in, Forgot password. It is focused after the move. Done shows "You're in." with the account.

Remove: "Remove an account" (aria-pressed) turns the rows into remove actions ("Remove … from this device", red label); removing shows an Undo toast for 6 seconds that restores the account at its index. Paper and Night; reduced motion swaps views without the move.`,
  interaction: "Pick an account to watch it travel into the password step; press “Not you?” to send it back. Try “Remove an account” and Undo, or “Use another account”.",
  animation: "Rows fade up 320ms, 45ms apart; the others step away 160–200ms; the shared element moves and scales over 460ms with a slight overshoot; steps fade 300ms.",
  a11y: "Rows are real buttons with full spoken names and arrow-key navigation; focus moves to the password field after the move and back to the row on return; errors are text tied to the field; the remove mode is a pressed toggle and the undo toast is a status. Reduced motion changes views instantly.",
  responsive: "A single 25rem card, fluid on phones; long names and emails ellipsise.",
  touchFallback: "Identical on touch.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --ac-accent #2a5bd7; --ac-av-l 52%; --ac-card #fffdf8; --ac-err #b4432f; --ac-hover rgb(27 26 23 / 0.04); --ac-ink #1b1a17; --ac-line rgb(27 26 23 / 0.1); --ac-muted #6f6a62. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --ac-accent #8fb8ff; --ac-av-l 60%; --ac-card #1b1c1f; --ac-err #f08a74; --ac-hover rgb(239 232 220 / 0.05); --ac-ink #efe8dc; --ac-line rgb(239 232 220 / 0.11); --ac-muted #9a98a0. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#efebe3", mode: "fill" },
};
