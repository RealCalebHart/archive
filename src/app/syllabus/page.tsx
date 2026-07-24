import Link from "next/link";
import { buildSyllabusTree, getSyllabusSections } from "@/lib/syllabus";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Syllabus — The Archive",
};

export default async function SyllabusPage() {
  const sections = await getSyllabusSections();
  const topLevel = buildSyllabusTree(sections);

  return (
    <main className="container">
      <Link href="/" className="back-link">
        ← The Archive
      </Link>

      <header className="entry-header">
        <h1 className="entry-title">Syllabus</h1>
      </header>

      {topLevel.length === 0 ? (
        <div className="empty">
          <span className="mono">No sections yet</span>
          Syllabus sections will appear here.
        </div>
      ) : (
        <div className="syllabus-toc">
          {topLevel.map((section) => (
            <Link
              key={section.slug}
              href={`/syllabus/${section.slug}`}
              className="syllabus-toc-item"
            >
              <h3>{section.title}</h3>
              {section.summary && <p>{section.summary}</p>}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
