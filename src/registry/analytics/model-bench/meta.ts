import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "model-bench",
  name: "Model Bench",
  category: "analytics",
  description: "Compare AI models the way you'd choose one: score against cost or time, an efficient frontier, and a linked ranking with 95% intervals.",
  tags: ["benchmark", "ai", "models", "llm", "scatter", "chart", "compare", "pareto"],
  traits: ["hover", "click", "keyboard"],
  source: "original",
  files: ["ModelBench.tsx", "model-bench.css"],
  dependencies: [],
  prompt: `Build a benchmark view for comparing AI models, in SVG and React with no chart library. The headline is the takeaway in words — "Orion 3 leads at 71.4% · Orion 3 Mini gets 89% of that for 21% of the cost" — computed from the data: the top scorer, and the cheapest (or fastest, matching the x axis) frontier model that reaches at least 88% of its score.

Left: a scatter of score (y, %, gridlines every 5) against cost per task or median time per task (x, log scale with 1-2-5 ticks, labelled with which direction is better). A segmented control switches the x measure and every dot glides to its new position (650ms, cubic out). Each model is a dot in its provider's colour (fixed by provider order in a colour-blind-checked five-colour palette, so hiding a provider never repaints the others), with a vertical whisker for its 95% interval and a direct label. The efficient frontier — models nothing beats on both score and the x measure — is a dashed line, and frontier models are drawn filled while dominated ones are hollow.

Right: the same models ranked by score as compact bars with their interval as a faint band behind each bar. Hovering a dot or a row (or focusing a row) highlights that model in both views and dims the rest; a tooltip gives provider, score with interval, cost and time. Provider legend chips toggle providers on and off. A Table button swaps the chart for a full results table. The demo data is fictional.`,
  interaction: "Switch between cost and time on the x axis; hover a dot or a row to highlight a model in both views; toggle providers in the legend; use Table for the numbers.",
  animation: "Dots tween between axes over 650ms; bars ease 600ms; highlights fade 200ms.",
  a11y: "The chart has a summary label, the ranking is an ordered list of focusable rows that highlight the model, colour always comes with a name (labels, legend, list), and a full table view is one click away. Reduced motion jumps between axes.",
  responsive: "The scatter and ranking sit side by side and stack under 760px; the SVG scales with its width.",
  touchFallback: "Tap rows or dots to highlight; the table view covers precise reading.",
  variants: [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ],
  preview: { bg: "#f2f1ed", mode: "fill", height: 640 },
};
