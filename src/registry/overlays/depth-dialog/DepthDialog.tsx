"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import "./depth-dialog.css";

/**
 * Depth Dialog
 * Three planes instead of a dim overlay. The page steps back, the object the
 * decision is about lifts out of it (a surface flies from its row and docks
 * behind the dialog), and the decision sits in front. Cancel sends the object
 * home; confirm takes it away with the dialog.
 */

export type CloseReason = "cancel" | "confirm" | "escape" | "backdrop";

type Props = {
  open: boolean;
  onClose: (reason: CloseReason) => void;
  title: string;
  description?: ReactNode;
  /** Extra body content: a confirmation field, a choice list. */
  children?: ReactNode;
  /** The object the decision is about, shown as a card docked behind the dialog. */
  context?: ReactNode;
  /** The element the context lifts out of. Focus returns here on close. */
  anchorRef?: RefObject<HTMLElement | null>;
  /** The page behind the dialog. It recedes and is made inert while open. */
  stageRef?: RefObject<HTMLElement | null>;
  tone?: "default" | "danger";
  confirmLabel?: string;
  busyLabel?: string;
  cancelLabel?: string;
  /** May return a promise; the dialog shows its busy state until it settles. */
  onConfirm?: () => void | Promise<void>;
  confirmDisabled?: boolean;
  /** Allow Escape and backdrop clicks to close. */
  dismissible?: boolean;
  /** Position inside the nearest positioned ancestor instead of the viewport. */
  contained?: boolean;
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
};

type Phase = "closed" | "open" | "closing";

const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function prefersReduced(motion: Props["motion"]) {
  if (motion === "reduced") return true;
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function DepthDialog({
  open,
  onClose,
  title,
  description,
  children,
  context,
  anchorRef,
  stageRef,
  tone = "default",
  confirmLabel = "Confirm",
  busyLabel,
  cancelLabel = "Cancel",
  onConfirm,
  confirmDisabled = false,
  dismissible = true,
  contained = false,
  theme = "paper",
  motion = "auto",
}: Props) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [busy, setBusy] = useState(false);
  const phaseRef = useRef<Phase>("closed");
  const reasonRef = useRef<CloseReason>("cancel");
  const fromRect = useRef<DOMRect | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();

  phaseRef.current = phase;

  // Mark the stage once so its transition exists before the first open.
  useEffect(() => {
    const stage = stageRef?.current;
    if (!stage) return;
    stage.setAttribute("data-depth-stage", "");
    if (motion === "reduced") stage.setAttribute("data-depth-motion", "reduced");
    return () => stage.removeAttribute("data-depth-stage");
  }, [stageRef, motion]);

  // The open prop drives the phase; closing waits for its animation.
  useEffect(() => {
    if (open && phaseRef.current !== "open") {
      restoreRef.current = (anchorRef?.current?.querySelector<HTMLElement>(FOCUSABLE) ?? (document.activeElement as HTMLElement)) || null;
      if (document.activeElement instanceof HTMLElement && anchorRef?.current?.contains(document.activeElement)) restoreRef.current = document.activeElement;
      fromRect.current = anchorRef?.current?.getBoundingClientRect() ?? null;
      reasonRef.current = "cancel";
      setBusy(false);
      setPhase("open");
    } else if (!open && phaseRef.current === "open") {
      setPhase("closing");
    }
  }, [open, anchorRef]);

  /** Where a viewport rect sits inside the dialog root, corrected for any scale on the way up. */
  const local = (r: DOMRect) => {
    const root = rootRef.current!;
    const rr = root.getBoundingClientRect();
    const k = root.offsetWidth / (rr.width || 1);
    return { x: (r.left - rr.left) * k, y: (r.top - rr.top) * k, w: r.width * k, h: r.height * k };
  };

  const fly = (from: DOMRect, to: DOMRect, duration: number, fade: "in" | "out") => {
    const ghost = ghostRef.current;
    if (!ghost) return null;
    const a = local(from);
    const b = local(to);
    return ghost.animate(
      [
        { transform: `translate(${a.x}px, ${a.y}px)`, width: `${a.w}px`, height: `${a.h}px`, opacity: fade === "in" ? 0.6 : 1 },
        { transform: `translate(${b.x}px, ${b.y}px)`, width: `${b.w}px`, height: `${b.h}px`, opacity: 1 },
      ],
      { duration, easing: EASE, fill: "forwards" },
    );
  };

  // Opening: recede the stage, lift the anchor, fly its surface to the dock.
  useLayoutEffect(() => {
    if (phase !== "open") return;
    const reduced = prefersReduced(motion);
    const stage = stageRef?.current;
    const anchor = anchorRef?.current;
    stage?.setAttribute("data-depth", "open");
    stage?.setAttribute("inert", "");
    anchor?.setAttribute("data-depth-lifted", "");

    const chip = chipRef.current;
    if (chip && fromRect.current && !reduced) {
      chip.setAttribute("data-docking", "");
      const anim = fly(fromRect.current, chip.getBoundingClientRect(), 460, "in");
      if (anim) anim.onfinish = () => chip.removeAttribute("data-docking");
    }

    const first = frameRef.current?.querySelector<HTMLElement>("[data-autofocus]") ?? cancelRef.current;
    first?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Closing: restore the stage, send the surface home on cancel, then unmount.
  useLayoutEffect(() => {
    if (phase !== "closing") return;
    const reduced = prefersReduced(motion);
    const stage = stageRef?.current;
    const anchor = anchorRef?.current;
    const reason = reasonRef.current;
    stage?.removeAttribute("data-depth");
    stage?.removeAttribute("inert");

    let duration = reduced ? 140 : 260;
    const chip = chipRef.current;
    if (!reduced && reason !== "confirm" && chip && fromRect.current && anchor) {
      chip.setAttribute("data-docking", "");
      fly(chip.getBoundingClientRect(), fromRect.current, 400, "out");
      duration = 420;
    }
    const t = window.setTimeout(() => {
      anchor?.removeAttribute("data-depth-lifted");
      setPhase("closed");
      const target = restoreRef.current;
      if (target && target.isConnected) target.focus({ preventScroll: true });
    }, duration);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Clean up attributes if unmounted mid-flight.
  useEffect(
    () => () => {
      stageRef?.current?.removeAttribute("data-depth");
      stageRef?.current?.removeAttribute("inert");
      anchorRef?.current?.removeAttribute("data-depth-lifted");
    },
    [stageRef, anchorRef],
  );

  const requestClose = (reason: CloseReason) => {
    if (phaseRef.current !== "open") return;
    if (busy && reason !== "confirm") return;
    reasonRef.current = reason;
    onClose(reason);
  };

  // Escape and focus containment work even when focus has wandered to the scrim.
  useEffect(() => {
    if (phase !== "open") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissible) {
        e.preventDefault();
        requestClose("escape");
      }
    };
    const onFocusIn = (e: FocusEvent) => {
      const frame = frameRef.current;
      if (frame && e.target instanceof Node && !frame.contains(e.target)) {
        frame.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocusIn);
    };
  });

  const trapTab = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !frameRef.current) return;
    const items = Array.from(frameRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const confirm = async () => {
    if (confirmDisabled || busy) return;
    try {
      const result = onConfirm?.();
      if (result instanceof Promise) {
        setBusy(true);
        await result;
      }
      reasonRef.current = "confirm";
      onClose("confirm");
    } finally {
      setBusy(false);
    }
  };

  if (phase === "closed") return null;

  const reduced = motion === "reduced";
  const node = (
    <div
      ref={rootRef}
      className={`depth-dialog depth-dialog--${theme}${contained ? " depth-dialog--contained" : ""}`}
      data-phase={phase}
      data-reason={phase === "closing" ? reasonRef.current : undefined}
      data-motion={reduced ? "reduced" : undefined}
    >
      <div className="depth-dialog__scrim" aria-hidden="true" onPointerDown={() => dismissible && requestClose("backdrop")} />
      <div ref={ghostRef} className="depth-dialog__ghost" aria-hidden="true" />
      <div
        ref={frameRef}
        className="depth-dialog__frame"
        role={tone === "danger" ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        onKeyDown={trapTab}
      >
        {context && (
          <div ref={chipRef} className="depth-dialog__context">
            {context}
          </div>
        )}
        <div className="depth-dialog__panel" data-tone={tone}>
          <div className="depth-dialog__body">
            <h2 id={titleId} className="depth-dialog__title">
              {title}
            </h2>
            {description && (
              <div id={descId} className="depth-dialog__desc">
                {description}
              </div>
            )}
            {children}
          </div>
          <div className="depth-dialog__actions">
            <button ref={cancelRef} type="button" className="depth-dialog__btn" onClick={() => requestClose("cancel")} disabled={busy}>
              {cancelLabel}
            </button>
            <button
              type="button"
              className="depth-dialog__btn depth-dialog__btn--primary"
              data-tone={tone}
              onClick={confirm}
              disabled={confirmDisabled || busy}
              aria-busy={busy || undefined}
            >
              {busy && <span className="depth-dialog__spinner" aria-hidden="true" />}
              {busy ? busyLabel ?? confirmLabel : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return contained ? node : createPortal(node, document.body);
}

/** A compact description of the object a decision is about. */
export function DepthDialogChip({ mark, title, meta }: { mark: ReactNode; title: ReactNode; meta?: ReactNode }) {
  return (
    <div className="depth-dialog-chip">
      <span className="depth-dialog-chip__mark" aria-hidden="true">
        {mark}
      </span>
      <span className="depth-dialog-chip__text">
        <span className="depth-dialog-chip__title">{title}</span>
        {meta && <span className="depth-dialog-chip__meta">{meta}</span>}
      </span>
    </div>
  );
}
