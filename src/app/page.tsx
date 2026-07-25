import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "./CountdownTimer";
import EntryCard from "./EntryCard";
import VideoEmbed from "./VideoEmbed";
import {
  HOMEPAGE_VIDEO_URL,
  getCategories,
  getPublishedEntries,
  getSavedEntryIds,
  getStats,
} from "@/lib/queries";
import { SUBSTACK_SUBSCRIBE_URL } from "@/lib/constants";
import { getSessionUser } from "@/lib/auth";
import { youtubeVideoId } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [entries, stats, categories, user] = await Promise.all([
    getPublishedEntries(),
    getStats(),
    getCategories(),
    getSessionUser(),
  ]);
  const savedIds = user ? await getSavedEntryIds(user.id) : new Set<string>();

  const heroVideoId = youtubeVideoId(HOMEPAGE_VIDEO_URL);

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
          {heroVideoId ? (
            <VideoEmbed url={HOMEPAGE_VIDEO_URL} title="The Archive" />
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

          <a
            href={SUBSTACK_SUBSCRIBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="newsletter-card"
          >
            <span className="newsletter-card-icon" aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </span>

            <span className="newsletter-card-text">
              <span className="newsletter-card-title">
                Subscribe to the Newsletter
              </span>
              <span className="newsletter-card-desc">
                Get only the best lessons, condensed into one short email,
                straight to your inbox.
              </span>
            </span>

            <svg
              className="newsletter-card-arrow"
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
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
