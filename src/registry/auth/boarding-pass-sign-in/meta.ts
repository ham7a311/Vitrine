import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "boarding-pass-sign-in",
  name: "Boarding Pass Sign-in",
  category: "auth",
  description: "Signing in as checking in. The form is a boarding pass — email as passenger, password as passcode. Board, and a barcode prints onto the stub bar by bar, the plane crosses the route, and the stub tears away along the perforation to reveal your gate. Bad details get an ink stamp and precise field errors.",
  tags: ["auth", "sign in", "login", "boarding pass", "ticket", "travel", "form", "playful"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["BoardingPassSignIn.tsx", "boarding-pass-sign-in.css"],
  dependencies: [],
  prompt: `Build a sign-in form designed as a boarding pass.

Shape: a two-column grid — the pass (form) and a 13.5rem stub — joined by a perforation. Each half is masked with two radial gradients (11px punched notches at the top and bottom of the seam), intersected with mask-composite, and the stub has a 2px dashed seam. A drop-shadow filter on the wrapper shadows the masked outline. Under 640px the stub moves below the pass and the notches and seam run across.

Pass: a navy band with the airline mark ("Vitrine Air") and "Boarding pass · Sign in"; a route row, MCT Muscat → ATL Vitrine, with a dashed path and a plane icon that flies across on success. Fields are ticket fields: a mono small-caps label ("Passenger · email", "Passcode · password"), an underline input, a Show/Hide button (aria-pressed) for the password, and real error text linked with aria-describedby and aria-invalid. Then "Forgot your passcode?" and a Board pill button.

Stub: passenger name (from the email), gate and seat (dashes until boarded), and a barcode of 34 bars whose widths come from an FNV hash of the email, so the same address always prints the same code.

Flow: validate (email shape; 8+ characters). On failure, or when onSignIn rejects, press a "Check details" stamp onto the pass — a 3px rounded border in red, mono caps, rotated −9°, ink thinned with an feTurbulence mask, multiply-blended — scaling in from 1.7 with an overshoot (340ms), re-keyed each attempt; editing a field removes it. On success the barcode prints bar by bar (scaleY from the bottom, 22ms stagger) while the plane flies the route (1.1s); then the stub tears away, hinged at the perforation's top — a 7° swing, then a fall with rotation and fade (900ms, ease-in) — and the pass shows "Welcome aboard, Hamza." with Gate, Seat and Boarding. Focus moves to that heading and a polite status announces it. The demo accepts any 8+ characters and refuses "wrongpass". Paper and Night.`,
  interaction: "Fill in the pass and press Board. Leave a field empty, or use the passcode “wrongpass”, to see the stamp.",
  animation: "Stamp 340ms with overshoot; barcode bars 160ms with a 22ms stagger; plane 1.1s across the route; stub tear 900ms.",
  a11y: "A real form with labelled inputs, aria-invalid and aria-describedby errors, a Show/Hide toggle with aria-pressed, a polite status for checking and success, and focus moved to the welcome heading. The stamp, stub and route are decorative and aria-hidden; errors are always in text. Reduced motion makes every step instant.",
  responsive: "Two columns from 640px; below that the stub sits under the pass with a horizontal perforation.",
  touchFallback: "Identical on touch.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --boarding-pass-accent #e0603a; --boarding-pass-band #123b5e; --boarding-pass-band-ink #f4efe4; --boarding-pass-card #fffdf8; --boarding-pass-err #b4432f; --boarding-pass-focus #123b5e; --boarding-pass-ink #1b1a17; --boarding-pass-line rgb(27 26 23 / 0.12); --boarding-pass-muted #6f6a62; --boarding-pass-stamp #c2402b. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --boarding-pass-accent #f08a5d; --boarding-pass-band #0f2c47; --boarding-pass-band-ink #e8eef6; --boarding-pass-card #1b1c1f; --boarding-pass-err #f08a74; --boarding-pass-focus #8fb8ff; --boarding-pass-ink #efe8dc; --boarding-pass-line rgb(239 232 220 / 0.12); --boarding-pass-muted #9a98a0; --boarding-pass-stamp #ef6a52. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ece7dd", mode: "fill" },
};
