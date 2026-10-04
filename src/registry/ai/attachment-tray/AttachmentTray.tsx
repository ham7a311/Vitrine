"use client";

import { useEffect, useRef, useState, type CSSProperties, type DragEvent } from "react";
import "./attachment-tray.css";

/**
 * Attachment Tray
 * Each file's progress is a ring drawn around its type glyph. When the ring
 * closes it tightens into a small seal with a check — the file is "sealed in".
 * The tray itself only lights up while something is being dragged over it.
 */

type Kind = "pdf" | "image" | "code" | "sheet" | "doc";
type Item = { id: string; name: string; kind: Kind; bytes: number; progress: number; state: "uploading" | "done" | "error"; leaving?: boolean; failAt?: number };

type Props = { initial?: Omit<Item, "progress" | "state">[]; theme?: "paper" | "night"; className?: string };

const GLYPH: Record<Kind, string> = { pdf: "PDF", image: "IMG", code: "</>", sheet: "CSV", doc: "DOC" };
const kindOf = (n: string): Kind => (/\.pdf$/i.test(n) ? "pdf" : /\.(png|jpe?g|webp|gif)$/i.test(n) ? "image" : /\.(csv|xlsx?)$/i.test(n) ? "sheet" : /\.(tsx?|jsx?|py|json)$/i.test(n) ? "code" : "doc");
const mb = (b: number) => (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`);

export function AttachmentTray({ initial = [], theme = "paper", className = "" }: Props) {
  const [items, setItems] = useState<Item[]>(() => initial.map((f) => ({ ...f, progress: 0, state: "uploading" })));
  const [over, setOver] = useState(false);
  const picker = useRef<HTMLInputElement>(null);

  // simulated transport: uneven speed, one file may fail at a set point
  useEffect(() => {
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last); last = now;
      setItems((list) => {
        let changed = false;
        const next = list.map((it) => {
          if (it.state !== "uploading") return it;
          changed = true;
          const speed = (2.2e6 / Math.max(it.bytes, 4e5)) * (0.55 + 0.45 * Math.sin(now / 420 + it.bytes)) * 0.00032;
          const p = Math.min(1, it.progress + dt * speed);
          if (it.failAt && p >= it.failAt) return { ...it, progress: it.failAt, state: "error" as const };
          return { ...it, progress: p, state: p >= 1 ? ("done" as const) : it.state };
        });
        return changed ? next : list;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const add = (files: FileList | null) => {
    if (!files) return;
    setItems((l) => [...l, ...Array.from(files).map((f, i) => ({ id: `${Date.now()}-${i}`, name: f.name, kind: kindOf(f.name), bytes: f.size || 3e5, progress: 0, state: "uploading" as const }))]);
  };
  const remove = (id: string) => {
    setItems((l) => l.map((x) => (x.id === id ? { ...x, leaving: true } : x)));
    setTimeout(() => setItems((l) => l.filter((x) => x.id !== id)), 420);
  };
  const retry = (id: string) => setItems((l) => l.map((x) => (x.id === id ? { ...x, failAt: undefined, state: "uploading" } : x)));

  const onDrop = (e: DragEvent) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files); };
  const doneCount = items.filter((i) => i.state === "done" && !i.leaving).length;

  return (
    <div className={`attachment-tray attachment-tray--${theme} ${className}`} data-over={over || undefined}
      onDragEnter={(e) => { e.preventDefault(); setOver(true); }} onDragOver={(e) => e.preventDefault()} onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(false); }} onDrop={onDrop}>
      <div className="attachment-tray__head">
        <p className="attachment-tray__title">Attachments <span>{doneCount}/{items.filter((i) => !i.leaving).length}</span></p>
        <input ref={picker} type="file" multiple hidden onChange={(e) => { add(e.target.files); e.target.value = ""; }} />
        <button type="button" className="attachment-tray__add" onClick={() => picker.current?.click()}>Add files</button>
      </div>

      <ul className="attachment-tray__list">
        {items.map((it) => {
          const pct = Math.round(it.progress * 100);
          return (
            <li key={it.id} className="attachment-tray__row" data-state={it.state} data-leaving={it.leaving || undefined}>
              <div className="attachment-tray__inner">
                <span className="attachment-tray__badge" data-kind={it.kind} style={{ "--p": it.progress } as CSSProperties} aria-hidden="true">
                  <svg viewBox="0 0 44 44">
                    <circle className="attachment-tray__track" cx="22" cy="22" r="20" />
                    <circle className="attachment-tray__ring" cx="22" cy="22" r="20" pathLength={1} />
                  </svg>
                  <span className="attachment-tray__glyph">{GLYPH[it.kind]}</span>
                  <span className="attachment-tray__seal"><svg viewBox="0 0 12 12"><path d="M2.8 6.2l2.1 2.1 4.3-4.6" /></svg></span>
                </span>
                <span className="attachment-tray__meta">
                  <span className="attachment-tray__name">{it.name}</span>
                  <span className="attachment-tray__sub">
                    {it.state === "error" ? "Upload interrupted" : it.state === "done" ? mb(it.bytes) : `${mb(it.bytes * it.progress)} of ${mb(it.bytes)}`}
                  </span>
                </span>
                {it.state === "uploading" && <span className="attachment-tray__pct">{pct}%</span>}
                {it.state === "error" && <button type="button" className="attachment-tray__retry" onClick={() => retry(it.id)}>Retry</button>}
                <button type="button" className="attachment-tray__x" onClick={() => remove(it.id)} aria-label={`Remove ${it.name}`}>
                  <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 3l6 6M9 3l-6 6" /></svg>
                </button>
                <span className="attachment-tray__sr" role="status">{it.state === "done" ? `${it.name} uploaded` : it.state === "error" ? `${it.name} failed` : ""}</span>
              </div>
            </li>
          );
        })}
      </ul>

      <button type="button" className="attachment-tray__drop" onClick={() => picker.current?.click()}>
        <span>{over ? "Release to attach" : "Drop files here, or browse"}</span>
        <span className="attachment-tray__hint">PDF, images, code, spreadsheets · up to 50 MB</span>
      </button>
    </div>
  );
}
