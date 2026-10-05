import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "allocation-faders",
  name: "Allocation Faders",
  category: "decisions",
  description: "A mixing console for a budget that must add up: push one fader and the unlocked ones make room in proportion, lock pins hold a channel still, and the master section keeps the total, the locked share and what's free in view.",
  tags: ["budget", "allocation", "slider", "constraint", "console", "finance", "weights"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["AllocationFaders.tsx", "allocation-faders.css", "allocate.ts"],
  dependencies: [],
  prompt:
    "Build an allocation control styled as a small mixing console, for splitting a fixed total (a budget, percentages, weights) across 3–6 channels. The rule it makes physical: the channels always add up to the total.\n\nLayout: a 14px-radius enamel panel. A header with an uppercase, slightly expanded title ('MASAR · Q1 BUDGET') and a muted note 'Always adds up to $480,000'. Below, a recessed channel bay with one vertical strip per channel separated by hairlines, and from 46rem a 14rem 'Master' column on the right.\n\nEach strip, top to bottom: a dark readout window in JetBrains Mono with tabular numbers showing the amount and, under it, its percentage; a 240px fader made of a 4px dark slot with a coloured fill rising from the bottom to the value, a scale of 100/75/50/25/0 with short ticks on the left, and a 40×22px dark cap with a light index line across its middle; a pill 'Lock' pin with a round head; and a masking-tape label at the bottom (pale cream tape, condensed uppercase Archivo, a small colour chip, rotated about a degree, alternating direction per strip).\n\nBehaviour: moving one fader sets it (clamped to what the locked channels leave) and redistributes the difference across the other unlocked channels in proportion to their current values (equally if they are all zero), rounded to the step by largest remainder so the sum is exact. Locked channels never move; a locked cap gets a red ring and its pin turns red and looks pushed in. If fewer than two channels are unlocked, the remaining fader is disabled with the hint 'Unlock a second fader to move this one'. Master column: a stacked bar of every channel in its colour (locked segments hatched), then Total, Locked and Free to move as ruled rows, then a one-line hint.",
  interaction:
    "Each fader is a native range input laid invisibly over the drawn slot and cap, so pointer drag, click-to-jump, arrow keys, Page Up/Down, Home and End all work natively. The dragged fader follows the pointer directly while the others glide to their new values. Lock pins are toggle buttons. onChange(channels) receives every new allocation; the sum always equals total.",
  animation:
    "Caps, fills and master bar segments ease to their new values over 180ms with cubic-bezier(.2,.8,.2,1); the fader under the pointer has no transition so it never lags. Pin heads change over 140ms. With prefers-reduced-motion or motion={false}, every change is immediate.",
  a11y:
    "Each fader is a labelled range input with aria-valuetext such as 'Marketing $96,000, 20 percent'; readouts are output elements tied to their fader; lock pins are aria-pressed buttons with 'Lock Marketing' / 'Unlock Marketing' names; a disabled fader is described by the hint explaining why; focus draws a ring around the cap.",
  responsive:
    "The master column moves under the channels below 46rem. Below 34rem each channel becomes a horizontal row: tape label and readout on top, a full-width horizontal fader, then the lock pin.",
  touchFallback: "Drag a cap or tap anywhere along a slot to jump; the horizontal layout on phones gives each fader the full width.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#d9d3c7", mode: "fill", frame: [1000, 620] },
  isNew: true,
};
