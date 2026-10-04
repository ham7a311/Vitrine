import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "thinking-trace",
  "name": "Thinking Trace",
  "category": "ai",
  "description": "A reasoning status that shows its work without shouting: the current step shimmers across its own words with a live timer, and the line expands into the steps already done, each with its duration.",
  "tags": [
    "ai",
    "status",
    "loader",
    "streaming",
    "disclosure",
    "reasoning"
  ],
  "traits": [
    "ambient",
    "click",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "ThinkingTrace.tsx",
    "thinking-trace.css"
  ],
  "dependencies": [],
  "prompt": "Design the 'thinking' state of an AI reply as a quiet one-line status that is also a log. The line has a breathing accent dot (scale pulse plus an expanding ring), the current step's text, a tabular mono timer and a chevron. The current step's text carries its own shimmer \u2014 a 100\u00b0 gradient (muted \u2192 ink \u2192 muted) clipped to the letters with background-clip: text, sliding across every 1.8s \u2014 and each new step enters with a 4px rise.\n\nThe whole line is a disclosure button: expanding (grid-template-rows 0fr \u2192 1fr, 480ms) reveals the steps already finished on a thin vertical thread, each with a dot and its duration in mono, plus the pending step highlighted in accent. When everything finishes, the dot settles into a small still grey point and the line becomes 'Thought for 6s'. Steps and durations are data; the demo loops. Paper and night themes.",
  "interaction": "Click (or Enter/Space) the status line to show or hide the finished steps.",
  "animation": "1.8s text shimmer, 1.6s breathing dot with ring, 460ms step entry, 480ms disclosure; everything settles when done.",
  "a11y": "The line is a real button with aria-expanded/aria-controls; the current step and completion are announced politely; reduced motion shows the final state without shimmer or pulses.",
  "responsive": "Fluid to 34rem; long step names truncate with an ellipsis on the line and wrap in the log.",
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
  "touchFallback": "Tap the line to toggle the log."
};
