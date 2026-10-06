import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "milestone-timeline",
  name: "Milestone Timeline",
  category: "time",
  description: "A horizontal plan: a pin for each milestone on a line that fills up to today. Passed milestones are ticked, the next one ahead is ringed and blinking, and later ones are hollow.",
  tags: ["timeline", "milestones", "roadmap", "stepper", "plan", "progress", "horizontal"],
  traits: ["ambient"],
  source: "original",
  files: ["MilestoneTimeline.tsx", "milestone-timeline.css", "timeline.ts"],
  dependencies: [],
  prompt:
    "Build a roadmap for a fictional product, Inter 14.5px/1.5.\n\nPalette (light / dark): ink #18181b / #ececef, muted #6b6b73 / #a1a1aa, faint #a1a1aa / #6b6b73, card #ffffff / #111113, hairline #e6e6ea / #26262b, chip #f3f3f5 / #1c1c20, accent #2563eb / #6ea8fe, ok #15803d / #3fb950, failed #c81e1e / #ff6369, building #b45309 / #f5b14c.\n\nDates: take a 'now' and a time zone (UTC by default) as props and read every date with Intl in that zone, so the server and the browser print the same words. Day labels are 'Today', 'Yesterday' or 'Sun 4 Oct'; every date is a <time datetime>.\n\n'Roadmap' with '<n>% of the plan' beside it, then a horizontal row of five milestones (Research, Design, Private beta, Public beta, Launch), each centred over a 9.5rem-minimum column with a 22px pin, a title, its date and a short note. A 2px hairline joins the pins, and an accent line over it fills to today's position between the dates (growing in over 1.1s). Passed milestones have filled accent pins with a white tick; the next one ahead (in progress) a ringed pin with a blinking dot and a soft halo; upcoming ones are hollow with muted titles. On narrow screens the row scrolls sideways with snap points.\n\nShow it on a #fafafa / #0b0b0c page.",
  interaction: "The row scrolls sideways with snap points on narrow screens and is focusable.",
  animation: "The line grows in over 1.1s and the current pin blinks. Reduced motion removes both.",
  a11y: "A labelled, focusable scroll region with an ordered list; the current milestone has aria-current=step and each says Done, In progress or Upcoming in words.",
  responsive: "The row scrolls sideways under its minimum width.",
  touchFallback: "The row swipes with snap points.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --mltl-accent #2563eb; --mltl-alert #dc2626; --mltl-bad #c81e1e; --mltl-card #ffffff; --mltl-chip #f3f3f5; --mltl-deploy #18181b; --mltl-faint #a1a1aa; --mltl-fixed #13703a; --mltl-fixed-bg #e7f6ec; --mltl-focus #2563eb; --mltl-improved #6b2fd6; --mltl-improved-bg #f2ecff; --mltl-ink #18181b; --mltl-invite #0e7490; --mltl-line #e6e6ea; --mltl-merge #7c3aed; --mltl-new #1d4fd8; --mltl-new-bg #e9f0ff; --mltl-ok #15803d; --mltl-release #2563eb; --mltl-run #b45309; --mltl-soft #6b6b73. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --mltl-accent #6ea8fe; --mltl-alert #ff6369; --mltl-bad #ff6369; --mltl-card #111113; --mltl-chip #1c1c20; --mltl-deploy #ececef; --mltl-faint #6b6b73; --mltl-fixed #6fdc93; --mltl-fixed-bg #0f2416; --mltl-focus #6ea8fe; --mltl-improved #c4a6ff; --mltl-improved-bg #1d1430; --mltl-ink #ececef; --mltl-invite #46c6db; --mltl-line #26262b; --mltl-merge #a98bff; --mltl-new #8db3ff; --mltl-new-bg #0f1b33; --mltl-ok #3fb950; --mltl-release #6ea8fe; --mltl-run #f5b14c; --mltl-soft #a1a1aa. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#fafafa", mode: "fill", frame: [1000, 700] },
  isNew: true,
};
