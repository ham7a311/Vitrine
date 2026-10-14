import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "sticker-slap",
  name: "Sticker Slap",
  category: "buttons",
  description: "Point at the button and a handful of die-cut stickers get slapped round its edge — a star with a face, a bolt, a heart, a NEW badge, a smiley, a rainbow, a tick — each landing with a squash and a shadow that settles, nearest your pointer first. Every hover brings a different set, a press slaps one on the face, and leaving peels them all away.",
  tags: ["button", "hover", "stickers", "playful", "fun", "merch", "badge", "holographic", "svg", "edge"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  isNew: true,
  files: ["StickerSlap.tsx", "sticker-slap.css", "layout.ts", "art.ts", "perimeter.ts"],
  dependencies: [],
  prompt:
    "Build a pill button that gets stickers slapped round its edge. Props: children, finish (one of three sticker styles), tone {face, label}, onClick and type.\n\nSeven original sticker designs, each in a 40×40 box with a die-cut outline path and artwork: a yellow star with a little face, an orange lightning bolt with a highlight, a pink heart with a highlight, a blue 12-point burst badge reading NEW, a yellow smiley, a three-band rainbow with two clouds, and a green disc with a tick. The die-cut is the outline drawn as a filled and 5.5px-stroked shape behind the artwork with round joins, so every sticker has a border; a gloss band clipped to the outline (a unique clipPath id per sticker) sweeps across it.\n\nLayout (a pure, seeded function of the hover count): shuffle the seven designs, take five, and space them round the pill outline from the point nearest where the pointer came in — alternately either side of it, one fifth of the outline apart with a little jitter. Each is 32–42px, centred 18% of its size outside the edge so it overlaps the rim, tilted up to ±22°, and delayed by how far it is from the entry point (85ms per step).\n\nThe stickers are appended imperatively to an overlay 30px beyond the button with pointer-events none, and slap in with the Web Animations API over 340ms: from 1.55×, raised 16px, turned an extra 16° and transparent with a big soft shadow, to a squash (1.08 × 0.9) with a tight shadow, a small rebound, and rest with a 1.5px shadow. Leaving peels them off one after another (40ms apart): each lifts from a top corner in perspective, turning up to 70° and rising 26px as it fades, then is removed. Each hover peels the last set and brings a fresh one. A press slaps a 30px sticker onto the face where you pressed, under the label, which stays until you leave.\n\nThe button: a 56px pill in the face colour with a bold label, an inner highlight and shadow; it tips -1.2° on hover. Keyboard focus slaps a set from the top centre; blur peels them. Touch gets a set on press for 2.4s. Reduced motion fades the stickers in and out in place. All stickers are aria-hidden so their text never joins the button's name.",
  interaction: "Point at the button and stickers get slapped round it; press to slap one on the face; leave and they peel off. Every hover is a new set.",
  animation: "Each sticker lands in 340ms with a squash and settling shadow, 85ms apart outward from the pointer; peeling takes 360ms per sticker. Reduced motion fades them.",
  a11y: "A real button with its text label; every sticker is aria-hidden, so the NEW badge doesn't change the button's name, and the overlay doesn't take the pointer.",
  responsive: "Leave about 30px of room round the button for the stickers.",
  touchFallback: "A press slaps a set on for a couple of seconds.",
  variants: [
    { id: "glossy", label: "Glossy", prompt: "Vinyl stickers: white die-cut borders, bright fills (#ffd23a, #ff5b33, #ff4d8d, #3a6dff, #19b874), dark ink #2a1d0b and a gloss band sweeping across every 2.6s, on a #1b1a22 button over lavender-grey #e9e6f2." },
    { id: "holo", label: "Holo", prompt: "Holographic stickers: silver die-cut borders, pastel fills whose hue cycles through the spectrum every 3.2s, and a bright gloss band, on a slate #2b2d3a button over near-black #15161d." },
    { id: "kraft", label: "Kraft", prompt: "Stickers printed on kraft paper: tan #d4b48a borders, muted inks (#e9a23b, #c8492b, #b8434f, #3f5d7a, #4f7a4a) and cream text and ticks, no gloss, on a dark brown #2f2418 button over cream #efe6d6." },
  ],
  preview: { bg: "#e9e6f2", mode: "center", height: 300 },
};
