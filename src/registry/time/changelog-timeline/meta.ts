import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "changelog-timeline",
  name: "Changelog Timeline",
  category: "time",
  description: "Releases newest first: the version and day on the left, a rail with the latest release lit in the accent, and a title with notes tagged New, Improved or Fixed.",
  tags: ["timeline", "changelog", "release notes", "versions", "history", "updates", "what's new"],
  traits: ["ambient"],
  source: "original",
  files: ["ChangelogTimeline.tsx", "changelog-timeline.css", "timeline.ts"],
  dependencies: [],
  prompt:
    "Build a changelog for a fictional product, Inter 14.5px/1.5.\n\nPalette (light / dark): ink #18181b / #ececef, muted #6b6b73 / #a1a1aa, faint #a1a1aa / #6b6b73, card #ffffff / #111113, hairline #e6e6ea / #26262b, chip #f3f3f5 / #1c1c20, accent #2563eb / #6ea8fe, ok #15803d / #3fb950, failed #c81e1e / #ff6369, building #b45309 / #f5b14c. Tags: New #1d4fd8 on #e9f0ff, Improved #6b2fd6 on #f2ecff, Fixed #13703a on #e7f6ec (dark: #8db3ff on #0f1b33, #c4a6ff on #1d1430, #6fdc93 on #0f2416).\n\nDates: take a 'now' and a time zone (UTC by default) as props and read every date with Intl in that zone, so the server and the browser print the same words. Day labels are 'Today', 'Yesterday' or 'Sun 4 Oct'; every date is a <time datetime>.\n\n'Changelog' heading, then releases newest first in three columns: on the left a mono version chip ('v2.4.0') above the day, in the middle a rail with an 11px dot (the latest filled in the accent with a soft halo, older ones hollow), on the right a 600 title and a list of notes, each starting with a fixed-width tag chip. On narrow screens the version sits above each entry.\n\nShow it on a #fafafa / #0b0b0c page.",
  interaction: "None; it's a reading view.",
  animation: "None.",
  a11y: "A labelled section with real headings, an ordered list of releases and a list of notes each; tags are words, not only colours; every date is a <time>.",
  responsive: "Three columns that collapse to a single column under 34rem.",
  touchFallback: "Nothing to tap.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --chgl-accent #2563eb; --chgl-alert #dc2626; --chgl-bad #c81e1e; --chgl-card #ffffff; --chgl-chip #f3f3f5; --chgl-deploy #18181b; --chgl-faint #a1a1aa; --chgl-fixed #13703a; --chgl-fixed-bg #e7f6ec; --chgl-focus #2563eb; --chgl-improved #6b2fd6; --chgl-improved-bg #f2ecff; --chgl-ink #18181b; --chgl-invite #0e7490; --chgl-line #e6e6ea; --chgl-merge #7c3aed; --chgl-new #1d4fd8; --chgl-new-bg #e9f0ff; --chgl-ok #15803d; --chgl-release #2563eb; --chgl-run #b45309; --chgl-soft #6b6b73. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --chgl-accent #6ea8fe; --chgl-alert #ff6369; --chgl-bad #ff6369; --chgl-card #111113; --chgl-chip #1c1c20; --chgl-deploy #ececef; --chgl-faint #6b6b73; --chgl-fixed #6fdc93; --chgl-fixed-bg #0f2416; --chgl-focus #6ea8fe; --chgl-improved #c4a6ff; --chgl-improved-bg #1d1430; --chgl-ink #ececef; --chgl-invite #46c6db; --chgl-line #26262b; --chgl-merge #a98bff; --chgl-new #8db3ff; --chgl-new-bg #0f1b33; --chgl-ok #3fb950; --chgl-release #6ea8fe; --chgl-run #f5b14c; --chgl-soft #a1a1aa. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#fafafa", mode: "fill", frame: [1000, 700] },
  isNew: true,
};
