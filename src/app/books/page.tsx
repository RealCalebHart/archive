import Image from "next/image";
import Link from "next/link";
import { getBooks } from "@/lib/queries";

export const metadata = {
  title: "Books — The Archive",
};

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <main className="container">
      <Link href="/" className="back-link">
        ← The Archive
      </Link>

      <header className="entry-header">
        <h1 className="entry-title">Books</h1>
      </header>

      {books.length === 0 ? (
        <div className="empty">
          <span className="mono">No books yet</span>
          Recommended books will appear here.
        </div>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <div key={book.slug} className="book-card">
              {book.image_url && (
                <div className="book-cover">
                  <Image
                    src={book.image_url}
                    alt={`Cover of ${book.title}`}
                    fill
                    unoptimized
                    sizes="(max-width: 520px) 90vw, (max-width: 940px) 45vw, 23vw"
                  />
                </div>
              )}
              <h3>{book.title}</h3>
              <p className="book-author">{book.author}</p>
              <p className="book-description">{book.description}</p>
              <div className="book-links">
                {book.amazon_url && (
                  <a
                    href={book.amazon_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Amazon
                  </a>
                )}
                {book.bookshop_url && (
                  <a
                    href={book.bookshop_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Bookshop.org
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
