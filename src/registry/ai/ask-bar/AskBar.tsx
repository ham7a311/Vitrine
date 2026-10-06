"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { rowsFor, tokens } from "./stream";
import "./ask-bar.css";

export type AskModel = { id: string; name: string; detail: string };
export type AskMessage = { role: "user" | "assistant"; text: string; model?: string; files?: string[] };
export type AskBarProps = {
  greeting: string;
  placeholder?: string;
  models: AskModel[];
  defaultModel?: string;
  /** Produce the reply for a prompt. Return the full text; it is streamed in word by word. */
  respond?: (prompt: string, model: AskModel) => string | Promise<string>;
  onSend?: (message: AskMessage) => void;
  theme?: "light" | "dark";
  className?: string;
};

type Speech = { start: () => void; stop: () => void; abort: () => void; onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null; interimResults: boolean; continuous: boolean; lang: string };

const LINE = 24, PAD = 0, MAX_ROWS = 8;

const Icon = {
  plus: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.5v15M4.5 12h15" /></svg>,
  chevron: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6.5 9.5 5.5 5.5 5.5-5.5" /></svg>,
  mic: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11.5" rx="3" /><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" /></svg>,
  send: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5.5M6 11.5l6-6 6 6" /></svg>,
  stop: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2" className="askb__fill" /></svg>,
  file: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8Z" /><path d="M14 3.5V8h4.5" /></svg>,
  photo: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="m4 17 5-4.5 3.5 3 3-2.5 4.5 4" /></svg>,
  spark: <svg viewBox="0 0 24 24" aria-hidden="true"><path className="askb__fill" d="M12 2.5c.6 4.6 2.9 6.9 7.5 7.5v.4c-4.6.6-6.9 2.9-7.5 7.5h-.4c-.6-4.6-2.9-6.9-7.5-7.5V10c4.6-.6 6.9-2.9 7.5-7.5Z" transform="translate(0 1.6)" /></svg>,
  template: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 9h8M8 12.5h8M8 16h5" /></svg>,
  x: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" /></svg>,
  check: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5.5 12.5 4 4 9-9" /></svg>,
};

/**
 * Ask Bar
 * A quiet, full-screen place to start a conversation: a greeting over a deep
 * glow and one rounded bar to ask in. The bar grows as you write, swaps the
 * microphone for send when there is something to send, attaches files from
 * its plus menu and switches model from its own. Once you ask, the greeting
 * steps aside and the answer streams in above the bar.
 */
export function AskBar({ greeting, placeholder = "Ask anything", models, defaultModel, respond, onSend, theme = "dark", className = "" }: AskBarProps) {
  const id = useId();
  const [text, setText] = useState("");
  const [model, setModel] = useState(models.find((m) => m.id === defaultModel) ?? models[0]);
  const [menu, setMenu] = useState<null | "plus" | "model">(null);
  const [files, setFiles] = useState<string[]>([]);
  const [messages, setMessages] = useState<AskMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [listening, setListening] = useState(false);
  const [note, setNote] = useState("");
  const [rows, setRows] = useState(1);
  const area = useRef<HTMLTextAreaElement>(null);
  const plusBtn = useRef<HTMLButtonElement>(null);
  const modelBtn = useRef<HTMLButtonElement>(null);
  const menuEl = useRef<HTMLDivElement>(null);
  const fileIn = useRef<HTMLInputElement>(null);
  const photoIn = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const speech = useRef<Speech | null>(null);
  const run = useRef(0);

  // Grow the field with its content, up to eight lines.
  useLayoutEffect(() => {
    const a = area.current;
    if (!a) return;
    a.style.height = "auto";
    const r = rowsFor(a.scrollHeight, LINE, PAD, MAX_ROWS);
    a.style.height = `${r * LINE}px`;
    setRows(r);
  }, [text]);

  // Menus: focus the current item on open, close on a click elsewhere.
  useEffect(() => {
    if (!menu) return;
    menuEl.current?.querySelector<HTMLElement>("[aria-checked='true'], [role^='menuitem']")?.focus();
    const away = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!menuEl.current?.contains(t) && !plusBtn.current?.contains(t) && !modelBtn.current?.contains(t)) setMenu(null);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [menu]);
  useEffect(() => { if (!note) return; const t = setTimeout(() => setNote(""), 3600); return () => clearTimeout(t); }, [note]);
  useEffect(() => { const el = log.current; if (el) el.scrollTop = el.scrollHeight; }, [messages]);
  useEffect(() => () => { run.current++; speech.current?.abort(); }, []);

  const close = (back: "plus" | "model") => { setMenu(null); (back === "plus" ? plusBtn : modelBtn).current?.focus(); };
  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = [...(menuEl.current?.querySelectorAll<HTMLElement>("[role^='menuitem']") ?? [])];
    const k = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); items[(k + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length]?.focus(); }
    else if (e.key === "Home" || e.key === "End") { e.preventDefault(); items[e.key === "Home" ? 0 : items.length - 1]?.focus(); }
    else if (e.key === "Escape" || e.key === "Tab") { e.preventDefault(); close(menu!); }
  };

  const send = async () => {
    const prompt = text.trim();
    if (!prompt || streaming) return;
    speech.current?.stop();
    const mine: AskMessage = { role: "user", text: prompt, files: files.length ? files : undefined };
    onSend?.(mine);
    setMessages((m) => [...m, mine, { role: "assistant", text: "", model: model.name }]);
    setText(""); setFiles([]); setStreaming(true);
    const token = ++run.current;
    const full = respond ? await respond(prompt, model) : "";
    const parts = tokens(full || "…");
    for (let i = 0; i < parts.length; i++) {
      if (run.current !== token) return;
      await new Promise((r) => setTimeout(r, 28 + Math.random() * 40));
      const so = parts.slice(0, i + 1).join("");
      setMessages((m) => m.map((x, j) => (j === m.length - 1 ? { ...x, text: so } : x)));
    }
    if (run.current === token) setStreaming(false);
    area.current?.focus();
  };
  const stop = () => { run.current++; setStreaming(false); area.current?.focus(); };

  const listen = () => {
    if (listening) { speech.current?.stop(); return; }
    const W = window as unknown as { SpeechRecognition?: new () => Speech; webkitSpeechRecognition?: new () => Speech };
    const SR = W.SpeechRecognition ?? W.webkitSpeechRecognition;
    if (!SR) { setNote("Voice input isn't available in this browser."); return; }
    const r = new SR();
    r.interimResults = true; r.continuous = false; r.lang = document.documentElement.lang || "en-GB";
    const before = text ? `${text.trimEnd()} ` : "";
    r.onresult = (e) => setText(before + Array.from(e.results).map((x) => x[0].transcript).join(""));
    r.onend = () => { setListening(false); area.current?.focus(); };
    r.onerror = () => { setListening(false); setNote("Couldn't hear that. Check the microphone and try again."); };
    speech.current = r;
    try { r.start(); setListening(true); } catch { setNote("Voice input isn't available right now."); }
  };

  const addFiles = (list: FileList | null) => {
    // Read the names now: the input is cleared straight after, which empties the list.
    const names = Array.from(list ?? []).map((x) => x.name);
    if (names.length) setFiles((f) => [...f, ...names]);
    area.current?.focus();
  };
  const started = messages.length > 0;
  const expanded = rows > 1 || files.length > 0;
  const canSend = text.trim().length > 0;

  return (
    <section className={`askb askb--${theme} ${className}`} data-started={started || undefined} aria-label="Ask">
      <div className="askb__glow" aria-hidden="true" />
      {!started && (
        <h2 className="askb__hello">
          {greeting.split(" ").map((w, i) => <span key={i} style={{ animationDelay: `${120 + i * 70}ms` }}>{w} </span>)}
        </h2>
      )}

      {started && (
        <div ref={log} className="askb__log" role="log" aria-live="polite" aria-label="Conversation">
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="askb__me">
                {m.files && <ul className="askb__sent-files">{m.files.map((f) => <li key={f}>{Icon.file}{f}</li>)}</ul>}
                <p>{m.text}</p>
              </div>
            ) : (
              <div key={i} className="askb__ai" data-live={(streaming && i === messages.length - 1) || undefined}>
                <span className="askb__spark" aria-hidden="true">{Icon.spark}</span>
                <div>
                  <p>{m.text || <span className="askb__dots" aria-label="Thinking"><i /><i /><i /></span>}</p>
                  <small>{m.model}</small>
                </div>
              </div>
            ),
          )}
        </div>
      )}

      <div className="askb__dock">
        <form
          className="askb__bar"
          data-expanded={expanded || undefined}
          data-listening={listening || undefined}
          onSubmit={(e) => { e.preventDefault(); void send(); }}
        >
          {files.length > 0 && (
            <ul className="askb__files" aria-label="Attached">
              {files.map((f, i) => (
                <li key={`${f}-${i}`}>
                  {Icon.file}<span>{f}</span>
                  <button type="button" aria-label={`Remove ${f}`} onClick={() => setFiles((x) => x.filter((_, j) => j !== i))}>{Icon.x}</button>
                </li>
              ))}
            </ul>
          )}
          <div className="askb__plus-wrap">
            <button
              ref={plusBtn}
              type="button"
              className="askb__icon"
              aria-label="Add files and more"
              aria-haspopup="menu"
              aria-expanded={menu === "plus"}
              aria-controls={menu === "plus" ? `${id}-plus` : undefined}
              onClick={() => setMenu((m) => (m === "plus" ? null : "plus"))}
            >
              {Icon.plus}
            </button>
            {menu === "plus" && (
              <div ref={menuEl} id={`${id}-plus`} className="askb__menu askb__menu--plus" role="menu" aria-label="Add" onKeyDown={onMenuKey}>
                <button type="button" role="menuitem" tabIndex={-1} onClick={() => { setMenu(null); fileIn.current?.click(); }}>{Icon.file}Upload files</button>
                <button type="button" role="menuitem" tabIndex={-1} onClick={() => { setMenu(null); photoIn.current?.click(); }}>{Icon.photo}Add photos</button>
                <button type="button" role="menuitem" tabIndex={-1} onClick={() => { setMenu(null); setText((t) => t || "Summarise this in three short points:\n"); area.current?.focus(); }}>{Icon.template}Start from a template</button>
              </div>
            )}
          </div>
          <input ref={fileIn} type="file" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
          <input ref={photoIn} type="file" accept="image/*" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />

          <label className="askb__field">
            <span className="askb__sr">Message</span>
            <textarea
              ref={area}
              rows={1}
              value={text}
              placeholder={listening ? "Listening…" : placeholder}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); void send(); } }}
            />
          </label>

          <div className="askb__model-wrap">
            <button
              ref={modelBtn}
              type="button"
              className="askb__model"
              aria-haspopup="menu"
              aria-expanded={menu === "model"}
              aria-controls={menu === "model" ? `${id}-model` : undefined}
              aria-label={`Model: ${model.name}`}
              onClick={() => setMenu((m) => (m === "model" ? null : "model"))}
            >
              {model.name}{Icon.chevron}
            </button>
            {menu === "model" && (
              <div ref={menuEl} id={`${id}-model`} className="askb__menu askb__menu--model" role="menu" aria-label="Model" onKeyDown={onMenuKey}>
                {models.map((m) => (
                  <button key={m.id} type="button" role="menuitemradio" aria-checked={m.id === model.id} tabIndex={-1} onClick={() => { setModel(m); close("model"); }}>
                    <span><strong>{m.name}</strong><small>{m.detail}</small></span>
                    {m.id === model.id && Icon.check}
                  </button>
                ))}
              </div>
            )}
          </div>

          {streaming ? (
            <button type="button" className="askb__action askb__action--stop" aria-label="Stop" onClick={stop}>{Icon.stop}</button>
          ) : canSend ? (
            <button type="submit" className="askb__action askb__action--send" aria-label="Send">{Icon.send}</button>
          ) : (
            <button type="button" className="askb__icon askb__mic" aria-label={listening ? "Stop listening" : "Speak"} aria-pressed={listening} onClick={listen}>
              {listening ? <span className="askb__bars" aria-hidden="true"><i /><i /><i /><i /></span> : Icon.mic}
            </button>
          )}
        </form>
        <p className="askb__note" aria-live="polite">{note}</p>
      </div>
    </section>
  );
}
