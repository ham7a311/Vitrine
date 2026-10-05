import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "word-bank",
  name: "Word Bank",
  category: "forms",
  description: "Build a sentence from chunky word tiles: each tap flies a tile onto the ruled answer line and leaves its outline in the bank; Check slides up a green or red verdict bar with the right answer.",
  tags: ["learning", "quiz", "exercise", "tiles", "language", "gamification"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["WordBank.tsx", "word-bank.css"],
  dependencies: [],
  prompt:
    "Build a sentence-building exercise in a bright, chunky, friendly style: Nunito, white page, ink #4b4b4b, light grey #e5e5e5 for every border. A 38rem centred column holds an 800-weight instruction ('Write this in English', 22–30px), then the prompt sentence in a 2px-bordered speech bubble with 16px corners and a tail on its left. Under it, an answer area two 62px rows tall drawn as two 2px grey rules; chosen tiles sit on the rules with 8px gaps. Then the bank: centred, wrapping tiles 46px tall with 12px corners, a 2px grey border and a 2px solid grey lip under them (box-shadow 0 2px 0), 17px bold text. A chosen tile leaves a flat grey rounded ghost of the same size in its bank slot, so the bank never reflows.\n\nA full-width footer bar with a 2px top rule holds an outlined 'SKIP' button (grey text, 4px grey lip) on the left and 'CHECK' on the right: green #58cc02 with a 4px #58a700 lip, white uppercase 15px 800 text with letter-spacing, 16px corners; disabled it is flat grey with grey text. After checking, the bar turns pale green #d7ffb8 or pale red #ffdfe0 and rises into place: a 52px white circle with a green tick or red cross, 'Nicely done!' in green or 'Not quite. The answer:' plus the correct sentence in red, and a CONTINUE button in green or red with its matching lip.",
  interaction:
    "Tap a bank tile to add it to the end of the answer; tap an answer tile to send it back to its own slot. Keys 1–9 add the matching bank tile, Backspace returns the last word, and Enter checks or continues. Answers compare ignoring case, punctuation and extra spaces against any accepted answer. onCheck reports the result and sentence; onContinue and onSkip let the host move on.",
  animation:
    "Tiles move with FLIP: measured before the change, then animated 280ms from where they were to where they land, so they visibly fly between bank and line. Buttons drop into their lips on press (80ms). The verdict bar fades its colour and its contents rise 10px. Reduced motion places tiles instantly and drops the rise.",
  a11y:
    "Tiles are real buttons; answer tiles are named 'word, remove from answer' and bank tiles expose their number key with aria-keyshortcuts. The answer group's label reads the sentence built so far. The verdict is a role=status region and focus moves to Continue, then back to Check for the next exercise. The prompt carries its own lang attribute.",
  responsive: "Tiles wrap at any width; under 30rem the footer buttons share the row equally and the verdict takes its own line.",
  touchFallback: "Everything is tap-first; tiles are 46px tall.",
  variants: [
    { id: "light", label: "Light", prompt: "Light theme: page and tiles #ffffff, ink #4b4b4b, muted #777777, faint #afafaf, borders and lips #e5e5e5, green #58cc02 with lip #58a700 and pale #d7ffb8, red #ff4b4b with lip #ea2b2b and pale #ffdfe0, focus ring #1cb0f6." },
    { id: "dark", label: "Dark", prompt: "Dark theme: page and tiles #131f24, ink #dce6ec, muted #8ea3ad, faint #52656d, borders and lips #37464f, verdict bars #202f36 with green text #79d634 or red text #ff7878, buttons keep the bright green and red with their lips, focus ring #49c0f8." },
  ],
  preview: { bg: "#ffffff", mode: "fill", frame: [760, 720] },
  isNew: true,
};
