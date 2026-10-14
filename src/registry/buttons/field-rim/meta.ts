import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "field-rim",
  name: "Field Rim",
  category: "buttons",
  description: "A dark pill whose rim is a window onto a living background from the backgrounds library — light strands, fire plumes, neon veins or a blade of light — running slowly round its edge. Point at it and the rim widens, the field quickens and its light spills out round the button.",
  tags: ["button", "webgl", "shader", "border", "rim", "glow", "background", "hover", "dark", "premium"],
  traits: ["webgl", "hover", "cursor", "keyboard"],
  source: "original",
  isNew: true,
  files: ["FieldRim.tsx", "field-rim.css", "fields.ts", "gl.ts"],
  dependencies: [],
  prompt:
    "Build a dark pill button whose border is a live WebGL background. Props: children, field (which shader), zoom (1.6), onClick, type and motion.\n\nThe shader runs on a canvas filling the whole button, through a small harness: DPR capped at 2, paused offscreen and in hidden tabs, one still frame under reduced motion, a smoothed pointer, context-lost handling, a zoom (the shader sees a canvas that many times bigger and reads its fragment coordinate through a macro FC = gl_FragCoord.xy × uZoom, so the button shows a slice of the field) and a rate multiplier on time read every frame, eased towards 0.7 at rest and 2.6 while hovered or focused.\n\nA dark face (#0b0b10, with a faint glow of the field's colour rising from the bottom and an inner glow at its edge) covers the canvas inset by the rim width, so the field only shows as the rim. The rim is a registered CSS length property, 2.5px at rest, transitioning to 5px on hover and focus over 380ms. The canvas is brightened (2×), with a faint white hairline round the outside so the shape always reads, and saturated so the thin rim reads. Hover also lifts the pill 1px and adds an outer glow in the field's colour; press dips it. The label is near-white on the dark face. Without WebGL, the rim becomes a conic gradient in the field's colour.\n\nEach field is one of the library's full-screen backgrounds with its first palette, still reacting to the pointer.",
  interaction: "Point at the button or focus it: the rim widens, the field speeds up and glows out round it.",
  animation: "The field drifts at 0.7× and eases up to 2.6× on hover; the rim widens from 2.5px to 5px over 380ms. Reduced motion draws one still frame.",
  a11y: "A real button with its text label on a solid dark face, so contrast never depends on the field; the canvas is decorative and hidden. One WebGL context per button, paused offscreen.",
  responsive: "At least 208px wide and 56px tall; the rim follows whatever size the label needs.",
  touchFallback: "The field drifts on its own; tapping works as usual.",
  variants: [
    { id: "strands", label: "Strands", prompt: "Glow Strands: violet, blue and pale gold threads of light on black, glowing blue (#5aa8ff)." },
    { id: "plumes", label: "Plumes", prompt: "Ember Plumes: orange fire plumes on near-black, glowing orange (#ff7a45)." },
    { id: "veins", label: "Veins", prompt: "Neon Veins: violet lightning veins and pale stars on near-black, glowing violet (#8a5cff)." },
    { id: "sash", label: "Sash", prompt: "Light Sash: a teal blade of light with a pale haze on dark green, glowing mint (#6fe0c8)." },
  ],
  preview: { bg: "#06060b", mode: "center", height: 260 },
};
