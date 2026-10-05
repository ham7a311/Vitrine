"use client";
import { SpanWaterfall, type Span } from "./SpanWaterfall";

const SPANS: Span[] = [
  { id: "1", name: "GET /docs/field-notes-12", service: "edge", start: 0, duration: 412, attrs: { "http.status": 200, region: "me-central" } },
  { id: "2", parent: "1", name: "verify session", service: "auth", start: 4, duration: 18, attrs: { "user.plan": "team" } },
  { id: "3", parent: "1", name: "render page", service: "web", start: 26, duration: 380 },
  { id: "4", parent: "3", name: "load document", service: "api", start: 30, duration: 210, attrs: { "doc.size_kb": 182 } },
  { id: "5", parent: "4", name: "SELECT blocks", service: "postgres", start: 36, duration: 64, attrs: { rows: 312 } },
  { id: "6", parent: "4", name: "GET comments", service: "redis", start: 40, duration: 9 },
  { id: "7", parent: "4", name: "fetch attachments", service: "storage", start: 104, duration: 128, attrs: { files: 6 } },
  { id: "8", parent: "7", name: "sign URLs", service: "storage", start: 108, duration: 12 },
  { id: "9", parent: "3", name: "load collaborators", service: "api", start: 34, duration: 52 },
  { id: "10", parent: "9", name: "SELECT members", service: "postgres", start: 38, duration: 41 },
  { id: "11", parent: "3", name: "spellcheck dictionary", service: "web", start: 90, duration: 48, error: true, attrs: { error: "timeout after 45 ms" } },
  { id: "12", parent: "3", name: "server render", service: "web", start: 246, duration: 148 },
  { id: "13", parent: "12", name: "highlight code blocks", service: "web", start: 252, duration: 96 },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`min-h-full w-full px-4 py-8 ${dark ? "bg-[#0b0c0d]" : "bg-[#e8e9e6]"}`}>
      <div className="mx-auto w-full max-w-[64rem]">
        <SpanWaterfall title="trace 7f3a…c21 · Masar" spans={SPANS} theme={dark ? "dark" : "light"} />
      </div>
    </div>
  );
}
