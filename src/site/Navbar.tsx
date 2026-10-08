"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/site.config";
import { LogoMark, Wordmark } from "./Logo";
import { CloseIcon, GitHubIcon, MenuIcon, StarIcon } from "./icons";
import { SearchTrigger } from "./SearchPalette";

const NAV = [
  { href: "/components", label: "Components" },
  { href: "/categories", label: "Categories" },
  { href: "/workshop", label: "Workshop" },
  { href: "/components?filter=new", label: "New" },
];

/* One request per page load at most, shared by every navbar instance; the endpoint itself is cached. */
let starsRequest: Promise<number | null> | null = null;
const loadStars = () =>
  (starsRequest ??= fetch("/api/stars")
    .then((r) => (r.ok ? r.json() : null))
    .then((d: { stars?: unknown } | null) => (typeof d?.stars === "number" ? d.stars : null))
    .catch(() => null));

export function Navbar() {
  const [stars, setStars] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let live = true;
    loadStars().then((n) => live && setStars(n));
    return () => { live = false; };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenu(false), [pathname]);
  useEffect(() => {
    if (!menu) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const background = [document.getElementById("main"), document.querySelector("footer")];
    const prior = background.map((el) => el?.inert ?? false);
    background.forEach((el) => { if (el) el.inert = true; });
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); setMenu(false); }
      if (e.key !== "Tab") return;
      const links = [...(panelRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [])];
      const items = [triggerRef.current!, ...links];
      const at = items.indexOf(document.activeElement as HTMLElement);
      if (at === -1 || (!e.shiftKey && at === items.length - 1) || (e.shiftKey && at === 0)) {
        e.preventDefault(); items[e.shiftKey ? items.length - 1 : 0]?.focus();
      }
    };
    const wide = matchMedia("(min-width: 768px)");
    const resize = () => { if (wide.matches) setMenu(false); };
    wide.addEventListener("change", resize);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = previous;
      background.forEach((el, i) => { if (el) el.inert = prior[i]; });
      wide.removeEventListener("change", resize);
      window.removeEventListener("keydown", onKey);
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [menu]);

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    if (href.includes("?")) return false;
    return pathname === base || ((base === "/components" || base === "/workshop") && pathname.startsWith(`${base}/`));
  };

  return (
    <>
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || menu ? "border-line bg-void/75 backdrop-blur-xl backdrop-saturate-150" : "border-transparent bg-void/0"
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-md focus:bg-plum-900 focus:px-3 focus:py-2 focus:text-sm">
        Skip to content
      </a>
      <nav aria-label="Primary" className="shell-container flex h-14 items-center gap-6">
        <Link href="/" onClick={() => setMenu(false)} className="-ml-1 flex items-center gap-2 rounded-md px-1 py-1 text-cream">
          <LogoMark className="size-[22px]" />
          <Wordmark className="h-[19px] w-auto translate-y-[1px]" />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="relative rounded-md px-3 py-1.5 text-[0.875rem] text-ink-2 transition-colors duration-200 hover:text-cream aria-[current=page]:text-cream"
              >
                {item.label}
                {item.label === "New" && <span className="ml-1.5 inline-block size-1 translate-y-[-2px] rounded-full bg-lilac" aria-hidden="true" />}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          {!menu && <SearchTrigger />}
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            aria-label="Vitrine on GitHub"
            className="hidden size-9 place-items-center rounded-md text-ink-2 transition-colors hover:text-cream sm:grid"
          >
            <GitHubIcon className="size-[18px]" />
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="group hidden h-9 items-center gap-2 rounded-md border border-line-strong pl-3 pr-2.5 text-[0.8125rem] text-cream transition-colors duration-200 hover:border-frost/40 hover:bg-frost/[0.06] lg:inline-flex"
          >
            <StarIcon className="size-3.5 text-frost transition-transform duration-500 ease-[var(--ease-gallery)] group-hover:rotate-[72deg]" />
            Star on GitHub
            {stars !== null && (
              <span className="ml-0.5 border-l border-line pl-2 font-mono text-[0.6875rem] tabular-nums text-ink-2">{formatStars(stars)}</span>
            )}
          </a>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-md text-ink-2 hover:text-cream md:hidden"
            aria-expanded={menu}
            ref={triggerRef}
            aria-controls="mobile-menu"
            aria-label={menu ? "Close menu" : "Open menu"}
            onClick={() => setMenu((m) => !m)}
          >
            {menu ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </nav>
    </header>

    {/* Outside the header: a backdrop-filter ancestor would become the containing block for this fixed panel. */}
      <div
        ref={panelRef}
        id="mobile-menu"
        hidden={!menu}
        className="fixed inset-x-0 bottom-0 top-14 z-40 border-t border-line bg-void/95 backdrop-blur-xl md:hidden"
      >
        <ul className="shell-container flex flex-col py-6">
          {NAV.map((item, i) => (
            <li key={item.href} className="rise-in" style={{ animationDelay: `${i * 50}ms` }}>
              <Link href={item.href} onClick={() => setMenu(false)} className="flex items-baseline justify-between border-b border-line py-5 font-display text-[2rem] leading-none text-cream">
                {item.label}
                <span className="font-mono text-[0.6875rem] text-ink-3">0{i + 1}</span>
              </Link>
            </li>
          ))}
          <li className="rise-in mt-8" style={{ animationDelay: "160ms" }}>
            <a href={site.github} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-md border border-line-strong text-[0.9375rem] text-cream">
              <StarIcon className="size-4 text-frost" /> Star on GitHub
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

function formatStars(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);
}
