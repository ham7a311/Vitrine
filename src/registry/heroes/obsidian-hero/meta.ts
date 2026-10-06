import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "obsidian-hero",
  name: "Obsidian Hero",
  category: "heroes",
  description: "A dark studio hero over a pool of black liquid that slowly folds and catches cold light under a faint grid. A hairline-thin line of type sits over a heavy one, and a sound switch plays a quiet ambient bed whose live waveform draws in the nav.",
  tags: ["hero", "dark", "liquid", "webgl", "shader", "agency", "sound", "audio", "grid"],
  traits: ["webgl", "cursor", "ambient", "click"],
  source: "original",
  files: ["ObsidianHero.tsx", "obsidian-hero.css", "drone.ts"],
  dependencies: [],
  prompt:
    "Build an agency hero (a fictional data studio, 'NOOR Systems') over a WebGL pool of black liquid.\n\nLiquid: a fragment shader over twice domain-warped four-octave value noise, scaled so many small swirls fill the frame (about 1.5 units per screen height). Read it as a height field: the gradient gives a normal; colour is a near-black base plus a slate-blue reflection (a broad sheen and a strong Fresnel at steep slopes) and a cold pale specular (power 22), so it looks like glossy oil under one cool light. It folds slowly; the pointer drops a faint ring. Darken it toward the bottom, render at 0.6× resolution, and pause off-screen.\n\nOver it: a faint square grid (1px lines at 5.5% white, about 136px cells) and a fade to black along the bottom. Nav: a line-drawn cube mark and a spaced wordmark (0.32em tracking, with a small mono subline), centred links in light grey with a chevron on the first, a sound switch, and a square white 'Start a project ↗' button. The sound switch is mono uppercase 'SOUND' and 'OFF' spread across a 140px hairline with end ticks; turning it on fades in a WebAudio bed (two low detuned sines, a soft triangle, and lowpass noise, each swelling slowly) and the hairline becomes its live waveform from an AnalyserNode.\n\nCopy: a hairline Inter 100 uppercase line ('WE SHAPE', about 150px) over a black-weight line ('SIGNAL.', about 170px, tight tracking), a mono uppercase tagline with wide tracking in grey, and an outlined square CTA in bold mono caps with ↗ that fills white on hover.",
  interaction: "The sound switch toggles the ambient bed (aria-pressed); it fades out and suspends when the tab is hidden. Buttons lift and their arrows nudge; the outlined CTA fills on hover. The pointer stirs the liquid.",
  animation: "The liquid folds continuously and slowly and stops off-screen; reduced motion or motion={false} shows one still frame. The sound line moves only while sound is on.",
  a11y: "Sound is off by default and only starts from a press. Real nav, h1 and links; the canvas and grid are decorative; a static gradient stands in without WebGL.",
  responsive: "Below 60rem the centre links hide; below 34rem the sound switch and the wordmark subline hide and the tagline tightens. Type scales with the container.",
  touchFallback: "Without a pointer the liquid just drifts.",
  variants: [
    { id: "dark", label: "Dark" },
    { id: "light", label: "Light" },
  ],
  preview: { bg: "#07090c", mode: "fill", frame: [1440, 780] },
  isNew: true,
};
