import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "enquiry-slip",
  name: "Enquiry Slip",
  category: "forms",
  description: "A contact form set as a correspondence slip: To, From, Re and Message on ruled lines. It says when to expect a reply and what time it is where the reader is, validates in place, and when sent the slip is stamped with a reference and locks.",
  tags: ["contact", "form", "enquiry", "message", "validation", "email", "portfolio", "studio"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["EnquirySlip.tsx", "enquiry-slip.css"],
  dependencies: [],
  prompt: `Build a contact form that looks like a slip of correspondence and behaves like a careful form.

Surface: a sheet (max 40rem, 4px radius, 1px ring, soft long shadow) with ruled rows instead of boxed inputs. Each row is a 5.5rem label column and a field column, a hairline underneath; labels are mono capitals (11px, 0.14em). Below 28rem the label stacks over the field (container query). On focus the row's rule and label darken to ink.

Rows: To (recipient's name in a 22px serif, and their address as a small mono button that copies it, for people who would rather use their own mail app); From (name); Reply to (email); Re (a radio group of 3 to 5 topic chips: pills with a 1px inset ring, the chosen one filled with ink; native radios kept for keyboard and screen readers, focus ring on the chip); Message (a borderless textarea that grows with its content up to 280px).

Honest footer: "Replies within two working days. It is 14:32 in Hamza's city now." with the time read from Intl.DateTimeFormat in the recipient's IANA time zone, refreshed every 20 seconds. A solid pill Send button (44px).

Validation: on blur and on submit. Name required; email by a simple pattern; a topic required; message at least 20 characters, with the error counting down the characters left. Errors sit under their field as role=alert text in the danger colour, the row's rule turns danger, aria-invalid and aria-describedby are set, and a failed submit moves focus to the first invalid field.

Sending: onSend may return a promise; the button reads "Sending" and is aria-busy. On rejection the slip stays open with "That didn't go through. Nothing was lost". On success every field locks and a stamp, "Received" over a reference like HB-4821, is pressed once at the lower right: a 2px red outlined box rotated -6deg, 220ms from scale 1.35 and opacity 0 to rest, multiply-blended on paper. A role=status line announces the reference, and "Write another" resets. Paper and Night themes.`,
  interaction: "Fill the slip and send it; try sending it empty to see the errors, then write another after the stamp lands.",
  animation: "Chip and rule colour changes 160ms; the stamp presses in over 220ms; the message grows as you write.",
  a11y: "Real labels, a labelled radiogroup of native radios for the topic, aria-invalid and aria-describedby on errors with role=alert, focus moved to the first invalid field, and a status line announcing the reference. The stamp is decorative. Reduced motion removes the press.",
  responsive: "Container query at 28rem stacks labels above fields; chips wrap; the stamp stays inside the sheet.",
  touchFallback: "Native inputs, 44px send and 36px chips; the copy-address button is a plain button.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --es-accent #2f6bff; --es-danger #b42318; --es-ink #1b1a17; --es-line rgb(27 26 23 / 0.16); --es-muted #6b6861; --es-paper #fffefb; --es-stamp #b42318. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --es-accent #7aa2ff; --es-danger #f0766e; --es-ink #ececea; --es-line rgb(255 255 255 / 0.14); --es-muted #8d8f95; --es-paper #17181b; --es-stamp #f0766e. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f1efe8", mode: "fill", height: 700 },
  isNew: true,
};
