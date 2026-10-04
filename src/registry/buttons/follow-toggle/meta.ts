import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "follow-toggle",
  "name": "Follow Toggle",
  "category": "buttons",
  "description": "A follow button that changes its mind honestly: Follow becomes Following with a check, the pill narrows to fit, and hovering a followed state quietly offers Unfollow.",
  "tags": [
    "button",
    "toggle",
    "follow",
    "subscribe",
    "state",
    "social"
  ],
  "traits": [
    "click",
    "hover",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "FollowToggle.tsx",
    "follow-toggle.css"
  ],
  "dependencies": [],
  "prompt": "Build a follow button with three labels in one pill \u2014 Follow (bone fill, + icon), Following (transparent with a hairline ring and a check that draws itself) and Unfollow (rose tint and ring, shown only when hovering a followed state, so the consequence is previewed before the click). All three labels are stacked in one grid cell and cross over with a 40% rise and a 3px blur resolving; the pill's width animates to the visible label's measured width (hidden copies, re-measured after fonts load) over 460ms expo-out. Following a person releases a faint ring that bursts outward from the pill and fades. Press compresses to 0.96. The accessible label says who you follow and what pressing will do; aria-pressed reflects state.",
  "interaction": "Click to follow; hover while following to see Unfollow; click again to unfollow.",
  "animation": "Width 460ms; labels cross with blur and lift (260\u2013420ms); check draw 420ms; follow burst 700ms.",
  "a11y": "A toggle button with aria-pressed and a descriptive label; hidden label copies are aria-hidden. Reduced motion makes changes instant.",
  "responsive": "Intrinsic width that follows the label.",
  "preview": {
    "bg": "#0b080d",
    "mode": "fill"
  },
  "touchFallback": "On touch there's no hover preview; tapping a followed state unfollows directly."
};
