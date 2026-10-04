# Regenerates index.ts and demos.tsx from ORDER. Run: python3 src/registry/gen.py
import os, re
here = os.path.dirname(os.path.abspath(__file__))
ORDER = [l.strip() for l in open(os.path.join(here, "order.txt")) if l.strip() and not l.startswith("#")]
def camel(s):
    p = s.split("-"); return p[0] + "".join(x.title() for x in p[1:])
imports, names, loaders = [], [], []
for path in ORDER:
    slug = path.split("/")[1]
    imports.append(f'import {{ meta as {camel(slug)} }} from "./{path}/meta";')
    names.append(camel(slug))
    loaders.append(f'  "{slug}": () => import("./{path}/demo"),')
idx = open(os.path.join(here, "index.ts")).read()
idx = re.sub(r"(?s)^.*?/\*\* Curated order.*?\];\n",
  'import type { Category, ComponentMeta } from "./types";\n' + "\n".join(imports) +
  "\n\n/** Curated order — registry sequence from order.txt. Category views use this order; All round-robins it. */\nexport const registry: ComponentMeta[] = [\n" +
  "".join(f"  {n},\n" for n in names) + "];\n", idx)
open(os.path.join(here, "index.ts"), "w").write(idx)
d = open(os.path.join(here, "demos.tsx")).read()
d = re.sub(r"(?s)const loaders: Record<string, Loader> = \{.*?\n\};", "const loaders: Record<string, Loader> = {\n" + "\n".join(loaders) + "\n};", d)
open(os.path.join(here, "demos.tsx"), "w").write(d)
print(len(ORDER), "components")
