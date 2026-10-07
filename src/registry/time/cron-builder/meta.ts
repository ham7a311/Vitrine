import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "cron-builder",
  name: "Cron Builder",
  category: "time",
  description: "One schedule in three linked forms: a sentence you build from menus ('Every weekday at 02:30'), the cron expression with each field labelled and errors pinned to the field, and the next runs laid out across the coming two weeks so the rhythm is visible. Edit any one and the others follow.",
  tags: ["cron", "schedule", "developer", "time zone", "form", "recurring", "jobs"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["CronBuilder.tsx", "cron-builder.css", "cron.ts"],
  dependencies: [],
  prompt:
    "Build a cron schedule editor that shows the same schedule three ways at once, each editable, for a job like 'Masar · nightly backup' in a named time zone.\n\nPanel: a 14px-radius card in IBM Plex Sans with IBM Plex Mono for the expression and times, Newsreader for the sentence, and one teal accent. Header: the job name and 'Times in Asia/Muscat'.\n\n1. Builder: small uppercase labels over 34px controls: 'Runs' (Every few minutes / Every hour / Every day / Every weekday / On chosen days / Once a month / Custom), then only the controls that choice needs: an interval, a minute, a day of the month, a native time input, or seven round day toggles (S M T W T F S, aria-pressed, filled when on). Under it the schedule as a sentence in 22–30px Newsreader: 'Every weekday at 02:30', 'Every 15 minutes', 'At 09:00 on the 1st of every month', 'At 12:00 on the 1st or on Monday'.\n\n2. Expression: a 48px mono input with generous word spacing, and beneath it five tinted cells aligned to the fields, each showing its token and its name (minute · hour · day of month · month · weekday). Invalid input turns the border and the offending field's cell red and prints the specific error: 'Day of month 32 is out of range (1–31).'\n\n3. Runs: 'Next two weeks · 10 runs', a strip of fourteen narrow day columns, each a 72px tall track where every run is a 2px tick placed at its time of day (very busy days become a hatched fill), then the next eight runs as rows: date, time in mono, and 'in 6 h 12 min'.\n\nThe parser supports lists, ranges, steps, month and weekday names, 7 as Sunday and @daily-style macros. Next-run search walks days in the target time zone, applies standard cron's rule that a day matches when either day-of-month or weekday matches if both are restricted, and skips wall-clock times that fall into a daylight-saving gap. The builder reads simple expressions back into its menus and switches to Custom for anything else.",
  interaction:
    "Changing a menu writes the expression; typing an expression updates the sentence, the menus when it fits one of them, and the runs. onChange receives every valid expression. Runs are computed after mount and refreshed each minute.",
  animation: "Run ticks fade and widen in over 260ms when the schedule changes; day toggles fill over 140ms. Reduced motion or motion={false} removes both.",
  a11y:
    "Every control is a labelled native element; day toggles are buttons with full day names and aria-pressed. The sentence is a polite live region so the meaning of an edit is spoken. The expression input has a label, aria-invalid and an error description announced as an alert; the field cells and the strip are decorative, with the run list as the readable version.",
  responsive: "The builder wraps; below 30rem the strip shows one week and field labels shrink.",
  touchFallback: "All controls are native selects, a time input and buttons.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --cronb-accent #0f6b5c; --cronb-accent-soft rgb(15 107 92 / 0.1); --cronb-bad #b3261e; --cronb-bg #fbfbfa; --cronb-card #ffffff; --cronb-ink #17191c; --cronb-line rgb(23 25 28 / 0.12); --cronb-muted #676c74. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --cronb-accent #5fd0b8; --cronb-accent-soft rgb(95 208 184 / 0.12); --cronb-bad #ff8a80; --cronb-bg #131517; --cronb-card #1a1d20; --cronb-ink #e7e9ec; --cronb-line rgb(255 255 255 / 0.1); --cronb-muted #9aa0a8. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#e8ebe9", mode: "center", frame: [900, 860] },
};
