"use client";
import { PairwiseRanker, type RankItem } from "./PairwiseRanker";

const ROADMAP: RankItem[] = [
  { id: "offline", title: "Offline drafts", detail: "Write on the plane; sync when you land." },
  { id: "arabic", title: "Arabic interface", detail: "Right-to-left layout and translated menus." },
  { id: "search", title: "Search inside PDFs", detail: "Find a phrase in any attached file." },
  { id: "share", title: "Share with a link", detail: "Read-only links that expire." },
  { id: "billing", title: "Annual billing", detail: "Pay once a year, two months free." },
  { id: "export", title: "Export to Word", detail: "Keep headings, tables and comments." },
  { id: "mobile", title: "Phone app", detail: "Read and comment from anywhere." },
  { id: "audit", title: "Audit log", detail: "Who changed what, and when." },
  { id: "templates", title: "Team templates", detail: "Start every proposal the same way." },
  { id: "dark", title: "Dark mode", detail: "For late nights in the studio." },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-10 ${dark ? "bg-[#0d0d0c]" : "bg-[#e4ded2]"}`}>
      <div className="w-full max-w-[60rem]">
        <PairwiseRanker items={ROADMAP} question="Which should Masar build first?" theme={dark ? "dark" : "light"} />
      </div>
    </div>
  );
}
