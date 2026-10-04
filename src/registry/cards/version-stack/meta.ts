import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "version-stack",
  "name": "Version Stack",
  "category": "cards",
  "description": "Release notes as a physical stack: the newest version sits on top, older ones lie beneath it, and moving back in time lifts each sheet away to reveal the one underneath.",
  "tags": [
    "card",
    "changelog",
    "release-notes",
    "stack",
    "history",
    "drag"
  ],
  "traits": [
    "click",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "VersionStack.tsx",
    "version-stack.css"
  ],
  "dependencies": [],
  "prompt": "Present release notes as a physical stack where visible depth equals history. Render every version as a sheet in the same grid cell. For the current index `at`, sheet i has depth i \u2212 at: depth 0 is the readable front sheet; depths 1\u20133 sit behind it, each 14px lower, 5% smaller from the bottom centre and a step darker, with their content hidden so they read as paper edges; deeper sheets wait invisibly at depth 3; negative depths have been lifted away (up 78%, tilted \u22124\u00b0, faded). All moves use 620ms cubic-bezier(0.16,1,0.3,1).\n\nGoing back in time lifts the front sheet off to reveal the older one beneath; coming forward lays it back down. Inputs: drag the front sheet up (it hinges back on its top edge as the finger rises, rubber-banding at 25% at either end; release past 70px or with velocity to commit), drag down to pull the previous sheet back into place, wheel (one step per 420ms), \u2191/\u2193/PageUp/PageDown/Home/End, and a rail beside the deck with \u2191/\u2193 buttons and a gauge of short ticks \u2014 past versions dimmer, the current one a longer accent tick.\n\nEach sheet: version tag pill in the accent, uppercase mono date, an Instrument Serif title, and a list of notes with small uppercase kind labels (Added in accent).",
  "interaction": "Drag the front sheet up for older, down for newer; or use the wheel, arrow keys, or the rail buttons and gauge.",
  "animation": "620ms expo-out transforms per sheet; content fades 200ms out / 420ms in; drag tracks 1:1 with rubber-banding at the ends.",
  "a11y": "The deck is a focusable region with arrow/Page/Home/End keys; only the front sheet is exposed to assistive tech; the current version is announced politely; the rail uses real buttons with aria-current='step'. Reduced motion swaps sheets instantly.",
  "responsive": "The deck is fluid up to 26rem and reserves padding for the visible stack depth.",
  "variants": [
    {
      "id": "frost",
      "label": "Frost",
      "prompt": "accent=\"#b9cce4\" (frost blue) for the version pill, Added labels and current tick."
    },
    {
      "id": "amber",
      "label": "Amber",
      "prompt": "accent=\"#e8a24a\" (amber) for the version pill, Added labels and current tick."
    }
  ],
  "preview": {
    "bg": "#0b080d",
    "mode": "fill"
  },
  "touchFallback": "Vertical drags on the deck (touch-action: none) move through versions; the rail offers tap targets."
};
