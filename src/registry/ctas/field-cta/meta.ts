import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "field-cta",
  name: "Field CTA",
  category: "ctas",
  description: "A closing banner set on one of the living backgrounds — a blue horizon, crossing strands of light, fire plumes or a bank of pigment — and the background listens to the button: point at or focus the main action and the light gathers under it, the strands bow round it, the plumes part or the pigment swells beneath it.",
  tags: ["cta", "banner", "webgl", "shader", "background", "hero", "closing section", "interactive", "glow"],
  traits: ["webgl", "hover", "keyboard", "ambient"],
  source: "original",
  isNew: true,
  files: ["FieldCta.tsx", "field-cta.css", "fields.ts", "focus.ts", "gl.ts"],
  dependencies: [],
  prompt:
    "Build a closing call-to-action banner on a live WebGL background that reacts to its own button. Props: field (which background), eyebrow, title, lede, primary and secondary {label, href}, layout (centred, or text left with the buttons right), onNavigate, motion and className.\n\nThe banner is a section (28px corners, at least 520px tall) with a canvas filling it, run by a small harness: DPR capped at 2, paused offscreen and in hidden tabs, a still frame under reduced motion, a smoothed pointer (uMouse 0–1, uPress), context-lost handling, and a CSS gradient fallback per field. The harness takes a focus callback, read every frame: when it returns a point, the shader's pointer eases to that point with full press, overriding the real pointer; when it returns null, the field relaxes. The primary button sets the focus to its own centre (as a 0–1 point within the section) on pointerenter and focus, and clears it on leave and blur — so pointing at the button, or tabbing to it, makes the background answer the button rather than wherever the pointer is. Each field is one of the library's full-screen backgrounds, whose own pointer response is what the button now triggers.\n\nOver the field: a soft dark radial pool behind the words (centred, or towards the left for the split layout), an uppercase eyebrow, a large balanced title (up to 4.6rem, weight 600, −0.045em) with a faint shadow, a lede at 86% white, and two pill links: a solid white primary with dark text, a soft white glow and an arrow that nudges right on hover (lifting 2px), and a frosted secondary with a hairline. Below 720px the split layout stacks and the buttons fill the width.",
  interaction: "Point at or focus the main button and the background turns to it; leave and it relaxes. The pointer elsewhere over the banner still stirs the field.",
  animation: "The field runs continuously while on screen; its response to the button eases in and out over about a second. Buttons lift over 200ms. Reduced motion draws one still frame.",
  a11y: "A section labelled by its title; the buttons are real links with visible focus rings, and focusing the main one triggers the same response as pointing at it. The canvas is decorative and hidden; a dark pool and text shadows keep the white text readable on every frame.",
  responsive: "Fluid width; the split layout stacks below 720px and its buttons fill the row.",
  touchFallback: "The field drifts on its own; links work as usual.",
  variants: [
    { id: "horizon", label: "Horizon", prompt: "Blue horizon, centred: ink sky #02040f, band #0b2399, glow #2f5bff, floor #eef2ff; the shafts gather under the button." },
    { id: "strands", label: "Strands", prompt: "Strands of light, split layout: violet, blue, ice and cream strands on black; they bow round the button and flare where they cross near it." },
    { id: "plumes", label: "Plumes", prompt: "Fire plumes, centred: #0a0b06 ground with coral plumes (#4d1006, #d4461d, #ffb07a); they part round the button." },
    { id: "shore", label: "Shore", prompt: "Pigment shore, split layout: cyan through indigo into red (#2aa4e4, #3c2f8a, #f2333a) on #03060f; the bank swells up beneath the button." },
  ],
  preview: { bg: "#08080b", mode: "fill", frame: [1280, 760] },
};
