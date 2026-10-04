import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "prompt-starters",
  "name": "Prompt Starters",
  "category": "ai",
  "description": "Suggested prompts that preview themselves: hover or focus a card and its full prompt writes itself into the composer as ghost text; click and it becomes real.",
  "tags": [
    "ai",
    "chat",
    "suggestions",
    "empty-state",
    "ghost-text",
    "onboarding"
  ],
  "traits": [
    "hover",
    "keyboard",
    "click",
    "touch"
  ],
  "source": "original",
  "files": [
    "PromptStarters.tsx",
    "prompt-starters.css"
  ],
  "dependencies": [],
  "prompt": "Design the empty state of an AI chat as a composer plus four starter cards. Each card is only an icon, a short title and a hint \u2014 the full prompt is never printed on the card. Instead, hovering or focusing a card types its full prompt into the composer as ghost text (38% ink, three characters every 16ms, with a blinking accent caret, clamped to three lines) while the composer's ring tints to the accent and the card lifts 2px. The bar under the composer says 'Preview \u00b7 click to use'. Leaving the card clears the ghost.\n\nClicking commits: the text becomes real in the textarea with a brief accent wash, focus moves to the end of it, the send button enables and a character count appears; a 'Clear and browse starters' link brings the previews back. Cards enter with a 60ms stagger. Two columns, one below 30rem. Paper and night themes.",
  "interaction": "Hover or focus a starter to preview its prompt in the composer; click to use it; edit before sending.",
  "animation": "Ghost text types at ~190 chars/s with a blinking caret; card lift 380ms; commit flash 900ms; entrance stagger 60ms.",
  "a11y": "Cards are buttons; the ghost text is aria-hidden (it's a preview) and the textarea is labelled; committing moves focus into the textarea. Reduced motion shows the preview instantly.",
  "responsive": "Container query drops to one column below 30rem.",
  "variants": [
    {
      "id": "paper",
      "label": "Paper"
    },
    {
      "id": "night",
      "label": "Night"
    }
  ],
  "preview": {
    "bg": "#f5f1e8",
    "mode": "fill"
  },
  "touchFallback": "On touch the first tap commits the prompt directly (there's no hover preview)."
};
