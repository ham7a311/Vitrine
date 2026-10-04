import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "snooze-rail",
  name: "Snooze Rail",
  category: "controls",
  description: "Pick a time from now to a week away on one rail. The good answers (later today, tonight, tomorrow morning, Monday, and whatever you chose last time) are magnets: the thumb falls into them and their ticks lean toward it, but you can still pull free and land anywhere between.",
  tags: ["snooze", "reminder", "time picker", "slider", "magnet", "remind me", "schedule", "inbox"],
  traits: ["click", "touch", "keyboard"],
  source: "original",
  files: ["SnoozeRail.tsx", "snooze-rail.css"],
  dependencies: [],
  prompt: `Build a 'snooze until' control on a single rail.

<SnoozeRail now onConfirm storageKey theme motion />. The rail spans 15 minutes to 7 days from now on a power scale (position = (minutes / max)^0.4), so the next few hours have room and the far days share the rest. Free values land on whole quarter-hours of the clock.

Magnets are computed from now: Later today (18:00, or +3h after 16:00), Tonight (21:00, only before 19:00), Tomorrow 09:00, next Monday 09:00, Next week, and Your usual: the day offset and clock time of the last confirmed snooze, stored in localStorage in try/catch and drawn in a warm red with a dot on its chip. Drop any magnet within an hour of another (the usual one wins).

Each magnet is a 2×14px tick on the rail. While dragging, find the nearest magnet; inside a 12px capture radius the thumb's shown position is magnet + (pointer − magnet) × (d / 12)², so it falls quadratically into the magnet, is exactly on it below 40% of the radius (the value snaps to the magnet's time and the thumb gets a ring), and comes free smoothly past the radius. Magnet ticks rotate up to 26° toward the pointer as it nears. Outside any capture the value is whatever the position means, rounded to 15 minutes.

A large serif readout above shows the day ('Tonight', 'Tomorrow', 'Fri 16 Oct'), the time and a relative 'in 21 h', updating live while dragging. Under the rail, chips repeat every magnet as buttons (label and time); the chip matching the value is pressed. Snooze confirms and remembers the choice.

The thumb is role=slider with aria-valuemin/max/now and an aria-valuetext of the readout. ←/→ move 15 minutes (Shift: 60), PageUp/PageDown jump between magnets, Home/End go to the ends. Pointer events with touch-action: none on the track. Paper and Night themes; reduced motion removes the glide and lean.`,
  interaction: "Drag the thumb along the rail: it falls into the suggested times and can be pulled free. Or press a chip, or use the keyboard. Snooze remembers your choice as 'Your usual'.",
  animation: "The thumb glides to chips and keys over 300ms; magnet ticks lean toward the pointer while dragging (60ms tracking, 240ms release).",
  a11y: "The thumb is a real slider with a spoken value ('Tomorrow, 09:00, in 22 h'); keys step by 15 minutes and jump between suggestions. Every suggestion is also a normal button, so nothing depends on dragging. A status message confirms the snooze. Reduced motion removes the glide and the lean.",
  responsive: "Fluid to 320px; the track and thumb grow under 420px for touch.",
  touchFallback: "Tap a suggestion chip, or drag the larger thumb.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
