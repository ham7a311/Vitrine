"use client";

import { SearchHits } from "./SearchHits";

const TEXT = [
  "The first café in the street opened in 1921, in what had been a saddler's shop. It served one thing — coffee, black, in a glass — and stayed open until the last customer left.",
  "By the fifties there were six. The Café Royal had the mirrors, the Cafe Lune had the music, and the small café by the station had the only telephone for a mile, which made it the unofficial post office.",
  "Most of them closed in the eighties, when rents doubled. The one that survived did so by changing nothing: the same chairs, the same glasses, and a sign that still reads CAFÉ in letters a foot high.",
  "Ask anyone who grew up here where they learned to talk to strangers and they will name a café before they name a school.",
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center px-4 py-12 sm:px-12 ${night ? "bg-[#0e0e10]" : "bg-[#efece5]"}`}>
      <div className="mx-auto w-full max-w-[40rem]">
        <SearchHits
          theme={night ? "night" : "paper"}
          paragraphs={TEXT}
          initialQuery="cafe"
          title={<h2 className="relative z-[1] mb-4 mt-0 font-[family-name:Newsreader] text-[1.6rem] font-medium leading-tight tracking-[-0.01em]">One street, a hundred years of coffee</h2>}
          className="font-[family-name:Newsreader] text-[1.08rem] leading-[1.7]"
        />
        <p className={`mt-4 text-center font-mono text-[11px] tracking-[0.06em] ${night ? "text-white/40" : "text-black/45"}`}>Enter · next &nbsp; Shift+Enter · previous &nbsp; Esc · clear</p>
      </div>
    </div>
  );
}
