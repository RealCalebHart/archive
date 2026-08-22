import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getBookBySlug, getEntriesReferencingBook } from "@/lib/queries";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  return { title: book ? `${book.title} — The Archive` : "Library — The Archive" };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book) notFound();

  const foundIn = await getEntriesReferencingBook(book.id);

  return (
    <main className="container">
      <Link href="/library" className="back-link">
        ← Library
      </Link>

      <div className="book-detail">
        <div className="book-detail-media">
          {book.image_url && (
            <div className="book-detail-cover">
              <Image
                src={book.image_url}
                alt={`Cover of ${book.title}`}
                fill
                unoptimized
                sizes="(max-width: 720px) 60vw, 280px"
              />
            </div>
          )}
        </div>

        <div className="book-detail-info">
          <header className="entry-header">
            <h1 className="entry-title">{book.title}</h1>
            <p className="book-author">{book.author}</p>
          </header>

          <div className="book-links">
            {book.amazon_url && (
              <a href={book.amazon_url} target="_blank" rel="noopener noreferrer">
                Amazon
              </a>
            )}
            {book.bookshop_url && (
              <a href={book.bookshop_url} target="_blank" rel="noopener noreferrer">
                Bookshop.org
              </a>
            )}
          </div>

          {book.description && <p className="book-description">{book.description}</p>}

          {book.long_description && (
            <div className="prose book-review">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {book.long_description}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {book.takeaways && (
        <section className="takeaways">
          <h2 className="mono">Takeaways</h2>
          <div className="prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{book.takeaways}</ReactMarkdown>
          </div>
        </section>
      )}

      {foundIn.length > 0 && (
        <section className="found-in">
          <h2 className="mono">Found In</h2>
          <ul>
            {foundIn.map((entry) => (
              <li key={entry.id}>
                <Link href={`/${entry.slug}`}>{entry.title}</Link>
                {entry.published_at && (
                  <span className="mono found-in-date">
                    {formatDate(entry.published_at)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
