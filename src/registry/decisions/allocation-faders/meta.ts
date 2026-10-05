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
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --afad-bg #e7e2d8; --afad-c1 #b4532a; --afad-c2 #2f6f73; --afad-c3 #5a5aa8; --afad-c4 #9a7a22; --afad-c5 #5f7032; --afad-c6 #8a4f7d; --afad-cap #1e1c1a; --afad-cap-line #f3efe7; --afad-focus #2f5fd0; --afad-ink #1e1c1a; --afad-line rgb(30 28 26 / 0.14); --afad-lock #b8361f; --afad-muted #655f57; --afad-panel #efebe3; --afad-readout-bg #1e1c1a; --afad-readout-ink #f6efe2; --afad-slot #2b2825; --afad-tape #efe2bd; --afad-tape-ink #3a342b. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --afad-bg #161718; --afad-c1 #e07a4f; --afad-c2 #4fb3b1; --afad-c3 #9a9af2; --afad-c4 #d4ad4f; --afad-c5 #a3b860; --afad-c6 #c98bbb; --afad-cap #d8d4cb; --afad-cap-line #1d1e20; --afad-focus #8ab4ff; --afad-ink #ecebe7; --afad-line rgb(255 255 255 / 0.1); --afad-lock #ff7a5c; --afad-muted #a29f97; --afad-panel #1d1e20; --afad-readout-bg #0b0c0d; --afad-readout-ink #f3e9d6; --afad-slot #060607; --afad-tape #d9cfb0; --afad-tape-ink #2a251d. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#d9d3c7", mode: "fill", frame: [1000, 620] },
  isNew: true,
};
