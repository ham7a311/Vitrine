import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "waitlist-hero",
  name: "Waitlist Hero",
  category: "heroes",
  description: "A launch hero whose sign-up works like a ticket dispenser: join, and a stub feeds out of the form with your place in line rolling into view and an honest estimate of the wait.",
  tags: ["hero", "waitlist", "launch", "beta", "form", "email", "ticket", "referral"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["WaitlistHero.tsx", "waitlist-hero.css"],
  dependencies: [],
  prompt:
    "Build a centred launch hero: a pill eyebrow ('Vitrine for iPhone · Private beta'), a serif headline, a short paragraph, then a single-field form (email + 'Join the waitlist') with a quiet line beneath: '1,283 people ahead of you · 200 let in every Monday'.\n\nValidate on submit with specific messages (empty: 'Enter your email so we can let you in'; malformed: 'Check for a missing @ or dot'); the field's ring turns red and the hint becomes the error, announced politely. Submitting swaps the button label to 'Joining…' and then 'Joined' with a check (labels cross with a short rise).\n\nThe confirmation is a ticket that feeds out from under the form: a slot opens (grid-template-rows 0fr → 1fr) while a cream paper stub slides down from behind the form (translateY −100% → 0, 900ms expo-out), with a dashed perforation along its top. On the ticket: 'Your place in line' and a large serif '#1,284' whose digits roll like reels into place, staggered 110ms; an estimate computed from the queue ('About 7 weeks at 200 a week. We'll email you the day you're in'); and a tear-off stub, separated by a dashed line with two semicircle notches cut by a CSS mask, offering 'Move up 100 places for each friend who joins with your link' and a copyable link. Focus moves to the ticket's heading, whose accessible name includes the number. onJoin(email) resolves to the real position.",
  interaction: "Type an email and press Enter or the button. Errors are specific; the ticket appears on success and its link can be copied.",
  animation: "Slot opens and ticket feeds 900ms; digits roll 1.4s staggered 110ms; button labels cross 200–400ms.",
  a11y: "A labelled email input with aria-invalid and an aria-live hint that carries errors. On success focus moves to the ticket heading, which reads 'Your place in line, number 1,284'. The reel digits are aria-hidden. The ticket is inert until it appears. Reduced motion shows everything immediately.",
  responsive: "Below 520px the field and button stack and the stub moves under the ticket with a horizontal perforation.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --wlh-accent #b9cce4; --wlh-bg #0b0b0e; --wlh-btn #efe8dc; --wlh-btn-ink #121114; --wlh-error #f2a6a0; --wlh-field #141418; --wlh-ink #efe8dc; --wlh-line rgb(239 232 220 / 0.12); --wlh-muted #9c97a0; --wlh-paper #f4efe4. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --wlh-accent #2f5fd0; --wlh-bg #f3f0e9; --wlh-btn #1b1a17; --wlh-btn-ink #f3f0e9; --wlh-error #b3261e; --wlh-field #ffffff; --wlh-ink #1b1a17; --wlh-line rgb(27 26 23 / 0.12); --wlh-muted #6f6a62; --wlh-paper #fffdf7. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0b0b0e", mode: "fill", height: 640, frame: [1280, 800] },
};
