"use client";
import { BlankPageStarter, type StarterTemplate } from "./BlankPageStarter";

const TEMPLATES: StarterTemplate[] = [
  { id: "meeting", label: "Meeting notes", glyph: "✎", blocks: [
    { type: "heading", text: "Attendees" }, { type: "bullet", text: "Hamza Al-Bulushi" }, { type: "bullet", text: "Layla Al-Harthy" },
    { type: "heading", text: "Decisions" }, { type: "text", text: "Write what was agreed, not what was said." },
    { type: "heading", text: "Actions" }, { type: "todo", text: "Send the summary by 4pm" }, { type: "todo", text: "Book the follow-up for Sunday" },
  ] },
  { id: "weekly", label: "Weekly plan", glyph: "☷", blocks: [
    { type: "heading", text: "This week" }, { type: "todo", text: "One thing that must ship" }, { type: "todo", text: "One thing to learn" },
    { type: "heading", text: "Waiting on" }, { type: "bullet", text: "Contract from the Qalam team" },
  ] },
  { id: "reading", label: "Reading list", glyph: "❏", blocks: [
    { type: "heading", text: "Now" }, { type: "bullet", text: "The Elements of Typographic Style" },
    { type: "heading", text: "Next" }, { type: "bullet", text: "A Pattern Language" }, { type: "bullet", text: "Thinking in Systems" },
  ] },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full justify-center px-6 py-14 sm:px-12 ${dark ? "bg-[#191919]" : "bg-white"}`}>
      <div className="w-full max-w-[40rem]">
        <BlankPageStarter templates={TEMPLATES} theme={dark ? "dark" : "light"} />
      </div>
    </div>
  );
}
