"use client";

import { rovingFocus } from "./rovingFocus";

import { useId, useState } from "react";
import type { SourceFile, SourceFileName } from "@/lib/source";
import { CopyButton } from "./CopyButton";

/**
 * File tabs come from the page; the code arrives later. The tabs work while it loads, so the chosen
 * file stays chosen through a slow or failed request and a retry.
 */
export function CodeViewer({
  files,
  source,
  failed = false,
  onRetry,
  className = "",
}: {
  files: SourceFileName[];
  source?: SourceFile[];
  /** retry: the request failed and may work again. reload: this page's source no longer exists. */
  failed?: false | "retry" | "reload";
  onRetry?: () => void;
  className?: string;
}) {
  const id = useId();
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const name = files[active].name;
  const file = source?.find((f) => f.name === name);
  const lines = file ? file.code.split("\n").length : 0;
  const long = lines > 36;

  return (
    <div className={`overflow-hidden rounded-[14px] border border-line bg-[#100b12] ${className}`}>
      <div className="flex items-center gap-2 border-b border-line pl-2 pr-2">
        <div role="tablist" onKeyDown={rovingFocus} aria-label="Files" className="-mb-px flex min-w-0 flex-1 overflow-x-auto">
          {files.map((f, i) => (
            <button
              key={f.name}
              role="tab"
              type="button"
              id={`${id}-${i}`}
              aria-controls={`${id}-panel`}
              tabIndex={i === active ? 0 : -1}
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
        {file && <CopyButton text={file.code} />}
      </div>
      <div className="relative">
        {file ? (
          <div
            id={`${id}-panel`}
            aria-labelledby={`${id}-${active}`}
            role="tabpanel"
            tabIndex={0}
            aria-label={file.name}
            className={`code-surface overflow-auto ${long && !expanded ? "max-h-[34rem]" : ""}`}
            dangerouslySetInnerHTML={{ __html: file.html }}
          />
        ) : (
          <div id={`${id}-panel`} aria-labelledby={`${id}-${active}`} role="tabpanel" className="grid min-h-[20rem] place-items-center p-6 text-center">
            {failed ? (
              <div role="alert">
                <p className="text-[0.875rem] text-ink-2">
                  {failed === "reload" ? "This component has been updated since the page opened. Reload to see the current source." : "The source didn’t load."}
                </p>
                <button
                  type="button"
                  onClick={failed === "reload" ? () => location.reload() : onRetry}
                  className="mt-4 rounded-md border border-line-strong bg-plum-950 px-3 py-1.5 font-mono text-[0.75rem] text-ink-2 transition-colors hover:text-cream"
                >
                  {failed === "reload" ? "Reload page" : "Try again"}
                </button>
              </div>
            ) : (
              <p role="status" className="font-mono text-[0.75rem] text-ink-3">
                Loading source…
              </p>
            )}
          </div>
        )}
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
