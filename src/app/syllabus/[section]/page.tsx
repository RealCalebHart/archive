import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import EntryCard from "@/app/EntryCard";
import CommentForm from "@/app/CommentForm";
import VideoEmbed from "@/app/VideoEmbed";
import SyllabusShell from "@/app/syllabus/SyllabusShell";
import {
  findSyllabusSection,
  getSyllabusAncestors,
  getSyllabusBacklinks,
  getSyllabusChildren,
  getSyllabusRootSlug,
  getSyllabusSections,
} from "@/lib/syllabus";
import {
  getEntriesByCategory,
  getSavedEntryIds,
  getVisibleSyllabusComments,
} from "@/lib/queries";
import { getSessionUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { youtubeVideoId } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export default async function SyllabusSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: slug } = await params;
  const sections = await getSyllabusSections();
  const section = findSyllabusSection(sections, slug);

  if (!section) notFound();

  const ancestors = getSyllabusAncestors(sections, section);
  const parent = ancestors[ancestors.length - 1];
  const children = getSyllabusChildren(sections, section.id);

  const linksTo = (section.related_slugs ?? [])
    .map((related) => findSyllabusSection(sections, related))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const linkedFrom = getSyllabusBacklinks(sections, slug);

  const rootSlug = getSyllabusRootSlug(sections, section);
  const [relatedEntries, comments, user] = await Promise.all([
    getEntriesByCategory(rootSlug),
    getVisibleSyllabusComments(section.id),
    getSessionUser(),
  ]);
  const savedIds = user
    ? await getSavedEntryIds(user.id)
    : new Set<string>();

  const videoId = youtubeVideoId(section.youtube_url);
  const path = `/syllabus/${section.slug}`;

  return (
    <SyllabusShell>
      <Link href={parent ? `/syllabus/${parent.slug}` : "/syllabus"} className="back-link">
        ← {parent ? parent.title : "Syllabus"}
      </Link>

      <header className="entry-header">
        <h1 className="entry-title">{section.title}</h1>
      </header>

      {videoId && (
        <div className="video-wrap">
          <VideoEmbed url={section.youtube_url} title={section.title} />
        </div>
      )}

      {section.body && (
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {section.body}
          </ReactMarkdown>
        </div>
      )}

      {children.length > 0 && (
        <section className="syllabus-subsections">
          <h2 className="mono">Subsections</h2>
          <div className="syllabus-toc">
            {children.map((child) => (
              <Link
                key={child.slug}
                href={`/syllabus/${child.slug}`}
                className="syllabus-toc-item"
              >
                <h3>{child.title}</h3>
                {child.summary && <p>{child.summary}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {relatedEntries.length > 0 && (
        <section className="syllabus-entries">
          <h2 className="mono">Entries</h2>
          <div className="entry-grid">
            {relatedEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                signedIn={Boolean(user)}
                saved={savedIds.has(entry.id)}
                hrefQuery="?from=syllabus"
              />
            ))}
          </div>
        </section>
      )}

      {(linksTo.length > 0 || linkedFrom.length > 0) && (
        <section className="syllabus-links">
          {linksTo.length > 0 && (
            <div className="syllabus-links-group">
              <h2 className="mono">Links to</h2>
              <ul>
                {linksTo.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/syllabus/${s.slug}`}>{s.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {linkedFrom.length > 0 && (
            <div className="syllabus-links-group">
              <h2 className="mono">Linked from</h2>
              <ul>
                {linkedFrom.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/syllabus/${s.slug}`}>{s.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <section className="comments">
        <h2 className="mono">
          Comments{comments.length > 0 ? ` (${comments.length})` : ""}
        </h2>

        {comments.length === 0 ? (
          <p className="comment-body">No comments yet. Be the first.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="comment">
              <div className="comment-meta">
                <span className="comment-name">{c.name}</span>
                <span className="comment-time">{formatDate(c.created_at)}</span>
              </div>
              <p className="comment-body">{c.comment}</p>
            </div>
          ))
        )}

        <CommentForm syllabusSectionId={section.id} path={path} user={user} />
      </section>
    </SyllabusShell>
  );
}
