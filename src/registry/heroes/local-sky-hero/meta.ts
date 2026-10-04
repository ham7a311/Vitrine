import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "local-sky-hero",
  name: "Local Sky Hero",
  category: "heroes",
  description: "A studio hero set on a sea horizon where the sky is the visitor's own: its colour and the sun or moon follow their local time, and the horizon says what time it is at the studio and whether anyone's in.",
  tags: ["hero", "landing", "studio", "agency", "time zone", "sky", "contact"],
  traits: ["ambient"],
  source: "original",
  files: ["LocalSkyHero.tsx", "local-sky-hero.css"],
  dependencies: [],
  prompt:
    "Build a hero for a small studio, set on a sea horizon. The sky's three gradient stops (top, middle, low) and the sea colour come from a table of hand-picked palettes through the day \u2014 night, before dawn, dawn, morning, noon, afternoon, golden hour, blue hour \u2014 mixed by the visitor's local hour. A sun crosses 6:00\u201318:00 on a sine arc (x from 8% to 92%, height from the horizon), warming toward orange as it nears the horizon; the rest of the day a smaller moon with a shaded side takes the arc, and faint stars fade in.\n\nThe colours and the light's position are registered @property values, so on load the sky settles from blue hour into the visitor's real sky over 2.4s while the light rises from below the horizon. It re-reads the clock every 30 seconds, unless a fixed hour is passed with the at prop. The text ink flips between dark and light with the palette.\n\nOn the horizon line, in small mono caps: the time at the studio ('Muscat 3:12 pm'), how far apart you are ('2 hours ahead of you'), and whether the studio is open, computed from its time zone, opening hours and working days (Sunday\u2013Thursday for Oman) \u2014 'In the studio now' with a green dot, or 'Back at 9:00 their time'. Below, a band of sea with a shimmering reflection under the light. A serif headline, a short paragraph and two buttons that take the sky's ink sit low in the sky.",
  interaction: "None needed; the sky reads the visitor's clock. The buttons are ordinary links.",
  animation: "Sky colours and the light's position transition 2.4s on load and on each clock update; the reflection shimmers slowly.",
  a11y: "The sky, light and sea are decorative and aria-hidden. The status line is real text. Ink colours flip with the palette so text stays readable at every hour; check your own headline against the dawn and dusk palettes. Reduced motion removes the settle and the shimmer.",
  responsive: "Headline and the light scale with the container; the horizon status wraps and left-aligns under 560px.",
  promptAllow: ["dawn", "noon", "night", "dusk"],
  variants: [
    { id: "live", label: "Your time", prompt: "Your time: no at prop — the sky follows the visitor's real local hour and updates every 30 seconds." },
    { id: "dawn", label: "Dawn", prompt: "at={6.5}: pinned to 6:30 — a dawn sky with the sun just above the horizon." },
    { id: "noon", label: "Noon", prompt: "at={12.5}: pinned to 12:30 — a high noon sun in a pale blue sky, dark ink." },
    { id: "dusk", label: "Dusk", prompt: "at={18.15}: pinned to about 18:09 — the sun at the horizon, warm orange light." },
    { id: "night", label: "Night", prompt: "at={22.4}: pinned to about 22:24 — a night sky with the moon and stars, light ink." },
  ],
  preview: { bg: "#111840", mode: "fill", height: 640, frame: [1280, 800] },
};
