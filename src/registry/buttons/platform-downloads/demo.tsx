"use client";
import { useState } from "react";
import { PlatformBadge, PlatformDownloads, type BadgeKind, type OS } from "./PlatformDownloads";

const BUILDS = {
  macos: [
    { label: "Apple silicon", arch: "arm" as const, format: ".dmg", size: "84 MB", href: "#" },
    { label: "Intel", arch: "x64" as const, format: ".dmg", size: "91 MB", href: "#mac-intel" },
  ],
  windows: [
    { label: "64-bit", arch: "x64" as const, format: ".exe", size: "96 MB", href: "#" },
    { label: "ARM64", arch: "arm" as const, format: ".exe", size: "93 MB", href: "#win-arm" },
  ],
  linux: [
    { label: "Debian, Ubuntu", arch: "x64" as const, format: ".deb", size: "88 MB", href: "#" },
    { label: "Fedora, openSUSE", arch: "x64" as const, format: ".rpm", size: "89 MB", href: "#rpm" },
    { label: "Any distribution", arch: "x64" as const, format: ".AppImage", size: "102 MB", href: "#appimage" },
  ],
};
const SYSTEMS: [OS, string][] = [["macos", "macOS"], ["windows", "Windows"], ["linux", "Linux"], ["ios", "iOS"], ["android", "Android"]];
const KINDS: BadgeKind[] = ["macos", "windows", "linux", "app-store", "google-play", "microsoft-store", "mac-app-store", "android"];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const theme = dark ? "dark" : "light";
  const [os, setOs] = useState<OS>("macos");
  return (
    <div className={`min-h-full w-full px-4 py-8 ${dark ? "bg-[#060607]" : "bg-[#e9e9e6]"}`}>
      <div className="mx-auto grid w-full max-w-[44rem] gap-4">
        <div className={`flex flex-wrap items-center gap-2 text-[13px] ${dark ? "text-[#9b9b98]" : "text-[#6c6c69]"}`} role="group" aria-label="Preview as">
          <span>Preview as</span>
          {SYSTEMS.map(([k, l]) => (
            <button key={k} type="button" aria-pressed={os === k} onClick={() => setOs(k)}
              className={`rounded-full border px-3 py-1 ${os === k ? (dark ? "border-white bg-white text-black" : "border-black bg-black text-white") : dark ? "border-white/15" : "border-black/15"}`}>
              {l}
            </button>
          ))}
        </div>
        <PlatformDownloads
          key={os}
          app="Qalam"
          version="2.4.1"
          released="2 October 2026"
          detected={os}
          arch={os === "macos" ? "arm" : "x64"}
          builds={BUILDS}
          stores={{ appStore: "#", googlePlay: "#", microsoftStore: "#", macAppStore: "#" }}
          commands={{ macos: "brew install --cask qalam", windows: "winget install Qalam.Qalam", linux: "sudo apt install ./qalam_2.4.1_amd64.deb" }}
          theme={theme}
        />
        {(["solid", "outline", "light"] as const).map((v) => (
          <div key={v} className={`pdl__gallery ${dark ? "pdl__gallery--dark" : ""}`}>
            <h4>{v === "solid" ? "Solid" : v === "outline" ? "Outline" : "Light"}</h4>
            <div className="pdl__row">{KINDS.map((k) => <PlatformBadge key={k} kind={k} href="#" variant={v} />)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
