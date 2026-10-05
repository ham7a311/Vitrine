import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "next-issue",
  name: "Next Issue",
  category: "ctas",
  description: "A newsletter sign-up that shows what you'd be signing up for: the last issues with their real subject lines and dates, and an empty dashed slot for the next one that fills with your name when you subscribe.",
  tags: ["newsletter", "subscribe", "email", "cta", "sign up", "form", "archive", "issues"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["NextIssue.tsx", "next-issue.css"],
  dependencies: [],
  prompt: `Build a newsletter call to action whose evidence is the newsletter itself. No incentive, no "join 10,000 readers".

Two columns above 44rem of container width (stacked below). Left: the newsletter's name in a display serif (clamp(2.25rem, 8cqi, 3.5rem), tight tracking, max 14ch), one honest sentence about what it is, how long and how often; then the form: a mono caps "Email" label, a borderless input on a 1px rule that darkens on focus, and a solid 44px pill button that says what it does ("Send me the next issue"), never "Submit".

Right: a mono caps caption "Recent issues" and a ruled ordered list of three real issues. Each row is a grid of a mono number ("No. 024"), the subject line in a 21px serif, and a mono date ("1 OCT"). Above them sits the next issue as a dashed-bottom slot with the number and send date, and the italic muted words "Not written yet. Yours, if you sign up."

On subscribe: validate the address first (pattern; error text under the field as role=alert, rule turns danger, aria-invalid). Show "Adding" with aria-busy while the promise runs; on failure keep the address and say nothing was saved. On success the form is replaced by a line with a drawn tick: "No. 025 will reach priya@company.com on Thursday 15 October." and a "Use another address" link; at the same time the slot fills with a wash from left to right (scaleX 0 to 1, 520ms cubic-bezier(.2,.8,.2,1)) and its italic text cross-fades to "On its way to you". A role=status line announces it. Paper and Night themes.`,
  interaction: "Enter an address and subscribe; the empty issue at the head of the list fills in. Try an invalid address first.",
  animation: "Slot wash 520ms, its words cross-fade over 240ms after a 260ms delay; the confirmation rises in 320ms and its tick draws in 360ms.",
  a11y: "A labelled email input, errors as role=alert with aria-describedby, a busy button, and a status region announcing the result. The recent issues are a real ordered list with <time> elements. Reduced motion makes the wash and tick instant.",
  responsive: "Two columns above 44rem of container width; below it the list rows put the issue number on its own line under 26rem.",
  touchFallback: "Plain form controls; nothing depends on hover.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#f6f5f1", mode: "fill", height: 560, frame: [1100, 720] },
  isNew: true,
};
