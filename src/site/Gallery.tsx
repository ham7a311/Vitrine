"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ComponentSummary } from "@/registry";
import { CATEGORIES } from "@/registry/types";
import { search } from "@/lib/search";
import { GalleryCard } from "./GalleryCard";
import { CloseIcon, SearchIcon } from "./icons";

/** These categories follow the round-robin, in file order, so All ends with them. */
const ALL_TAIL = new Set(["micro", "text"]);

/** All view: one item from each category per pass, in the order categories and items already appear. */
function roundRobin(items: ComponentSummary[]): ComponentSummary[] {
  const body = items.filter((item) => !ALL_TAIL.has(item.category));
  const tail = items.filter((item) => ALL_TAIL.has(item.category));
  const groups: ComponentSummary[][] = [];
  const at = new Map<string, number>();
  for (const item of body) {
    let i = at.get(item.category);
    if (i === undefined) {
      i = groups.length;
      at.set(item.category, i);
      groups.push([]);
    }
    groups[i].push(item);
  }
  const out: ComponentSummary[] = [];
  const passes = groups.reduce((max, group) => Math.max(max, group.length), 0);
  for (let pass = 0; pass < passes; pass++) {
    for (const group of groups) {
      if (pass < group.length) out.push(group[pass]);
    }
  }
  return out.concat(tail);
}

export function Gallery({ items }: { items: ComponentSummary[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const category = params.get("category") ?? "all";
  const filterNew = params.get("filter") === "new";
  const [q, setQ] = useState(params.get("q") ?? "");

  useEffect(() => setQ(params.get("q") ?? ""), [params]);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value === null || value === "") next.delete(key);
    else next.set(key, value);
    const s = next.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  };

  // debounce URL writes for the search field
  useEffect(() => {
    const id = setTimeout(() => {
      if ((params.get("q") ?? "") !== q) setParam("q", q || null);
    }, 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const results = useMemo(() => {
    let list = q.trim() ? search(items, q) : items;
    if (category !== "all") list = list.filter((i) => i.category === category);
    if (filterNew) list = list.filter((i) => i.isNew);
    if (!q.trim() && category === "all") list = roundRobin(list);
    return list;
  }, [items, q, category, filterNew]);

  const counts = useMemo(() => {
    const base = q.trim() ? search(items, q) : items;
    return Object.fromEntries(CATEGORIES.map((c) => [c.id, base.filter((i) => i.category === c.id && (!filterNew || i.isNew)).length]));
  }, [items, q, filterNew]);

  const tabs = [{ id: "all", label: "All" }, ...CATEGORIES.filter((c) => items.some((i) => i.category === c.id))];

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-line pb-5 lg:flex-row lg:items-center">
        <div role="radiogroup" aria-label="Category" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:pb-0">
          {tabs.map((t) => {
            const active = category === t.id;
            const count = t.id === "all" ? Object.values(counts).reduce((a, b) => a + b, 0) : counts[t.id];
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setParam("category", t.id === "all" ? null : t.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.8125rem] transition-colors duration-200 ${
                  active ? "border-line-strong bg-plum-800 text-cream" : "border-transparent text-ink-3 hover:text-ink-2"
                }`}
              >
                {t.label}
                <span className="font-mono text-[0.625rem] tabular-nums text-ink-3">{count}</span>
              </button>
            );
          })}
          <button
            type="button"
            role="switch"
            aria-checked={filterNew}
            onClick={() => setParam("filter", filterNew ? null : "new")}
            className={`ml-2 flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.8125rem] transition-colors duration-200 ${
              filterNew ? "border-lilac/40 bg-lilac/10 text-lilac" : "border-line text-ink-3 hover:text-ink-2"
            }`}
          >
            <span aria-hidden="true" className="size-1.5 rounded-full bg-lilac" /> New only
          </button>
        </div>

        <label className="relative flex h-10 items-center gap-2 rounded-lg border border-line bg-plum-950/60 px-3 transition-colors focus-within:border-frost/40 lg:ml-auto lg:w-72">
          <span className="sr-only">Filter components</span>
          <SearchIcon className="size-4 shrink-0 text-ink-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter — glass, hover, webgl…"
            className="h-full w-full bg-transparent text-[0.875rem] text-cream outline-none placeholder:text-ink-3"
          />
          {q && (
            <button type="button" onClick={() => setQ("")} aria-label="Clear filter" className="text-ink-3 hover:text-cream">
              <CloseIcon className="size-4" />
            </button>
          )}
        </label>
      </div>

      <p className="sr-only" aria-live="polite">
        {results.length} components shown
      </p>

      {results.length ? (
        <div className="mt-10 grid gap-x-8 gap-y-16 md:grid-cols-2">
          {results.map((item) => (
            <GalleryCard key={item.slug} item={item} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center">
          <p className="font-display text-[1.75rem] text-cream">Nothing under glass here.</p>
          <p className="mt-2 text-ink-3">Try a broader word, or clear the filters.</p>
          <button
            type="button"
            onClick={() => router.replace(pathname, { scroll: false })}
            className="mt-6 rounded-md border border-line-strong px-4 py-2 text-[0.875rem] text-cream hover:border-frost/40"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
