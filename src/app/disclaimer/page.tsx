import Link from "next/link";

export const metadata = {
  title: "Disclaimer — The Archive",
};

export default function DisclaimerPage() {
  return (
    <main className="container">
      <Link href="/" className="back-link">
        ← The Archive
      </Link>

      <header className="entry-header">
        <h1 className="entry-title">Disclaimer</h1>
      </header>

      <div className="prose">
        <p>
          The content published on The Archive reflects personal opinions and
          research at the time of writing. It is provided for informational
          and educational purposes only and should not be taken as
          professional, financial, legal, or medical advice.
        </p>
        <p>
          Every effort is made to keep information accurate and up to date,
          but no representations or warranties are made about the
          completeness, reliability, or accuracy of any entry. Any action you
          take based on what you read here is strictly at your own risk.
        </p>
        <p>
          Entries may link to or embed third-party content, including
          YouTube videos and external sources. We aren&apos;t responsible for
          the content, accuracy, or practices of any third-party sites linked
          from here.
        </p>
      </div>
    </main>
  );
}
