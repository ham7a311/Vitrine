import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "resonance-card",
  name: "Resonance Card",
  category: "cards",
  description: "A card for a sound where the picture is the sound: sand on a plate tuned to the card's own frequency, so every value draws its own figure. Point at it to strike the plate; while it plays the sand keeps dancing on its lines.",
  tags: ["card", "music", "audio", "track", "particles", "sand", "chladni", "generative", "canvas"],
  traits: ["canvas", "hover", "click", "keyboard", "touch"],
  source: "original",
  isNew: true,
  files: ["ResonanceCard.tsx", "resonance-card.css", "../../backgrounds/chladni-plate/chladni.ts"],
  dependencies: [],
  prompt: `Build a media card for a track, tone or preset whose artwork is a Chladni figure computed from the card's own number.

Layout. A card up to 336px wide with 10px padding, a 22px radius and a 1px inset hairline. On top, a square plate with a 14px radius holding a canvas. Below, a row: on the left the value in 11px mono capitals ("432 Hz", with " · playing" appended while it plays), the title in a 26px serif and a 13px muted subtitle; on the right a 44px round play button with a hairline ring that fills with the grain colour when playing and swaps its triangle for a pause mark.

The figure. Map the value to a pair of real numbers: n = 1.5 + (value × 0.0131 mod 3.5), m = n + 1 + (value × 0.0077 mod 3). The plate's standing wave is a(u, v) = cos(nπu)·cos(mπv) − cos(mπu)·cos(nπv) over the square, u and v from 0 to 1. Two different values therefore never share a figure, and the same value always draws the same one.

The sand. About 24 grains per 1,000 square pixels (1,200 to 5,200). Each frame a grain samples the wave under it and one pixel right and down, takes 10% of Newton's step to the nearest still line (capped at 5px) and is thrown a short random distance that grows with how hard the plate moves there (2.2px) plus 1px, looser where the slope is shallow. Grains are squares about one device pixel wide at 88% opacity, every eighth 1.5× larger.

States. First scrolled into view: the sand starts scattered and settles into the figure. At rest: asleep, nothing animates. Pointer enters the card, or the play button takes keyboard focus: the plate is struck — every grain jumps away from the centre with force 4.2 falling off with the square of distance — and the figure re-forms; the simulation runs 2.8s and stops. Playing: it keeps running, with more shake (3.4px and 1.7px) and n wavering by ±1.2% on a 5.6s cycle, so the lines breathe and the sand keeps moving on them. Stopping lets it come to rest.

Production behaviour: the play button is a real button with aria-pressed and a label naming the track; playing can be controlled from outside so only one card plays at a time. Pause when off screen or in a hidden tab. Under reduced motion draw the settled figure once from a seed fixed by the value and never animate; the playing state is still shown by the button and the text.`,
  interaction: "Point at a card to strike its plate. Press play and the sand keeps dancing; press again and it settles. Tab reaches each play button.",
  animation: "Sand settles in about 2.8s after a strike. While playing, the note wavers ±1.2% over 5.6s and the grains keep moving.",
  a11y: "An article labelled by its title; the play button has aria-pressed and names the track, and \"playing\" is announced politely. The canvas is decorative. Reduced motion shows a still figure.",
  responsive: "Fluid up to 336px wide; the plate stays square and the grain count follows its size. Cards stack in one column on phones.",
  touchFallback: "Nothing depends on hover: pressing play strikes the plate.",
  variants: [
    { id: "gold", label: "Gold", prompt: "Palette [#13110c card, #0c0b08 plate, #efe4c4 grain, #f5ecd2 text, #a39a82 muted, rgb(239 228 196 / 0.12) hairline]: pale gold sand on warm black. Select it with the theme option set to \"gold\"." },
    { id: "ash", label: "Ash", prompt: "Palette [#f1ede3 card, #e6e0d2 plate, #2b2723 grain, #1d1a17 text, #6b655c muted, rgb(43 39 35 / 0.14) hairline]: dark ash on unbleached paper. Select it with the theme option set to \"ash\"." },
  ],
  preview: { bg: "#0a0907", mode: "center", height: 620 },
};
