import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  "slug": "dissolve-button",
  "name": "Dissolve Button",
  "category": "buttons",
  "description": "Press it and it comes apart into hundreds of small squares that drift up and scatter, then gather again into the finished state.",
  "tags": [
    "button",
    "particles",
    "dissolve",
    "canvas",
    "async",
    "success",
    "submit",
    "disintegrate"
  ],
  "traits": [
    "click",
    "keyboard",
    "canvas"
  ],
  "source": "original",
  "files": [
    "DissolveButton.tsx",
    "dissolve-button.css"
  ],
  "dependencies": [],
  "prompt": "Build an async action button that dissolves while the work runs. On press, hide the pill and replace it with particles on a canvas overlay (60px margin all round): one 3.4px square per 4px cell inside the pill's rounded shape, in its colour. Each particle drifts up and outward with its own random velocity, slowed by drag and pulled slightly upward, starting staggered from left to right (up to 140ms) and fading over 900ms, so the button seems to blow away like dust. Meanwhile the action runs; once it resolves (and at least 650ms have passed) every particle returns to its own cell (lerp 0.16 per frame) in the success colour, and when all have landed the canvas clears and the pill reappears green with the done label rising in. After 1.8s it resets. aria-busy is set while it's apart, and a hidden status announces \"Working…\" then the result. Reduced motion skips the particles and just shows the result.",
  "interaction": "Press to start the action; the button dissolves while it runs and reforms when it's done.",
  "animation": "Scatter up to 900ms with a 140ms left-to-right stagger; reform lerp 0.16; label rise 360ms; reset after 1.8s.",
  "a11y": "A real button with aria-busy during the work and a role=\"status\" announcement of the result; the canvas is aria-hidden. Reduced motion shows the state change without particles.",
  "responsive": "Sized by its label; works at any width.",
  "touchFallback": "Taps work normally; pointer-only effects are skipped on touch.",
  "variants": [
    {
      "id": "night",
      "label": "Night"
    },
    {
      "id": "paper",
      "label": "Paper"
    }
  ],
  "preview": {
    "bg": "#0d0d0f",
    "mode": "center"
  },
};
