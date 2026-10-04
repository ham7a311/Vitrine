import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "glass-tab-bar",
  "name": "Glass Tab Bar",
  "category": "navigation",
  "description": "A floating tab bar made of glass: the selection is a clear droplet that slides between tabs, stretching as it travels and magnifying the icon it settles on, while the page scrolls blurred beneath.",
  "tags": [
    "navigation",
    "tab-bar",
    "liquid-glass",
    "mobile",
    "ios",
    "backdrop-filter"
  ],
  "traits": [
    "click",
    "keyboard",
    "touch"
  ],
  "source": "original",
  "files": [
    "GlassTabBar.tsx",
    "glass-tab-bar.css"
  ],
  "dependencies": [],
  "prompt": "Design a floating, iOS-style tab bar in liquid glass, over content that scrolls beneath it. The bar is a pill of frosted glass (42% white, backdrop blur 18px with saturate 1.9, a bright 1px top edge, a softer lower edge, a white hairline and a soft shadow); a separate round glass search button sits beside it.\n\nThe selection is a second, clearer piece of glass inside the bar \u2014 a 'droplet' pill with a white top-to-translucent gradient, a crisp inner highlight and a small shadow. It moves by animating left and right independently: the leading edge first and the trailing edge 90ms later (swapped by direction), both 520ms on cubic-bezier(0.16,1,0.3,1), so it stretches like water between tabs before settling. The icon under the droplet springs to 1.16\u00d7 (overshoot) and takes the tint colour with a light fill, as if seen through a lens. Tabs are icon-over-label, 11px labels. \u2190/\u2192 move between tabs (roving tabindex).",
  "interaction": "Tap or click a tab; \u2190/\u2192 move the selection.",
  "animation": "Droplet edges 520ms expo-out with a 90ms directional lag; icon magnify 520ms spring.",
  "a11y": "role=tablist with role=tab buttons, aria-selected and roving tabindex; the droplet is decorative. Reduced motion makes the droplet jump.",
  "responsive": "Intrinsic width; designed to float over mobile layouts, works on desktop too.",
  "preview": {
    "bg": "#f5f5f7",
    "mode": "fill"
  },
  "touchFallback": "Built for thumbs: 48px targets and no hover dependence."
};
