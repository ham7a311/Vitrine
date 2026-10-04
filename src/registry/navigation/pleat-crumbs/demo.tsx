"use client";

import { useMemo, useState } from "react";
import { PleatCrumbs, type Crumb } from "./PleatCrumbs";

type Node = { id: string; label: string; children?: Node[] };

const TREE: Node[] = [
  { id: "studio", label: "GUtech Studio", children: [
    { id: "vitrine", label: "Vitrine", children: [
      { id: "design", label: "Design", children: [
        { id: "components", label: "Components", children: [
          { id: "buttons", label: "Buttons" }, { id: "cards", label: "Cards" }, { id: "forms", label: "Forms" }, { id: "navigation", label: "Navigation" },
        ] },
        { id: "tokens", label: "Tokens", children: [{ id: "colour", label: "Colour" }, { id: "type", label: "Type" }, { id: "space", label: "Spacing" }] },
        { id: "research", label: "Research", children: [{ id: "interviews", label: "Interviews" }, { id: "surveys", label: "Surveys" }] },
      ] },
      { id: "engineering", label: "Engineering", children: [
        { id: "services", label: "Services", children: [{ id: "api", label: "API" }, { id: "jobs", label: "Jobs" }] },
        { id: "infra", label: "Infrastructure", children: [{ id: "deploys", label: "Deploys" }, { id: "observability", label: "Observability" }] },
      ] },
      { id: "ops", label: "Operations", children: [{ id: "onboarding", label: "Onboarding" }] },
    ] },
    { id: "kiosk", label: "Kiosk", children: [{ id: "kdesign", label: "Design", children: [{ id: "kscreens", label: "Screens" }] }] },
    { id: "wayfinding", label: "Wayfinding", children: [{ id: "signs", label: "Signage", children: [{ id: "maps", label: "Maps" }] }] },
  ] },
];

/** Build the path for a chain of ids, with each level's siblings from the tree. */
function pathFor(ids: string[]): Crumb[] {
  const out: Crumb[] = [];
  let level: Node[] = TREE;
  for (const id of ids) {
    const node = level.find((n) => n.id === id);
    if (!node) break;
    out.push({ id: node.id, label: node.label, href: "#", siblings: level.map((n) => ({ id: n.id, label: n.label })) });
    level = node.children ?? [];
  }
  return out;
}

/** After choosing a sibling, keep going down its first children so the path stays as deep as it was. */
function extend(ids: string[], depth: number): string[] {
  const out = [...ids];
  let level: Node[] = TREE;
  for (const id of out) level = level.find((n) => n.id === id)?.children ?? [];
  while (out.length < depth && level.length) {
    out.push(level[0].id);
    level = level[0].children ?? [];
  }
  return out;
}

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const [ids, setIds] = useState(["studio", "vitrine", "design", "components", "buttons"]);
  const path = useMemo(() => pathFor(ids), [ids]);

  return (
    <div className={`flex min-h-full w-full flex-col items-center justify-center gap-8 px-4 py-14 ${night ? "bg-[#0f1012] text-[#ececea]" : "bg-[#f3f1ec] text-[#1b1a17]"}`} style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <div className={`w-full max-w-[44rem] rounded-2xl px-4 py-3 ring-1 ${night ? "bg-[#16171a] ring-white/[0.07]" : "bg-white ring-black/[0.07]"}`}>
        <PleatCrumbs theme={night ? "night" : "paper"} path={path} onNavigate={(level, id) => setIds(extend([...ids.slice(0, level), id], ids.length))} />
      </div>
      <p className={`max-w-[34rem] text-center text-[13px] leading-relaxed ${night ? "text-[#8b8d93]" : "text-[#77736b]"}`}>
        Press any chevron. The level’s siblings unfold in the line and the rest of the path folds to initials. Pick one and the path from there on is replaced.
      </p>
    </div>
  );
}
