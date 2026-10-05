#!/usr/bin/env python3
"""Give theme-only variants (Paper/Night, Light/Dark) a description built from the component's own CSS.

A theme is declared in each component as custom-property overrides on `.root--<id>`. Without this, a copied
prompt only says "use the night theme shown in the preview", which a reader cannot see. This writes the real
values into each variant's `prompt` in meta.ts and, with --check, fails when the CSS and the prompt disagree.

    python3 scripts/theme-prompts.py          # write
    python3 scripts/theme-prompts.py --check  # verify (used by npm run check:themes)
"""
import glob
import json
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "registry")
THEME_LABELS = {"paper", "night", "light", "dark"}
MARK = "Palette for this theme"


def rules(css):
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    return [(m.group(1).strip(), m.group(2)) for m in re.finditer(r"([^{}@]+)\{([^{}]*)\}", css)]


def custom_properties(body):
    return {k: re.sub(r"\s+", " ", v.strip()) for k, v in re.findall(r"(--[\w-]+)\s*:\s*([^;]+);?", body)}


def describe(directory, variants, css_text, tsx_text):
    """Return {variant id: description} or None when the theme is not expressed as custom properties."""
    rs = rules(css_text)
    first_override = next((a for a, b in rs if re.fullmatch(r"\.[\w-]+--%s" % re.escape(variants[1][0]), a) and custom_properties(b)), None)
    if not first_override:
        return None
    root = first_override[1:].rsplit("--", 1)[0]
    by_id = {}
    for vid, _ in variants:
        merged = {}
        for selector, body in rs:
            if selector == f".{root}--{vid}":
                merged.update(custom_properties(body))
        by_id[vid] = merged
    names = sorted({n for vid, _ in variants[1:] for n in by_id[vid]})
    base = {}
    for selector, body in rs:
        if selector == f".{root}":
            base.update(custom_properties(body))
    # The first variant is the root's own values, unless it declares an explicit modifier of its own.
    if not by_id[variants[0][0]]:
        by_id[variants[0][0]] = {n: base[n] for n in names if n in base}
    out = {}
    for vid, label in variants:
        values = by_id[vid]
        if not values:
            return None
        prop = re.search(r"\btheme\??:\s*\"[^;]*\"%s\"" % re.escape(vid), tsx_text) or re.search(r"\"%s\"\s*\|" % re.escape(vid), tsx_text)
        selector = f' Select it with the theme option set to "{vid}".' if prop else ""
        pairs = "; ".join(f"{name} {value}" for name, value in sorted(values.items()))
        out[vid] = (
            f"{MARK} ({label}): {pairs}. Treat these as the root colour tokens, one value per role, and name them to suit your code."
            f"{selector} Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces."
        )
    return out


def variant_block(source):
    m = re.search(r"variants:\s*\[(.*?)\n?\s*\],?\s*\n", source, re.S) or re.search(r"variants:\s*\[(.*?)\]", source, re.S)
    return m


def main(check):
    changed, covered, skipped, stale = 0, 0, [], []
    for meta in sorted(glob.glob(os.path.join(ROOT, "*", "*", "meta.ts"))):
        directory = os.path.dirname(meta)
        source = open(meta, encoding="utf8").read()
        m = re.search(r"variants:\s*\[(.*?)\]\s*,", source, re.S)
        if not m:
            continue
        block = m.group(1)
        variants = re.findall(r"id:\s*\"([^\"]+)\",\s*label:\s*\"([^\"]+)\"", block)
        if len(variants) < 2 or not all(label.lower() in THEME_LABELS for _, label in variants):
            continue
        if "prompt:" in block and MARK not in block:
            continue  # hand-written descriptions win
        css = "".join(open(f, encoding="utf8").read() for f in glob.glob(os.path.join(directory, "*.css")))
        tsx = "".join(open(f, encoding="utf8").read() for f in glob.glob(os.path.join(directory, "*.tsx")) if not f.endswith("demo.tsx"))
        described = describe(directory, variants, css, tsx)
        rel = os.path.relpath(directory, ROOT)
        if described is None:
            skipped.append(rel)
            continue
        covered += 1
        new_block = block
        for vid, label in variants:
            text = json.dumps(described[vid], ensure_ascii=False)
            literal = re.compile(r"\{\s*id:\s*\"%s\",\s*label:\s*\"%s\"(?:,\s*prompt:\s*\"(?:[^\"\\]|\\.)*\")?\s*\}" % (re.escape(vid), re.escape(label)))
            new_block = literal.sub(lambda _: f'{{ id: "{vid}", label: "{label}", prompt: {text} }}', new_block, count=1)
        if new_block != block:
            if check:
                stale.append(rel)
            else:
                open(meta, "w", encoding="utf8").write(source.replace(block, new_block, 1))
                changed += 1
    if check:
        if stale:
            print("theme prompts are out of date for: " + ", ".join(stale) + "\nrun: python3 scripts/theme-prompts.py")
            sys.exit(1)
        print(f"theme prompts: {covered} components match their CSS ({len(skipped)} use the generic fallback)")
    else:
        print(f"theme prompts: {changed} written, {covered} covered, {len(skipped)} left on the fallback: {', '.join(skipped)}")


main("--check" in sys.argv)
