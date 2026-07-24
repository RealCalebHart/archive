"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { SyllabusNavNode } from "@/lib/syllabus";

type SidebarEntry = { slug: string; title: string };

function containsSlug(node: SyllabusNavNode, slug: string): boolean {
  if (node.slug === slug) return true;
  return node.children.some((child) => containsSlug(child, slug));
}

function SectionNode({
  node,
  activeSlug,
  activeEntrySlug,
  entries,
  depth,
}: {
  node: SyllabusNavNode;
  activeSlug: string | null;
  activeEntrySlug: string | null;
  entries: SidebarEntry[];
  depth: number;
}) {
  const isActive = node.slug === activeSlug;
  const containsActiveSection = activeSlug ? containsSlug(node, activeSlug) : false;
  const containsActiveEntry = activeEntrySlug
    ? entries.some((entry) => entry.slug === activeEntrySlug)
    : false;
  const containsActive = containsActiveSection || containsActiveEntry;
  // Manual toggle state, ORed with containsActive so the branch holding the
  // current page is always expanded without needing to sync state in an effect.
  const [manuallyOpen, setManuallyOpen] = useState(false);
  const open = manuallyOpen || containsActive;

  const expandable = node.children.length > 0 || entries.length > 0;

  return (
    <li className="syllabus-nav-item">
      <div className="syllabus-nav-row" style={{ paddingLeft: `${depth * 0.9}rem` }}>
        {expandable ? (
          <button
            type="button"
            className={`syllabus-nav-toggle${open ? " is-open" : ""}`}
            aria-label={open ? "Collapse section" : "Expand section"}
            aria-expanded={open}
            onClick={() => setManuallyOpen((o) => !o)}
          >
            <svg
              viewBox="0 0 24 24"
              width="10"
              height="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        ) : (
          <span className="syllabus-nav-toggle-spacer" aria-hidden="true" />
        )}
        <Link
          href={`/syllabus/${node.slug}`}
          className={`syllabus-nav-link${isActive ? " is-active" : ""}`}
        >
          {node.title}
        </Link>
      </div>

      {expandable && open && (
        <ul className="syllabus-nav-children">
          {node.children.map((child) => (
            <SectionNode
              key={child.slug}
              node={child}
              activeSlug={activeSlug}
              activeEntrySlug={activeEntrySlug}
              entries={[]}
              depth={depth + 1}
            />
          ))}
          {entries.map((entry) => (
            <li key={entry.slug} className="syllabus-nav-entry">
              <Link
                href={`/${entry.slug}?from=syllabus`}
                className={`syllabus-nav-link syllabus-nav-link--entry${
                  entry.slug === activeEntrySlug ? " is-active" : ""
                }`}
                style={{ paddingLeft: `${(depth + 1) * 0.9}rem` }}
              >
                {entry.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function SyllabusSidebar({
  tree,
  entriesByTopLevelSlug,
}: {
  tree: SyllabusNavNode[];
  entriesByTopLevelSlug: Record<string, SidebarEntry[]>;
}) {
  const pathname = usePathname();
  const sectionMatch = pathname.match(/^\/syllabus\/([^/]+)/);
  const activeSlug = sectionMatch ? decodeURIComponent(sectionMatch[1]) : null;

  // Any other single-segment path (e.g. an entry opened via ?from=syllabus)
  // is a candidate entry slug — harmless to compute even for unrelated
  // single-segment routes like /books, since it just won't match anything
  // in entriesByTopLevelSlug.
  const entryMatch =
    !activeSlug && pathname !== "/syllabus"
      ? pathname.match(/^\/([^/]+)$/)
      : null;
  const activeEntrySlug = entryMatch ? decodeURIComponent(entryMatch[1]) : null;

  return (
    <nav className="syllabus-sidebar" aria-label="Syllabus navigation">
      <Link href="/syllabus" className="syllabus-nav-root mono">
        Syllabus
      </Link>
      <ul className="syllabus-nav-tree">
        {tree.map((node) => (
          <SectionNode
            key={node.slug}
            node={node}
            activeSlug={activeSlug}
            activeEntrySlug={activeEntrySlug}
            entries={entriesByTopLevelSlug[node.slug] ?? []}
            depth={0}
          />
        ))}
      </ul>
    </nav>
  );
}
