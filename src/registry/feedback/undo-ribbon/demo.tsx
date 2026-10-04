"use client";

import { useState } from "react";
import { UndoInsert, UndoSlot, useUndoable } from "./UndoRibbon";

type Mail = { id: string; from: string; subject: string; time: string; unread?: boolean };

const INBOX: Mail[] = [
  { id: "m1", from: "GUtech Registrar", subject: "Your graduation audit is ready to review", time: "09:41", unread: true },
  { id: "m2", from: "Vercel", subject: "Deployment vitrine-web-7f3c is live", time: "09:12", unread: true },
  { id: "m3", from: "Oman Air", subject: "Boarding pass · MCT → MUC, 14 Oct", time: "Yesterday" },
  { id: "m4", from: "GitHub", subject: "[vitrine] PR #212: Move search to edge runtime", time: "Yesterday", unread: true },
  { id: "m5", from: "Linear", subject: "3 issues assigned to you in Cycle 18", time: "Mon" },
  { id: "m6", from: "Figma", subject: "Comments on campus-wayfinding", time: "Sun" },
];

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 16 16" className="size-[15px] fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const theme = night ? "night" : "paper";
  const [archived, setArchived] = useState(0);
  const [deleted, setDeleted] = useState(0);
  const { items, pending, remove, undo, commit, scopeProps, setItems } = useUndoable(INBOX, {
    onCommit: (_, kind) => (kind === "archive" ? setArchived((n) => n + 1) : setDeleted((n) => n + 1)),
  });
  const [readAll, setReadAll] = useState<{ ids: string[]; at: number } | null>(null);

  const unread = items.filter((m) => m.unread && !pending[m.id]);

  const c = night
    ? { page: "bg-[#111214] text-[#ececea]", muted: "text-[#8b8d93]", card: "bg-[#17181b] ring-white/[0.07]", div: "border-white/[0.06]", hover: "hover:bg-white/[0.03]", act: "hover:bg-white/[0.08] text-[#a3a5ab] hover:text-[#ececea]", btn: "ring-white/10 hover:bg-white/[0.05]", dot: "bg-[#7aa2ff]" }
    : { page: "bg-[#f4f2ed] text-[#1c1b18]", muted: "text-[#76726a]", card: "bg-white ring-black/[0.07]", div: "border-black/[0.06]", hover: "hover:bg-black/[0.02]", act: "hover:bg-black/[0.06] text-[#76726a] hover:text-[#1c1b18]", btn: "ring-black/10 hover:bg-black/[0.04]", dot: "bg-[#2f6bff]" };

  const reset = () => {
    setItems(INBOX);
    setArchived(0);
    setDeleted(0);
  };

  return (
    <div className={`flex h-full min-h-[560px] w-full justify-center overflow-auto px-4 py-8 ${c.page}`} style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <div className="w-full max-w-[620px] outline-none" {...scopeProps}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-1">
          <h1 className="text-[20px] font-semibold tracking-[-0.02em]">Inbox</h1>
          <span className={`text-[12.5px] tabular-nums ${c.muted}`}>
            {unread.length} unread · Archive {archived} · Trash {deleted}
          </span>
          <div className="ml-auto flex gap-1.5">
            {items.length < INBOX.length && (
              <button type="button" onClick={reset} className={`h-8 rounded-lg px-2.5 text-[12.5px] ring-1 ${c.btn}`}>
                Reset
              </button>
            )}
            <button
              type="button"
              disabled={!unread.length || !!readAll}
              onClick={() => {
                const ids = unread.map((m) => m.id);
                setItems((list) => list.map((m) => (ids.includes(m.id) ? { ...m, unread: false } : m)));
                setReadAll({ ids, at: Date.now() });
              }}
              className={`h-8 rounded-lg px-2.5 text-[12.5px] ring-1 transition-opacity disabled:cursor-not-allowed disabled:opacity-40 ${c.btn}`}
            >
              Mark all read
            </button>
          </div>
        </div>

        <UndoInsert
          key={readAll?.at}
          open={!!readAll}
          theme={theme}
          kind="done"
          message={
            <>
              Marked <b>{readAll?.ids.length} conversations</b> as read
            </>
          }
          announce={`Marked ${readAll?.ids.length} conversations as read.`}
          duration={5000}
          onAction={() => {
            const ids = readAll?.ids ?? [];
            setItems((list) => list.map((m) => (ids.includes(m.id) ? { ...m, unread: true } : m)));
          }}
          onDone={() => setReadAll(null)}
        />

        <ul className={`mt-3 overflow-hidden rounded-xl px-1.5 py-1.5 ring-1 ${c.card}`} aria-label="Messages">
          {items.map((m) => (
            <li key={m.id}>
              <UndoSlot pending={pending[m.id]} theme={theme} onUndo={() => undo(m.id)} onExpire={() => commit(m.id)}>
                <div className={`group flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition-colors focus-within:bg-black/[0.02] ${c.hover}`}>
                  <span className={`size-1.5 shrink-0 rounded-full ${m.unread ? c.dot : "bg-transparent"}`} aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className={`truncate text-[13.5px] ${m.unread ? "font-semibold" : "font-medium"}`}>{m.from}</span>
                      <span className={`ml-auto shrink-0 text-[11.5px] tabular-nums ${c.muted}`}>{m.time}</span>
                    </div>
                    <p className={`truncate text-[12.5px] ${c.muted}`}>{m.subject}</p>
                  </div>
                  <div className="flex shrink-0 gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                    <button
                      type="button"
                      aria-label={`Archive “${m.subject}”`}
                      onClick={() => remove(m.id, "archive", <>Archived <b>{m.from}</b></>, `Archived message from ${m.from}.`)}
                      className={`grid size-8 place-items-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 ${c.act}`}
                    >
                      <Icon d="M2.5 3.5h11v3h-11zM3.5 6.5v6h9v-6M6.5 9h3" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete “${m.subject}”`}
                      onClick={() => remove(m.id, "delete", <>Deleted <b>{m.from}</b></>, `Deleted message from ${m.from}.`)}
                      className={`grid size-8 place-items-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 ${c.act}`}
                    >
                      <Icon d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5" />
                    </button>
                  </div>
                </div>
              </UndoSlot>
            </li>
          ))}
          {!items.length && <li className={`px-3 py-10 text-center text-[13px] ${c.muted}`}>Inbox zero. Nicely done, Hamza.</li>}
        </ul>
        <p className={`mt-3 px-1 text-[12px] ${c.muted}`}>Archive or delete a message · hover the ribbon to hold the timer · ⌘Z undoes</p>
      </div>
    </div>
  );
}
