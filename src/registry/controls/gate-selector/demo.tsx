"use client";
import { useRef } from "react";
import { GateSelector } from "./GateSelector";

const STATES = [
  { id: "draft", label: "Draft" },
  { id: "review", label: "In review" },
  { id: "approved", label: "Approved" },
  { id: "archived", label: "Archived" },
  { id: "changes", label: "Changes" },
  { id: "published", label: "Published" },
];
const SLOTS = {
  draft: { col: 0, side: "up" }, review: { col: 1, side: "up" }, approved: { col: 2, side: "up" },
  archived: { col: 0, side: "down" }, changes: { col: 1, side: "down" }, published: { col: 2, side: "down" },
} as const;
const MOVES: Record<string, string[]> = {
  draft: ["review", "archived"],
  review: ["approved", "changes", "draft"],
  changes: ["review", "draft"],
  approved: ["published", "changes"],
  published: ["archived"],
  archived: ["draft"],
};
const why = (from: string, to: string) => ({
  approved: "only work in review can be approved.",
  published: "only approved work can be published.",
  changes: "changes are requested during review or after approval.",
  review: from === "published" ? "published work is archived before it's edited again." : "it needs a draft or a revision first.",
  draft: from === "published" ? "archive it first, then reopen it as a draft." : "it's already past drafting.",
  archived: "only drafts and published work can be archived.",
} as Record<string, string>)[to];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const calls = useRef(0);
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-10 ${dark ? "bg-[#151617]" : "bg-[#e9e6df]"}`}>
      <div className="w-full max-w-[34rem]">
        <GateSelector
          label="Masar · Field notes, issue 12"
          states={STATES}
          slots={SLOTS}
          transitions={MOVES}
          reason={why}
          defaultValue="review"
          theme={dark ? "dark" : "light"}
          // Simulated service: the third move is refused, to show the knob returning.
          onChange={() => new Promise((resolve, reject) => setTimeout(() => (++calls.current === 3 ? reject(new Error("Someone else just changed this issue. Refresh to see their edit.")) : resolve()), 500))}
        />
      </div>
    </div>
  );
}
