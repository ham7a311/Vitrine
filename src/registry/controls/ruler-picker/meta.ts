import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "ruler-picker",
  name: "Ruler Picker",
  category: "controls",
  description: "A number picked the way a tape measure is read: drag or flick the ruler under a fixed needle — it coasts, then settles exactly on a tenth — while ticks swell as they pass and the big readout rolls its digits. Switch kg ⇄ lb and the value converts while the ruler re-scales itself.",
  tags: ["picker", "ruler", "slider", "number input", "weight", "momentum", "units", "mobile"],
  traits: ["click", "keyboard", "touch", "canvas"],
  source: "original",
  files: ["RulerPicker.tsx", "ruler-picker.css"],
  dependencies: [],
  prompt: `Build a horizontal ruler number picker (weight in kg/lb) as a role="slider" (aria-valuenow, valuetext "72.4 kilograms").

Ruler: a canvas under a fixed accent needle (a dot on a bar, ringed in the card colour). Draw only the visible window: ticks every 0.1 unit at 96px per unit — 12px tall, 20px at halves, 30px at wholes with numbers — each scaled up to 1.55× and darkened by a Gaussian of its distance from the needle (σ 70px), so ticks swell as they pass it. The ends fade out (destination-out gradient). A soft green band with a bottom edge marks a healthy range (56.7–76.4 kg for 1.75m), also described in text under the ruler.

Motion (one rAF loop that sleeps when settled): dragging moves the value by −dx/ppu with pointer capture and tracks velocity; on release it coasts with friction (e^(−3.2t)) then eases onto the nearest 0.1 (rate 14/s). Wheel or trackpad scrolls it (horizontal or vertical delta) without scrolling the page. Keys: arrows ±0.1 (Shift ×10), Page ±5, Home/End.

Readout: 64px semibold tabular digits, each a clipped strip of 0–9 translated to its digit with a 420ms ease, so digits roll as the value changes; the unit beside it.

Units: a kg/lb segmented radiogroup. Switching converts the value (×2.20462) and sets pixels-per-unit to the old unit's spacing expressed in the new unit, then eases it to 96 — so the ruler visibly re-scales. Range 30–200 kg / 66–440 lb. Themes: paper and night. Reduced motion: no coasting, rolling or re-scale animation.`,
  interaction: "Drag or flick the ruler, scroll over it, or focus it and use the arrows (Shift for whole units), Page keys, Home and End. Switch kg/lb above.",
  animation: "Coast with friction then settle on a tenth; digits roll in 420ms; unit switch re-scales the ruler over ~0.4s.",
  a11y: "A slider with a spoken value and unit; the unit switch is a radiogroup; the healthy range is stated in text.",
  responsive: "The ruler fills the card's width (max 460px) and redraws on resize.",
  touchFallback: "Drag or flick with a finger; vertical page scrolling still works over it (touch-action: pan-y).",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#ebe5d9", mode: "fill" },
};
