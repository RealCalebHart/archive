import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getEntryBySlug, getVisibleComments } from "@/lib/queries";
import { youtubeEmbedUrl } from "@/lib/youtube";
import { formatDate } from "@/lib/format";
import CommentForm from "./CommentForm";

export const dynamic = "force-dynamic";

export default async function EntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getEntryBySlug(slug);

  if (!entry) notFound();

  const comments = await getVisibleComments(entry.id);
  const embedUrl = youtubeEmbedUrl(entry.youtube_url);

  return (
    <main className="container">
      <Link href="/" className="back-link">
        ← The Archive
      </Link>

      <header className="entry-header">
        <div className="row-meta mono">
          {entry.entry_number != null && <span>No. {entry.entry_number}</span>}
          {entry.published_at && <span>{formatDate(entry.published_at)}</span>}
        </div>
        <h1 className="entry-title">{entry.title}</h1>
      </header>

      {embedUrl && (
        <div className="video-wrap">
          <iframe
            src={embedUrl}
            title={entry.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )}

      {entry.pdf_url && (
        <a
          className="pdf-link"
          href={entry.pdf_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Download PDF
        </a>
      )}

      {entry.body && (
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {entry.body}
          </ReactMarkdown>
        </div>
      )}

      {entry.sources && entry.sources.length > 0 && (
        <section className="sources">
          <h2 className="mono">Sources</h2>
          <ol>
            {entry.sources.map((source, i) => (
              <li key={i}>{source}</li>
            ))}
          </ol>
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

        <CommentForm entryId={entry.id} slug={entry.slug} />
      </section>
    </main>
  );
}
