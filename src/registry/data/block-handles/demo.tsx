"use client";
import { BlockHandles } from "./BlockHandles";

const BLOCKS = [
  { id: "1", kind: "heading" as const, text: "Wally onboarding, week one" },
  { id: "2", text: "Hamza walks new joiners through the Muscat studio on Sunday morning." },
  { id: "3", kind: "todo" as const, text: "Set up laptops and accounts", done: true },
  { id: "4", kind: "todo" as const, text: "Pair on the first support ticket" },
  { id: "5", kind: "todo" as const, text: "Lunch with the design team" },
  { id: "6", text: "Questions go in the #onboarding thread; answers land in this page by Thursday." },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full justify-center px-3 py-12 sm:px-10 ${dark ? "bg-[#191919]" : "bg-white"}`}>
      <div className="w-full max-w-[40rem]">
        <BlockHandles defaultBlocks={BLOCKS} theme={dark ? "dark" : "light"} />
        <p className={`ml-[52px] mt-8 text-[12px] ${dark ? "text-[#6f6e69]" : "text-[#a5a29a]"}`} style={{ fontFamily: "Inter, system-ui, sans-serif" }}>Hover a block and drag ⋮⋮, or focus it and press Space, then the arrow keys.</p>
      </div>
    </div>
  );
}
