"use client";

import { useRef, useState } from "react";
import { ShortcutPalette, type Command } from "./ShortcutPalette";

const COMMANDS: Command[] = [
  { id: "deploys", label: "Go to deploys", group: "Navigate", keys: ["G", "D"], keywords: "releases history" },
  { id: "settings", label: "Go to project settings", group: "Navigate", keys: ["G", "S"], keywords: "config environment" },
  { id: "logs", label: "Open build logs", group: "Navigate", keys: ["G", "L"] },
  { id: "deploy", label: "Deploy to production", group: "Act", keys: ["⇧", "⌘", "D"], keywords: "ship release promote" },
  { id: "rollback", label: "Roll back the last deploy", group: "Act", keys: ["⇧", "⌘", "Z"], keywords: "revert undo" },
  { id: "preview", label: "Create a preview from a branch", group: "Act", keywords: "pull request" },
  { id: "copy", label: "Copy the preview link", group: "Act", keys: ["⌘", "L"], keywords: "share url" },
  { id: "workspace", label: "Switch workspace", group: "Account", keywords: "team organisation" },
  { id: "signout", label: "Sign out", group: "Account", keywords: "log out" },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const scope = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState("");
  const muted = night ? "text-[#8d8f95]" : "text-[#6b6861]";
  return (
    <div
      ref={scope}
      tabIndex={-1}
      className={`relative h-full min-h-[520px] w-full overflow-hidden outline-none ${night ? "bg-[#0f1012] text-[#ececea]" : "bg-[#f6f5f1] text-[#1b1a17]"}`}
    >
      <header className={`flex h-14 items-center gap-6 border-b px-6 text-[0.875rem] ${night ? "border-white/[0.09]" : "border-black/[0.09]"}`}>
        <span className="font-semibold tracking-[-0.01em]">Relay</span>
        <span className={`hidden sm:inline ${muted}`}>Masar / production</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`ml-auto flex h-9 items-center gap-3 whitespace-nowrap rounded-lg px-3 text-[0.8125rem] ring-1 ${night ? "text-[#9a9ca2] ring-white/15 hover:bg-white/[0.05]" : "text-[#6b6861] ring-black/15 hover:bg-black/[0.04]"}`}
        >
          Run a command
          <kbd className="font-[family-name:Geist_Mono] text-[0.6875rem]">⌘K</kbd>
        </button>
      </header>
      <main className="mx-auto max-w-[40rem] px-6 pt-14">
        <p className={`font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] ${muted}`}>Deploys</p>
        <h1 className="mt-3 font-[family-name:Instrument_Serif] text-[2.75rem] leading-none tracking-[-0.02em]">Everything is green</h1>
        <p className={`mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed ${muted}`}>
          Click here, then press ⌘K (or Ctrl K). Type “rol” or “ship”, press Enter, and read what the line at the bottom tells you.
        </p>
        <p className={`mt-6 min-h-5 font-[family-name:Geist_Mono] text-[0.75rem] ${muted}`} role="status">{last}</p>
      </main>
      <ShortcutPalette
        contained
        theme={night ? "night" : "paper"}
        commands={COMMANDS}
        open={open}
        onOpenChange={setOpen}
        onRun={(c) => setLast(`Ran: ${c.label} (demo, nothing changed)`)}
        hotkeyScope={scope}
      />
    </div>
  );
}
