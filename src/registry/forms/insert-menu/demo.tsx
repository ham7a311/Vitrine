"use client";
import { InsertMenu } from "./InsertMenu";

const BLOCKS = [
  { id: "a", type: "h1" as const, text: "Masar 2.4 launch notes" },
  { id: "b", type: "text" as const, text: "Shipping on Thursday from the Muscat office. Owners are listed beside each task." },
  { id: "c", type: "todo" as const, text: "Record the walkthrough video", checked: true },
  { id: "d", type: "todo" as const, text: "Send the changelog to the beta group", checked: false },
  { id: "e", type: "text" as const, text: "" },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full justify-center px-5 py-12 sm:px-10 ${dark ? "bg-[#191919]" : "bg-white"}`}>
      <div className="w-full max-w-[42rem]">
        <InsertMenu defaultBlocks={BLOCKS} theme={dark ? "dark" : "light"} />
        <p className={`mt-10 text-[12px] ${dark ? "text-[#6f6e69]" : "text-[#a5a29a]"}`} style={{ fontFamily: "Inter, system-ui, sans-serif" }}>Click the last line and type <kbd className="font-semibold">/</kbd>, then keep typing to filter.</p>
      </div>
    </div>
  );
}
