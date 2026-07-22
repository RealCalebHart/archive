"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toggleSavedEntry } from "@/lib/saved-actions";

export default function SaveButton({
  entryId,
  slug,
  signedIn,
  initialSaved,
  variant = "card",
  onUnsave,
}: {
  entryId: string;
  slug: string;
  signedIn: boolean;
  initialSaved: boolean;
  variant?: "card" | "inline";
  onUnsave?: () => void;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const className = `save-button save-button--${variant}`;

  if (!signedIn) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(`/${slug}`)}`}
        className={className}
        aria-label="Sign in to save this entry"
        title="Sign in to save this entry"
        onClick={(e) => e.stopPropagation()}
      >
        <BookmarkIcon filled={false} />
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={`${className}${saved ? " is-saved" : ""}`}
      aria-label={saved ? "Remove from saved entries" : "Save entry"}
      aria-pressed={saved}
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const previous = saved;
        const next = !previous;
        setSaved(next);
        if (!next) onUnsave?.();
        startTransition(async () => {
          const result = await toggleSavedEntry(entryId, slug);
          if (!result.ok) setSaved(previous);
        });
      }}
    >
      <BookmarkIcon filled={saved} />
    </button>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
