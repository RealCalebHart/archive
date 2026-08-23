import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser, safeNextPath } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: rawNext } = await searchParams;
  const next = safeNextPath(rawNext);

  const user = await getSessionUser();
  if (user) redirect(next ?? "/");

  return (
    <main className="container">
      <Link href="/" className="back-link">
        ← The Archive
      </Link>

      <header className="entry-header">
        <h1 className="entry-title">Sign in</h1>
      </header>

      <LoginForm next={next} />
    </main>
  );
}
