"use client";

import { useState } from "react";
import EntryCard from "@/app/EntryCard";
import type { Entry } from "@/lib/types";

export default function SavedEntryCard({ entry }: { entry: Entry }) {
  const [removed, setRemoved] = useState(false);
  if (removed) return null;

  return (
    <EntryCard
      entry={entry}
      signedIn
      saved
      onUnsave={() => setRemoved(true)}
    />
  );
}
