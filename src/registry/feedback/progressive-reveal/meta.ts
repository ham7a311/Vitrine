import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "progressive-reveal",
  name: "Progressive Reveal",
  category: "feedback",
  description: "Loading that shows the final layout in order of importance: structure at once, then primary content, then secondary, then details. Placeholders are the exact size of the words they stand for, so nothing shifts, and only the tier being waited on breathes.",
  tags: ["loading", "skeleton", "placeholder", "suspense", "cards", "feed", "article"],
  traits: ["ambient", "click"],
  source: "original",
  files: ["ProgressiveReveal.tsx", "progressive-reveal.css"],
  dependencies: [],
  prompt: `Replace the grey shimmer skeleton with a loading system that communicates hierarchy.

Content is assigned to tiers: tier 1 primary (names, key figures, headlines), tier 2 secondary (descriptions, labels, body), tier 3 details (avatars, sparklines, timestamps, figures). The structure — cards, dividers, grid — is real layout and renders immediately. A provider receives stage 0–4 and resolves tiers in order.

Placeholders are typographically true:
- Reveal.Text is a bar at the real font size, N ch wide and 0.62em tall, sitting on the text's own line.
- Reveal.Lines stacks bars at the real line-height, with the last one short.
- Reveal.Block is the exact width and height of the image or chart it stands for.
Resolving therefore causes zero layout shift.

There is no shimmer. Only the tier currently being waited on breathes (opacity 1 → 0.45 over 1.8s); everything further down the hierarchy stays still, so you can see what's coming next. When a tier lands, its content fades in over 320ms with a 60ms stagger in reading order.

A threshold of 180ms keeps placeholders invisible (layout reserved, opacity 0), so a fast load never flashes. A failed tier renders an inline fallback ('Activity unavailable · Retry') instead of a broken placeholder.

The demo has Cards (project cards: name and count, then label and description, then mark, sparkline and time), List (an activity feed) and Article (headline, then body and author, then figure and date) modes, with Instant, Fast, Slow and 'Details fail' speeds and a Replay button. Paper and Night themes.`,
  interaction: "Pick a layout and a speed, then Replay. Try 'Details fail' and press Retry.",
  animation: "Waiting tier breathes over 1.8s; resolve is a 320ms fade with a 60ms stagger; placeholders appear after 180ms, never on fast loads.",
  a11y: "The container is aria-busy until complete, with a status message when done. Placeholders are aria-hidden, and failed tiers expose a real Retry button. Reduced motion removes the breathing and the fade; tiers simply appear.",
  responsive: "Placeholders are measured in ch and em, so they scale with the type. Cards stack to one column on small screens.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
