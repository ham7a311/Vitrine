import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "passkey-sign-in",
  "name": "Passkey Sign-in",
  "category": "auth",
  "description": "Biometric-first sign-in: the fingerprint's ridges draw themselves in, ring by ring, while it verifies \u2014 then gather into a single check. Email stays a quiet fallback.",
  "tags": [
    "auth",
    "passkey",
    "biometric",
    "webauthn",
    "fingerprint",
    "sign-in"
  ],
  "traits": [
    "click",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "PasskeySignIn.tsx",
    "passkey-sign-in.css"
  ],
  "dependencies": [],
  "prompt": "Design a passkey-first sign-in where the fingerprint is the progress indicator. A 120px rounded tile holds a stylised fingerprint made of eight separate ridge paths (concentric, slightly broken arcs, centre first). Each ridge exists twice: a faint base and an accent 'ink' copy with pathLength=1 and dashoffset 1.\n\nStarting the ceremony (the tile or the primary button) draws the ink ridges in from the centre outward, 170ms apart over 900ms, while a soft accent scan band sweeps up and down the tile. On success the ridges fade out in a quick ripple as a single check draws in their place (520ms, 280ms delay), the tile gains a green ring and halo, and the heading becomes 'Welcome back, Hamza'. On failure the print shivers, the ridges turn rose and drain back out, and the status explains what to do. Below: an Instrument Serif heading, a polite status line, a full-width primary button whose label follows the state, and a quiet 'Use email instead' link that folds open an email field and 'Send link'. The verify callback obtains a WebAuthn credential and verifies the assertion on the server; resolve true only after server verification succeeds. Require an async verify callback. Catch cancellation and network errors, return to a retryable failure state, and prevent duplicate requests. Show the email fallback only when onSendLink is provided; submit the email through that callback and announce success or failure. Make the welcome name configurable. Keep fake verification in the demo only.",
  "interaction": "Tap the print or Continue with passkey; on failure, Try again; or open the email fallback.",
  "animation": "Ridges draw centre-out (170ms stagger, 900ms), scan band 1.3s alternate, success check 520ms, failure shiver 420ms and drain 700ms, fallback fold 420ms.",
  "a11y": "Both the print and the primary button are labelled buttons; status is a polite live region; the email fallback is a disclosure with aria-expanded and real inputs (16px to avoid iOS zoom). Reduced motion switches states instantly.",
  "responsive": "Fluid to 22rem; centred.",
  "variants": [
    {
      "id": "night",
      "label": "Night"
    },
    {
      "id": "paper",
      "label": "Paper"
    }
  ],
  "preview": {
    "bg": "#0b080d",
    "mode": "fill"
  },
  "touchFallback": "Designed for taps; the email field uses the email keyboard."
};
