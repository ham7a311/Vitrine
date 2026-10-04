import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "code-cascade-verify",
  name: "Code Cascade Verify",
  category: "auth",
  description: "A one-time-code screen where a pasted code drops into its six cells one after another, a wrong code sends a damped wave along the row from the cell you were on, and a right one rolls the digits away into a single Verified pill.",
  tags: ["auth", "otp", "2fa", "verification", "code", "email", "cascade"],
  traits: ["keyboard", "click"],
  source: "original",
  files: ["CodeCascadeVerify.tsx", "code-cascade-verify.css"],
  dependencies: [],
  prompt: `Build an email-code verification card: a title, 'Enter the 6-digit code we sent to h•••@tryvitrine.dev', six drawn cells, a status line, a Resend button and a 'Use a different email' link.

Use one real <input inputMode="numeric" autoComplete="one-time-code" maxLength={6}> laid transparently over the whole row (transparent text and caret), so typing, pasting and SMS/email autofill all work; the cells are aria-hidden drawings of its value. The cell at the cursor gets an accent ring and a blinking caret while focused.

When several digits arrive at once, give each new digit an animation delay of 70ms × its position among the new ones, so a paste drops in left to right (each digit rises 70% with a slight overshoot, 360ms). At six digits, verify automatically: a soft pulse passes along the cells while checking. Wrong: tint the cells red and run a damped vertical wave (−9px, +5px, −2px) outward from the last-typed cell, each cell delayed 60ms per cell of distance with its amplitude shrinking — flip between two identical keyframes so it replays every time — then clear after 900ms and refocus. Say what to do in a role=alert line. Right: the digits roll up and away in order and a single green 'Verified' pill scales in over the row as its check draws.

Resend counts down 30s as a line round the pill-shaped button: a conic-gradient ring (registered --p, 1 → 0) masked to 1.5px with mask-composite exclude. At zero, the ring's padding grows until it fills the pill and the label becomes 'Resend code'. Paper and Night.`,
  interaction: "Type or paste the code (the demo accepts 246810). Wait out the countdown to resend.",
  animation: "Digits drop in 360ms, 70ms apart; wrong-code wave 620ms, 60ms per cell; success roll-out 420ms staggered, then the pill and check.",
  a11y: "A single labelled input with one-time-code autocomplete and aria-describedby on the status line; errors are role=alert and set aria-invalid. The input becomes read-only while checking and after success. Resend uses aria-disabled during the countdown so it stays focusable and readable. Reduced motion collapses every animation to an instant change.",
  responsive: "Up to 25rem; cells tighten under 400px.",
  touchFallback: "The numeric keypad opens; iOS and Android offer the code from the message.",
  variants: [
    { id: "night", label: "Night" },
    { id: "paper", label: "Paper" },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
