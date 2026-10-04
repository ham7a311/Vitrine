import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "nocturne-sign-in",
  name: "Nocturne Sign-in",
  category: "auth",
  description: "A single quiet column on near-black with a breathing seam of frost light behind it — email, password, magic link, nothing more.",
  tags: ["authentication", "sign-in", "form", "page", "minimal", "dark"],
  traits: ["click", "keyboard", "ambient"],
  source: "original",
  files: ["NocturneSignIn.tsx", "nocturne-sign-in.css"],
  dependencies: [],
  prompt: `Design a sign-in page that is nearly all darkness. On #08070a, centre one 22rem column: a tracked mono brand line, a large serif "Welcome back." (clamp 2.5–3.25rem, −0.02em), a muted one-line subtitle, then the form.

Behind the column runs the only decoration: a single vertical seam of frost-blue light — a 1px gradient line that fades out at the top and bottom, with a blurred copy for glow and a wide soft halo — that breathes between 55% and 100% opacity every 9 seconds, like a door left ajar in a dark room. Add six faint stars.

Form: an email field and a password field (48px, 10px radius, hairline border, 16px text so iOS never zooms), labels above, a "Forgot?" link aligned with the password label, and an eye button inside the password field whose slash draws on and off with stroke-dashoffset. Focus shows a frost border and a 4px soft ring; invalid fields turn rose with an inline alert message after blur or submit (email format, minimum 8 characters). The primary button is cream on dark; on hover it gains a frost glow and a band of frost light sweeps across it in 900ms. Below an "or" hairline, a ghost button sends a magic link and its label confirms when sent. A quiet "Create an account" line closes the page.`,
  interaction: "Validates on blur and on submit; the eye toggles visibility; the ghost button sends a magic link when the email is valid.",
  animation: "Seam breathes 9s; button light sweep 900ms; focus/border transitions 220ms; eye slash 260ms.",
  a11y: "Real <label>s, autocomplete tokens, aria-invalid + aria-describedby with role=alert errors, an aria-pressed reveal button with a dynamic label, and a polite live region for the magic-link confirmation. Reduced motion stops the breathing and the sweep.",
  responsive: "One fluid column — the heading scales with the container. 16px inputs prevent zoom on iOS.",
  touchFallback: "Nothing depends on hover.",
  preview: { bg: "#08070a", mode: "page", height: 760 },
  featured: true,
};
