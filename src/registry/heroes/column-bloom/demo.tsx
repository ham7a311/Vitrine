"use client";
import { ColumnBloom } from "./ColumnBloom";

// Three fictional partner marks, drawn for this demo.
const Spark = () => (
  <svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 2l2.1 9.2L26 6l-5.2 7.9L30 16l-9.2 2.1L26 26l-7.9-5.2L16 30l-2.1-9.2L6 26l5.2-7.9L2 16l9.2-2.1L6 6l7.9 5.2Z" /></svg>
);
const Knot = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="7" /><circle cx="20" cy="12" r="7" /><circle cx="16" cy="19.5" r="7" /></svg>
);
const Prism = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M16 3 27 9.5v13L16 29 5 22.5v-13Z" /><path d="M16 3v26M5 9.5l22 13M27 9.5l-22 13" /></svg>
);

const WORDS = [
  "Capture", "Outline", "Draft", "Daily notes", "Backlinks", "Tags", "Revise", "One place",
  "Templates", "Citations", "Focus", "Search", "History", "Versions", "Sync", "Publish",
  "Offline", "Comments", "Export", "Share",
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full">
      <ColumnBloom
        wordmark="qalam"
        keywords={WORDS}
        partners={[{ name: "Inkwell", mark: <Spark /> }, { name: "Folio", mark: <Knot /> }, { name: "Prism", mark: <Prism /> }]}
        label="Qalam: everything you write, in one place"
        theme={variant === "dark" ? "dark" : "light"}
        className="w-full"
      />
    </div>
  );
}
