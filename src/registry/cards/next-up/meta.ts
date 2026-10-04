import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "next-up",
  name: "Next Up",
  category: "cards",
  description: "The next-meeting card whose composition follows its distance in time: the date leads days away, the title leads that morning, the countdown and Join take over in the last minutes, a line tracks it while it runs, and afterwards it asks for notes.",
  tags: ["calendar", "event", "meeting", "countdown", "time", "widget", "join", "lifecycle"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["NextUp.tsx", "next-up.css"],
  dependencies: [],
  prompt: `Build an event card that is one object with five compositions, chosen by how far away the event is.

<NextUp title start end now place people onJoin onNotes theme motion />. now is a prop so a demo or server clock drives it. phaseAt(now, start, end) returns: far (more than 24h to start), today (15min to 24h), soon (up to 15min), live (between start and end) or done.

The card has six named parts that never change identity: date (a big serif day number over a small-caps month, divided by a hairline), title (serif), meta (time range, place, people), lead (a line whose text changes per phase: 'in 3 days', 'in 3 h 20 min', '12 min', '21 min left', 'Ended 2 min ago'), track (a 2px progress line) and action. Each phase is a grid-template-areas composition:
- far: date | title, meta, lead + Details (quiet).
- today: title at 1.5rem leads, then meta, then the lead in ink beside Details.
- soon: the lead becomes a 3.1rem serif countdown on top, then title, meta, and a large primary Join.
- live: title, meta, lead in the live red beside a primary 'Join now', and a red track filling as the meeting progresses.
- done: the title goes muted, the track is full and grey, and the action becomes a quiet 'Add notes' with a tick.

When the phase changes, FLIP each part: measure every [data-part] before and after, and animate translate from the old position to none (480ms, cubic-bezier(0.2, 0.8, 0.2, 1)), so the same title, lead and action travel to their new places. Reduced motion snaps.

The demo has step buttons for each phase and a Play through button. Paper and Night themes.`,
  interaction: "Step through the phases or press Play through: the card recomposes as time passes. Join and Add notes are live buttons.",
  animation: "Parts glide to their new places between phases (480ms FLIP); the progress line fills while the meeting runs.",
  a11y: "A labelled section; the visual countdown is aria-hidden and a polite status region announces 'starts in 12 min' and 'is on now' at the right moments. Every phase has a real button with a text label. Reduced motion snaps between compositions.",
  responsive: "Fluid to 320px; the date block and countdown scale down under 380px.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
