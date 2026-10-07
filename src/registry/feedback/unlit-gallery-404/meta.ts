import type { ComponentMeta } from "../../types";
export const meta: ComponentMeta = {
  "slug": "unlit-gallery-404",
  "name": "Unlit Gallery 404",
  "category": "feedback",
  "description": "A room awaiting its missing exhibit: a quiet pool of light, an empty architectural plinth, and a door back into the collection.",
  "tags": [
    "feedback",
    "404",
    "recovery",
    "page"
  ],
  "traits": [
    "ambient",
    "cursor",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "UnlitGallery404.tsx",
    "unlit-gallery-404.css"
  ],
  "dependencies": [],
  "prompt": "Build an immersive 404 as a shallow, unlit exhibition room. A dark green architectural scene occupies the left, drawn with original hairline SVG geometry: a room corner, floor perspective, a solid plinth and a dashed outline where an object should stand. The scene is decorative. A very soft green spotlight drifts horizontally over sixteen seconds; fine mouse movement places its centre while hovering, pausing the drift. An exhibit label reads OBJECT NOT LOCATED. On the right, show a mono 404 status, a large Instrument Serif heading, restrained supporting copy and a clearly outlined home anchor followed by optional other destinations. Use CSS gradients and SVG, no WebGL or external artwork. Below 700px, compress the scene to a short illustration and stack the copy beneath it. Touch and reduced motion fix the pool of light and remove the button transition. Never obscure the recovery action with darkness.",
  "interaction": "In Vitrine and the usage example, activating a recovery link is simulated locally and never changes page. In a consumer application, caller-supplied anchors remain usable. Fine-pointer movement steers the room light; recovery links remain visible.",
  "animation": "16s alternating CSS light drift pauses on hover. Touch and reduced motion use fixed lighting.",
  "a11y": "Semantic headings and native links/buttons, visible focus, decorative geometry hidden from assistive technology. Independent instances; honour reduced motion.",
  "responsive": "Fluid layout and wrapping text at 320px through desktop. Page compositions stack intentionally on narrow screens; recovery links remain visible.",
  "touchFallback": "Normal taps activate all actions. Pointer-only decoration is optional and fixed on touch.",
  "preview": {
    "bg": "#151916",
    "mode": "page",
    "frame": [
      1280,
      800
    ]
  },
};
