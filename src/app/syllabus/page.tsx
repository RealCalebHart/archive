import Link from "next/link";
import { SYLLABUS_SECTIONS } from "@/lib/syllabus";

export const metadata = {
  title: "Syllabus — The Archive",
};

export default function SyllabusPage() {
  return (
    <main className="container">
      <Link href="/" className="back-link">
        ← The Archive
      </Link>

      <header className="entry-header">
        <h1 className="entry-title">Syllabus</h1>
      </header>

      {SYLLABUS_SECTIONS.length === 0 ? (
        <div className="empty">
          <span className="mono">No sections yet</span>
          Syllabus sections will appear here.
        </div>
      ) : (
        <div className="syllabus-toc">
          {SYLLABUS_SECTIONS.map((section) => (
            <Link
              key={section.slug}
              href={`/syllabus/${section.slug}`}
              className="syllabus-toc-item"
            >
              <h3>{section.title}</h3>
              <p>{section.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
