import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "activity-glyphs",
  name: "Activity Glyphs",
  category: "ai",
  description: "Small drawn marks for what an assistant is doing, each showing its job instead of a generic spinner: pages turning while it reads, code typing between brackets, chevrons marching at a prompt, a pixel grid resolving, bars recomputing, an arrow lifting out of a tray. Each ends in a drawn tick, or a cross with the reason.",
  tags: ["ai", "agent", "status", "activity", "loading", "tool use", "reading", "upload", "terminal", "icons", "indicator"],
  traits: ["ambient"],
  source: "original",
  isNew: true,
  files: ["ActivityGlyphs.tsx", "activity-glyphs.css"],
  dependencies: [],
  prompt:
    "Build a set of activity indicators for an AI agent: an inline 24×24 SVG glyph (1.4em, 1.7px round strokes in the ink colour, frames at 55%) beside a label and an optional quieter detail ('Writing late-fees.ts'). Props: activity, state (active | done | error), label, detail. All motion in CSS:\n\n- Reading: an open book; two copies of the right page flip over the spine (scaleX 1 → −1 about x=12, 1.8s, 0.9s apart) with a faint fill.\n- Writing code: '< >' brackets with three short lines between them that type out in four steps each, 0.45s apart, hold, then fade and start again (2.1s).\n- Running a command: a rounded terminal frame; three '>' chevrons march right and fade, 0.4s apart, and an underscore cursor blinks at 1s.\n- Generating an image: a 4×4 pixel grid where cells resolve from 12% to 90% opacity (and 0.6 → 1 scale) in a scattered fixed order, 70ms apart, hold and fade (2.4s).\n- Analysing data: four bars on a baseline rising and falling to different heights (35%, 85%, 55%, 100%), each a quarter cycle out of step (1.9s).\n- Uploading: a tray with an arrow that lifts out of it and fades (1.5s) while a line inside the tray fills across (3s).\n\nDone replaces the glyph with a green tick drawn by stroke-dashoffset in 450ms; error draws a red cross in 350ms, shakes it once by ±1.5px and turns the label red — the label should carry the reason ('Upload failed: Drive is out of space'). Each is a status element whose label says the text plus 'in progress', 'done' or 'failed'. Animations pause off screen and in hidden tabs; under reduced motion each holds a recognisable still: the page half-turned, one chevron, a checkerboard of resolved pixels, bars at three heights, the tray part-filled.",
  interaction: "Nothing to operate: it shows what the agent is doing. Set `activity` and `state`.",
  animation: "Reading 1.8s, writing 2.1s, running 1.2s with a 1s cursor blink, image 2.4s, analysing 1.9s, uploading 1.5s/3s, all looping; tick 450ms, cross 350ms plus a 400ms shake. Paused off screen. Reduced motion: still poses.",
  a11y: "Each glyph is a status element labelled with its text and its state (in progress, done or failed); the drawing is hidden from assistive technology, and errors are stated in words, not just colour.",
  responsive: "Sized in em, so it follows the text it sits in; labels wrap normally.",
  touchFallback: "No interaction.",
  variants: [
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --acgl-err #f2644f; --acgl-ink #ececec; --acgl-muted #8c8c8c; --acgl-ok #3cc28c. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --acgl-err #d23d2b; --acgl-ink #1a1a1a; --acgl-muted #6b6b6b; --acgl-ok #1f8f60. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0b0b0b", mode: "fill", frame: [1200, 800] },
};
