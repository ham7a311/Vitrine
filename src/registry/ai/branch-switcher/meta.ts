import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "branch-switcher",
  "name": "Branch Switcher",
  "category": "ai",
  "description": "Editing a message starts a branch instead of overwriting it; step between versions and the question and answer slide together, with a tiny branch tree.",
  "tags": [
    "ai",
    "chat",
    "branching",
    "versions",
    "edit",
    "llm",
    "conversation",
    "history"
  ],
  "traits": [
    "click",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "BranchSwitcher.tsx",
    "branch-switcher.css"
  ],
  "dependencies": [],
  "prompt": "Build message versioning for an AI chat. A user message bubble sits above an assistant answer; under the bubble, an edit button, a pager (\"‹ 2 / 3 ›\", disabled at the ends, the count announced politely) and a tiny SVG branch tree: a short trunk splitting into one curved branch per version, each ending in a dot, the current one filled in the accent (clickable to jump). Stepping to another version slides the bubble and answer in from the direction you moved (36px, with a 4px blur, 460ms; the answer 70ms behind) — only those two parts re-mount, so focus stays on the pager. Editing swaps the bubble for a textarea with Cancel and \"Save as new branch\"; saving appends a new version with a new answer and moves to it, so nothing is ever overwritten.",
  "interaction": "Use ‹ › or the tree to move between versions; Edit to write a new version, which becomes a new branch.",
  "animation": "Version change: slide and unblur 460ms, answer 70ms later.",
  "a11y": "The pager is a nav with labelled buttons and a polite position readout; the textarea is labelled; focus stays on the pager while switching. Reduced motion swaps versions without the slide.",
  "responsive": "A card up to about 40rem wide that fills narrower screens; dense rows and side columns stack on phones.",
  "touchFallback": "Everything is tap-driven; hover hints have tap or focus equivalents.",
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
    "bg": "#efede8",
    "mode": "fill",
    "height": 620
  },
};
