"use client";
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import "./keymap.css";

export type Shortcut = { keys: string; action: string; group: string };
export type KeymapProps = {
  shortcuts: Shortcut[];
  /** Detected after mount when left out. */
  platform?: "mac" | "other";
  title?: string;
  theme?: "light" | "dark";
  className?: string;
};

type Mod = "mod" | "shift" | "alt";
const MODS: Mod[] = ["mod", "shift", "alt"];
// ANSI rows; numbers are widths in key units.
const ROWS: [string, number][][] = [
  [["`", 1], ["1", 1], ["2", 1], ["3", 1], ["4", 1], ["5", 1], ["6", 1], ["7", 1], ["8", 1], ["9", 1], ["0", 1], ["-", 1], ["=", 1], ["Backspace", 2]],
  [["Tab", 1.5], ["Q", 1], ["W", 1], ["E", 1], ["R", 1], ["T", 1], ["Y", 1], ["U", 1], ["I", 1], ["O", 1], ["P", 1], ["[", 1], ["]", 1], ["\\", 1.5]],
  [["Caps", 1.75], ["A", 1], ["S", 1], ["D", 1], ["F", 1], ["G", 1], ["H", 1], ["J", 1], ["K", 1], ["L", 1], [";", 1], ["'", 1], ["Enter", 2.25]],
  [["shift", 2.25], ["Z", 1], ["X", 1], ["C", 1], ["V", 1], ["B", 1], ["N", 1], ["M", 1], [",", 1], [".", 1], ["/", 1], ["shift", 2.75]],
  [["ctrl", 1.25], ["alt", 1.25], ["mod", 1.25], ["Space", 6.25], ["mod", 1.25], ["alt", 1.25], ["ArrowLeft", 1], ["ArrowUp", 1], ["ArrowDown", 1], ["ArrowRight", 1]],
];
const ARROWS: Record<string, string> = { ArrowLeft: "←", ArrowUp: "↑", ArrowDown: "↓", ArrowRight: "→" };

type Parsed = Shortcut & { key: string; mods: Set<Mod>; combo: string };
function parse(s: Shortcut): Parsed {
  const parts = s.keys.split("+").map((p) => p.trim());
  const mods = new Set<Mod>();
  let key = "";
  for (const p of parts) {
    const l = p.toLowerCase();
    if (l === "mod" || l === "cmd" || l === "ctrl" || l === "meta") mods.add("mod");
    else if (l === "shift") mods.add("shift");
    else if (l === "alt" || l === "option" || l === "opt") mods.add("alt");
    else key = p.length === 1 ? p.toUpperCase() : p;
  }
  return { ...s, key, mods, combo: `${MODS.filter((m) => mods.has(m)).join("+")}+${key}` };
}

/**
 * Keymap
 * An app's shortcuts drawn on a keyboard. Choose (or hold) modifiers to see
 * which keys do what in that layer, search for an action to find its keys,
 * and see clashes where two actions claim the same combination.
 */
export function Keymap({ shortcuts, platform, title = "Keyboard shortcuts", theme = "light", className = "" }: KeymapProps) {
  const id = useId();
  const [os, setOs] = useState<"mac" | "other">(platform ?? "mac");
  useEffect(() => { if (!platform) setOs(/Mac|iPhone|iPad/.test(navigator.platform) ? "mac" : "other"); }, [platform]);
  const [layer, setLayer] = useState<Set<Mod>>(() => new Set(["mod"]));
  const [held, setHeld] = useState<Set<Mod> | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"keyboard" | "list">("keyboard");
  // One tab stop for the whole keyboard; arrows move between keys.
  const [rov, setRov] = useState<[number, number]>([2, 1]);
  const keyEls = useRef(new Map<string, HTMLButtonElement>());
  const moveRov = (e: KeyboardEvent<HTMLDivElement>) => {
    const [r, c] = rov;
    let nr = r, nc = c;
    if (e.key === "ArrowLeft") nc = Math.max(0, c - 1);
    else if (e.key === "ArrowRight") nc = Math.min(ROWS[r].length - 1, c + 1);
    else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      nr = Math.max(0, Math.min(ROWS.length - 1, r + (e.key === "ArrowUp" ? -1 : 1)));
      // Keep roughly the same horizontal position on the new row.
      const x = ROWS[r].slice(0, c).reduce((a, [, w]) => a + w, 0) + ROWS[r][c][1] / 2;
      let acc = 0; nc = ROWS[nr].length - 1;
      for (let i = 0; i < ROWS[nr].length; i++) { acc += ROWS[nr][i][1]; if (acc >= x) { nc = i; break; } }
    } else return;
    e.preventDefault();
    setRov([nr, nc]);
    keyEls.current.get(`${nr}-${nc}`)?.focus();
  };

  const parsed = useMemo(() => shortcuts.map(parse), [shortcuts]);
  const groups = useMemo(() => [...new Set(parsed.map((p) => p.group))], [parsed]);
  const clashes = useMemo(() => {
    const seen = new Map<string, number>();
    for (const p of parsed) seen.set(p.combo, (seen.get(p.combo) ?? 0) + 1);
    return new Set([...seen].filter(([, n]) => n > 1).map(([c]) => c));
  }, [parsed]);
  const active = held ?? layer;
  const same = (a: Set<Mod>, b: Set<Mod>) => a.size === b.size && [...a].every((m) => b.has(m));
  const inLayer = parsed.filter((p) => same(p.mods, active));
  const q = query.trim().toLowerCase();
  const matches = q ? parsed.filter((p) => p.action.toLowerCase().includes(q) || p.group.toLowerCase().includes(q)) : [];

  const sym = (m: Mod) => (os === "mac" ? { mod: "⌘", shift: "⇧", alt: "⌥" }[m] : { mod: "Ctrl", shift: "Shift", alt: "Alt" }[m]);
  const name = (m: Mod) => (os === "mac" ? { mod: "Command", shift: "Shift", alt: "Option" }[m] : { mod: "Control", shift: "Shift", alt: "Alt" }[m]);
  const show = (p: Parsed) => [...MODS.filter((m) => p.mods.has(m)).map(sym), ARROWS[p.key] ?? p.key].join(os === "mac" ? "" : "+");
  const colour = (g: string) => `var(--kmap-g${(groups.indexOf(g) % 5) + 1})`;
  const toggle = (m: Mod) => setLayer((l) => { const n = new Set(l); if (n.has(m)) n.delete(m); else n.add(m); return n; });

  // Holding real modifier keys previews that layer while the component has focus.
  const physical = (e: KeyboardEvent) => {
    const s = new Set<Mod>();
    if (os === "mac" ? e.metaKey : e.ctrlKey) s.add("mod");
    if (e.shiftKey) s.add("shift");
    if (e.altKey) s.add("alt");
    return s;
  };
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => { if (["Meta", "Control", "Shift", "Alt"].includes(e.key)) setHeld(physical(e)); };
  const onKeyUp = (e: KeyboardEvent<HTMLElement>) => { if (["Meta", "Control", "Shift", "Alt"].includes(e.key)) { const s = physical(e); setHeld(s.size ? s : null); } };

  const detail = focus ? parsed.filter((p) => p.key === focus) : [];
  const keyLabel = (k: string) => (k in ARROWS ? ARROWS[k] : k === "mod" ? sym("mod") : k === "shift" ? sym("shift") : k === "alt" ? sym("alt") : k === "ctrl" ? (os === "mac" ? "⌃" : "Ctrl") : k);
  const spoken = (k: string) => (k in ARROWS ? k.replace("Arrow", "") + " arrow" : k === "mod" || k === "shift" || k === "alt" ? name(k) : k === "ctrl" ? "Control" : k);

  return (
    <section className={`kmap kmap--${theme} ${className}`} aria-labelledby={`${id}-t`} onKeyDown={onKeyDown} onKeyUp={onKeyUp} onBlur={() => setHeld(null)}>
      <header className="kmap__bar">
        <h3 id={`${id}-t`} className="kmap__title">{title}</h3>
        <div className="kmap__mods" role="group" aria-label="Modifier layer">
          {MODS.map((m) => <button key={m} type="button" aria-pressed={active.has(m)} onClick={() => toggle(m)}><span aria-hidden="true">{sym(m)}</span><span className="kmap__sr">{name(m)}</span></button>)}
        </div>
        <label className="kmap__search">
          <span className="kmap__sr">Find a shortcut</span>
          <input type="search" placeholder="Find an action" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <div className="kmap__views" role="group" aria-label="View">
          <button type="button" aria-pressed={view === "keyboard"} onClick={() => setView("keyboard")}>Keyboard</button>
          <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}>List</button>
        </div>
      </header>

      {view === "keyboard" ? (
        <>
          <div className="kmap__board" role="group" aria-label={`Keys with ${[...active].map(name).join(" and ") || "no modifier"}`} onKeyDown={moveRov}>
            {ROWS.map((row, r) => (
              <div key={r} className="kmap__row">
                {row.map(([k, w], i) => {
                  const mod = k === "mod" || k === "shift" || k === "alt" ? (k as Mod) : null;
                  const bound = inLayer.filter((p) => p.key === k);
                  const clash = bound.some((p) => clashes.has(p.combo));
                  const hit = matches.some((p) => p.key === k);
                  const top = bound[0];
                  return (
                    <button
                      key={`${k}-${i}`}
                      ref={(el) => { if (el) keyEls.current.set(`${r}-${i}`, el); else keyEls.current.delete(`${r}-${i}`); }}
                      type="button"
                      tabIndex={rov[0] === r && rov[1] === i ? 0 : -1}
                      className="kmap__key"
                      style={{ flexGrow: w, "--c": top ? colour(top.group) : undefined } as CSSProperties}
                      data-bound={bound.length ? true : undefined}
                      data-clash={clash || undefined}
                      data-hit={hit || undefined}
                      data-mod={mod ? (active.has(mod) ? "on" : "off") : undefined}
                      aria-pressed={mod ? active.has(mod) : undefined}
                      aria-label={mod ? `${spoken(k)} modifier` : `${spoken(k)}${bound.length ? `: ${bound.map((b) => b.action).join(", ")}${clash ? " (conflict)" : ""}` : ""}`}
                      onClick={() => (mod ? toggle(mod) : setFocus(k))}
                      onFocus={() => { setRov([r, i]); if (!mod) setFocus(k); }}
                      onPointerEnter={() => !mod && setFocus(k)}
                    >
                      <span className="kmap__cap">{keyLabel(k)}</span>
                      {top && <span className="kmap__action">{clash ? "Conflict" : top.action}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="kmap__detail" aria-live="polite">
            {q ? (
              matches.length ? (
                <ul>{matches.map((p) => (
                  <li key={`${p.combo}-${p.action}`}>
                    <button type="button" onClick={() => { setLayer(new Set(p.mods)); setFocus(p.key); }}>
                      <kbd>{show(p)}</kbd><span>{p.action}</span><em style={{ "--c": colour(p.group) } as CSSProperties}>{p.group}</em>
                    </button>
                  </li>
                ))}</ul>
              ) : <p>No shortcut matches “{query}”.</p>
            ) : focus && detail.length ? (
              <ul>{detail.map((p) => (
                <li key={`${p.combo}-${p.action}`} data-clash={clashes.has(p.combo) || undefined}>
                  <kbd>{show(p)}</kbd><span>{p.action}</span><em style={{ "--c": colour(p.group) } as CSSProperties}>{clashes.has(p.combo) ? "Conflict" : p.group}</em>
                </li>
              ))}</ul>
            ) : <p>{inLayer.length} shortcuts use {[...active].map(sym).join(" ") || "no modifier"}. Point at a key, or hold the modifiers on your own keyboard.</p>}
          </div>
          <ul className="kmap__legend" aria-hidden="true">
            {groups.map((g) => <li key={g} style={{ "--c": colour(g) } as CSSProperties}>{g}</li>)}
            {clashes.size > 0 && <li className="kmap__legend-clash">{clashes.size} conflict{clashes.size > 1 ? "s" : ""}</li>}
          </ul>
        </>
      ) : (
        <div className="kmap__list">
          {groups.map((g) => {
            const rows = parsed.filter((p) => p.group === g && (!q || matches.includes(p)));
            if (!rows.length) return null;
            return (
              <table key={g}>
                <caption style={{ "--c": colour(g) } as CSSProperties}>{g}</caption>
                <tbody>{rows.map((p) => (
                  <tr key={`${p.combo}-${p.action}`} data-clash={clashes.has(p.combo) || undefined}>
                    <th scope="row">{p.action}{clashes.has(p.combo) && <span className="kmap__clash-note"> conflicts with another shortcut</span>}</th>
                    <td><kbd>{show(p)}</kbd></td>
                  </tr>
                ))}</tbody>
              </table>
            );
          })}
        </div>
      )}
    </section>
  );
}
