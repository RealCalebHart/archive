import Link from "next/link";
import { redirect } from "next/navigation";
import { getSavedEntries } from "@/lib/queries";
import { getSessionUser } from "@/lib/auth";
import SavedEntryCard from "./SavedEntryCard";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const entries = await getSavedEntries(user.id);

  return (
    <main className="container">
      <Link href="/" className="back-link">
        ← The Archive
      </Link>

      <header className="entry-header">
        <h1 className="entry-title">Saved</h1>
      </header>

      {entries.length === 0 ? (
        <div className="empty">
          <span className="mono">No saved entries yet</span>
          Entries you save will show up here.
        </div>
      ) : (
        <div className="entry-grid">
          {entries.map((entry) => (
            <SavedEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </main>
  );
}
