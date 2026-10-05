"use client";
import { BoardView, type BoardCard, type BoardColumn } from "./BoardView";

const COLUMNS: BoardColumn[] = [
  { id: "todo", label: "Not started", color: "gray" },
  { id: "doing", label: "In progress", color: "blue" },
  { id: "review", label: "In review", color: "purple" },
  { id: "done", label: "Done", color: "green" },
];
const CARDS: BoardCard[] = [
  { id: "c1", title: "Arabic copy for the onboarding emails", status: "todo", assignee: "Layla Al-Harthy", due: "2026-10-16", tags: [{ label: "Copy", color: "orange" }] },
  { id: "c2", title: "Offline mode for saved routes", status: "todo", due: "2026-10-23", tags: [{ label: "Mobile", color: "pink" }, { label: "Large", color: "gray" }] },
  { id: "c3", title: "Masar map tiles at 3× density", status: "doing", assignee: "Hamza Al-Bulushi", due: "2026-10-12", tags: [{ label: "Maps", color: "blue" }] },
  { id: "c4", title: "Billing page empty states", status: "doing", assignee: "Omar Said", tags: [{ label: "Design", color: "purple" }] },
  { id: "c5", title: "Wally receipts export to CSV", status: "review", assignee: "Salma Rashid", due: "2026-10-09", tags: [{ label: "Finance", color: "green" }] },
  { id: "c6", title: "Fix date picker in Safari 17", status: "done", assignee: "Hamza Al-Bulushi", tags: [{ label: "Bug", color: "red" }] },
  { id: "c7", title: "Release notes for 2.4", status: "done", assignee: "Layla Al-Harthy", tags: [{ label: "Copy", color: "orange" }] },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`min-h-full w-full px-4 py-8 sm:px-8 ${dark ? "bg-[#191919] text-[#e3e2e0]" : "bg-white text-[#37352f]"}`} style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <div className="mx-auto max-w-[68rem]">
        <p className={`mb-1 text-[13px] ${dark ? "text-[#9b9a97]" : "text-[#787774]"}`}>Masar · Product</p>
        <h2 className="mb-5 text-[28px] font-bold tracking-[-0.01em]">Sprint 41</h2>
        <BoardView columns={COLUMNS} defaultCards={CARDS} locale="en-GB" theme={dark ? "dark" : "light"} />
      </div>
    </div>
  );
}
