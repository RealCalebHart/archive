import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — The Archive",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container">
      <Link href="/" className="back-link">
        ← The Archive
      </Link>

      <header className="entry-header">
        <h1 className="entry-title">Privacy Policy</h1>
      </header>

      <div className="prose">
        <h2>What we collect</h2>
        <p>
          The only personal information this site collects is what you
          submit yourself: your name and comment text, if you choose to
          leave a comment on an entry. There is no account system, no email
          collection, and no password required to comment.
        </p>

        <h2>How it&apos;s stored</h2>
        <p>
          Comments are stored in our database (hosted with Supabase) and
          associated with the entry you commented on. Submitted comments are
          reviewed before appearing publicly; we may hide or remove any
          comment at our discretion.
        </p>

        <h2>Third-party content</h2>
        <p>
          Entries may embed YouTube videos. When a video is loaded, YouTube
          (Google) may set its own cookies and collect data according to its
          own privacy policy, independent of this site.
        </p>

        <h2>What we don&apos;t do</h2>
        <p>
          We don&apos;t sell your information, run advertising trackers, or
          share comment data with third parties beyond what&apos;s needed to
          operate the site.
        </p>

        <h2>Questions</h2>
        <p>
          If you have questions about this policy, reach out via the{" "}
          <Link href="/contact">contact page</Link>.
        </p>
      </div>
    </main>
  );
}
