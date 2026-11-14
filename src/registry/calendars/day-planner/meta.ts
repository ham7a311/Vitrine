import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "day-planner",
  name: "Day Planner",
  category: "calendars",
  description: "Schedule your day by weight. Drag a task from the tray onto the day and it takes exactly its length; the time still free is always totalled, and the tray says so when what is left no longer fits.",
  tags: ["calendar", "day planner", "schedule", "time blocking", "tasks", "drag and drop", "agenda"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["DayPlanner.tsx", "day-planner.css"],
  dependencies: [],
  prompt: `Build a one-day time-blocking planner: a tray of tasks on the left, the day on the right. Its one idea: a task takes up exactly its length on the day, so you can see whether everything fits before the day starts.

Data. Times are minutes from midnight; everything snaps to 15 minutes. Inputs: tasks (title, length, one of three tones), fixed events that cannot move, the day's start and end (08:00 to 18:00), the current time, and a starting plan mapping task ids to start times.

Layout. A card up to 760px wide with a 20px radius and a hairline, split into a 250px tinted side panel and the day. Side panel (22px padding): the date at 13px muted; the free time as a 30px semibold figure ("4h 15m") followed by "free of 10h"; a 4px meter filled to the share of the day that is planned; then "To plan" with the tray's total length, and the tray: each task a 44px chip with a 10px radius, a 3px left border in its tone, a pale tone fill, its title, and its length at 11px on the right. Under the tray a 12px hint; when the tray holds more time than the day has free, the hint is replaced by a red line saying by how much ("45m more than the day has left").

The day: a 52px column of hour labels (11px, tabular) and a lane 54px per hour with a hairline at each hour. Planned tasks are blocks in their tone, positioned and sized by their times, with the title and "10:00–11:30" beneath (side by side for blocks of 30 minutes or less) and a small × that returns the task to the tray. Fixed events are diagonal hairline hatching on the panel colour with muted text. A red "now" line crosses the lane with a dot at its left end and the time above its right end.

Dragging. Pointer down on a chip or a block starts a drag after 5px of movement: the source fades to 35%, a copy of the chip follows the pointer tilted 1.5 degrees with a soft shadow, and while it is over the lane a dashed outline shows where it would land, snapped, with its time range. If it would overlap anything the outline turns red. Releasing on a free place plans it; releasing on a taken place changes nothing; dragging a planned block out of the lane returns it to the tray. Blocks ease to a new place in 200ms.

Without dragging. Pressing a chip (click, tap, Enter or Space) drops it into the first gap long enough at or after the current time, or the first gap of the day if none. A focused block moves 15 minutes with the up and down arrows when the way is clear, and returns to the tray with Delete or Backspace. Every change is announced politely ("Clear the inbox at 08:30").

Responsive: under 600px of container width the side panel sits on top, the tray wraps into rows, and the lane uses 48px per hour. Reduced motion removes the transitions.`,
  interaction: "Drag a task onto the day, or press it to drop it into the first gap. Drag a block to move it, or out of the day to return it. With a block focused, arrow keys move it and Delete returns it.",
  animation: "Blocks ease to a new time in 200ms; the meter fills in 260ms.",
  a11y: "Every drag has a keyboard and single-tap equivalent; blocks are labelled with their times and how to move them; changes are announced.",
  responsive: "Tray beside the day; under 600px it moves above and wraps.",
  touchFallback: "Tap a task to place it in the first gap; drag works with a finger too.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --dayp-a #2f6b4f; --dayp-a-bg #dcefe3; --dayp-b #8a4b12; --dayp-b-bg #f8e6cf; --dayp-bad #b3261e; --dayp-bg #fbfaf7; --dayp-c #43469c; --dayp-c-bg #e3e4f8; --dayp-ink #1b1b1f; --dayp-line #e4e1d8; --dayp-now #d93a26; --dayp-panel #f2f0ea; --dayp-soft #6d6c72. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --dayp-a #8fd9ae; --dayp-a-bg #15301f; --dayp-b #f3bd7c; --dayp-b-bg #35230f; --dayp-bad #ff8a80; --dayp-bg #111113; --dayp-c #b3b6ff; --dayp-c-bg #1f2046; --dayp-ink #ececef; --dayp-line #29292e; --dayp-now #ff6a55; --dayp-panel #18181b; --dayp-soft #96969e. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ebe8e0", mode: "fill", height: 700 },
};
