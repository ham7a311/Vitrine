"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ContextLens, type LensAction } from "./ContextLens";

type File = { name: string; kind: string; tone: string; glyph: string; modified: string; size: string; shared: string; locked?: boolean };

const FILES: File[] = [
  { name: "Vitrine — pitch deck.key", kind: "Keynote", tone: "#d97706", glyph: "K", modified: "Today, 09:42", size: "18.4 MB", shared: "3 people" },
  { name: "Q3 roadmap.pdf", kind: "PDF", tone: "#dc2626", glyph: "P", modified: "Yesterday", size: "2.1 MB", shared: "GUtech Studio" },
  { name: "thesis-draft-v4.docx", kind: "Document", tone: "#2563eb", glyph: "W", modified: "28 Sep", size: "846 KB", shared: "Only you" },
  { name: "campus-wayfinding.fig", kind: "Design", tone: "#7c3aed", glyph: "F", modified: "24 Sep", size: "31.7 MB", shared: "5 people" },
  { name: "budget-2026.xlsx", kind: "Spreadsheet", tone: "#16a34a", glyph: "X", modified: "19 Sep", size: "412 KB", shared: "Finance team" },
  { name: "deploy-vitrine.log", kind: "Log file", tone: "#57534e", glyph: "L", modified: "12 Sep", size: "96 KB", shared: "Read-only", locked: true },
];

const I = (d: string): ReactNode => (
  <svg viewBox="0 0 16 16">
    <path d={d} />
  </svg>
);
const ICONS = {
  open: I("M6 3H3.5v9.5H13V10M9 3h4v4M13 3L7.5 8.5"),
  rename: I("M9.5 3.5l3 3L6 13H3v-3zM8 5l3 3"),
  share: I("M8 2.5v8M5 5.5l3-3 3 3M3.5 9v3.5h9V9"),
  move: I("M2.5 5V12.5h11V6.5H8L6.5 4.5h-4zM7 9.5h4M9.5 8l1.5 1.5L9.5 11"),
  copy: I("M5.5 5.5h7v7h-7zM3.5 10.5v-7h7"),
  trash: I("M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5"),
};

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const theme = night ? "night" : "paper";
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!status) return;
    const t = window.setTimeout(() => setStatus(null), 2600);
    return () => window.clearTimeout(t);
  }, [status]);

  const c = night
    ? { page: "bg-[#111214] text-[#ececea]", muted: "text-[#8b8d93]", list: "divide-white/[0.06]", row: "hover:bg-white/[0.035] focus-visible:bg-white/[0.05]", more: "hover:bg-white/[0.08] text-[#8b8d93]" }
    : { page: "bg-[#f5f4f0] text-[#1b1a17]", muted: "text-[#77736b]", list: "divide-black/[0.06]", row: "hover:bg-black/[0.03] focus-visible:bg-black/[0.04]", more: "hover:bg-black/[0.06] text-[#77736b]" };

  const actionsFor = (f: File): LensAction[] => [
    { id: "open", label: "Open", shortcut: "↵", icon: ICONS.open, onSelect: () => setStatus(`Opening ${f.name}`) },
    { id: "rename", label: "Rename", shortcut: "R", icon: ICONS.rename, disabled: f.locked, onSelect: () => setStatus(`Rename ${f.name}`) },
    { id: "share", label: "Share…", shortcut: "⇧S", icon: ICONS.share, disabled: f.locked, onSelect: () => setStatus(`Sharing ${f.name}`) },
    { id: "move", label: "Move to…", shortcut: "M", icon: ICONS.move, onSelect: () => setStatus(`Move ${f.name}`) },
    { id: "dup", label: "Duplicate", shortcut: "⌘D", icon: ICONS.copy, onSelect: () => setStatus(`Duplicated ${f.name}`) },
    { id: "delete", label: "Delete", shortcut: "⌫", icon: ICONS.trash, danger: true, disabled: f.locked, onSelect: () => setStatus(`Moved ${f.name} to Trash`) },
  ];

  return (
    <div className={`flex h-full min-h-[560px] w-full justify-center overflow-auto px-4 py-8 ${c.page}`} style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <div className="w-full max-w-[640px]">
        <div className="flex items-baseline gap-3 px-2">
          <h1 className="text-[20px] font-semibold tracking-[-0.02em]">Vitrine</h1>
          <span className={`text-[13px] ${c.muted}`}>6 files</span>
          <span className={`ml-auto hidden text-[12px] sm:inline ${c.muted}`}>Right-click a file, or press ⇧F10</span>
        </div>

        <ul className={`mt-4 flex flex-col gap-0.5`} aria-label="Files in Vitrine">
          {FILES.map((f) => (
            <li key={f.name}>
              <ContextLens
                label={f.name}
                theme={theme}
                meta={[
                  { label: "Owner", value: "Hamza Al-Bulushi" },
                  { label: "Modified", value: f.modified },
                  { label: "Size", value: f.size },
                  { label: "Shared with", value: f.shared },
                ]}
                actions={actionsFor(f)}
              >
                {({ rowProps, buttonProps, open }) => (
                  <div
                    {...rowProps}
                    tabIndex={0}
                    role="button"
                    aria-roledescription="file"
                    onKeyDown={(e) => {
                      rowProps.onKeyDown(e);
                      if (e.key === "Enter" && e.target === e.currentTarget) setStatus(`Opening ${f.name}`);
                    }}
                    aria-label={`${f.name}, ${f.kind}, modified ${f.modified}`}
                    onDoubleClick={() => setStatus(`Opening ${f.name}`)}
                    className={`group flex items-center gap-3 rounded-[10px] px-2.5 py-2 outline-none transition-colors ${c.row}`}
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg text-[12px] font-semibold text-white" style={{ background: f.tone }} aria-hidden="true">
                      {f.glyph}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-medium">{f.name}</span>
                      <span className={`block truncate text-[12px] ${c.muted}`}>
                        {f.kind} · {f.size}
                      </span>
                    </span>
                    <span className={`hidden w-24 shrink-0 text-right text-[12px] tabular-nums sm:block ${c.muted}`}>{f.modified}</span>
                    <button
                      {...buttonProps}
                      className={`grid size-8 shrink-0 place-items-center rounded-lg transition-[opacity,background] focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 ${c.more} ${
                        open ? "opacity-100" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                      }`}
                    >
                      <svg viewBox="0 0 16 16" className="size-4 fill-current" aria-hidden="true">
                        <circle cx="3.5" cy="8" r="1.3" />
                        <circle cx="8" cy="8" r="1.3" />
                        <circle cx="12.5" cy="8" r="1.3" />
                      </svg>
                    </button>
                  </div>
                )}
              </ContextLens>
            </li>
          ))}
        </ul>

        <p role="status" className={`mt-4 h-5 px-2 text-[12.5px] transition-opacity ${c.muted} ${status ? "opacity-100" : "opacity-0"}`}>
          {status}
        </p>
      </div>
    </div>
  );
}
