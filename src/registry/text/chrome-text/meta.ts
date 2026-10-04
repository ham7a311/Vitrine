import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "chrome-text",
  name: "Chrome Type",
  category: "text",
  description: "A word in polished metal, the way album covers did it: sky in the top of every letter, a hard horizon, warm ground below, a bevelled edge and a line of light along the top. A glint runs across it and a star flares at its peak; move the pointer and the word tilts while the reflections slide inside it.",
  tags: ["chrome", "metal", "80s", "retro", "wordmark", "logo", "glint", "reflection", "3d tilt", "text animation"],
  traits: ["ambient", "cursor"],
  source: "original",
  files: ["ChromeText.tsx", "chrome-text.css"],
  dependencies: [],
  prompt: `Build an 80s-chrome wordmark ("VITRINE" in Anton, clamp(5rem, 21vw, 15rem), uppercase) from stacked copies of the same text, all aria-hidden except the h2's aria-label.

Layers, back to front: (1) depth — a solid dark copy with a text-shadow stack stepping 1–6px down (two edge tones), a soft drop shadow and a wide coloured glow; (2) metal — background-clip:text with a vertical gradient built from the finish's variables: sky-1 → sky-2 → sky-3 to 44%, a bright band at 50.5%, a hard dark horizon line at 51.5%, then ground-1 → ground-2 → ground-3 → ground-2; background-size 118% tall so it can slide; (3) rim — a white copy masked to its top 9% and nudged up 0.006em with screen blending, a thin line of light on every top edge; (4) glint — a 105° white band clipped to the text, background-size 300%, swept left to right (position 80% → 20%) in the first 40% of a 4.2s loop, screen-blended; plus an SVG four-point star that flares (scale 0 → 1 → 0, rotating) on the last letter's shoulder as the glint peaks.

Pointer: pointermove writes --mx and --my (−1…1) only; the stage rotates rotateX(−9°·my) rotateY(12°·mx) and the metal's background-position slides with them, both through a 700ms ease-out transition — so the room appears to move inside the letters, with no animation loop. A floor reflection repeats the metal layer flipped (scaleY −1), masked from 32% to transparent and blurred 1.5px. A spaced mono tagline sits below.

Reduced motion: no glint, star or tilt.`,
  interaction: "Move the pointer over it to tilt the word and slide its reflections.",
  animation: "Glint and star on a 4.2s CSS loop; tilt and reflections ease over 700ms. No JS loop.",
  a11y: "The h2 carries the word as its accessible name; every visual copy is aria-hidden. Reduced motion removes the glint, star and tilt.",
  responsive: "Type scales with the viewport (21vw) and never wraps.",
  touchFallback: "Tap or drag sets the tilt the same way; the glint plays regardless.",
  promptAllow: ["chrome"],
  variants: [
    { id: "chrome", label: "Chrome", prompt: "finish=\"chrome\": classic chrome — white → pale sky → deep sky blue above the horizon, dark brown → tan → cream ground below, cool blue glow; backdrop radial-gradient(120% 70% at 50% 62%, #1b2a48, #0a1020 45%, #04060c)." },
    { id: "gold", label: "Gold", prompt: "finish=\"gold\": sky #fffbe8 → #f6d77c → #b9811d, band #fffdf2, horizon #3a2205, ground #6b3c0b → #e9a93b → #fff0c4, edges #4a2c06 / #1d1003, glow rgb(255 196 90 / .32); backdrop radial-gradient(… #3a2408, #140c03 48%, #070402)." },
    { id: "rose", label: "Rose titanium", prompt: "finish=\"rose\" (rose titanium): sky #fff6f7 → #e9c3cf → #a46d86, band #fffafb, horizon #2b1a24, ground #5b3346 → #d79fae → #fde9ee, edges #3b2431 / #150b11, glow rgb(255 160 190 / .3); backdrop radial-gradient(… #3b1a2a, #150910 48%, #08040a)." },
  ],
  preview: { bg: "#04060c", mode: "fill" },
};
