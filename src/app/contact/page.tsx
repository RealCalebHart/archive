import Link from "next/link";

export const metadata = {
  title: "Contact — The Archive",
};

export default function ContactPage() {
  return (
    <main className="container">
      <Link href="/" className="back-link">
        ← The Archive
      </Link>

      <header className="entry-header">
        <h1 className="entry-title">Contact</h1>
      </header>

      <div className="prose">
        <p>
          Questions, feedback, or anything else — reach out at{" "}
          <a href="mailto:contact@systeminfinity.llc">
            contact@systeminfinity.llc
          </a>
          .
        </p>
      </div>
    </main>
  );
}
