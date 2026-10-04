import Link from "next/link";
import { site } from "@/site.config";
import { LogoMark, Wordmark } from "./Logo";

const COLUMNS = [
  {
    title: "Library",
    links: [
      { label: "All components", href: "/components" },
      { label: "Categories", href: "/categories" },
      { label: "New arrivals", href: "/components?filter=new" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "GitHub", href: site.github, external: true },
      { label: "How to use", href: "/about#usage" },
      { label: "About", href: "/about" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-line">
      <div className="shell-container grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex items-center gap-2 text-cream">
            <LogoMark className="size-[22px]" />
            <Wordmark className="h-[19px] w-auto translate-y-[1px]" />
          </Link>
          <p className="mt-4 text-[0.875rem] leading-relaxed text-ink-3">
            A curated collection of React components. Copy the source, keep the prompt, make it yours.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="eyebrow">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  {"external" in l ? (
                    <a href={l.href} target="_blank" rel="noreferrer" className="text-[0.875rem] text-ink-2 transition-colors hover:text-cream">
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="text-[0.875rem] text-ink-2 transition-colors hover:text-cream">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="shell-container grid grid-cols-1 gap-2 border-t border-line py-6 font-mono text-[0.6875rem] text-ink-3 sm:grid-cols-3 sm:items-center">
        <span>© {new Date().getFullYear()} Vitrine. MIT licensed.</span>
        <a
          href="https://ham7a311.dev"
          className="justify-self-center underline decoration-current underline-offset-[3px] transition-[text-decoration-color] duration-200 hover:decoration-frost"
        >
          made by ham7a311
        </a>
        <span className="sm:justify-self-end">React · TypeScript · Tailwind CSS</span>
      </div>
    </footer>
  );
}
