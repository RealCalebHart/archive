"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { CategoryPill } from "@/lib/syllabus";

const TRANSITION_MS = 520;

export default function CategoryGrid({
  categories,
}: {
  categories: CategoryPill[];
}) {
  const router = useRouter();
  const [burst, setBurst] = useState<{ x: number; y: number } | null>(null);
  const navigating = useRef(false);

  function handleClick(e: React.MouseEvent, slug: string) {
    e.preventDefault();
    if (navigating.current) return;
    navigating.current = true;

    const href = `/category/${encodeURIComponent(slug)}`;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      router.push(href);
      return;
    }

    setBurst({ x: e.clientX, y: e.clientY });
    window.setTimeout(() => router.push(href), TRANSITION_MS);
  }

  return (
    <>
      <div className="category-grid">
        {categories.map((category) => (
          <a
            key={category.slug}
            href={`/category/${encodeURIComponent(category.slug)}`}
            onClick={(e) => handleClick(e, category.slug)}
            className={
              category.entryCount === 0
                ? "category-card category-card--empty"
                : "category-card"
            }
          >
            <span className="category-card-icon" aria-hidden="true">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                <path d="m3 12 9 5 9-5" />
                <path d="m3 17 9 5 9-5" />
              </svg>
            </span>
            <span className="category-card-title">{category.title}</span>
            <span className="category-card-count mono">
              {category.entryCount}{" "}
              {category.entryCount === 1 ? "entry" : "entries"}
            </span>
          </a>
        ))}
      </div>

      {burst && (
        <span
          className="category-burst"
          style={
            {
              "--burst-x": `${burst.x}px`,
              "--burst-y": `${burst.y}px`,
            } as React.CSSProperties
          }
          aria-hidden="true"
        />
      )}
    </>
  );
}
