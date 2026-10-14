"use client";

import { useEffect, useRef, useState } from "react";
import { EchoBar, type EchoCounts, type EchoViewer, type Toggle } from "./EchoBar";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const FIELD: Record<Toggle, { count: keyof EchoCounts; flag: keyof EchoViewer }> = {
  like: { count: "likes", flag: "liked" },
  repost: { count: "reposts", flag: "reposted" },
  bookmark: { count: "bookmarks", flag: "bookmarked" },
};

/** A pretend server: slow enough to see pending, and it can be told to fail. */
function usePost(initial: EchoCounts, live: boolean) {
  const [counts, setCounts] = useState(initial);
  const [viewer, setViewer] = useState<EchoViewer>({ liked: false, reposted: false, bookmarked: false });
  const [online, setOnline] = useState(true);
  const onlineRef = useRef(online);
  onlineRef.current = online;
  const viewerRef = useRef(viewer);
  viewerRef.current = viewer;

  // Other people keep liking and viewing; the bar reconciles without touching your own +1.
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => {
      setCounts((c) => ({ ...c, likes: c.likes + (Math.random() < 0.5 ? 1 : 0), views: c.views + 3 + Math.floor(Math.random() * 9) }));
    }, 2600);
    return () => clearInterval(t);
  }, [live]);

  const commit = async (a: Toggle, on: boolean) => {
    await wait(650);
    if (!onlineRef.current) throw new Error("you're offline");
    const f = FIELD[a];
    if (viewerRef.current[f.flag] === on) return;
    viewerRef.current = { ...viewerRef.current, [f.flag]: on };
    setCounts((c) => ({ ...c, [f.count]: (c[f.count] ?? 0) + (on ? 1 : -1) }));
    setViewer(viewerRef.current);
  };
  return { counts, viewer, commit, online, setOnline };
}

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const main = usePost({ replies: 48, reposts: 212, likes: 1199, views: 98_640, bookmarks: 37 }, true);
  const small = usePost({ replies: 3, reposts: 9, likes: 999, views: 4_210, bookmarks: 2 }, false);
  const mainRef = useRef<HTMLElement>(null);
  const [note, setNote] = useState("");

  const theme = night
    ? { page: "bg-[#0d0e11] text-[#e9eaee]", card: "bg-[#16171c] ring-1 ring-white/[0.07]", vars: { ["--echo-surface" as string]: "#23242b", ["--echo-ink" as string]: "#eceef2" } }
    : { page: "bg-[#f2f1ed] text-[#16171a]", card: "bg-white ring-1 ring-black/[0.06] shadow-[0_24px_48px_-30px_rgb(0_0_0/0.35)]", vars: { ["--echo-surface" as string]: "#ffffff", ["--echo-ink" as string]: "#16171a" } };

  const say = (t: string) => {
    setNote(t);
    setTimeout(() => setNote(""), 1800);
  };

  return (
    <div className={`flex min-h-full w-full flex-col items-center justify-center gap-5 px-4 py-10 ${theme.page}`} style={theme.vars}>
      <article ref={mainRef} tabIndex={-1} aria-label="Post by Leila Haddad" className={`w-full max-w-[520px] rounded-[22px] p-5 outline-none focus-visible:ring-2 focus-visible:ring-[#1d8cf0] ${theme.card}`}>
        <header className="mb-3 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-[#e8d9c6] font-semibold text-[#6b4a2b]" aria-hidden="true">LH</span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[15px] font-semibold">Leila Haddad</p>
            <p className="truncate text-[13px] opacity-55">@leila_h · 2h · Murmur</p>
          </div>
        </header>
        <p className="mb-3 text-[15px] leading-relaxed">
          Shipped the new offline mode today. Drafts now survive a dead train tunnel, and sync picks up where you left off.
        </p>
        <EchoBar
          {...main}
          label="Post by Leila Haddad"
          link="https://murmur.example/leila_h/1849"
          scopeRef={mainRef}
          analytics={[
            { label: "Impressions", value: main.counts.views },
            { label: "Engagements", value: 4_318 },
            { label: "Profile visits", value: 611 },
            { label: "Link clicks", value: 1_042 },
          ]}
          onReply={() => say("Reply opened")}
          onQuote={() => say("Quote opened")}
          onSend={() => say("Send opened")}
        />
        <footer className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-current/10 pt-3 text-[12px]">
          <span className="opacity-55">Focus the post, then L like · R reply · T repost · S share · B bookmark</span>
          <button
            type="button"
            role="switch"
            aria-checked={!main.online}
            onClick={() => main.setOnline(!main.online)}
            className="group inline-flex min-h-6 items-center gap-2 rounded-full font-medium"
          >
            <span className={`relative h-[18px] w-[30px] rounded-full transition-colors ${main.online ? "bg-current/20" : "bg-[#f0386b]"}`} aria-hidden="true">
              <span className={`absolute top-[2px] size-[14px] rounded-full bg-white shadow transition-[left] ${main.online ? "left-[2px]" : "left-[14px]"}`} />
            </span>
            Simulate offline
          </button>
        </footer>
      </article>

      <article aria-label="Post by Omar Salem" className={`w-full max-w-[300px] rounded-[18px] p-4 ${theme.card}`}>
        <p className="mb-1 text-[13px] font-semibold">Omar Salem <span className="font-normal opacity-55">· 5m</span></p>
        <p className="mb-2 text-[14px] leading-snug">One more like and this crosses a thousand.</p>
        <EchoBar {...small} label="Post by Omar Salem" link="https://murmur.example/omar/77" replyLimit="Only people Omar mentioned can reply" />
      </article>

      <p aria-live="polite" className="h-4 text-[12px] opacity-60">{note}</p>
    </div>
  );
}
