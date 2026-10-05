import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "contact-sheet",
  name: "Contact Sheet",
  category: "media",
  description: "Choose pictures the way photographers did on a light table: frames on a strip of film with edge numbers, a loupe to look closely, and a red grease pencil to circle the keepers, cross out the rest and rate the best, then filter down to what you circled.",
  tags: ["photos", "gallery", "selection", "review", "media", "keyboard", "loupe"],
  traits: ["click", "keyboard", "cursor"],
  source: "original",
  files: ["ContactSheet.tsx", "contact-sheet.css"],
  dependencies: [],
  prompt:
    "Build a photo selection surface modelled on a photographer's contact sheet on a light table: the work is choosing, so marking is the main interaction.\n\nSurface: a 14px-radius panel lit from the middle like a light box (a soft radial glow from white to pale blue-grey), IBM Plex Sans. A header holds a segmented filter (All 16 · Circled 2 · Unmarked 13, with counts) and a 'Loupe' toggle with a Space key hint.\n\nFrames: a responsive grid (168px minimum). Each frame is a strip of black film: 16px of film above and below the 3:2 image with rows of rounded sprocket holes punched in it, and the edge code printed in small orange mono along the bottom ('12A', '▸ 1'). Under each frame: the title in muted small type and five small stars.\n\nMarks are drawn in red grease pencil over the frame, never as badges: circling draws an uneven loop slightly larger than the picture that overshoots where it began (seeded per frame so each loop is different); crossing out draws two strokes, the second slightly later, and dims and desaturates the photo; stars fill red. Every mark draws itself with a dash-offset animation over 300ms.\n\nLoupe: when on, the cursor over a frame becomes a 180px round magnifier with a black film-coloured rim showing that frame at 2.5×; from the keyboard it centres on the focused frame and follows as focus moves.",
  interaction:
    "Frames form a grid with one tab stop: arrows move (up and down by the visible column count), Home and End jump. C circles (and clears a cross), X crosses out (and clears a circle), 1–5 sets stars (the same number again clears them), 0 clears every mark, Space toggles the loupe. Stars can also be clicked. onChange(marks) receives every frame's { circle, reject, stars }.",
  animation: "Grease-pencil strokes draw in over 300ms (the second stroke of an X 140ms later); rejected photos dim over 200ms. Reduced motion or motion={false} shows marks complete at once.",
  a11y:
    "Each frame is a button named with its edge code, title and marks ('12C, Wahiba Sands at dusk, circled, 4 stars'); the grid's key help is attached as its description, and every change is announced in a polite live region. The pencil marks and the loupe are decorative; the same state is in the names. Images keep their alt text.",
  responsive: "The grid fits as many 168px frames per row as there is room for; arrow movement follows the actual number of columns.",
  touchFallback: "Tap a frame to focus it and tap stars directly; on touch screens the marks and filter work without a keyboard, and the loupe is optional.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#d9dde2", mode: "fill", frame: [1200, 820] },
  isNew: true,
};
