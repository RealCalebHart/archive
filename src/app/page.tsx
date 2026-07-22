import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "./CountdownTimer";
import EntryCard from "./EntryCard";
import {
  HOMEPAGE_VIDEO_URL,
  getCategories,
  getPublishedEntries,
  getSavedEntryIds,
  getStats,
} from "@/lib/queries";
import { getSessionUser } from "@/lib/auth";
import { youtubeEmbedUrl } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [entries, stats, categories, user] = await Promise.all([
    getPublishedEntries(),
    getStats(),
    getCategories(),
    getSessionUser(),
  ]);
  const savedIds = user ? await getSavedEntryIds(user.id) : new Set<string>();

  const heroEmbedUrl = youtubeEmbedUrl(HOMEPAGE_VIDEO_URL);

  return (
    <main className="container container--home">
      <h1 className="brand-header">
        <Image
          src="/archive/archive-title.png"
          alt="The Archive"
          width={2637}
          height={273}
          priority
          unoptimized
        />
      </h1>

      <div className="hero-row">
        <div className="hero-video">
          {heroEmbedUrl ? (
            <iframe
              src={heroEmbedUrl}
              title="The Archive"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="hero-video-empty mono">No video set</div>
          )}
        </div>

        <div className="hero-side">
          <CountdownTimer />

          <section className="stats" aria-label="Archive stats">
            <div className="stat">
              <span className="v">{stats.entryCount}</span>
              <span className="k">Entries</span>
            </div>
            <div className="stat">
              <span className="v">{stats.sourceCount}</span>
              <span className="k">Sources cited</span>
            </div>
            <div className="stat">
              <span className="v">{stats.daysRunning}</span>
              <span className="k">Days running</span>
            </div>
          </section>
        </div>
      </div>

      <section className="recent-entries" aria-label="Recent entries">
        <h2 className="section-heading">Recent Entries</h2>

        {entries.length === 0 ? (
          <div className="empty">
            <span className="mono">No entries yet</span>
            Published entries will appear here.
          </div>
        ) : (
          <div className="entry-scroll">
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
      </section>

      <section className="categories" aria-label="Categories">
        <h2 className="section-heading">Categories</h2>

        {categories.length === 0 ? (
          <div className="empty">
            <span className="mono">No categories yet</span>
            Categories will appear here once entries are tagged.
          </div>
        ) : (
          <div className="category-pills">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/category/${encodeURIComponent(category)}`}
                className="category-pill"
              >
                {category}
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
