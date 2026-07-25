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
          Questions, feedback, or anything else? DM me on{" "}
          <a
            href="https://www.instagram.com/calebthart/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>{" "}
          or send me an email at{" "}
          <a href="mailto:cth@calebhart.com">cth@calebhart.com</a>.
        </p>
      </div>
    </main>
  );
}
