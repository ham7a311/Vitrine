import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "vinyl-sleeve-card",
  name: "Vinyl Sleeve",
  category: "cards",
  description: "An album as an object: point at it and the record slides half out of its sleeve; press play and it spins at 33⅓ while the tonearm swings over onto the groove. The light on the vinyl stays still while the record turns beneath it — which is what makes it look like vinyl.",
  tags: ["card", "album", "music", "vinyl", "record", "player", "skeuomorphic", "hover", "now playing"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  files: ["VinylSleeveCard.tsx", "vinyl-sleeve-card.css"],
  dependencies: [],
  prompt: `Build an album card with a record that slides out of its sleeve and plays.

Stage (1.62 × the sleeve's size): the sleeve (an SVG cover, ring wear and a sheen) sits on top at the left; behind it a record (94% of the sleeve) that translates out by 55% on hover, focus-within, or while playing (700ms ease-out). The disc is fine repeating-radial grooves with a dark lead-in edge and a coloured label (italic serif title, mono artist, spindle hole); it spins (1.8s per turn ≈ 33⅓ rpm) with animation-play-state paused/running. Over it, a conic sheen of two soft highlights masked to the grooved band that does not rotate — so the light stays still while the record turns, which is what sells vinyl. A tonearm SVG (base, pin, rod, headshell, counterweight) fades in beside the record once it is out, and rotates on its pivot from −26° to 4° when playing (900ms ease, 150ms delay) and back.

Under it: title in serif, artist · year, a round play/pause button (aria-pressed, labelled "Play <title> by <artist>"), the track name and a progressbar with mm:ss elapsed, ticking once a second only while playing. Each album supplies its title, artist, year, track, length, cover SVG, label colours and backdrop. Reduced motion: no slide, spin or swing.`,
  interaction: "Hover or focus to slide the record out; press play to spin it and drop the tonearm.",
  animation: "Slide 700ms; spin 1.8s/rev; tonearm 900ms; progress ticks each second.",
  a11y: "A labelled article; the play button is a toggle with a descriptive label; progress is a progressbar with value text. The artwork is decorative.",
  responsive: "Everything is sized from the sleeve, min(250px, 58vw), so the whole object scales down on phones.",
  touchFallback: "Tap play; the record comes out and plays.",
  variants: [
    { id: "khareef", label: "Khareef", prompt: "Album \"Khareef Sessions\" — Lulwa Ensemble, 2025, track \"1. Mist over Ittin\" (3:42): misty green cover circles on #163b2a, pale green label #cfe6c2 with dark green ink, backdrop radial-gradient(90% 80% at 40% 30%, #1d2a22, #0a0f0c)." },
    { id: "wadi", label: "Wadi Nights", prompt: "Album \"Wadi Nights\" — The Falaj Trio, 2024, track \"3. Water in the dark\": night-blue cover, gold label #e8c46a with dark brown ink, backdrop radial-gradient(90% 80% at 40% 30%, #161a2c, #07080e)." },
    { id: "corniche", label: "Corniche", prompt: "Album \"Corniche\" — Sami & the Dhows, 2026, track \"1. Leaving Mutrah\" (3:18): warm sunset cover, cream label #f6e7cf, backdrop radial-gradient(90% 80% at 40% 30%, #2c1712, #0e0806)." },
  ],
  preview: { bg: "#0f1612", mode: "fill" },
};
