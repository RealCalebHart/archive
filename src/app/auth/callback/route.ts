import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase";
import { NEXT_REDIRECT_COOKIE, safeNextPath } from "@/lib/auth";

// Handles the redirect back from both magic-link emails and Google OAuth —
// both flows land here with a `code` query param to exchange for a session.
export async function GET(request: Request) {
  const { origin: requestOrigin, searchParams } = new URL(request.url);
  // Same reasoning as getOrigin() in auth-actions.ts: this app is
  // reverse-proxied under calebhart.com/archive, so request.url can reflect
  // this project's own Vercel domain instead of calebhart.com. Redirecting
  // to that raw domain is a real cross-origin redirect the browser follows
  // literally, breaking out of the proxy — so prefer the explicit site URL.
  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? requestOrigin).replace(/\/+$/, "");
  const code = searchParams.get("code");
  const cookieStore = await cookies();
  // Prefer the `next` query param, but fall back to the cookie set before
  // the redirect started — Supabase drops redirectTo's query string if the
  // exact URL (with `?next=...`) isn't in the project's Redirect URLs allow
  // list, in which case this query param never makes it back to us.
  const next =
    safeNextPath(searchParams.get("next")) ??
    safeNextPath(cookieStore.get(NEXT_REDIRECT_COOKIE)?.value);

  if (code) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const response = NextResponse.redirect(`${origin}/archive${next ?? "/"}`);
        response.cookies.delete(NEXT_REDIRECT_COOKIE);
        return response;
      }
      console.error("Failed to exchange code for session:", error.message);
    }
  }

  const response = NextResponse.redirect(`${origin}/archive/login?error=auth`);
  response.cookies.delete(NEXT_REDIRECT_COOKIE);
  return response;
}
