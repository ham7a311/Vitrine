import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "bunting",
  name: "Bunting",
  category: "buttons",
  description: "Point at the button and a string of pennants drops over it, sagging between two pins and swinging as it settles. Move the pointer and the flags nearest it catch the gust; press and they all flutter. Leave and the string lifts away. Fête colours, nautical stripes or black and white.",
  tags: ["button", "hover", "bunting", "flags", "party", "festival", "celebration", "svg", "physics", "playful"],
  traits: ["hover", "click", "cursor", "keyboard"],
  source: "original",
  isNew: true,
  files: ["Bunting.tsx", "bunting.css", "flags.ts"],
  dependencies: [],
  prompt:
    "Build a pill button that bunting is hung over. Props: children, look (one of three flag sets), onClick, type and motion.\n\nHelpers (pure functions): flags every 19px along a line from just outside the button's left end to just outside its right end, 40px above its top, sagging 12px in the middle on a parabola — each with its position and the line's slope there in degrees; the line as one quadratic path; and a damped pendulum step for a flag's swing (stiffness 60, damping 3.2, plus a force).\n\nAn SVG overlay above the button (58px tall, 16px wider each side, pointer-events none) holds two pins, the string and the pennants — 14px-wide triangles 17px long with a hairline edge and a soft shadow, some with a trim stripe — each hanging from the string at its point and turned to its slope plus its swing. On pointerenter the whole string drops in with a springy overshoot (620ms) and the flags unfold from the top one after another (32ms apart); they land swinging alternately ±14°. Moving the pointer sideways gusts them: a force from the pointer's horizontal speed, strongest at the flag nearest the pointer and falling off over 70px. Pressing makes them all flutter on a fast sine that dies away. Swings run on requestAnimationFrame only while something moves, setting each flag's transform directly. On leave the string lifts away and fades. Keyboard focus hangs it; touch hangs it on press for 2.6s. Reduced motion only fades it in and out.\n\nThe button: a 54px pill with a light label and a 1px lift on hover. Leave room above it for the bunting.",
  interaction: "Point at the button to hang the bunting; move along it to blow the flags; press to make them flutter; leave to take it down.",
  animation: "The string drops in 620ms with an overshoot, flags unfold 32ms apart and swing on damped springs; leaving lifts it in 420ms. Reduced motion only fades.",
  a11y: "A real button with its text label; the bunting is decorative SVG, hidden and pointer-transparent.",
  responsive: "The string spans whatever width the button has; leave about 58px of room above it.",
  touchFallback: "A press hangs the bunting and makes it flutter for a couple of seconds.",
  variants: [
    { id: "fete", label: "Fête", prompt: "Coral #ff5d73, sunflower #ffc23d, green #2bb98a and blue #4a8cff pennants on a brown string over a deep violet #2b2140 button, on cream #fff4e3." },
    { id: "nautical", label: "Nautical", prompt: "Navy, red #d8352a and white pennants with contrasting trim stripes on a navy string over a navy #1b2b4b button, on pale blue #e6eef6." },
    { id: "mono", label: "Mono", prompt: "Black and off-white pennants, the white ones with a black stripe, over a black button, on stone #e9e7e1." },
  ],
  preview: { bg: "#fff4e3", mode: "center", height: 320 },
};
