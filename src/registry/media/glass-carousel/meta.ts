import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "glass-carousel",
  name: "Glass Carousel",
  category: "media",
  description: "An endless row of portrait panels seen through a liquid glass lens; click the centred one and the rest fall away.",
  tags: ["carousel", "slider", "gallery", "webgl", "glass", "lens", "portfolio", "projects"],
  traits: ["webgl", "click", "touch", "keyboard", "cursor"],
  source: "original",
  files: ["GlassCarousel.tsx", "glass-carousel.css", "../art-gallery/studies.ts"],
  dependencies: [],
  prompt: `Build an infinite horizontal carousel of 3:4 portrait panels in raw WebGL1 with two passes and no libraries.

Pass one draws the visible panels (an image atlas, one textured quad per panel, positioned in pixels around the centre) into a framebuffer texture. Pass two is a full-screen lens shader over that texture: an ellipse centred on the screen, sized to hug the centred panel (half-height ≈ half the panel, half-width ≈ 0.66 of the panel width). Inside it the picture is bent tangentially near the rim (sin(2θ)·0.55 + sin(θ)·0.25 times 0.32 of the radius, ramping in from 58% of the radius), split into colour with 16 dispersion samples weighted red→green→blue, slightly darkened at the very centre, given a faint white bloom, a thin shimmering blue ring at the edge (#009dff, sin(12θ + 3.5t) shimmer) with a soft aura, and a crisp white rim line; the lens fades out over the last 7% of its radius. A single lensFx factor scales every effect.

Motion: wheel, drag (1.6× on mouse) and flick with friction 0.865; the scroll chases its target with a 0.09 lerp, and 120ms after the last input it snaps to the nearest panel with a softer 0.05 lerp. Panels shrink up to 25% with scroll speed (fast attack, slow decay). Clicking a side panel centres it; clicking the centred one focuses it: it scales to 1.18, the lens fades away, and every other panel drops off the bottom, staggered by distance (60ms per step, quart-out). Escape or Close reverses it. On first view the panels rise from below in a random stagger, then grow from 80px tall to full height from the outside in while the lens blooms (expo in-out, 2.15s). A small "View" label (mix-blend exclusion) follows the cursor over panels, and the title above and a 01/08 counter below fade in after the intro. Panels default to generated canvas studies; pass your own images per item.`,
  interaction: "Scroll, drag or flick through the row; click a side panel to centre it, click the centred panel to focus it, and press Escape or Close to return. Arrow keys step when the carousel is focused.",
  animation: "Scroll lerp 0.09 / snap 0.05, friction 0.865; focus 0.9s with a 60ms drop stagger; intro rise 1s then grow 2.15s expo in-out; lens shimmer runs while visible and pauses offscreen.",
  a11y: "Focusable region with aria-roledescription=\"carousel\", instructions, arrow keys and Escape, and a polite live line that reads the current title and position. The canvas is aria-hidden; without WebGL it becomes a scroll-snapping list of images with titles. Reduced motion skips the intro, stops the shimmer and shortens every ease.",
  responsive: "Panel height is the smaller of 450px and 52% of the container, so it fits phones and short frames; the lens scales with the panel.",
  touchFallback: "Touch drags with a gentler follow and a larger tap slop; there's no View label on touch.",
  promptAllow: ["white"],
  variants: [
    { id: "white", label: "White", prompt: "theme=\"white\": a pure white ground (#ffffff) with near-black title, counter and labels (#111)." },
    { id: "night", label: "Night", prompt: "theme=\"night\": a near-black ground (#0b0b0c) with warm off-white title, counter and labels (#f2efe9); the lens ring reads brighter against the dark." },
  ],
  preview: { bg: "#ffffff", mode: "fill", height: 640 },
};
