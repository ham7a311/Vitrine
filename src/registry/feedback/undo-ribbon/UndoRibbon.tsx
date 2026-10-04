"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import "./undo-ribbon.css";

/**
 * Undo Ribbon
 * Feedback that stays where the action happened. A removed row collapses into
 * a thin ribbon in its own place — no toast in a corner — and a hairline along
 * the ribbon drains toward the Undo button: the time left runs out into the
 * one control that can save it. When it runs out the ribbon closes the gap;
 * undo, and it grows back into the row.
 */

export type UndoKind = "delete" | "archive" | "done";
export type Pending = { kind: UndoKind; message: ReactNode; announce: string; at: number };

const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ─── State ─────────────────────────────────────────────────────────── */

export function useUndoable<T extends { id: string }>(initial: T[], opts: { onCommit?: (item: T, kind: UndoKind) => void } = {}) {
  const [items, setItems] = useState(initial);
  const [pending, setPending] = useState<Record<string, Pending>>({});
  const onCommit = useRef(opts.onCommit);
  onCommit.current = opts.onCommit;

  const remove = useCallback((id: string, kind: UndoKind, message: ReactNode, announce: string) => {
    setPending((p) => ({ ...p, [id]: { kind, message, announce, at: Date.now() } }));
  }, []);

  const undo = useCallback((id: string) => {
    setPending(({ [id]: _, ...rest }) => rest);
  }, []);

  const pendingRef = useRef(pending);
  pendingRef.current = pending;
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const commit = useCallback((id: string) => {
    const entry = pendingRef.current[id];
    const item = itemsRef.current.find((x) => x.id === id);
    if (entry && item) onCommit.current?.(item, entry.kind);
    setItems((list) => list.filter((x) => x.id !== id));
    setPending(({ [id]: _, ...rest }) => rest);
  }, []);

  /** ⌘Z / Ctrl+Z anywhere inside the scope undoes the most recent removal. */
  const scopeProps = {
    "data-undo-scope": "",
    tabIndex: -1,
    onKeyDown: (e: ReactKeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === "z") {
        const latest = Object.entries(pendingRef.current).sort((a, b) => b[1].at - a[1].at)[0];
        if (!latest) return;
        e.preventDefault();
        undo(latest[0]);
      }
    },
  } as const;

  return { items, setItems, pending, remove, undo, commit, scopeProps };
}

/* ─── The ribbon itself ─────────────────────────────────────────────── */

type RibbonProps = {
  kind?: UndoKind;
  message: ReactNode;
  /** Screen-reader sentence, e.g. "Deleted Q3 roadmap." */
  announce: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
  onTimeout: () => void;
  /** Move focus to the action on mount (after a keyboard or pointer action removed the focused row). */
  takeFocus?: boolean;
  theme?: "paper" | "night";
};

export function UndoRibbon({ kind = "delete", message, announce, actionLabel = "Undo", onAction, duration = 6000, onTimeout, takeFocus, theme = "paper" }: RibbonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const actionRef = useRef<HTMLButtonElement>(null);
  const anim = useRef<Animation | null>(null);
  const holds = useRef(new Set<string>());
  const [left, setLeft] = useState(Math.ceil(duration / 1000));
  const timeout = useRef(onTimeout);
  timeout.current = onTimeout;

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    const a = line.animate([{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }], { duration, easing: "linear", fill: "forwards" });
    anim.current = a;
    let done = false;
    a.finished.then(
      () => {
        done = true;
        timeout.current();
      },
      () => {},
    );
    // A stepped, text-only countdown for anyone who has asked for less motion.
    const tick = window.setInterval(() => {
      const t = Number(a.currentTime ?? 0);
      setLeft(Math.max(0, Math.ceil((duration - t) / 1000)));
    }, 250);
    const onVis = () => (document.hidden ? hold("hidden") : release("hidden"));
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(tick);
      document.removeEventListener("visibilitychange", onVis);
      if (!done) a.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  useLayoutEffect(() => {
    if (takeFocus) actionRef.current?.focus({ preventScroll: true });
  }, [takeFocus]);

  const hold = (why: string) => {
    holds.current.add(why);
    anim.current?.pause();
  };
  const release = (why: string) => {
    holds.current.delete(why);
    if (!holds.current.size && anim.current?.playState === "paused") anim.current.play();
  };

  return (
    <div
      ref={ref}
      className={`undo-ribbon undo-ribbon--${theme}`}
      data-kind={kind}
      onPointerEnter={() => hold("pointer")}
      onPointerLeave={() => release("pointer")}
      onFocus={(e) => {
        // Only keyboard focus holds the timer; a pointer-driven focus would freeze it forever.
        if ((e.target as HTMLElement).matches(":focus-visible")) hold("focus");
      }}
      onBlur={() => release("focus")}
    >
      <span className="undo-ribbon__glyph" aria-hidden="true">
        {kind === "archive" ? (
          <svg viewBox="0 0 16 16">
            <path d="M2.5 3.5h11v3h-11zM3.5 6.5v6h9v-6M6.5 9h3" />
          </svg>
        ) : kind === "done" ? (
          <svg viewBox="0 0 16 16">
            <path d="M3.5 8.5l3 3 6-7" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16">
            <path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5" />
          </svg>
        )}
      </span>
      <span className="undo-ribbon__message">{message}</span>
      <span className="undo-ribbon__count" aria-hidden="true">
        {left}s
      </span>
      {onAction && (
        <button ref={actionRef} type="button" className="undo-ribbon__action" onClick={onAction}>
          {actionLabel}
          <kbd aria-hidden="true">⌘Z</kbd>
        </button>
      )}
      <span className="undo-ribbon__line" aria-hidden="true">
        <span ref={lineRef} />
      </span>
      <span className="undo-ribbon__sr" role="status">
        {announce} {onAction ? `${actionLabel} available for ${Math.ceil(duration / 1000)} seconds.` : ""}
      </span>
    </div>
  );
}

/* ─── A slot: row ⇄ ribbon, in place ────────────────────────────────── */

type SlotProps = {
  pending?: Pending | null;
  children: ReactNode;
  onUndo: () => void;
  onExpire: () => void;
  duration?: number;
  theme?: "paper" | "night";
  className?: string;
};

export function UndoSlot({ pending, children, onUndo, onExpire, duration = 6000, theme = "paper", className = "" }: SlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rowHeight = useRef(0);
  const was = useRef<Pending | null | undefined>(pending);
  const hadFocus = useRef(false);
  const [leaving, setLeaving] = useState(false);

  // Remember whether focus was in the row at the moment it turned into a ribbon.
  const captureFocus = () => {
    hadFocus.current = !!ref.current?.contains(document.activeElement);
  };
  if (pending && !was.current && typeof document !== "undefined") captureFocus();
  // Undoing from the ribbon hands focus back to the restored row.
  const refocus = useRef(false);
  if (!pending && was.current && typeof document !== "undefined") refocus.current = !!ref.current?.contains(document.activeElement);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const before = was.current;
    was.current = pending;
    const reduced = reducedMotion();
    if (!before && pending && rowHeight.current && !reduced) {
      el.animate([{ height: `${rowHeight.current}px` }, { height: `${el.offsetHeight}px` }], { duration: 340, easing: EASE });
    } else if (before && !pending && !reduced) {
      const to = el.offsetHeight;
      el.animate([{ height: `${el.dataset.ribbonH ?? 52}px` }, { height: `${to}px` }], { duration: 360, easing: EASE });
      el.firstElementChild?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, delay: 90, easing: "ease", fill: "backwards" });
    }
    if (before && !pending && refocus.current) {
      refocus.current = false;
      el.querySelector<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])')?.focus({ preventScroll: true });
    }
    if (pending) el.dataset.ribbonH = String(el.offsetHeight);
    else rowHeight.current = el.offsetHeight;
  });

  const expire = () => {
    const el = ref.current;
    if (!el) return onExpire();
    // If the ribbon held focus, hand it to the list rather than losing it to <body>.
    if (el.contains(document.activeElement)) (el.closest<HTMLElement>("[data-undo-scope]") ?? document.body).focus({ preventScroll: true });
    setLeaving(true);
    if (reducedMotion()) return onExpire();
    const a = el.animate([{ height: `${el.offsetHeight}px`, opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 300, easing: EASE, fill: "forwards" });
    a.onfinish = onExpire;
  };

  return (
    <div ref={ref} className={`undo-slot ${className}`} data-state={pending ? (leaving ? "leaving" : "ribbon") : "row"}>
      {pending ? (
        <UndoRibbon
          key={pending.at}
          kind={pending.kind}
          message={pending.message}
          announce={pending.announce}
          onAction={onUndo}
          duration={duration}
          onTimeout={expire}
          takeFocus={hadFocus.current}
          theme={theme}
        />
      ) : (
        <div className="undo-slot__row">
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── Inserted ribbon: feedback that unrolls under the control that caused it ── */

export function UndoInsert({
  open,
  onDone,
  ...ribbon
}: Omit<RibbonProps, "onTimeout"> & { open: boolean; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !open || reducedMotion()) return;
    el.animate([{ height: "0px", opacity: 0 }, { height: `${el.offsetHeight}px`, opacity: 1 }], { duration: 320, easing: EASE });
  }, [open]);
  if (!open) return null;
  const finish = () => {
    const el = ref.current;
    if (!el || reducedMotion()) return onDone();
    if (el.contains(document.activeElement)) (el.closest<HTMLElement>("[data-undo-scope]") ?? document.body).focus({ preventScroll: true });
    const a = el.animate([{ height: `${el.offsetHeight}px`, opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 280, easing: EASE, fill: "forwards" });
    a.onfinish = onDone;
  };
  return (
    <div ref={ref} className="undo-slot undo-slot--insert" data-state="ribbon">
      <UndoRibbon
        {...ribbon}
        onTimeout={finish}
        onAction={
          ribbon.onAction
            ? () => {
                ribbon.onAction?.();
                finish();
              }
            : undefined
        }
      />
    </div>
  );
}
