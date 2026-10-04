import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "postcard-card",
  name: "Postcard",
  category: "cards",
  description: "A big-letter postcard: “Greetings from” in script over MUSCAT in chunky block capitals filled with the sky, over the scene. Turn it over and the back writes itself line by line in blue pen, then the postmark comes down on the perforated stamp with a thud.",
  tags: ["card", "postcard", "travel", "retro", "flip", "3d", "lettering", "stamp", "handwriting"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["PostcardCard.tsx", "postcard-card.css"],
  dependencies: [],
  prompt: `Build a vintage large-letter postcard (3:2, max 580px; everything sized in container units so it scales) inside a button that turns it over.

Front: an illustrated SVG scene inside a white border; centred lettering — "Greetings from" in Pinyon Script with a red drop shadow, tilted −5°, over the town name in Anton capitals in perspective (rotateX 10°, scaleY 1.12), built from three stacked copies: a dark red block extrusion (stepped text-shadows plus a soft drop shadow), the letters filled with a three-stop sky gradient (background-clip: text), and a white inline (-webkit-text-stroke) nudged up-left. A grain and vignette layer finishes it.

Turning: the card is preserve-3d with backface-hidden faces and rotates 180° in 900ms. The back is remounted on each turn so it writes itself: the message lines (italic serif in blue pen) are revealed by clip-path sweeps 520ms apart, the address lines on the right with ruled lines; a stamp with a scalloped perforated edge (a radial-gradient mask) and a tiny illustration; then the postmark (SVG: double ring, the post office name on a textPath, the date, and five wavy cancellation lines) comes down — scale 1.5 → 1 and −14° → −8° in 260ms, multiply-blended — while the whole card does a small 260ms "thud" (translate/scale via the independent translate and scale properties, so it doesn't fight the flip transform). Each place supplies its name, scene, sky gradient, stamp and message. The button says which side is showing (aria-pressed); the hidden face is aria-hidden. Reduced motion: instant turn, everything already written and stamped.`,
  interaction: "Click (or press Enter/Space) to turn it over and back.",
  animation: "Flip 900ms; message lines written 520ms apart; postmark stamps in 260ms with a thud.",
  a11y: "A labelled toggle button; the message and address are real text; the face not showing is hidden from assistive tech.",
  responsive: "Sized entirely in container query units, so the lettering, stamp and handwriting scale with the card down to phone widths.",
  touchFallback: "Tap to turn it over.",
  variants: [
    { id: "muscat", label: "Muscat", prompt: "Place \"Muscat\": its own illustrated scene, sky and stamp; the message reads \"Dear Sami — The water here is the colour of the bottle you broke in Year 9. Wish you were here.\"" },
    { id: "salalah", label: "Salalah", prompt: "Place \"Salalah\": its own illustrated scene, sky and stamp; the message reads \"Habibti — It's raining in August and everything is green. The coconuts are the size of my head.\"" },
    { id: "nizwa", label: "Nizwa", prompt: "Place \"Nizwa\": its own illustrated scene, sky and stamp; the message reads \"Dad — Bought you a khanjar at the Friday goat market. Don't ask what it cost.\"" },
  ],
  preview: { bg: "#ddcdb0", mode: "fill" },
};
