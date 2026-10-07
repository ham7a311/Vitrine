import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "helix-showcase",
  name: "Helix Showcase",
  category: "media",
  description: "A portfolio as a spiral of curved project cards wound round an invisible column, over a dark field of glowing blue wave lines. Scrolling turns the spiral like a screw: cards rise out of the top while the next ones come up into view from below.",
  tags: ["portfolio", "gallery", "showcase", "webgl", "3d", "scroll", "helix", "cards", "agency"],
  traits: ["webgl", "scroll", "keyboard"],
  source: "original",
  files: ["HelixShowcase.tsx", "helix-showcase.css", "helix.ts", "mockups.ts"],
  dependencies: [],
  prompt:
    "Build a scroll-driven 3D portfolio (a fictional studio, 'Vela', sixteen projects) in one WebGL canvas inside a sticky full-height stage, in a section four viewports tall.\n\nBackground pass: near-black navy with a soft radial lift, eight glowing wave filaments (each a sum of two sines, drawn as a thin bright core, exp(-d²·5200), inside two soft halos), some running in pairs in electric blue (#2463ff) with pale cores where they are strongest, drifting slowly and shifting with scroll, plus fine grain.\n\nCards: each project is a card 2.05 × 1.32 units bent onto a cylinder of radius 2.6, built from a 28-segment strip so it is truly curved, with rounded corners cut in the fragment shader. Card i sits at angle i × 52° and height −i × 0.62. The whole helix is tilted (12° about x, −15° about z), shifted a little right and seen through a 38° perspective camera. Cards facing away show their backs, mirrored and darkened; front faces are lit by how squarely they face the camera; distant cards sink into fog and cards fade at the top and bottom of the frame. Draw back to front with alpha.\n\nScroll: progress through the section maps to lift; the helix moves as a screw (turn = −lift/pitch × step), so each card in turn comes to the front centre while the ones before it rise out of the top and the next come up from below. Lift follows the scroll through a critically damped spring. Every card image is a fictional website painted on a 2D canvas (nav, headline, text bars, buttons, a 'photograph' painted from gradients) and packed into a 2048² atlas.\n\nOverlay: a split nav with no bar behind it: the brand mark and name alone at the top left; the links in a centred glass pill (6px padding, 16px blur, a hairline edge), the current one in full ink with a 4px dot under it and the others at 62%, hover tinting a rounded chip; on the right a 44px round glass button with a sun or moon line icon that switches the theme (it turns -20° on hover), then a white 'Let's talk' pill whose arrow sits in a 34px dark circle and turns 45° on hover; a caption bottom left with '04 / 16', the project and its field; a 'Scroll' hint bottom right.",
  interaction: "Scroll to turn the helix. The stage is focusable: ↑/↓, ←/→, Page Up/Down, Home and End scroll the page to the position that brings the previous or next project to the front. The switch toggles the light and dark scene.",
  animation: "The helix eases after the scroll and the waves drift. With reduced motion the helix follows scroll directly with no spring and the waves hold still; rendering pauses off-screen.",
  a11y: "The front project is announced politely and shown as a caption; the full project list is in the page as an ordered list of links. Without WebGL the same painted cards appear as a responsive grid.",
  responsive: "Below 720px the camera pulls back and the helix centres; below 52rem the link pill hides and the nav keeps the brand, the mode button and the CTA.",
  touchFallback: "Touch scrolling drives it the same way.",
  variants: [
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --hlx-bg #010307; --hlx-edge rgb(255 255 255 / 0.12); --hlx-focus #8fb4ff; --hlx-glass rgb(12 14 20 / 0.62); --hlx-ink #ffffff; --hlx-pill #ffffff; --hlx-pill-ink #050607; --hlx-soft rgb(255 255 255 / 0.62). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --hlx-bg #f3f6fb; --hlx-edge rgb(10 13 20 / 0.1); --hlx-focus #2f5fe0; --hlx-glass rgb(255 255 255 / 0.7); --hlx-ink #0a0d14; --hlx-pill #0a0d14; --hlx-pill-ink #ffffff; --hlx-soft rgb(10 13 20 / 0.6). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#010307", mode: "scroll", frame: [1440, 780], height: 760 },
};
