import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "step-path",
  "name": "Step Path",
  "category": "sections",
  "description": "A 'how it works' section where a single line runs through the steps and draws itself as you scroll; each step lights up at the moment the line reaches it.",
  "tags": [
    "section",
    "how-it-works",
    "steps",
    "scroll",
    "saas",
    "onboarding"
  ],
  "traits": [
    "scroll",
    "ambient"
  ],
  "source": "original",
  "files": [
    "StepPath.tsx",
    "step-path.css"
  ],
  "dependencies": [],
  "prompt": "Build a vertical 'how it works' section connected by one line. Each step is a 46px round node with a mono number, then a mono meta label in the accent, an Instrument Serif title and a muted paragraph. A 1px rail runs behind all the nodes; on top of it an accent 'ink' line (with a soft fade at the very top) is scaled on Y by scroll progress \u2014 the point 60% down the viewport (or scroll container) mapped across the section \u2014 so reading down literally draws the path. A small glowing dot rides the tip of the line (counter-scaled so it stays round).\n\nEach node's position along the rail is measured (ResizeObserver). When the ink reaches a node, that step 'arrives': the node fills with a tinted accent, gains an accent ring and a soft halo, and its copy rises from 38% opacity and slides in 6px. Scrolling back up reverses it. Reduced motion shows the whole path drawn.",
  "interaction": "Scroll through the section; the line draws with you and each step lights when reached.",
  "animation": "Scroll-linked scaleY of the line (rAF-throttled); node and copy transitions 400\u2013700ms expo-out when reached.",
  "a11y": "An ordered list of real headings and paragraphs; the rail and numbers are decorative. Reduced motion shows everything fully drawn.",
  "responsive": "Fluid to 38rem; gaps and type scale down on small screens.",
  "variants": [
    {
      "id": "frost",
      "label": "Frost",
      "prompt": "accent=\"#b9cce4\" (frost blue) ink line, tip dot and arrived nodes."
    },
    {
      "id": "amber",
      "label": "Amber",
      "prompt": "accent=\"#e8a24a\" (amber) ink line, tip dot and arrived nodes."
    }
  ],
  "preview": {
    "bg": "#0b080d",
    "mode": "scroll"
  },
  "touchFallback": "Works identically with touch scrolling."
};
