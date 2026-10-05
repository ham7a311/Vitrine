import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "lesson-path",
  name: "Lesson Path",
  category: "navigation",
  description: "A course drawn as a winding path of round, pressable lessons: ticks for finished ones, a bobbing Start flag on the next, grey locks after it, and a card with the lesson and its XP on press.",
  tags: ["learning", "progress", "gamification", "course", "path", "lessons"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["LessonPath.tsx", "lesson-path.css"],
  dependencies: [],
  prompt:
    "Build a learning path in a bright, chunky, friendly style: Nunito at 800 for every label, white page, ink #4b4b4b. Each unit starts with a full-width 16px-radius header band in the unit colour with white text (uppercase 'UNIT 1' kicker, 22px title, 15px subtitle) and a solid 4px darker 'lip' under it (box-shadow 0 4px 0, no blur). Below, lessons are 70×64px round buttons stacked with 22px gaps and offset sideways along a sine curve (sin(i × 0.95) × min(76px, 19% of width)), so the path winds.\n\nDone lessons are the unit colour with a white tick and a 6px darker lip; the current lesson is the same with a filled white star, a 6px light-grey ring around it, a slow 4% breathing scale, and a white rounded 'START' flag above it in the unit colour with a 2px grey border and a pointer, bobbing 4px. Locked lessons are grey #e5e5e5 with a darker grey lip and a grey padlock. Pressing any node drops it 6px into its lip. Activating a node opens a card under it with a small pointer: unit colour, white 18px title, 'Lesson 3 of 5', and a full-width white lip button 'START +15 XP' (uppercase, unit-coloured text); done lessons offer 'PRACTISE +5 XP'; locked ones show a pale grey bordered card 'Finish Ordering coffee to unlock this' with no button.",
  interaction:
    "Nodes use a roving tabindex: ↑/↓ (or ←/→) walk the path, Home/End jump to the ends, Enter or Space toggles a lesson's card, and Escape closes it and returns focus to the node. Pressing outside closes the card. Start and Practise call onStart with the lesson id.",
  animation:
    "The current node breathes (scale 1 → 1.04 → 1 over 1.6s) and its flag bobs; cards pop open from 92% with a slight overshoot (cubic-bezier(.34,1.56,.64,1), 200ms); buttons drop into their lips in 90ms. Reduced motion stops the breathing, bobbing and pop.",
  a11y:
    "Each unit is a section labelled by its title; lessons are an ordered list of buttons named like 'Ordering coffee, lesson 3 of 5, up next' with aria-expanded and aria-controls pointing at their card. The decorative flag is hidden from assistive technology.",
  responsive: "The sideways swing scales with the container (19% of its width, capped at 76px) so the path never overflows a 320px phone; cards cap at 86% of the width.",
  touchFallback: "Lessons are large tap targets; tapping outside closes the card.",
  variants: [
    { id: "light", label: "Light", prompt: "Light theme: page #ffffff, ink #4b4b4b, muted #777777, ring and borders #e5e5e5, locked nodes #e5e5e5 with lip #b7b7b7 and glyph #afafaf, locked card #f7f7f7, focus ring #1cb0f6. Unit colours with lips: green #58cc02/#58a700, blue #1cb0f6/#1899d6, purple #ce82ff/#a568cc, orange #ff9600/#cc7a00, pink #ff86d0/#d364ad." },
    { id: "dark", label: "Dark", prompt: "Dark theme: page #131f24, ink #dce6ec, muted #8ea3ad, ring and borders #37464f, locked nodes #37464f with lip #25333a and glyph #52656d, flag background #131f24, locked card #202f36, focus ring #49c0f8. Unit colours and lips stay the same bright values." },
  ],
  preview: { bg: "#ffffff", mode: "fill", frame: [560, 820] },
  isNew: true,
};
