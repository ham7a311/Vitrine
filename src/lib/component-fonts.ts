const FAMILIES = ["Anton", "Cinzel Decorative", "Cinzel", "Pinyon Script", "Poiret One", "UnifrakturMaguntia", "Archivo", "Geist Mono", "Geist", "IBM Plex Mono", "IBM Plex Sans", "Instrument Serif", "Hanken Grotesk", "JetBrains Mono", "Newsreader"];
/** Display external font requirements alongside each portable source bundle. */
export function componentFonts(files: { code: string }[]) {
  const code = files.map(f => f.code.replaceAll("_", " ")).join("\n");
  return FAMILIES.filter(font => code.includes(font));
}
