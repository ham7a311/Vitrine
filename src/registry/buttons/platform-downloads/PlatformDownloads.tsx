"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AppleMark, PenguinMark, PlayMark, RobotMark, StoreBagMark, WindowsMark } from "./logos";
import { detect, LABEL, pick, type Arch, type OS } from "./platform";
import "./platform-downloads.css";

export type { Arch, OS } from "./platform";
export type BadgeKind = "macos" | "windows" | "linux" | "android" | "app-store" | "mac-app-store" | "google-play" | "microsoft-store";
export type BadgeStyle = "solid" | "outline" | "light";

const BADGES: Record<BadgeKind, { mark: () => ReactNode; top: string; name: string }> = {
  macos: { mark: () => <AppleMark />, top: "Download for", name: "macOS" },
  windows: { mark: () => <WindowsMark />, top: "Download for", name: "Windows" },
  linux: { mark: () => <PenguinMark />, top: "Download for", name: "Linux" },
  android: { mark: () => <RobotMark />, top: "Download the", name: "Android APK" },
  "app-store": { mark: () => <AppleMark />, top: "Download on the", name: "App Store" },
  "mac-app-store": { mark: () => <AppleMark />, top: "Download on the", name: "Mac App Store" },
  "google-play": { mark: () => <PlayMark />, top: "Get it on", name: "Google Play" },
  "microsoft-store": { mark: () => <StoreBagMark />, top: "Get it from", name: "Microsoft Store" },
};

export type PlatformBadgeProps = { kind: BadgeKind; href: string; variant?: BadgeStyle; size?: "md" | "lg"; top?: string; label?: string; className?: string };

/** One download or store button: the platform's mark and a two-line label. */
export function PlatformBadge({ kind, href, variant = "solid", size = "md", top, label, className = "" }: PlatformBadgeProps) {
  const b = BADGES[kind];
  return (
    <a href={href} className={`pdl__badge pdl__badge--${variant} pdl__badge--${size} ${className}`} data-kind={kind}>
      <span className="pdl__badge-mark">{b.mark()}</span>
      <span className="pdl__badge-text"><small>{top ?? b.top}</small><strong>{label ?? b.name}</strong></span>
    </a>
  );
}

export type Build = { label: string; arch?: Arch; format: string; size: string; href: string };
type Desktop = "macos" | "windows" | "linux";
export type PlatformDownloadsProps = {
  app: string;
  version: string;
  released?: string;
  builds: Partial<Record<Desktop, Build[]>>;
  stores?: { appStore?: string; googlePlay?: string; microsoftStore?: string; macAppStore?: string };
  /** Install commands per desktop system, shown with a copy button. */
  commands?: Partial<Record<Desktop, string>>;
  /** Force the system instead of reading it from the browser (previews, tests). */
  detected?: OS;
  arch?: Arch;
  theme?: "light" | "dark";
  className?: string;
};

const DESKTOP: Desktop[] = ["macos", "windows", "linux"];

/**
 * Platform Downloads
 * The visitor's own system first, with the right build already chosen, a
 * split button for the other builds, a one-line install command, and every
 * other platform and store one click away.
 */
export function PlatformDownloads({ app, version, released, builds, stores = {}, commands = {}, detected, arch: forcedArch, theme = "light", className = "" }: PlatformDownloadsProps) {
  const id = useId();
  const [sys, setSys] = useState<{ os: OS; arch: Arch }>({ os: detected ?? "unknown", arch: forcedArch ?? "unknown" });
  const [choice, setChoice] = useState<Partial<Record<Desktop, number>>>({});
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [others, setOthers] = useState(false);
  const caret = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);

  // Read the system after hydration so the server and first client render agree.
  useEffect(() => {
    if (detected) { setSys({ os: detected, arch: forcedArch ?? "unknown" }); return; }
    const nav = navigator as Navigator & { userAgentData?: { platform?: string; getHighEntropyValues?: (h: string[]) => Promise<{ architecture?: string }> } };
    const base = { ua: navigator.userAgent, platform: nav.userAgentData?.platform, touchPoints: navigator.maxTouchPoints };
    setSys(detect(base));
    nav.userAgentData?.getHighEntropyValues?.(["architecture"]).then((h) => setSys(detect({ ...base, architecture: h.architecture }))).catch(() => {});
  }, [detected, forcedArch]);
  useEffect(() => { if (!copied) return; const t = setTimeout(() => setCopied(false), 1800); return () => clearTimeout(t); }, [copied]);
  useEffect(() => {
    if (!menu) return;
    list.current?.querySelector<HTMLElement>("[aria-checked='true']")?.focus();
    const away = (e: PointerEvent) => { if (!list.current?.contains(e.target as Node) && !caret.current?.contains(e.target as Node)) setMenu(false); };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [menu]);

  const desk = DESKTOP.includes(sys.os as Desktop) && builds[sys.os as Desktop]?.length ? (sys.os as Desktop) : null;
  const options = desk ? builds[desk]! : [];
  const auto = desk ? options.indexOf(pick(options, sys.arch)!) : 0;
  const current = desk ? options[choice[desk] ?? auto] : null;
  const command = desk ? commands[desk] : undefined;

  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = [...(list.current?.querySelectorAll<HTMLElement>("[role='menuitemradio']") ?? [])];
    const k = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); items[(k + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length]?.focus(); }
    else if (e.key === "Home" || e.key === "End") { e.preventDefault(); items[e.key === "Home" ? 0 : items.length - 1]?.focus(); }
    else if (e.key === "Escape" || e.key === "Tab") { e.preventDefault(); setMenu(false); caret.current?.focus(); }
  };
  const copy = async () => {
    if (!command) return;
    try { await navigator.clipboard.writeText(command); } catch { /* clipboard blocked: the command stays selectable */ }
    setCopied(true);
  };

  const mobileStore = sys.os === "ios" && stores.appStore ? { kind: "app-store" as const, href: stores.appStore } : sys.os === "android" && stores.googlePlay ? { kind: "google-play" as const, href: stores.googlePlay } : null;
  const otherDesk = DESKTOP.filter((d) => d !== desk && builds[d]?.length);
  const storeList = ([["mac-app-store", stores.macAppStore], ["app-store", stores.appStore], ["google-play", stores.googlePlay], ["microsoft-store", stores.microsoftStore]] as [BadgeKind, string | undefined][]).filter(([k, h]) => h && !(mobileStore && mobileStore.kind === k)) as [BadgeKind, string][];
  const known = !!(desk || mobileStore);

  return (
    <section className={`pdl pdl--${theme} ${className}`} aria-labelledby={`${id}-t`}>
      <header className="pdl__head">
        <h3 id={`${id}-t`}>{known ? `${app} for ${LABEL[sys.os as Exclude<OS, "unknown">]}` : `Download ${app}`}</h3>
        <p>Version {version}{released ? ` · ${released}` : ""}</p>
      </header>

      {desk && current && (
        <div className="pdl__primary">
          <div className="pdl__split">
            <a className="pdl__go" href={current.href} download>
              <span className="pdl__go-mark">{BADGES[desk].mark()}</span>
              <span className="pdl__go-text">
                <strong>Download for {LABEL[desk]}</strong>
                <small>{current.label} · {current.format} · {current.size}</small>
              </span>
            </a>
            {options.length > 1 && (
              <button
                ref={caret}
                type="button"
                className="pdl__caret"
                aria-haspopup="menu"
                aria-expanded={menu}
                aria-controls={menu ? `${id}-m` : undefined}
                aria-label={`Choose a build for ${LABEL[desk]}, now ${current.label}`}
                onClick={() => setMenu((m) => !m)}
                onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setMenu(true); } }}
              >
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
              </button>
            )}
            {menu && (
              <div ref={list} id={`${id}-m`} className="pdl__menu" role="menu" aria-label={`${LABEL[desk]} builds`} onKeyDown={onMenuKey}>
                {options.map((o, i) => (
                  <button
                    key={o.href}
                    type="button"
                    role="menuitemradio"
                    aria-checked={o === current}
                    tabIndex={-1}
                    onClick={() => { setChoice((c) => ({ ...c, [desk]: i })); setMenu(false); caret.current?.focus(); }}
                  >
                    <span>{o.label}{i === auto && sys.arch !== "unknown" && new Set(options.map((x) => x.arch)).size > 1 ? <em> recommended</em> : null}</span>
                    <small>{o.format} · {o.size}</small>
                  </button>
                ))}
              </div>
            )}
          </div>
          {command && (
            <div className="pdl__cmd">
              <code><span aria-hidden="true">$ </span>{command}</code>
              <button type="button" onClick={copy} aria-label={copied ? "Copied" : "Copy install command"} data-done={copied || undefined}>
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          )}
        </div>
      )}

      {mobileStore && (
        <div className="pdl__primary">
          <PlatformBadge kind={mobileStore.kind} href={mobileStore.href} size="lg" variant={theme === "dark" ? "light" : "solid"} />
          <p className="pdl__hint">The desktop apps are below, for when you are back at a computer.</p>
        </div>
      )}

      <div className="pdl__more">
        {known ? (
          <button type="button" className="pdl__toggle" aria-expanded={others} aria-controls={`${id}-o`} onClick={() => setOthers((o) => !o)}>
            Other platforms <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
          </button>
        ) : (
          <p className="pdl__hint">Choose your system:</p>
        )}
        <div id={`${id}-o`} className="pdl__grid" hidden={known && !others}>
          {(known ? otherDesk : DESKTOP.filter((d) => builds[d]?.length)).map((d) => (
            <PlatformBadge key={d} kind={d} href={pick(builds[d]!, "unknown")!.href} variant="outline" />
          ))}
          {storeList.map(([k, h]) => <PlatformBadge key={k} kind={k} href={h} variant="outline" />)}
        </div>
      </div>
      <p className="pdl__sr" aria-live="polite">{copied ? "Install command copied" : ""}</p>
    </section>
  );
}
