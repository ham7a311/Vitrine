import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "snow-cap",
  name: "Snow Cap",
  category: "buttons",
  description: "Point at the button and it starts to snow over it: flakes drift down and settle into a soft drift along the top, deepest on the flat and sliding off the rounded shoulders, while icicles grow from the bottom edge and drip. Press to knock snow loose; move away and it all melts. Or a dusting of powdered sugar on a pastry-brown button.",
  tags: ["button", "hover", "snow", "winter", "holiday", "icicles", "sugar", "canvas", "seasonal", "playful"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  isNew: true,
  promptAllow: ["snow", "sugar"],
  files: ["SnowCap.tsx", "snow-cap.css", "snow.ts"],
  dependencies: [],
  prompt:
    "Build a pill button that snow settles on. Props: children, weather (snowfall or a dusting of powdered sugar), tone {face, label}, onClick, type and motion.\n\nThe button is 56px tall and at least 220px wide, with a vertical gradient on its face, a top highlight and a bottom inner shadow. A canvas overlay sits over it with pointer-events none, extending 70px above, 18px either side and 36px below, and draws in the button's own coordinates.\n\nThe drift (pure functions): the pill's top edge as y(x) — 0 on the flat, rising round the semicircular ends; a height per 2px column, each limited by how steep the edge is there (full on the flat, falling to nothing as the slope passes 1.6), so snow slides off the shoulders; a deposit that spreads each landing over seven columns with a Gaussian; and a slump pass that moves snow from any step taller than 1.2px into its neighbour, so the drift stays soft.\n\nWhile hovered, flakes spawn at the top of the overlay across the button's width plus the margins (46 a second, radius 1.2–2.8px, falling 26–48px/s faster for bigger flakes and swaying), fading in over the first 14px. A flake that reaches the drift surface adds to it; if that column is full it slides off as a little drop; one that misses falls out of the overlay. The drift is filled as one path — along the surface minus the height and back along the surface — with a white-to-blue-grey gradient underneath and a soft shadow, plus a few twinkling glints. Once the drift averages 3px, icicles grow from the bottom edge's flat part at least 9px apart (a tapered quadratic shape, white to translucent blue, with a highlight line), up to 6–19px long at 7px/s, each dripping a drop now and then.\n\nOn leave it melts: each column sinks at about 5px/s, icicles shrink and drip, and drops fall from the bottom edge with gravity. A press knocks loose half of the drift as a spray of drops. The animation stops when nothing is left. Keyboard focus starts the snow; touch gets a 2.6s fall on press. Reduced motion shows a finished drift and four icicles on hover, with nothing falling.",
  interaction: "Point at the button and it snows on it; press to knock the snow loose. Keyboard focus starts the snow too.",
  animation: "Flakes fall at 26–48px/s and build a drift up to 13px deep over a few seconds; icicles grow at 7px/s; everything melts away on leave. Reduced motion shows a still drift.",
  a11y: "A real button with its text label; the canvas is decorative, hidden and doesn't take the pointer. The snow never covers the label.",
  responsive: "Leave about 70px of room above the button for the snowfall and 36px below for icicles.",
  touchFallback: "A press starts a short snowfall and knocks some loose.",
  variants: [
    { id: "snow", label: "Snow", prompt: "Snowfall on a midnight-blue button (#1c2b4a, label #f4f8ff) over a pale winter sky gradient (#b9cde6 to #e6eef7): flakes 1.2–2.8px at 46 a second, a drift up to 13px with white-to-#c9dcf2 shading and glints, and icicles that drip." },
    { id: "sugar", label: "Sugar", prompt: "Powdered sugar on a pastry-brown button (#5a3220, label #fff4e6) over cream #f3e6d4: fine grains 0.6–1.3px falling fast at 150 a second, a shallower 8px cream (#fffaf0) drift with a visible grain, no icicles, and a light dusting that settles on the face; on leave it blows away quickly." },
  ],
  preview: { bg: "#d0deee", mode: "center", height: 340 },
};
