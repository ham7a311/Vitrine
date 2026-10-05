import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "log-tail",
  name: "Log Tail",
  category: "developer",
  description: "A live log that follows new lines until you scroll up, then holds still and counts what arrived. Level filters with counts, pattern highlighting that falls back to plain text on a broken regex, clock or relative times, and only the visible rows rendered.",
  tags: ["logs", "streaming", "tail", "observability", "developer", "virtualized"],
  traits: ["click", "keyboard", "scroll"],
  source: "original",
  files: ["LogTail.tsx", "log-tail.css", "log.ts"],
  dependencies: [],
  prompt:
    "Build a streaming log viewer for a fictional 'masar-api · production'. Lines are { id, t, level: debug|info|warn|error, source, msg }; the parent appends to the array and the view reacts.\n\nLayout: a 12px-radius panel in IBM Plex Sans with IBM Plex Mono for the log. Toolbar: the title with a small green dot that pulses while following, four level toggle chips (uppercase mono, each with its count, tinted by level when on: grey, blue, amber, red; debug starts off), a regex search field, an 'Only matches' checkbox and a Clock/Relative time toggle. Under it a one-line note: the match count, or why the pattern is invalid ('missing ), searching literally'). The log is a bordered mono area with 22px rows: time (HH:MM:SS.mmm or '12s ago'), the level in bold colour, the source with a › and the message, ellipsised. Error rows get a faint red wash; matches get a yellow mark.\n\nWindowing: a spacer of rows × 22px with only the rows in view (plus 8 overscan) absolutely positioned. Follow: while scrolled to the bottom, new lines keep it pinned; scrolling up pauses, new lines are marked with a blue left rule and a floating pill shows '12 new ↓'; clicking it or scrolling to the end resumes. A footer says 'Following new lines' or 'Paused at line 412 of 640'.",
  interaction:
    "Scroll up to pause and down to the end to resume, or click the 'new ↓' pill. Chips toggle levels; typing highlights matches; the checkbox hides non-matching lines; the time button switches format. The log area is focusable for keyboard scrolling.",
  animation: "The live dot pulses only while following; the pill fades up when it appears. Both stop with reduced motion.",
  a11y: "The log has role=log with aria-live off, so streaming lines are not read aloud; a polite footer reports follow or pause, and the match count or regex error is announced. Level chips use aria-pressed; the search field marks an invalid pattern.",
  responsive: "Below 640px the search takes a full row, times narrow and sources hide.",
  touchFallback: "Touch scrolling pauses and resumes the same way; the pill is a large tap target.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#e9eae7", mode: "fill", frame: [1200, 640] },
  isNew: true,
};
