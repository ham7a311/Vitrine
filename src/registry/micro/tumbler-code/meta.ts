import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "tumbler-code",
  name: "Tumbler Code",
  category: "micro",
  description: "A six-slot one-time code input built like a lock: each digit drops into its slot like a tumbler pin setting, the caret slides between slots, a paste fills them in a quick ripple, and the right code locks the row with a padlock. A wrong code shakes only the slot that's wrong.",
  tags: ["otp", "one-time code", "verification", "input", "pin", "2fa", "micro-interaction", "auth"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["TumblerCode.tsx", "tumbler-code.css", "code.ts"],
  dependencies: [],
  prompt:
    "Build a one-time code input with lock-like feedback. Props: length (default 6), label, onComplete(code) returning a promise of {ok: true} or {ok: false, reason, at} (at = the wrong slot, if known) and theme.\n\nUse one real input — inputMode numeric, autocomplete one-time-code, maxLength = length, font-size 16px so phones don't zoom — laid invisibly over a row of 52×64px slots with 14px corners and 10px gaps, so typing, pasting, autofill and deleting all just work. Strip anything that isn't a digit.\n\nEach slot shows its digit (1.7rem, tabular) and a short pin bar near its foot. When a digit arrives it drops in from above with a slight overshoot (420ms) and the pin turns accent-coloured and clicks up 2px; a paste or autofill drops several in a 45ms ripple; only slots whose digit changed animate. A 2px accent caret blinks in the next empty slot (the last when full) and slides between slots (220ms); the active slot gets an accent ring.\n\nWhen the code is complete, call onComplete; while waiting the slots breathe an accent outline and the input is read-only. On success the row turns green-tinted, the pins settle, a padlock fades in at the end of the row and its shackle drops shut, and a status says 'Code accepted.'. On failure the wrong slot (or every slot, if the host doesn't say) turns red and shakes, the reason is shown, and after 650ms the code is cleared back to the wrong slot so the user re-enters from there.\n\nThe label names the input; the status line is its description and a polite live region; aria-invalid is set on failure. Reduced motion removes the drops, shake and blinking.",
  interaction: "Type, paste or autofill the code; fix a wrong digit from where it's highlighted.",
  animation: "Digits drop in over 420ms with a 45ms ripple on paste; the caret slides over 220ms and blinks; a wrong slot shakes for 420ms; the lock pops in after 250ms with its shackle closing. Reduced motion: no drops, shake or blink.",
  a11y: "A single labelled native input (one-time-code autofill, numeric keypad) with its status as aria-describedby in a live region and aria-invalid on failure; the visual slots are hidden from assistive tech.",
  responsive: "Slots shrink to 44px under 420px of screen width.",
  touchFallback: "Tapping the row focuses the real input; the numeric keypad and code autofill work as usual.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --tumb-accent #8fb3ff; --tumb-bad #ff7b6b; --tumb-edge rgba(255, 255, 255, 0.1); --tumb-face #161618; --tumb-good #4fd18b; --tumb-ink #f4f4f1; --tumb-muted #a2a29d. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --tumb-accent #2f5fd6; --tumb-bad #c2382a; --tumb-edge rgba(20, 20, 18, 0.14); --tumb-face #ffffff; --tumb-good #13844b; --tumb-ink #151513; --tumb-muted #5c5a54. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#050505", mode: "fill", height: 420 },
};
