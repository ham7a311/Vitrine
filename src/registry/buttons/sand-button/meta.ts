import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "sand-button",
  name: "Sand Button",
  category: "buttons",
  description: "A button drawn in sand on a vibrating plate: the grains settle on its outline and on a figure across its face, keeping clear of the label. Point at it and the figure re-forms; press, and the sand jumps from your finger and finds its lines again.",
  tags: ["button", "particles", "sand", "chladni", "resonance", "canvas", "physics", "press"],
  traits: ["canvas", "hover", "click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["SandButton.tsx", "sand-button.css", "../../backgrounds/chladni-plate/chladni.ts"],
  dependencies: [],
  prompt: `Build a button whose outline and face are drawn by simulated sand on a vibrating plate (a Chladni figure), on a Canvas 2D layer behind an ordinary label.

Geometry. A real <button>, 56px tall with 36px side padding and a 16px radius (a large size is 68px tall, 20px radius), flat ground colour, 15px/600 label. Behind the label sits a canvas 12px larger than the button on every side, so grains can spill slightly past the edge. Before the sand settles, and as the fallback, the button has a 1px inset hairline.

The field the sand settles on. Let d be the signed distance to the button's rounded rectangle divided by 14 (negative inside). Outside the button the field is d. Inside it is d × (a·clear + 1.3·(1 − clear)), where a = cos(nπu)·cos(mπv) − cos(mπu)·cos(nπv) is the plate's standing wave with one plate side equal to 1.7 × the button's height, centred, and clear falls from 1 to 0 over 9px as it enters the label's box (the measured label plus 8px by 5px, corners rounded 10px). The zero lines are therefore the outline plus the figure, with nothing drawn through the words.

The sand. About 6 grains per pixel of (width + height), between 1,100 and 4,200. Each frame a grain samples the field under it and one pixel right and down, takes 10% of Newton's step to the nearest zero line (capped at 5px), and is thrown a short random distance that grows with how hard the plate moves there (up to 1.5px at rest and 2.6px while the note glides) plus 0.42px, looser where the slope is shallow. Draw each grain as a square 0.8 device pixels wide (at least 1px) at 90% opacity, every seventh one 1.45× larger.

States. At rest the simulation is asleep: nothing animates. Hover or keyboard focus bows the plate: n and m glide to the next of four notes over 0.9s with smoothstep easing and the figure re-forms. Press thumps it: grains within about 1.1 × the button height of the press point jump away with force 5.5 falling off with the square of distance, then walk back; a keyboard press thumps the centre. The simulation runs for 2.4s after the last of these and stops. The label sinks 1px on press. Disabled: the sand lies scattered evenly inside the button at 35% opacity and never moves, and the label is at 45%.

Production behaviour: re-measure on resize; stop when the tab is hidden; under reduced motion settle the first figure once with a fixed seed and never animate. Focus ring 2px in the grain colour, 7px outside the edge so it clears the spilled sand.`,
  interaction: "Point at the button to re-tune its figure; press to scatter the sand from where you pressed. Enter and Space press it from the keyboard.",
  animation: "Re-tuning glides for 0.9s; the sand rings for 2.4s after the last touch, then sleeps. Nothing moves at rest.",
  a11y: "A native button with a visible focus ring; the canvas is decorative and hidden. Disabled shows unsettled sand and a dimmed label. Reduced motion draws one settled figure and never animates.",
  responsive: "Sized by its label; the grain count follows the button's size. The press target is the full 56px height.",
  touchFallback: "Nothing depends on hover: a tap thumps the plate and the sand re-forms.",
  variants: [
    { id: "gold", label: "Gold", prompt: "Palette [#0c0b08 ground, #efe4c4 grain, #f5ecd2 label, rgb(239 228 196 / 0.16) hairline]: pale gold sand on a warm black plate. Select it with the theme option set to \"gold\"." },
    { id: "ash", label: "Ash", prompt: "Palette [#e9e4d8 ground, #2b2723 grain, #1d1a17 label, rgb(43 39 35 / 0.18) hairline]: dark ash on unbleached paper. Select it with the theme option set to \"ash\"." },
  ],
  preview: { bg: "#0c0b08", mode: "center" },
};
