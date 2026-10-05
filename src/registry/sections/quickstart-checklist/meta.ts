import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "quickstart-checklist",
  name: "Quickstart Checklist",
  category: "sections",
  description: "Onboarding as a short stack of numbered, hard-edged cards: the next step is open and lifted, marking it done stamps and folds it, and a segmented bar keeps count.",
  tags: ["onboarding", "checklist", "setup", "steps", "progress", "developer"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["QuickstartChecklist.tsx", "quickstart-checklist.css"],
  dependencies: [],
  prompt:
    "Build an onboarding checklist in a playful-technical, diagrammatic style: warm off-white page #f4efea, white cards, ink #383838, 2px ink borders, 2px corners, flat hard shadows, DM Mono uppercase for headings, numbers and buttons, Inter light for prose.\n\nA header with the title ('GET WALLY RUNNING', 22–28px DM Mono) and '1 of 4 done' on the right. Under it, a segmented progress bar: one 12px bordered segment per step with 6px gaps, filling teal #16aa98 as steps finish. Then an ordered stack of step cards, 12px apart. Each card's header is a full-width disclosure button: a 34×30 bordered yellow #ffde00 number chip ('01'), the step title at 16px 500, and a chevron that flips when open. The open card lifts (translate −2px, −2px) onto a 4px 4px 0 hard shadow and shows its body indented under the title: muted prose (inline code in small bordered mono), then a sky #6fc2ff primary action button and an outlined 'MARK AS DONE'. Finished cards turn a pale teal, their chip becomes a teal ✓, the title strikes through, and a small teal-outlined 'DONE' stamp tilted −4° drops in from 160% scale. Buttons lift 2px with a 2px hard shadow on hover.",
  interaction:
    "One step is open at a time; headers toggle their own step. Mark as done saves, opens the next unfinished step and moves focus to its header; Mark as not done reopens a step. With storageKey, finished steps persist (try/catch, ignoring unknown ids). onComplete fires once when the last step is finished.",
  animation: "Cards lift and shadows appear over 160ms; segments fill over 260ms; the stamp drops with a slight overshoot. Reduced motion removes the lift, fill transition and stamp drop.",
  a11y:
    "Each step header is a real button inside a heading with aria-expanded and aria-controls; collapsed bodies use hidden. The segmented bar is a progressbar with value and maximum, and the count is announced politely. Focus moves to the next step header after marking one done.",
  responsive: "Fluid width; under 28rem the step body drops its indent.",
  touchFallback: "Every control is a tap target; nothing depends on hover.",
  variants: [
    { id: "light", label: "Light", prompt: "Light theme: page #f4efea, cards #ffffff, ink, borders and hard shadows #383838, muted #6f6a64, faint #a39e97, yellow chips #ffde00, sky action #6fc2ff, teal progress and done #16aa98, finished card #eaf6f3." },
    { id: "dark", label: "Dark", prompt: "Dark theme: page #1f1f1f, cards #2a2927, ink and borders #f4efea with #000000 hard shadows, muted #b9b2a9, faint #7d776f, finished card #23332f; yellow, sky and teal keep their values with ink text on the yellow and sky fills." },
  ],
  preview: { bg: "#f4efea", mode: "fill", frame: [820, 700] },
  isNew: true,
};
