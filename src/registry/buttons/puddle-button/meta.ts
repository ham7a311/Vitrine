import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "puddle-button",
  name: "Puddle Button",
  category: "buttons",
  description: "A glass capsule that behaves like a puddle: press it and a ring spreads from your fingertip, bending the scene behind the glass as it passes, then dies away.",
  tags: ["button", "glass", "liquid glass", "ripple", "refraction", "backdrop-filter", "svg filter"],
  traits: ["click", "cursor", "keyboard", "touch"],
  source: "original",
  files: ["PuddleButton.tsx", "puddle-button.css"],
  dependencies: [],
  prompt:
    "Build a liquid-glass pill (56px: faint white fill, backdrop blur and saturation, inner highlights, soft shadow) over a busy scene: blurred colour blobs with thin vertical white stripes (2px every 14px) so the bend is easy to see. On press, start a ripple at the exact press point.\n\nIn Chromium, the ripple refracts the backdrop for real: an SVG filter applied with backdrop-filter: url(#ripple) blur(3px) saturate(1.7), made of feImage \u2192 feDisplacementMap. Every animation frame for 900ms, regenerate the feImage as an SVG data URL at the button's size: a neutral grey background (no displacement) plus a group masked to a soft ring of radius r around the press point (radial gradient: clear inside, opaque at r, clear outside) that holds a horizontal red gradient and a vertical blue gradient, both centred on the press point and blended with difference. The ring therefore pushes pixels radially. Grow r with an ease-out to the farthest corner and decay the displacement scale from \u221234 to 0.\n\nEverywhere, also expand a thin bright ring of light (inset box-shadows on a circle) from the press point, scaling 0 \u2192 the farthest corner and fading over 900ms. Where SVG backdrop filters aren't supported, that ring is the whole effect. Enter and Space ripple from the centre.",
  interaction: "Press anywhere on the glass to send a ripple out from that point.",
  animation: "Ring radius eases out over 900ms; displacement decays with it; the light ring fades over the same time.",
  a11y: "A real button with its text as the label; the filter and ring are aria-hidden. Keyboard presses ripple from the centre. Reduced motion turns the ripple off.",
  responsive: "Intrinsic width; the displacement map is drawn at the measured size.",
  touchFallback: "Ripples from your finger on tap.",
  variants: [
    { id: "dusk", label: "Dusk", prompt: "Dusk scene: #140c1d behind blobs of coral #ff7a59, violet #8b5cf6 and gold #f5c26b." },
    { id: "lagoon", label: "Lagoon", prompt: "Lagoon scene: #06141c behind blobs of teal #14b8a6, blue #3b82f6 and lime #a3e635." },
  ],
  preview: { bg: "#140c1d", mode: "fill" },
};
