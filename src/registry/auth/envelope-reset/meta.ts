import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "envelope-reset",
  name: "Envelope Reset",
  category: "auth",
  description: "A password reset you can watch leave. Send the link and the form becomes a letter that slides into an envelope; the flap folds shut, a wax seal presses on and it's gone. When the email arrives, the envelope comes back, the seal breaks, and the letter that rises out is your new-password form.",
  tags: ["auth", "password reset", "forgot password", "email", "envelope", "3d", "flow"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["EnvelopeReset.tsx", "envelope-reset.css"],
  dependencies: [],
  prompt: `Build a password-reset flow with a physical envelope transition between its steps.

Steps (one card, 25rem): ask (email, Send reset link, Back to sign in) → sent ("Check your inbox", the address, "I've got the email", and Resend with a 30-second countdown) → letter (new password, confirm, and three live rules: 10+ characters, a number or symbol, both match — each with a check and a hidden "done/not yet") → done (a drawn check, "Password updated", Back to sign in). Validation errors are real text tied to the inputs; each step's heading takes focus; a polite status announces sending, sent and updated. onSend and onReset are async props.

The envelope is an aria-hidden scene over the card, made of absolutely-positioned parts in a 900px-perspective stage: a back panel; a letter (a small paper with a heading bar, text lines and an accent button bar); a front pocket clipped to a V (polygon 0 0, 50% 64%, 100% 0, 100% 100%, 0 100%) so the letter only shows through the opening; a triangular flap hinged at the top edge (transform-origin 50% 0), open at rotateX(180°) behind the letter and shut at 0° over it — its z-index is switched by the keyframes mid-fold; and a wax seal (a radial-gradient blob with the product's initial) at the flap's tip.

Folding (2.15s, keyframes on every part): the card disappears at once and the letter appears in its place above the pocket, shrinks to letter size, then slides down into the pocket; the flap swings shut; the seal presses on with an overshoot; the whole envelope flies off to the right, rising and tilting 9°, and fades. Opening (1.9s) runs it back: the envelope flies in from the left, the seal pops and breaks away, the flap swings open behind, the letter rises out and grows, and fades as the new-password card fades in. Timers are cleared on unmount. Paper and Night.`,
  interaction: "Enter an email and send the link; then press “I’ve got the email” to open the envelope and set a new password.",
  animation: "Send: letter in, fold, seal, fly away (2.15s keyframes). Open: fly in, unseal, unfold, rise (1.9s). Steps fade up 420ms; the check draws in 500ms.",
  a11y: "Every step is a real form or group with labelled inputs and text errors; focus moves to each new step's heading; a polite status announces sending, sent and updated; the resend countdown is visible text on a disabled button. The envelope is decoration and aria-hidden. Reduced motion skips the envelope and changes steps at once.",
  responsive: "The card is 25rem at most and fluid below; the envelope is sized to sit inside it on phones.",
  touchFallback: "Identical on touch.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --er-accent #1f4e8c; --er-card #fffdf8; --er-env #e9dcc4; --er-env-flap #e2d2b5; --er-env-front #f1e6d1; --er-err #b4432f; --er-ink #1b1a17; --er-line rgb(27 26 23 / 0.12); --er-muted #6f6a62; --er-ok #1d7a4f; --er-wax #b3362a. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --er-accent #8fb8ff; --er-card #1b1c1f; --er-env #3a342b; --er-env-flap #514839; --er-env-front #463f34; --er-err #f08a74; --er-ink #efe8dc; --er-line rgb(239 232 220 / 0.14); --er-muted #9a98a0; --er-ok #5fc996; --er-wax #d0503f. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#efe9df", mode: "fill" },
};
