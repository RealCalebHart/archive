import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

// Returns null when credentials aren't set yet, so pages can render
// empty/placeholder states instead of crashing.
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(url!, anonKey!);
  }
  return client;
}

// Session-aware client for Server Components, Server Actions, and Route
// Handlers. Reads auth cookies for the current request so `auth.getUser()`
// reflects the signed-in user. Unlike getSupabaseClient(), this must be
// created fresh per request rather than cached, since it's bound to that
// request's cookie jar.
export async function createServerSupabaseClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured) return null;

  const cookieStore = await cookies();

  return createServerClient(url!, anonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Thrown when called from a Server Component during render,
          // where cookies can't be set. proxy.ts refreshes the session
          // cookie on navigation instead, so this is safe to ignore.
        }
      },
    },
  });
}
