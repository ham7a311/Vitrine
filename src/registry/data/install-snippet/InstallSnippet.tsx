"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import "./install-snippet.css";

export type SnippetStep = { title: string; code: string; /** "shell" lines starting with $ get a prompt. */ lang?: "shell" | "python" | "js" | "sql" };
export type SnippetTab = { id: string; label: string; steps: SnippetStep[] };
export type InstallSnippetProps = {
  tabs: SnippetTab[];
  /** Remember the chosen tab across visits under this key. */
  storageKey?: string;
  theme?: "light" | "dark";
  className?: string;
};

/** Tints strings and comments, and gives shell prompts their own colour; everything else stays plain. */
function tint(code: string, lang: SnippetStep["lang"]): ReactNode[] {
  return code.split("\n").map((line, i) => {
    const parts: ReactNode[] = [];
    let rest = line;
    if (lang === "shell" && rest.startsWith("$ ")) { parts.push(<span key="p" className="isnip__prompt" aria-hidden="true">$ </span>); rest = rest.slice(2); }
    const re = /(#[^\n]*$|\/\/[^\n]*$|--[^\n]*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;
    let last = 0, m: RegExpExecArray | null;
    while ((m = re.exec(rest))) {
      if (m.index > last) parts.push(rest.slice(last, m.index));
      parts.push(<span key={m.index} className={m[1] ? "isnip__comment" : "isnip__string"}>{m[0]}</span>);
      last = m.index + m[0].length;
    }
    if (last < rest.length) parts.push(rest.slice(last));
    return <span key={i} className="isnip__line">{parts}{"\n"}</span>;
  });
}
const copyText = (code: string, lang: SnippetStep["lang"]) => (lang === "shell" ? code.split("\n").map((l) => l.replace(/^\$ /, "")).join("\n") : code);

/**
 * Install Snippet
 * The install-and-connect block of a developer page: tabs for each client,
 * numbered steps, hard-edged code blocks, and a copy button that only says
 * "Copied" when the clipboard really took it.
 */
export function InstallSnippet({ tabs, storageKey, theme = "light", className = "" }: InstallSnippetProps) {
  const id = useId();
  const [active, setActive] = useState(tabs[0]?.id);
  const [copied, setCopied] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const codeRefs = useRef(new Map<string, HTMLPreElement>());
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!storageKey) return;
    try { const saved = localStorage.getItem(storageKey); if (saved && tabs.some((t) => t.id === saved)) setActive(saved); } catch { /* storage unavailable */ }
  }, [storageKey, tabs]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const choose = (tabId: string, focus = false) => {
    setActive(tabId);
    if (storageKey) try { localStorage.setItem(storageKey, tabId); } catch { /* storage unavailable */ }
    if (focus) tabRefs.current.get(tabId)?.focus();
  };
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : null;
    if (n === null) return;
    e.preventDefault();
    choose(tabs[(n + tabs.length) % tabs.length].id, true);
  };

  const copy = async (key: string, step: SnippetStep) => {
    clearTimeout(timer.current);
    setFailed(null);
    try {
      await navigator.clipboard.writeText(copyText(step.code, step.lang));
      setCopied(key);
    } catch {
      // Fall back to selecting the code so the reader can copy it themselves.
      const el = codeRefs.current.get(key);
      if (el) { const range = document.createRange(); range.selectNodeContents(el); const sel = window.getSelection(); sel?.removeAllRanges(); sel?.addRange(range); }
      setCopied(null);
      setFailed(key);
    }
    timer.current = setTimeout(() => { setCopied(null); setFailed(null); }, 2200);
  };

  const tab = tabs.find((t) => t.id === active) ?? tabs[0];
  return (
    <div className={`isnip isnip--${theme} ${className}`}>
      <div className="isnip__tabs" role="tablist" aria-label="Client">
        {tabs.map((t, i) => (
          <button key={t.id} ref={(el) => { if (el) tabRefs.current.set(t.id, el); else tabRefs.current.delete(t.id); }} type="button" role="tab" id={`${id}-tab-${t.id}`} aria-selected={t.id === tab.id} aria-controls={`${id}-panel`} tabIndex={t.id === tab.id ? 0 : -1} className="isnip__tab" onClick={() => choose(t.id)} onKeyDown={(e) => onTabKey(e, i)}>{t.label}</button>
        ))}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${tab.id}`} className="isnip__panel">
        <ol className="isnip__steps">
          {tab.steps.map((step, i) => {
            const key = `${tab.id}-${i}`;
            return (
              <li key={key} className="isnip__step">
                <p className="isnip__step-title"><span className="isnip__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>{step.title}</p>
                <div className="isnip__block">
                  <pre ref={(el) => { if (el) codeRefs.current.set(key, el); else codeRefs.current.delete(key); }} className="isnip__code" tabIndex={0} aria-label={`${step.title}, code`}><code>{tint(step.code, step.lang)}</code></pre>
                  <button type="button" className="isnip__copy" data-state={copied === key ? "done" : failed === key ? "failed" : undefined} onClick={() => copy(key, step)} aria-label={`Copy: ${step.title}`}>
                    {copied === key ? "Copied" : failed === key ? "Selected" : "Copy"}
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="isnip__sr" role="status">{copied ? "Copied to clipboard." : failed ? "Copying isn't available here. The code is selected; copy it with your keyboard." : ""}</p>
    </div>
  );
}
