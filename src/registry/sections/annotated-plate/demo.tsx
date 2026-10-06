"use client";

import { AnnotatedPlate, type PlatePart } from "./AnnotatedPlate";

const PARTS: PlatePart[] = [
  { id: "address", term: "The address", note: "Every branch builds to a URL named for it, so a link to a review never needs explaining.", box: [24, 20, 408, 32] },
  { id: "page", term: "The running branch", note: "Not a screenshot: the real build, with real data from the staging database.", box: [24, 68, 592, 262] },
  { id: "comment", term: "A comment, pinned", note: "Reviewers write on the element itself. The thread is archived with the branch.", box: [372, 150, 196, 76] },
  { id: "promote", term: "Promote", note: "Moves exactly this build to production. Nothing is rebuilt, so what you reviewed is what ships.", box: [492, 358, 124, 38] },
];

function Figure({ night }: { night: boolean }) {
  const ink = night ? "#ececea" : "#1b1a17";
  const mute = night ? "#3a3c42" : "#d9d6cd";
  const soft = night ? "#222328" : "#efede6";
  const accent = night ? "#7aa2ff" : "#2f6bff";
  return (
    <svg viewBox="0 0 640 420" role="img" aria-label="A deploy preview in a browser: an address bar, the running page with a pinned comment, and a Promote button.">
      <rect x="24" y="20" width="408" height="32" rx="16" fill={soft} />
      <circle cx="44" cy="36" r="4" fill={accent} />
      <text x="58" y="40" fontSize="12" fill={ink} fontFamily="Geist Mono, ui-monospace, monospace">masar-pr-482.relay.app</text>
      <rect x="24" y="68" width="592" height="262" rx="6" fill={night ? "#101114" : "#fbfaf6"} stroke={mute} />
      <text x="48" y="112" fontSize="26" fill={ink} fontFamily="Instrument Serif, Georgia, serif">Plan a trip</text>
      <rect x="48" y="128" width="210" height="8" rx="4" fill={mute} />
      <rect x="48" y="146" width="160" height="8" rx="4" fill={mute} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={48 + i * 118} y="190" width="106" height="110" rx="6" fill={soft} />
          <rect x={58 + i * 118} y="262" width="70" height="7" rx="3.5" fill={mute} />
          <rect x={58 + i * 118} y="276" width="44" height="7" rx="3.5" fill={mute} />
        </g>
      ))}
      <g>
        <rect x="372" y="150" width="196" height="76" rx="8" fill={night ? "#1d1f24" : "#fff"} stroke={mute} />
        <circle cx="392" cy="172" r="8" fill={accent} />
        <text x="406" y="176" fontSize="11" fill={ink} fontFamily="Geist, sans-serif" fontWeight="600">Priya</text>
        <text x="388" y="196" fontSize="11" fill={ink} fontFamily="Geist, sans-serif">Can the date picker open</text>
        <text x="388" y="212" fontSize="11" fill={ink} fontFamily="Geist, sans-serif">on Saturday for Oman?</text>
      </g>
      <rect x="492" y="358" width="124" height="38" rx="8" fill={ink} />
      <text x="554" y="381" textAnchor="middle" fontSize="13" fontWeight="500" fill={night ? "#111214" : "#fff"} fontFamily="Geist, sans-serif">Promote</text>
    </svg>
  );
}

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center ${night ? "bg-[#0f1012]" : "bg-[#f6f5f1]"} px-6 py-10 sm:px-10`}>
      <div className="mx-auto w-full max-w-[64rem]">
        <AnnotatedPlate
          theme={night ? "night" : "paper"}
          figure="Fig. 2"
          caption="A review of Masar, pull request 482"
          size={[640, 420]}
          title="What a preview is made of"
          parts={PARTS}
        >
          <Figure night={night} />
        </AnnotatedPlate>
      </div>
    </div>
  );
}
