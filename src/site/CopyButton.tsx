"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

function legacyCopy(text: string) {
  const previous = document.activeElement as HTMLElement | null;
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
  document.body.appendChild(ta); ta.select();
  let ok = false;
  try { ok = document.execCommand("copy"); } catch { /* manual fallback below */ }
  ta.remove(); previous?.focus({ preventScroll: true });
  return ok;
}

export function CopyButton({ text, label = "Copy", className = "" }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const id = useId();
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; }
    catch { ok = legacyCopy(text); }
    clearTimeout(timer.current);
    if (ok) { setCopied(true); timer.current = setTimeout(() => setCopied(false), 1800); }
    else { dialog.current?.showModal(); field.current?.focus(); field.current?.select(); }
  };
  return <>
    <button type="button" onClick={copy} data-state={copied ? "copied" : "idle"} className={`copy-btn inline-flex h-8 items-center gap-2 rounded-md border border-line-strong px-2.5 text-xs font-medium text-ink-2 hover:text-cream ${className}`}>
      {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
      <span>{copied ? "Copied" : label}</span>
      <span className="sr-only" aria-live="polite">{copied ? "Copied to clipboard" : ""}</span>
    </button>
    <dialog ref={dialog} aria-labelledby={`${id}-title`} onClick={(e) => { if (e.target === dialog.current) dialog.current.close(); }} className="m-auto w-[min(40rem,calc(100vw-2rem))] rounded-xl border border-line-strong bg-plum-950 p-5 text-cream backdrop:bg-void/80">
      <h2 id={`${id}-title`} className="text-lg">Copy this text</h2>
      <p className="my-3 text-sm text-ink-2">Automatic copying is unavailable. Copy the selected text using your device’s copy command.</p>
      <textarea ref={field} aria-label="Text to copy" readOnly value={text} onFocus={(e) => e.currentTarget.select()} className="h-64 w-full rounded-md border border-line bg-void p-3 font-mono text-xs" />
      <button type="button" onClick={() => dialog.current?.close()} className="mt-3 rounded-md border border-line-strong px-4 py-2">Close</button>
    </dialog>
  </>;
}
