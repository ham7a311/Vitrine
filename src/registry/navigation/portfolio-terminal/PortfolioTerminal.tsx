"use client";
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { plate } from "./plate";
import { COMMANDS, FILES, completions, expand, findProject, nextSteps, parse, suggest, type Cwd, type Portfolio } from "./shell";
import "./portfolio-terminal.css";

/**
 * Portfolio Terminal
 * A terminal whose output is the navigation. Everything it prints that you could go to — a project, a
 * folder, a command — is a live token: click it and the command types itself and runs, so a visitor who
 * has never used a shell can still find their way, and the scrollback becomes the path they took.
 */

type Tok = { t: string; run?: string; act?: "copy"; k?: "dir" | "proj" | "cmd" };
type Seg = string | Tok | { dim: string } | { em: string };
type Line = { ok?: boolean; segs: Seg[]; cls?: "head" | "err" | "gap" | "wrap" | "rule" | "ok" | "plate" | "kv"; rows?: string[] };
type Entry = { n: number; cwd: Cwd; input: string; lines: Line[]; cancelled?: boolean };

export type PortfolioTerminalProps = {
  portfolio: Portfolio;
  /** Command typed on load. Pass "" to start with an empty prompt. */
  boot?: string;
  theme?: "night" | "paper";
  className?: string;
};

const pad = (s: string, n: number) => s + " ".repeat(Math.max(1, n - s.length));
const two = (n: number) => String(n).padStart(2, "0");
const L = (...segs: Seg[]): Line => ({ segs });
const gap: Line = { segs: [], cls: "gap" };
const KV = (k: string, ...v: Seg[]): Line => ({ segs: [{ dim: k }, ...v], cls: "kv" });

export function PortfolioTerminal({ portfolio: P, boot = "whoami", theme = "night", className = "" }: PortfolioTerminalProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [cwd, setCwd] = useState<Cwd>("~");
  const [input, setInput] = useState("");
  const [caret, setCaret] = useState(0);
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState<number | null>(null); // position while walking history
  const [shown, setShown] = useState(Infinity); // lines of the newest entry revealed so far
  const [typing, setTyping] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);
  const tab = useRef<{ base: string; i: number } | null>(null);
  const field = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const pinned = useRef(true);
  const seq = useRef(0);
  const timers = useRef<number[]>([]);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ts = timers.current;
    return () => ts.forEach(clearTimeout);
  }, []);

  /* ---------------- what each command prints ---------------- */
  const render = useCallback(
    (raw: string, at: Cwd): { lines: Line[]; cwd?: Cwd; clear?: boolean } => {
      const line = expand(raw);
      const { cmd, args } = parse(line);
      const arg = (args[0] ?? "").toLowerCase();

      if (!cmd) return { lines: [] };
      if (cmd === "clear") return { lines: [], clear: true };

      if (cmd === "whoami")
        return {
          lines: [
            { segs: [P.name], cls: "head" },
            L({ dim: `${P.role} · ${P.place}` }),
            gap,
            ...P.bio.flatMap((b, i): Line[] => [...(i ? [gap] : []), { segs: [b], cls: "wrap" }]),
            gap,
            KV("now", P.now),
            gap,
            L({ dim: "start with  " }, { t: "ls work", run: "ls work", k: "cmd" }, { dim: "  ·  " }, { t: "experience", run: "experience", k: "cmd" }, { dim: "  ·  " }, { t: "contact", run: "contact", k: "cmd" }),
          ],
        };

      if (cmd === "ls") {
        const inWork = arg === "work" || arg === "work/" || (at === "~/work" && !arg);
        if (inWork)
          return {
            lines: [
              L({ dim: `${P.projects.length} projects · newest first · click a name to open it` }),
              gap,
              ...P.projects.map((p, i) => L({ dim: `${two(i + 1)}  ` }, { t: p.name, run: `open ${p.slug}`, k: "proj" }, " ".repeat(Math.max(2, 16 - p.name.length)), { dim: `${p.year}  ` }, p.kind)),
            ],
          };
        if (arg && arg !== "~") return { lines: [{ segs: [`ls: ${args[0]}: no such folder`], cls: "err" }] };
        return {
          lines: [L({ t: "work/", run: "ls work", k: "dir" }, "   ", ...FILES.flatMap((f): Seg[] => [{ t: f, run: `cat ${f}` }, "   "]))],
        };
      }

      if (cmd === "cd") {
        if (!arg || arg === "~" || arg === ".." || arg === "/") return { lines: [], cwd: "~" };
        if (arg === "work" || arg === "work/" || arg === "~/work") return { lines: [L({ dim: "→ " }, { t: "ls", run: "ls", k: "cmd" }, { dim: " to see the projects" })], cwd: "~/work" };
        const p = findProject(P, arg);
        if (p) return { lines: [{ segs: [`cd: ${arg} is a project, not a folder — try `, { t: `open ${p.slug}`, run: `open ${p.slug}`, k: "cmd" }], cls: "err" }] };
        return { lines: [{ segs: [`cd: ${args[0]}: no such folder`], cls: "err" }] };
      }

      if (cmd === "open") {
        const p = arg ? findProject(P, arg) : undefined;
        if (!p)
          return {
            lines: [
              { segs: [arg ? `open: no project called “${args[0]}”` : "open: which one?"], cls: "err" },
              L({ dim: "try  " }, ...P.projects.flatMap((x, i): Seg[] => [{ t: x.slug, run: `open ${x.slug}`, k: "proj" }, i < P.projects.length - 1 ? { dim: "  ·  " } : ""])),
            ],
          };
        const i = P.projects.indexOf(p);
        const prev = P.projects[(i - 1 + P.projects.length) % P.projects.length];
        const next = P.projects[(i + 1) % P.projects.length];
        return {
          lines: [
            { segs: [{ dim: `${two(i + 1)} / ${two(P.projects.length)}` }, "  ", { em: p.name }, "  ", { dim: p.year }], cls: "rule" },
            { segs: [], cls: "plate", rows: plate(p.name) },
            KV("what", p.kind),
            KV("role", p.role),
            KV("stack", p.stack.join(" · ")),
            gap,
            { segs: [p.summary], cls: "wrap" },
            gap,
            { ...KV("outcome", p.outcome), ok: true },
            gap,
            L({ t: `← ${prev.slug}`, run: `open ${prev.slug}`, k: "proj" }, "    ", { t: `${next.slug} →`, run: `open ${next.slug}`, k: "proj" }, "    ", { t: "all work", run: "ls work", k: "cmd" }),
          ],
        };
      }

      if (cmd === "experience") {
        const w = Math.max(...P.experience.map((j) => j.years.length)) + 3;
        return {
          lines: P.experience.flatMap((j, i): Line[] => [
            L({ dim: pad(j.years, w) }, i === 0 ? "●  " : "○  ", { em: j.title }, { dim: " — " }, j.org),
            L({ dim: " ".repeat(w) + (i === P.experience.length - 1 ? "   " : "│  ") }, { dim: j.note }),
            ...(i === P.experience.length - 1 ? [] : [L({ dim: " ".repeat(w) + "│" })]),
          ]),
        };
      }

      if (cmd === "skills") {
        const w = Math.max(...P.skills.flatMap((g) => g.items.map(([n]) => n.length))) + 3;
        return {
          lines: P.skills.flatMap((g, gi): Line[] => [
            ...(gi ? [gap] : []),
            L({ dim: g.group.toLowerCase() }),
            ...g.items.map(([n, v]) => {
              const full = Math.round(v * 20);
              return L(pad(n, w), { em: "█".repeat(Math.floor(full / 2)) + (full % 2 ? "▌" : "") }, { dim: "·".repeat(10 - Math.ceil(full / 2)) });
            }),
          ]),
        };
      }

      if (cmd === "contact")
        return {
          lines: [
            KV("email", { em: P.email }, "   ", { t: "copy", act: "copy" }),
            ...P.links.map((l) => KV(l.label, l.handle)),
            gap,
            L({ dim: "Replies within two working days. Short notes welcome." }),
          ],
        };

      if (cmd === "history")
        return {
          lines: hist.length
            ? hist.map((h, i) => L({ dim: `${String(i + 1).padStart(3)}  ` }, { t: h, run: h, k: "cmd" }))
            : [L({ dim: "nothing yet" })],
        };

      if (cmd === "help")
        return {
          lines: [
            ...COMMANDS.map((c) => L({ t: c.name, run: c.name === "open" ? `open ${P.projects[0].slug}` : c.name === "cd" ? "cd work" : c.name, k: "cmd" }, " ".repeat(12 - c.name.length), { dim: c.does })),
            gap,
            L({ dim: "tab completes · ↑ ↓ history · ctrl+c cancels · anything underlined is clickable" }),
          ],
        };

      const near = suggest(cmd);
      return {
        lines: [
          {
            segs: [`not found: ${cmd}`, ...(near ? [" — did you mean ", { t: near, run: [near, ...args].join(" "), k: "cmd" } as Tok, "?"] : []), { dim: "  ·  " }, { t: "help", run: "help", k: "cmd" }],
            cls: "err",
          },
        ],
      };
    },
    [P, hist],
  );

  /* ---------------- running a command ---------------- */
  const exec = useCallback(
    (raw: string, cancelled = false) => {
      const at = cwd;
      const n = ++seq.current;
      if (cancelled) {
        setEntries((e) => [...e, { n, cwd: at, input: raw, lines: [], cancelled: true }]);
        return;
      }
      const out = render(raw, at);
      if (raw.trim()) setHist((h) => (h[h.length - 1] === raw.trim() ? h : [...h, raw.trim()]));
      if (out.cwd) setCwd(out.cwd);
      pinned.current = true;
      if (out.clear) {
        setEntries([]);
        return;
      }
      setShown(reduced.current ? Infinity : 0);
      setEntries((e) => [...e, { n, cwd: at, input: raw, lines: out.lines }]);
    },
    [cwd, render],
  );

  /* Reveal the newest entry a line at a time. */
  const newest = entries[entries.length - 1];
  useEffect(() => {
    if (!newest || shown >= newest.lines.length) return;
    const t = window.setTimeout(() => setShown((s) => s + 1), newest.lines[shown]?.cls === "plate" ? 90 : 16);
    return () => clearTimeout(t);
  }, [newest, shown]);

  /* Stay pinned to the bottom unless the reader scrolled up. */
  useLayoutEffect(() => {
    const s = scroller.current;
    if (s && pinned.current) s.scrollTop = s.scrollHeight;
  }, [entries, shown, input]);

  /** Type a command into the prompt, visibly, then run it: clicking teaches the command. */
  const typeAndRun = useCallback(
    (cmd: string) => {
      if (typing) return;
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setHi(null);
      tab.current = null;
      // Hand the prompt back after a click, so the next keystroke goes to the shell — except on touch,
      // where focusing would throw up the keyboard.
      if (!window.matchMedia("(pointer: coarse)").matches) field.current?.focus({ preventScroll: true });
      if (reduced.current) {
        setInput("");
        exec(cmd);
        return;
      }
      setTyping(true);
      setInput("");
      [...cmd].forEach((_, i) => {
        timers.current.push(window.setTimeout(() => { setInput(cmd.slice(0, i + 1)); setCaret(i + 1); }, 18 + i * 22));
      });
      timers.current.push(
        window.setTimeout(() => {
          setInput("");
          setCaret(0);
          setTyping(false);
          exec(cmd);
        }, 18 + cmd.length * 22 + 140),
      );
    },
    [exec, typing],
  );

  /* Boot: introduce yourself. */
  const runRef = useRef(typeAndRun);
  runRef.current = typeAndRun;
  useEffect(() => {
    if (!boot) return;
    const t = window.setTimeout(() => runRef.current(boot), 350);
    return () => clearTimeout(t);
  }, [boot]);

  const ghost = (() => {
    if (typing || !input || caret !== input.length) return "";
    const c = completions(input, P, cwd)[0];
    return c ? c.slice(input.length) : "";
  })();

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (typing) { e.preventDefault(); return; }
    const k = e.key;
    if (k !== "Tab") tab.current = null;
    if (k === "Enter") {
      e.preventDefault();
      setHi(null);
      setInput("");
      setCaret(0);
      exec(input);
    } else if (k === "Tab") {
      e.preventDefault();
      const base = tab.current?.base ?? input;
      const all = completions(base, P, cwd);
      if (!all.length) return;
      const i = tab.current ? (tab.current.i + (e.shiftKey ? all.length - 1 : 1)) % all.length : 0;
      tab.current = { base, i };
      setInput(all[i]);
      setCaret(all[i].length);
    } else if (k === "ArrowRight" && ghost && caret === input.length) {
      e.preventDefault();
      setInput(input + ghost);
      setCaret(input.length + ghost.length);
    } else if (k === "ArrowUp" || k === "ArrowDown") {
      if (!hist.length) return;
      e.preventDefault();
      const cur = hi ?? hist.length;
      const to = Math.max(0, Math.min(hist.length, cur + (k === "ArrowUp" ? -1 : 1)));
      setHi(to === hist.length ? null : to);
      const v = to === hist.length ? "" : hist[to];
      setInput(v);
      setCaret(v.length);
    } else if ((e.ctrlKey || e.metaKey) && k.toLowerCase() === "l") {
      e.preventDefault();
      setEntries([]);
    } else if (e.ctrlKey && k.toLowerCase() === "c" && !window.getSelection()?.toString()) {
      e.preventDefault();
      exec(input, true);
      setInput("");
      setCaret(0);
    } else if (k === "Escape") {
      setInput("");
      setCaret(0);
      setHi(null);
    }
  };

  const copy = async (n: number) => {
    try {
      await navigator.clipboard.writeText(P.email);
    } catch {
      /* Clipboard can be blocked; the address is on screen either way. */
    }
    setCopied(n);
  };

  const seg = (s: Seg, i: number, entry: Entry): ReactNode => {
    if (typeof s === "string") return <Fragment key={i}>{s}</Fragment>;
    if ("dim" in s) return <span key={i} className="ptrm__dim">{s.dim}</span>;
    if ("em" in s) return <span key={i} className="ptrm__em">{s.em}</span>;
    if (s.act === "copy")
      return (
        <button key={i} type="button" className="ptrm__tok ptrm__tok--act" onClick={() => copy(entry.n)}>
          {copied === entry.n ? "copied ✓" : s.t}
        </button>
      );
    return (
      <button key={i} type="button" className="ptrm__tok" data-k={s.k} onClick={() => typeAndRun(s.run!)} aria-label={`Run: ${s.run}`}>
        {s.t}
      </button>
    );
  };

  const prompt = (at: Cwd) => (
    <span className="ptrm__ps" aria-hidden="true">
      <span className="ptrm__host">{P.handle}</span>
      <span className="ptrm__cwd">{at}</span>
      <span className="ptrm__sigil">›</span>
    </span>
  );

  const rail = nextSteps(P, cwd, hist[hist.length - 1] ?? "");
  const before = input.slice(0, caret);
  const under = input[caret] ?? (ghost ? ghost[0] : " ");
  const after = input.slice(caret + 1);

  return (
    <div className={`ptrm ptrm--${theme} ${className}`} data-focused={focused || undefined} data-typing={typing || undefined}>
      <div className="ptrm__bar">
        <span className="ptrm__title">
          <b>{P.name}</b>
          <span aria-hidden="true"> — </span>
          <span className="ptrm__where">{cwd === "~" ? "index" : "work"}</span>
        </span>
        <span className="ptrm__keys" aria-hidden="true">
          <kbd>tab</kbd> complete <kbd>↑</kbd> history <kbd>ctrl l</kbd> clear
        </span>
      </div>

      <div
        ref={scroller}
        className="ptrm__screen"
        onScroll={(e) => {
          const s = e.currentTarget;
          pinned.current = s.scrollHeight - s.scrollTop - s.clientHeight < 24;
        }}
        onClick={(e) => {
          // Desktop: clicking the page puts you at the prompt. Touch: only the prompt raises the keyboard.
          if ((e.target as HTMLElement).closest("button") || window.getSelection()?.toString()) return;
          if (window.matchMedia("(pointer: fine)").matches) field.current?.focus();
        }}
      >
        <div className="ptrm__log" role="log" aria-live="polite" aria-label="Terminal output">
          {entries.length === 0 && !typing && (
            <p className="ptrm__empty">
              Screen cleared. Type <button type="button" className="ptrm__tok" data-k="cmd" onClick={() => typeAndRun("help")}>help</button> or pick a command below.
            </p>
          )}
          {entries.map((en) => {
            const live = en === newest;
            const count = live ? Math.min(shown, en.lines.length) : en.lines.length;
            return (
              <section key={en.n} className="ptrm__entry" aria-label={`${en.input || "empty"} — output`}>
                <p className="ptrm__cmd">
                  <span className="ptrm__n" aria-hidden="true">{two(en.n)}</span>
                  {prompt(en.cwd)}
                  <span className="ptrm__in">{en.input}</span>
                  {en.cancelled && <span className="ptrm__dim">^C</span>}
                </p>
                {en.lines.slice(0, count).map((l, i) =>
                  l.cls === "plate" ? (
                    <div key={i} className="ptrm__plate" role="img" aria-label={`Generated cover pattern for ${en.input.split(" ").pop()}`}>
                      {l.rows!.map((r, j) => (
                        <span key={j} style={{ ["--j" as string]: j }}>{r}</span>
                      ))}
                    </div>
                  ) : (
                    <p key={i} className={`ptrm__out${l.cls ? ` ptrm__out--${l.cls}` : ""}`} data-ok={l.ok || undefined}>
                      {l.cls === "kv" ? (
                        <>
                          {seg(l.segs[0], 0, en)}
                          <span>{l.segs.slice(1).map((s, j) => seg(s, j + 1, en))}</span>
                        </>
                      ) : (
                        l.segs.map((s, j) => seg(s, j, en))
                      )}
                    </p>
                  ),
                )}
              </section>
            );
          })}
        </div>

        <div className="ptrm__prompt">
          <span className="ptrm__n" aria-hidden="true">{two(seq.current + 1)}</span>
          {prompt(cwd)}
          <label className="ptrm__line">
            <span className="ptrm__sr">Command (type help for a list)</span>
            <span className="ptrm__render" aria-hidden="true">
              {before}
              <span className="ptrm__caret">{under}</span>
              {after}
              {ghost && <span className="ptrm__ghost">{ghost.slice(input[caret] === undefined ? 1 : 0)}</span>}
            </span>
            <input
              ref={field}
              value={input}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="go"
              readOnly={typing}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={(e) => {
                setInput(e.target.value);
                setCaret(e.target.selectionStart ?? e.target.value.length);
                setHi(null);
                tab.current = null;
              }}
              onSelect={(e) => setCaret(e.currentTarget.selectionStart ?? input.length)}
              onKeyDown={onKey}
            />
          </label>
        </div>
      </div>

      <nav className="ptrm__rail" aria-label="Suggested commands">
        <span className="ptrm__try" aria-hidden="true">try</span>
        <ul>
          {rail.map((c) => (
            <li key={c}>
              <button type="button" disabled={typing} onClick={() => typeAndRun(c)}>
                {c}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
