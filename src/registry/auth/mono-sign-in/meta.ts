import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "mono-sign-in",
  name: "Mono Sign-in",
  category: "auth",
  description: "A stark black-and-white sign-in. A dark slab carries the wordmark over a slowly drifting dot field; the form puts Continue with Google, GitHub and Microsoft first — in single-colour marks, with a Last used tag — and email underneath, where the password opens in place once the address checks out.",
  tags: ["sign in", "login", "oauth", "google", "github", "microsoft", "social login", "black and white", "monochrome", "split"],
  traits: ["click", "keyboard"],
  source: "original",
  isNew: true,
  files: ["MonoSignIn.tsx", "mono-sign-in.css", "mono.ts", "providers.tsx"],
  dependencies: [],
  promptAllow: ["paper", "night"],
  prompt:
    "Build a strictly black-and-white sign-in page. Props: brand, tagline, providers (google, github, microsoft by default), lastUsed, onProvider(id) → Promise (reject with {reason: 'closed' | 'denied'} or anything else), onSignIn(email, password) → Promise, signUpHref, forgotHref and theme.\n\nLayout: two columns, 1.05 : 1. Left, a slab inset 12px from the page with 18px corners in the opposite colour to the page: a field of 1px dots on a 10px grid at 55% opacity, revealed through a soft radial mask that drifts slowly from corner to corner over 24s; the wordmark huge at the bottom left (up to 8.5rem, weight 600, line-height 0.85, −0.07em, with a dimmed full stop); the tagline; and a mono uppercase footer over a 1px rule. Right, the form centred, at most 380px wide.\n\nForm: 'Sign in to {brand}' and 'New here? Create an account'. Then one outlined button per provider (46px, 10px corners, hairline that turns ink on hover), each with its mark drawn in the current text colour — Google's G, GitHub's octocat, Microsoft's four squares at stepped opacities — 'Continue with Google', and a small outlined 'Last used' pill on the right of the last one used. Pressing one swaps its mark for a spinner and disables the others; failure shows an alert under the form in plain words ('The GitHub window was closed before you finished. Try again.'); success replaces the form with a 'Signed in' confirmation.\n\nUnder an 'or' divider: an email field and a solid 'Continue with email' button. A bad address shows an inline error with an exclamation badge and keeps focus. A good one locks the email (muted, with a 'Change' button inside the field) and opens the password field in place by animating grid-template-rows from 0fr to 1fr, with 'Forgot?' beside its label; focus moves into it and the button becomes 'Sign in'. A wrong password shows the error, thickens the field's border and selects the text.\n\nNo colour anywhere — errors are shown by weight, border and an icon, never red. Two themes: white page with a black slab, and black page with a white slab. Below 760px the slab becomes a short band above the form showing only the wordmark. Reduced motion stops the drift and the opening animation.",
  interaction: "Continue with a provider, or type an email and press Continue to open the password field; Change goes back to the email.",
  animation: "The dot field drifts over 24s; the password field opens over 320ms; spinners turn while waiting. Reduced motion removes the drift and the opening animation.",
  a11y: "A real form with labelled fields, autocomplete hints and aria-invalid. Errors are announced with role=alert and linked with aria-describedby; they're shown with an icon and weight, not colour. The hidden password row is inert until it opens. Busy buttons say aria-busy. The decorative slab is hidden from assistive tech.",
  responsive: "A container query stacks the slab as a short band above the form below 760px.",
  touchFallback: "Nothing depends on hover.",
  variants: [
    { id: "paper", label: "Paper", prompt: "White page (#ffffff) with ink #0a0a0a, muted #5f5f5f and hairlines at 16% ink; the slab is #0a0a0a with #f5f5f5 type." },
    { id: "night", label: "Night", prompt: "Black page (#0a0a0a) with ink #f5f5f5, muted #a3a3a3 and hairlines at 18%; the slab is #f5f5f5 with #0a0a0a type." },
  ],
  preview: { bg: "#ffffff", mode: "fill", frame: [1440, 900] },
};
