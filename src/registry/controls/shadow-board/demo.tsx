"use client";
import { ShadowBoard, type ShadowTool } from "./ShadowBoard";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const TOOLS: ShadowTool[] = [
  { id: "bold", label: "Bold", icon: icon("M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z") },
  { id: "italic", label: "Italic", icon: icon("M14 5h-4M14 19h-4M14 5l-4 14") },
  { id: "link", label: "Link", icon: icon("M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1") },
  { id: "heading", label: "Heading", icon: icon("M6 5v14M18 5v14M6 12h12") },
  { id: "list", label: "List", icon: icon("M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01") },
  { id: "checklist", label: "Checklist", icon: icon("M4 7l2 2 3-3M4 16l2 2 3-3M12 8h8M12 17h8") },
  { id: "quote", label: "Quote", icon: icon("M7 7h4v4c0 3-2 5-4 6M15 7h4v4c0 3-2 5-4 6") },
  { id: "code", label: "Code", icon: icon("M9 8l-4 4 4 4M15 8l4 4-4 4") },
  { id: "image", label: "Image", icon: icon("M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15 9h.01") },
  { id: "table", label: "Table", icon: icon("M4 5h16v14H4zM4 10h16M4 15h16M10 5v14") },
  { id: "divider", label: "Divider", icon: icon("M4 12h16M8 7h8M8 17h8") },
  { id: "comment", label: "Comment", icon: icon("M5 5h14v10H10l-4 4v-4H5z") },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full items-start justify-center px-4 py-12 ${dark ? "bg-[#111214]" : "bg-[#e7e3db]"}`}>
      <div className="w-full max-w-[40rem]">
        <ShadowBoard
          label="Qalam editor"
          tools={TOOLS}
          defaultValue={["bold", "italic", "link", "heading", "list", "quote", "image"]}
          max={9}
          defaultOpen
          theme={dark ? "dark" : "light"}
        />
        <p className={`mt-4 px-1 text-[15px] leading-relaxed ${dark ? "text-[#c9c6be]" : "text-[#4a453d]"}`}>
          Every tool keeps a painted outline where it hangs, so you can tell at a glance what's on the toolbar and where each tool goes back.
        </p>
      </div>
    </div>
  );
}
