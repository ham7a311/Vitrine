"use client";

import { useEffect, useState } from "react";
import type { SourceFile, SourceFileName } from "@/lib/source";
import { CodeViewer } from "./CodeViewer";

/* Source a visitor has opened stays loaded for the rest of the visit, across tabs and pages. */
const loaded = new Map<string, SourceFile[]>();
const pending = new Map<string, Promise<SourceFile[]>>();

/** The page is older than the site: its source file was replaced by a newer deploy (or a dev edit). */
class SourceGone extends Error {}

function load(url: string) {
  let request = pending.get(url);
  if (!request) {
    request = fetch(url)
      .then((res) => {
        if (res.status === 404) throw new SourceGone(url);
        if (!res.ok) throw new Error(`Source request failed: ${res.status}`);
        return res.json() as Promise<{ files: SourceFile[] }>;
      })
      .then(({ files }) => {
        loaded.set(url, files);
        return files;
      })
      .finally(() => pending.delete(url));
    pending.set(url, request);
  }
  return request;
}

/**
 * The Code tab. The page carries only the file names and the URL of the component's source, which is
 * highlighted once per build and fetched the first time this tab opens.
 */
export function SourceViewer({ url, files }: { url: string; files: SourceFileName[] }) {
  const [source, setSource] = useState(() => loaded.get(url));
  const [failed, setFailed] = useState<false | "retry" | "reload">(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const ready = loaded.get(url);
    setSource(ready);
    setFailed(false);
    if (ready) return;
    let live = true;
    load(url).then(
      (files) => live && setSource(files),
      // A missing file will stay missing, so that asks for a reload rather than another try.
      (error) => live && setFailed(error instanceof SourceGone ? "reload" : "retry"),
    );
    return () => {
      live = false;
    };
  }, [url, attempt]);

  return <CodeViewer files={files} source={source} failed={failed} onRetry={() => setAttempt((a) => a + 1)} />;
}
