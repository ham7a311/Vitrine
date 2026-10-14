import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "annotated-timeline",
  name: "Annotated Timeline",
  category: "analytics",
  description: "A metric over time with the things that happened to it pinned underneath — deploys, incidents and feature flags, each on a stem up to the line. Point at or step to a pin and its note opens above the chart, the days after it are shaded, and the change against the days before is measured for you.",
  tags: ["chart", "timeline", "annotations", "events", "deploys", "incidents", "analytics", "observability", "svg", "line"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  isNew: true,
  files: ["AnnotatedTimeline.tsx", "annotated-timeline.css", "timeline.ts", "curve.ts"],
  dependencies: [],
  prompt:
    "Build a line chart with events pinned underneath it. Props: title, values[], labels[], events [{id, at (index), kind: deploy | incident | flag, title, body, by, window (points to measure, default 5)}], format, change (\"pts\" for percentage points or \"%\" for relative), and theme.\n\nHelpers (pure functions): lanes — given pin x positions in order, put each in the lowest of up to three lanes where it's at least 26px from the last pin in that lane, so pins never overlap; impact — the mean of the window from an event's index against the same number of points before it, as an absolute and a relative change; and next — the next or previous visible pin, clamped at the ends.\n\nHeader: the title small and muted, the latest value large with its date, and three filter toggles (aria-pressed) with an icon, a name and a count for each kind. Event colours are the first three slots of a categorical palette — blue deploys, orange incidents, aqua flags — and each kind also has its own icon (an arrow into a tray, a warning triangle, a flag), so colour is never the only cue.\n\nChart (SVG, width from a ResizeObserver): the series as a smooth monotone cubic in the ink colour with a faint area, a y domain padded 18% round the data with four gridlines, and a few date labels. Under the plot, pins sit in their lanes; each has a dashed stem up to a small ring on the line at its date. Pins are real buttons (24px, rounded, outlined in the kind colour) in a toolbar with a roving tabindex: ← → step between visible pins, Home/End jump, Enter toggles a pinned note, Escape closes.\n\nPointing at or focusing a pin: its stem goes solid, its ring fills, the window after it is shaded in its colour at 14%, and a note opens over the chart beside the shaded window — to its right for events in the left half, to the left otherwise, kept inside the card — with a coloured left rule: kind · date · who, the title, a line of detail and the measured change with an arrow, e.g. \"−0.43 pts over the next 3 days vs the 3 before\" in green or red.\n\nTwo themes, night and paper.",
  interaction: "Point at a pin, or tab to the pins and use the arrow keys, to read the event and see its impact; click to keep a note open; filter by kind.",
  animation: "Pins lift slightly on hover; stems and shading change in 160ms. Reduced motion removes the transitions.",
  a11y: "The chart is an image with a summary label; every event is a real button in a toolbar with a roving tabindex and a full label (kind, title, date); the note is a status region. Kinds differ by icon as well as colour, and changes carry an arrow and a sign.",
  responsive: "The chart follows its container (down to 300px); date labels thin out and the note stays inside the card on narrow screens.",
  touchFallback: "Tap a pin to open its note and tap again to close it.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --at-card #121317; --at-deploy #3987e5; --at-down #ff8a7a; --at-flag #1fb07c; --at-incident #e8662e; --at-ink #f2f3f5; --at-line rgba(255, 255, 255, 0.08); --at-muted #9a9ca4; --at-series #e6e8ee; --at-tip #1b1d23; --at-up #5fd39a. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --at-card #ffffff; --at-deploy #2a78d6; --at-down #c2392a; --at-flag #138a5f; --at-incident #d4561f; --at-ink #111318; --at-line rgba(16, 18, 24, 0.09); --at-muted #5b5e66; --at-series #1f2229; --at-tip #ffffff; --at-up #13804a. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0a0b0e", mode: "center", height: 480 },
};
