import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "activity-timeline",
  name: "Activity Timeline",
  category: "time",
  description: "Time laid out three ways: a live activity feed grouped by day with filters, status chips and expandable details; a changelog of releases with tagged notes; and a horizontal plan of milestones with its line filled up to today.",
  tags: ["timeline", "activity", "feed", "changelog", "release notes", "milestones", "roadmap", "stepper", "history", "audit log"],
  traits: ["click", "keyboard", "ambient"],
  source: "original",
  files: ["ActivityTimeline.tsx", "activity-timeline.css", "timeline.ts"],
  dependencies: [],
  prompt:
    "Build a timeline component in the single layout selected below, for a fictional product team. Inter 14.5px/1.5.\n\nPalette (light / dark): ink #18181b / #ececef, muted #6b6b73 / #a1a1aa, faint #a1a1aa / #6b6b73, card #ffffff / #111113, hairline #e6e6ea / #26262b, chip #f3f3f5 / #1c1c20, accent #2563eb / #6ea8fe, ok #15803d / #3fb950, failed #c81e1e / #ff6369, building #b45309 / #f5b14c.\n\nDates: take a 'now' and a time zone (UTC by default) as props and read every date with Intl in that zone, so the server and the browser print the same words. Day labels are 'Today', 'Yesterday' or 'Sun 4 Oct'; relative times are 'just now', '4m ago', '3h ago', then the clock time. Every date is a <time datetime>.\n\nShow it on a #fafafa panel and a #0b0b0c panel.",
  interaction: "Filter buttons (aria-pressed) narrow the feed; 'Show details' buttons expand log excerpts and comments (aria-expanded, aria-controls); the milestone row scrolls sideways with snap points and is focusable.",
  animation: "New feed items drop in over 0.35s; the live dot pings; a building status blinks; the milestone line grows in on load. Reduced motion removes all of it.",
  a11y: "A labelled section with real headings and ordered lists. The feed is a polite live region for additions; statuses are words, not only colours; milestones mark the current one with aria-current=step and say Done / In progress / Upcoming.",
  responsive: "On narrow screens the filters wrap under the title, feed times drop under the sentence, the changelog puts the version above each entry, and the milestones scroll sideways.",
  touchFallback: "Every control is a tap target; the milestone row swipes.",
  variants: [
    { id: "activity", label: "Activity", prompt: "Activity: a header with 'Activity', a green 'Live' dot that pings, and a segmented filter row (All, Deploys, Comments, Code, Alerts, Team) on a chip background where the pressed one is a raised card. Below, day groups ('TODAY' in small caps, muted) each holding an ordered list hung on a 1px rail: a 28px round node per event (a filled triangle for deploys, a branch for merges, initials for comments, a solid red circle with '!' for alerts, a person-plus for team, a tag for releases), then '<strong>Layla Haddad</strong> deployed <mono>main</mono> to Production' with an optional status chip (Ready green, Failed red, Building amber with a blinking dot) and the relative time on the right. Some events have 'Show details' revealing a mono block on the chip colour. A new event arrives every 7s in the demo and drops in at the top." },
    { id: "changelog", label: "Changelog", prompt: "Changelog: 'Changelog' heading, then releases newest first in three columns: on the left a mono version chip ('v2.4.0') above the day, in the middle a rail with an 11px dot (the latest filled in the accent with a soft halo, older ones hollow), on the right a 600 title and a list of notes, each starting with a fixed-width tag: New (blue on pale blue), Improved (violet on pale violet), Fixed (green on pale green)." },
    { id: "milestones", label: "Milestones", prompt: "Milestones: 'Roadmap' with '<n>% of the plan' beside it, then a horizontal row of five milestones (Research, Design, Private beta, Public beta, Launch), each centred over a 9.5rem-minimum column with a 22px pin, a title, its date and a short note. A 2px hairline joins the pins, and an accent line over it fills to today's position between the dates (growing in over 1.1s). Passed milestones have filled accent pins with a white tick; the next one ahead (in progress) a ringed pin with a blinking dot and a soft halo; upcoming ones are hollow with muted titles. On narrow screens the row scrolls sideways with snap points." },
  ],
  preview: { bg: "#fafafa", mode: "fill", frame: [1200, 760] },
  isNew: true,
};
