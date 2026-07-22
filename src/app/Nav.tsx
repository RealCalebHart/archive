"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { BOOKS } from "@/lib/books";
import { SYLLABUS_SECTIONS } from "@/lib/syllabus";
import type { EntrySearchItem } from "@/lib/queries";

type SearchItem = {
  title: string;
  href: string;
  kind: string;
};

const STATIC_PAGES: SearchItem[] = [
  { title: "Home", href: "/", kind: "Page" },
  { title: "Books", href: "/books", kind: "Page" },
  { title: "Syllabus", href: "/syllabus", kind: "Page" },
  { title: "Contact", href: "/contact", kind: "Page" },
  { title: "Disclaimer", href: "/disclaimer", kind: "Page" },
  { title: "Privacy Policy", href: "/privacy-policy", kind: "Page" },
  { title: "Terms of Use", href: "/terms-of-use", kind: "Page" },
];

export default function Nav({ entries }: { entries: EntrySearchItem[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const otherIndex = useMemo<SearchItem[]>(() => {
    const syllabusItems: SearchItem[] = SYLLABUS_SECTIONS.map((section) => ({
      title: section.title,
      href: `/syllabus/${section.slug}`,
      kind: "Syllabus",
    }));
    const bookItems: SearchItem[] = BOOKS.map((book) => ({
      title: `${book.title} — ${book.author}`,
      href: "/books",
      kind: "Book",
    }));
    return [...STATIC_PAGES, ...syllabusItems, ...bookItems];
  }, []);

  const results = useMemo(() => {
    const raw = query.trim();
    const q = raw.toLowerCase();
    if (!q) return [];

    const isNumericQuery = /^\d+$/.test(raw);
    const numericValue = isNumericQuery ? parseInt(raw, 10) : null;

    const titleOrNumberMatches: SearchItem[] = [];
    const bodyMatches: SearchItem[] = [];

    for (const entry of entries) {
      const titleMatch = entry.title.toLowerCase().includes(q);
      const numberMatch =
        numericValue !== null && entry.entry_number === numericValue;

      if (titleMatch || numberMatch) {
        titleOrNumberMatches.push({
          title: entry.title,
          href: `/${entry.slug}`,
          kind: "Entry",
        });
      } else if (entry.body?.toLowerCase().includes(q)) {
        bodyMatches.push({
          title: entry.title,
          href: `/${entry.slug}`,
          kind: "Entry",
        });
      }
    }

    const otherMatches = otherIndex.filter((item) =>
      item.title.toLowerCase().includes(q),
    );

    return [...titleOrNumberMatches, ...bodyMatches, ...otherMatches].slice(
      0,
      8,
    );
  }, [query, entries, otherIndex]);

  function go(href: string) {
    setQuery("");
    setOpen(false);
    router.push(href);
  }

  return (
    <nav className="site-nav">
      <Link href="/" className="nav-brand">
        <Image
          src="/archive/ch-logo.png"
          alt="Caleb Hart"
          width={400}
          height={400}
          unoptimized
        />
      </Link>

      <div className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/books">Books</Link>
        <Link href="/syllabus">Syllabus</Link>
      </div>

      <div className="nav-search">
        <input
          type="search"
          className="nav-search-input"
          placeholder="Search…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            blurTimeout.current = setTimeout(() => setOpen(false), 150);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results[0]) {
              if (blurTimeout.current) clearTimeout(blurTimeout.current);
              go(results[0].href);
            }
            if (e.key === "Escape") {
              setOpen(false);
            }
          }}
        />

        {open && query.trim() && (
          <div className="nav-search-results">
            {results.length === 0 ? (
              <div className="nav-search-empty mono">No results</div>
            ) : (
              results.map((item) => (
                <button
                  key={item.kind + item.href + item.title}
                  type="button"
                  className="nav-search-result"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (blurTimeout.current) clearTimeout(blurTimeout.current);
                    go(item.href);
                  }}
                >
                  <span className="nav-search-result-title">
                    {item.title}
                  </span>
                  <span className="nav-search-result-kind mono">
                    {item.kind}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
