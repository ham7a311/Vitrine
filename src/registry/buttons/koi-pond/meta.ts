import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "koi-pond",
  name: "Koi Pond",
  category: "buttons",
  description: "The button is a little pond with fish hanging deep and still. Point at it and they rise and swim laps just inside the rim, bending towards your pointer while rings spread where you move; press to drop a pellet and they dart for it.",
  tags: ["button", "hover", "fish", "koi", "water", "pond", "ripple", "canvas", "calm", "playful"],
  traits: ["hover", "click", "cursor", "keyboard"],
  source: "original",
  isNew: true,
  promptAllow: ["koi"],
  files: ["KoiPond.tsx", "koi-pond.css", "koi.ts", "perimeter.ts"],
  dependencies: [],
  prompt:
    "Build a pill button that is a small pond with fish in it. Props: children, pond (one of three looks), fish (how many, default 3), onClick, type and motion.\n\nThe button is 64px tall and at least 232px wide, its face a water gradient (a deep colour pooled at the bottom, a lighter mid tone lit from the top left), an inset rim, an inner top shadow so it reads as a recess, and a surface layer over the fish: a slowly drifting pattern of faint concentric caustic rings, a top sheen and a soft dark bed under the label. The label is light, with a dark text shadow so it reads over any fish.\n\nThe fish live on a canvas filling the button (DPR capped at 2). Each fish is a chain of 8 joints 3.6px apart, the head steering and the rest following like a rope (each joint pulled to sit one segment behind the one before), so the body bends naturally. Draw it as round-capped strokes between joints whose widths follow a koi profile (widest a third of the way back) and whose colours are the fish's coat, patch by patch — that's what gives the koi its blotches. Add two sculling pectoral fins, a fan tail made of two curves that wags with the swim phase, a faint highlight down the back, and a soft shadow offset onto the pond floor.\n\nSwimming: the lane is the button's outline pulled 13px in. Each fish has a position along the lane that advances with its speed; its goal is the lane point 16px ahead, blended 28% towards the pointer while hovered. The head turns towards the goal at a limited rate (5.5 rad/s) and moves at the current speed, with a little sway from the swim phase. At rest the fish are deep — 32% opacity and still; hovering raises them to full opacity and 56px/s over about a third of a second. They swim the way you came in. Moving the pointer leaves pairs of thin elliptical ripples every 22px. Pressing drops a pellet with a big ripple: every fish turns faster and darts at twice the speed; the first to reach it eats it (a small ring) and they all take up their laps again from where they are.\n\nThe animation loop runs only while hovered or settling, and each frame draws all fish, the pellet and the ripples. Keyboard focus wakes the fish; touch gets a pellet on press and a 2.6s swim. Reduced motion draws the fish risen and still, with no ripples.",
  interaction: "Point at the button and the fish rise and swim laps, bending towards the pointer; moving leaves ripples; press to feed them.",
  animation: "Fish rise over about 300ms and swim at 56px/s with a swaying body and wagging tail; ripples spread over 0.9s. Reduced motion shows the fish still.",
  a11y: "A real button with its text label; the canvas and the surface layer are decorative and hidden. A dark bed and text shadow keep the label readable over the fish.",
  responsive: "64px tall and at least 232px wide; the lane follows whatever width the label needs.",
  touchFallback: "A press drops a pellet and the fish swim for a couple of seconds.",
  variants: [
    { id: "koi", label: "Koi", prompt: "A jade pond (#06313a deep, #0f5b5f mid, #9fe0d0 glint) with three koi: a white fish with red-orange saddles, a black, white and red one, and a butter-gold one. Pale green ground #e6efe9, label #f2fbf7." },
    { id: "goldfish", label: "Goldfish", prompt: "A clear blue bowl (#0b2f55 deep, #1d5f8f mid, #bfe6ff glint) with orange and gold fish whose tails fade lighter. Ground #e7eff7, label #f3f9ff." },
    { id: "night", label: "Night", prompt: "A pond at night (#050b1f deep, #11204a mid, #a8c4ff glint) with pale luminous fish — ice blue, lantern gold and lilac — each with a soft glow of its own colour. Ground #070b18, label #f1f4ff." },
  ],
  preview: { bg: "#e6efe9", mode: "center", height: 300 },
};
