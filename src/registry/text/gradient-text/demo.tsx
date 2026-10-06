"use client";
import { GradientText } from "./GradientText";

const EFFECTS = ["aurora", "shine", "spotlight"] as const;
const COPY = {
  aurora: { eyebrow: "Launch week", lead: "Make the thing", word: "everyone remembers.", line: "Gradients that move as slowly as a sky, through text you can still select, copy and read aloud.", inline: "slowly" },
  shine: { eyebrow: "Series 2", lead: "Machined from a", word: "single block.", line: "Brushed metal lettering with a narrow band of light that crosses it every few seconds.", inline: "band of light" },
  spotlight: { eyebrow: "Move your pointer", lead: "Colour where", word: "you are looking.", line: "The letters stay quiet until you come near, then a pool of colour follows you through them.", inline: "pool of colour" },
};

export default function Demo({ variant = "aurora" }: { variant?: string }) {
  const effect = (EFFECTS as readonly string[]).includes(variant) ? (variant as (typeof EFFECTS)[number]) : "aurora";
  const c = COPY[effect];
  const panel = (theme: "light" | "dark") => {
    const [before, after] = c.line.split(c.inline);
    return (
      <section className={`grdt-demo__panel grdt-demo__panel--${theme}`} aria-label={theme === "dark" ? "On dark" : "On light"}>
        <p className="grdt-demo__eyebrow">{c.eyebrow}</p>
        <h2>{effect === "spotlight" ? <GradientText effect={effect} theme={theme}>{c.lead} {c.word}</GradientText> : <>{c.lead} <GradientText effect={effect} theme={theme}>{c.word}</GradientText></>}</h2>
        <p>{before}<GradientText effect={effect === "spotlight" ? "aurora" : effect} theme={theme}>{c.inline}</GradientText>{after}</p>
      </section>
    );
  };
  return <div className="grdt-demo">{panel("light")}{panel("dark")}</div>;
}
