import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "platform-downloads",
  name: "Platform Downloads",
  category: "buttons",
  description: "Download and store buttons with the platform marks (macOS, Windows, Linux, App Store, Google Play, Microsoft Store, Android) in solid, outline and light styles, plus a block that puts the visitor's own system first with the right build chosen, a split menu for the other builds and a copyable install command.",
  tags: ["download", "app store", "google play", "macos", "windows", "linux", "badge", "buttons", "platform"],
  traits: ["click", "keyboard", "hover"],
  source: "original",
  files: ["PlatformDownloads.tsx", "platform-downloads.css", "logos.tsx", "platform.ts"],
  dependencies: [],
  prompt:
    "Build download buttons for a desktop and mobile app (a fictional 'Qalam' 2.4.1).\n\nBadges: an inline 52px button (64px large) with an 11px radius, the platform mark at 27px on the left, and two lines: a small 10.5px top line ('Download for', 'Download on the', 'Get it on', 'Get it from') over an 18px semibold name. Marks are single-colour SVGs in currentColor (Apple, the four-square Windows mark, a penguin, the Android robot head, a shopping bag with four squares) except the Play triangle, which keeps its four colours. Three styles: solid (near-black with a 1px grey edge, like store badges), outline (transparent with a 1.5px hairline) and light (white with a soft shadow). Hover lifts 1px, nudges the mark and slides a soft diagonal sheen across once; press moves down 1px.\n\nBlock: a 18px-radius card. Heading 'Qalam for macOS' and 'Version 2.4.1 · 2 October 2026'. A large split button: the left part is the download link (mark, 'Download for macOS', and 'Apple silicon · .dmg · 84 MB' under it), the right part a caret that opens a menu of builds as menuitemradio rows (label, recommended tag on the build matching the detected architecture, format and size). Under it the install command in mono with a $ prompt and a Copy button that turns green 'Copied'. A hairline, then 'Other platforms ▾' revealing outline badges for the other systems and the stores. On iOS or Android the primary becomes the App Store or Google Play badge. Unknown systems see every option.\n\nDetection: the user agent plus userAgentData (platform and high-entropy architecture), checking Android before Linux and treating a touch 'Macintosh' as an iPad. It runs after hydration; a detected prop forces it.",
  interaction:
    "Badges are links. The caret opens the build menu (ArrowDown also opens it); ↑/↓, Home and End move, Enter picks, Escape or Tab closes and returns focus. Copy writes the command to the clipboard and announces it. 'Other platforms' is a disclosure.",
  animation: "Hover lift, mark nudge and a one-pass sheen; the menu and the platform list drop in over 0.15s. All removed with reduced motion.",
  a11y: "Real links and buttons; the caret has aria-haspopup, aria-expanded and a label naming the current build; menu rows are menuitemradio with aria-checked. Marks are aria-hidden because the visible text names the platform.",
  responsive: "Badges wrap. Below 520px the split button spans the width and the build line may wrap.",
  touchFallback: "Every control is a tap target; nothing depends on hover.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#e9e9e6", mode: "fill", frame: [1100, 820] },
  isNew: true,
};
