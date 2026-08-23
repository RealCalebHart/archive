import Link from "next/link";
import EntryCard from "@/app/EntryCard";
import { getEntriesByCategory, getSavedEntryIds } from "@/lib/queries";
import { findSyllabusSection, getSyllabusSections } from "@/lib/syllabus";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const [entries, sections, user] = await Promise.all([
    getEntriesByCategory(category),
    getSyllabusSections(),
    getSessionUser(),
  ]);
  const savedIds = user ? await getSavedEntryIds(user.id) : new Set<string>();
  const section = findSyllabusSection(sections, category);
  const title = section?.title ?? category;

  return (
    <main className="container">
      <Link href="/" className="back-link">
        ← The Archive
      </Link>

      <header className="entry-header">
        <div className="row-meta mono">
          <span>Category</span>
        </div>
        <h1 className="entry-title">{title}</h1>
      </header>

      {entries.length === 0 ? (
        <div className="empty">
          <span className="mono">No entries yet</span>
          Nothing has been tagged under this category yet.
        </div>
      ) : (
        <div className="entry-grid">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              signedIn={Boolean(user)}
              saved={savedIds.has(entry.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
