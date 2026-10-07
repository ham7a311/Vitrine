"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { fitHeight, glow, GLYPHS, moveKey } from "./composer";
import "./glyph-halo-composer.css";

/**
 * Glyph Halo Composer
 * A dark prompt box lit from both ends: a coral glow bleeds from its left, a blue one from its
 * right, and the light falls across a field of drifting characters behind it. Under the text, a
 * toolbar of quiet chips: attach, a reply style, a thinking mode (each a proper menu), voice and
 * send.
 */

type Option = { id: string; label: string; icon: ReactNode };

export type ComposerSubmit = { text: string; style: string; mode: string; voice: boolean; files: File[] };

type Props = {
  placeholder?: string;
  onSubmit?: (value: ComposerSubmit) => void;
  styles?: Option[];
  modes?: Option[];
  defaultStyle?: string;
  defaultMode?: string;
  /** Ends of the halo: [left, right]. */
  glows?: [string, string];
  className?: string;
  style?: CSSProperties;
};

const I = {
  plus: <path d="M12 5v14M5 12h14" />,
  feather: (
    <>
      <path d="M20.2 4.1a5.4 5.4 0 0 0-7.6 0L6 10.6V18h7.4l6.6-6.6a5.4 5.4 0 0 0 .2-7.3Z" />
      <path d="M16 8 3 21M17.5 15H9" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6M10 21.5h4M12 2.5a6.5 6.5 0 0 0-4 11.6c.6.5 1 1.2 1 2V16h6v-.9c0-.8.4-1.5 1-2A6.5 6.5 0 0 0 12 2.5Z" />
      <path d="m10.3 10.2 1.7 1.7 1.7-1.7M12 11.9V16" />
    </>
  ),
  bolt: <path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12l1-8Z" />,
  scale: (
    <>
      <path d="M5 4h14M7 4v6M12 4v6M17 4v6" />
      <circle cx="7" cy="13" r="2.6" />
      <circle cx="12" cy="13" r="2.6" />
      <circle cx="17" cy="13" r="2.6" />
      <path d="M6 20h12" />
    </>
  ),
  flask: (
    <>
      <path d="M9.5 3h5M10.5 3v5.4l-4.7 8A3 3 0 0 0 8.4 21h7.2a3 3 0 0 0 2.6-4.6l-4.7-8V3" />
      <circle cx="10.5" cy="15.5" r="0.9" />
      <circle cx="14" cy="17.5" r="0.9" />
    </>
  ),
  pen: <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4ZM13.5 6.5l4 4" />,
  list: <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />,
  tie: <path d="M10 3h4l-1 3 2 11-3 4-3-4 2-11-1-3Z" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  wave: <path d="M3 10v4M6.5 7v10M10 4v16M13.5 8v8M17 6v12M20.5 10v4" />,
  send: <path d="M21.2 2.8 2.9 10c-.9.3-.8 1.6.1 1.9l7 2.1 2.1 7c.3.9 1.6 1 1.9.1L21.2 2.8Z" />,
};

function Icon({ d, className = "" }: { d: ReactNode; className?: string }) {
  return (
    <svg className={`ghcm__icon ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      {d}
    </svg>
  );
}

const STYLES: Option[] = [
  { id: "normal", label: "Normal", icon: <Icon d={I.feather} /> },
  { id: "concise", label: "Concise", icon: <Icon d={I.list} /> },
  { id: "explanatory", label: "Explanatory", icon: <Icon d={I.pen} /> },
  { id: "formal", label: "Formal", icon: <Icon d={I.tie} /> },
];

const MODES: Option[] = [
  { id: "quick", label: "Quick answer", icon: <Icon d={I.bolt} /> },
  { id: "balanced", label: "Balanced", icon: <Icon d={I.scale} /> },
  { id: "deep", label: "DeepThink", icon: <Icon d={I.bulb} /> },
  { id: "research", label: "Research", icon: <Icon d={I.flask} /> },
];

/** A chip that opens a single-choice menu, with arrow keys, Home/End, Escape and focus return. */
function ChipMenu({ label, options, value, onChange }: { label: string; options: Option[]; value: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const chip = useRef<HTMLButtonElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const current = options.find((o) => o.id === value) ?? options[0];

  const show = (at = Math.max(0, options.findIndex((o) => o.id === value))) => {
    setActive(at);
    setOpen(true);
  };
  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) chip.current?.focus();
  };

  useEffect(() => {
    if (open) items.current[active]?.focus();
  }, [open, active]);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && close(false);
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  const onChipKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      show(e.key === "ArrowUp" ? options.length - 1 : undefined);
    }
  };
  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const next = moveKey(e.key, active, options.length);
    if (next != null) {
      e.preventDefault();
      setActive(next);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
    } else if (e.key === "Tab") {
      close(false);
    }
  };

  return (
    <div className="ghcm__menu-wrap" ref={wrap}>
      <button
        ref={chip}
        type="button"
        className="ghcm__chip"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label={`${label}: ${current.label}`}
        onClick={() => (open ? close() : show())}
        onKeyDown={onChipKey}
      >
        {current.icon}
        <span>{current.label}</span>
        <Icon d={I.chevron} className="ghcm__chev" />
      </button>
      {open && (
        <div className="ghcm__menu" role="menu" id={id} aria-label={label} onKeyDown={onMenuKey}>
          {options.map((o, i) => (
            <button
              key={o.id}
              ref={(el) => {
                items.current[i] = el;
              }}
              type="button"
              role="menuitemradio"
              aria-checked={o.id === value}
              tabIndex={i === active ? 0 : -1}
              className="ghcm__item"
              data-active={i === active || undefined}
              onPointerEnter={() => setActive(i)}
              onClick={() => {
                onChange(o.id);
                close();
              }}
            >
              {o.icon}
              <span>{o.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** The drifting characters behind the box, lit by the two glows. */
function GlyphField({ colors }: { colors: [string, string] }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = canvas.current;
    const host = cv?.parentElement;
    const ctx = cv?.getContext("2d");
    if (!cv || !host || !ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cells: { x: number; y: number; ch: string; a: number; c: number }[] = [];
    let raf = 0, last = 0, visible = true, alive = true;
    const pick = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
    const layout = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const w = host.clientWidth, h = host.clientHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const box = host.querySelector<HTMLElement>(".ghcm__box");
      const fs = parseFloat(getComputedStyle(host).fontSize) || 16;
      const hr = host.getBoundingClientRect();
      const br = box?.getBoundingClientRect();
      const bx = br ? br.left - hr.left : w * 0.15, by = br ? br.top - hr.top : h * 0.35;
      const bw = br?.width ?? w * 0.7, bh = br?.height ?? h * 0.3;
      const anchors = [
        { x: bx + bw * 0.02, y: by + bh * 0.1, rx: Math.max(bw * 0.3, fs * 9), ry: bh * 1.05 },
        { x: bx + bw * 0.98, y: by + bh * 0.9, rx: Math.max(bw * 0.32, fs * 10), ry: bh * 1.1 },
      ];
      const cw = fs * 1.35, ch = fs * 1.6;
      cells = [];
      for (let y = ch * 0.6; y < h; y += ch) {
        for (let x = cw * 0.5; x < w; x += cw) {
          const g = glow(x, y, anchors);
          if (g.value < 0.06 || Math.random() < 0.22) continue;
          cells.push({ x, y, ch: pick(), a: Math.min(1, g.value), c: g.which });
        }
      }
      ctx.font = `500 ${fs * 0.72}px "JetBrains Mono", "DM Mono", ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
    };
    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (const c of cells) {
        ctx.globalAlpha = c.a * 0.62;
        ctx.fillStyle = colors[c.c] ?? colors[0];
        ctx.fillText(c.ch, c.x, c.y);
      }
      ctx.globalAlpha = 1;
    };
    const tick = (now: number) => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      if (now - last > 85) {
        last = now;
        for (let i = 0; i < Math.max(2, cells.length * 0.03); i++) {
          const c = cells[(Math.random() * cells.length) | 0];
          if (c) c.ch = Math.random() < 0.15 ? " " : pick();
        }
        draw();
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (reduced || raf || !alive) return;
      raf = requestAnimationFrame(tick);
    };
    const ro = new ResizeObserver(() => {
      layout();
      draw();
    });
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(host);
    const onVis = () => !document.hidden && start();
    document.addEventListener("visibilitychange", onVis);
    document.fonts?.ready.then(() => alive && (layout(), draw()));
    layout();
    draw();
    start();
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [colors]);
  return <canvas ref={canvas} className="ghcm__field" aria-hidden="true" />;
}

export function GlyphHaloComposer({
  placeholder = "Ask anything…",
  onSubmit,
  styles = STYLES,
  modes = MODES,
  defaultStyle = "normal",
  defaultMode = "deep",
  glows = ["#ff6a3d", "#3d6bff"],
  className = "",
  style,
}: Props) {
  const [text, setText] = useState("");
  const [tone, setTone] = useState(defaultStyle);
  const [mode, setMode] = useState(defaultMode);
  const [voice, setVoice] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const area = useRef<HTMLTextAreaElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const empty = text.trim() === "";

  useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = "auto";
    const lh = parseFloat(getComputedStyle(el).lineHeight) || 24;
    el.style.height = `${fitHeight(el.scrollHeight, lh, 1, 8)}px`;
  }, [text]);

  const send = () => {
    if (empty) return;
    onSubmit?.({ text: text.trim(), style: tone, mode, voice, files });
    setText("");
    setFiles([]);
  };

  return (
    <div className={`ghcm ${className}`} style={{ ["--ghcm-a" as string]: glows[0], ["--ghcm-b" as string]: glows[1], ...style }}>
      <GlyphField colors={glows} />
      <div className="ghcm__frame">
      <span className="ghcm__glow ghcm__glow--a" aria-hidden="true" />
      <span className="ghcm__glow ghcm__glow--b" aria-hidden="true" />
      <form
        className="ghcm__box"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <label className="ghcm__sr" htmlFor={inputId}>
          Message
        </label>
        <textarea
          id={inputId}
          ref={area}
          className="ghcm__input"
          rows={1}
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
        {files.length > 0 && (
          <ul className="ghcm__files" aria-label="Attached files">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`}>
                <span>{f.name}</span>
                <button type="button" aria-label={`Remove ${f.name}`} onClick={() => setFiles((all) => all.filter((_, j) => j !== i))}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="ghcm__bar">
          <button type="button" className="ghcm__round" aria-label="Attach files" onClick={() => picker.current?.click()}>
            <Icon d={I.plus} />
          </button>
          <input ref={picker} type="file" multiple hidden onChange={(e) => setFiles((all) => [...all, ...Array.from(e.target.files ?? [])])} />
          <ChipMenu label="Reply style" options={styles} value={tone} onChange={setTone} />
          <ChipMenu label="Thinking mode" options={modes} value={mode} onChange={setMode} />
          <span className="ghcm__end">
            <button type="button" className="ghcm__chip ghcm__voice" aria-pressed={voice} onClick={() => setVoice((v) => !v)}>
              <Icon d={I.wave} className="ghcm__wave" />
              <span>Voice</span>
            </button>
            <button type="submit" className="ghcm__send" aria-label="Send" disabled={empty}>
              <Icon d={I.send} />
            </button>
          </span>
        </div>
      </form>
      </div>
    </div>
  );
}
