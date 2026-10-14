import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "handle-sign-up",
  name: "Handle Sign-up",
  category: "auth",
  description: "Sign-up in three short steps. Start with GitHub, Google or email; claim a handle while it checks availability as you type, explains exactly what's wrong with a bad one, and offers free handles built from your name when yours is taken; then meet your new profile card.",
  tags: ["sign up", "register", "onboarding", "username", "handle", "availability", "github", "google", "multi-step", "profile"],
  traits: ["keyboard", "click"],
  source: "original",
  isNew: true,
  files: ["HandleSignUp.tsx", "handle-sign-up.css", "handle.ts", "providers.tsx"],
  dependencies: [],
  prompt:
    "Build a three-step sign-up. Props: brand, providers (github and google by default), onStart({provider} | {email, password}) → Promise<{name, avatar?, via?}>, checkHandle(handle) → Promise<boolean>, onFinish({name, handle}) → Promise, homeHref and theme.\n\nCard (440px, 24px corners) with a progress rail at the top: three numbered steps (Account, Profile, Done) joined by short hairlines; the current step's number is solid ink, finished steps show a tick in the accent; the list item has aria-current=step.\n\nAccount: 'Join {brand}', a line about bringing your profile, two provider buttons side by side in their published styles (GitHub #24292f with the octocat, Google white with a #747775 border and the four-colour G), an 'or with email' divider, then email and password (at least 10 characters, with the rule shown under the field) and Continue. Pending buttons show a spinner.\n\nProfile: 'Claim your handle', a tile with the avatar (the image, or initials on an accent-to-blue gradient), the name and 'Imported from GitHub' with its mark, then Display name, and a handle field with a fixed '@' prefix and a status icon at the right. Typing tidies the value (drops a leading @, lowercases, turns spaces into underscores). Validation, in order: at least 3 characters, at most 20, only a–z, 0–9 and underscores, no leading or trailing underscore, no double underscore — the first problem is shown in words. A valid handle is checked 350ms after typing stops (spinner); answers to stale checks are ignored. Free: a tick pops in and '@mara_k is yours.'; taken: a cross, a red border and '@mara is taken.', and up to three free suggestions built from the name (first_last, firstlast, first_l, first_builds…, skipping any already seen as taken) as chips that fill the field. Create account is enabled only when the handle is free and the name isn't empty; if it's taken in the meantime, say so.\n\nDone: 'You're in, Mara' and a profile card rising in: a gradient banner, the avatar overlapping it with a ring, the name, @handle and 'Joined October 2026 · 0 following · 0 followers', then 'Open your feed'. Focus moves to each step's heading. Two themes. Reduced motion: no slides or pops.",
  interaction: "Start with a provider or email; type a handle and watch it check; tap a suggestion to use it; create the account.",
  animation: "Steps slide in over 320ms; the free tick pops; suggestions stagger in; the profile card rises over 520ms. Reduced motion removes all of it.",
  a11y: "Labelled fields with autocomplete hints; the handle's status is a polite live region linked to the field, and taken or invalid states set aria-invalid. The progress rail marks the current step. Errors are alerts. Focus moves to each step's heading.",
  responsive: "The card is fluid up to 440px; the provider buttons stack below 420px.",
  touchFallback: "Nothing depends on hover; the handle field turns off autocorrect and capitalisation.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --hs-accent #7cf2c2; --hs-bad #ff9e8f; --hs-card #15171c; --hs-field #0f1115; --hs-good #7cf2c2; --hs-ink #f1f2f4; --hs-line rgba(255, 255, 255, 0.1); --hs-muted #9da1ab; --hs-on-accent #06281c; --hs-page #0b0c0f. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --hs-accent #0f7a55; --hs-bad #b3261e; --hs-card #ffffff; --hs-field #f7f6f2; --hs-good #0f7a55; --hs-ink #14161a; --hs-line rgba(18, 20, 24, 0.12); --hs-muted #5c606a; --hs-on-accent #ffffff; --hs-page #f2f1ec. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0b0c0f", mode: "fill", frame: [1280, 900] },
};
