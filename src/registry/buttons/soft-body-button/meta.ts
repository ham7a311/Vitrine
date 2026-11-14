import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "soft-body-button",
  name: "Soft-Body Button",
  category: "buttons",
  description: "A pill that behaves like something filled. Press it and it dents where you pressed and bulges on the other sides; let go and it springs back with a wobble that settles. Nothing moves at rest.",
  tags: ["button", "soft body", "spring", "squish", "jelly", "physics", "svg", "tactile"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["SoftBodyButton.tsx", "soft-body-button.css"],
  dependencies: [],
  prompt: `Build a pill button that behaves like a soft, filled body: it dents where it is pressed, bulges where it is not, and wobbles back when released. Nothing animates at rest or on hover.

Structure. A native button, 56px tall, 34px side padding, no background of its own. Behind the label, an SVG fills the button with overflow visible and holds one path: the pill's outline. The label is ordinary text above it.

The outline. With width w, height h, R = h/2 and k = 4R/3, and four numbers t, r, b, l giving how far the top, right, bottom and left sides are pushed out (negative means in): M R 0 · Q (w/2, −2t) (w−R, 0) · C (w−R+k+4r/3, 0) (w−R+k+4r/3, h) (w−R, h) · Q (w/2, h+2b) (R, h) · C (R−k−4l/3, h) (R−k−4l/3, 0) (R, 0) · Z. With all four at zero this is an ordinary pill.

Pressing. Take the press point as (u, v), each from −1 to 1 across the button. The give is min(16% of the height, 10px) × a softness option (0 to 2). The targets are: top = give × (0.2 + 0.75v), bottom = give × (0.2 − 0.75v), left = give × (0.2 + 0.75u), right = give × (0.2 − 0.75u). So a press near the top dents the top and pushes the bottom out; a press dead centre bulges every side a little. From the keyboard, Space or Enter presses at the centre.

Springs. Each of the four numbers is a spring stepped once per frame: velocity = (velocity + (target − value) × 0.2) × 0.8; value += velocity. That settles in about half a second with two visible wobbles. On release the targets return to zero. Run the loop only while something is moving, and rewrite the path's d attribute each frame.

Surface. The path is filled with a flat colour. A second copy of the path is stroked in white at 50%, 1.5px wide, and masked to the upper 46% so it reads as light from above. The SVG has a soft drop shadow in a darker tone of the fill (0 8px 10px), which follows the shape as it deforms. While pressed the label scales to 0.97.

States. Focus-visible: a 2px outline in the fill colour, 6px out. Disabled: 50% opacity, no response. Reduced motion: no springs; pressing shows half the deformation at once and release removes it. Forced colours: hide the SVG and give the button a border.`,
  interaction: "Press anywhere on the pill: it dents there and bulges elsewhere. Release and it wobbles back. Space or Enter presses the centre.",
  animation: "Four springs, one per side, settle in about half a second with two wobbles.",
  a11y: "A native button with real text and a visible focus ring. Reduced motion replaces the wobble with a static half-depth press.",
  responsive: "The body is measured from the button's own box, so it follows any label length or size override.",
  touchFallback: "Built for touch: the dent appears under the finger.",
  variants: [
    { id: "tangerine", label: "Tangerine", prompt: "Colours: fill #ff6a3d, label #2a0d02, shadow rgb(150 40 5 / 0.45), on a pale warm page (#fff3ea). Select it with the tone option set to \"tangerine\"." },
    { id: "mint", label: "Mint", prompt: "Colours: fill #4fe0ae, label #02261a, shadow rgb(10 110 75 / 0.45), on a near-black green page (#0d1512). Select it with the tone option set to \"mint\"." },
    { id: "ink", label: "Ink", prompt: "Colours: fill #1b1b1f, label #f4f4f6, shadow rgb(0 0 0 / 0.5), on a pale paper page (#efeee9); the focus ring uses the label colour. Select it with the tone option set to \"ink\"." },
  ],
  preview: { bg: "#fff3ea", mode: "center", height: 420 },
};
