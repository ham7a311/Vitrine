/* Globe Search — orthographic projection of a wireframe globe. Pure; no React. */

const RAD = Math.PI / 180;

/** The viewer looks down on the globe a little, so the poles tip toward you. */
export const TILT = 18;

/**
 * Project a point on the sphere (degrees) for a globe turned by `spin` degrees. x/y are unit
 * screen coordinates (−1…1, y up); `z > 0` means the point faces the viewer.
 */
export function project(lat: number, lon: number, spin: number, tilt = TILT) {
  const φ = lat * RAD;
  const λ = (lon - spin) * RAD;
  const φ0 = tilt * RAD;
  return {
    x: Math.cos(φ) * Math.sin(λ),
    y: Math.cos(φ0) * Math.sin(φ) - Math.sin(φ0) * Math.cos(φ) * Math.cos(λ),
    z: Math.sin(φ0) * Math.sin(φ) + Math.cos(φ0) * Math.cos(φ) * Math.cos(λ),
  };
}

/**
 * The graticule as two SVG paths — the near side and the far side — on a board of radius `r` centred
 * at (c, c). `step` is the spacing of meridians and parallels in degrees.
 */
export function graticule(spin: number, r: number, c: number, step: number) {
  let near = "";
  let far = "";
  const line = (pts: [number, number][]) => {
    let prev: boolean | null = null;
    for (const [lat, lon] of pts) {
      const p = project(lat, lon, spin);
      const front = p.z >= 0;
      const cmd = prev === front ? "L" : "M";
      const xy = `${(c + p.x * r).toFixed(2)},${(c - p.y * r).toFixed(2)}`;
      if (front) near += `${cmd}${xy}`;
      else far += `${cmd}${xy}`;
      prev = front;
    }
  };
  for (let lon = 0; lon < 360; lon += step) {
    const pts: [number, number][] = [];
    for (let lat = -90; lat <= 90; lat += 5) pts.push([lat, lon]);
    line(pts);
  }
  for (let lat = -90 + step; lat < 90; lat += step) {
    const pts: [number, number][] = [];
    for (let lon = 0; lon <= 360; lon += 5) pts.push([lat, lon]);
    line(pts);
  }
  return { near, far };
}

/** Shortest signed turn from `a` to `b`, in degrees. */
export const turnTo = (a: number, b: number) => ((((b - a) % 360) + 540) % 360) - 180;

export type Place = { lat: number; lon: number };
