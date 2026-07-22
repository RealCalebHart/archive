import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { safeNextPath } from "@/lib/auth";

// Handles the redirect back from both magic-link emails and Google OAuth —
// both flows land here with a `code` query param to exchange for a session.
export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  if (code) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${origin}/archive${next ?? "/"}`);
    }
  }

  return NextResponse.redirect(`${origin}/archive/login?error=auth`);
}
