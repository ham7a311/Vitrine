"use client";
import { memo, useEffect, useId, useMemo, useRef, useState, type ClipboardEvent, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import { clock, find, sentences, turns, wordAt, type Word } from "./transcript";
import "./transcript-player.css";

export type { Word } from "./transcript";
export type Chapter = { title: string; start: number };
export type TranscriptPlayerProps = {
  /** Any audio URL the browser can play. */
  src?: string;
  words: Word[];
  chapters?: Chapter[];
  title: string;
  /** Speaker id → display name. */
  speakers?: Record<string, string>;
  theme?: "light" | "dark";
  className?: string;
};

const RATES = [1, 1.25, 1.5, 2];

type TurnProps = { words: Word[]; from: number; to: number; speaker?: string; current: number; hits: Map<number, boolean>; seek: (t: number) => void };
// Only the paragraph holding the current word (or a search hit) re-renders as playback moves.
const Turn = memo(function Turn({ words, from, to, speaker, current, hits, seek }: TurnProps) {
  return (
    <div className="tplay__turn" data-now={(current >= from && current <= to) || undefined}>
      <div className="tplay__who">
        {speaker && <strong>{speaker}</strong>}
        <button type="button" className="tplay__stamp" onClick={() => seek(words[from].start)} aria-label={`Play from ${clock(words[from].start)}${speaker ? `, ${speaker}` : ""}`}>{clock(words[from].start)}</button>
      </div>
      <p>
        {words.slice(from, to + 1).map((w, k) => {
          const i = from + k;
          const hit = hits.get(i);
          return <span key={i}><span className="tplay__w" data-i={i} data-now={i === current || undefined} data-said={i < current || undefined} data-hit={hit === undefined ? undefined : hit ? "on" : ""}>{w.text}</span>{i < to ? " " : ""}</span>;
        })}
      </p>
    </div>
  );
}, (a, b) => {
  const near = (p: TurnProps) => (p.current >= p.from && p.current <= p.to ? p.current : p.current < p.from ? -1 : -2);
  return a.from === b.from && a.hits === b.hits && near(a) === near(b) && a.words === b.words;
});

/**
 * Transcript Player
 * Audio with its transcript as the main control: the spoken word is lit as it
 * plays, clicking any word goes there, search hits appear as ticks on the
 * scrubber, and copied text carries its timestamp.
 */
export function TranscriptPlayer({ src, words, chapters = [], title, speakers = {}, theme = "light", className = "" }: TranscriptPlayerProps) {
  const id = useId();
  const audio = useRef<HTMLAudioElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [duration, setDuration] = useState(words.length ? words[words.length - 1].end + 0.5 : 0);
  const [rate, setRate] = useState(1);
  const [query, setQuery] = useState("");
  const [hit, setHit] = useState(-1);
  const [follow, setFollow] = useState(true);
  const [toast, setToast] = useState("");

  const groups = useMemo(() => turns(words), [words]);
  const starts = useMemo(() => sentences(words), [words]);
  const hitsList = useMemo(() => find(words, query), [words, query]);
  const hits = useMemo(() => {
    const m = new Map<number, boolean>();
    hitsList.forEach(([a, b], k) => { for (let i = a; i <= b; i++) m.set(i, k === hit); });
    return m;
  }, [hitsList, hit]);
  const current = wordAt(words, t);
  const chapter = chapters.reduce((c, ch, i) => (ch.start <= t + 0.05 ? i : c), -1);

  // Read the clock every frame while playing, but only re-render when a tenth of a second has passed.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => { const a = audio.current; if (a) setT((p) => (Math.floor(a.currentTime * 10) !== Math.floor(p * 10) ? a.currentTime : p)); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // Keep the spoken word in view unless the reader has scrolled away.
  useEffect(() => {
    if (!follow || current < 0) return;
    const el = box.current?.querySelector<HTMLElement>(`[data-i="${current}"]`), b = box.current;
    if (!el || !b) return;
    const top = el.offsetTop - b.offsetTop;
    if (top < b.scrollTop + 24 || top > b.scrollTop + b.clientHeight * 0.65) b.scrollTo({ top: Math.max(0, top - b.clientHeight * 0.3), behavior: "smooth" });
  }, [current, follow]);

  useEffect(() => { if (!toast) return; const k = setTimeout(() => setToast(""), 2200); return () => clearTimeout(k); }, [toast]);
  useEffect(() => { setHit(-1); }, [query]);

  const seek = (to: number) => {
    const v = Math.max(0, Math.min(duration, to));
    if (audio.current) audio.current.currentTime = v;
    setT(v);
    setFollow(true);
  };
  const toggle = () => { const a = audio.current; if (!a || !src) return; if (a.paused) void a.play(); else a.pause(); };
  const jumpSentence = (dir: 1 | -1) => {
    const cur = starts.reduce((c, s, i) => (s <= Math.max(current, 0) ? i : c), 0);
    // Going back from partway into a sentence restarts it first, as players do.
    const into = current >= 0 && t - words[starts[cur]].start > 1;
    const next = dir === 1 ? cur + 1 : into ? cur : cur - 1;
    const s = starts[Math.max(0, Math.min(starts.length - 1, next))];
    if (s !== undefined) seek(words[s].start);
  };
  const goHit = (dir: 1 | -1) => {
    if (!hitsList.length) return;
    const k = hit < 0 ? (dir === 1 ? Math.max(0, hitsList.findIndex(([a]) => words[a].start >= t)) : hitsList.length - 1) : (hit + dir + hitsList.length) % hitsList.length;
    setHit(k);
    seek(words[hitsList[k][0]].start);
  };

  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    const el = e.target as HTMLElement;
    const typing = el.tagName === "INPUT" && (el as HTMLInputElement).type !== "range";
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (k === " " && el.tagName !== "BUTTON") { e.preventDefault(); toggle(); }
    else if ((k === "ArrowLeft" || k === "ArrowRight") && el.tagName !== "INPUT") { e.preventDefault(); seek(t + (k === "ArrowRight" ? 5 : -5)); }
    else if (k === "j" || k === "J") { e.preventDefault(); jumpSentence(-1); }
    else if (k === "k" || k === "K") { e.preventDefault(); jumpSentence(1); }
    else if (k === "/") { e.preventDefault(); search.current?.focus(); }
  };
  const onWord = (e: MouseEvent<HTMLDivElement>) => {
    if (window.getSelection()?.toString()) return; // selecting to copy, not seeking
    const i = (e.target as HTMLElement).closest<HTMLElement>("[data-i]")?.dataset.i;
    if (i !== undefined) seek(words[+i].start);
  };
  const onCopy = (e: ClipboardEvent<HTMLDivElement>) => {
    const sel = window.getSelection();
    const text = sel?.toString().replace(/\s+/g, " ").trim();
    if (!sel || !text || !sel.rangeCount) return;
    const r = sel.getRangeAt(0);
    const first = [...(box.current?.querySelectorAll<HTMLElement>("[data-i]") ?? [])].find((n) => r.intersectsNode(n));
    if (!first) return;
    const at = clock(words[+first.dataset.i!].start);
    e.preventDefault();
    e.clipboardData.setData("text/plain", `“${text}” (${title}, ${at})`);
    setToast(`Copied with its timestamp, ${at}`);
  };

  const pct = (x: number) => `${(x / (duration || 1)) * 100}%`;

  return (
    <section className={`tplay tplay--${theme} ${className}`} onKeyDown={onKey} aria-labelledby={`${id}-t`}>
      <audio
        ref={audio}
        src={src}
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => { setPlaying(false); if (audio.current) setT(audio.current.currentTime); }}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={(e) => { if (Number.isFinite(e.currentTarget.duration)) setDuration(e.currentTarget.duration); e.currentTarget.playbackRate = rate; }}
        onSeeked={(e) => setT(e.currentTarget.currentTime)}
      />
      <header className="tplay__head">
        <button type="button" className="tplay__play" onClick={toggle} disabled={!src} aria-label={playing ? "Pause" : "Play"} data-playing={playing || undefined}>
          <svg viewBox="0 0 24 24" aria-hidden="true">{playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5.5v13l10.5-6.5z" />}</svg>
        </button>
        <div className="tplay__meta">
          <h3 id={`${id}-t`}>{title}</h3>
          <p>{chapter >= 0 ? chapters[chapter].title : "Ready"} · <span className="tplay__time">{clock(t)} / {clock(duration)}</span></p>
        </div>
        <button type="button" className="tplay__rate" onClick={() => { const r = RATES[(RATES.indexOf(rate) + 1) % RATES.length]; setRate(r); if (audio.current) audio.current.playbackRate = r; }} aria-label={`Speed ${rate} times`}>{rate}×</button>
      </header>

      <div className="tplay__scrub">
        <div className="tplay__rail" aria-hidden="true">
          <i className="tplay__fill" style={{ width: pct(t) }} />
          {chapters.slice(1).map((c) => <b key={c.start} className="tplay__chap" style={{ left: pct(c.start) }} />)}
          {hitsList.map(([a], k) => <em key={a} className="tplay__tick" data-on={k === hit || undefined} style={{ left: pct(words[a].start) }} />)}
        </div>
        <input type="range" min={0} max={duration || 1} step={0.1} value={Math.min(t, duration)} onChange={(e) => seek(+e.target.value)} aria-label="Seek" aria-valuetext={`${clock(t)} of ${clock(duration)}`} />
      </div>

      {chapters.length > 0 && (
        <nav className="tplay__chapters" aria-label="Chapters">
          {chapters.map((c, i) => (
            <button key={c.start} type="button" aria-current={i === chapter ? "true" : undefined} onClick={() => seek(c.start)}>
              <span>{clock(c.start)}</span>{c.title}
            </button>
          ))}
        </nav>
      )}

      <div className="tplay__find">
        <input
          ref={search}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); goHit(e.shiftKey ? -1 : 1); } else if (e.key === "Escape") setQuery(""); }}
          placeholder="Search the transcript  /"
          aria-label="Search the transcript"
          aria-describedby={`${id}-n`}
        />
        <span id={`${id}-n`} className="tplay__count" aria-live="polite">{query.trim() ? (hitsList.length ? `${hit >= 0 ? `${hit + 1} of ` : ""}${hitsList.length} ${hitsList.length === 1 ? "match" : "matches"}` : "No matches") : ""}</span>
        {hitsList.length > 0 && (
          <span className="tplay__nav">
            <button type="button" onClick={() => goHit(-1)} aria-label="Previous match">↑</button>
            <button type="button" onClick={() => goHit(1)} aria-label="Next match">↓</button>
          </span>
        )}
      </div>

      <div className="tplay__body">
        <div
          ref={box}
          className="tplay__text"
          onClick={onWord}
          onCopy={onCopy}
          onWheel={() => setFollow(false)}
          onTouchMove={() => setFollow(false)}
          tabIndex={0}
          aria-label={`Transcript of ${title}`}
          style={{ "--tplay-rate": rate } as CSSProperties}
        >
          {groups.map((g) => <Turn key={g.from} words={words} from={g.from} to={g.to} speaker={g.speaker ? speakers[g.speaker] ?? g.speaker : undefined} current={current} hits={hits} seek={seek} />)}
        </div>
        {!follow && playing && <button type="button" className="tplay__back" onClick={() => setFollow(true)}>Back to {clock(t)} ↓</button>}
        {toast && <p className="tplay__toast" role="status">{toast}</p>}
      </div>
      <p className="tplay__keys" aria-hidden="true">Space play · ← → 5 s · J K sentence · / search · click a word to go there · copy keeps the timestamp</p>
    </section>
  );
}
