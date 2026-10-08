import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "globe-search",
  name: "Globe Search",
  category: "ai",
  description: "\"Searching the web\" drawn as a small wireframe globe that turns while the assistant looks things up. Each result lands as a ping at the place it came from; when the search ends the globe slows and settles facing the last result, the count stops, and the results open underneath.",
  tags: ["ai", "web search", "searching", "globe", "loading", "status", "assistant", "sources", "results", "chat"],
  traits: ["click", "keyboard", "ambient"],
  source: "original",
  isNew: true,
  files: ["GlobeSearch.tsx", "globe-search.css", "globe.ts"],
  dependencies: [],
  prompt:
    "Build the 'searching the web' state of an AI assistant around a small globe. Props: query, results ({ title, site, place: { lat, lon } }), found (how many have arrived), state (searching | done), size (globe px, default 22) and theme. A `Globe` export works on its own (size, spinning, pings, settle).\n\nThe globe: an SVG on a 100×100 board, a sphere of radius 46 with a radial sea gradient (lighter at 38%/32%), a hairline rim, and a graticule of meridians and parallels every 30° (every 45° below 32px) drawn by real orthographic projection: x = cos φ sin(λ−λ₀), y = cos φ₀ sin φ − sin φ₀ cos φ cos(λ−λ₀), on the near side when sin φ₀ sin φ + cos φ₀ cos φ cos(λ−λ₀) > 0, with the viewer tilted 18° above the equator. Near lines at 78% opacity, far lines at 16% (10% when small), non-scaling 1.1px strokes. While searching it turns 34°/s on requestAnimationFrame. Each result lands as a ping at its place: a 3.4-unit dot in the accent with a ring that expands from 0.3 to 1.6 and fades once (0.9 s); below 32px the dot and ring are drawn larger (6.5 and 14) so they still show. Pings ride the globe round and fade as they turn away. When the search ends the globe eases to face the last result along the shortest turn, then the loop stops; it pauses off screen and in hidden tabs.\n\nThe line: the globe, 'Searching the web' with a 2.2 s sheen moving across the words, the query in a small chip that truncates first, and a live count on the right ('7 found', each new number rolling up). Done: 'Searched the web' and a '12 results' button with a chevron that turns; it opens the list underneath, indented to the text: a letter favicon, the title (ellipsised) and the site in mono.\n\nKeyboard: the results toggle is a real button (Enter/Space) with aria-expanded and aria-controls and a 2px focus ring. Touch: it's a 26px-tall tap target, and nothing depends on hover (hover only tints rows). Below 520px the site column hides and the list loses its indent. A polite status region says 'Searching the web for …' and then '…: 12 results', not every count; the globe itself is decorative. Reduced motion: no turning, rings or sheen; the globe stands facing the latest result and the label is plain text.",
  interaction: "Watch the search; when it's done, open the results with the count button (Enter or Space). In the demo, 'Search again' replays it.",
  animation: "The globe turns 34°/s while searching and eases to rest facing the last result; pings ring once (0.9s); the count rolls up; the label carries a 2.2s sheen. Paused off screen and in hidden tabs; reduced motion holds still.",
  a11y: "The globe is decorative; a polite status region announces the start and the result count; the results toggle is a button with aria-expanded controlling an ordered list.",
  responsive: "The line truncates the query first; below 520px the result list drops the site column and its indent. The globe scales from 20px inline to 64px.",
  touchFallback: "The results toggle is a tap target; nothing depends on hover.",
  variants: [
    { id: "dark", label: "Dark", prompt: "Dark theme colour tokens: --glbs-ink #ececec; --glbs-muted #8c8c8c; --glbs-faint #5a5a5a; --glbs-line #2a2a2a; --glbs-chip #1d1d1d; --glbs-sea #10161f; --glbs-sea-hi #1c2836; --glbs-grid #9fb4cf; --glbs-ping #5f87f7; --glbs-focus #8ab4f8. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "light", label: "Light", prompt: "Light theme colour tokens: --glbs-ink #1a1a1a; --glbs-muted #6b6b6b; --glbs-faint #a3a3a3; --glbs-line #e3e3e1; --glbs-chip #f2f1ee; --glbs-sea #dfe8f3; --glbs-sea-hi #f4f8fc; --glbs-grid #3d5b80; --glbs-ping #2f5ee0; --glbs-focus #2b59c3. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0b0b0b", mode: "fill", frame: [1200, 800] },
};
