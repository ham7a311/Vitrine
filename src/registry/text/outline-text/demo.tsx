"use client";
import { OutlineText } from "./OutlineText";

const EFFECTS = ["hover", "scroll", "echo", "marquee"] as const;
const LINES = {
  hover: ["Quiet tools", "for loud ideas"],
  scroll: ["Every pixel", "earns its", "place."],
  echo: ["Signal"],
  marquee: ["Design", "Build", "Ship", "Listen", "Measure", "Repeat", "Prototype", "Iterate"],
};
const HINT = { hover: "Point at a word", scroll: "Scroll", echo: "Move your pointer", marquee: "Hover to pause" };

export default function Demo({ variant = "hover" }: { variant?: string }) {
  const effect = (EFFECTS as readonly string[]).includes(variant) ? (variant as (typeof EFFECTS)[number]) : "hover";
  const panel = (theme: "light" | "dark") => (
    <div className={`otxt-demo__panel otxt-demo__panel--${theme}`}>
      {effect === "scroll" ? <OutlineText effect="scroll" lines={LINES.scroll} theme={theme} /> : (
        <div className={effect === "marquee" || effect === "echo" ? "" : "otxt-demo__pad"}>
          {effect === "hover" && <p className="otxt-demo__hint">{HINT[effect]}</p>}
          <OutlineText effect={effect} lines={LINES[effect]} theme={theme} />
        </div>
      )}
    </div>
  );
  return <div className="otxt-demo">{panel("light")}{panel("dark")}</div>;
}
