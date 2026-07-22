import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getBacklinks, getSyllabusSection, SYLLABUS_SECTIONS } from "@/lib/syllabus";

export function generateStaticParams() {
  return SYLLABUS_SECTIONS.map((section) => ({ section: section.slug }));
}

export default async function SyllabusSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: slug } = await params;
  const section = getSyllabusSection(slug);

  if (!section) notFound();

  const linksTo = section.relatedSlugs
    .map((related) => getSyllabusSection(related))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const linkedFrom = getBacklinks(slug);

  return (
    <main className="container">
      <Link href="/syllabus" className="back-link">
        ← Syllabus
      </Link>

      <header className="entry-header">
        <h1 className="entry-title">{section.title}</h1>
      </header>

      <div className="prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {section.body}
        </ReactMarkdown>
      </div>

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
    </main>
  );
}
