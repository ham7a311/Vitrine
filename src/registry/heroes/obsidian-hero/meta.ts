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
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --obsd-btn #ffffff; --obsd-btn-ink #050607; --obsd-edge rgb(255 255 255 / 0.55); --obsd-fallback radial-gradient(80% 70% at 60% 40%, #1b2430, #07090c 70%); --obsd-floor #000000; --obsd-focus #ffffff; --obsd-grid rgb(255 255 255 / 0.055); --obsd-ink #ffffff; --obsd-muted #a7adb6; --obsd-soft #d6dbe2. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --obsd-btn #0b0d10; --obsd-btn-ink #ffffff; --obsd-edge rgb(10 14 20 / 0.55); --obsd-fallback radial-gradient(80% 70% at 60% 40%, #f4f7fa, #c9cfd6 70%); --obsd-floor #e9edf1; --obsd-focus #0b0d10; --obsd-grid rgb(10 14 20 / 0.07); --obsd-ink #0b0d10; --obsd-muted #4a515a; --obsd-soft #23272d. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#07090c", mode: "fill", frame: [1440, 780] },
  isNew: true,
};
