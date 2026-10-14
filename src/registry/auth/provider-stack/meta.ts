import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "provider-stack",
  name: "Provider Stack",
  category: "auth",
  description: "Sign-in that starts with the account you already have: Google, Apple, GitHub and Microsoft, each in its own published colours, with a Last used tag. Choose one and the stack gives way to the handoff — your mark and theirs joined by a moving line — until the other side answers, with cancel, a plain reason and retry if it doesn't.",
  tags: ["sign in", "login", "oauth", "social login", "google", "apple", "github", "microsoft", "sso", "handoff"],
  traits: ["click", "keyboard"],
  source: "original",
  isNew: true,
  files: ["ProviderStack.tsx", "provider-stack.css", "handoff.ts", "providers.tsx"],
  dependencies: [],
  prompt:
    "Build a provider-first sign-in card. Props: app {name, mark}, providers (google, apple, github, microsoft), lastUsed, onProvider(id, signal) → Promise resolving with the signed-in name (reject with {reason: 'closed'} when the window is closed), onEmail and theme.\n\nKeep the flow in a reducer: pick → waiting(provider) → done(provider, who), with cancel going back to pick and failure going back to pick with the provider and a reason.\n\nPick: a centred card (410px, 24px corners, hairline and a long soft shadow) on a page with a faint glow of the accent at the top. The app's mark in a rounded square, 'Sign in to {name}', a line saying you'll use an account you already have, then one 48px button per provider in its published style: Google white with a #747775 border and the four-colour G; Apple solid (white on the dark theme, black on the light); GitHub #24292f with the white octocat; Microsoft white with a #8c8c8c border, #5e5e5e text and the four squares. The mark sits at the left and the label is centred. The last used provider wears a small accent pill sitting on the button's top edge. Buttons lift 1px on hover. 'Continue with email instead' is a quiet underlined link below.\n\nWaiting: the card swaps (fade and slight scale) to the handoff: the app's mark and the provider's mark in 64px rounded squares, joined by a dashed wire with three accent dots travelling across in turn, 'Waiting for GitHub…', a line telling you to finish in the window that opened, and a Cancel pill, which aborts the request through an AbortController. Focus moves to Cancel.\n\nFailure: back to the buttons with an alert at the top in plain words ('The GitHub window was closed before you finished. Try again or pick another way in.'), and focus on the provider that failed.\n\nDone: an accent circle pops in and draws a tick, 'You're in, Mara', and 'Signed in with Google. Opening Foldline…', with focus on the heading.\n\nTwo themes. Reduced motion: no swaps, no travelling dots (they sit still along the wire), the tick drawn.",
  interaction: "Choose a provider to start; Cancel while waiting; after a failure, the failed provider is focused for a retry.",
  animation: "The card swaps with a 360ms fade and scale; three dots travel the wire every 1.5s; the tick pops and draws in. Reduced motion removes all of it.",
  a11y: "Real buttons with full labels ('Continue with GitHub'); the waiting and done states are status regions; failures are alerts. Focus moves to Cancel, back to the failed provider, and to the success heading. The marks are decorative.",
  responsive: "The card is fluid up to 410px wide and centred at any size.",
  touchFallback: "Nothing depends on hover.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --ps-accent #8b7bff; --ps-accent-ink #0b0b10; --ps-apple #ffffff; --ps-apple-ink #000000; --ps-card #15151c; --ps-error #ffb4a8; --ps-ink #f3f2f7; --ps-line rgba(255, 255, 255, 0.09); --ps-muted #a09fab; --ps-page #0b0b10. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --ps-accent #5b45e0; --ps-accent-ink #ffffff; --ps-apple #000000; --ps-apple-ink #ffffff; --ps-card #ffffff; --ps-error #b3261e; --ps-ink #15141b; --ps-line rgba(17, 17, 24, 0.09); --ps-muted #5f5d68; --ps-page #f3f2ef. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0b0b10", mode: "fill", frame: [1280, 860] },
};
