import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "platform-downloads",
  name: "Smart Download",
  category: "buttons",
  description: "A download block that puts the visitor's own system first with the right build already chosen: a large split button, a menu of the other builds, a copyable install command, and every other platform and store one click away. On a phone it becomes the App Store or Google Play button.",
  tags: ["download", "app store", "google play", "macos", "windows", "linux", "detect", "install", "buttons", "platform", "split button"],
  traits: ["click", "keyboard", "hover"],
  source: "original",
  files: ["PlatformDownloads.tsx", "platform-downloads.css", "logos.tsx", "platform.ts"],
  dependencies: [],
  prompt:
    "Build a download block for a desktop and mobile app (a fictional 'Qalam' 2.4.1) that detects the visitor's system.\n\nBlock: an 18px-radius card. Heading 'Qalam for macOS' and 'Version 2.4.1 · 2 October 2026'. A large split button: the left part is the download link (the platform mark, 'Download for macOS', and 'Apple silicon · .dmg · 84 MB' under it), the right part a caret that opens a menu of builds as menuitemradio rows (label, a recommended tag on the build matching the detected architecture, format and size). Under it the install command in mono with a $ prompt and a Copy button that turns green 'Copied'. A hairline, then 'Other platforms ▾' revealing hairline badges for the other systems and the stores. On iOS or Android the primary becomes the App Store or Google Play badge; unknown systems see every option.\n\nBadges: an inline 52px link (64px large) with an 11px radius, the platform mark at 27px on the left, and two lines: a small 10.5px top line ('Download for', 'Get it on') over an 18px semibold name. Marks are single-colour SVGs in currentColor (Apple, the four-square Windows mark, a penguin, the Android robot head, a shopping bag with four squares) except the Play triangle, which keeps its four colours. Hover lifts 1px, nudges the mark and slides a soft diagonal sheen across once; press moves down 1px.\n\nDetection: the user agent plus userAgentData (platform and high-entropy architecture), checking Android before Linux and treating a touch 'Macintosh' as an iPad. It runs after hydration; a detected prop forces it. The demo has a 'Preview as' row of chips to try each system.",
  interaction: "Badges are links. The caret opens the build menu (ArrowDown also opens it); ↑/↓, Home and End move, Enter picks, Escape or Tab closes and returns focus. Copy writes the command to the clipboard and announces it. 'Other platforms' is a disclosure.",
  animation: "Hover lift, mark nudge and a one-pass sheen; the menu and the platform list drop in over 0.15s. All removed with reduced motion.",
  a11y: "Real links and buttons; the caret has aria-haspopup, aria-expanded and a label naming the current build; menu rows are menuitemradio with aria-checked. Marks are aria-hidden because the visible text names the platform.",
  responsive: "Below 520px the split button spans the width and the build line may wrap.",
  touchFallback: "Every control is a tap target; nothing depends on hover.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --pdl-accent #2563eb; --pdl-bg #f7f7f5; --pdl-card #ffffff; --pdl-code #f1f1ee; --pdl-focus #2563eb; --pdl-ink #141414; --pdl-light #ffffff; --pdl-light-ink #141414; --pdl-line rgb(20 20 20 / 0.11); --pdl-muted #6c6c69; --pdl-ok #15803d; --pdl-solid #0b0b0c; --pdl-solid-edge #a6a6a6; --pdl-solid-ink #ffffff. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --pdl-accent #7aa2ff; --pdl-bg #101011; --pdl-card #17171a; --pdl-code #0c0c0d; --pdl-focus #7aa2ff; --pdl-ink #f2f2f0; --pdl-light #f4f4f2; --pdl-light-ink #0b0b0c; --pdl-line rgb(255 255 255 / 0.1); --pdl-muted #9b9b98; --pdl-ok #4ade80; --pdl-solid #000000; --pdl-solid-edge #5c5c5c; --pdl-solid-ink #ffffff. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#e9e9e6", mode: "fill", frame: [1100, 820] },
  isNew: true,
};
