import Link from "next/link";
import { formatDate, formatEntryNumber } from "@/lib/format";
import type { Entry } from "@/lib/types";
import SaveButton from "./SaveButton";

export default function EntryCard({
  entry,
  signedIn,
  saved,
  onUnsave,
}: {
  entry: Entry;
  signedIn: boolean;
  saved: boolean;
  onUnsave?: () => void;
}) {
  return (
    <div className="entry-card">
      <Link href={`/${entry.slug}`} className="entry-card-link">
        <div className="row-meta">
          {entry.entry_number != null && (
            <span>No. {formatEntryNumber(entry.entry_number)}</span>
          )}
          <span>{formatDate(entry.published_at)}</span>
        </div>
        <h3>{entry.title}</h3>
      </Link>
      <SaveButton
        entryId={entry.id}
        slug={entry.slug}
        signedIn={signedIn}
        initialSaved={saved}
        variant="card"
        onUnsave={onUnsave}
      />
    </div>
  );
}
