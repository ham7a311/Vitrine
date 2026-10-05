"use client";
import { LineMap } from "./LineMap";

const STATIONS = [
  { id: "welcome", title: "Welcome" }, { id: "first", title: "Your first doc" }, { id: "sharing", title: "Sharing" }, { id: "citations", title: "Citations" }, { id: "teams", title: "Teams" }, { id: "admin", title: "Admin basics" },
  { id: "voice", title: "Voice & tone" }, { id: "structure", title: "Structure" }, { id: "drafting", title: "Drafting" }, { id: "interviews", title: "Interviews" }, { id: "editing", title: "Editing" }, { id: "style", title: "Style guide" },
  { id: "questions", title: "Asking questions" }, { id: "sources", title: "Sources" }, { id: "notes", title: "Field notes" }, { id: "publishing", title: "Publishing" },
];
const LINES = [
  { id: "found", name: "Foundations", color: "#2f63d6", stops: ["welcome", "first", "sharing", "citations", "teams", "admin"] },
  { id: "write", name: "Writing", color: "#d2452b", stops: ["voice", "structure", "drafting", "interviews", "editing", "style"] },
  { id: "research", name: "Research", color: "#1f8a5b", stops: ["questions", "citations", "sources", "interviews", "notes", "publishing"] },
];
const GRID = {
  welcome: [0, 1, "n"], first: [1, 1, "n"], sharing: [2, 1, "n"], citations: [3, 1, "se"], teams: [4, 1, "n"], admin: [5, 1, "n"],
  voice: [0, 3, "s"], structure: [1, 3, "s"], drafting: [2, 3, "s"], interviews: [3, 3, "sw"], editing: [4, 3, "n"], style: [5, 3, "n"],
  questions: [3, 0, "e"], sources: [3, 2, "e"], notes: [4, 4, "s"], publishing: [5, 4, "s"],
} as const;

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-10 ${dark ? "bg-[#0b0c0d]" : "bg-[#e9e7e0]"}`}>
      <div className="w-full max-w-[52rem]">
        <LineMap
          title="Masar Academy"
          stations={STATIONS}
          lines={LINES}
          grid={GRID as never}
          visited={["welcome", "first", "sharing", "citations", "questions", "voice", "structure"]}
          current="sources"
          theme={dark ? "dark" : "light"}
        />
      </div>
    </div>
  );
}
