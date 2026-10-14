"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode, type RefObject } from "react";
import { compact, full, glyphs, noun, shown } from "./echo";
import "./echo-bar.css";

/**
 * Echo Bar
 * The action row under a post: reply, repost or quote, like, views, bookmark and share, each
 * with a live count. Toggles apply at once, rapid presses settle into one request for your
 * last intent, a failure puts the count back and says why, and counts arriving from the
 * server never double-count your own press.
 */

export type Toggle = "like" | "repost" | "bookmark";

export type EchoCounts = { replies: number; reposts: number; likes: number; views: number; bookmarks?: number };
export type EchoViewer = { liked: boolean; reposted: boolean; bookmarked: boolean };

type Props = {
  /** Server counts. They include the viewer's own like, repost and bookmark when `viewer` says so. */
  counts: EchoCounts;
  /** What the server last confirmed the viewer has done. */
  viewer: EchoViewer;
  /** Sends one toggle. Rejecting rolls it back; the error message becomes the reason shown. */
  commit?: (action: Toggle, on: boolean) => Promise<void>;
  onReply?: () => void;
  onQuote?: () => void;
  onSend?: () => void;
  /** The post's link, for Copy link and the system share sheet. */
  link: string;
  /** Rows for the Views popover. */
  analytics?: { label: string; value: number }[];
  /** When set, Reply is disabled and this says why. */
  replyLimit?: string;
  /** The author hid like and repost counts. */
  hideCounts?: boolean;
  /** Names the post in labels: "Post by Leila Haddad". */
  label?: string;
  /** Element whose focus enables L, R, T, S and B. Defaults to the bar itself. */
  scopeRef?: RefObject<HTMLElement | null>;
  motion?: "full" | "reduced";
  className?: string;
};

type Menu = "repost" | "share" | "views" | null;

const ICONS: Record<string, ReactNode> = {
  reply: <path d="M4.5 12a7.5 7 0 1 1 3.3 5.8L4 19l1.2-3.4A6.9 6.9 0 0 1 4.5 12Z" />,
  repost: (
    <>
      <path d="M7 7.5h9.5a2 2 0 0 1 2 2V13M18.5 13l-2.2-2.2M18.5 13l2.2-2.2" />
      <path d="M17 16.5H7.5a2 2 0 0 1-2-2V11M5.5 11l-2.2 2.2M5.5 11l2.2 2.2" />
    </>
  ),
  like: <path d="M12 19.6s-7-4.3-8.5-8.7C2.5 7.8 4.4 5 7.4 5c1.9 0 3.4 1 4.6 2.7C13.2 6 14.7 5 16.6 5c3 0 4.9 2.8 3.9 5.9-1.5 4.4-8.5 8.7-8.5 8.7Z" />,
  views: <path d="M5 19V12M10 19V6M15 19v-9M20 19V9" />,
  bookmark: <path d="M7 4.5h10a1 1 0 0 1 1 1v14l-6-3.8-6 3.8v-14a1 1 0 0 1 1-1Z" />,
  share: <path d="M12 15V4.5M7.8 8.5 12 4.3l4.2 4.2M5.5 13v5.5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V13" />,
};

const Icon = ({ name }: { name: string }) => (
  <svg className="echo__icon" viewBox="0 0 24 24" aria-hidden="true">
    {ICONS[name]}
  </svg>
);

/** A count where only the digits that changed roll, and a new suffix (K, M) fades in. */
function Rolling({ value }: { value: number }) {
  return (
    <span className="echo__num" aria-hidden="true">
      {glyphs(compact(value)).map((g) =>
        g.digit ? (
          <span key={g.key} className="echo__reel">
            <span style={{ translate: `0 ${-Number(g.char) * 10}%` }}>
              {"0123456789".split("").map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={g.key + g.char} className="echo__sym">
            {g.char}
          </span>
        ),
      )}
    </span>
  );
}

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

export function EchoBar({
  counts, viewer, commit, onReply, onQuote, onSend, link, analytics = [], replyLimit, hideCounts = false,
  label = "Post", scopeRef, motion = "full", className = "",
}: Props) {
  const id = useId();
  const barRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(480);
  const narrow = width < 340;

  // Intent is what the viewer meant; confirmed is what the server accepted. They differ only while sending.
  const [intent, setIntent] = useState<EchoViewer>(viewer);
  const intentRef = useRef(viewer);
  const confirmed = useRef(viewer);
  const inflight = useRef<Record<Toggle, boolean>>({ like: false, repost: false, bookmark: false });
  const [pending, setPending] = useState<Record<Toggle, boolean>>({ like: false, repost: false, bookmark: false });
  const [failed, setFailed] = useState<{ action: Toggle; beat: number } | null>(null);
  const [burst, setBurst] = useState(0);
  const [news, setNews] = useState("");
  const [menu, setMenu] = useState<Menu>(null);
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");
  const [focusIndex, setFocusIndex] = useState(0);
  const menuReturn = useRef<HTMLButtonElement | null>(null);

  const key = (a: Toggle) => (a === "like" ? "liked" : a === "repost" ? "reposted" : "bookmarked") as keyof EchoViewer;

  // A server update while nothing is in flight becomes the new truth for both sides.
  useEffect(() => {
    (["like", "repost", "bookmark"] as Toggle[]).forEach((a) => {
      const k = key(a);
      if (inflight.current[a] || intentRef.current[k] !== confirmed.current[k]) return;
      confirmed.current = { ...confirmed.current, [k]: viewer[k] };
      intentRef.current = { ...intentRef.current, [k]: viewer[k] };
    });
    setIntent(intentRef.current);
  }, [viewer.liked, viewer.reposted, viewer.bookmarked]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    const el = barRef.current;
    if (!el) return;
    // Measure now, so the first paint already has the right layout; then follow changes.
    setWidth(el.getBoundingClientRect().width || 480);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const flush = useCallback(async (a: Toggle) => {
    if (inflight.current[a]) return;
    const k = key(a);
    inflight.current[a] = true;
    setPending((p) => ({ ...p, [a]: true }));
    try {
      // Every press while a request is out only moves the intent; when it lands we send again only if it still differs.
      while (intentRef.current[k] !== confirmed.current[k]) {
        const want = intentRef.current[k];
        try {
          await (commit ? commit(a, want) : Promise.resolve());
          confirmed.current = { ...confirmed.current, [k]: want };
        } catch (err) {
          intentRef.current = { ...intentRef.current, [k]: confirmed.current[k] };
          setIntent(intentRef.current);
          setFailed({ action: a, beat: Date.now() });
          const reason = err instanceof Error && err.message ? err.message : "Something went wrong";
          setNews(`Couldn't ${want ? a : `undo ${a}`}: ${reason}. Put back as it was.`);
          break;
        }
      }
    } finally {
      inflight.current[a] = false;
      setPending((p) => ({ ...p, [a]: false }));
    }
  }, [commit]);

  const toggle = (a: Toggle, on?: boolean) => {
    const k = key(a);
    const next = on ?? !intentRef.current[k];
    if (next === intentRef.current[k]) return;
    intentRef.current = { ...intentRef.current, [k]: next };
    setIntent(intentRef.current);
    setFailed(null);
    if (a === "like" && next) setBurst((b) => b + 1);
    setNews(next ? { like: "Liked", repost: "Reposted", bookmark: "Bookmarked" }[a] : { like: "Like removed", repost: "Repost undone", bookmark: "Bookmark removed" }[a]);
    void flush(a);
  };

  const n = {
    replies: counts.replies,
    reposts: shown(counts.reposts, viewer.reposted, intent.reposted),
    likes: shown(counts.likes, viewer.liked, intent.liked),
    views: counts.views,
    bookmarks: counts.bookmarks === undefined ? undefined : shown(counts.bookmarks, viewer.bookmarked, intent.bookmarked),
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied("ok");
      setNews("Link copied");
    } catch {
      setCopied("fail");
      setNews("Couldn't copy. The link is shown so you can select it.");
    }
  };

  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const openMenu = (m: Exclude<Menu, null>, from: HTMLButtonElement | null) => {
    menuReturn.current = from;
    setCopied("idle");
    setMenu((cur) => (cur === m ? null : m));
  };
  const closeMenu = (refocus = true) => {
    setMenu(null);
    if (refocus) menuReturn.current?.focus();
  };

  // Buttons in toolbar order, for roving focus. Views folds into Share on narrow bars.
  const order = ["reply", "repost", "like", ...(narrow ? [] : ["views"]), "bookmark", "share"];
  const btn = (name: string) => barRef.current?.querySelector<HTMLButtonElement>(`[data-action="${name}"]`) ?? null;

  const onBarKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    if (e.key in keys || e.key === "Home" || e.key === "End") {
      if ((e.target as HTMLElement).closest(".echo__menu")) return;
      e.preventDefault();
      const i = e.key === "Home" ? 0 : e.key === "End" ? order.length - 1 : (focusIndex + keys[e.key] + order.length) % order.length;
      setFocusIndex(i);
      btn(order[i])?.focus();
    }
  };

  // Post-scoped shortcuts: only while focus is inside the post (or the bar), never page-wide.
  useEffect(() => {
    const scope = scopeRef?.current ?? barRef.current;
    if (!scope) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target) || menu) return;
      const k = e.key.toLowerCase();
      if (k === "l") toggle("like");
      else if (k === "b") toggle("bookmark");
      else if (k === "r" && !replyLimit) onReply?.();
      else if (k === "t") openMenu("repost", btn("repost"));
      else if (k === "s") openMenu("share", btn("share"));
      else return;
      e.preventDefault();
    };
    scope.addEventListener("keydown", onKey);
    return () => scope.removeEventListener("keydown", onKey);
  });

  // A rolled-back toggle nudges sideways once, without remounting (focus stays put).
  useEffect(() => {
    if (!failed || motion === "reduced") return;
    const el = btn(failed.action);
    if (!el?.animate || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    el.animate([{ translate: "0" }, { translate: "-3px" }, { translate: "3px" }, { translate: "-2px" }, { translate: "0" }], { duration: 320, easing: "ease-out" });
  }, [failed]); // eslint-disable-line react-hooks/exhaustive-deps

  // Menus close on outside press and Escape, returning focus to the button that opened them.
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) closeMenu(false);
    };
    document.addEventListener("pointerdown", onDown);
    const first = barRef.current?.querySelector<HTMLElement>(".echo__menu [role=menuitem], .echo__menu [data-autofocus]");
    first?.focus();
    return () => document.removeEventListener("pointerdown", onDown);
  }, [menu]); // eslint-disable-line react-hooks/exhaustive-deps

  const onMenuKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" || e.key === "Tab") {
      if (e.key === "Escape") e.preventDefault();
      closeMenu(e.key === "Escape");
      return;
    }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = [...(e.currentTarget.querySelectorAll<HTMLElement>("[role=menuitem]"))];
    const i = items.indexOf(document.activeElement as HTMLElement);
    items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
  };

  const tab = (name: string) => (order[focusIndex] === name ? 0 : -1);
  const shake = (a: Toggle) => (failed?.action === a ? { "data-failed": "" } : {});
  const countText = (v: number | undefined) => (hideCounts || v === undefined ? null : <Rolling value={v} />);
  const views = analytics.length ? analytics : [{ label: "Views", value: counts.views }];

  return (
    <div
      ref={barRef}
      role="toolbar"
      aria-label={`${label}: actions`}
      className={`echo ${className}`}
      data-motion={motion}
      data-narrow={narrow ? "" : undefined}
      onKeyDown={onBarKey}
      onFocus={(e) => {
        const i = order.indexOf((e.target as HTMLElement).dataset.action ?? "");
        if (i >= 0) setFocusIndex(i);
      }}
    >
      <span className="echo__slot">
        <button
          type="button"
          className="echo__btn"
          data-action="reply"
          data-tone="reply"
          tabIndex={tab("reply")}
          aria-disabled={replyLimit ? true : undefined}
          aria-describedby={replyLimit ? `${id}-limit` : undefined}
          aria-label={`Reply, ${noun(n.replies, "reply", "replies")}`}
          onClick={() => !replyLimit && onReply?.()}
        >
          <Icon name="reply" />
          <Rolling value={n.replies} />
        </button>
        {replyLimit && <span id={`${id}-limit`} className="echo__tip" role="note">{replyLimit}</span>}
      </span>

      <span className="echo__slot">
        <button
          type="button"
          className="echo__btn"
          data-action="repost"
          data-tone="repost"
          data-on={intent.reposted ? "" : undefined}
          data-pending={pending.repost ? "" : undefined}
          {...shake("repost")}
          tabIndex={tab("repost")}
          aria-haspopup="menu"
          aria-expanded={menu === "repost"}
          aria-controls={`${id}-repost`}
          aria-label={`${intent.reposted ? "Reposted" : "Repost"}${hideCounts ? "" : `, ${noun(n.reposts, "repost", "reposts")}`}`}
          onClick={(e) => openMenu("repost", e.currentTarget)}
        >
          <Icon name="repost" />
          {countText(n.reposts)}
        </button>
        {menu === "repost" && (
          <div className="echo__menu" role="menu" id={`${id}-repost`} aria-label="Repost" onKeyDown={onMenuKey}>
            <button type="button" role="menuitem" tabIndex={-1} onClick={() => { toggle("repost"); closeMenu(); }}>
              <Icon name="repost" />
              {intent.reposted ? "Undo repost" : "Repost"}
            </button>
            <button type="button" role="menuitem" tabIndex={-1} onClick={() => { closeMenu(); onQuote?.(); }}>
              <svg className="echo__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18.5 6.2 15H5.5A1.5 1.5 0 0 1 4 13.5v-7A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v7a1.5 1.5 0 0 1-1.5 1.5H10Z" /></svg>
              Quote
            </button>
          </div>
        )}
      </span>

      <span className="echo__slot">
        <button
          type="button"
          className="echo__btn"
          data-action="like"
          data-tone="like"
          data-on={intent.liked ? "" : undefined}
          data-pending={pending.like ? "" : undefined}
          {...shake("like")}
          tabIndex={tab("like")}
          aria-pressed={intent.liked}
          aria-label={`Like${hideCounts ? "" : `, ${noun(n.likes, "like", "likes")}`}`}
          onClick={() => toggle("like")}
        >
          <span className="echo__heart">
            {burst > 0 && intent.liked && (
              <span className="echo__burst" key={burst} aria-hidden="true">
                {Array.from({ length: 6 }, (_, i) => <i key={i} style={{ ["--a" as string]: `${i * 60 + 30}deg` }} />)}
              </span>
            )}
            <Icon name="like" />
          </span>
          {countText(n.likes)}
        </button>
      </span>

      {!narrow && (
        <span className="echo__slot">
          <button
            type="button"
            className="echo__btn"
            data-action="views"
            data-tone="views"
            tabIndex={tab("views")}
            aria-haspopup="dialog"
            aria-expanded={menu === "views"}
            aria-label={`Views, ${noun(n.views, "view", "views")}. Open post analytics`}
            onClick={(e) => openMenu("views", e.currentTarget)}
          >
            <Icon name="views" />
            <Rolling value={n.views} />
          </button>
          {menu === "views" && (
            <div className="echo__menu echo__menu--stats" role="dialog" aria-label="Post analytics" onKeyDown={onMenuKey}>
              <dl>
                {views.map((r) => (
                  <div key={r.label}><dt>{r.label}</dt><dd>{full(r.value)}</dd></div>
                ))}
              </dl>
              <button type="button" className="echo__close" data-autofocus onClick={() => closeMenu()}>Close</button>
            </div>
          )}
        </span>
      )}

      <span className="echo__slot echo__slot--end">
        <button
          type="button"
          className="echo__btn"
          data-action="bookmark"
          data-tone="bookmark"
          data-on={intent.bookmarked ? "" : undefined}
          data-pending={pending.bookmark ? "" : undefined}
          {...shake("bookmark")}
          tabIndex={tab("bookmark")}
          aria-pressed={intent.bookmarked}
          aria-label={`Bookmark${n.bookmarks === undefined || hideCounts ? "" : `, ${noun(n.bookmarks, "bookmark", "bookmarks")}`}`}
          onClick={() => toggle("bookmark")}
        >
          <Icon name="bookmark" />
          {countText(n.bookmarks)}
        </button>
      </span>

      <span className="echo__slot echo__slot--share">
        <button
          type="button"
          className="echo__btn"
          data-action="share"
          data-tone="share"
          tabIndex={tab("share")}
          aria-haspopup="menu"
          aria-expanded={menu === "share"}
          aria-controls={`${id}-share`}
          aria-label="Share"
          onClick={(e) => openMenu("share", e.currentTarget)}
        >
          <Icon name="share" />
        </button>
        {menu === "share" && (
          <div className="echo__menu echo__menu--end" role="menu" id={`${id}-share`} aria-label="Share" onKeyDown={onMenuKey}>
            <button type="button" role="menuitem" tabIndex={-1} data-copied={copied === "ok" ? "" : undefined} onClick={copy}>
              <svg className="echo__icon" viewBox="0 0 24 24" aria-hidden="true">
                {copied === "ok" ? <path d="m5 12.5 4.5 4.5L19 7.5" /> : <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />}
              </svg>
              {copied === "ok" ? "Copied" : "Copy link"}
            </button>
            {copied === "fail" && <input className="echo__link" readOnly value={link} aria-label="Post link" onFocus={(e) => e.currentTarget.select()} />}
            {canShare && (
              <button type="button" role="menuitem" tabIndex={-1} onClick={() => { closeMenu(); navigator.share({ url: link }).catch(() => {}); }}>
                <Icon name="share" />
                Share via…
              </button>
            )}
            <button type="button" role="menuitem" tabIndex={-1} onClick={() => { closeMenu(); onSend?.(); }}>
              <svg className="echo__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12 20 4.5 15.5 20l-3.3-6.2Z M12.2 13.8 20 4.5" /></svg>
              Send in a message
            </button>
            {narrow && (
              <button type="button" role="menuitem" tabIndex={-1} onClick={() => setMenu("views")}>
                <Icon name="views" />
                {`${noun(n.views, "view", "views")} · analytics`}
              </button>
            )}
          </div>
        )}
        {narrow && menu === "views" && (
          <div className="echo__menu echo__menu--stats echo__menu--end" role="dialog" aria-label="Post analytics" onKeyDown={onMenuKey}>
            <dl>
              {views.map((r) => (
                <div key={r.label}><dt>{r.label}</dt><dd>{full(r.value)}</dd></div>
              ))}
            </dl>
            <button type="button" className="echo__close" data-autofocus onClick={() => closeMenu()}>Close</button>
          </div>
        )}
      </span>

      <span className="echo__sr" role="status" aria-live="polite">{news}</span>
    </div>
  );
}
