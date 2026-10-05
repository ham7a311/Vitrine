import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "mood-slider",
  name: "Mood Slider",
  category: "controls",
  description: "A rating you can feel: drag along the scale and the face above it changes continuously — brows lifting and settling, eyes narrowing into a grin, the mouth turning from a frown to an open smile, cheeks colouring, the face warming from grey-blue to sunshine. It tilts with your drag and blinks now and then.",
  tags: ["slider", "rating", "feedback", "emoji", "face", "survey", "range", "playful"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["MoodSlider.tsx", "mood-slider.css"],
  dependencies: [],
  prompt: `Build a feedback rating as a native <input type="range"> (0–100, labelled by the question, aria-valuetext = the nearest of Awful/Bad/Okay/Good/Great) with an SVG face above it that is drawn entirely from the value t = v/100.

Face (viewBox 180×190): a head circle filled along a ramp grey-blue #9fb2cf → stone #c9c4b4 → sunshine #ffd46f → orange #ffb13d, with a soft highlight and a ground shadow that widens a little when happy. Mouth: a closed path of two quadratic curves between corners at y = 128 − (t − .5)·12 — the lower lip's control point at 128 + (t − .42)·72 (frown → smile), the upper lip's moving away from it as t passes 0.68 so the smile opens. Eyes: ellipses whose height falls from 9 to 2.2 as t goes past 0.72 (a grin squint) and nearly closes during a 130ms blink every 2.6–5.8s. Brows: rounded bars rotated ±(0.5 − t)·30° below the middle (inner ends lift when sad) and rising and relaxing above it, never knitting into a scowl. Cheeks: blush ellipses fading in above t 0.55. A tear under one eye below t 0.2.

Motion: the face leans into the drag — slider velocity kicks a damped rotational spring (rAF only while it swings) — and the whole card's background follows its own mood ramp (cool → warm). Track: a gradient matching the face ramp, a thumb filled with the current face colour; tick labels under it with the current one bold. A "Send “Good”" button confirms. Themes: paper and night. Reduced motion: no tilt or blink.`,
  interaction: "Drag the slider (or use arrow keys / Page keys) and watch the face; Send confirms.",
  animation: "Continuous geometry from the value; tilt spring (k 140, c 11); blink 130ms at random.",
  a11y: "A native range input with a label and text values; the face is aria-hidden decoration.",
  responsive: "The card is at most 420px wide and fills narrower screens.",
  touchFallback: "Native range drag on touch.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --card-edge rgb(0 0 0 / 0.06); --ink #2a2117; --muted rgb(42 33 23 / 0.55). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --card-edge rgb(255 255 255 / 0.07); --ink #f2ece2; --muted rgb(242 236 226 / 0.55). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ece7dc", mode: "fill" },
};
