import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "outcome-flicker",
  name: "Outcome Flicker",
  category: "analytics",
  description: "A forecast you count instead of decode. Each frame is one simulated future — “Run 37: ready Thursday, on time” — and a tally of a hundred runs fills underneath until the share that made it is plain. It starts paused, steps in discrete frames, and an All runs view lays every outcome out at once, so uncertainty reads as “about 7 in 10”, not as a shaded band.",
  tags: ["analytics", "forecast", "uncertainty", "probability", "simulation", "hypothetical outcomes", "frequency", "risk", "deadline", "monte carlo"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["OutcomeFlicker.tsx", "outcome-flicker.css", "draws.ts"],
  dependencies: [],
  prompt:
    "Build a forecast that shows uncertainty as outcomes you can count (hypothetical outcome plots). A 44rem card, 16px radius.\n\nHeader: a small mono caps label 'FORECAST · 100 SIMULATED RUNS' over the question in 19px semibold — 'Ready by Friday?' — and on the right a two-way segmented control: 'One run at a time' · 'All runs'. Under it three option cards in a row (10px radius, 1px border; the chosen one gets a 1.5px ink border): 'Ship as planned — all 9 tickets', 'Cut the importer — 7 tickets', 'Add the audit log — 12 tickets'. They're a radiogroup moved with the arrow keys.\n\nEvery option has 100 runs drawn from a seeded generator (mulberry32 + Box–Muller normal: days to ready = mean + sd·z, never below half a day), so frames are reproducible. A run is on time when it's ready in five working days or fewer.\n\nOne run at a time: a line 'Run 37' (mono, faint) and the outcome in 17px semibold — 'Ready Thu 4.3 days · on time' in green, or 'Ready next Tue 6.8 days · late' in red. Under it a 44px track over two working weeks (Mon … Fri, Mon … Fri; the second week faded) with a dashed 'FRIDAY' deadline and the late side tinted red; the current run drops onto it as a 14px dot. Under that, a tally of 100 slim cells (50 a row) fills left to right — green on time, red late, the current one ringed — and a line: '23 of 31 runs on time · 8 late · about 7 in 10 so far'. Controls: previous, an ink Play/Pause (Replay at the end), next, back to start, and a hint '← → step · Space play'. It is paused by default and never jitters: a new frame every 450ms, discrete, with the count always visible. It pauses offscreen (IntersectionObserver) and in hidden tabs.\n\nAll runs: each option as a strip plot — every run a small dot along the same two-week axis, green or red, the late side tinted — with 'on time in 64 of 100 runs · about 6 in 10'; the chosen option at full strength, the others at 55%. The option cards show their percentages here. Reduced motion forces this view.",
  interaction:
    "Pick an option (click or arrow keys). Play, pause or step through runs with the buttons, ←/→ and Space; switch to All runs to see every outcome at once.",
  animation: "Frames advance every 450ms only while playing and on screen; each new outcome rises 3px into place and its dot pops onto the track. Reduced motion shows the All runs view and no motion.",
  a11y: "Option and view switches are radiogroups; each strip plot is an image labelled with its count; stepping announces the run, its result and the running tally in a polite status region; the decorative frame is hidden from screen readers in favour of those announcements.",
  responsive: "Below 560px of its own width the header and option cards stack, the tally becomes 25 cells a row, controls grow to 42px and the key hint hides.",
  touchFallback: "Every control is a button; there is nothing to hover or drag.",
  variants: [
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --otfl-card #151515; --otfl-empty #242424; --otfl-faint #5c5c5c; --otfl-focus #8ab4f8; --otfl-go #ededed; --otfl-go-ink #111111; --otfl-hover rgb(255 255 255 / 0.05); --otfl-ink #ececec; --otfl-late rgb(240 100 90 / 0.07); --otfl-line #2a2a2a; --otfl-line-soft rgb(255 255 255 / 0.06); --otfl-muted #8c8c8c; --otfl-no #f0645a; --otfl-yes #6cc08b. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --otfl-card #ffffff; --otfl-empty #ececea; --otfl-faint #a3a3a3; --otfl-focus #2b59c3; --otfl-go #1b1b1b; --otfl-go-ink #ffffff; --otfl-hover rgb(0 0 0 / 0.04); --otfl-ink #1a1a1a; --otfl-late rgb(204 58 48 / 0.06); --otfl-line #e3e3e1; --otfl-line-soft rgb(0 0 0 / 0.06); --otfl-muted #6b6b6b; --otfl-no #cc3a30; --otfl-yes #2f8f55. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0c0c0c", mode: "fill", frame: [1200, 800] },
};
