"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import "./toast-stack.css";

/**
 * Toast Stack
 * Notifications that stack like a hand of cards. The newest sits in front; older
 * ones recede behind it, scaled and offset. Hover or focus the stack and it fans
 * out into a readable list and pauses every timer. Each toast has a countdown
 * hairline, and the region is announced politely to screen readers.
 */

type Kind = "info" | "success" | "error";
export type ToastInput = { title: string; body?: string; kind?: Kind; duration?: number };
type Toast = Required<Pick<ToastInput, "title" | "kind" | "duration">> & { id: number; body?: string; leaving?: boolean };

const Ctx = createContext<{ push: (t: ToastInput) => void }>({ push: () => {} });
export const useToast = () => useContext(Ctx);

const MAX = 4;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const [open, setOpen] = useState(false);
  const id = useRef(0);

  const dismiss = useCallback((tid: number) => {
    setItems((a) => a.map((t) => (t.id === tid ? { ...t, leaving: true } : t)));
    setTimeout(() => setItems((a) => a.filter((t) => t.id !== tid)), 320);
  }, []);

  const push = useCallback((t: ToastInput) => {
    setItems((a) => [{ id: ++id.current, title: t.title, body: t.body, kind: t.kind ?? "info", duration: t.duration ?? 5000 }, ...a].slice(0, MAX + 2));
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <section
        className="ts"
        data-open={open || undefined}
        aria-label="Notifications"
        aria-live="polite"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
      >
        {items.map((t, i) => (
          <ToastCard key={t.id} toast={t} index={i} paused={open} onDone={() => dismiss(t.id)} />
        ))}
      </section>
    </Ctx.Provider>
  );
}

function ToastCard({ toast, index, paused, onDone }: { toast: Toast; index: number; paused: boolean; onDone: () => void }) {
  const [left, setLeft] = useState(toast.duration);
  useEffect(() => {
    if (paused || toast.leaving || index >= MAX) return;
    const start = performance.now();
    const from = left;
    let raf = 0;
    const tick = (now: number) => {
      const rem = from - (now - start);
      setLeft(rem);
      if (rem <= 0) return onDone();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, toast.leaving, index >= MAX]);

  return (
    <div
      className={`ts__toast ts__toast--${toast.kind}`}
      data-leaving={toast.leaving || undefined}
      data-hidden={index >= MAX || undefined}
      style={{ ["--i" as string]: index }}
      role={toast.kind === "error" ? "alert" : "status"}
    >
      <span className="ts__icon" aria-hidden="true">{toast.kind === "success" ? "✓" : toast.kind === "error" ? "!" : "i"}</span>
      <div className="ts__text">
        <p className="ts__title">{toast.title}</p>
        {toast.body && <p className="ts__body">{toast.body}</p>}
      </div>
      <button type="button" className="ts__close" onClick={onDone} aria-label={`Dismiss: ${toast.title}`}>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" /></svg>
      </button>
      <span className="ts__timer" aria-hidden="true" style={{ transform: `scaleX(${Math.max(0, left / toast.duration)})` }} />
    </div>
  );
}
