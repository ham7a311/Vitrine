import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "marble-invite",
  name: "Marble Invite",
  category: "cards",
  description: "A tall invitation card on slowly folding liquid marble: a tracked-caps eyebrow, a big two-line title, the date and place, and a send button that folds into a paper plane and flies off. The card tilts towards your pointer and the marble leans away from it.",
  tags: ["invitation", "event", "card", "marble", "liquid", "rsvp", "webgl", "share"],
  traits: ["webgl", "hover", "click", "keyboard", "touch", "ambient"],
  source: "original",
  isNew: true,
  files: ["MarbleInvite.tsx", "marble-invite.css", "tilt.ts", "gl.ts"],
  dependencies: [],
  prompt:
    "Build an invitation card on a liquid-marble background. Props: eyebrow, title (a line break splits it into two lines), date, detail, palette {deep, mid, light}, onSend (a promise) and motion.\n\nThe card is 420px wide at most, 4:5, 30px corners, a faint white inner hairline and a long soft shadow tinted with the deep colour. Inside: the eyebrow in small caps tracked 0.26em at 78% white at the top; the title in white, weight 700, about a fifth of the card's width (6rem at most), line height 0.95 and −0.045em tracking, sitting just above the middle; the date (1.15rem, 600) and detail (82% white) at the bottom-left; and a 46px round frosted send button with a paper-plane icon at the bottom-right.\n\nThe background is one WebGL canvas: a double domain warp of four-octave value-noise fBm drifting slowly, mapped from the deep colour through the mid colour to the light colour in the brightest folds, with thin dark veins where the second warp field crosses its middle, and darkened towards the foot so the date reads. The pointer pushes the marble a little away from it (eased slowly), and the card tilts towards the pointer by up to 6° in a 1200px perspective.\n\nPressing send folds the plane up and out of the button (up and to the right, shrinking and fading over 600ms) while onSend runs; on success the button turns white with a tick in the deep colour and a status line says 'Sent.'; on failure it says it couldn't send and the button resets. Pause the canvas offscreen and in hidden tabs, keep a still frame and no tilt under reduced motion, and fall back to a CSS radial gradient without WebGL.",
  interaction: "Move the pointer over the card to tilt it and push the marble; press the send button to send the invitation.",
  animation: "The marble folds continuously; tilt follows the pointer and eases back over 500ms; the plane flies out over 600ms and the tick pops in. Reduced motion: a still marble, no tilt, instant states.",
  a11y: "A titled article; the send button is labelled 'Send invitation' (then 'Invitation sent') and results are announced in a status line. White text sits on a darkened foot with a soft shadow on the title.",
  responsive: "The card scales with its container up to 420px, keeping 4:5; the title scales with the card's width.",
  touchFallback: "No tilt on touch; tap the send button.",
  variants: [
    { id: "cobalt", label: "Cobalt", prompt: "Palette { deep #071a4a, mid #2a63e0, light #a9c6ff }: a deep blue marble." },
    { id: "ember", label: "Ember", prompt: "Palette { deep #3a0b05, mid #d2491d, light #ffc29a }: a burnt orange marble." },
    { id: "jade", label: "Jade", prompt: "Palette { deep #032b22, mid #118a63, light #9be6c6 }: a green stone marble." },
  ],
  preview: { bg: "#000000", mode: "fill", height: 720 },
};
