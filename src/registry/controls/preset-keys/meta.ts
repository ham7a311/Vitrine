import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "preset-keys",
  name: "Preset Keys",
  category: "controls",
  description: "The station buttons on an old radio, as a radio group: press one and it latches down with a solid clack, the one that was down springs back up, and the needle sweeps across the lit dial to the station — the glow dimming while it travels and coming up warm once it's tuned.",
  tags: ["radio group", "segmented", "skeuomorphic", "retro", "radio", "buttons", "toggle", "hardware"],
  traits: ["click", "keyboard", "touch"],
  source: "original",
  files: ["PresetKeys.tsx", "preset-keys.css"],
  dependencies: [],
  prompt: `Build a radiogroup styled as a vintage radio's latching preset keys.

Cabinet: a themed frame with a speaker grille (dot pattern), a dial behind glass, a lit display window and a well of keys.

Dial: an FM scale 88–108 with half-MHz ticks, major ticks and numbers every 2MHz, small station marks with names, and a red needle positioned by the selected frequency; the needle slides with a 760ms ease that overshoots slightly (cubic-bezier(.45,0,.2,1.18)). A warm radial glow lights the scale from below; while the needle travels it dims to 35% (fast) and comes back (500ms) once tuned. Glass reflection over the top. The window shows the station name (or "· · ·" while tuning, aria-live polite) and the frequency in glowing mono digits.

Keys: real buttons, role="radio" with aria-checked, roving tabindex, arrows/Home/End select and focus. Each cap has a front face, a 10px depth edge and a cast shadow; the checked key is latched down (translateY 8px, depth and shadow collapse, slightly darker, number turns red) and pressing goes down fast (90ms ease-in); a key released by another springs back up with overshoot (340ms cubic-bezier(.3,1.7,.5,1)). Reduced motion: no transitions.`,
  interaction: "Click a key, or Tab to the group and use the arrow keys.",
  animation: "Latch 90ms down, 340ms spring up; needle 760ms with a slight overshoot; glow dims while tuning.",
  a11y: "A labelled radiogroup with radio buttons, roving focus and arrow keys; station changes are announced politely in the display window.",
  responsive: "The cabinet is at most 560px wide and the keys share the width evenly down to phone sizes.",
  touchFallback: "Tap a key; the pressed state shows under the finger.",
  variants: [
    { id: "walnut", label: "Walnut", prompt: "theme=\"walnut\": a walnut frame (layered fine stripes over a warm gradient), ivory key caps and an amber display window, on #e6dccb; five Muscat stations, Hala FM 102.7 selected." },
    { id: "hifi", label: "Hi-fi", prompt: "theme=\"hifi\": a brushed-steel frame, black key caps and a blue display window, on #0d0e10; the same five stations." },
  ],
  preview: { bg: "#e6dccb", mode: "fill" },
};
