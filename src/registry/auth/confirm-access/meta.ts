import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "confirm-access",
  name: "Confirm Access",
  category: "auth",
  description: "A guard for dangerous actions: before it goes ahead, prove it's still you. A dialog says plainly what you're about to do and as whom, then lets you confirm with a passkey (the fingerprint reads itself), a six-digit authenticator code (a wrong one shakes the cells and counts down your tries) or your password.",
  tags: ["sudo mode", "re-authentication", "confirm", "dialog", "passkey", "2fa", "otp", "security", "danger zone", "modal"],
  traits: ["click", "keyboard"],
  source: "original",
  isNew: true,
  files: ["ConfirmAccess.tsx", "confirm-access.css", "access.ts"],
  dependencies: [],
  prompt:
    "Build a re-authentication guard for dangerous actions. Props: action {verb, target}, account {handle, initials}, methods (passkey, code, password), onVerify(method, value?) → Promise (reject when wrong), onConfirmed, triggerLabel, grace ('2 hours'), attempts (3) and theme.\n\nA danger-tinted trigger button opens a native <dialog> with showModal (so focus is trapped, Escape closes and the page is inert), over a dimmed, slightly blurred backdrop; closing returns focus to the trigger. The dialog (440px, 22px corners) rises in with a small scale.\n\nInside: a header with a lock in a rounded square, 'Confirm access' and 'Signed in as' with a small gradient avatar and the handle, and a close button. A danger-tinted note with a warning icon: 'You're about to delete repository northwind/site. This can't be undone.' Then the methods as a segmented tablist (roving tabindex, arrow keys, Home and End) controlling one panel:\n- Passkey: a fingerprint drawn as nine ridge strokes; 'Use passkey' — while waiting the ridges sweep in turn (dash offset with staggered delays) and the button reads 'Waiting for your device…'.\n- Authenticator: one real one-time-code input stretched invisibly over six display cells; the cell you're at shows a blinking caret; at six digits it verifies on its own. Wrong: the row shakes, the cells outline in the danger colour, the code clears and focus stays.\n- Password: a field and Confirm.\nWrong answers show a message with the tries left ('That code didn't work. 2 tries left.'); at zero, that method is disabled and the message suggests another. A footer says you won't be asked again for the grace period, with Cancel.\n\nSuccess replaces the content with a green circle that pops in and draws a tick, 'Access confirmed', and after about a second the dialog closes and onConfirmed runs. Two themes. Reduced motion: no rise, shake, sweep or pop.",
  interaction: "Open the dialog from the trigger; choose a method with the tabs (arrow keys work); confirm with a passkey, a code (verifies at six digits) or a password. Escape or Cancel closes it.",
  animation: "The dialog rises over 260ms; the fingerprint ridges sweep while waiting; a wrong code shakes for 380ms; the success tick pops and draws. Reduced motion removes all of it.",
  a11y: "A native modal dialog labelled and described by its title and the action; focus is trapped and returns to the trigger. The methods are a tablist with roving focus. The code uses one real input with autocomplete one-time-code. Wrong answers are announced as alerts and set aria-invalid; success is a status.",
  responsive: "The dialog is fluid up to 440px with 12px from the screen edges.",
  touchFallback: "The code field brings up the number pad and accepts one-time codes from SMS or the keychain.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --ca-accent #f1f2f5; --ca-backdrop rgba(4, 5, 8, 0.66); --ca-card #16171c; --ca-danger #ff7b6b; --ca-field #0f1014; --ca-good #6ee7a8; --ca-ink #f1f2f5; --ca-line rgba(255, 255, 255, 0.1); --ca-muted #9fa3ad; --ca-on-accent #0f1014. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --ca-accent #16181d; --ca-backdrop rgba(20, 22, 28, 0.42); --ca-card #ffffff; --ca-danger #b42318; --ca-field #f5f5f2; --ca-good #12804c; --ca-ink #16181d; --ca-line rgba(18, 20, 24, 0.12); --ca-muted #5c606a; --ca-on-accent #ffffff. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0b0c10", mode: "fill", frame: [1280, 860] },
};
