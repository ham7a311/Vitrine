const COMPONENT_FONTS =
  "https://fonts.googleapis.com/css2?family=Anton&family=Cinzel:wght@400..900&family=Cinzel+Decorative:wght@700;900&family=Pinyon+Script&family=Poiret+One&family=UnifrakturMaguntia&family=Archivo:wdth,wght@100,400..700&family=Geist:wght@400..700&family=Geist+Mono:wght@400;500&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&family=Instrument+Serif:ital@0;1&family=Hanken+Grotesk:wght@400..700&family=JetBrains+Mono:wght@400;500&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap";

export function ComponentFonts() {
  return <><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" /><link rel="stylesheet" href={COMPONENT_FONTS} /></>;
}
