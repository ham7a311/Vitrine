"use client";
import { ConfidenceInk, type Token } from "./ConfidenceInk";

// Written compactly: plain words are near-certain; [word|p|alt:p|alt:p] marks a token the model hesitated on.
const SOURCE =
  "The old [souq|0.58|market:0.31|bazaar:0.07] in Muttrah opens at [8:30|0.34|9:00:0.29|8:00:0.22|10:00:0.1] in the morning and closes for a [break|0.71|siesta:0.12|pause:0.09] between 1 and 4 in the afternoon. Most stalls sell frankincense, silver and [textiles|0.47|fabric:0.28|cloth:0.14|scarves:0.08], and prices are [usually|0.52|often:0.3|always:0.06] open to friendly bargaining. On Fridays the souq opens only in the [evening|0.39|afternoon:0.33|morning:0.21], so plan a weekday visit if you want the [quieter|0.44|calmer:0.29|emptier:0.17] hours.";

function parse(src: string): Token[] {
  const out: Token[] = [];
  for (const part of src.split(/(\[[^\]]+\])/)) {
    if (part.startsWith("[")) {
      const [text, p, ...alts] = part.slice(1, -1).split("|");
      out.push({ text, p: +p, alternatives: alts.map((a) => { const k = a.lastIndexOf(":"); return { text: a.slice(0, k), p: +a.slice(k + 1) }; }) });
    } else {
      for (const w of part.match(/\s*\S+|\s+$/g) ?? []) out.push({ text: w, p: 0.9 + ((w.length * 7) % 10) / 100 });
    }
  }
  return out;
}

const TOKENS = parse(SOURCE);

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-10 ${dark ? "bg-[#0c0b10]" : "bg-[#ece9e1]"}`}>
      <div className="w-full max-w-[40rem]">
        <ConfidenceInk label="Qalam · when is the Muttrah souq open?" tokens={TOKENS} theme={dark ? "dark" : "light"} />
      </div>
    </div>
  );
}
