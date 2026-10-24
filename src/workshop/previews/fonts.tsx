/**
 * A recipe's own typefaces, from Google Fonts. Each preview loads only what it sets, on top of the faces the
 * preview layout already provides (src/site/ComponentFonts.tsx). React hoists the stylesheet into <head>.
 *
 * families: Google Fonts family specs, e.g. ["Fraunces:opsz,wght@9..144,300..700", "Inter:wght@400..600"].
 */
export function PreviewFonts({ families }: { families: string[] }) {
  const href = `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f.replace(/ /g, "+")}`).join("&")}&display=swap`;
  return <link rel="stylesheet" href={href} precedence="default" />;
}
