import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "notification-dial",
  name: "Notification Dial",
  category: "controls",
  description: "One dial instead of a wall of notification checkboxes, and beside it the consequence: a sample week of what would actually reach you at that setting, counted, spread across the days and listed, changing as you turn it.",
  tags: ["settings", "notifications", "dial", "preferences", "preview", "knob"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["NotificationDial.tsx", "notification-dial.css"],
  dependencies: [],
  prompt:
    "Build a notification setting that shows its consequence. The control is a single rotary dial with four detents (Off, Mentions, Important, Everything); the point of the component is the preview next to it, which answers 'what will this actually mean for my week?'. Unlike a plain knob, every turn changes a visible, concrete outcome.\n\nPanel: a 16px-radius warm grey panel in Hanken Grotesk; from 44rem the dial column (15rem) sits left of a white preview card, otherwise they stack.\n\nDial (SVG, 200px): a 270° track open at the bottom, 8px thick with round caps, filled in amber from the start up to the current detent; short ticks outside the track at each detent, amber up to the current one; a raised off-white face with a soft drop shadow, the current level's name in bold at its centre, and an amber dot on the face's edge pointing at the setting. Under it, the level names as small pills (the current one tinted amber) and a one-line description ('Mentions, plus reviews you're asked for and deadlines'). Dragging around the dial snaps to the nearest detent as you go; the dead zone at the bottom clamps to the ends.\n\nPreview: 'A typical week at this setting' with the count in 34px bold that counts to its new value; a row of seven short day columns (Mon–Sun) where each delivered notification is an 8px dot stacked from the bottom, coloured by source (mentions, reviews, deadlines, activity); then the first six sample notifications as ruled rows (source dot, title, 'Reviews · Tue') and 'and 12 more'. At Off the list is replaced by a dashed note: 'Nothing will reach you. You can still check Masar yourself.' The samples are data: each has the lowest level that delivers it and a day.",
  interaction:
    "Drag the dial, click a level pill, or focus the dial and use ←/→ (or ↑/↓), Home and End. onChange(levelIndex) fires on each new detent.",
  animation:
    "The count eases to its new value over 360ms; new rows and dots fade and scale in over 220–240ms while remaining rows slide (FLIP). Reduced motion or motion={false} changes everything at once.",
  a11y:
    "The dial is role='slider' with aria-valuetext that includes the level, what it means and roughly how many notifications a week it brings. Pills are pointer shortcuts and stay out of the tab order. The sample list is labelled as examples.",
  responsive: "Side by side from 44rem, stacked below; the day columns and list fill the card's width.",
  touchFallback: "Drag the dial with a finger (scrolling is disabled only on the dial) or tap a level pill.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --ndial-accent #c96a12; --ndial-bg #f3f1ec; --ndial-card #ffffff; --ndial-face #fbfaf7; --ndial-ink #1f1d1a; --ndial-line rgb(31 29 26 / 0.12); --ndial-muted #6c675e; --ndial-s0 #2f6bd8; --ndial-s1 #c96a12; --ndial-s2 #2b8a5e; --ndial-s3 #8b55c7; --ndial-track #e2ded6. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --ndial-accent #f5a524; --ndial-bg #161719; --ndial-card #1d1f22; --ndial-face #222428; --ndial-ink #ebe9e4; --ndial-line rgb(255 255 255 / 0.1); --ndial-muted #a29e95; --ndial-s0 #7fa8ff; --ndial-s1 #f5a524; --ndial-s2 #6fd1a2; --ndial-s3 #c49bff; --ndial-track #2c2f33. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#e4e1da", mode: "center", frame: [1000, 620] },
  isNew: true,
};
