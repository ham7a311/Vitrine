"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { fitHeight, normaliseLink, step } from "./afterglow";
import "./afterglow-prompt.css";

/**
 * Afterglow Prompt
 * A dark glass prompt box whose rim burns violet down one side and amber round the other, as if
 * lit by a low sun. Underneath the text: a library of starter prompts, a link you can attach, a
 * mic switch and send.
 */

export type AfterglowSubmit = { text: string; link: string | null; mic: boolean };

type Props = {
  placeholder?: string;
  defaultValue?: string;
  prompts?: string[];
  onSubmit?: (value: AfterglowSubmit) => void;
  /** [cool side, warm side] */
  glow?: [string, string];
  className?: string;
  style?: CSSProperties;
};

const PROMPTS = [
  "Provide complex widgets to improve dashboard clarity",
  "Rewrite this onboarding email so it feels warmer",
  "Summarise the last three product reviews in five bullets",
  "Turn these meeting notes into a short action list",
];

function Icon({ name }: { name: "prompts" | "link" | "mic" | "send" }) {
  return (
    <svg className={`aglp__icon aglp__icon--${name}`} viewBox="0 0 24 24" aria-hidden="true">
      {name === "prompts" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3.6 19.3 16.2H4.7Z" />
        </>
      )}
      {name === "link" && <path d="M10 14a4.2 4.2 0 0 0 6 0l3-3a4.2 4.2 0 0 0-6-6l-1 1M14 10a4.2 4.2 0 0 0-6 0l-3 3a4.2 4.2 0 0 0 6 6l1-1" />}
      {name === "mic" && (
        <>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
        </>
      )}
      {name === "send" && <path d="M5 4.5 20 12 5 19.5l2.2-7.5Z" />}
    </svg>
  );
}

export function AfterglowPrompt({ placeholder = "Ask for anything…", defaultValue = "", prompts = PROMPTS, onSubmit, glow = ["#7a66ff", "#f6a33f"], className = "", style }: Props) {
  const [text, setText] = useState(defaultValue);
  const [mic, setMic] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkDraft, setLinkDraft] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const promptsBtn = useRef<HTMLButtonElement>(null);
  const menuWrap = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const linkInput = useRef<HTMLInputElement>(null);
  const ids = { input: useId(), menu: useId(), link: useId() };
  const ready = text.trim() !== "";
  const draftValid = normaliseLink(linkDraft);

  useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = "auto";
    const lh = parseFloat(getComputedStyle(el).lineHeight) || 22;
    el.style.height = `${fitHeight(el.scrollHeight, lh)}px`;
  }, [text]);

  useEffect(() => {
    if (open) items.current[active]?.focus();
  }, [open, active]);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => !menuWrap.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  useEffect(() => {
    if (linkOpen) linkInput.current?.focus();
  }, [linkOpen]);

  const closeMenu = (refocus = true) => {
    setOpen(false);
    if (refocus) promptsBtn.current?.focus();
  };
  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => step(i, e.key === "ArrowDown" ? 1 : -1, prompts.length));
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      setActive(e.key === "Home" ? 0 : prompts.length - 1);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
    } else if (e.key === "Tab") {
      closeMenu(false);
    }
  };
  const choose = (p: string) => {
    setText(p);
    setOpen(false);
    requestAnimationFrame(() => {
      const el = area.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(p.length, p.length);
    });
  };
  const send = () => {
    if (!ready) return;
    onSubmit?.({ text: text.trim(), link, mic });
    setText("");
    setLink(null);
  };
  const saveLink = () => {
    if (!draftValid) return;
    setLink(draftValid);
    setLinkDraft("");
    setLinkOpen(false);
  };

  return (
    <form
      className={`aglp ${className}`}
      style={{ ["--aglp-cool" as string]: glow[0], ["--aglp-warm" as string]: glow[1], ...style }}
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
    >
      <span className="aglp__bloom" aria-hidden="true" />
      <div className="aglp__box">
        <label className="aglp__sr" htmlFor={ids.input}>
          Prompt
        </label>
        <textarea
          id={ids.input}
          ref={area}
          className="aglp__input"
          rows={2}
          value={text}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              send();
            }
          }}
        />
        {(linkOpen || link) && (
          <div className="aglp__link-row">
            {link && !linkOpen ? (
              <span className="aglp__link-chip">
                <Icon name="link" />
                <span>{new URL(link).hostname}</span>
                <button type="button" aria-label="Remove link" onClick={() => setLink(null)}>
                  ×
                </button>
              </span>
            ) : (
              <>
                <label className="aglp__sr" htmlFor={ids.link}>
                  Link to attach
                </label>
                <input
                  id={ids.link}
                  ref={linkInput}
                  className="aglp__link-input"
                  type="url"
                  inputMode="url"
                  placeholder="Paste a link"
                  value={linkDraft}
                  aria-invalid={linkDraft !== "" && !draftValid}
                  onChange={(e) => setLinkDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      saveLink();
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      setLinkOpen(false);
                    }
                  }}
                />
                <button type="button" className="aglp__link-add" disabled={!draftValid} onClick={saveLink}>
                  Attach
                </button>
              </>
            )}
          </div>
        )}
        <div className="aglp__bar">
          <div className="aglp__menu-wrap" ref={menuWrap}>
            <button
              ref={promptsBtn}
              type="button"
              className="aglp__prompts"
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls={open ? ids.menu : undefined}
              onClick={() => (open ? closeMenu() : (setActive(0), setOpen(true)))}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive(e.key === "ArrowUp" ? prompts.length - 1 : 0);
                  setOpen(true);
                }
              }}
            >
              <Icon name="prompts" />
              <span>Prompts</span>
            </button>
            {open && (
              <div className="aglp__menu" role="menu" id={ids.menu} aria-label="Starter prompts" onKeyDown={onMenuKey}>
                {prompts.map((p, i) => (
                  <button
                    key={p}
                    ref={(el) => {
                      items.current[i] = el;
                    }}
                    type="button"
                    role="menuitem"
                    tabIndex={i === active ? 0 : -1}
                    className="aglp__item"
                    data-active={i === active || undefined}
                    onPointerEnter={() => setActive(i)}
                    onClick={() => choose(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="aglp__spacer" />
          <button type="button" className="aglp__link" aria-label={link ? "Change attached link" : "Attach a link"} aria-expanded={linkOpen} onClick={() => setLinkOpen((v) => !v)}>
            <Icon name="link" />
          </button>
          <span className="aglp__mic" data-on={mic || undefined}>
            <Icon name="mic" />
            <span>Mic</span>
            <button type="button" role="switch" aria-checked={mic} aria-label="Microphone" className="aglp__switch" onClick={() => setMic((v) => !v)}>
              <span className="aglp__knob" />
            </button>
          </span>
          <button type="submit" className="aglp__send" aria-label="Send" disabled={!ready}>
            <Icon name="send" />
          </button>
        </div>
      </div>
    </form>
  );
}
