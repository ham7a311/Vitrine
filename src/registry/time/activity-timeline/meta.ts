import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "activity-timeline",
  name: "Activity Timeline",
  category: "time",
  description: "A live activity feed grouped by day: round nodes on a rail (a triangle for deploys, a branch for merges, initials for comments, a red alert), status chips, filter tabs, relative times, and log excerpts or comments that expand in place. New events drop in at the top.",
  tags: ["timeline", "activity", "feed", "audit log", "history", "deploys", "comments", "live"],
  traits: ["click", "keyboard", "ambient"],
  source: "original",
  files: ["ActivityTimeline.tsx", "activity-timeline.css", "timeline.ts"],
  dependencies: [],
  prompt:
    "Build an activity feed for a fictional product team, Inter 14.5px/1.5.\n\nPalette (light / dark): ink #18181b / #ececef, muted #6b6b73 / #a1a1aa, faint #a1a1aa / #6b6b73, card #ffffff / #111113, hairline #e6e6ea / #26262b, chip #f3f3f5 / #1c1c20, accent #2563eb / #6ea8fe, ok #15803d / #3fb950, failed #c81e1e / #ff6369, building #b45309 / #f5b14c.\n\nDates: take a 'now' and a time zone (UTC by default) as props and read every date with Intl in that zone, so the server and the browser print the same words. Day labels are 'Today', 'Yesterday' or 'Sun 4 Oct'; every date is a <time datetime>. Relative times are 'just now', '4m ago', '3h ago', then the clock time.\n\nHeader: 'Activity', a green 'Live' dot that pings, and a segmented filter row (All, Deploys, Comments, Code, Alerts, Team) on a chip background where the pressed one is a raised card (aria-pressed). Below, day groups ('TODAY' in small caps, muted) each holding an ordered list hung on a 1px rail: a 28px round node per event (a filled triangle for deploys, a branch for merges, initials for comments, a solid red circle with '!' for alerts, a person-plus for team, a tag for releases), then '<strong>Layla Haddad</strong> deployed <mono>main</mono> to Production' with an optional status chip (Ready green, Failed red, Building amber with a blinking dot) and the relative time on the right. Some events have 'Show details' (aria-expanded, aria-controls) revealing a mono block on the chip colour. A new event arrives every 7s in the demo and drops in at the top (a 0.35s fade and slide). The feed is a polite live region for additions.\n\nShow it on a #fafafa / #0b0b0c page.",
  interaction: "Filter buttons narrow the feed; 'Show details' buttons expand log excerpts and comments.",
  animation: "New items drop in over 0.35s; the live dot pings; a building status blinks. Reduced motion removes all of it.",
  a11y: "A labelled section with real headings and ordered lists; statuses are words, not only colours; a polite live region announces additions.",
  responsive: "On narrow screens the filters scroll sideways and the times drop under the sentence.",
  touchFallback: "Every control is a tap target.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --actl-accent #2563eb; --actl-alert #dc2626; --actl-bad #c81e1e; --actl-card #ffffff; --actl-chip #f3f3f5; --actl-deploy #18181b; --actl-faint #a1a1aa; --actl-fixed #13703a; --actl-fixed-bg #e7f6ec; --actl-focus #2563eb; --actl-improved #6b2fd6; --actl-improved-bg #f2ecff; --actl-ink #18181b; --actl-invite #0e7490; --actl-line #e6e6ea; --actl-merge #7c3aed; --actl-new #1d4fd8; --actl-new-bg #e9f0ff; --actl-ok #15803d; --actl-release #2563eb; --actl-run #b45309; --actl-soft #6b6b73. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --actl-accent #6ea8fe; --actl-alert #ff6369; --actl-bad #ff6369; --actl-card #111113; --actl-chip #1c1c20; --actl-deploy #ececef; --actl-faint #6b6b73; --actl-fixed #6fdc93; --actl-fixed-bg #0f2416; --actl-focus #6ea8fe; --actl-improved #c4a6ff; --actl-improved-bg #1d1430; --actl-ink #ececef; --actl-invite #46c6db; --actl-line #26262b; --actl-merge #a98bff; --actl-new #8db3ff; --actl-new-bg #0f1b33; --actl-ok #3fb950; --actl-release #6ea8fe; --actl-run #f5b14c; --actl-soft #a1a1aa. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#fafafa", mode: "fill", frame: [1000, 700] },
};
