"use client";

import { useEffect, useRef, useState } from "react";
import { DepthDialog, DepthDialogChip } from "./DepthDialog";

const WORKSPACES = [
  { id: "research", name: "GUtech Research Lab", meta: "6 projects · Muscat" },
  { id: "studio", name: "GUtech Studio", meta: "Current owner" , disabled: true },
  { id: "personal", name: "Hamza Al-Bulushi", meta: "Personal workspace" },
];

type Which = "transfer" | "delete" | null;

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const theme = night ? "night" : "paper";
  const stageRef = useRef<HTMLDivElement>(null);
  const transferRow = useRef<HTMLDivElement>(null);
  const deleteRow = useRef<HTMLDivElement>(null);
  const [which, setWhich] = useState<Which>(null);
  const [typed, setTyped] = useState("");
  const [target, setTarget] = useState("research");
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(t);
  }, [notice]);

  const c = night
    ? { page: "bg-[#0f1012] text-[#ececea]", card: "bg-[#16171a] ring-white/[0.07]", muted: "text-[#8d8f95]", line: "border-white/[0.07]", btn: "ring-white/10 hover:bg-white/[0.05]", danger: "text-[#f0766e] ring-[#e5534b]/35 hover:bg-[#e5534b]/10", field: "bg-[#111214] ring-white/10" }
    : { page: "bg-[#f6f5f1] text-[#1b1a17]", card: "bg-white ring-black/[0.07]", muted: "text-[#6b6861]", line: "border-black/[0.07]", btn: "ring-black/10 hover:bg-black/[0.04]", danger: "text-[#b42318] ring-[#b42318]/25 hover:bg-[#b42318]/[0.06]", field: "bg-[#faf9f6] ring-black/10" };

  const chip = <DepthDialogChip mark="A" title="Vitrine" meta="vitrine.gutech.app · 14 members · 2.3 GB" />;
  const close = () => setWhich(null);

  return (
    <div className={`relative h-full min-h-[560px] w-full overflow-hidden ${night ? "bg-[#08090a]" : "bg-[#e9e6de]"}`}>
      <div ref={stageRef} className={`absolute inset-0 overflow-hidden ${c.page}`} style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
        <header className={`flex h-12 items-center gap-2 border-b px-5 text-[13px] ${c.line}`}>
          <span className="grid size-6 place-items-center rounded-md bg-current text-[11px] font-semibold"><span className={night ? "text-black" : "text-white"}>G</span></span>
          <span className={c.muted}>GUtech Studio</span>
          <span className={c.muted}>/</span>
          <span className="font-medium">Vitrine</span>
          <span className={`ml-auto hidden sm:inline ${c.muted}`}>Settings</span>
        </header>

        <div className="mx-auto flex max-w-[760px] gap-10 px-5 py-8">
          <nav className={`hidden w-36 shrink-0 flex-col gap-1 text-[13px] md:flex ${c.muted}`} aria-label="Settings sections">
            {["General", "Members", "Billing", "Integrations", "Danger zone"].map((s, i) => (
              <span key={s} className={`rounded-md px-2 py-1.5 ${i === 4 ? (night ? "bg-white/[0.06] text-[#ececea]" : "bg-black/[0.05] text-[#1b1a17]") : ""}`}>{s}</span>
            ))}
          </nav>

          <main className="min-w-0 flex-1">
            <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Project settings</h1>
            <p className={`mt-1 text-[13.5px] ${c.muted}`}>Manage Vitrine and everything inside it.</p>

            <section className={`mt-6 rounded-xl p-4 ring-1 ${c.card}`}>
              <h2 className="text-[13px] font-semibold">General</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-[12px]">
                  <span className={c.muted}>Project name</span>
                  <input readOnly value="Vitrine" className={`h-9 rounded-lg px-3 text-[13.5px] outline-none ring-1 ${c.field}`} />
                </label>
                <label className="grid gap-1.5 text-[12px]">
                  <span className={c.muted}>Address</span>
                  <input readOnly value="vitrine.gutech.app" className={`h-9 rounded-lg px-3 text-[13.5px] outline-none ring-1 ${c.field}`} />
                </label>
              </div>
            </section>

            <section className={`mt-5 rounded-xl ring-1 ${c.card}`}>
              <h2 className="px-4 pt-4 text-[13px] font-semibold">Danger zone</h2>
              <div ref={transferRow} className={`mx-2 mt-2 flex items-center gap-4 rounded-lg px-2 py-3`}>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-medium">Transfer ownership</p>
                  <p className={`text-[12.5px] ${c.muted}`}>Move Vitrine and its 14 members to another workspace.</p>
                </div>
                <button type="button" onClick={() => setWhich("transfer")} className={`h-8 shrink-0 rounded-lg px-3 text-[13px] font-medium ring-1 transition-colors ${c.btn}`}>
                  Transfer
                </button>
              </div>
              <div className={`mx-4 border-t ${c.line}`} />
              <div ref={deleteRow} className="mx-2 mb-2 flex items-center gap-4 rounded-lg px-2 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-medium">Delete project</p>
                  <p className={`text-[12.5px] ${c.muted}`}>Permanently remove Vitrine, its 212 files and deploy history.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTyped("");
                    setWhich("delete");
                  }}
                  className={`h-8 shrink-0 rounded-lg px-3 text-[13px] font-medium ring-1 transition-colors ${c.danger}`}
                >
                  Delete…
                </button>
              </div>
            </section>

            <p role="status" className={`mt-4 h-5 text-[12.5px] transition-opacity duration-300 ${c.muted} ${notice ? "opacity-100" : "opacity-0"}`}>
              {notice}
            </p>
          </main>
        </div>
      </div>

      <DepthDialog
        contained
        theme={theme}
        open={which === "transfer"}
        onClose={close}
        stageRef={stageRef}
        anchorRef={transferRow}
        context={chip}
        title="Transfer Vitrine"
        description="Choose the workspace that will own this project. Members keep their access; billing moves with it."
        confirmLabel="Transfer project"
        busyLabel="Transferring…"
        onConfirm={() =>
          new Promise<void>((r) => window.setTimeout(r, 900)).then(() =>
            setNotice(`Vitrine now belongs to ${WORKSPACES.find((w) => w.id === target)?.name}.`),
          )
        }
      >
        <fieldset className="mt-4 grid gap-1.5">
          <legend className="sr-only">New owner</legend>
          {WORKSPACES.map((w) => (
            <label
              key={w.id}
              className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 ring-1 transition-colors ${
                w.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              } ${target === w.id ? (night ? "bg-white/[0.05] ring-white/25" : "bg-black/[0.03] ring-black/25") : night ? "ring-white/[0.08]" : "ring-black/[0.08]"}`}
            >
              <input
                type="radio"
                name="owner"
                value={w.id}
                disabled={w.disabled}
                checked={target === w.id}
                onChange={() => setTarget(w.id)}
                data-autofocus={target === w.id ? "" : undefined}
                className={`size-4 shrink-0 appearance-none rounded-full border transition-[border-width] duration-150 checked:border-[5px] focus-visible:outline-2 focus-visible:outline-offset-2 ${night ? "border-white/30 checked:border-[#ececea] focus-visible:outline-white" : "border-black/25 checked:border-[#1b1a17] focus-visible:outline-black"}`}
              />
              <span className="min-w-0">
                <span className="block text-[13.5px] font-medium">{w.name}</span>
                <span className={`block text-[12px] ${c.muted}`}>{w.meta}</span>
              </span>
            </label>
          ))}
        </fieldset>
      </DepthDialog>

      <DepthDialog
        contained
        theme={theme}
        tone="danger"
        open={which === "delete"}
        onClose={close}
        stageRef={stageRef}
        anchorRef={deleteRow}
        context={chip}
        title="Delete Vitrine?"
        description={
          <>
            This removes <strong>212 files</strong>, <strong>38 deploys</strong> and every member&rsquo;s access. It can&rsquo;t be undone.
          </>
        }
        confirmLabel="Delete project"
        busyLabel="Deleting…"
        confirmDisabled={typed.trim().toLowerCase() !== "vitrine"}
        onConfirm={() => new Promise<void>((r) => window.setTimeout(r, 900)).then(() => setNotice("Vitrine is scheduled for deletion. (Demo — nothing was removed.)"))}
      >
        <label className="mt-4 grid gap-1.5 text-[12.5px]">
          <span className={c.muted}>
            Type <span className={`font-mono ${night ? "text-[#ececea]" : "text-[#1b1a17]"}`}>vitrine</span> to confirm
          </span>
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
            data-autofocus=""
            spellCheck={false}
            className={`h-10 rounded-[10px] px-3 font-mono text-[13.5px] outline-none ring-1 transition-shadow focus:ring-2 ${c.field} ${night ? "focus:ring-white/40" : "focus:ring-black/40"}`}
          />
        </label>
      </DepthDialog>
    </div>
  );
}
