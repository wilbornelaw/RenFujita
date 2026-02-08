"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, Camera, Images } from "lucide-react";

type SearchResult = {
  type: "photo" | "album";
  id: string;
  title: string;
  visibility: "PUBLIC" | "PRIVATE";
};

type Props = {
  isAdmin: boolean;
};

export function SearchModal({ isAdmin }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const reduceMotion = useReducedMotion();

  async function runSearch(term: string) {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
    const data = (await response.json()) as { results: SearchResult[] };
    setResults(data.results ?? []);
    setLoading(false);
  }

  const title = useMemo(() => (isAdmin ? "Search all photos and albums" : "Search public photos and albums"), [isAdmin]);

  return (
    <>
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted transition hover:text-white"
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open search"
      >
        <Search className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-start justify-center bg-black/65 p-4 pt-16 backdrop-blur-sm"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? {} : { opacity: 1 }}
            exit={reduceMotion ? {} : { opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#12151d] shadow-2xl"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98, y: 12 }}
              animate={reduceMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? {} : { opacity: 0, scale: 0.98, y: 8 }}
            >
              <div className="border-b border-white/10 p-4">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-accent">{title}</p>
                <input
                  autoFocus
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm"
                  value={query}
                  onChange={(event) => {
                    const next = event.target.value;
                    setQuery(next);
                    void runSearch(next);
                  }}
                  placeholder="Type to search..."
                />
              </div>
              <div className="max-h-[55vh] overflow-auto p-3">
                {loading && <p className="px-2 py-3 text-sm text-muted">Searching...</p>}
                {!loading &&
                  results.map((result) => {
                    const href = result.type === "photo" ? `/photo/${result.id}` : `/album/${result.id}`;
                    const Icon = result.type === "photo" ? Camera : Images;
                    return (
                      <Link
                        key={`${result.type}-${result.id}`}
                        href={href}
                        onClick={() => setOpen(false)}
                        className="mb-1 flex items-center justify-between rounded-xl border border-transparent bg-white/0 px-3 py-2 text-sm transition hover:border-white/10 hover:bg-white/5"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted" />
                          <span>{result.title}</span>
                        </span>
                        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-muted">
                          {result.type}
                          {isAdmin && result.visibility}
                        </span>
                      </Link>
                    );
                  })}
                {!loading && query && results.length === 0 && <p className="px-2 py-3 text-sm text-muted">No matches found.</p>}
              </div>
              <div className="border-t border-white/10 p-3 text-right">
                <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-3 py-1.5 text-xs text-muted hover:text-white">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
