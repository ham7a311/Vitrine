import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "liquid-glass-sign-in",
  name: "Liquid Glass Sign-in",
  category: "auth",
  description: "A sign-in panel of thick glass over slow colour: its rim bends what's behind it and catches the light nearest your pointer, a glass drop springs between Password and Magic link, and a successful sign-in squashes the panel like a landing drop.",
  tags: ["auth", "sign in", "glass", "liquid glass", "refraction", "magic link", "password"],
  traits: ["cursor", "click", "keyboard", "ambient"],
  source: "original",
  files: ["LiquidGlassSignIn.tsx", "liquid-glass-sign-in.css"],
  dependencies: [],
  prompt: `Build a full-bleed sign-in over a slow aurora (four blurred colour blobs drifting on unrelated 17–27s loops) with a fine line-and-dot pattern on top so refraction is visible.

The panel (24rem, 30px radius) is glass: a faint white gradient over a smoky tint, backdrop blur and saturation, and layered inset highlights. In Chromium, measure the panel with a ResizeObserver and add an SVG filter used through backdrop-filter: url(#lens): an feImage displacement map (a data-URL SVG that is neutral grey in the middle and ramps to full red/blue offsets in a 20px rim) into feDisplacementMap at scale −56, so only the edge bends the background. Elsewhere it stays frosted glass. A 1.25px rim highlight (radial gradient masked to the border with mask-composite exclude) follows the pointer via --mx/--my.

A Password / Magic link radiogroup sits on a recessed track; the selection is a drop of glass that moves on a spring (k 480, c 28) and stretches with speed (scale up to 1.22 × 0.88). Arrow keys switch. The password row opens and closes with a grid-template-rows 0fr → 1fr transition. The submit label ('Sign in' ↔ 'Email me a link' ↔ 'Signing in…') re-mounts as letters that roll up one after another (22ms apart).

Validate email, then a minimum password length, with plain-language role=alert errors. Success plays a squash on the panel (scale 1.06 × 0.9 → 0.97 × 1.04 → settle, from the bottom) and swaps in 'Check your inbox' or 'Welcome back' with a glass badge whose icon draws in.`,
  interaction: "Move over the panel to slide the rim light; switch Password / Magic link; submit to see the squash and the next step.",
  animation: "Aurora drifts 17–27s; mode drop on a spring; password row 480ms; label letters roll 460ms, 22ms apart; squash 760ms.",
  a11y: "Real labels and autocomplete (email, current-password); the hidden password field is disabled and out of the tab order in link mode. The mode switch is a radiogroup with arrow keys. Errors use role=alert and aria-invalid; the result is role=status. White text keeps contrast through a smoky tint and text shadow. Reduced motion stops the aurora and makes every change instant.",
  responsive: "The panel is up to 24rem and tightens under 420px; the background fills its container.",
  touchFallback: "The rim light rests at the top-left; refraction and the spring work the same.",
  variants: [
    { id: "dusk", label: "Dusk", prompt: "variant=\"dusk\": aurora blobs of coral #ff7a59, violet #8b5cf6, gold #f5c26b and pink #e0457b over #120b1c." },
    { id: "lagoon", label: "Lagoon", prompt: "variant=\"lagoon\": aurora blobs of teal #14b8a6, blue #3b82f6, lime #a3e635 and cyan #22d3ee over #06141c." },
  ],
  preview: { bg: "#120b1c", mode: "fill" },
};
