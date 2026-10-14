import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "daylight-atlas",
  name: "Daylight Atlas",
  category: "maps",
  description: "A dotted world map with the real line between day and night drawn across it — the night side dark and glittering with city lights, twilight warm along the edge, the sun marked where it's overhead — and your team pinned where they live with their local times. Play the day or drag the scrubber to sweep the night across the map and see who's awake when.",
  tags: ["map", "world", "timezones", "team", "day night", "terminator", "remote", "canvas", "clock", "dots"],
  traits: ["canvas", "click", "keyboard", "ambient"],
  source: "original",
  isNew: true,
  files: ["DaylightAtlas.tsx", "daylight-atlas.css", "sun.ts", "../route-globe/land.ts"],
  dependencies: [],
  prompt:
    "Build a world map of day and night for a distributed team. Props: people [{name, city, lon, lat, offset (UTC hours)}], hours (working hours, default 9–18), start (a fixed moment; otherwise it uses now and re-reads the clock every 30s), and theme.\n\nSun maths (pure functions, NOAA's low-precision formulas): the fractional year γ from the day of year and UTC hour; the equation of time and the declination as short Fourier series in γ; the subsolar point — latitude = declination, longitude = −15 × (UTC hour − 12 + equation of time / 60), wrapped to ±180; the sun's altitude anywhere, asin(sin φ sin δ + cos φ cos δ cos(λ − λsun)); a daylight value from the altitude that is 1 above +2°, 0 below −12° and eases through twilight; the terminator latitude at each longitude, atan(−cos(λ − λsun) / tan δ); and a local clock at a fixed offset.\n\nThe map: an equirectangular canvas from 80°N to 58°S, its height from its width, DPR ≤ 2. Land is a dot every 2° from a 1° land mask (Antarctica left out). Each dot's colour comes from its daylight: night colour → a warm twilight colour → the day colour. A deterministic scattering of dots — denser in the bands where most people live — carry city lights that glow amber as night falls on them. The terminator is a fine dashed warm line, and the subsolar point is a glowing sun disc.\n\nTeam pins are DOM markers over the canvas with a dot (green in working hours, blue when awake but off, grey asleep) and a label with first name and local time. Header: a title, \"3 of 7 in working hours · Tue 14:20 UTC · now\", a Play the day toggle (sweeps 24 hours in about 12s) and a Now button. A range input shifts time 0–24h ahead in 15-minute steps with a readable value text. Under it, a grid of team cards: a sun or moon glyph, name and city, the local time large, and the state (Working, Off, Asleep) in words.\n\nTwo themes, night (glowing on near-black) and paper (navy night side and amber lights on cream).",
  interaction: "Drag the scrubber or press Play the day to sweep day and night across the map; Now returns to the present. Everything updates the pins and the team list.",
  animation: "Play sweeps a full day in about 12 seconds; otherwise the map follows the real clock. Nothing moves on its own under reduced motion apart from the clock.",
  a11y: "The canvas is an image with a label giving the UTC time and where the sun is overhead; the scrubber is a labelled range with readable value text; team status is written out in words, not just colour.",
  responsive: "The map keeps its proportions at any width; the team list wraps into as many columns as fit.",
  touchFallback: "The scrubber and buttons work by touch.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --dl-accent #ffd27a; --dl-accent-ink #1f1604; --dl-asleep #6e7385; --dl-awake #9ec5f4; --dl-card #0f1117; --dl-chip rgba(255, 255, 255, 0.06); --dl-ink #f1f2f6; --dl-line rgba(255, 255, 255, 0.08); --dl-muted #9a9eab; --dl-sun #ffd27a; --dl-work #5fd39a. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --dl-accent #14161c; --dl-accent-ink #fbfaf6; --dl-asleep #737885; --dl-awake #2a63b0; --dl-card #fbfaf6; --dl-chip rgba(20, 22, 28, 0.05); --dl-ink #14161c; --dl-line rgba(20, 22, 28, 0.1); --dl-muted #5a5e69; --dl-sun #e08a1e; --dl-work #13804a. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#07080c", mode: "center", height: 640 },
};
