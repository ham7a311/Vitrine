"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import "./sentence-settings.css";

/**
 * Sentence Settings
 * Preferences written as the sentence they mean. Each underlined word is the
 * current choice; press it and its alternatives open on a hairline right under
 * the word. The sentence rewrites itself to stay grammatical. The only motion is
 * a word changing.
 */

export type Option = { value: string; label: string };
export type FieldDef = { label: string; options: Option[] };

type Props<V extends Record<string, string>> = {
  fields: Record<keyof V & string, FieldDef>;
  value: V;
  onChange: (next: V) => void;
  /** Write the sentence; call slot(id) wherever a choice belongs. */
  sentence: (value: V, slot: (id: keyof V & string) => ReactNode) => ReactNode;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
};

export function SentenceSettings<V extends Record<string, string>>({ fields, value, onChange, sentence, theme = "paper", motion = "full" }: Props<V>) {
  const [open, setOpen] = useState<string | null>(null);
  const [heard, setHeard] = useState("");
  const uid = useId();
  const para = useRef<HTMLParagraphElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open === null) return;
    const away = (e: PointerEvent) => {
      if (!(e.target as Element).closest(`[data-ss="${uid}"]`)) setOpen(null);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open, uid]);

  useEffect(() => {
    // The whole sentence, in words, whenever it changes.
    const t = para.current?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    setHeard(t);
  }, [value]);

  const slot = (id: keyof V & string) => {
    const f = fields[id];
    const cur = f.options.find((o) => o.value === value[id]) ?? f.options[0];
    const isOpen = open === id;
    const popId = `${uid}-${id}`;
    return (
      <span className="sentence-settings__slot" data-open={isOpen || undefined}>
        <button
          type="button"
          className="sentence-settings__word"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? popId : undefined}
          aria-label={`${f.label}: ${cur.label}`}
          onClick={(e) => {
            lastFocus.current = e.currentTarget;
            setOpen(isOpen ? null : id);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              lastFocus.current = e.currentTarget;
              setOpen(id);
            }
          }}
        >
          <span key={cur.value} className="sentence-settings__text">
            {cur.label}
          </span>
        </button>
        {isOpen && (
          <span
            id={popId}
            role="listbox"
            aria-label={f.label}
            className="sentence-settings__pop"
            ref={(el) => el?.querySelector<HTMLElement>("[aria-selected='true']")?.focus({ preventScroll: true })}
            onKeyDown={(e) => {
              const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("[role=option]"));
              const i = items.indexOf(document.activeElement as HTMLElement);
              if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
              } else if (e.key === "Home" || e.key === "End") {
                e.preventDefault();
                items[e.key === "Home" ? 0 : items.length - 1]?.focus();
              } else if (e.key === "Escape" || e.key === "Tab") {
                if (e.key === "Escape") e.preventDefault();
                setOpen(null);
                lastFocus.current?.focus();
              }
            }}
          >
            {f.options.map((o) => (
              <span
                key={o.value}
                role="option"
                tabIndex={-1}
                aria-selected={o.value === value[id]}
                className="sentence-settings__option"
                onClick={() => {
                  onChange({ ...value, [id]: o.value });
                  setOpen(null);
                  lastFocus.current?.focus();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onChange({ ...value, [id]: o.value });
                    setOpen(null);
                    lastFocus.current?.focus();
                  }
                }}
              >
                {o.label}
              </span>
            ))}
          </span>
        )}
      </span>
    );
  };

  return (
    <div className={`sentence-settings sentence-settings--${theme}`} data-ss={uid} data-motion={motion}>
      <p ref={para} className="sentence-settings__p">
        {sentence(value, slot)}
      </p>
      <p className="sentence-settings__sr" role="status">
        {heard}
      </p>
    </div>
  );
}
