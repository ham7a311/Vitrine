export type OS = "macos" | "windows" | "linux" | "android" | "ios" | "unknown";
export type Arch = "arm" | "x64" | "unknown";

export type Signals = {
  ua: string;
  /** navigator.userAgentData.platform, when the browser offers it. */
  platform?: string;
  /** From userAgentData.getHighEntropyValues(["architecture"]): "arm" or "x86". */
  architecture?: string;
  /** navigator.maxTouchPoints: an iPad asks for the desktop site and says "Macintosh". */
  touchPoints?: number;
};

/** Best guess at the visitor's system. Order matters: Android says Linux, iPadOS says Mac. */
export function detect({ ua, platform = "", architecture, touchPoints = 0 }: Signals): { os: OS; arch: Arch } {
  const s = `${platform} ${ua}`;
  let os: OS = "unknown";
  if (/android/i.test(s)) os = "android";
  else if (/iphone|ipad|ipod/i.test(s) || (/macintosh|mac os x|macos/i.test(s) && touchPoints > 1)) os = "ios";
  else if (/mac/i.test(s)) os = "macos";
  else if (/win/i.test(s)) os = "windows";
  else if (/linux|x11|cros/i.test(s)) os = "linux";

  let arch: Arch = "unknown";
  if (architecture) arch = /arm/i.test(architecture) ? "arm" : /x86/i.test(architecture) ? "x64" : "unknown";
  else if (/arm64|aarch64|armv8/i.test(ua)) arch = "arm";
  // Every Mac browser reports "Intel Mac OS X", so a Mac with no architecture hint stays unknown.
  else if (os !== "macos" && /x86_64|x64|win64|wow64|amd64/i.test(ua)) arch = "x64";
  return { os, arch };
}

/** Pick the build to offer first: matching architecture, else the first listed. */
export function pick<T extends { arch?: Arch }>(builds: T[], arch: Arch): T | undefined {
  return builds.find((b) => b.arch && b.arch === arch) ?? builds[0];
}

export const LABEL: Record<Exclude<OS, "unknown">, string> = { macos: "macOS", windows: "Windows", linux: "Linux", android: "Android", ios: "iPhone & iPad" };
