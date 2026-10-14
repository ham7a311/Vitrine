import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "field-button",
  name: "Field Button",
  category: "buttons",
  description: "A pill with a living background inside it — storm smoke, neon veins, strands of light, velvet grain, a blade of light or fire plumes, taken from the backgrounds library — drifting slowly at rest. Point at it and the field wakes: it quickens, brightens and turns towards your pointer, under a thin rim of glass and a soft glow in its own colour.",
  tags: ["button", "webgl", "shader", "background", "hover", "glow", "smoke", "neon", "gradient", "premium"],
  traits: ["webgl", "hover", "cursor", "keyboard"],
  source: "original",
  isNew: true,
  files: ["FieldButton.tsx", "field-button.css", "fields.ts", "gl.ts"],
  dependencies: [],
  prompt:
    "Build a pill button whose fill is a live WebGL background. Props: children, field (which shader), zoom (3.2), onClick, type and motion.\n\nThe shader runs on a canvas filling the button, through a small harness: DPR capped at 2, paused offscreen and in hidden tabs, one still frame under reduced motion, a smoothed pointer (uMouse, uPress), context-lost handling and a CSS gradient fallback. Two additions make a full-screen background work inside a 56px pill: a zoom, so the shader sees a canvas that many times bigger (uRes is multiplied, and the shader reads its fragment coordinate through a macro FC = gl_FragCoord.xy × uZoom), which makes the pill a slice of the field rather than one giant blob; and a rate, a multiplier on the speed of time read every frame, eased towards 0.6 at rest and 3 while the button is hovered or focused, so the field drifts quietly and wakes up smoothly.\n\nEach field is one of the library's full-screen backgrounds with its first palette, and reacts to the pointer just as it does at full size.\n\nOver the canvas: a soft radial dark bed under the label (42% at the centre fading out), a top sheen, a hairline glass rim and a top highlight; the label is white with a small shadow, so it reads on any frame. Hover lifts the pill 1px, brightens and saturates the field over 420ms, and adds a glow in the field's colour; press dips it. The focus ring is a 2px white outline 4px out.",
  interaction: "Point at the button or focus it and the field wakes and turns towards the pointer; press it as usual.",
  animation: "The field drifts at 0.6× and eases up to 3× on hover; brightness and glow ease over 420ms. Reduced motion draws one still frame.",
  a11y: "A real button with its text label; the canvas is decorative and hidden. A dark bed and text shadow keep the white label readable on every frame. One WebGL context per button, paused offscreen.",
  responsive: "At least 200px wide and 56px tall; the field fills whatever size the label needs.",
  touchFallback: "The field drifts on its own; tapping works as usual.",
  variants: [
    { id: "smoke", label: "Smoke", prompt: "Storm smoke: navy #323e62 smoke with #a3b4dd light on #010209, cover 0.29." },
    { id: "veins", label: "Veins", prompt: "Neon veins: #5b1ef2 veins with #9e70ff cores and #e8e6f2 stars on #040308." },
    { id: "strands", label: "Strands", prompt: "Strands of light: violet, blue, ice and cream strands (#3a137a, #7a2ef5, #2b8df2, #a6e4ff, #f4e2b0, #4f35c8) on black." },
    { id: "velvet", label: "Velvet", prompt: "Velvet grain: an #7a1515 whorl on #070405 with grain 0.14." },
    { id: "sash", label: "Sash", prompt: "A blade of light: #031a17 ground, #2a877e body, #9ee6d6 edge, #eefcf7 haze." },
    { id: "plumes", label: "Plumes", prompt: "Fire plumes: #0a0b06 ground, #4d1006 deep, #d4461d flame, #ffb07a crest, #30320f olive light." },
  ],
  preview: { bg: "#0b0d14", mode: "center", height: 320 },
};
