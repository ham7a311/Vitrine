import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "session-ledger",
  name: "Session Ledger",
  category: "auth",
  description: "Every device signed in to your account, with the one you're on marked. Sign any of them out — each asks once, inline — or all the others at once; rows fold away straight away and come back with a reason if the server says no. A new sign-in waits at the top for you to say whether it was you.",
  tags: ["sessions", "devices", "security", "sign out", "account settings", "new sign-in", "alert", "revoke", "optimistic"],
  traits: ["click", "keyboard"],
  source: "original",
  isNew: true,
  files: ["SessionLedger.tsx", "session-ledger.css", "sessions.ts"],
  dependencies: [],
  prompt:
    "Build an account sessions panel. Props: sessions [{id, device (laptop, desktop, phone, tablet), name, browser, place, lastActive, current}], alert {sessionId}, now (a timestamp to measure from), onRevoke(ids) → Promise (reject to restore), onSecure and theme.\n\nA card (640px max, 22px corners): 'Where you're signed in' with the count, and 'Sign out all others' on the right, which turns into an inline confirm ('Sign out 3 other devices?' Cancel / Sign out all) with focus on the destructive button.\n\nIf there's an alert, a warning-tinted banner at the top with a shield: 'New sign-in on Windows PC', 'Edge · Porto, Portugal · 4 minutes ago', and two buttons: 'This was me' (dismisses it and says thanks) and 'Secure account' (signs that session out and turns the banner green: 'Signed out Windows PC — change your password to finish', with a link).\n\nRows: a device icon in a rounded square, the name (with a green 'This device' pill on the current one), browser and place, and the last-active time in words ('Active now' in green with a dot, '12 minutes ago', '3 hours ago', 'Yesterday', '9 days ago', '2 weeks ago'). Every other row has 'Sign out', which swaps in place for Keep / Sign out. Confirming folds the row away (grid rows 1fr → 0fr, fading and sliding left over 260ms), removes it, and calls onRevoke. If that fails, the row goes back in exactly its old place (remember each removed row's index) with a red message under it. Announce every outcome in a status region.\n\nTwo themes. Reduced motion: rows disappear without folding.",
  interaction: "Sign out a device (confirm inline), sign out all others, or answer the new sign-in banner.",
  animation: "Confirms slide in over 200ms; rows fold away over 260ms; the banner fades in. Reduced motion removes the motion.",
  a11y: "A section labelled by its heading; each Sign out button names its device; confirms are labelled groups with focus on the destructive button; outcomes are announced in a status region; errors on rows are alerts. The current device can't be signed out from here.",
  responsive: "Rows wrap their actions under the text below 480px.",
  touchFallback: "Nothing depends on hover.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --sl-card #14151a; --sl-danger #ff8475; --sl-good #6fe0a5; --sl-ink #f0f1f4; --sl-line rgba(255, 255, 255, 0.08); --sl-muted #9b9fa9; --sl-on-danger #2a0905; --sl-row #1a1b21; --sl-warn #ffc56b. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --sl-card #ffffff; --sl-danger #b42318; --sl-good #12804c; --sl-ink #15171c; --sl-line rgba(18, 20, 24, 0.1); --sl-muted #5b5f69; --sl-on-danger #ffffff; --sl-row #f6f6f3; --sl-warn #8a5a00. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0a0b0e", mode: "fill", frame: [1280, 900] },
};
