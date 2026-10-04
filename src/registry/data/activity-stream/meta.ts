import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "activity-stream",
  name: "Activity Stream",
  category: "data",
  description: "An activity log where time has weight: the space between two events grows with the time between them, so a busy half hour reads dense and a quiet afternoon reads as a pause. Days are set in an editorial margin, runs of the same thing fold into one line, and a focused event opens in place.",
  tags: ["activity", "feed", "timeline", "log", "audit", "events", "history"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["ActivityStream.tsx", "activity-stream.css"],
  dependencies: [],
  prompt: `Build a SaaS activity feed (deploys, comments, uploads, assignments, status changes, approvals) with a strong temporal hierarchy and an editorial feel, not a dotted vertical timeline.

Days sit in a left margin: a large serif day numeral, the day name (Today / Yesterday / weekday) and the month, sticky while its events scroll. A full-width ink rule starts each day. Each event is one line:
- a mono time column (relative for the last hour, 'just now' / '14 min ago', otherwise HH:MM, with the full date as a title)
- a small outlined glyph for the kind
- a sentence: bold actor, a verb, the object in medium weight, and an optional status pill (Ready, Failed, Approved, 12 / 12)

The central idea is that vertical space encodes elapsed time. The margin before each event is 7·log2(1 + minutes/6)px, clamped to 2–56px, so a burst of activity packs tight and a long silence opens a visible gap. Gaps of 90 minutes or more are named inside the gap in italic serif with a dotted rule ('3 hours quiet'). You read the rhythm of the day before reading a word.

Consecutive events with the same groupKey by the same actor within 30 minutes fold into one line ('Hamza uploaded 4 files to Wayfinder'); expanding lists them with their times. Clicking or pressing Enter on an event opens its detail in place (a deploy log, a comment's text) under the sentence, marked by a 2px accent rule — the rest of the stream stays exactly as it is. ↑/↓ move between events.

New events enter at the top: existing rows FLIP down (420ms), and the new line fades and drops in with its time in the accent for a moment. There are a loading state (placeholder rows at uneven gaps) and an empty state written as a sentence. Under 34rem the margin becomes an inline day header. Paper and Night themes.`,
  interaction: "Scan the rhythm, click an event to open it, press 'Simulate new event', or switch to the loading and empty states.",
  animation: "Arrivals: 420ms FLIP for the stream plus a 520ms drop-in; detail fold 320ms. The spacing itself is static.",
  a11y: "A role=feed of articles, each with a button that controls its detail (aria-expanded). Days are labelled regions with full dates, and every time has an absolute-time title. Arrow keys move between events. Reduced motion removes the arrival and fold animations; the time spacing is layout, not motion, so it stays.",
  responsive: "Under 34rem of container width, the day margin becomes an inline header and the columns tighten.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#fbfaf6", mode: "fill" },
};
