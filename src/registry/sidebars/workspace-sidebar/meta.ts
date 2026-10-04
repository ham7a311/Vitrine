import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "workspace-sidebar",
  "name": "Workspace Sidebar",
  "category": "sidebars",
  "description": "A SaaS app sidebar where one active indicator travels through the tree \u2014 down the list, into a sub-section and back out \u2014 so you can see where you moved from, not just where you are.",
  "tags": [
    "sidebar",
    "navigation",
    "saas",
    "tree",
    "app-shell",
    "workspace"
  ],
  "traits": [
    "click",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "WorkspaceSidebar.tsx",
    "workspace-sidebar.css"
  ],
  "dependencies": [],
  "prompt": "Build a dark SaaS app sidebar (Linear-like density: 32px rows, 13px Geist). A workspace switcher sits on top; below, a nav with Inbox / My issues / Reviews (with mono counts), an expandable 'Projects' section with nested items on a thin thread, and a Favourites group with coloured squares; the account and a \u2318, hint sit at the bottom.\n\nOne indicator \u2014 a soft 6% white pill with a 2px accent tick on its left \u2014 marks the active row. It is absolutely positioned from the active row's measured rect (top, height and left inset relative to the nav), and those three values transition over 420ms expo-out. So clicking from a top-level item into a nested project moves the indicator down and steps it inward; moving back out steps it outward again \u2014 you see where you came from. Sections open with grid-template-rows 0fr \u2192 1fr and the chevron rotates; the indicator re-measures after the section settles.",
  "interaction": "Click any row; expand or collapse Projects; the indicator travels between rows at any depth.",
  "animation": "Indicator top/height/left 420ms expo-out; section fold 420ms; chevron 320ms.",
  "a11y": "An <aside> with a nav of real buttons; the active row has aria-current; the section header has aria-expanded. Reduced motion makes the indicator jump.",
  "responsive": "15.5rem wide, full width on phones (under 480px); the nav scrolls inside.",
  "preview": {
    "bg": "#09090b",
    "mode": "fill"
  },
  "touchFallback": "Rows are full-width tap targets."
};
