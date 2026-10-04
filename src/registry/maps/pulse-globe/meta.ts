import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "pulse-globe",
  name: "Pulse Globe",
  category: "maps",
  description: "Live activity on a dotted globe: every event rings out where it happened, a feed lists the latest, and a sparkline counts the last minute.",
  tags: ["globe", "map", "world", "analytics", "realtime", "dashboard", "activity", "canvas"],
  traits: ["canvas", "click", "touch", "ambient"],
  source: "original",
  files: ["PulseGlobe.tsx", "pulse-globe.css", "../route-globe/globe.ts", "../route-globe/land.ts"],
  dependencies: [],
  prompt: `Build a real-time activity view: a dotted globe (Canvas 2D, Fibonacci-sampled land from a 1° Natural Earth mask, orthographic, turning slowly at 0.12 rad/s, drag to spin with inertia) beside a 17rem side panel (stacked under the globe below 720px).

A seeded stream (so every visit shows the same story) produces an event every 0.35–1.1s at one of twenty real cities, of three kinds — Search 50%, Booking 32%, Sign-up 18% — each kind in a fixed series colour from a colour-blind-checked palette. On the globe each event is a dot with two expanding rings (the second 0.5s later) that fade over 1.6s, scaled by how face-on the point is; events on the far side aren't drawn. The last minute is pre-filled so it opens full.

The panel: a mono "Live · last 60 seconds" label, the total as a big tabular number, a sparkline of events per 5-second bucket (12 points, one axis, the first series colour), a legend so colour is never the only key, and a feed of the latest six events (colour dot, kind, city, "4s ago") where the newest row slides in. Hovering or focusing the feed holds it still so it can be read (the globe keeps going) and says so underneath; its live region turns off while held. Pause rendering offscreen; under reduced motion draw a still globe with the latest eight events.`,
  interaction: "Drag the globe to spin it; hover or focus the feed to hold it while you read.",
  animation: "Events every 0.35–1.1s; rings expand and fade over 1.6s; globe turns at 0.12 rad/s; new feed rows slide in over 400ms.",
  a11y: "The feed is an ordered list with a polite live region (off while held); the sparkline has a text summary; the legend names every colour. Reduced motion shows a still frame of recent events.",
  responsive: "Globe and panel side by side, stacking below 720px; the globe scales to the smaller side of its cell.",
  touchFallback: "Drag to spin on touch; tap the feed to hold it.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#0c0e12", mode: "fill", height: 620 },
};
