import { createServerSupabaseClient } from "./supabase";

export type SessionUser = {
  id: string;
  displayName: string;
};

export function displayNameFor(user: {
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): string {
  const metadata = user.user_metadata ?? {};
  const name = metadata.full_name ?? metadata.name;
  if (typeof name === "string" && name.trim()) return name.trim();
  return user.email ?? "Anonymous";
}

// Only allow same-app relative paths as post-sign-in redirect targets, so a
// crafted `?next=` can't send someone off-site (open redirect).
export function safeNextPath(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  if (value.includes("://")) return null;
  return value;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  return { id: data.user.id, displayName: displayNameFor(data.user) };
}
