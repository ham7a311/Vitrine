import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "roll-call",
  "name": "Roll Call",
  "category": "type",
  "description": "A roster of names where focus dims the room: the chosen name turns to italic serif in its own colour and its role slides out on a mono rail.",
  "tags": [
    "names",
    "list",
    "roster",
    "hover",
    "keyboard"
  ],
  "traits": [
    "hover",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "RollCall.tsx",
    "roll-call.css"
  ],
  "dependencies": [],
  "prompt": "Stack a list of people, each a full-width button row: a mono index, the name in Geist 600 at clamp(1.6\u20132.6rem) with -0.035em tracking, and a mono uppercase role hidden to the right. When a row is hovered or focused, drop every other row to 20% opacity. The active name switches to Instrument Serif italic, takes its own accent colour, nudges right by 0.5rem, and its role slides in from -14px while fading up. ArrowUp/ArrowDown move focus between rows; a tap toggles the state on touch.",
  "interaction": "Hover or focus a row to spotlight it; arrow keys move between rows; tap toggles on touch.",
  "animation": "Opacity, colour, transform and font swap on a 0.3\u20130.4s ease; role slides in on a spring-ish cubic-bezier.",
  "a11y": "Each row is a real button in a list, with visible focus ring; motion is transitions only and is removed under reduced motion.",
  "responsive": "Type scales with clamp(); the role column sits beside the name and stays right-aligned.",
  "variants": [
    {
      "id": "roster",
      "label": "Roster",
      "prompt": "Roster: five rows \u2014 Masar (#7c9cff), Wally (#ff7fb6), OCS (#4fd68a), TransOcean (#ffc35c), Vitrine (#5fd6e8) \u2014 each with its role."
    },
    {
      "id": "short",
      "label": "Short list",
      "prompt": "Short list: the first three rows only \u2014 Masar (#7c9cff), Wally (#ff7fb6), OCS (#4fd68a)."
    }
  ],
  "preview": {
    "bg": "#0c0b0a",
    "mode": "fill"
  },
};
