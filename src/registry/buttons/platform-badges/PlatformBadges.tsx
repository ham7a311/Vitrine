"use client";
import type { ReactNode } from "react";
import { AppleMark, PenguinMark, PlayMark, RobotMark, StoreBagMark, WindowsMark } from "./logos";
import "./platform-badges.css";

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

export type PlatformBadgeProps = { kind: BadgeKind; href: string; variant?: BadgeStyle; size?: "md" | "lg"; top?: string; label?: string; theme?: "light" | "dark"; className?: string };

/** One download or store button: the platform's mark and a two-line label. */
export function PlatformBadge({ kind, href, variant = "solid", size = "md", top, label, theme = "light", className = "" }: PlatformBadgeProps) {
  const b = BADGES[kind];
  return (
    <a href={href} className={`pbdg__badge pbdg__badge--${variant} pbdg__badge--${size} pbdg ${theme === "dark" ? "pbdg--dark" : ""} ${className}`} data-kind={kind}>
      <span className="pbdg__badge-mark">{b.mark()}</span>
      <span className="pbdg__badge-text"><small>{top ?? b.top}</small><strong>{label ?? b.name}</strong></span>
    </a>
  );
}


const DESKTOP: BadgeKind[] = ["macos", "windows", "linux"];
const STORES: BadgeKind[] = ["app-store", "google-play", "microsoft-store", "mac-app-store", "android"];

export type PlatformBadgeSetProps = {
  /** solid: near-black like store badges; outline: a hairline; light: a pale slab with a soft shadow. */
  look?: BadgeStyle;
  /** Where each badge goes (a link for every kind); defaults to "#". */
  hrefs?: Partial<Record<BadgeKind, string>>;
  theme?: "light" | "dark";
  className?: string;
};

/**
 * Platform Badges
 * Download and store buttons with the platform marks (macOS, Windows, Linux,
 * App Store, Google Play, Microsoft Store, Android) in one style, grouped
 * into desktop, stores and a large pair.
 */
export function PlatformBadgeSet({ look = "solid", hrefs = {}, theme = "light", className = "" }: PlatformBadgeSetProps) {
  const href = (k: BadgeKind) => hrefs[k] ?? "#";
  return (
    <div className={`pbdg-set ${theme === "dark" ? "pbdg-set--dark" : ""} ${className}`}>
      <section aria-label="Desktop">
        <h4>Desktop</h4>
        <div className="pbdg-set__row">{DESKTOP.map((k) => <PlatformBadge key={k} kind={k} href={href(k)} variant={look} theme={theme} />)}</div>
      </section>
      <section aria-label="Stores">
        <h4>Stores</h4>
        <div className="pbdg-set__row">{STORES.map((k) => <PlatformBadge key={k} kind={k} href={href(k)} variant={look} theme={theme} />)}</div>
      </section>
      <section aria-label="Large">
        <h4>Large</h4>
        <div className="pbdg-set__row">
          <PlatformBadge kind="app-store" href={href("app-store")} variant={look} size="lg" theme={theme} />
          <PlatformBadge kind="google-play" href={href("google-play")} variant={look} size="lg" theme={theme} />
        </div>
      </section>
    </div>
  );
}
