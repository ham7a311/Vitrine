"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import "./prompt-composer.css";

/**
 * Prompt Composer
 * Files aren't chips inside the box — they're tabs standing on its top edge,
 * the same material as the composer, so the attachment and the message read
 * as one object. A tab rises out from behind the edge when added and sinks
 * back behind it when removed. The textarea grows with its content; the send
 * button becomes a stop button with a turning arc while the reply streams.
 */

export type Attachment = { id: string; name: string; kind: "pdf" | "image" | "code" | "sheet" | "doc"; size?: string };

type Props = {
  placeholder?: string;
  initialFiles?: Attachment[];
  models?: string[];
  onSend?: (text: string, files: Attachment[]) => Promise<void> | void;
  theme?: "paper" | "night";
  className?: string;
};

const GLYPH: Record<Attachment["kind"], string> = { pdf: "PDF", image: "IMG", code: "</>", sheet: "CSV", doc: "DOC" };
const kindOf = (name: string): Attachment["kind"] =>
  /\.pdf$/i.test(name) ? "pdf" : /\.(png|jpe?g|gif|webp|svg)$/i.test(name) ? "image" : /\.(csv|xlsx?)$/i.test(name) ? "sheet" : /\.(tsx?|jsx?|py|go|rs|json|css|html)$/i.test(name) ? "code" : "doc";

export function PromptComposer({ placeholder = "Ask anything…", initialFiles = [], models = ["Fast", "Balanced", "Deep"], onSend, theme = "paper", className = "" }: Props) {
  const uid = useId();
  const [text, setText] = useState("");
  const [files, setFiles] = useState(initialFiles);
  const [leaving, setLeaving] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [model, setModel] = useState(1);
  const [search, setSearch] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const stop = useRef(false);

  // grow with content up to ~8 lines
  useLayoutEffect(() => {
    const el = area.current!;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 208)}px`;
  }, [text]);

  const remove = (id: string) => {
    setLeaving((l) => [...l, id]);
    setTimeout(() => { setFiles((f) => f.filter((x) => x.id !== id)); setLeaving((l) => l.filter((x) => x !== id)); }, 360);
  };
  const add = (list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list).map((f, i) => ({ id: `${Date.now()}-${i}`, name: f.name, kind: kindOf(f.name), size: `${Math.max(1, Math.round(f.size / 1024))} KB` }));
    setFiles((f) => [...f, ...next].slice(0, 6));
  };

  const send = async () => {
    if (busy) { stop.current = true; setBusy(false); return; }
    if (!text.trim() && !files.length) return;
    const payload = text.trim(), attached = files;
    setBusy(true); stop.current = false;
    setText(""); files.forEach((f) => remove(f.id));
    await (onSend ? onSend(payload, attached) : new Promise((r) => setTimeout(r, 2600)));
    if (!stop.current) setBusy(false);
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); }
  };

  useEffect(() => { area.current?.focus({ preventScroll: true }); }, []);

  const canSend = busy || !!text.trim() || files.length > 0;

  return (
    <div
      className={`prompt-composer prompt-composer--${theme} ${className}`}
      data-has-files={files.length > 0 || undefined}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); add(e.dataTransfer.files); }}
    >
      <ul className="prompt-composer__tabs" aria-label="Attached files">
        {files.map((f, i) => (
          <li key={f.id} className="prompt-composer__tab" data-leaving={leaving.includes(f.id) || undefined} style={{ "--i": i } as CSSProperties}>
            <span className="prompt-composer__glyph" data-kind={f.kind} aria-hidden="true">{GLYPH[f.kind]}</span>
            <span className="prompt-composer__name" title={f.name}>{f.name}</span>
            <button type="button" className="prompt-composer__x" onClick={() => remove(f.id)} aria-label={`Remove ${f.name}`}>
              <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 3l6 6M9 3l-6 6" /></svg>
            </button>
          </li>
        ))}
      </ul>

      <div className="prompt-composer__body">
        <label htmlFor={`${uid}-q`} className="prompt-composer__sr">Message</label>
        <textarea
          ref={area}
          id={`${uid}-q`}
          rows={1}
          value={text}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          onPaste={(e) => e.clipboardData.files.length && add(e.clipboardData.files)}
        />

        <div className="prompt-composer__tools">
          <input ref={picker} type="file" multiple hidden onChange={(e) => { add(e.target.files); e.target.value = ""; }} />
          <button type="button" className="prompt-composer__icon" onClick={() => picker.current?.click()} aria-label="Attach files">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4.5v11M4.5 10h11" /></svg>
          </button>
          <button type="button" className="prompt-composer__chip" aria-pressed={search} onClick={() => setSearch((s) => !s)}>
            <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6.5" /><path d="M3.5 10h13M10 3.5c2 2.2 2 10.8 0 13M10 3.5c-2 2.2-2 10.8 0 13" /></svg>
            <span className="prompt-composer__chip-label">Search</span>
          </button>
          <button type="button" className="prompt-composer__chip prompt-composer__chip--model" onClick={() => setModel((m) => (m + 1) % models.length)} aria-label={`Model: ${models[model]}. Change model`}>
            <span key={model} className="prompt-composer__model">{models[model]}</span>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 8l3-3 3 3M7 12l3 3 3-3" /></svg>
          </button>
          <span className="prompt-composer__spacer" />
          <button type="button" className="prompt-composer__icon prompt-composer__icon--mic" aria-label="Dictate">
            <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="7.5" y="3" width="5" height="9" rx="2.5" /><path d="M5 9.5a5 5 0 0 0 10 0M10 14.5V17" /></svg>
          </button>
          <button type="button" className="prompt-composer__send" onClick={send} disabled={!canSend} data-busy={busy || undefined} aria-label={busy ? "Stop generating" : "Send message"}>
            <svg className="prompt-composer__arc" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18.5" pathLength={1} /></svg>
            <svg className="prompt-composer__arrow" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 15.5v-11M5.5 9L10 4.5 14.5 9" /></svg>
            <span className="prompt-composer__stop" aria-hidden="true" />
          </button>
        </div>
      </div>
      <p className="prompt-composer__sr" aria-live="polite">{busy ? "Generating a reply" : ""}</p>
    </div>
  );
}
