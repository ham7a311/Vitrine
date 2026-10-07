#!/usr/bin/env python3
"""Keep the "New" label on the newest components only.

Ranks every component by the commit that first added its meta.ts (searching all refs, so squash
merges don't hide the original date), breaks ties by later position in order.txt, keeps
`isNew: true` on the newest LIMIT and removes it from the rest. Run it after adding components.

    python3 scripts/limit-new.py           # write
    python3 scripts/limit-new.py --check   # report only, exit 1 if anything would change
"""
import re, subprocess, sys
from pathlib import Path

LIMIT = 50
ROOT = Path(__file__).resolve().parent.parent
REG = ROOT / "src" / "registry"
FLAG = re.compile(r'^\s*"?isNew"?\s*:\s*true\s*,?\s*\n', re.M)


def added(entry: str) -> int:
    out = subprocess.run(
        ["git", "log", "--all", "--full-history", "--diff-filter=A", "--format=%ct", "--", f"src/registry/{entry}/meta.ts"],
        cwd=ROOT, capture_output=True, text=True, check=True,
    ).stdout.split()
    # Not committed yet: newest of all.
    return int(out[-1]) if out else 1 << 62


def main() -> int:
    order = [l.strip() for l in (REG / "order.txt").read_text().splitlines() if l.strip() and not l.startswith("#")]
    pos = {e: i for i, e in enumerate(order)}
    ranked = sorted(order, key=lambda e: (added(e), pos[e]), reverse=True)
    keep = set(ranked[:LIMIT])
    check = "--check" in sys.argv
    changed = []
    for entry in order:
        meta = REG / entry / "meta.ts"
        text = meta.read_text()
        has = bool(FLAG.search(text))
        if entry in keep and not has:
            # JSON-style metas quote their keys; follow the file's own style.
            line = '  "isNew": true,\n' if '"slug":' in text else "  isNew: true,\n"
            text = re.sub(r'^(\s*"?variants"?\s*:)', line + r"\1", text, count=1, flags=re.M)
            if not FLAG.search(text):
                text = re.sub(r'^(\s*"?preview"?\s*:)', line + r"\1", text, count=1, flags=re.M)
            changed.append(f"+ {entry}")
        elif entry not in keep and has:
            text = FLAG.sub("", text, count=1)
            changed.append(f"- {entry}")
        else:
            continue
        if not check:
            meta.write_text(text)
    for c in changed:
        print(c)
    print(f"new: {len(keep)} newest kept; {len(changed)} {'would change' if check else 'changed'}")
    return 1 if check and changed else 0


if __name__ == "__main__":
    sys.exit(main())
