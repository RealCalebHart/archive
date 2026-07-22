import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "./CountdownTimer";
import {
  HOMEPAGE_VIDEO_URL,
  getCategories,
  getPublishedEntries,
  getStats,
} from "@/lib/queries";
import { youtubeEmbedUrl } from "@/lib/youtube";
import { formatDate, formatEntryNumber } from "@/lib/format";
import type { Entry } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [entries, stats, categories] = await Promise.all([
    getPublishedEntries(),
    getStats(),
    getCategories(),
  ]);

  const heroEmbedUrl = youtubeEmbedUrl(HOMEPAGE_VIDEO_URL);

  return (
    <main className="container">
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
            {entries.map((entry: Entry) => (
              <Link
                key={entry.id}
                href={`/${entry.slug}`}
                className="entry-card"
              >
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
