"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

function legacyCopy(text: string) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}

export function CopyButton({ text, label = "Copy", className = "" }: { text: string; label?: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      // Clipboard API unavailable (insecure context, embedded webview, permissions): fall back to a hidden selection.
      setState(legacyCopy(text) ? "copied" : "error");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 1800);
  };

  const copied = state === "copied";
  return (
    <button
      type="button"
      onClick={copy}
      data-state={state}
      className={`copy-btn group relative inline-flex h-8 items-center gap-2 overflow-hidden rounded-md border px-2.5 text-[0.75rem] font-medium transition-[border-color,background-color,color] duration-300 ${
        copied ? "border-frost/40 bg-frost/10 text-frost" : "border-line-strong text-ink-2 hover:border-frost/30 hover:text-cream"
      } ${className}`}
    >
      <span className="relative grid size-3.5 place-items-center">
        <CopyIcon className={`absolute size-3.5 transition-[opacity,transform] duration-300 ${copied ? "scale-50 opacity-0" : "opacity-100"}`} />
        <CheckIcon className={`copy-btn__tick absolute size-3.5 ${copied ? "is-on" : ""}`} strokeWidth={2} />
      </span>
      <span className="relative">
        <span className={`block transition-[opacity,transform] duration-300 ${copied || state === "error" ? "-translate-y-3 opacity-0" : ""}`}>{label}</span>
        <span className={`absolute inset-0 block transition-[opacity,transform] duration-300 ${copied ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>Copied</span>
        <span className={`absolute inset-0 block whitespace-nowrap transition-opacity duration-300 ${state === "error" ? "opacity-100" : "opacity-0"}`}>Press ⌘C</span>
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : state === "error" ? "Copy failed" : ""}
      </span>
    </button>
  );
}
