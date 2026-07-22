import Link from "next/link";

export const metadata = {
  title: "Terms of Use — The Archive",
};

export default function TermsOfUsePage() {
  return (
    <main className="container">
      <Link href="/" className="back-link">
        ← The Archive
      </Link>

      <header className="entry-header">
        <h1 className="entry-title">Terms of Use</h1>
      </header>

      <div className="prose">
        <h2>Acceptance of terms</h2>
        <p>
          By accessing The Archive, you agree to these terms of use. If you
          don&apos;t agree with them, please don&apos;t use the site.
        </p>

        <h2>Content ownership</h2>
        <p>
          All entries, writing, and media published on this site are owned
          by System Infinity, LLC unless otherwise credited. You may share
          links to entries, but reproducing or republishing entire entries
          elsewhere without permission isn&apos;t allowed.
        </p>

        <h2>Comments</h2>
        <p>
          By submitting a comment, you confirm it&apos;s your own words, and
          you grant us permission to display it publicly on the relevant
          entry. We may remove any comment at our discretion, for any
          reason.
        </p>

        <h2>No warranty</h2>
        <p>
          The site and its content are provided &quot;as is,&quot; without
          warranty of any kind. We don&apos;t guarantee the site will be
          available, error-free, or uninterrupted at all times.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          System Infinity, LLC isn&apos;t liable for any damages arising
          from your use of, or inability to use, this site.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          These terms may be updated from time to time. Continued use of the
          site after changes are posted means you accept the revised terms.
        </p>
      </div>
    </main>
  );
}
