import Link from "next/link";

export const metadata = {
  title: "About — The Archive",
  description:
    "The Archive is a free, source-cited series translating a real business education into short lessons.",
};

export default function AboutPage() {
  return (
    <main className="about-container">
      <Link href="/" className="back-link">
        ← The Archive
      </Link>

      <header className="about-header">
        <p className="about-eyebrow">About</p>
        <h1>The Archive</h1>
        <p className="about-intro">
          The Archive is a free, source-cited series translating a real
          business education into short lessons — courses, proven operators,
          and real experience, always with the source cited.
        </p>
      </header>

      <section>
        <h2>What this is</h2>
        <p>
          I&apos;m a business student documenting what I&apos;m actually
          learning — in class, from books, and from real work — and turning
          it into short, practical lessons. Not a guru, not a course. A
          student in public, showing the work as it happens.
        </p>
      </section>

      <section>
        <h2>How it works</h2>
        <p>
          Every entry in the Archive cites where the knowledge came from.
          Nothing here is presented as original insight — it&apos;s real
          information from real sources, made accessible and organized so
          it&apos;s actually useful.
        </p>
      </section>

      <section>
        <h2>Signing in</h2>
        <p>
          You can read every entry in the Archive without an account.
          Signing in with email or Google unlocks two things: leaving a
          comment (sources, corrections, and related resources — not just
          reactions), and saving entries to come back to later.
        </p>
      </section>
    </main>
  );
}
