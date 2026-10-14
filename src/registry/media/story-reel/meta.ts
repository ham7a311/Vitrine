import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "story-reel",
  name: "Story Reel",
  category: "media",
  description: "Stories the way phones show them: bars across the top fill as each one plays, tapping the right side moves on and the left goes back, holding pauses, and a swipe jumps to the next person, whose ring greys once seen. The frames are illustrated scenes — dawn hills, a city at night, the sea, a quote card — drawn in SVG and slowly drifting, not photos.",
  tags: ["media", "stories", "social", "player", "swipe", "tap", "progress", "illustration", "mobile", "carousel"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["StoryReel.tsx", "story-reel.css", "reel.ts", "scenes.tsx"],
  dependencies: [],
  prompt:
    "Build a stories viewer. Props: people [{name, colors [two], stories [{id, kind: dawn | city | sea | type, caption, quote, ago}]}], duration (5s per story), theme and className.\n\nPosition (pure functions): a position is a person, a story and progress through it. Ticking by dt adds dt/duration and, at the end, moves to the next story, then the next person, looping. Next does the same at once. Previous restarts the story if you're more than 15% into it, otherwise goes to the previous story or the previous person's last. Jumping to a person starts at their first story. Each bar's fill is 1 for stories already watched, the progress for the current one and 0 after.\n\nScenes are drawn in SVG in a 90 × 160 box (slice-fitted) with the person's two colours: dawn hills with a pale sun and three layers of hills, a city at night with stars, a moon and lit windows, the sea at sunset with a sailing boat and wave lines, and a quote card with soft circles and a large serif quote.\n\nThe frame is a 9:16 card up to 340px wide with rounded corners. Over the scene: a dark fade at the top and bottom, the bars (3px, filling with scaleX), the person's initials on a gradient avatar with their name and how long ago, a \"Paused\" chip when stopped, and the caption at the bottom. The scene drifts (scale 1 → 1.07 over the story), paused with the story. Each new person slides in from the side you're heading. A requestAnimationFrame loop advances the story unless held or paused.\n\nInput: tap the left third to go back and the rest to go forward; press and hold (over 180ms) to pause until you let go; swipe more than 60px to change person. The frame is focusable (named with the person, story number and caption): ← → step, ↑ ↓ change person, Space pauses. Buttons below do back, pause/play (aria-pressed) and forward, and a row of avatar buttons — gradient rings, grey once seen, the current one larger — jumps to each person. A polite live region names each story. Reduced motion turns off the drift and slide. Two themes, night and paper.",
  interaction: "Tap right for the next story and left for the previous; hold to pause; swipe or use the avatars to change person. Arrow keys and Space work too.",
  animation: "Bars fill over each story; scenes drift slowly; people slide in over 380ms. Reduced motion removes the drift and slide.",
  a11y: "The viewer is a focusable, labelled group with full keyboard control; every gesture has a button; each story is announced politely; avatars are labelled buttons with seen state.",
  responsive: "The frame scales to its container up to 340px wide; the avatar row scrolls sideways if it runs out of room.",
  touchFallback: "Built for touch: tap, hold and swipe.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --sr-bg #111114; --sr-ink #f2f1f5; --sr-line rgba(242, 241, 245, 0.12); --sr-muted #a6a4ad. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --sr-bg #f4f1ea; --sr-ink #1c1b18; --sr-line rgba(28, 27, 24, 0.12); --sr-muted #615c53. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#070708", mode: "center", height: 820 },
};
