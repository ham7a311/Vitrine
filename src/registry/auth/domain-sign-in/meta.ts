import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "domain-sign-in",
  name: "Domain Sign-in",
  category: "auth",
  description: "Identifier-first sign-in: type your email and the form works out where you belong. A company domain goes to its single sign-on (you see the company and its identity provider before you even press Next), gmail.com to Continue with Google, outlook.com to Microsoft, anything else to a password — with the address folded into a chip you can step back from.",
  tags: ["sign in", "login", "identifier first", "sso", "saml", "google", "microsoft", "enterprise", "email", "multi-step"],
  traits: ["keyboard", "click"],
  source: "original",
  isNew: true,
  files: ["DomainSignIn.tsx", "domain-sign-in.css", "route.ts", "providers.tsx"],
  dependencies: [],
  prompt:
    "Build an identifier-first sign-in. Props: app {name, mark}, orgs [{domain, name, color, idp}], onHandoff(kind, email, org?) → Promise, onPassword(email, password) → Promise, createHref, forgotHref and theme.\n\nRouting (a pure function): parse the domain from the email; a domain equal to an org's domain, or a subdomain of it, goes to that org's single sign-on; gmail.com and googlemail.com go to Google; outlook.com, hotmail.com, live.com and msn.com go to Microsoft; anything else goes to a password; a malformed address is invalid. While typing, once the text after @ matches an org's domain exactly, a hint chip pops in under the field: the org's colour square with its initial and 'Northwind signs in with Okta'.\n\nCard: 448px, 28px corners, soft shadow, the app mark in a rounded square at the top. Step one: 'Sign in' (2rem, weight 500), 'to continue to {name}', an outlined 56px email field with a floating label that rises when focused or filled and takes the accent colour, the hint line under it (or the error, with an exclamation badge, when the address is wrong or empty), then 'Create account' as a text button on the left and a pill 'Next' on the right.\n\nStep two slides in from the right (the two steps share one grid cell; the other is faded, hidden and inert), with the address as a chip at the top (an initial avatar, the email, a chevron) that goes back. Then only the way in for that address:\n- SSO: the org as a tile (colour square, name, 'Managed by your administrator'), a line explaining you'll come straight back, and 'Continue to Okta'.\n- Google or Microsoft: 'This looks like a Google account…', a full-width button in that provider's published style, and 'Use a password instead'.\n- Password: a floating-label password field, 'Show password', 'Forgot password?' and Next; a wrong password marks the field and says so.\nPending buttons show a spinner. Success says 'Welcome back. Opening {name}…'. Focus moves to the first control of each step. A small footer row sits under the card. Two themes.",
  interaction: "Type an email and press Next; the next step depends on the domain. The chip goes back to the email. Google and Microsoft accounts can still choose a password.",
  animation: "Steps slide 40px and fade over 380ms; the org hint pops in; labels float over 160ms. Reduced motion removes the motion.",
  a11y: "Real forms with labelled fields, autocomplete hints, aria-invalid and descriptions; the hint line is a polite live region and errors carry an icon as well as colour. The hidden step is inert and aria-hidden. Focus moves into each step.",
  responsive: "The card is fluid up to 448px; padding tightens below 480px.",
  touchFallback: "Nothing depends on hover; the email field uses the email keyboard.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --ds-accent #2f55d4; --ds-card #ffffff; --ds-error #b3261e; --ds-ink #1b1d22; --ds-line #b9bec8; --ds-muted #5a5f6a; --ds-on-accent #ffffff; --ds-page #edf0f5; --ds-soft rgba(27, 29, 34, 0.06). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --ds-accent #a9c0ff; --ds-card #191b21; --ds-error #ffb4ab; --ds-ink #eceef3; --ds-line #4a4f5b; --ds-muted #a2a7b3; --ds-on-accent #0e1a3d; --ds-page #0e1014; --ds-soft rgba(236, 238, 243, 0.07). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#edf0f5", mode: "fill", frame: [1280, 860] },
};
