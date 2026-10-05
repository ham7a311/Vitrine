import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "one-field-sign-in",
  "name": "One-Field Sign-in",
  "category": "auth",
  "description": "Email, code, signed in \u2014 all inside one field. The field changes width and contents between steps, labels hand off, and a hairline along its base shows how far along you are.",
  "tags": [
    "auth",
    "sign-in",
    "otp",
    "magic-code",
    "morph",
    "form"
  ],
  "traits": [
    "keyboard",
    "click",
    "touch"
  ],
  "source": "original",
  "files": [
    "OneFieldSignIn.tsx",
    "one-field-sign-in.css"
  ],
  "dependencies": [],
  "prompt": "Build a passwordless sign-in where the whole flow happens inside one field. A 68px-tall rounded field (16px radius, surface + hairline ring, accent focus ring) holds three stacked layers; only one is 'on' at a time. Layers cross-fade and slide 14px (out 300ms, in 360ms after a 140ms delay) and each step has its own small mono label in the top-left that lifts away as the next settles in.\n\n1. Email: an email input and a square ink 'go' button; submitting validates, shows a spinner in the button ('sending'), then moves on.\n2. Code: the field narrows (width eases over 620ms) and shows six slots (grouped 3+3) under a label 'Code sent to h\u2022\u2022\u2022\u2022@domain' \u2014 a single transparent one-time-code input sits over the slots; typed digits drop in, the caret blinks in the next slot, six digits auto-submit and the slots pulse in sequence while checking. A wrong code shakes the field, turns the progress rule rose and clears the slots. 'Change' goes back.\n3. Done: the field narrows again into a full pill containing an initial avatar, the email, and a check that draws in.\n\nA 2px hairline along the field's bottom edge is the progress bar (12% \u2192 40% \u2192 62% \u2192 86% \u2192 100%, 760ms), fading out once signed in. Headline and helper text update per step. Ship a night theme and a warm paper theme. Require sendCode(email) and verify(code, email) callbacks. Await delivery before opening the code step. Catch delivery and verification failures, announce them, restore focus and allow retry. Prevent duplicate requests. The demo alone simulates delivery and verification; no real email is sent by the demo.",
  "interaction": "Type an email and press Enter/\u2192; type or paste the six-digit code (auto-submits); 'Change' returns to the email step.",
  "animation": "620ms field width/radius morph; layered cross-fade with 140ms hand-off; 760ms progress hairline; digit drop, sequential pulse while checking, shake on error, check draw on success.",
  "a11y": "Real labelled inputs (email with autocomplete=email, code with autocomplete=one-time-code and inputMode numeric); aria-invalid + a polite status line for sending/checking/errors/success; focus moves to the right input each step. Reduced motion keeps the states but makes the transitions instant.",
  "responsive": "Fluid up to 26rem; every width is min(100%, \u2026) so it works at 320px.",
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
  "touchFallback": "The numeric keypad opens for the code and SMS/email autofill works through one-time-code."
};
