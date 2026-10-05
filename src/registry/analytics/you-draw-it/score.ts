/** How far a drawn guess was from what happened, in words a reader can take in. */
export type Result = { error: number; bias: "high" | "low" | "even"; sentence: string };

const slope = (ys: number[]) => {
  const n = ys.length, mx = (n - 1) / 2, my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  ys.forEach((y, i) => { num += (i - mx) * (y - my); den += (i - mx) ** 2; });
  return den ? num / den : 0;
};

/**
 * Mean absolute error as a share of the true values (scaled by the series'
 * range when values sit near zero), whether the guess ran high or low, and a
 * sentence comparing the shapes.
 */
export function score(truth: number[], guess: number[], range: number): Result {
  const n = Math.min(truth.length, guess.length);
  if (!n) return { error: 0, bias: "even", sentence: "" };
  let abs = 0, signed = 0;
  for (let i = 0; i < n; i++) {
    const scale = Math.max(Math.abs(truth[i]), range * 0.05);
    abs += Math.abs(guess[i] - truth[i]) / scale;
    signed += guess[i] - truth[i];
  }
  const error = abs / n;
  const meanTruth = truth.slice(0, n).reduce((a, b) => a + Math.abs(b), 0) / n || 1;
  const bias = Math.abs(signed / n) < meanTruth * 0.04 ? "even" : signed > 0 ? "high" : "low";
  const pct = Math.round(error * 100);
  const st = slope(truth.slice(0, n)), sg = slope(guess.slice(0, n));
  const flat = range * 0.01;
  const word = (s: number) => (s > flat ? "rise" : s < -flat ? "fall" : "hold steady");
  let shape: string;
  if (word(st) !== word(sg)) shape = `You expected it to ${word(sg)}; it ${word(st) === "rise" ? "rose" : word(st) === "fall" ? "fell" : "held steady"}.`;
  else if (bias === "high") shape = `You had the direction right but guessed too high.`;
  else if (bias === "low") shape = `You had the direction right but guessed too low.`;
  else shape = "You had the shape right.";
  const lead = pct <= 5 ? `Very close: within ${pct}% on average.` : `You were off by ${pct}% on average.`;
  return { error, bias, sentence: `${lead} ${shape}` };
}
