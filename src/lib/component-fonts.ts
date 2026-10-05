const FAMILIES = ["Anton", "Cinzel Decorative", "Cinzel", "Pinyon Script", "Poiret One", "UnifrakturMaguntia", "Archivo", "Geist Mono", "Geist", "IBM Plex Mono", "IBM Plex Sans", "Instrument Serif", "Hanken Grotesk", "JetBrains Mono", "Newsreader", "Inter", "Nunito", "DM Mono"];
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** A family counts when it is named as a font, not merely contained in a word ("Inter" inside "IntersectionObserver"). */
const pattern = (font: string) => new RegExp(`(?:["'\`]${escape(font)}["'\`]|family-name:${escape(font)}(?![\\w ]*[A-Za-z]{2})|(?:^|[\\s:,("'\`])${escape(font)}\\s*[,;])`, "m");
/** Display external font requirements alongside each portable source bundle. */
export function componentFonts(files: { code: string }[]) {
  const code = files.map(f => f.code.replaceAll("_", " ")).join("\n");
  return FAMILIES.filter(font => pattern(font).test(code));
}

/** The component's own CSS is self-contained; only its example stages itself with Tailwind utility classes. */
export function exampleUsesTailwind(files: { name: string; code: string }[]) {
  const example = files.find(f => f.name === "example.tsx");
  return !!example && /className=["'{`][^>]*?(?:^|[\s"'`])(?:flex|grid|min-h-full|w-full|gap-\d|p-\d|bg-\[|text-\[)/m.test(example.code);
}
