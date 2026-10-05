import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "timezone-overlap",
  name: "Timezone Overlap",
  category: "time",
  description: "Everyone's working hours drawn on one 24-hour axis in your time zone. Drag the line to read each person's local time at that moment; the hours everyone shares light up across all rows, and when there are none it says which window comes closest and who it leaves out.",
  tags: ["time zones", "scheduling", "meetings", "team", "calendar", "remote"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["TimezoneOverlap.tsx", "timezone-overlap.css", "overlap.ts"],
  dependencies: [],
  prompt:
    "Build a meeting-time finder for a distributed team ('Masar weekly sync': Muscat, London, Kolkata, New York), drawn on one 24-hour axis in the viewer's time zone for a chosen day.\n\nData: people with a name, an IANA zone, local working hours (start, end; end may be after midnight) and working weekdays. For the reference day, each person's local window is converted through Intl to minutes of the reference zone's day, including the previous and next local days so overnight spill and half-hour offsets (Kolkata) and daylight saving (London in late October) are right. Windows are intersected; if nothing is shared, the longest window that leaves out just one person is offered with that person named.\n\nLayout: a 14px-radius card in Geist. Header: the title, a summary sentence ('Everyone is working 13:00–15:00 (Muscat time, 2 h)' or 'No hour suits everyone. Best: 16:30–18:00 without Salma'), and a day switcher with ‹ › arrows. A grid with a 9–11rem name column and a lane column: a mono hour axis (00, 03 … 24) across the top; per person a row with name, city and their local time at the cursor in mono (bold when they're working, '+1' / '−1' when it's another day there) and a 36px grey lane with their working hours as a sage bar. Over all lanes, the shared hours are a green-outlined translucent column, and a 2px ink cursor with a time tag runs top to bottom.",
  interaction:
    "Drag anywhere on the lanes to move the cursor (snapping to 15 minutes); the cursor is also a slider: ←/→ move 15 minutes, Shift an hour, Home/End the ends of the day, Enter jumps to the first shared window (or the best partial one). The day arrows change the date so weekends and clock changes show up.",
  animation: "The cursor eases between keyboard steps over 120ms and follows the pointer directly while dragging; local times brighten over 140ms when a person is at work. Reduced motion removes the easing.",
  a11y: "The lanes are a single slider whose value text reads every person's local time at the cursor ('14:00 in Muscat: Hamza 14:00, Layla 11:00, Omar 15:30, Salma 06:00'). The summary sentence is a polite live region, so changing the day announces the new result.",
  responsive: "Below 34rem the name column narrows and the local time moves under the city; the lanes keep the full day.",
  touchFallback: "Drag the cursor with a finger; the day arrows are full buttons.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#e6e7e3", mode: "center", frame: [1000, 560] },
  isNew: true,
};
