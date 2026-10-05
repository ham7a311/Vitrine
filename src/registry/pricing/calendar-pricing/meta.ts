import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "calendar-pricing",
  name: "Calendar Pricing",
  category: "pricing",
  description: "“Two months free” made literal: the next twelve months sit under the price as calendar pages, and switching to yearly flips the last two over to read Free.",
  tags: ["pricing", "plans", "billing", "yearly", "monthly", "calendar", "saas"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["CalendarPricing.tsx", "calendar-pricing.css"],
  dependencies: [],
  prompt:
    "Build a pricing card for one plan at a time: a segmented plan picker (radiogroup: Solo, Team, Business) and a Monthly / Yearly switch whose yearly side says '2 months free' in green. Below, the plan name in mono caps, a large serif price that rolls up when it changes ('$24 / month' or '$240 / year'), one line under it ('Billed every month. Cancel any time.' or 'That's $20 a month, paid once.'), a sentence about who it's for, and four specific features with ticks.\n\nThen the idea: 'Your next twelve months' as a row of twelve small calendar pages starting this month (two binding holes at the top of each, mono month abbreviation, serif price). Each page has a second page under it, hatched in green with an italic 'Free'. Switching to yearly flips the last two pages up over their top edge (rotateX to 178°, transform-origin top, 900ms ease-in-out, staggered 160ms) to reveal the free pages beneath; switching back lays them down again. The header counts '10 paid · 2 free'.\n\nA button says exactly what you're starting ('Start Team yearly') and a note gives the real renewal date computed from today ('Renews 1 October 2027, with a reminder a week before'). Twelve columns become two rows of six under 640px.",
  interaction: "Pick a plan with clicks or arrow keys; toggle yearly billing to flip the free months.",
  animation: "Price rolls 520ms; free-month pages flip 900ms staggered 160ms; segmented controls fade 200ms.",
  a11y: "The plan picker is a radiogroup with roving tabindex; billing is a switch with a plain label; the price is aria-live. The calendar is described in one sentence for screen readers ('Twelve months for $240; the last 2 are free') and its pages are hidden from them. Reduced motion swaps pages without flipping.",
  responsive: "Two columns become one under 640px; the calendar wraps to 6 × 2 and the controls go full width.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --cp-accent #1f7a4d; --cp-accent-soft rgb(31 122 77 / 0.1); --cp-bg #fbfaf6; --cp-focus #2f5fd0; --cp-ink #1b1a17; --cp-line rgb(27 26 23 / 0.1); --cp-muted #6f6a62; --cp-page #ffffff; --cp-soft rgb(27 26 23 / 0.04). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --cp-accent #7fd1a8; --cp-accent-soft rgb(127 209 168 / 0.12); --cp-bg #141317; --cp-focus #b9cce4; --cp-ink #efe8dc; --cp-line rgb(239 232 220 / 0.1); --cp-muted #9c96a1; --cp-page #1c1b20; --cp-soft rgb(239 232 220 / 0.04). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#efece5", mode: "fill", height: 640 },
};
