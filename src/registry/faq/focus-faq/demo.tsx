"use client";

import { FocusFaq } from "./FocusFaq";

const QA = [
  { q: "Can I use these components in client work?", a: "Yes. Everything in Vitrine is MIT licensed — copy it, change it, ship it. Attribution is appreciated but never required." },
  { q: "Do they need an animation library?", a: "No. Every component is plain React with CSS, SVG, Canvas or raw WebGL. There's nothing to install beyond React and Tailwind." },
  { q: "How do they behave with reduced motion?", a: "Each one has a designed still state: the information stays, the movement goes. Nothing is simply switched off." },
  { q: "Will they work on touch devices?", a: "Every hover interaction has a touch fallback — usually a resting state that shows the idea, or the effect on press." },
  { q: "Can I request a component?", a: "Please do. Open an issue with the problem you're solving rather than the effect you want; the best components start there." },
];

export default function Demo() {
  return (
    <div className="flex min-h-full w-full items-start justify-center bg-[#0c0b0a] px-8 py-14">
      <FocusFaq items={QA} />
    </div>
  );
}
