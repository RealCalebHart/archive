import Link from "next/link";
import { getEntriesByCategory } from "@/lib/queries";
import { formatDate, formatEntryNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const entries = await getEntriesByCategory(category);

  return (
    <main className="container">
      <Link href="/" className="back-link">
        ← The Archive
      </Link>

      <header className="entry-header">
        <div className="row-meta mono">
          <span>Category</span>
        </div>
        <h1 className="entry-title">{category}</h1>
      </header>

      {entries.length === 0 ? (
        <div className="empty">
          <span className="mono">No entries yet</span>
          Nothing has been tagged under this category yet.
        </div>
      ) : (
        <div className="entry-grid">
          {entries.map((entry) => (
            <Link key={entry.id} href={`/${entry.slug}`} className="entry-card">
              <div className="row-meta">
                {entry.entry_number != null && (
                  <span>No. {formatEntryNumber(entry.entry_number)}</span>
                )}
                <span>{formatDate(entry.published_at)}</span>
              </div>
              <h3>{entry.title}</h3>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
