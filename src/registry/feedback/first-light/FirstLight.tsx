"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ClipboardEvent, type DragEvent, type ReactNode } from "react";
import "./first-light.css";

/**
 * First Light
 * An empty state that is the first object, not yet filled in. A faint dashed
 * ghost sits exactly where the first project, message, tile or item will live.
 * Point at it and its dashes close up and it takes on light; activate it and it
 * becomes the real thing in place — you name the project inside the card.
 * Nothing, then possibility, then the first action, all on the same spot.
 */

type Props = {
  /** Accessible name and visible call, e.g. "Create your first project". */
  label: string;
  /** The ghost's face at rest. Receives `lit` while hovered or focused. */
  ghost: (lit: boolean) => ReactNode;
  /** Inline creation UI shown in the ghost's place. Call done() or cancel(). */
  editor?: (api: { done: () => void; cancel: () => void }) => ReactNode;
  /** Called when the ghost is activated without an editor. */
  onActivate?: () => void;
  /** Accept dropped files and pasted text/links. */
  onDropItems?: (items: { files: File[]; text: string }) => void;
  radius?: number;
  className?: string;
  theme?: "paper" | "night";
  announce?: string;
};

export function FirstLight({ label, ghost, editor, onActivate, onDropItems, radius = 16, className = "", theme = "paper", announce }: Props) {
  const [state, setState] = useState<"ghost" | "editing">("ghost");
  const [lit, setLit] = useState(false);
  const [over, setOver] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const editRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef(false);

  useLayoutEffect(() => {
    if (state === "editing") editRef.current?.querySelector<HTMLElement>("input, textarea, button")?.focus({ preventScroll: true });
    else if (returnFocus.current) {
      returnFocus.current = false;
      buttonRef.current?.focus({ preventScroll: true });
    }
  }, [state]);

  useEffect(() => {
    if (state !== "editing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && editRef.current?.contains(document.activeElement)) {
        returnFocus.current = true;
        setState("ghost");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [state]);

  const activate = () => {
    if (editor) setState("editing");
    else onActivate?.();
  };

  const drop = (e: DragEvent) => {
    if (!onDropItems) return;
    e.preventDefault();
    setOver(false);
    onDropItems({ files: Array.from(e.dataTransfer.files), text: e.dataTransfer.getData("text/plain") });
  };
  const paste = (e: ClipboardEvent) => {
    if (!onDropItems) return;
    const text = e.clipboardData.getData("text/plain");
    const files = Array.from(e.clipboardData.files);
    if (!text && !files.length) return;
    e.preventDefault();
    onDropItems({ files, text });
  };

  const on = lit || over || state === "editing";

  return (
    <div
      className={`first-light first-light--${theme} ${className}`}
      data-lit={on || undefined}
      data-state={state}
      data-over={over || undefined}
      style={{ borderRadius: radius }}
      onPointerEnter={() => setLit(true)}
      onPointerLeave={() => setLit(false)}
      onDragOver={
        onDropItems
          ? (e) => {
              e.preventDefault();
              setOver(true);
            }
          : undefined
      }
      onDragLeave={onDropItems ? () => setOver(false) : undefined}
      onDrop={drop}
    >
      <svg className="first-light__frame" aria-hidden="true">
        <rect rx={radius - 0.5} ry={radius - 0.5} />
      </svg>
      {state === "ghost" ? (
        <button
          ref={buttonRef}
          type="button"
          className="first-light__ghost"
          aria-label={label}
          onClick={activate}
          onFocus={() => setLit(true)}
          onBlur={() => setLit(false)}
          onPaste={paste}
          style={{ borderRadius: radius }}
        >
          {ghost(on)}
        </button>
      ) : (
        <div ref={editRef} className="first-light__editor">
          {editor?.({
            done: () => setState("ghost"),
            cancel: () => {
              returnFocus.current = true;
              setState("ghost");
            },
          })}
        </div>
      )}
      <span className="first-light__sr" role="status">
        {announce}
      </span>
    </div>
  );
}

/** Decorative outlines for the slots after the first — the shape of what's to come. */
export function FutureSlot({ className = "", radius = 16, theme = "paper" }: { className?: string; radius?: number; theme?: "paper" | "night" }) {
  return (
    <div className={`first-light first-light--${theme} first-light--future ${className}`} style={{ borderRadius: radius }} aria-hidden="true">
      <svg className="first-light__frame">
        <rect rx={radius - 0.5} ry={radius - 0.5} />
      </svg>
    </div>
  );
}
