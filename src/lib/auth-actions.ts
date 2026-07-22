"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "./supabase";
import { NEXT_REDIRECT_COOKIE, safeNextPath } from "./auth";

// Matches next.config.ts's basePath — Next only applies basePath
// automatically to Link/router navigation, not to absolute URLs we
// build ourselves (see Nav.tsx's hardcoded "/archive/..." image src).
const CALLBACK_PATH = "/archive/auth/callback";

async function rememberNext(next: string | null) {
  if (!next) return;
  const cookieStore = await cookies();
  cookieStore.set(NEXT_REDIRECT_COOKIE, next, {
    path: "/",
    maxAge: 60 * 10,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export type MagicLinkState = {
  status: "idle" | "success" | "error";
  message?: string;
};

async function getOrigin(): Promise<string> {
  // This app runs as its own Vercel project, reverse-proxied under
  // calebhart.com/archive by a rewrite rule that lives in a different repo.
  // Depending on how that proxy forwards headers, request/x-forwarded-*
  // headers can reflect this project's own Vercel domain rather than
  // calebhart.com — which would build an OAuth callback URL that never
  // matches Supabase's Redirect URLs allow list. An explicit site URL sidesteps
  // that entirely, so it takes priority when set.
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredSiteUrl) return configuredSiteUrl.replace(/\/+$/, "");

  const headerList = await headers();
  const origin = headerList.get("origin");
  if (origin) return origin;

  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

function callbackUrl(origin: string, next: string | null): string {
  const url = `${origin}${CALLBACK_PATH}`;
  return next ? `${url}?next=${encodeURIComponent(next)}` : url;
}

export async function requestMagicLink(
  _prev: MagicLinkState,
  formData: FormData,
): Promise<MagicLinkState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { status: "error", message: "Enter your email." };

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { status: "error", message: "Sign-in isn't available right now." };
  }

  const origin = await getOrigin();
  const next = safeNextPath(String(formData.get("next") ?? ""));
  await rememberNext(next);
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: callbackUrl(origin, next) },
  });

  if (error) {
    console.error("Failed to send magic link:", error.message);
    return { status: "error", message: "Something went wrong. Try again." };
  }

  return {
    status: "success",
    message: "Check your email for a sign-in link.",
  };
}

export async function signInWithGoogle(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/login?error=unavailable");

  const origin = await getOrigin();
  const next = safeNextPath(String(formData.get("next") ?? ""));
  await rememberNext(next);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl(origin, next) },
  });

  if (error || !data.url) {
    console.error("Failed to start Google sign-in:", error?.message);
    redirect("/login?error=oauth");
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}
