"use client";

import { TypesetHero } from "./TypesetHero";

/** Contour lines of a headland: a backdrop that is drawn, not a gradient. */
function Contours({ ink }: { ink: string }) {
  const rings = Array.from({ length: 13 }, (_, i) => {
    const r = 40 + i * 34;
    const d = Array.from({ length: 49 }, (_, k) => {
      const a = (k / 48) * Math.PI * 2;
      const wob = 1 + 0.16 * Math.sin(a * 3 + i * 0.35) + 0.08 * Math.sin(a * 5 - i * 0.2);
      return `${k ? "L" : "M"}${(1000 + Math.cos(a) * r * 1.5 * wob).toFixed(1)} ${(380 + Math.sin(a) * r * wob).toFixed(1)}`;
    });
    return <path key={i} d={d.join("") + "Z"} />;
  });
  return (
    <svg viewBox="0 0 1280 800" preserveAspectRatio="xMidYMid slice" fill="none" stroke={ink} strokeWidth="1" style={{ opacity: 0.5 }}>
      {rings}
    </svg>
  );
}

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div className="h-full min-h-[40rem] w-full">
      <TypesetHero
        theme={paper ? "paper" : "night"}
        backdrop={<div style={{ background: paper ? "#e8e4da" : "#14161c" }}><Contours ink={paper ? "#8a8374" : "#7e93ae"} /></div>}
        eyebrow="Relay 4.0 · Released 14 October"
        headline={<>Every pull request gets its own <em>address</em>.</>}
        lede="Send a link instead of a screenshot. Masar's reviewers open the running branch, leave a comment on the page itself, and the preview is gone when the branch is."
        primary={{ label: "Create a project", href: "#create" }}
        secondary={{ label: "Read the changelog", href: "#changelog" }}
        facts={[
          { term: "Build", value: "41 s median" },
          { term: "Region", value: "Muscat, Frankfurt" },
          { term: "Licence", value: "MIT" },
        ]}
      />
    </div>
  );
}
