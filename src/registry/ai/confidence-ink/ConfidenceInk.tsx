"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ink, pct, split, swap, uncertain, type Alt, type Placed, type Token } from "./ink";
import "./confidence-ink.css";

export type { Alt, Token } from "./ink";
export type ConfidenceInkProps = {
  tokens: Token[];
  /** Tokens below this probability are drawn in lighter ink; the reader can move it. */
  defaultThreshold?: number;
  label?: string;
  onChange?: (text: string, tokens: Token[]) => void;
  theme?: "light" | "dark";
  className?: string;
};

/**
 * Confidence Ink
 * Generated text printed with the model's own certainty: words it was unsure
 * of come out in lighter ink with a dotted underline, and opening one shows
 * what else it nearly wrote, with the odds, so you can swap it in.
 */
export function ConfidenceInk({ tokens: initial, defaultThreshold = 0.6, label = "Answer", onChange, theme = "light", className = "" }: ConfidenceInkProps) {
  const id = useId();
  const [tokens, setTokens] = useState<Placed[]>(initial);
  const [threshold, setThreshold] = useState(defaultThreshold);
  const [open, setOpen] = useState<number | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [message, setMessage] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const triggers = useRef(new Map<number, HTMLButtonElement>());
  const menu = useRef<HTMLDivElement>(null);
  const originals = useRef(initial.map((t) => t.text));

  const low = new Set(uncertain(tokens, threshold));
  const edited = tokens.filter((t) => t.edited).length;

  // Place the menu under its word, kept inside the panel.
  useLayoutEffect(() => {
    if (open === null) return setPos(null);
    const b = triggers.current.get(open), box = root.current;
    if (!b || !box) return;
    const r = b.getBoundingClientRect(), o = box.getBoundingClientRect();
    const w = menu.current?.offsetWidth ?? 240;
    setPos({ x: Math.max(8, Math.min(o.width - w - 8, r.left - o.left)), y: r.bottom - o.top + 6 });
  }, [open, tokens]);
  // Focus the current choice once the menu is placed and visible.
  const placed = pos !== null;
  useEffect(() => { if (placed) menu.current?.querySelector<HTMLElement>("[aria-checked='true']")?.focus(); }, [placed, open]);

  useEffect(() => {
    if (open === null) return;
    const away = (e: PointerEvent) => { if (!menu.current?.contains(e.target as Node) && !triggers.current.get(open)?.contains(e.target as Node)) setOpen(null); };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  const close = (refocus = true) => { const i = open; setOpen(null); if (refocus && i !== null) triggers.current.get(i)?.focus(); };
  const pick = (i: number, alt: Alt) => {
    const next = swap(tokens, i, alt, originals.current[i]);
    setTokens(next);
    onChange?.(next.map((t) => t.text).join(""), next);
    setMessage(`Replaced with “${alt.text.trim()}”, ${pct(alt.p)}.`);
    close();
  };
  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = [...(menu.current?.querySelectorAll<HTMLElement>("[role='menuitemradio']") ?? [])];
    const k = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); items[(k + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length]?.focus(); }
    else if (e.key === "Home") { e.preventDefault(); items[0]?.focus(); }
    else if (e.key === "End") { e.preventDefault(); items[items.length - 1]?.focus(); }
    else if (e.key === "Escape" || e.key === "Tab") { e.preventDefault(); close(); }
  };

  const current = open !== null ? tokens[open] : null;
  const options = current ? [{ text: current.text, p: current.p }, ...(current.alternatives ?? [])].sort((a, b) => b.p - a.p) : [];

  return (
    <div ref={root} className={`cink cink--${theme} ${className}`}>
      <header className="cink__head">
        <span className="cink__label">{label}</span>
        <label className="cink__slider">
          <span>Mark words below <output>{pct(threshold)}</output></span>
          <input type="range" min={0.2} max={0.95} step={0.05} value={threshold} onChange={(e) => setThreshold(+e.target.value)} />
        </label>
      </header>

      <p className="cink__text">
        {tokens.map((t, i) => {
          const [space, word] = split(t.text);
          if (!low.has(i) && !t.edited) return <span key={i}>{t.text}</span>;
          const alts = (t.alternatives?.length ?? 0) > 0;
          return (
            <span key={i}>
              {space}
              <button
                ref={(el) => { if (el) triggers.current.set(i, el); else triggers.current.delete(i); }}
                type="button"
                className="cink__word"
                data-low={low.has(i) || undefined}
                data-edited={t.edited || undefined}
                data-open={open === i || undefined}
                style={{ "--ink": ink(t.p, threshold) } as CSSProperties}
                aria-haspopup={alts ? "menu" : undefined}
                aria-expanded={alts ? open === i : undefined}
                aria-controls={open === i ? `${id}-m` : undefined}
                aria-label={`${word}, ${pct(t.p)} likely${t.edited ? ", you changed this" : ""}${alts ? `, ${t.alternatives!.length} other ${t.alternatives!.length === 1 ? "choice" : "choices"}` : ""}`}
                onClick={() => alts && setOpen(open === i ? null : i)}
              >
                {word}
              </button>
            </span>
          );
        })}
      </p>

      {current && (
        <div
          ref={menu}
          id={`${id}-m`}
          className="cink__menu"
          role="menu"
          aria-label={`Choices for “${current.text.trim()}”`}
          style={pos ? { left: pos.x, top: pos.y } : { visibility: "hidden" }}
          onKeyDown={onMenuKey}
        >
          <p className="cink__menu-head" aria-hidden="true">The model weighed</p>
          {options.map((o) => (
            <button
              key={o.text}
              type="button"
              role="menuitemradio"
              aria-checked={o.text === current.text}
              tabIndex={-1}
              className="cink__opt"
              style={{ "--p": o.p } as CSSProperties}
              onClick={() => (o.text === current.text ? close() : pick(open!, o))}
            >
              <span className="cink__opt-text">{o.text.trim()}{o.text === originals.current[open!] && current.edited ? <em> original</em> : null}</span>
              <span className="cink__opt-p">{pct(o.p)}</span>
              <i aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      <footer className="cink__foot">
        <span>{low.size} {low.size === 1 ? "word" : "words"} below {pct(threshold)}{edited ? ` · ${edited} changed by you` : ""}</span>
        <span className="cink__key" aria-hidden="true"><span className="cink__sample" style={{ "--ink": 0.55 } as CSSProperties}>unsure</span><span className="cink__sample cink__sample--edit">changed</span></span>
      </footer>
      <p className="cink__sr" aria-live="polite">{message}</p>
    </div>
  );
}
