"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type DragEvent, type ReactNode } from "react";
import "./upload-stack.css";

/**
 * Upload Stack
 * Uploads sorted by what needs you. Failures lift to the top; the files moving
 * right now sit in full view; the queue waits behind them as a stack of edges;
 * finished files settle into a quiet ledger underneath. As work progresses,
 * files travel down the stack — the order of the surface is the order of
 * attention.
 */

export type Uploader = (file: File, report: (fraction: number) => void, signal: AbortSignal) => Promise<void>;

type Status = "queued" | "uploading" | "done" | "error";
type Item = { id: string; file: File; status: Status; progress: number; error?: string };

type Props = {
  uploader: Uploader;
  accept?: string;
  /** Bytes. Larger files fail immediately with a clear reason. */
  maxSize?: number;
  concurrency?: number;
  /** Files to start with (demo, restored sessions). */
  initialFiles?: File[];
  theme?: "paper" | "night";
  footer?: ReactNode;
};

const fmtSize = (b: number) => (b >= 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`);
const kind = (f: File) => {
  const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
  if (/^(png|jpe?g|gif|webp|heic|svg)$/.test(ext)) return { label: "IMG", tone: "#7c3aed" };
  if (ext === "pdf") return { label: "PDF", tone: "#dc2626" };
  if (/^(mp4|mov|webm)$/.test(ext)) return { label: "VID", tone: "#0891b2" };
  if (/^(zip|tar|gz)$/.test(ext)) return { label: "ZIP", tone: "#57534e" };
  if (/^(xlsx?|csv|numbers)$/.test(ext)) return { label: "XLS", tone: "#16a34a" };
  if (/^(docx?|pages|md|txt)$/.test(ext)) return { label: "DOC", tone: "#2563eb" };
  return { label: ext.slice(0, 3).toUpperCase() || "FILE", tone: "#78716c" };
};

let seq = 0;

export function UploadStack({ uploader, accept, maxSize = 25e6, concurrency = 2, initialFiles, theme = "paper", footer }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [over, setOver] = useState(false);
  const [message, setMessage] = useState("");
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const controllers = useRef(new Map<string, AbortController>());
  const rowEls = useRef(new Map<string, HTMLElement>());
  const rects = useRef(new Map<string, number>());
  const rootRef = useRef<HTMLElement>(null);
  const inputId = useId();

  const add = useCallback(
    (files: File[]) => {
      if (!files.length) return;
      const next = files.map<Item>((file) =>
        file.size > maxSize
          ? { id: `u${++seq}`, file, status: "error", progress: 0, error: `Too large — the limit is ${fmtSize(maxSize)}` }
          : { id: `u${++seq}`, file, status: "queued", progress: 0 },
      );
      setItems((list) => [...list, ...next]);
      setMessage(`${files.length} ${files.length === 1 ? "file" : "files"} added.`);
    },
    [maxSize],
  );

  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    if (initialFiles?.length) add(initialFiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start queued files while there is room.
  useEffect(() => {
    const active = items.filter((i) => i.status === "uploading").length;
    const waiting = items.filter((i) => i.status === "queued").slice(0, Math.max(0, concurrency - active));
    waiting.forEach((it) => {
      const ctl = new AbortController();
      controllers.current.set(it.id, ctl);
      setItems((list) => list.map((x) => (x.id === it.id ? { ...x, status: "uploading", progress: 0 } : x)));
      uploader(it.file, (p) => setItems((list) => list.map((x) => (x.id === it.id && x.status === "uploading" ? { ...x, progress: p } : x))), ctl.signal)
        .then(() => {
          if (ctl.signal.aborted) return;
          setItems((list) => list.map((x) => (x.id === it.id ? { ...x, status: "done", progress: 1 } : x)));
          setMessage(`${it.file.name} uploaded.`);
        })
        .catch((err: Error) => {
          if (ctl.signal.aborted) return;
          setItems((list) => list.map((x) => (x.id === it.id ? { ...x, status: "error", error: err.message || "Upload failed" } : x)));
          setMessage(`${it.file.name} failed: ${err.message}`);
        })
        .finally(() => controllers.current.delete(it.id));
    });
  }, [items, concurrency, uploader]);

  useEffect(() => () => controllers.current.forEach((c) => c.abort()), []);

  const remove = (id: string) => {
    controllers.current.get(id)?.abort();
    const it = items.find((x) => x.id === id);
    setItems((list) => list.filter((x) => x.id !== id));
    if (it) setMessage(`${it.file.name} ${it.status === "uploading" || it.status === "queued" ? "cancelled" : "removed"}.`);
  };
  const retry = (id: string) => setItems((list) => list.map((x) => (x.id === id ? { ...x, status: "queued", progress: 0, error: undefined } : x)));
  const retryAll = () => setItems((list) => list.map((x) => (x.status === "error" && x.file.size <= maxSize ? { ...x, status: "queued", progress: 0, error: undefined } : x)));
  const clearDone = () => {
    setItems((list) => list.filter((x) => x.status !== "done"));
    setLedgerOpen(false);
  };

  // FLIP: files travelling between groups glide rather than jump. Positions are measured
  // relative to the section (so scrolling never looks like movement) and with any in-flight
  // offset removed (so a move that is already gliding continues instead of restarting).
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const base = root.getBoundingClientRect().top;
    rowEls.current.forEach((el, id) => {
      const offset = new DOMMatrixReadOnly(getComputedStyle(el).transform).m42;
      const layout = el.getBoundingClientRect().top - base - offset;
      const was = rects.current.get(id);
      if (was !== undefined && !reduce && Math.abs(was - layout) > 2) {
        el.getAnimations().forEach((a) => a.id === "us-flip" && a.cancel());
        el.animate([{ transform: `translateY(${was - layout + offset}px)` }, { transform: "none" }], { id: "us-flip", duration: 380, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" });
      }
      rects.current.set(id, layout);
    });
  });

  const errors = items.filter((i) => i.status === "error");
  const active = items.filter((i) => i.status === "uploading");
  const queued = items.filter((i) => i.status === "queued");
  const done = items.filter((i) => i.status === "done");
  const doneBytes = done.reduce((n, i) => n + i.file.size, 0);
  const totalBytes = items.filter((i) => i.status !== "error" || i.file.size <= maxSize).reduce((n, i) => n + i.file.size, 0);
  const sentBytes = items.reduce((n, i) => n + (i.status === "done" ? i.file.size : i.status === "uploading" ? i.file.size * i.progress : 0), 0);

  const ref = (id: string) => (el: HTMLElement | null) => {
    if (el) rowEls.current.set(id, el);
    else rowEls.current.delete(id);
  };

  const glyph = (f: File) => {
    const k = kind(f);
    return (
      <span className="upload-stack__glyph" style={{ color: k.tone }} aria-hidden="true">
        {k.label}
      </span>
    );
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    add(Array.from(e.dataTransfer.files));
  };

  return (
    <section
      ref={rootRef}
      className={`upload-stack upload-stack--${theme}`}
      data-over={over || undefined}
      aria-label="Uploads"
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(false);
      }}
      onDrop={onDrop}
    >
      <div className="upload-stack__drop">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M10 13V3.5M6 7.5l4-4 4 4M3.5 12.5v4h13v-4" />
        </svg>
        <p>
          {over ? (
            <strong>Drop to add to the stack</strong>
          ) : (
            <span className="upload-stack__call">
              <strong>Drop files here</strong> or{" "}
              <label htmlFor={inputId} className="upload-stack__browse">
                browse
              </label>
            </span>
          )}
          <span>Up to {fmtSize(maxSize)} each</span>
        </p>
        <input
          id={inputId}
          type="file"
          multiple
          accept={accept}
          className="upload-stack__input"
          onChange={(e) => {
            add(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </div>

      {items.length > 0 && (
        <div className="upload-stack__meter" aria-hidden="true">
          <span style={{ width: `${totalBytes ? (sentBytes / totalBytes) * 100 : 0}%` }} />
        </div>
      )}

      {errors.length > 0 && (
        <div className="upload-stack__group" data-group="error">
          <header>
            <h3>Needs attention · {errors.length}</h3>
            {errors.some((e) => e.file.size <= maxSize) && errors.length > 1 && (
              <button type="button" className="upload-stack__link" onClick={retryAll}>
                Retry all
              </button>
            )}
          </header>
          <ul>
            {errors.map((it) => (
              <li key={it.id} ref={ref(it.id)} className="upload-stack__row" data-status="error">
                {glyph(it.file)}
                <div className="upload-stack__info">
                  <span className="upload-stack__name">{it.file.name}</span>
                  <span className="upload-stack__meta upload-stack__meta--error">{it.error}</span>
                </div>
                <div className="upload-stack__actions">
                  {it.file.size <= maxSize && (
                    <button type="button" onClick={() => retry(it.id)} aria-label={`Retry ${it.file.name}`}>
                      Retry
                    </button>
                  )}
                  <button type="button" onClick={() => remove(it.id)} aria-label={`Remove ${it.file.name}`}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(active.length > 0 || queued.length > 0) && (
        <div className="upload-stack__group" data-group="active">
          <header>
            <h3>
              Uploading · {active.length}
              {queued.length > 0 && <span> · {queued.length} waiting</span>}
            </h3>
          </header>
          <ul>
            {active.map((it) => (
              <li key={it.id} ref={ref(it.id)} className="upload-stack__row" data-status="uploading">
                {glyph(it.file)}
                <div className="upload-stack__info">
                  <span className="upload-stack__name">{it.file.name}</span>
                  <span className="upload-stack__meta">
                    {fmtSize(it.file.size * it.progress)} of {fmtSize(it.file.size)}
                  </span>
                  <span className="upload-stack__bar" role="progressbar" aria-label={`${it.file.name} upload`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(it.progress * 100)}>
                    <span style={{ transform: `scaleX(${it.progress})` }} />
                  </span>
                </div>
                <div className="upload-stack__actions">
                  <span className="upload-stack__pct" aria-hidden="true">
                    {Math.round(it.progress * 100)}%
                  </span>
                  <button type="button" onClick={() => remove(it.id)} aria-label={`Cancel ${it.file.name}`}>
                    Cancel
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {queued.length > 0 && (
            <div className="upload-stack__queue">
              {/* The next file shows its name; the rest are edges behind it. */}
              <div key={queued[0].id} ref={ref(queued[0].id)} className="upload-stack__row upload-stack__row--next" data-status="queued">
                {glyph(queued[0].file)}
                <div className="upload-stack__info">
                  <span className="upload-stack__name">{queued[0].file.name}</span>
                </div>
                <div className="upload-stack__actions">
                  <span className="upload-stack__meta">Next · {fmtSize(queued[0].file.size)}</span>
                  <button type="button" onClick={() => remove(queued[0].id)} aria-label={`Cancel ${queued[0].file.name}`}>
                    Cancel
                  </button>
                </div>
              </div>
              {queued.slice(1, 4).map((it, i) => (
                <div key={it.id} ref={ref(it.id)} className="upload-stack__edge" style={{ marginInline: `${(i + 1) * 10}px` }} title={it.file.name} aria-hidden="true" />
              ))}
              {queued.length > 1 && (
                <p className="upload-stack__waiting">
                  {queued.length - 1} more waiting: {queued.slice(1).map((q) => q.file.name).join(", ")}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {done.length > 0 && (
        <div className="upload-stack__group" data-group="done">
          <header>
            <h3>
              Uploaded · {done.length} · {fmtSize(doneBytes)}
            </h3>
            <div className="upload-stack__header-actions">
              {done.length > 3 && (
                <button type="button" className="upload-stack__link" aria-expanded={ledgerOpen} onClick={() => setLedgerOpen((o) => !o)}>
                  {ledgerOpen ? "Show fewer" : "Show all"}
                </button>
              )}
              <button type="button" className="upload-stack__link" onClick={clearDone}>
                Clear
              </button>
            </div>
          </header>
          <ul className="upload-stack__ledger">
            {(ledgerOpen ? done : done.slice(-3)).map((it) => (
              <li key={it.id} ref={ref(it.id)} className="upload-stack__row" data-status="done">
                <svg className="upload-stack__check" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3.5 8.5l3 3 6-7" />
                </svg>
                <span className="upload-stack__name">{it.file.name}</span>
                <span className="upload-stack__meta">{fmtSize(it.file.size)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {footer}
      <p className="upload-stack__sr" role="status">
        {message}
      </p>
    </section>
  );
}
