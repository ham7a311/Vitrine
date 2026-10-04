import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "loupe",
  name: "Loupe",
  category: "cursors",
  description: "A jeweller's glass for dense content. The pointer becomes a round lens that magnifies whatever is under it — a live second copy of the page, not a screenshot, so fine type and map lines stay sharp at any power. Alt + scroll or [ ] change the power; on touch, press and hold.",
  tags: ["cursor", "magnifier", "loupe", "zoom", "lens", "map", "fine print", "glass"],
  traits: ["cursor", "keyboard", "touch"],
  source: "original",
  files: ["Loupe.tsx", "loupe.css"],
  dependencies: [],
  prompt: `Build a magnifying-glass cursor as a wrapper component that renders its children twice.

Structure: the host (position relative, overflow hidden) renders children normally, then an aria-hidden lens: a circular div (prop size, default 200px) with overflow hidden, containing a second copy of the children inside a view div marked inert. The view is sized to the host's offsetWidth/Height (kept in sync with a ResizeObserver) and transformed with transform-origin 0 0 to translate(S/2 − x·z, S/2 − y·z) scale(z), so the host-local point (x, y) under the pointer sits at the centre of the lens at power z. Give the view no will-change, so the browser re-rasterises it at the scaled size and text and SVG stay crisp. The lens itself is translated to (x − S/2, y − S/2) in the pointermove handler — it is the pointer — and the system cursor is hidden inside the host while it is up (fine pointers only). Coordinates are host-local, corrected by rect.width / offsetWidth.

Glass: a soft drop shadow beneath; inset hairline rim, a 5px inner band, a bright bevel along the top, a darker one along the bottom, a faint vignette and a sheen gradient from the upper left; a 14px reticle at the centre; the power engraved as a small mono pill on the lower rim, brightening for 1.2s when it changes.

Motion: power and appearance are springs (k 240 ζ 0.9 for power, k 420 ζ 0.72 for the lens scale). Entering the host grows the lens from 0.55 with a slight overshoot; leaving shrinks it away. Alt + wheel multiplies the power by 1.12 per notch; [ and ] (or − and +) step by 0.25; the range is clamped (default 1.5–4) and rounded to quarters. Touch: a 380ms press-and-hold (cancelled by more than 8px of movement, so scrolling still works) raises the lens 0.62 × size above the finger; touchmove is then prevented, so dragging moves the lens instead of the page; lifting the finger puts it away. Ids inside the content must be unique per copy (useId). Demo: an engraved map sheet of Muttrah (contours, depth lines, cased corniche with a textPath label, tiny POI notes) beside fine-print walking notes and a bus timetable. Paper and Night.`,
  interaction: "Hover the sheet to read the fine print through the lens. Alt + scroll, or [ and ], change the power. On touch, press and hold, then drag.",
  animation: "Lens grows in from 0.55 on a spring (k 420, ζ 0.72); power on a spring (k 240, ζ 0.9); readout 200ms.",
  a11y: "The magnified copy is inert and aria-hidden, so assistive tech reads the page only once; the map has a text alternative and the notes are real text and a captioned table. Browser zoom keeps working. Reduced motion shows and hides the lens and changes power with no springs.",
  responsive: "The sheet stacks under 1024px; the lens copy tracks the host's size, so it lines up at every width and inside scaled previews.",
  touchFallback: "Press and hold for 380ms, then drag: the lens rises above your finger so it isn't hidden by it. A quick swipe still scrolls.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f3eee2", mode: "fill" },
};
