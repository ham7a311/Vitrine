"use client";
import { useRef } from "react";
import { ConflictResolver, type ConflictField } from "./ConflictResolver";

const FIELDS: ConflictField[] = [
  { key: "title", label: "Title", kind: "text" },
  { key: "summary", label: "Summary", kind: "text" },
  { key: "status", label: "Status", kind: "enum" },
  { key: "tags", label: "Tags", kind: "tags" },
  { key: "publish", label: "Publish date", kind: "date" },
  { key: "body", label: "Body", kind: "longtext" },
];
const BODY = [
  "We started building offline sync in March.",
  "The first version copied whole files, which was slow on long documents.",
  "Now only the paragraphs you changed travel over the network.",
  "Conflicts are rare, but when they happen you choose what to keep.",
  "It ships to every workspace next week.",
];
const BASE = { title: "What offline sync taught us", summary: "Three months of building sync for people on the move.", status: "Draft", tags: ["engineering", "sync"], publish: "2026-10-12", body: BODY.join("\n") };
const MINE = { ...BASE, title: "What we learned building offline sync", summary: "Three months of building sync for people who work on planes and in the desert.", tags: ["engineering", "sync", "field notes"], body: BODY.map((l, i) => (i === 2 ? "Now only the paragraphs you changed cross the network, usually in under a second." : l)).join("\n") };
const THEIRS = { ...BASE, title: "Offline sync, three months in", status: "In review", tags: ["sync", "product"], body: BODY.map((l, i) => (i === 2 ? "Now only the changed paragraphs are sent." : i === 4 ? "It ships to every workspace on 19 October." : l)).join("\n") };

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const tries = useRef(0);
  return (
    <div className={`min-h-full w-full px-4 py-8 ${dark ? "bg-[#0d0d0f]" : "bg-[#ebe9e4]"}`}>
      <div className="mx-auto w-full max-w-[58rem]">
        <ConflictResolver
          fields={FIELDS}
          base={BASE}
          mine={MINE}
          theirs={THEIRS}
          mineLabel="your offline copy"
          theirsLabel="Layla's edit"
          theme={dark ? "dark" : "light"}
          // Simulated save: the first attempt fails so the kept-choices path is visible.
          onResolve={() => new Promise((resolve, reject) => setTimeout(() => (++tries.current === 1 ? reject(new Error("The server was busy. Nothing was lost; try saving again.")) : resolve()), 600))}
        />
      </div>
    </div>
  );
}
