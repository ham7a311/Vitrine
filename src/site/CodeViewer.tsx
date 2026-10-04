"use client";

import { useState } from "react";
import type { SourceFile } from "@/lib/source";
import { CopyButton } from "./CopyButton";

export function CodeViewer({ files, className = "" }: { files: SourceFile[]; className?: string }) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const file = files[active];
  const lines = file.code.split("\n").length;
  const long = lines > 36;

  return (
    <div className={`overflow-hidden rounded-[14px] border border-line bg-[#100b12] ${className}`}>
      <div className="flex items-center gap-2 border-b border-line pl-2 pr-2">
        <div role="tablist" aria-label="Files" className="-mb-px flex min-w-0 flex-1 overflow-x-auto">
          {files.map((f, i) => (
            <button
              key={f.name}
              role="tab"
              type="button"
              aria-selected={i === active}
              onClick={() => {
                setActive(i);
                setExpanded(false);
              }}
              className={`relative shrink-0 px-3 py-3.5 font-mono text-[0.75rem] transition-colors ${
                i === active ? "text-cream" : "text-ink-3 hover:text-ink-2"
              }`}
            >
              {f.name}
              {f.role === "usage" && <span className="ml-2 text-[0.625rem] uppercase tracking-[0.12em] text-ink-3">demo</span>}
              <span className={`absolute inset-x-3 bottom-0 h-px bg-frost transition-opacity ${i === active ? "opacity-100" : "opacity-0"}`} />
            </button>
          ))}
        </div>
        <CopyButton text={file.code} />
      </div>
      <div className="relative">
        <div
          role="tabpanel"
          tabIndex={0}
          aria-label={file.name}
          className={`code-surface overflow-auto ${long && !expanded ? "max-h-[34rem]" : ""}`}
          dangerouslySetInnerHTML={{ __html: file.html }}
        />
        {long && (
          <div className={`flex justify-center ${expanded ? "border-t border-line py-3" : "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#100b12] via-[#100b12]/85 to-transparent pb-4 pt-16"}`}>
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="pointer-events-auto rounded-md border border-line-strong bg-plum-950 px-3 py-1.5 font-mono text-[0.6875rem] text-ink-2 hover:text-cream"
            >
              {expanded ? "Collapse" : `Show all ${lines} lines`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
