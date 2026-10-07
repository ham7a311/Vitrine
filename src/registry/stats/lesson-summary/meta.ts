import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "lesson-summary",
  name: "Lesson Summary",
  category: "stats",
  description: "The results screen at the end of a lesson: three chunky tiles count up the XP, accuracy and time, then the week's streak fills in today with a small pop.",
  tags: ["results", "gamification", "learning", "streak", "xp", "summary"],
  traits: ["click"],
  source: "original",
  files: ["LessonSummary.tsx", "lesson-summary.css"],
  dependencies: [],
  prompt:
    "Build an end-of-lesson results screen in a bright, chunky, friendly style: Nunito, centred 34rem column. A 900-weight 28–36px 'Lesson complete!' in warm gold #ffb100 pops in from 80% scale. Below, three equal tiles in a row: each has a 2px border and header band in its colour (gold #ffc800 'TOTAL XP', green #58cc02 for accuracy, blue #1cb0f6 for time) with white uppercase 12px 800 labels, and an inner white panel with 14px corners showing a small icon and the value in the deeper tone (#e5a400, #58a700, #1899d6) at 24px 800 with tabular numbers. The accuracy header reads FLAWLESS (100), AMAZING (90+), GOOD (75+) or ACCURACY; the time header reads SPEEDY at two minutes or less, otherwise TIME. Values count up from zero over 900ms with a cubic ease-out, 150ms apart, and the tiles rise in with the same stagger.\n\nUnder the tiles, a 2px grey-bordered streak card: an orange flame and '6 day streak' in #ff9600, then seven day columns with narrow weekday initials and 28px circles, orange with a 3px darker lip and a white tick when the goal was met, grey when missed. Today's circle pops in last. Two full-width 50px buttons: outlined grey 'REVIEW LESSON' and green 'CONTINUE' with a solid 4px #58a700 lip that disappears as the button drops on press.",
  interaction: "Continue and Review call their callbacks; the demo replays the screen. Values come entirely from props.",
  animation:
    "The heading pops with an overshoot curve, tiles rise 12px in sequence, numbers count up with requestAnimationFrame, and today's streak dot scales in after the counts. With reduced motion everything shows its final value immediately.",
  a11y:
    "A section labelled by its heading. The numbers animate in an aria-hidden layer while one status line reads the full result once ('27 XP earned, 94% accuracy, 1:44 taken. 6 day streak.'). Each streak day has hidden text for met or missed and marks today. Buttons have visible focus rings.",
  responsive: "Under 26rem the tile icons hide, labels tighten, and the buttons stack with Continue on top.",
  touchFallback: "Two large tap targets; nothing depends on hover.",
  variants: [
    { id: "light", label: "Light", prompt: "Light theme: page and tile panels #ffffff, ink #4b4b4b, muted #777777, borders #e5e5e5, heading #ffb100, flame and streak #ff9600 with lip #e08600, Continue green #58cc02 with lip #58a700, focus ring #1cb0f6." },
    { id: "dark", label: "Dark", prompt: "Dark theme: page and tile panels #131f24, ink #dce6ec, muted #8ea3ad, borders and missed days #37464f, values use the bright tile colours (#ffc800, #58cc02, #1cb0f6) instead of the deeper tones, focus ring #49c0f8; heading, streak and buttons keep their bright colours." },
  ],
  preview: { bg: "#ffffff", mode: "fill", frame: [640, 720] },
};
