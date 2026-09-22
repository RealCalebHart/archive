"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { CategoryPill } from "@/lib/syllabus";

// Maps a top-level syllabus slug to its cover image. A category without an
// entry here falls back to a plain text card so newly-added syllabus
// sections don't silently disappear from the homepage while waiting on art.
const COVERS: Record<string, string> = {
  "Foundations-microeconomics": "/archive/category-covers/economics.png",
  "financial-accounting": "/archive/category-covers/financial-accounting.png",
  "business-law": "/archive/category-covers/business-law.png",
  "business-statistics": "/archive/category-covers/business-statistics.png",
};

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
        {categories.map((category) => {
          const cover = COVERS[category.slug];
          return (
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
              {cover ? (
                <span className="category-card-media">
                  <Image
                    src={cover}
                    alt={category.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 280px"
                    className="category-card-img"
                    unoptimized
                  />
                  <span className="category-card-shine" aria-hidden="true" />
                </span>
              ) : (
                <>
                  <span className="category-card-fallback" aria-hidden="true" />
                  <span className="category-card-title">{category.title}</span>
                </>
              )}
            </a>
          );
        })}
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
