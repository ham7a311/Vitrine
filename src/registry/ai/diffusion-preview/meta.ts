import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "diffusion-preview",
  "name": "Diffusion Preview",
  "category": "ai",
  "description": "Image generation shown as it happens: four candidates start as coloured noise and resolve step by step, with the step count and seed alongside.",
  "tags": [
    "ai",
    "image generation",
    "diffusion",
    "canvas",
    "llm",
    "progress",
    "gallery",
    "creative"
  ],
  "traits": [
    "canvas",
    "click",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "DiffusionPreview.tsx",
    "diffusion-preview.css",
    "../../media/art-gallery/studies.ts"
  ],
  "dependencies": [],
  "prompt": "Build an image-generation card that shows denoising. A prompt row with a Generate again button; below, a large square canvas and a side column with four candidate thumbnails (a radiogroup), step/seed/sampler readouts and a thin progress bar. Each candidate has a target picture (here a generated canvas study per seed) and two noise textures from its seed — a 12×12 colour noise drawn up smoothly (the blotchy latent look) and a 96×96 noise drawn crisp (grain). Each step draws the target with a blur that shrinks from 22px to 0 and saturation rising, then the coarse noise fading out, then the fine grain fading out, with a = k^1.1 (coarse noise at up to 72%, grain at up to 36%) so shapes appear before detail. Thirty steps at 85ms; each candidate runs 1.5 steps behind the previous, so they resolve in a ripple. The large canvas mirrors the picked candidate; picking another after generation shows it large. Generate again bumps every seed and starts over; under reduced motion the finished images appear at once.",
  "interaction": "Watch the four candidates resolve; pick one to see it large; Generate again for new seeds.",
  "animation": "30 steps at 85ms; candidates staggered by 1.5 steps; blur 22px → 0 and noise fading on k^1.1.",
  "a11y": "Candidates are a labelled radiogroup (with seeds in their names); the step count is announced politely and the large canvas is role=\"img\" with the prompt. Reduced motion shows finished images.",
  "responsive": "A card up to about 40rem wide that fills narrower screens; dense rows and side columns stack on phones.",
  "touchFallback": "Everything is tap-driven; hover hints have tap or focus equivalents.",
  "variants": [
    {
      "id": "paper",
      "label": "Paper"
    },
    {
      "id": "night",
      "label": "Night"
    }
  ],
  "preview": {
    "bg": "#efede8",
    "mode": "fill",
    "height": 620
  },
};
