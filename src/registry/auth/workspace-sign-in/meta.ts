import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "workspace-sign-in",
  "name": "Workspace Sign-in",
  "category": "auth",
  "description": "Type your company's workspace and the sign-in panel recognises it \u2014 its monogram flips in, the whole panel takes on that company's colour, and the right SSO button appears.",
  "tags": [
    "auth",
    "sso",
    "workspace",
    "saas",
    "enterprise",
    "sign-in"
  ],
  "traits": [
    "keyboard",
    "click"
  ],
  "source": "original",
  "files": [
    "WorkspaceSignIn.tsx",
    "workspace-sign-in.css"
  ],
  "dependencies": [],
  "prompt": "Build an enterprise SSO sign-in that becomes the customer's once it recognises them. A dark 20px-radius panel: mono 'Single sign-on' eyebrow, serif 'Find your workspace', and a field made of a monogram tile, a text input ('your-company', letters/digits/hyphens only) and a mono '.vitrine.app' suffix.\n\nTyping triggers a debounced lookup (450ms, a spinner replaces the suffix). When a workspace resolves, the whole panel takes on its colour: a registered @property --ws (<color>) transitions over 700ms, and everything references it \u2014 eyebrow, focus ring, hairline border mix, a radial glow from the top of the panel, the monogram tile (its letter flips in with a rotateY), the heading ('Sign in to *Northstar*' with the name tinted) and the full-width continue button ('Continue with Okta'). The status line gives members and identity provider. Unknown names show a rose 'No workspace with that name.' and a 'Create \u201c\u2026\u201d as a new workspace \u2192' link; the button stays disabled until a match.",
  "interaction": "Type a workspace name; recognised workspaces recolour the panel and enable their SSO button.",
  "animation": "Registered colour property transitions 700ms across every themed element; monogram flips 520ms; glow fades 600ms; lookup spinner.",
  "a11y": "Labelled input (16px text), polite status updates, a real disabled/enabled button naming the identity provider. Reduced motion makes the recolour instant.",
  "responsive": "Fluid to 25rem.",
  "preview": {
    "bg": "#0b080d",
    "mode": "fill"
  },
  "touchFallback": "Nothing hover-dependent; autocomplete=organization."
};
