import Link from "next/link";
import { BOOKS } from "@/lib/books";

export const metadata = {
  title: "Books — The Archive",
};

export default function BooksPage() {
  return (
    <main className="container">
      <Link href="/" className="back-link">
        ← The Archive
      </Link>

      <header className="entry-header">
        <h1 className="entry-title">Books</h1>
      </header>

      {BOOKS.length === 0 ? (
        <div className="empty">
          <span className="mono">No books yet</span>
          Recommended books will appear here.
        </div>
      ) : (
        <div className="book-grid">
          {BOOKS.map((book) => (
            <div key={book.slug} className="book-card">
              <h3>{book.title}</h3>
              <p className="book-author mono">{book.author}</p>
              <p className="book-description">{book.description}</p>
              <div className="book-links">
                {book.amazonUrl && (
                  <a
                    href={book.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Amazon
                  </a>
                )}
                {book.bookshopUrl && (
                  <a
                    href={book.bookshopUrl}
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
