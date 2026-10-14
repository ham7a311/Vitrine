/** Where the sun is overhead, and how high it stands anywhere, from NOAA's low-precision formulas (good to well under a degree). */

const RAD = Math.PI / 180;

/** The subsolar point for a moment: latitude (= the sun's declination) and longitude, in degrees. */
export function subsolar(t: number) {
  const d = new Date(t);
  const start = Date.UTC(d.getUTCFullYear(), 0, 1);
  const doy = Math.floor((t - start) / 86400000) + 1;
  const hour = d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600;
  const g = ((2 * Math.PI) / 365) * (doy - 1 + (hour - 12) / 24);
  const eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  let lon = -15 * (hour - 12 + eq / 60);
  lon = ((((lon + 180) % 360) + 360) % 360) - 180;
  return { lat: decl / RAD, lon };
}

/** The sun's altitude in degrees at a place: above 0 is day, 0 to −6 civil twilight, below −12 night. */
export function altitude(lat: number, lon: number, sun: { lat: number; lon: number }) {
  const f = lat * RAD, d = sun.lat * RAD, h = (lon - sun.lon) * RAD;
  return Math.asin(Math.max(-1, Math.min(1, Math.sin(f) * Math.sin(d) + Math.cos(f) * Math.cos(d) * Math.cos(h)))) / RAD;
}

/** Daylight 0–1 from the sun's altitude, easing through twilight down to −12°. */
export const light = (alt: number) => (alt >= 2 ? 1 : alt <= -12 ? 0 : ((alt + 12) / 14) ** 1.6);

/** The latitude of the day/night line at a longitude. */
export function terminator(lon: number, sun: { lat: number; lon: number }) {
  const h = (lon - sun.lon) * RAD, d = sun.lat * RAD;
  return Math.atan(-Math.cos(h) / Math.tan(Math.abs(d) < 1e-4 ? 1e-4 : d)) / RAD;
}

/** "07:42" for a moment at a fixed UTC offset in hours. */
export function clock(t: number, offset: number) {
  const d = new Date(t + offset * 3600000);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

/** Local hour (0–24, fractional) at a fixed offset. */
export const hourAt = (t: number, offset: number) => ((((t / 3600000 + offset) % 24) + 24) % 24);
