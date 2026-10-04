import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "conversation-sidebar",
  "name": "Conversation Sidebar",
  "category": "sidebars",
  "description": "A chat history sidebar grouped by when, not what \u2014 it collapses into a narrow rail where each conversation becomes its initials, and titles can be renamed in place.",
  "tags": [
    "sidebar",
    "ai",
    "chat",
    "history",
    "collapsible",
    "search"
  ],
  "traits": [
    "click",
    "keyboard",
    "hover",
    "touch"
  ],
  "source": "original",
  "files": [
    "ConversationSidebar.tsx",
    "conversation-sidebar.css"
  ],
  "dependencies": [],
  "prompt": "Build a chat-history sidebar (warm paper or night). Top: a panel toggle and 'New chat'; a search field; then conversations grouped by recency \u2014 Pinned, Today, Yesterday, Previous 7 days, Older \u2014 with small mono group labels; the account sits at the bottom.\n\nCollapsing animates the width from 16.5rem to a 3.75rem rail (460ms expo-out). Titles don't simply disappear: every row also carries a two-letter initials chip that is zero-width when open and becomes the row's content when collapsed, so the list keeps its rhythm and position; the current chat's chip inverts (ink fill). Group labels, search, 'New chat' and the account text fade out as it collapses and fade in 120\u2013160ms after it opens, so nothing squashes mid-animation. Rows show a pencil on hover; double-click or the pencil turns the title into an inline input (Enter saves, Escape cancels, blur saves). Search filters live with an empty state.",
  "interaction": "Toggle collapse with the panel button; click a chat to open it; double-click or use the pencil to rename; type to search.",
  "animation": "Width 460ms expo-out; labels fade with 120\u2013160ms delays; initials chips grow/shrink in step with the width.",
  "a11y": "An <aside> with a nav; the toggle has aria-expanded; the current chat has aria-current; rename is a labelled input; collapsed rows expose the full title via title/tooltip. Reduced motion makes it instant.",
  "responsive": "Fills its container height; the list scrolls independently. On phones (under 480px) the open sidebar is full width and collapses back to the rail.",
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
  "touchFallback": "Rename via the pencil (no double-click needed); rows are 36px tall."
};
