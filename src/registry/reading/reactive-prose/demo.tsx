"use client";
import { Out, ReactiveProse, Scrub, Trend } from "./ReactiveProse";

const TODAY = Date.UTC(2026, 9, 5);
const month = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
const num = new Intl.NumberFormat("en-US");
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// Weekly model: new sign-ups arrive, a share of readers leave each month.
function grow({ readers, perWeek, churn, target, cost }: Record<string, number>) {
  const leave = churn / 100 / 4.345;
  const ceiling = leave > 0 ? perWeek / leave : Infinity;
  const series = [readers];
  let r = readers, weeks = 0;
  while (r < target && weeks < 520) { r += perWeek - r * leave; weeks++; if (weeks <= 104) series.push(Math.round(r)); }
  const reached = r >= target;
  return {
    when: readers >= target ? "already" : reached ? month.format(new Date(TODAY + weeks * 7 * 86_400_000)) : "never",
    weeks: reached ? `${num.format(weeks)} weeks from now` : `it levels off near ${num.format(Math.round(ceiling))}`,
    monthly: usd.format(target * cost),
    goal: target,
    series,
  };
}

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`min-h-full w-full px-4 py-10 ${dark ? "bg-[#0c0b08]" : "bg-[#e9e3d6]"}`}>
      <div className="mx-auto w-full max-w-[42rem]">
        <ReactiveProse initial={{ readers: 120, perWeek: 40, churn: 2, target: 1000, cost: 0.04 }} compute={grow} theme={dark ? "dark" : "light"}>
          <h3>When does the newsletter pass a thousand?</h3>
          <p>
            Masar's field notes go out to <Scrub name="readers" label="readers today" min={0} max={5000} step={10} format={(v) => num.format(v)} /> readers today.
            If <Scrub name="perWeek" label="new sign-ups per week" min={0} max={400} step={5} /> people sign up each week and{" "}
            <Scrub name="churn" label="percent who unsubscribe each month" min={0} max={30} step={0.5} format={(v) => `${v}%`} /> unsubscribe each month,
            the list passes <Scrub name="target" label="target readers" min={100} max={20000} step={100} format={(v) => num.format(v)} /> readers{" "}
            <Out name="when" label="Passes the target" format={(v) => (v === "never" ? "never" : v === "already" ? "already" : `in ${v}`)} />, <Out name="weeks" label="Timing" />.
          </p>
          <Trend name="series" target="goal" caption="Readers, week by week, for up to two years. The dashed line is the target." />
          <p>
            At <Scrub name="cost" label="sending cost per reader per month, in dollars" min={0} max={1} step={0.01} format={(v) => `$${v.toFixed(2)}`} /> a reader, sending to that many costs about{" "}
            <Out name="monthly" label="Monthly cost" /> a month.
          </p>
        </ReactiveProse>
        <p className={`mt-4 px-1 font-sans text-[13px] ${dark ? "text-[#a69f90]" : "text-[#6a655c]"}`}>Drag any blue number sideways, or click it and type. Try unsubscribes above 4%.</p>
      </div>
    </div>
  );
}
