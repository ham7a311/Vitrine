---
name: content-structure-auditor
description: Map what a page says against what its visitor came to find out, then fix the order, headings, labels and length so the page reads in the right sequence - and so search engines and screen readers get the same outline. Use when a page is long but unclear, before writing a new page, or when headings don't tell the story on their own.
---

# /content-structure-auditor

## 1. Visitor questions

List the 5–8 questions a visitor to this page has, in the order they arise:

1. What is it?
2. Is it for me?
3. How does it work?
4. What does it cost?
5. Can I trust it?
6. How do I start?

Rank them by how many visitors have each one.

## 2. Map the page

Extract the page's outline (`h1`–`h3`) and, under each heading, one line summarising what the section actually says. Then match each question to the section that answers it.

- **Unanswered questions:** add a section, or a sentence to an existing one.
- **Answers nobody asked:** cut them, or move them lower.
- **Out of order:** if "what does it cost" comes before "what is it", reorder.

## 3. Headings that carry the story

- Read only the headings, top to bottom. They should summarise the page.
- Replace label headings ("Features", "Overview") with statements ("Every deploy gets its own URL").
- Keep one `h1` and a real hierarchy, with no levels skipped for size; style the right level instead.

## 4. Sections that scan

- Each section opens with its point in the first sentence.
- Use lists for parallel items, tables for comparisons, and steps for sequences.
- Cut sentences that only restate the heading.
- Labels, buttons and links use the same words for the same thing everywhere (don't say "workspace" in one place and "team" in another).

## 5. Length

A section is as long as its question needs. Measure each section in words against how important its question is, and trim the long ones that answer minor questions.

## Output

1. The question list.
2. A before/after outline.
3. A list of moves, cuts and additions.
4. The rewritten headings.

Then apply them, and re-read the headings alone to confirm they tell the story.

## Don't use when

- The words themselves are the problem (generic, inflated). Use `/copy-quality`; this skill fixes order and structure.
- The page's purpose isn't decided yet. Decide who it's for and what they need first.

## Acceptance criteria

- The visitor's questions are written down, and the page answers them in that order.
- The headings alone tell the page's story.
- There's one `h1`, and the heading levels nest without skipping.
- Nothing on the page answers a question no visitor asked.

## Common failure modes

- **Clever headings** that sound good and say nothing ("Built different"), so scanning the headings tells you nothing.
- **Company order instead of visitor order:** history and mission before what the product does.
- **Cutting length by cutting answers** instead of cutting repetition.
- **Visual headings that aren't headings,** or headings chosen for their size.

## Final self-review

- If I read only the headings, do I understand the page?
- Is the most-asked question answered first?
- Did I remove repetition before removing content?
