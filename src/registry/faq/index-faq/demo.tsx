"use client";

import { IndexFaq } from "./IndexFaq";

export default function Demo() {
  return (
    <div className="min-h-full w-full bg-[#0b080d] p-6 sm:p-10 [container-type:inline-size]">
      <div className="mx-auto w-full max-w-2xl">
        <IndexFaq
          items={[
            { q: "Can I use these in a commercial project?", a: "Yes. Everything here is MIT licensed — copy it, change it, ship it. Attribution is appreciated but never required." },
            { q: "Do the components need any dependencies?", a: "No. They use React, and Tailwind classes where it helps. Anything that needs real keyframes lives in a small CSS file beside the component." },
            { q: "How are animations kept accessible?", a: "Every animation respects prefers-reduced-motion, keyboard users get the same states as hover users, and anything hover-only has a touch fallback." },
            { q: "Why prompts as well as code?", a: "The prompt is the design intent. Paste it into your assistant of choice to regenerate a variation, or read it to understand why the code is the way it is." },
          ]}
        />
      </div>
    </div>
  );
}
