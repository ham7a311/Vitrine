import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "qr-handoff-sign-in",
  name: "QR Handoff Sign-in",
  category: "auth",
  description: "Sign in by pointing your phone at the screen: the code's frame carries the instructions and time left as a ticker round its edge, a scan sends a ripple out through the code, and approving turns it over to a check.",
  tags: ["auth", "qr", "sign in", "passwordless", "device", "ticker", "mobile"],
  traits: ["hover", "click", "ambient"],
  source: "original",
  files: ["QrHandoffSignIn.tsx", "qr-handoff-sign-in.css"],
  dependencies: [],
  prompt: `Build a 'Sign in with your phone' card around a 248px square frame: a 26px band with 30px corners, and inside it the code on light paper (phones need contrast in either theme).

The band carries a ticker: an SVG rounded-rect loop through the middle of the band, with mono capitals ('SCAN WITH VITRINE · EXPIRES IN 1:58 · MUSCAT · ENCRYPTED ·') repeated to one lap, spread with textLength, in two textPaths one lap apart whose startOffset advances in requestAnimationFrame at 26px/s, easing to 4px/s while the pointer is over the frame. Its words change with the state, and it takes the accent colour after a scan and green after approval.

States: waiting → scanned → approved, or expired after the TTL (120s, counted down in the ticker). Accept a 'code' prop for your real QR SVG; without one, draw a stand-in with QR anatomy (three finders with separators, timing lines, seeded data — not readable) as one rect per module. Each module has --d, its distance from the centre. A new code fades its modules in from the middle (22ms per module of distance). A scan runs a ripple outward (34ms per unit): each module shrinks to 35% in the accent colour and springs back, then the code dims while a ring breathes from the centre, 'Approve on Hamza's iPhone'. Approval flips the card (rotateY 180°, slight overshoot) to a green back face whose circle and check draw in. Expiry blurs the code to 12% and shows a 'Get a new code' button.

Under the frame: a role=status line explaining the current step, optional demo buttons, an 'or' divider and 'Sign in with email instead'. Night and Paper.`,
  interaction: "Hover the frame to slow the ticker. In the demo, press Simulate scan, then Simulate approve, or Expire now and Get a new code.",
  animation: "Ticker 26px/s easing to 4px/s; fade-in 420ms, 22ms per module; ripple 760ms, 34ms per module; flip 900ms; check draws after.",
  a11y: "The code is a role=\"img\" with a label; the ticker is aria-hidden and every fact in it is repeated in the role=status line, which also announces each step. The email fallback is always present. Reduced motion stops the ticker and makes every change instant.",
  responsive: "The card is up to 24rem and the frame is a fixed 248px, which fits a 320px screen.",
  touchFallback: "The ticker keeps its normal speed; everything else is the same.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --qhs-accent #b9cce4; --qhs-band #1b191f; --qhs-bg #141217; --qhs-dot #141217; --qhs-focus #b9cce4; --qhs-ink #efe8dc; --qhs-muted #9c96a1; --qhs-ok #7fd1a8; --qhs-paper #fffaf1; --qhs-rim rgb(239 232 220 / 0.1); --qhs-tick rgb(239 232 220 / 0.62). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --qhs-accent #2f5fd0; --qhs-band #f3efe7; --qhs-bg #fffdf8; --qhs-dot #1b1a17; --qhs-focus #2f5fd0; --qhs-ink #1b1a17; --qhs-muted #6f6a62; --qhs-ok #1f7a4d; --qhs-paper #ffffff; --qhs-rim rgb(27 26 23 / 0.1); --qhs-tick rgb(27 26 23 / 0.6). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0b0a0d", mode: "fill" },
};
