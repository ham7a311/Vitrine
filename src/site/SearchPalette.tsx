"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ComponentSummary } from "@/registry";
import { CATEGORIES } from "@/registry/types";
import { search } from "@/lib/search";
import { ArrowRight, SearchIcon } from "./icons";

const SearchContext = createContext<{ open: () => void }>({ open: () => {} });
export const useSearch = () => useContext(SearchContext);

const SUGGESTIONS = ["glass", "hover", "background", "card", "authentication", "cta", "webgl", "scroll"];

export function SearchProvider({ items, children }: { items: ComponentSummary[]; children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const listId = useId();

  const open = useCallback(() => {
    const d = dialogRef.current;
    if (!d || d.open) return;
    d.showModal();
    requestAnimationFrame(() => inputRef.current?.select());
  }, []);
  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const results = useMemo(() => (query.trim() ? search(items, query) : items.filter((i) => i.featured)), [items, query]);
  useEffect(() => setActive(0), [query]);

  const groups = useMemo(() => {
    return CATEGORIES.map((c) => ({ ...c, items: results.filter((r) => r.category === c.id) })).filter((g) => g.items.length);
  }, [results]);
  const flat = groups.flatMap((g) => g.items);

  const go = (slug: string) => {
    close();
    router.push(`/components/${slug}`);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.max(0, Math.min(a + 1, flat.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && flat[active]) {
      e.preventDefault();
      go(flat[active].slug);
    }
  };

  useEffect(() => {
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, listId]);

  return (
    <SearchContext.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialogRef}
        aria-label="Search components"
        onClick={(e) => e.target === dialogRef.current && close()}
        className="search-dialog m-0 mx-auto mt-[12vh] w-[min(40rem,calc(100vw-2rem))] max-w-none overflow-hidden rounded-[14px] border border-line-strong bg-plum-950/95 p-0 text-cream shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop:bg-void/70 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <SearchIcon className="size-4 shrink-0 text-ink-3" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Search by name, tag or feel — try “glass”"
            className="h-14 w-full bg-transparent text-[0.9375rem] text-cream outline-none placeholder:text-ink-3"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={flat[active] ? `${listId}-${active}` : undefined}
            aria-autocomplete="list"
            aria-label="Search components"
          />
          <button type="button" onClick={close} aria-label="Close search" className="rounded-md px-3 py-2 text-sm text-ink-2">Close</button>
        </div>

        <div id={listId} role="listbox" aria-label="Results" className="max-h-[min(26rem,60vh)] overflow-y-auto p-2">
          {!query.trim() && <p className="eyebrow px-3 pb-1 pt-2">Featured</p>}
          {groups.map((g) => (
            <div key={g.id} role="group" aria-label={g.label} className="pb-1">
              {query.trim() && <p className="eyebrow px-3 pb-1 pt-2">{g.label}</p>}
              {g.items.map((item) => {
                const idx = flat.indexOf(item);
                const isActive = idx === active;
                return (
                  <Link
                    key={item.slug}
                    id={`${listId}-${idx}`}
                    role="option"
                    tabIndex={-1}
                    aria-selected={isActive}
                    href={`/components/${item.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.slug);
                    }}
                    onMouseMove={() => setActive(idx)}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 ${isActive ? "bg-plum-700/70" : ""}`}
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-md border border-line font-mono text-[0.625rem] text-ink-3">
                      {String(item.index).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-[0.9375rem] text-cream">
                        {item.name}
                        {item.isNew && <span className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-lilac">New</span>}
                      </span>
                      <span className="block truncate text-[0.8125rem] text-ink-3">{item.description}</span>
                    </span>
                    <ArrowRight className={`size-4 shrink-0 text-frost transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`} />
                  </Link>
                );
              })}
            </div>
          ))}
          {query.trim() && flat.length === 0 && (
            <div className="px-3 py-10 text-center">
              <p className="text-[0.9375rem] text-ink-2">Nothing under glass matches “{query}”.</p>
              <p className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => setQuery(s)} className="rounded-full border border-line px-3 py-1 font-mono text-[0.6875rem] text-ink-2 hover:border-line-strong hover:text-cream">
                    {s}
                  </button>
                ))}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[0.625rem] text-ink-3">
          <span>{query.trim() ? `${flat.length} result${flat.length === 1 ? "" : "s"}` : `${items.length} components`}</span>
          <span className="hidden gap-3 sm:flex">
            <span>↑↓ move</span>
            <span>↵ open</span>
          </span>
        </div>
      </dialog>
    </SearchContext.Provider>
  );
}

export function SearchTrigger({ className = "" }: { className?: string }) {
  const { open } = useSearch();
  return (
    <button
      type="button"
      onClick={open}
      className={`group inline-flex h-9 items-center gap-2 rounded-md border border-line bg-plum-950/60 pl-3 pr-1.5 text-[0.8125rem] text-ink-3 transition-colors duration-200 hover:border-line-strong hover:text-ink-2 ${className}`}
    >
      <SearchIcon className="size-3.5" />
      <span className="hidden lg:inline">Search components</span>
      <span className="lg:hidden">Search</span>
      <kbd className="ml-3 hidden rounded border border-line px-1.5 py-px font-mono text-[0.625rem] text-ink-3 md:inline">⌘K</kbd>
    </button>
  );
}
